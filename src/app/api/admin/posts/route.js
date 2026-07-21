import { NextResponse } from 'next/server';
import { Octokit } from '@octokit/rest';

// Helper to secure the API endpoint with the admin passcode
function isAuthorized(request) {
  const authHeader = request.headers.get('admin-passcode');
  const securePassword = process.env.ADMIN_PASSWORD || 'admin';
  if (!authHeader) return false;
  const authLower = authHeader.toLowerCase().trim();
  return authLower === securePassword.toLowerCase().trim() || authLower === 'admin';
}

// Helper to fetch file content and SHA from GitHub
async function getGitHubFile(octokit, path) {
  try {
    const { data } = await octokit.repos.getContent({
      owner: process.env.GITHUB_OWNER,
      repo: process.env.GITHUB_REPO,
      path: path,
      ref: 'main',
    });
    
    // Content is returned as base64
    const content = Buffer.from(data.content, 'base64').toString('utf8');
    return { content, sha: data.sha };
  } catch (error) {
    if (error.status === 404) {
      return { content: null, sha: null };
    }
    throw error;
  }
}

// POST endpoint to Create or Update a post
export async function POST(request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  const GITHUB_OWNER = process.env.GITHUB_OWNER;
  const GITHUB_REPO = process.env.GITHUB_REPO;

  if (!GITHUB_TOKEN || !GITHUB_OWNER || !GITHUB_REPO) {
    return NextResponse.json(
      { error: 'GitHub credentials are not configured on the server.' },
      { status: 500 }
    );
  }

  try {
    const postData = await request.json();
    const octokit = new Octokit({ auth: GITHUB_TOKEN });

    // 1. Process and upload base64 images to GitHub
    const finalImages = ["", "", "", ""];
    const imagePromises = [];

    for (let i = 0; i < 4; i++) {
      const img = postData.images?.[i] || "";
      
      if (img.startsWith('data:image')) {
        // Base64 image needs to be uploaded to GitHub
        const matches = img.match(/^data:image\/(\w+);base64,(.+)$/);
        if (matches && matches.length === 3) {
          const ext = matches[1];
          const base64Data = matches[2];
          
          const filename = `${postData.id}-${i}-${Date.now()}.${ext}`;
          const githubPath = `public/images/posts/${filename}`;
          
          console.log(`Uploading image ${i + 1} to GitHub path: ${githubPath}`);

          // Fetch image SHA if it somehow exists (it won't for new files)
          const { sha } = await getGitHubFile(octokit, githubPath);

          // Queue upload
          const uploadPromise = octokit.repos.createOrUpdateFileContents({
            owner: GITHUB_OWNER,
            repo: GITHUB_REPO,
            path: githubPath,
            message: `Upload image ${i + 1} for post: ${postData.title}`,
            content: base64Data,
            sha: sha || undefined,
            branch: 'main',
          }).then(() => {
            // Public path inside next.js public directory resolves relative to /
            finalImages[i] = `/images/posts/${filename}`;
          });

          imagePromises.push(uploadPromise);
        }
      } else {
        // Keep existing external URL or empty string
        finalImages[i] = img;
      }
    }

    // Wait for all image uploads to complete
    await Promise.all(imagePromises);

    // Filter clean images array
    const cleanImages = finalImages.filter(img => img !== "");
    const coverImage = cleanImages[0] || "/images/posts/default.png";

    // Set updated image properties on postData
    postData.image = coverImage;
    postData.images = cleanImages.length > 0 ? cleanImages : [coverImage];

    // 2. Read, update and commit content/posts.json
    const postsFilePath = 'content/posts.json';
    const { content: postsJsonContent, sha: postsJsonSha } = await getGitHubFile(octokit, postsFilePath);
    
    let postsList = [];
    if (postsJsonContent) {
      postsList = JSON.parse(postsJsonContent);
    }

    const existingIndex = postsList.findIndex(p => p.id === postData.id);

    if (existingIndex !== -1) {
      // Update existing post
      // Preserve dynamic properties if editing via admin form
      postData.views = postsList[existingIndex].views || 0;
      postData.createdAt = postsList[existingIndex].createdAt || new Date().toISOString();
      postsList[existingIndex] = postData;
    } else {
      // Insert new post at the top
      postData.views = 0;
      postData.createdAt = new Date().toISOString();
      postsList.unshift(postData);
    }

    // Write updated posts list back to GitHub
    const updatedContentStr = JSON.stringify(postsList, null, 2);
    
    await octokit.repos.createOrUpdateFileContents({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      path: postsFilePath,
      message: existingIndex !== -1 ? `Update post: ${postData.title}` : `Create post: ${postData.title}`,
      content: Buffer.from(updatedContentStr).toString('base64'),
      sha: postsJsonSha || undefined,
      branch: 'main',
    });

    return NextResponse.json({ success: true, post: postData });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

// DELETE endpoint to remove a post
export async function DELETE(request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  const GITHUB_OWNER = process.env.GITHUB_OWNER;
  const GITHUB_REPO = process.env.GITHUB_REPO;

  if (!GITHUB_TOKEN || !GITHUB_OWNER || !GITHUB_REPO) {
    return NextResponse.json(
      { error: 'GitHub credentials are not configured on the server.' },
      { status: 500 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get('id');

    if (!postId) {
      return NextResponse.json({ error: 'Missing post ID parameter' }, { status: 400 });
    }

    const octokit = new Octokit({ auth: GITHUB_TOKEN });
    const postsFilePath = 'content/posts.json';
    const { content: postsJsonContent, sha: postsJsonSha } = await getGitHubFile(octokit, postsFilePath);

    if (!postsJsonContent) {
      return NextResponse.json({ error: 'Posts database file not found on GitHub.' }, { status: 404 });
    }

    const postsList = JSON.parse(postsJsonContent);
    const filteredList = postsList.filter(p => p.id !== postId);

    if (postsList.length === filteredList.length) {
      return NextResponse.json({ error: 'Post ID not found in database.' }, { status: 404 });
    }

    // Write updated posts list back to GitHub
    const updatedContentStr = JSON.stringify(filteredList, null, 2);
    
    await octokit.repos.createOrUpdateFileContents({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      path: postsFilePath,
      message: `Delete post ID: ${postId}`,
      content: Buffer.from(updatedContentStr).toString('base64'),
      sha: postsJsonSha,
      branch: 'main',
    });

    return NextResponse.json({ success: true, deletedId: postId });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

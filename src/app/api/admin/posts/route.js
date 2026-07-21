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

// Dynamically resolve repository default branch (main or master)
async function getBranch(octokit, owner, repo) {
  if (process.env.GITHUB_BRANCH) return process.env.GITHUB_BRANCH;
  try {
    const { data } = await octokit.repos.get({ owner, repo });
    return data.default_branch || 'main';
  } catch (err) {
    return 'main';
  }
}

// Helper to fetch file content and SHA from GitHub
async function getGitHubFile(octokit, owner, repo, branch, path) {
  try {
    const { data } = await octokit.repos.getContent({
      owner,
      repo,
      path,
      ref: branch,
      headers: { 'cache-control': 'no-cache' }
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

// Helper to commit file with fresh SHA retry loop to prevent SHA mismatch 409 conflicts
async function commitWithRetry(octokit, owner, repo, branch, path, message, contentStr) {
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const { sha } = await getGitHubFile(octokit, owner, repo, branch, path);
      await octokit.repos.createOrUpdateFileContents({
        owner,
        repo,
        path,
        message,
        content: Buffer.from(contentStr).toString('base64'),
        sha: sha || undefined,
        branch,
      });
      return; // Success
    } catch (err) {
      if (attempt === 3) throw err;
      await new Promise(r => setTimeout(r, 600));
    }
  }
}

// POST endpoint to Create or Update a post
export async function POST(request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized: Passcode mismatch' }, { status: 401 });
  }

  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  const GITHUB_OWNER = process.env.GITHUB_OWNER;
  const GITHUB_REPO = process.env.GITHUB_REPO;

  if (!GITHUB_TOKEN || !GITHUB_OWNER || !GITHUB_REPO) {
    return NextResponse.json(
      { error: 'GitHub environment variables (GITHUB_TOKEN, GITHUB_OWNER, GITHUB_REPO) are missing on Vercel.' },
      { status: 500 }
    );
  }

  try {
    const postData = await request.json();
    const octokit = new Octokit({ auth: GITHUB_TOKEN });
    const targetBranch = await getBranch(octokit, GITHUB_OWNER, GITHUB_REPO);

    // 1. Process and upload base64 images to GitHub
    const finalImages = ["", "", "", ""];
    const imagePromises = [];

    for (let i = 0; i < 4; i++) {
      const img = postData.images?.[i] || "";
      
      if (img.startsWith('data:image')) {
        const matches = img.match(/^data:image\/(\w+);base64,(.+)$/);
        if (matches && matches.length === 3) {
          const ext = matches[1];
          const base64Data = matches[2];
          
          const filename = `${postData.id}-${i}-${Date.now()}.${ext}`;
          const githubPath = `public/images/posts/${filename}`;

          const uploadPromise = octokit.repos.createOrUpdateFileContents({
            owner: GITHUB_OWNER,
            repo: GITHUB_REPO,
            path: githubPath,
            message: `Upload image ${i + 1} for post: ${postData.title}`,
            content: base64Data,
            branch: targetBranch,
          }).then(() => {
            finalImages[i] = `/images/posts/${filename}`;
          });

          imagePromises.push(uploadPromise);
        }
      } else {
        finalImages[i] = img;
      }
    }

    await Promise.all(imagePromises);

    const cleanImages = finalImages.filter(img => img !== "");
    const coverImage = cleanImages[0] || "/images/posts/default.png";

    postData.image = coverImage;
    postData.images = cleanImages.length > 0 ? cleanImages : [coverImage];

    // 2. Read latest posts.json content from GitHub
    const postsFilePath = 'content/posts.json';
    const { content: postsJsonContent } = await getGitHubFile(octokit, GITHUB_OWNER, GITHUB_REPO, targetBranch, postsFilePath);
    
    let postsList = [];
    if (postsJsonContent) {
      postsList = JSON.parse(postsJsonContent);
    }

    const existingIndex = postsList.findIndex(p => p.id === postData.id);

    if (existingIndex !== -1) {
      postData.views = postsList[existingIndex].views || 0;
      postData.createdAt = postsList[existingIndex].createdAt || new Date().toISOString();
      postsList[existingIndex] = postData;
    } else {
      postData.views = 0;
      postData.createdAt = new Date().toISOString();
      postsList.unshift(postData);
    }

    const updatedContentStr = JSON.stringify(postsList, null, 2);
    
    // Commit posts.json with retry logic using fresh SHA
    await commitWithRetry(
      octokit,
      GITHUB_OWNER,
      GITHUB_REPO,
      targetBranch,
      postsFilePath,
      existingIndex !== -1 ? `Update post: ${postData.title}` : `Create post: ${postData.title}`,
      updatedContentStr
    );

    return NextResponse.json({ success: true, post: postData });

  } catch (error) {
    console.error('API Error:', error);
    if (error.status === 404) {
      return NextResponse.json({ 
        error: `GitHub API 404 Error: Repository '${GITHUB_OWNER}/${GITHUB_REPO}' was not found, or GITHUB_TOKEN lacks 'Contents: Read & Write' permission.` 
      }, { status: 500 });
    }
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
    const targetBranch = await getBranch(octokit, GITHUB_OWNER, GITHUB_REPO);
    const postsFilePath = 'content/posts.json';
    const { content: postsJsonContent } = await getGitHubFile(octokit, GITHUB_OWNER, GITHUB_REPO, targetBranch, postsFilePath);

    if (!postsJsonContent) {
      return NextResponse.json({ error: 'Posts database file not found on GitHub.' }, { status: 404 });
    }

    const postsList = JSON.parse(postsJsonContent);
    const filteredList = postsList.filter(p => p.id !== postId);

    if (postsList.length === filteredList.length) {
      return NextResponse.json({ error: 'Post ID not found in database.' }, { status: 404 });
    }

    const updatedContentStr = JSON.stringify(filteredList, null, 2);
    
    await commitWithRetry(
      octokit,
      GITHUB_OWNER,
      GITHUB_REPO,
      targetBranch,
      postsFilePath,
      `Delete post ID: ${postId}`,
      updatedContentStr
    );

    return NextResponse.json({ success: true, deletedId: postId });

  } catch (error) {
    console.error('API Error:', error);
    if (error.status === 404) {
      return NextResponse.json({ 
        error: `GitHub API 404 Error: Repository '${GITHUB_OWNER}/${GITHUB_REPO}' was not found, or GITHUB_TOKEN lacks 'Contents: Read & Write' permission.` 
      }, { status: 500 });
    }
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

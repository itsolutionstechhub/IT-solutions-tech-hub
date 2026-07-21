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

// POST endpoint to update settings
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
    const newSettings = await request.json();
    const octokit = new Octokit({ auth: GITHUB_TOKEN });
    const targetBranch = await getBranch(octokit, GITHUB_OWNER, GITHUB_REPO);
    const settingsFilePath = 'content/settings.json';

    const updatedContentStr = JSON.stringify(newSettings, null, 2);

    await commitWithRetry(
      octokit,
      GITHUB_OWNER,
      GITHUB_REPO,
      targetBranch,
      settingsFilePath,
      'Update dynamic site configurations',
      updatedContentStr
    );

    return NextResponse.json({ success: true, settings: newSettings });

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

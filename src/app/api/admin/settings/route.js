import { NextResponse } from 'next/server';
import { Octokit } from '@octokit/rest';

// Helper to secure the API endpoint with the admin passcode
function isAuthorized(request) {
  const authHeader = request.headers.get('admin-passcode');
  const securePassword = process.env.ADMIN_PASSWORD || 'admin';
  return authHeader && authHeader.toLowerCase() === securePassword.toLowerCase();
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
    
    const content = Buffer.from(data.content, 'base64').toString('utf8');
    return { content, sha: data.sha };
  } catch (error) {
    if (error.status === 404) {
      return { content: null, sha: null };
    }
    throw error;
  }
}

// POST endpoint to update settings
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
    const newSettings = await request.json();
    const octokit = new Octokit({ auth: GITHUB_TOKEN });
    const settingsFilePath = 'content/settings.json';

    // Fetch current settings SHA if it exists
    const { sha: settingsSha } = await getGitHubFile(octokit, settingsFilePath);

    // Commit updated settings to GitHub
    const updatedContentStr = JSON.stringify(newSettings, null, 2);

    await octokit.repos.createOrUpdateFileContents({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      path: settingsFilePath,
      message: 'Update dynamic site configurations',
      content: Buffer.from(updatedContentStr).toString('base64'),
      sha: settingsSha || undefined,
      branch: 'main',
    });

    return NextResponse.json({ success: true, settings: newSettings });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

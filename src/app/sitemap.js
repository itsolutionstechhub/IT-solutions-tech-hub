import posts from '../../content/posts.json';
import settings from '../../content/settings.json';

const BASE_URL = 'https://itsolutionspro.net';

function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export default async function sitemap() {
  // Core Static Pages
  const staticPages = [
    { url: `${BASE_URL}/`, changeFrequency: 'daily', priority: 1.0 },
    { url: `${BASE_URL}/tech-news`, changeFrequency: 'daily', priority: 0.8 },
    { url: `${BASE_URL}/repair-articles`, changeFrequency: 'daily', priority: 0.8 },
    { url: `${BASE_URL}/store`, changeFrequency: 'daily', priority: 0.8 },
    { url: `${BASE_URL}/about-us`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/contact-us`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/privacy-policy`, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${BASE_URL}/terms-conditions`, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${BASE_URL}/disclaimer`, changeFrequency: 'monthly', priority: 0.3 },
  ];

  // Dynamic Post Pages
  const postUrls = posts.map(post => {
    const slug = generateSlug(post.title);
    return {
      url: `${BASE_URL}/posts/${post.id}/${slug}`,
      lastModified: new Date(post.createdAt || Date.now()).toISOString().split('T')[0],
      changeFrequency: 'weekly',
      priority: 0.8
    };
  });

  return [...staticPages, ...postUrls];
}

import { redirect } from 'next/navigation';
import posts from '../../../../content/posts.json';

function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export async function generateStaticParams() {
  return posts.map((post) => ({
    id: post.id,
  }));
}

export default function PostRedirect({ params }) {
  const post = posts.find(p => p.id === params.id);
  if (!post) {
    redirect('/');
  }
  const slug = generateSlug(post.title);
  redirect(`/posts/${post.id}/${slug}`);
}

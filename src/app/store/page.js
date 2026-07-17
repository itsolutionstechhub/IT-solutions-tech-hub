'use client';

import React from 'react';
import settings from '../../../content/settings.json';
import initialPosts from '../../../content/posts.json';
import PostCard from '../../components/PostCard';

export default function Store() {
  const storePosts = initialPosts.filter(p => p.category === 'store');

  return (
    <section id="view-store" className="view-section active">
      <div className="section-header">
        <h2 className="section-title">Professional Technician {settings.storeLabel || "Store"}</h2>
      </div>

      <div className="grid-layout" id="store-grid">
        {storePosts.length > 0 ? (
          storePosts.map(post => (
            <PostCard key={post.id} post={post} />
          ))
        ) : (
          <div className="empty-state" style={{ gridColumn: '1 / -1', width: '100%' }}>
            <i className="fa-solid fa-store"></i>
            <p>No {settings.storeLabel || "Store"} items listed yet.</p>
          </div>
        )}
      </div>
    </section>
  );
}

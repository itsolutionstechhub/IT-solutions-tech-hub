'use client';

import React from 'react';
import settings from '../../../content/settings.json';
import initialPosts from '../../../content/posts.json';
import PostCard from '../../components/PostCard';

export default function RepairArticles() {
  const repairPosts = initialPosts.filter(p => p.category === 'repair-articles');

  return (
    <section id="view-repair-articles" className="view-section active">
      <div className="section-header">
        <h2 className="section-title">{settings.repairArticlesLabel || "Repair Articles"} & Download Center</h2>
      </div>

      <div className="grid-layout" id="repair-articles-grid">
        {repairPosts.length > 0 ? (
          repairPosts.map(post => (
            <PostCard key={post.id} post={post} />
          ))
        ) : (
          <div className="empty-state" style={{ gridColumn: '1 / -1', width: '100%' }}>
            <i className="fa-solid fa-screwdriver-wrench"></i>
            <p>No {settings.repairArticlesLabel || "Repair Articles"} uploaded yet.</p>
          </div>
        )}
      </div>
    </section>
  );
}

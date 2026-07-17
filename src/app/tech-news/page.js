'use client';

import React, { useState, useEffect } from 'react';
import settings from '../../../content/settings.json';
import initialPosts from '../../../content/posts.json';
import PostCard from '../../components/PostCard';

export default function TechNews() {
  const [currentPage, setCurrentPage] = useState(0);
  const postsPerPage = 6;

  const newsPosts = initialPosts.filter(p => p.category === 'tech-news');
  const totalPages = Math.ceil(newsPosts.length / postsPerPage);

  useEffect(() => {
    if (currentPage >= totalPages && totalPages > 0) {
      setCurrentPage(totalPages - 1);
    }
  }, [totalPages, currentPage]);

  const handlePageChange = (delta) => {
    setCurrentPage(prev => prev + delta);
    const gridHeader = document.getElementById('news-title-header');
    if (gridHeader) {
      gridHeader.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const startIdx = currentPage * postsPerPage;
  const paginatedPosts = newsPosts.slice(startIdx, startIdx + postsPerPage);

  return (
    <section id="view-tech-news" className="view-section active">
      <div className="section-header" id="news-title-header">
        <h2 className="section-title">Latest {settings.techNewsLabel || "Tech News"}</h2>
      </div>

      <div className="grid-layout" id="tech-news-grid">
        {paginatedPosts.length > 0 ? (
          paginatedPosts.map(post => (
            <PostCard key={post.id} post={post} />
          ))
        ) : (
          <div className="empty-state" style={{ gridColumn: '1 / -1', width: '100%' }}>
            <i className="fa-solid fa-newspaper"></i>
            <p>No {settings.techNewsLabel || "Tech News"} uploaded yet.</p>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div id="tech-news-pagination" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', marginTop: '32px', width: '100%' }}>
          <button 
            className="btn btn-secondary" 
            onClick={() => handlePageChange(-1)} 
            disabled={currentPage === 0}
            style={currentPage === 0 ? { opacity: 0.5, pointerEvents: 'none' } : {}}
          >
            <i className="fa-solid fa-chevron-left"></i> Previous
          </button>
          <span style={{ fontSize: '14px', fontWeight: 500, color: 'hsl(var(--text-secondary))' }}>
            Page {currentPage + 1} of {totalPages}
          </span>
          <button 
            className="btn btn-secondary" 
            onClick={() => handlePageChange(1)} 
            disabled={currentPage === totalPages - 1}
            style={currentPage === totalPages - 1 ? { opacity: 0.5, pointerEvents: 'none' } : {}}
          >
            Next <i className="fa-solid fa-chevron-right"></i>
          </button>
        </div>
      )}
    </section>
  );
}

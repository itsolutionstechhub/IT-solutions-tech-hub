'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import settings from '../../content/settings.json';
import initialPosts from '../../content/posts.json';
import PostCard from '../components/PostCard';

export default function Home() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const postsPerPage = 6;

  // Sync settings/pages toggle
  const showNews = settings.showNews !== false;
  const showRepair = settings.showRepair !== false;
  const showStore = settings.showStore !== false;
  const showStats = settings.showStatsCounters !== false;

  // Filter posts based on search query
  const getFilteredPosts = () => {
    const val = searchQuery.toLowerCase().trim();
    if (!val) return initialPosts;

    return initialPosts.filter(post => 
      post.title.toLowerCase().includes(val) ||
      post.description.toLowerCase().includes(val) ||
      post.category.toLowerCase().includes(val) ||
      (post.metadata && Object.values(post.metadata).some(metaVal => String(metaVal).toLowerCase().includes(val)))
    );
  };

  const filteredPosts = getFilteredPosts();
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  
  // Guard current page boundary
  useEffect(() => {
    if (currentPage >= totalPages && totalPages > 0) {
      setCurrentPage(totalPages - 1);
    }
  }, [totalPages, currentPage]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(0);
  };

  const handlePageChange = (delta) => {
    setCurrentPage(prev => prev + delta);
    const gridHeader = document.getElementById('recent-resources-title');
    if (gridHeader) {
      gridHeader.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Get active stats cards count
  const activeStatsCount = [showNews, showRepair, showStore].filter(Boolean).length;
  
  // Database counters
  const newsCount = initialPosts.filter(p => p.category === 'tech-news').length;
  const repairCount = initialPosts.filter(p => p.category === 'repair-articles').length;
  const storeCount = initialPosts.filter(p => p.category === 'store').length;

  const handleStatCardClick = (target) => {
    router.push(`/${target}`);
  };

  // Paginated segment
  const startIdx = currentPage * postsPerPage;
  const paginatedPosts = filteredPosts.slice(startIdx, startIdx + postsPerPage);

  return (
    <section id="view-home" className="view-section active">
      {/* Hero Section */}
      <div className="hero">
        <h1 
          className="glow-text" 
          id="home-hero-title"
          dangerouslySetInnerHTML={{ __html: settings.heroTitle || "<span>IT Solutions Pro</span> for Information Technology" }}
        />
        <p id="home-hero-desc">
          {settings.heroDesc || "Empowering the public with information technology. IT Solutions Pro is your ultimate hub for premium tech news, software tools, computer maintenance tips, and professional hardware repair resources."}
        </p>
        <div className="search-container">
          <input 
            type="text" 
            className="search-bar" 
            id="home-search-bar" 
            placeholder="Search news, repair files, tools, or shop products..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <i className="fa-solid fa-magnifying-glass"></i>
        </div>
      </div>

      {/* Stats Counter Cards */}
      {showStats && activeStatsCount > 0 && (
        <div 
          className="stats-cluster" 
          style={{ 
            display: 'grid', 
            gridTemplateColumns: `repeat(${activeStatsCount}, 1fr)`,
            opacity: 1 
          }}
        >
          {showNews && (
            <div className="stat-card" onClick={() => handleStatCardClick('tech-news')}>
              <i className="fa-solid fa-newspaper"></i>
              <div className="stat-val" id="stat-count-news">{newsCount}</div>
              <div className="stat-lbl" id="lbl-news-count">{settings.techNewsLabel || "Tech News"}</div>
            </div>
          )}
          {showRepair && (
            <div className="stat-card" onClick={() => handleStatCardClick('repair-articles')}>
              <i className="fa-solid fa-screwdriver-wrench"></i>
              <div className="stat-val" id="stat-count-repair">{repairCount}</div>
              <div className="stat-lbl" id="lbl-repair-count">{settings.repairArticlesLabel || "Repair Articles"}</div>
            </div>
          )}
          {showStore && (
            <div className="stat-card" onClick={() => handleStatCardClick('store')}>
              <i className="fa-solid fa-store"></i>
              <div className="stat-val" id="stat-count-store">{storeCount}</div>
              <div className="stat-lbl" id="lbl-store-count">{settings.storeLabel || "Store"}</div>
            </div>
          )}
        </div>
      )}

      {/* Main Grid Title */}
      <div className="section-header" id="recent-resources-title" style={{ marginTop: '40px' }}>
        <h2 className="section-title">Recently Added Resources</h2>
      </div>

      {/* Grid of cards */}
      <div className="grid-layout" id="recent-posts-grid">
        {paginatedPosts.length > 0 ? (
          paginatedPosts.map(post => (
            <PostCard key={post.id} post={post} />
          ))
        ) : (
          <div className="empty-state" style={{ gridColumn: '1 / -1', width: '100%' }}>
            <i className="fa-solid fa-magnifying-glass-minus"></i>
            <p>No technician resources or files match your search keywords.</p>
          </div>
        )}
      </div>

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div id="recent-posts-pagination" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', marginTop: '32px', width: '100%' }}>
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

'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import settings from '../../content/settings.json';

// Helper to strip HTML tags for card description snippets
function stripHtml(html) {
  if (!html) return "";
  return html.replace(/<[^>]*>/g, "");
}

// Helper to generate SEO slugs
function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export default function PostCard({ post }) {
  const [activeSlide, setActiveSlide] = useState(0);
  const isHovered = useRef(false);
  const hasMultipleImages = post.images && Array.isArray(post.images) && post.images.length > 1;

  // Auto carousel slideshow loop
  useEffect(() => {
    if (!hasMultipleImages) return;

    const interval = setInterval(() => {
      if (isHovered.current) return;
      setActiveSlide((prev) => (prev + 1) % post.images.length);
    }, 3500);

    return () => clearInterval(interval);
  }, [hasMultipleImages, post.images]);

  const handlePrev = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setActiveSlide((prev) => (prev - 1 + post.images.length) % post.images.length);
  };

  const handleNext = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setActiveSlide((prev) => (prev + 1) % post.images.length);
  };

  const handleDotClick = (e, index) => {
    e.stopPropagation();
    e.preventDefault();
    setActiveSlide(index);
  };

  // Determine Badge Styling Class
  const getBadgeClass = (cat) => {
    if (cat === "tech-news") return "softwares";
    if (cat === "repair-articles") return "bios";
    return "shop";
  };

  const badgeClass = getBadgeClass(post.category);

  // Format Category Label
  let displayCategory = "Repair";
  if (post.category === "tech-news") displayCategory = settings.techNewsLabel || "Tech News";
  else if (post.category === "repair-articles") displayCategory = settings.repairArticlesLabel || "Repair Articles";
  else if (post.category === "store") displayCategory = settings.storeLabel || "Store";

  // Dynamic Specs Rendering
  const showSpecs = post.showSpecs !== false;
  const isStore = post.category === "store";
  const isRepair = post.category === "repair-articles";

  // WhatsApp Order Link Configuration
  const rawPhone = (settings.phone || '').replace(/[+\s-]/g, '');
  const waText = encodeURIComponent(`Hi ${settings.siteName}! I am interested in purchasing "${post.title}". Is it currently available?`);
  const waLink = `https://wa.me/${rawPhone}?text=${waText}`;

  // Download Link Configuration
  const hasDownload = post.downloadLink && post.downloadLink !== '#';
  const dlLink = hasDownload ? post.downloadLink : '#';

  const slug = generateSlug(post.title);
  const detailLink = `/posts/${post.id}/${slug}`;

  return (
    <div 
      className="card" 
      data-id={post.id}
      onMouseEnter={() => { isHovered.current = true; }}
      onMouseLeave={() => { isHovered.current = false; }}
    >
      <div className="card-img-container">
        {hasMultipleImages ? (
          <div className="card-carousel" data-active-slide={activeSlide}>
            <div 
              className="carousel-track" 
              style={{ transform: `translateX(-${activeSlide * 100}%)` }}
            >
              {post.images.map((img, idx) => (
                <img key={idx} src={img} className="card-img" alt="cover" loading="lazy" />
              ))}
            </div>
            <button type="button" className="carousel-btn btn-prev" onClick={handlePrev}>
              <i className="fa-solid fa-chevron-left"></i>
            </button>
            <button type="button" className="carousel-btn btn-next" onClick={handleNext}>
              <i className="fa-solid fa-chevron-right"></i>
            </button>
            <div className="carousel-dots">
              {post.images.map((_, idx) => (
                <span 
                  key={idx} 
                  className={`carousel-dot ${idx === activeSlide ? 'active' : ''}`}
                  onClick={(e) => handleDotClick(e, idx)}
                ></span>
              ))}
            </div>
          </div>
        ) : (
          <img src={post.image || 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=600&q=80'} className="card-img" alt="cover" loading="lazy" />
        )}
        
        <span className={`card-badge badge-${badgeClass}`}>{displayCategory}</span>
        {isStore && post.price && <div className="card-price-tag">{post.price}</div>}
        
        <div className="card-image-watermark" style={{ position: 'absolute', bottom: '10px', right: '10px', background: 'rgba(0, 0, 0, 0.6)', color: 'hsl(var(--primary))', padding: '6px', borderRadius: '50%', fontSize: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)', border: '1px solid rgba(255, 255, 255, 0.15)', width: '24px', height: '24px', zIndex: 5, boxShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>
          <i className="fa-solid fa-microchip"></i>
        </div>
      </div>

      <div className="card-content">
        <h3 className="card-title">{post.title}</h3>
        <p className="card-description" style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', textOverflow: 'ellipsis', maxHeight: '4.8em', lineHeight: 1.6, marginBottom: '12px' }}>
          {stripHtml(post.description)}
        </p>
        
        <Link href={detailLink} className="btn-read-more">
          More Details <i className="fa-solid fa-chevron-right"></i>
        </Link>
        
        {/* Specifications Grid */}
        {showSpecs && (
          <>
            {isRepair && post.metadata && (
              <div className="card-spec-grid">
                <div className="spec-item">
                  <div className="spec-label">Board Model</div>
                  <div className="spec-value" title={post.metadata.board || "N/A"}>{post.metadata.board || "N/A"}</div>
                </div>
                <div className="spec-item">
                  <div className="spec-label">File Size</div>
                  <div className="spec-value">{post.metadata.size || "N/A"}</div>
                </div>
                <div className="spec-item" style={{ gridColumn: 'span 2' }}>
                  <div className="spec-label">Version / Tool</div>
                  <div className="spec-value">{post.metadata.version || "N/A"}</div>
                </div>
              </div>
            )}
            {isStore && post.metadata && (
              <div className="card-spec-grid">
                <div className="spec-item">
                  <div className="spec-label">Warranty</div>
                  <div className="spec-value">{post.metadata.warranty || "N/A"}</div>
                </div>
                <div className="spec-item">
                  <div className="spec-label">Condition</div>
                  <div className="spec-value">{post.metadata.condition || "Brand New"}</div>
                </div>
                <div className="spec-item" style={{ gridColumn: 'span 2' }}>
                  <div className="spec-label">Availability</div>
                  <div className="spec-value">{post.metadata.stock || "In Stock"}</div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Action Buttons */}
        {showSpecs && (
          <div className="card-actions">
            {isStore ? (
              <>
                <a href={waLink} target="_blank" rel="noopener noreferrer" className="btn btn-shop-buy">
                  <i className="fa-brands fa-whatsapp"></i> Buy/Inquire
                </a>
                <Link href={detailLink} className="btn btn-secondary" style={{ padding: '10px 14px' }}>
                  <i className="fa-solid fa-eye"></i> Details
                </Link>
              </>
            ) : (
              <>
                <a 
                  href={dlLink} 
                  className="btn btn-primary" 
                  onClick={(e) => {
                    if (!hasDownload) {
                      e.preventDefault();
                      if (window.showToast) {
                        window.showToast('Downloading file has started... (Mock link)', 'success');
                      }
                    }
                  }}
                  download={hasDownload}
                >
                  <i className="fa-solid fa-cloud-arrow-down"></i> {hasDownload ? 'Download' : 'Download Now'}
                </a>
                {post.link && post.link !== '#' && (
                  <a href={post.link} target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ padding: '10px 14px' }} title="Official Source">
                    <i className="fa-solid fa-arrow-up-right-from-square"></i>
                  </a>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

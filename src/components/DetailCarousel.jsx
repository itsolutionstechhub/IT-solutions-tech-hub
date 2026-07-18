'use client';

import React, { useState, useEffect, useRef } from 'react';

import Image from 'next/image';

export default function DetailCarousel({ images, coverImage }) {
  const [activeSlide, setActiveSlide] = useState(0);
  const isHovered = useRef(false);
  const hasMultipleImages = images && Array.isArray(images) && images.length > 1;

  useEffect(() => {
    if (!hasMultipleImages) return;

    const interval = setInterval(() => {
      if (isHovered.current) return;
      setActiveSlide((prev) => (prev + 1) % images.length);
    }, 3500);

    return () => clearInterval(interval);
  }, [hasMultipleImages, images]);

  const handlePrev = () => {
    setActiveSlide((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleNext = () => {
    setActiveSlide((prev) => (prev + 1) % images.length);
  };

  const handleDotClick = (index) => {
    setActiveSlide(index);
  };

  if (!hasMultipleImages) {
    return (
      <div style={{ position: 'relative', width: '100%', height: '100%', minHeight: '350px' }}>
        <Image 
          src={coverImage || 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=600&q=80'} 
          fill
          sizes="(max-width: 1200px) 100vw, 800px"
          style={{ objectFit: 'cover' }} 
          alt="cover" 
          priority
        />
      </div>
    );
  }

  return (
    <div 
      className="card-carousel" 
      data-active-slide={activeSlide} 
      style={{ width: '100%', height: '100%' }}
      onMouseEnter={() => { isHovered.current = true; }}
      onMouseLeave={() => { isHovered.current = false; }}
    >
      <div 
        className="detail-carousel-track" 
        style={{ 
          display: 'flex',
          width: '100%',
          height: '100%',
          transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
          transform: `translateX(-${activeSlide * 100}%)` 
        }}
      >
        {images.map((img, idx) => (
          <div key={idx} style={{ position: 'relative', width: '100%', height: '480px', flexShrink: 0 }}>
            <Image 
              src={img} 
              alt="slide" 
              fill
              sizes="(max-width: 1200px) 100vw, 800px"
              style={{ objectFit: 'cover' }} 
              priority={idx === 0}
            />
          </div>
        ))}
      </div>
      <button type="button" className="carousel-btn btn-prev" onClick={handlePrev}>
        <i className="fa-solid fa-chevron-left"></i>
      </button>
      <button type="button" className="carousel-btn btn-next" onClick={handleNext}>
        <i className="fa-solid fa-chevron-right"></i>
      </button>
      <div className="carousel-dots">
        {images.map((_, idx) => (
          <span 
            key={idx} 
            className={`carousel-dot ${idx === activeSlide ? 'active' : ''}`}
            onClick={() => handleDotClick(idx)}
          ></span>
        ))}
      </div>
    </div>
  );
}

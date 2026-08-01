'use client';

import React, { useEffect, useRef } from 'react';

export default function AdBanner({ type }) {
  const bannerRef = useRef(null);

  useEffect(() => {
    // Avoid running on server side or if ref is not ready
    if (typeof window === 'undefined' || !bannerRef.current) return;

    let key = '';
    let width = 300;
    let height = 250;

    if (type === '728x90') {
      key = '30490421';
      width = 728;
      height = 90;
    } else if (type === '320x50') {
      key = '30490422';
      width = 320;
      height = 50;
    } else if (type === '300x250') {
      key = '30490423';
      width = 300;
      height = 250;
    }

    if (!key) return;

    // Check if scripts are already appended to avoid duplicates
    if (bannerRef.current.querySelector('script')) return;

    // Define options
    const atOptions = {
      key: key,
      format: 'iframe',
      height: height,
      width: width,
      params: {}
    };

    // Create script to set options globally
    const configScript = document.createElement('script');
    configScript.type = 'text/javascript';
    configScript.innerHTML = `atOptions = ${JSON.stringify(atOptions)}`;
    bannerRef.current.appendChild(configScript);

    // Create script to invoke the banner ad
    const loadScript = document.createElement('script');
    loadScript.type = 'text/javascript';
    loadScript.src = `//www.highperformanceformat.com/${key}/invoke.js`;
    bannerRef.current.appendChild(loadScript);

  }, [type]);

  return (
    <div 
      ref={bannerRef} 
      className="ad-banner-container"
      style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        margin: '15px auto',
        minHeight: type === '728x90' ? '90px' : type === '320x50' ? '50px' : '250px',
        width: '100%',
        overflow: 'hidden'
      }} 
    />
  );
}

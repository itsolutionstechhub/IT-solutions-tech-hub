'use client';

import React from 'react';

const AD_CONFIGS = {
  '728x90': {
    width: 728,
    height: 90,
    src: '/ads/banner-728x90.html'
  },
  '320x50': {
    width: 320,
    height: 50,
    src: '/ads/banner-320x50.html'
  },
  '300x250': {
    width: 300,
    height: 250,
    src: '/ads/banner-300x250.html'
  }
};

export default function AdsterraBanner({ size }) {
  const config = AD_CONFIGS[size];

  if (!config) {
    console.warn(`AdsterraBanner: Unknown size "${size}"`);
    return null;
  }

  return (
    <div
      style={{
        width: '100%',
        minHeight: `${config.height}px`,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        margin: '10px 0',
      }}
    >
      <iframe
        src={config.src}
        width={config.width}
        height={config.height}
        style={{ border: 'none', overflow: 'hidden' }}
        scrolling="no"
      />
    </div>
  );
}


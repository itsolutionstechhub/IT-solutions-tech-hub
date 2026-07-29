'use client';

import React, { useEffect, useRef } from 'react';

const AD_CONFIGS = {
  '728x90': {
    key: '90885e8f6e95eb759d4d361bd42cacee',
    width: 728,
    height: 90
  },
  '320x50': {
    key: 'c5d6519a608f41f6d4b3a2988d993a0b',
    width: 320,
    height: 50
  },
  '300x250': {
    key: '226c19d85e635ff0b3dff862533e78e0',
    width: 300,
    height: 250
  }
};

export default function AdsterraBanner({ size }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const config = AD_CONFIGS[size];
    if (!config) {
      console.warn(`AdsterraBanner: Unknown size "${size}"`);
      return;
    }

    const container = containerRef.current;
    if (!container) return;

    // Check if scripts have already been injected into this container
    if (container.querySelector(`[data-ad-key="${config.key}"]`)) {
      return;
    }

    try {
      // Create wrapper element to prevent any conflicts
      const wrapper = document.createElement('div');
      wrapper.setAttribute('data-ad-key', config.key);
      wrapper.style.width = '100%';
      wrapper.style.height = '100%';
      wrapper.style.display = 'flex';
      wrapper.style.justifyContent = 'center';
      wrapper.style.alignItems = 'center';

      // Create atOptions config script element
      const configScript = document.createElement('script');
      configScript.type = 'text/javascript';
      configScript.innerHTML = `
        atOptions = {
          'key' : '${config.key}',
          'format' : 'iframe',
          'height' : ${config.height},
          'width' : ${config.width},
          'params' : {}
        };
      `;

      // Create invoke script element
      const invokeScript = document.createElement('script');
      invokeScript.type = 'text/javascript';
      invokeScript.src = `https://www.highperformanceformat.com/${config.key}/invoke.js`;
      invokeScript.async = true;

      wrapper.appendChild(configScript);
      wrapper.appendChild(invokeScript);
      container.appendChild(wrapper);
    } catch (err) {
      console.error('Error loading Adsterra ad banner:', err);
    }

    return () => {
      // Clean up when unmounting (helps on route change/re-render)
      if (container) {
        container.innerHTML = '';
      }
    };
  }, [size]);

  const config = AD_CONFIGS[size] || { width: 0, height: 0 };

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        minHeight: `${config.height}px`,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        margin: '10px 0',
      }}
    />
  );
}

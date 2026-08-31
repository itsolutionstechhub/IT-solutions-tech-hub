'use client';

import React from 'react';
import { incrementDownloadCount } from '../lib/dbHelpers';

export default function DownloadButton({ postId, downloadLink }) {
  const hasDownload = downloadLink && downloadLink !== '#';

  const handleClick = () => {
    incrementDownloadCount(postId);
    if (typeof window !== 'undefined') {
      window.open('https://youtu.be/8o5u3e7F16c', '_blank');
    }
    if (!hasDownload && window.showToast) {
      window.showToast('Downloading file has started... (Mock link)', 'success');
    }
  };

  if (hasDownload) {
    return (
      <a 
        href={downloadLink} 
        className="btn btn-primary" 
        style={{ width: '100%', justifyContent: 'center', padding: '12px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
        onClick={handleClick}
        target="_blank"
        rel="noopener noreferrer"
      >
        <i className="fa-solid fa-cloud-arrow-down"></i> Download File Asset
      </a>
    );
  }

  return (
    <button 
      type="button" 
      className="btn btn-primary" 
      style={{ width: '100%', justifyContent: 'center', padding: '12px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
      onClick={handleClick}
    >
      <i className="fa-solid fa-cloud-arrow-down"></i> Download Now
    </button>
  );
}

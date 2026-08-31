'use client';

import React from 'react';
import { incrementDownloadCount } from '../lib/dbHelpers';

export default function DownloadButton({ postId, downloadLink }) {
  const hasDownload = downloadLink && downloadLink !== '#';

  const handleClick = (e) => {
    e.preventDefault();
    incrementDownloadCount(postId);

    if (typeof window !== 'undefined') {
      // 1. Open YouTube instruction video in a new tab
      window.open('https://youtu.be/8o5u3e7F16c', '_blank');

      // 2. Open Mega / File download link in a second new tab
      if (hasDownload) {
        window.open(downloadLink, '_blank');
      } else if (window.showToast) {
        window.showToast('Downloading file has started... (Mock link)', 'success');
      }
    }
  };

  return (
    <a 
      href={hasDownload ? downloadLink : '#'} 
      className="btn btn-primary" 
      style={{ width: '100%', justifyContent: 'center', padding: '12px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
      onClick={handleClick}
    >
      <i className="fa-solid fa-cloud-arrow-down"></i> {hasDownload ? 'Download File Asset' : 'Download Now'}
    </a>
  );
}

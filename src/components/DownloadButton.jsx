'use client';

import React from 'react';
import { incrementDownloadCount } from '../lib/dbHelpers';

export default function DownloadButton({ postId, downloadLink }) {
  const hasDownload = downloadLink && downloadLink !== '#';

  const handleClick = () => {
    incrementDownloadCount(postId);

    if (typeof window !== 'undefined') {
      // Open Adsterra Direct Link in a new tab
      window.open('https://www.profitableratecpmnetwork.com/muxh1hzatg?key=b93a769eb007ad344df0811587a79a76', '_blank');
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

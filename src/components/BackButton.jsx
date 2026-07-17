'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

export default function BackButton() {
  const router = useRouter();
  
  return (
    <button 
      className="btn btn-secondary" 
      onClick={() => router.back()} 
      style={{ marginBottom: '24px', padding: '10px 20px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '8px' }}
    >
      <i className="fa-solid fa-arrow-left-long"></i> Back to Resources
    </button>
  );
}

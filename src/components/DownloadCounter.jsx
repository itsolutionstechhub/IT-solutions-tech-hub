'use client';

import React, { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';

export default function DownloadCounter({ postId, initialDownloads = 0, mode = 'card' }) {
  const [downloads, setDownloads] = useState(initialDownloads);

  useEffect(() => {
    if (!postId) return;

    const docRef = doc(db, 'posts', postId);

    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setDownloads(docSnap.data().downloads || 0);
      } else {
        setDownloads(initialDownloads);
      }
    }, (error) => {
      console.warn("Firestore listener error:", error);
    });

    return () => unsubscribe();
  }, [postId, initialDownloads]);

  if (mode === 'detail') {
    return (
      <span>
        <i className="fa-solid fa-cloud-arrow-down" style={{ color: 'hsl(var(--primary))', marginRight: '6px' }}></i>
        Downloads: {downloads}
      </span>
    );
  }

  // Card mode (default)
  return (
    <span style={{ fontSize: '13px', color: 'hsl(var(--text-secondary))', display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: 500 }}>
      <i className="fa-solid fa-cloud-arrow-down" style={{ color: 'hsl(var(--primary))' }}></i>
      {downloads} downloads
    </span>
  );
}

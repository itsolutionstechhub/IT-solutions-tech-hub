'use client';

import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, updateDoc, increment, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';

export default function ViewCounter({ postId, initialViews = 0, mode = 'card' }) {
  const [views, setViews] = useState(initialViews);

  useEffect(() => {
    if (!postId) return;

    // Use the existing 'posts' collection which is already authorized in Firebase Rules
    const docRef = doc(db, 'posts', postId);

    // 1. Listen for real-time updates from Firestore
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setViews(docSnap.data().views || 0);
      } else {
        setViews(initialViews);
      }
    }, (error) => {
      console.warn("Firestore listener error (probably permission rules not set yet):", error);
    });

    // 2. Increment view count on article detail page (session-throttled to avoid spamming)
    if (mode === 'detail') {
      const sessionKey = `viewed_${postId}`;
      const hasViewed = sessionStorage.getItem(sessionKey);

      if (!hasViewed) {
        const incrementViews = async () => {
          try {
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
              await updateDoc(docRef, {
                views: increment(1)
              });
            } else {
              await setDoc(docRef, {
                views: initialViews + 1
              }, { merge: true });
            }
            sessionStorage.setItem(sessionKey, 'true');
          } catch (error) {
            console.error('Error updating views count in Firestore:', error);
          }
        };

        incrementViews();
      }
    }

    return () => unsubscribe();
  }, [postId, initialViews, mode]);

  if (mode === 'detail') {
    return (
      <span>
        <i className="fa-solid fa-eye" style={{ color: 'hsl(var(--primary))', marginRight: '6px' }}></i>
        Views: {views}
      </span>
    );
  }

  // Card mode (default)
  return (
    <span style={{ fontSize: '13px', color: 'hsl(var(--text-secondary))', display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: 500 }}>
      <i className="fa-solid fa-eye" style={{ color: 'hsl(var(--primary))' }}></i>
      {views} views
    </span>
  );
}

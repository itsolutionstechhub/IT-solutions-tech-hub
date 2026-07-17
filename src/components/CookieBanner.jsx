'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [animatingOut, setAnimatingOut] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const consent = localStorage.getItem('cookie_consent_accepted');
      if (!consent) {
        const timer = setTimeout(() => {
          setIsVisible(true);
        }, 1200);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie_consent_accepted', 'accepted');
    closeBanner('Cookie preferences saved. Thank you!', 'success');
  };

  const handleDecline = () => {
    localStorage.setItem('cookie_consent_accepted', 'declined');
    closeBanner('Cookie preferences saved. Non-essential tracking disabled.', 'warning');
  };

  const closeBanner = (message, type) => {
    setAnimatingOut(true);
    setTimeout(() => {
      setIsVisible(false);
      if (window.showToast) {
        window.showToast(message, type);
      }
    }, 400);
  };

  if (!isVisible) return null;

  return (
    <div 
      id="cookie-consent-banner" 
      className="cookie-banner"
      style={{
        display: 'flex',
        animation: animatingOut 
          ? 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) reverse forwards' 
          : 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards'
      }}
    >
      <div className="cookie-content">
        <i className="fa-solid fa-cookie-bite cookie-icon" style={{ color: 'hsl(var(--warning))', fontSize: '20px' }}></i>
        <p style={{ margin: 0, fontSize: '13px', lineHeight: 1.5, color: 'hsl(var(--text-secondary))' }}>
          We use cookies to personalize content, analyze website traffic, and serve relevant Google Ads. By clicking "Accept All", you consent to our use of cookies. Learn more in our{' '}
          <Link href="/privacy-policy" style={{ textDecoration: 'underline', color: 'hsl(var(--primary))', fontWeight: 600 }}>
            Privacy Policy
          </Link>
          .
        </p>
      </div>
      <div className="cookie-actions" style={{ display: 'flex', gap: '10px', flexShrink: 0 }}>
        <button id="btn-cookie-accept" className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '12px', fontWeight: 700, borderRadius: 'var(--radius-full)' }} onClick={handleAccept}>
          Accept All
        </button>
        <button id="btn-cookie-decline" className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '12px', fontWeight: 600, borderRadius: 'var(--radius-full)' }} onClick={handleDecline}>
          Decline
        </button>
      </div>
    </div>
  );
}

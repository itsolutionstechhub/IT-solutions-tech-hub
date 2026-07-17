'use client';

import React from 'react';
import Link from 'next/link';
import settings from '../../content/settings.json';

export default function Footer() {
  const showNews = settings.showNews !== false;
  const showRepair = settings.showRepair !== false;
  const showStore = settings.showStore !== false;
  const showAbout = settings.showAbout !== false;
  const showContact = settings.showContact !== false;
  const showPrivacy = settings.showPrivacy !== false;
  const showTerms = settings.showTerms !== false;
  const showDisclaimer = settings.showDisclaimer !== false;

  return (
    <footer>
      <div className="container">
        <div className="footer-grid">
          <div className="footer-col">
            <Link href="/" className="logo" id="footer-logo-btn" style={{ marginBottom: '14px' }}>
              <i className={settings.logoIcon || "fa-solid fa-microchip"} id="footer-logo-icon"></i>
              <span id="footer-logo-text">{settings.logoText || "IT Solutions Pro"}</span>
            </Link>
            <p id="footer-branding-desc">
              Premium online portal for {settings.siteName || "IT Solutions Pro"} resources.
            </p>
          </div>
          
          {(showNews || showRepair || showStore) && (
            <div className="footer-col" id="footer-col-quick-links">
              <h3>Quick Resource Tabs</h3>
              <div className="footer-links">
                {showNews && (
                  <Link href="/tech-news" id="footer-link-tech-news">
                    {settings.techNewsLabel || "Tech News"}
                  </Link>
                )}
                {showRepair && (
                  <Link href="/repair-articles" id="footer-link-repair-articles">
                    {settings.repairArticlesLabel || "Repair Articles"}
                  </Link>
                )}
                {showStore && (
                  <Link href="/store" id="footer-link-store">
                    {settings.storeLabel || "Store"}
                  </Link>
                )}
              </div>
            </div>
          )}

          <div className="footer-col" id="footer-col-about-links">
            <h3>About & Support</h3>
            <div className="footer-links">
              {showAbout && <Link href="/about-us" id="footer-item-about">About Our Hub</Link>}
              {showContact && <Link href="/contact-us" id="footer-item-contact">Contact/Inquiries</Link>}
              {showPrivacy && <Link href="/privacy-policy" id="footer-item-privacy">Privacy Policy</Link>}
              {showTerms && <Link href="/terms-conditions" id="footer-item-terms">Terms & Conditions</Link>}
              {showDisclaimer && <Link href="/disclaimer" id="footer-item-disclaimer">Legal Disclaimer</Link>}
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div id="footer-copy-text">
            &copy; 2026 {settings.siteName || "IT Solutions Pro"}. All intellectual rights reserved. Built for professional repair technicians.
          </div>
          <div className="footer-bottom-links">
            {showPrivacy && <Link href="/privacy-policy" id="footer-bottom-privacy">Privacy</Link>}
            {showTerms && <Link href="/terms-conditions" id="footer-bottom-terms">Terms</Link>}
            {showDisclaimer && <Link href="/disclaimer" id="footer-bottom-disclaimer">Disclaimer</Link>}
          </div>
        </div>
      </div>
    </footer>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import settings from '../../content/settings.json';

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const isActive = (path) => pathname === path ? 'active' : '';

  return (
    <header id="main-header">
      <div className="container header-container">
        <Link href="/" className="logo" id="logo-btn">
          <i className={settings.logoIcon || "fa-solid fa-microchip"} id="header-logo-icon"></i>
          <span id="header-logo-text">{settings.logoText || "IT Solutions Pro"}</span>
        </Link>

        <nav id="navbar" className={menuOpen ? 'open' : ''}>
          {settings.showHome !== false && (
            <Link href="/" className={`nav-link ${isActive('/')}`} onClick={() => setMenuOpen(false)}>
              Home
            </Link>
          )}
          {settings.showNews !== false && (
            <Link href="/tech-news" className={`nav-link ${isActive('/tech-news')}`} onClick={() => setMenuOpen(false)}>
              {settings.techNewsLabel || "Tech News"}
            </Link>
          )}
          {settings.showRepair !== false && (
            <Link href="/repair-articles" className={`nav-link ${isActive('/repair-articles')}`} onClick={() => setMenuOpen(false)}>
              {settings.repairArticlesLabel || "Repair Articles"}
            </Link>
          )}
          {settings.showStore !== false && (
            <Link href="/store" className={`nav-link ${isActive('/store')}`} onClick={() => setMenuOpen(false)}>
              {settings.storeLabel || "Store"}
            </Link>
          )}
          {settings.showAbout !== false && (
            <Link href="/about-us" className={`nav-link ${isActive('/about-us')}`} onClick={() => setMenuOpen(false)}>
              About Us
            </Link>
          )}
          {settings.showContact !== false && (
            <Link href="/contact-us" className={`nav-link ${isActive('/contact-us')}`} onClick={() => setMenuOpen(false)}>
              Contact Us
            </Link>
          )}
          {settings.showPrivacy !== false && (
            <Link href="/privacy-policy" className={`nav-link ${isActive('/privacy-policy')}`} onClick={() => setMenuOpen(false)}>
              Privacy Policy
            </Link>
          )}
          {settings.showTerms !== false && (
            <Link href="/terms-conditions" className={`nav-link ${isActive('/terms-conditions')}`} onClick={() => setMenuOpen(false)}>
              Terms & Conditions
            </Link>
          )}
          {settings.showDisclaimer !== false && (
            <Link href="/disclaimer" className={`nav-link ${isActive('/disclaimer')}`} onClick={() => setMenuOpen(false)}>
              Disclaimer
            </Link>
          )}
        </nav>

        <div className="nav-actions">
          <div className={`hamburger ${menuOpen ? 'open' : ''}`} id="hamburger-btn" onClick={toggleMenu}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
    </header>
  );
}


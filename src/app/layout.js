import React from 'react';
import './globals.css';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CookieBanner from '../components/CookieBanner';
import ToastContainer from '../components/ToastContainer';
import settings from '../../content/settings.json';
import AdsterraBanner from '../components/AdsterraBanner';

export const metadata = {
  metadataBase: new URL('https://itsolutionspro.net'),
  title: `${settings.siteName || "IT Solutions Pro"} | Premium Tech News, Guides & Software Tools`,
  description: settings.heroDesc || "Premium resources for laptop repair technicians. Download BIOS bin files, boardview files, schematics, and specialized technician software. Shop repair gear online.",
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: '/favicon.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Pinterest Domain Verification */}
        <meta name="p:domain_verify" content="243fafa6d83f2880069abe513e04eeef"/>

        {/* FontAwesome Icons */}
        <link 
          rel="stylesheet" 
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" 
          precedence="default"
        />
        
        {/* Google Analytics (gtag.js) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-LFPMDY15FS"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-LFPMDY15FS');
            `,
          }}
        />

        {/* Google AdSense */}
        <script 
          async 
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4127818731395844"
          crossorigin="anonymous"
        ></script>
        <meta name="google-adsense-account" content="ca-pub-4127818731395844" />

        {/* Microsoft Clarity Tracking Code */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(c,l,a,r,i,t,y){
                  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i+"?ref=bwt";
                  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "xs3fd7eqfv");
            `,
          }}
        />

        {/* Adsterra Social Bar */}
        <script 
          async 
          src="https://pl30590919.effectivecpmnetwork.com/1d/a1/d4/1da1d43d05701712d88cd7be96ac1e80.js"
        ></script>
      </head>
      <body>
        <Header />
        <main>
          {/* Adsterra Responsive Header Banners */}
          <div className="ad-desktop-wrapper">
            <AdsterraBanner size="728x90" />
          </div>
          <div className="ad-mobile-wrapper">
            <AdsterraBanner size="320x50" />
          </div>
          <div className="container">
            {children}
          </div>
        </main>
        <Footer />
        <CookieBanner />
        <ToastContainer />
      </body>
    </html>
  );
}

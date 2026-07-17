import React from 'react';
import './globals.css';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CookieBanner from '../components/CookieBanner';
import ToastContainer from '../components/ToastContainer';
import settings from '../../content/settings.json';

export const metadata = {
  title: settings.siteName || "IT Solutions Pro",
  description: settings.heroDesc || "Premium resources for laptop repair technicians. Download BIOS bin files, boardview files, schematics, and specialized technician software. Shop repair gear online.",
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
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
      </head>
      <body>
        <Header />
        <main>
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

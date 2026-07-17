import React from 'react';
import settings from '../../../content/settings.json';

export const metadata = {
  title: `About Us - ${settings.siteName || "IT Solutions Pro"}`,
  description: `About ${settings.siteName || "IT Solutions Pro"} - Our core mission, tech guides, and repair resources.`,
};

export default function AboutUs() {
  return (
    <section id="view-about-us" className="view-section active">
      <div 
        className="content-rich-box" 
        id="about-us-container"
        dangerouslySetInnerHTML={{ __html: settings.aboutUs }}
      />
    </section>
  );
}

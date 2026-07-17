import React from 'react';
import settings from '../../../content/settings.json';

export const metadata = {
  title: `Privacy Policy - ${settings.siteName || "IT Solutions Pro"}`,
  description: `Privacy Policy and data practices for ${settings.siteName || "IT Solutions Pro"}.`,
};

export default function PrivacyPolicy() {
  return (
    <section id="view-privacy-policy" className="view-section active">
      <div 
        className="content-rich-box" 
        id="privacy-policy-container"
        dangerouslySetInnerHTML={{ __html: settings.privacyPolicy }}
      />
    </section>
  );
}

import React from 'react';
import settings from '../../../content/settings.json';

export const metadata = {
  title: `Terms & Conditions - ${settings.siteName || "IT Solutions Pro"}`,
  description: `Terms and conditions for utilizing repair files, schematics, and tools on ${settings.siteName || "IT Solutions Pro"}.`,
};

export default function TermsConditions() {
  return (
    <section id="view-terms-conditions" className="view-section active">
      <div 
        className="content-rich-box" 
        id="terms-conditions-container"
        dangerouslySetInnerHTML={{ __html: settings.termsConditions }}
      />
    </section>
  );
}

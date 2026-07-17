import React from 'react';
import settings from '../../../content/settings.json';

export const metadata = {
  title: `Legal Disclaimer - ${settings.siteName || "IT Solutions Pro"}`,
  description: `Technical warning and legal disclaimers for flashing BIOS chips or performing hardware modifications on ${settings.siteName || "IT Solutions Pro"}.`,
};

export default function Disclaimer() {
  return (
    <section id="view-disclaimer" className="view-section active">
      <div 
        className="content-rich-box" 
        id="disclaimer-container"
        dangerouslySetInnerHTML={{ __html: settings.disclaimer }}
      />
    </section>
  );
}

'use client';

import React, { useState } from 'react';
import settings from '../../../content/settings.json';

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Netlify form submission payload
    const payload = new URLSearchParams({
      'form-name': 'contact',
      ...formData
    }).toString();

    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: payload
    })
      .then(() => {
        if (window.showToast) {
          window.showToast('Thank you! Your message was sent to the tech admins.', 'success');
        }
        setFormData({ name: '', email: '', subject: '', message: '' });
      })
      .catch((error) => {
        console.error('Netlify form submission error:', error);
        if (window.showToast) {
          window.showToast('Failed to send message online.', 'danger');
        }
      });
  };

  // Format WhatsApp number
  const rawNum = (settings.phone || '').replace(/[+\s-]/g, '');
  const waLink = `https://wa.me/${rawNum}`;

  return (
    <section id="view-contact-us" className="view-section active">
      <div className="section-header">
        <h2 className="section-title">Get In Touch With Us</h2>
      </div>
      <div className="contact-grid">
        {/* Contact Form */}
        <div className="contact-box">
          <h3>Send us a Message</h3>
          
          {/* Netlify form wrapper */}
          <form 
            id="contact-form" 
            name="contact" 
            method="POST" 
            data-netlify="true" 
            onSubmit={handleSubmit}
          >
            <input type="hidden" name="form-name" value="contact" />
            
            <div className="form-group">
              <label htmlFor="contact-name">Full Name</label>
              <input 
                type="text" 
                id="contact-name" 
                name="name" 
                className="form-control" 
                placeholder="e.g. Dasith Silva" 
                value={formData.name}
                onChange={handleChange}
                required 
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="contact-email">Email Address</label>
              <input 
                type="email" 
                id="contact-email" 
                name="email" 
                className="form-control" 
                placeholder="e.g. yourname@domain.com" 
                value={formData.email}
                onChange={handleChange}
                required 
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="contact-subject">Subject</label>
              <input 
                type="text" 
                id="contact-subject" 
                name="subject" 
                className="form-control" 
                placeholder="e.g. Request BIOS File" 
                value={formData.subject}
                onChange={handleChange}
                required 
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="contact-message">Message Details</label>
              <textarea 
                id="contact-message" 
                name="message" 
                className="form-control" 
                placeholder="Write details here..." 
                value={formData.message}
                onChange={handleChange}
                required
              ></textarea>
            </div>
            
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              <i className="fa-solid fa-paper-plane"></i> Submit Inquiry
            </button>
          </form>
        </div>

        {/* Contact Info Sidebar */}
        <div className="contact-info-card">
          <h3>Contact Information</h3>
          <div className="info-item">
            <div className="info-icon contact-email-icon"><i class="fa-solid fa-envelope"></i></div>
            <div className="info-text">
              <h4>Support Email</h4>
              <p>
                <a id="contact-email-link" href={`mailto:${settings.email}`} style={{ color: 'hsl(var(--primary))', textDecoration: 'underline' }}>
                  {settings.email}
                </a>
              </p>
            </div>
          </div>
          <div className="info-item">
            <div className="info-icon contact-whatsapp-icon"><i class="fa-brands fa-whatsapp"></i></div>
            <div className="info-text">
              <h4>WhatsApp Support Line</h4>
              <p>
                <a id="contact-whatsapp-link" href={waLink} target="_blank" rel="noopener noreferrer" style={{ color: 'hsl(var(--accent))', fontWeight: 700 }}>
                  <span id="contact-whatsapp-num">{settings.phone}</span>
                </a>
              </p>
              <p>Available 24/7 for technician queries</p>
            </div>
          </div>
          <div className="info-item">
            <div className="info-icon contact-location-icon"><i class="fa-solid fa-location-dot"></i></div>
            <div className="info-text">
              <h4>Physical Location</h4>
              <p style={{ color: 'hsl(var(--text-secondary))', fontSize: '14px', lineHeight: '1.5' }}>
                No 398 C Bogahamaditta,<br />Hali-ela, Sri Lanka
              </p>
            </div>
          </div>
          
          {/* YouTube Channel Promotion Card */}
          <div style={{ marginTop: '20px', padding: '20px', background: 'linear-gradient(135deg, rgba(255, 0, 0, 0.08), rgba(139, 92, 246, 0.08))', border: '1px solid rgba(255, 0, 0, 0.2)', borderRadius: 'var(--radius-sm)', position: 'relative' }}>
            <div style={{ position: 'absolute', top: '-10px', right: '15px', background: '#ff0000', color: '#fff', fontSize: '10px', fontWeight: 800, padding: '2px 8px', borderRadius: 'var(--radius-full)', textTransform: 'uppercase', letterSpacing: '0.5px', boxShadow: 'var(--shadow-sm)' }}>
              Official YouTube
            </div>
            <h4 style={{ fontSize: '17px', marginBottom: '8px', color: '#ff3333', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <i className="fa-brands fa-youtube" style={{ fontSize: '20px' }}></i> 
              <span id="contact-youtube-name">{settings.youtubeName}</span>
            </h4>
            <p id="contact-youtube-desc" style={{ fontSize: '13px', color: 'hsl(var(--text-secondary))', lineHeight: '1.5', marginBottom: '12px' }}>
              {settings.youtubeDesc}
            </p>
            <a id="contact-youtube-link" href={settings.youtubeUrl} target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ fontSize: '12px', padding: '8px 16px', width: '100%', borderColor: 'rgba(255, 0, 0, 0.4)', color: '#ff3333', background: 'rgba(255, 0, 0, 0.04)', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
              <i className="fa-solid fa-play"></i> Watch & Subscribe
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

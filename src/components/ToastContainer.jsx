'use client';

import React, { useEffect } from 'react';

export default function ToastContainer() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.showToast = (message, type = 'success') => {
        const container = document.getElementById('toast-notification-container');
        if (!container) return;
        
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;

        let iconHTML = '';
        if (type === 'success') iconHTML = '<i class="fa-solid fa-circle-check" style="color: hsl(var(--accent));"></i>';
        else if (type === 'danger') iconHTML = '<i class="fa-solid fa-circle-exclamation" style="color: hsl(var(--danger));"></i>';
        else iconHTML = '<i class="fa-solid fa-triangle-exclamation" style="color: hsl(var(--warning));"></i>';

        toast.innerHTML = `
          ${iconHTML}
          <div style="font-size: 13px; font-weight:600; margin-left: 8px;">${message}</div>
        `;

        container.appendChild(toast);

        setTimeout(() => {
          toast.style.animation = 'slideIn 0.35s reverse forwards';
          setTimeout(() => {
            toast.remove();
          }, 350);
        }, 3500);
      };
    }
  }, []);

  return <div className="toast-container" id="toast-notification-container"></div>;
}

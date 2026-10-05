/**
 * LUMEWOOD — RTL / LTR CONTROLLER
 * assets/js/rtl.js
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'lumewood_dir';
  const root = document.documentElement;

  function initDirection() {
    const savedDir = localStorage.getItem(STORAGE_KEY);
    if (savedDir === 'rtl' || savedDir === 'ltr') {
      applyDirection(savedDir);
    } else {
      applyDirection('ltr');
    }
  }

  function applyDirection(dir) {
    root.setAttribute('dir', dir);
    localStorage.setItem(STORAGE_KEY, dir);
    updateDirectionButtons(dir);
  }

  function toggleDirection() {
    const currentDir = root.getAttribute('dir') || 'ltr';
    const newDir = currentDir === 'rtl' ? 'ltr' : 'rtl';
    applyDirection(newDir);
  }

  function updateDirectionButtons(dir) {
    const rtlButtons = document.querySelectorAll('[data-action="toggle-rtl"]');
    rtlButtons.forEach(btn => {
      btn.setAttribute('aria-pressed', dir === 'rtl');
      btn.setAttribute('aria-label', dir === 'rtl' ? 'Switch to Left to Right' : 'Switch to Right to Left');
      
      const badge = btn.querySelector('.dir-badge');
      if (badge) {
        badge.textContent = dir === 'rtl' ? 'LTR' : 'RTL';
      }

      const textLabel = btn.querySelector('.dir-label-text');
      if (textLabel) {
        textLabel.textContent = dir === 'rtl' ? 'Switch to LTR' : 'Switch to RTL';
      }
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    initDirection();

    document.querySelectorAll('[data-action="toggle-rtl"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        toggleDirection();
      });
    });
  });

  window.LumewoodRTL = {
    toggle: toggleDirection,
    apply: applyDirection,
    get: () => root.getAttribute('dir') || 'ltr'
  };
})();

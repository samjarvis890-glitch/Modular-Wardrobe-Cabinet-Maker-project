/**
 * LUMEWOOD — THEME CONTROLLER (Dark / Light Mode)
 * assets/js/theme.js
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'lumewood_theme';
  const root = document.documentElement;

  // Initialize theme immediately to prevent flash of wrong theme
  function initTheme() {
    const savedTheme = localStorage.getItem(STORAGE_KEY);
    if (savedTheme === 'dark' || savedTheme === 'light') {
      applyTheme(savedTheme);
    } else {
      // Check system preference
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      applyTheme(prefersDark ? 'dark' : 'light');
    }
  }

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);
    updateToggleButtons(theme);
  }

  function toggleTheme() {
    const currentTheme = root.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
  }

  function updateToggleButtons(theme) {
    const themeButtons = document.querySelectorAll('[data-action="toggle-theme"]');
    themeButtons.forEach(btn => {
      btn.setAttribute('aria-pressed', theme === 'dark');
      btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode');
      
      const sunIcon = btn.querySelector('.theme-icon-sun');
      const moonIcon = btn.querySelector('.theme-icon-moon');
      
      if (sunIcon && moonIcon) {
        if (theme === 'dark') {
          sunIcon.style.display = 'block';
          moonIcon.style.display = 'none';
        } else {
          sunIcon.style.display = 'none';
          moonIcon.style.display = 'block';
        }
      }

      const textLabel = btn.querySelector('.theme-label-text');
      if (textLabel) {
        textLabel.textContent = theme === 'dark' ? 'Light Mode' : 'Dark Mode';
      }
    });
  }

  // Setup Event Listeners after DOM loads
  document.addEventListener('DOMContentLoaded', () => {
    initTheme();

    document.querySelectorAll('[data-action="toggle-theme"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        toggleTheme();
      });
    });

    // Listen for system theme changes if user hasn't explicitly set a preference
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
      if (!localStorage.getItem(STORAGE_KEY)) {
        applyTheme(e.matches ? 'dark' : 'light');
      }
    });
  });

  // Expose toggle function globally if needed
  window.LumewoodTheme = {
    toggle: toggleTheme,
    apply: applyTheme,
    get: () => root.getAttribute('data-theme') || 'light'
  };
})();

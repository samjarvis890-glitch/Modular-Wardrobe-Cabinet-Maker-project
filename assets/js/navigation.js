/**
 * LUMEWOOD — NAVIGATION & DROPDOWN CONTROLLER
 * assets/js/navigation.js
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.querySelector('.menu-toggle');
    const drawer = document.querySelector('.mobile-drawer');
    const backdrop = document.querySelector('.drawer-backdrop');
    const closeBtn = document.querySelector('.drawer-close-btn');
    const drawerLinks = document.querySelectorAll('.mobile-drawer a:not(.drawer-submenu-toggle)');
    const submenuToggles = document.querySelectorAll('.drawer-submenu-toggle');
    const desktopDropdowns = document.querySelectorAll('.nav-dropdown');

    let isDrawerOpen = false;

    // 1. Mobile Drawer Functions
    function openDrawer() {
      if (!drawer || !backdrop) return;
      isDrawerOpen = true;
      drawer.classList.add('is-open');
      backdrop.classList.add('is-open');
      if (menuToggle) {
        menuToggle.classList.add('is-active');
        menuToggle.setAttribute('aria-expanded', 'true');
      }
      document.body.style.overflow = 'hidden';
      if (closeBtn) closeBtn.focus();
    }

    function closeDrawer() {
      if (!drawer || !backdrop) return;
      isDrawerOpen = false;
      drawer.classList.remove('is-open');
      backdrop.classList.remove('is-open');
      if (menuToggle) {
        menuToggle.classList.remove('is-active');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.focus();
      }
      document.body.style.overflow = '';
    }

    if (menuToggle) {
      menuToggle.addEventListener('click', (e) => {
        e.preventDefault();
        if (isDrawerOpen) {
          closeDrawer();
        } else {
          openDrawer();
        }
      });
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        closeDrawer();
      });
    }

    if (backdrop) {
      backdrop.addEventListener('click', closeDrawer);
    }

    drawerLinks.forEach(link => {
      link.addEventListener('click', () => {
        closeDrawer();
      });
    });

    // 2. Mobile Drawer Submenu Toggles
    submenuToggles.forEach(toggle => {
      toggle.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = toggle.getAttribute('data-target');
        const submenu = targetId ? document.getElementById(targetId) : toggle.nextElementSibling;
        if (submenu) {
          const isOpen = submenu.classList.contains('is-open');
          submenu.classList.toggle('is-open', !isOpen);
          toggle.setAttribute('aria-expanded', !isOpen);
          
          const icon = toggle.querySelector('.dropdown-chevron');
          if (icon) {
            icon.style.transform = isOpen ? 'rotate(0deg)' : 'rotate(180deg)';
          }
        }
      });
    });

    // 3. Desktop Dropdown Click & Hover Management
    desktopDropdowns.forEach(dropdown => {
      const trigger = dropdown.querySelector('.dropdown-trigger');
      if (trigger) {
        trigger.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          const wasOpen = dropdown.classList.contains('is-open');
          
          // Close other dropdowns
          desktopDropdowns.forEach(d => {
            if (d !== dropdown) {
              d.classList.remove('is-open');
              const t = d.querySelector('.dropdown-trigger');
              if (t) t.setAttribute('aria-expanded', 'false');
            }
          });

          dropdown.classList.toggle('is-open', !wasOpen);
          trigger.setAttribute('aria-expanded', !wasOpen);
        });
      }
    });

    // 4. Dashboard Mobile Sidebar Drawer Handling
    const sidebarToggles = document.querySelectorAll('.sidebar-toggle');
    const dashboardSidebar = document.querySelector('.dashboard-sidebar');
    const dashboardBackdrop = document.querySelector('.dashboard-backdrop');
    const sidebarCloseBtns = document.querySelectorAll('.sidebar-close-btn');
    const sidebarLinks = document.querySelectorAll('.dashboard-sidebar .sidebar-link');

    function openSidebar() {
      if (!dashboardSidebar) return;
      dashboardSidebar.classList.add('is-open');
      dashboardSidebar.setAttribute('aria-hidden', 'false');
      if (dashboardBackdrop) dashboardBackdrop.classList.add('is-open');
      sidebarToggles.forEach(btn => btn.setAttribute('aria-expanded', 'true'));
      document.body.style.overflow = 'hidden';
      const firstFocusable = dashboardSidebar.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      if (firstFocusable) firstFocusable.focus();
    }

    function closeSidebar() {
      if (!dashboardSidebar) return;
      dashboardSidebar.classList.remove('is-open');
      dashboardSidebar.setAttribute('aria-hidden', 'true');
      if (dashboardBackdrop) dashboardBackdrop.classList.remove('is-open');
      sidebarToggles.forEach(btn => {
        btn.setAttribute('aria-expanded', 'false');
      });
      document.body.style.overflow = '';
    }

    sidebarToggles.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        if (dashboardSidebar && dashboardSidebar.classList.contains('is-open')) {
          closeSidebar();
        } else {
          openSidebar();
        }
      });
    });

    sidebarCloseBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        closeSidebar();
      });
    });

    if (dashboardBackdrop) {
      dashboardBackdrop.addEventListener('click', closeSidebar);
    }

    // Auto-close sidebar on link click for mobile/tablet screens
    sidebarLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 1280 && dashboardSidebar && dashboardSidebar.classList.contains('is-open')) {
          closeSidebar();
        }
      });
    });

    // 5. Global Keyboard (Escape), Outside Click & Screen Resize
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (isDrawerOpen) {
          closeDrawer();
        }
        if (dashboardSidebar && dashboardSidebar.classList.contains('is-open')) {
          closeSidebar();
        }
        desktopDropdowns.forEach(d => {
          d.classList.remove('is-open');
          const t = d.querySelector('.dropdown-trigger');
          if (t) t.setAttribute('aria-expanded', 'false');
        });
      }
    });

    document.addEventListener('click', (e) => {
      desktopDropdowns.forEach(dropdown => {
        if (!dropdown.contains(e.target)) {
          dropdown.classList.remove('is-open');
          const trigger = dropdown.querySelector('.dropdown-trigger');
          if (trigger) trigger.setAttribute('aria-expanded', 'false');
        }
      });
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 1280) {
        if (isDrawerOpen) closeDrawer();
        if (dashboardSidebar && dashboardSidebar.classList.contains('is-open')) {
          closeSidebar();
        }
      }
    });
  });
})();

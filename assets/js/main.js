/**
 * LUMEWOOD — MAIN APPLICATION SCRIPT
 * assets/js/main.js
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    // 1. Sticky Header scroll effect
    const header = document.querySelector('.site-header');
    if (header) {
      const handleScroll = () => {
        if (window.scrollY > 20) {
          header.classList.add('is-scrolled');
        } else {
          header.classList.remove('is-scrolled');
        }
      };

      window.addEventListener('scroll', handleScroll, { passive: true });
      handleScroll(); // Initial check
    }

    // 2. Scroll Reveal Animations with IntersectionObserver
    const revealElements = document.querySelectorAll('.reveal');
    if (revealElements.length > 0) {
      if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
              observer.unobserve(entry.target);
            }
          });
        }, {
          root: null,
          threshold: 0.1,
          rootMargin: '0px 0px -40px 0px'
        });

        revealElements.forEach(el => revealObserver.observe(el));
      } else {
        // Fallback for browsers without IntersectionObserver
        revealElements.forEach(el => el.classList.add('is-visible'));
      }
    }

    // 3. Smooth scrolling for hash links
    document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          e.preventDefault();
          const headerHeight = header ? header.offsetHeight : 0;
          const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;

          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
    // 4. Gallery Filter Pills active state
    const filterPills = document.querySelectorAll('.gallery-filter-pill');
    if (filterPills.length > 0) {
      filterPills.forEach(pill => {
        pill.addEventListener('click', () => {
          filterPills.forEach(p => p.classList.remove('is-active'));
          pill.classList.add('is-active');
        });
      });
    }

    // 5. Blog Category Filter System
    const blogFilterBtns = document.querySelectorAll('.blog-filter-btn');
    const blogCards = document.querySelectorAll('.blog-card');

    if (blogFilterBtns.length > 0 && blogCards.length > 0) {
      blogFilterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          blogFilterBtns.forEach(b => b.classList.remove('is-active'));
          btn.classList.add('is-active');

          const filterValue = btn.getAttribute('data-filter') || 'all';

          blogCards.forEach(card => {
            const cardCategory = card.getAttribute('data-category') || '';
            if (filterValue === 'all' || cardCategory.toLowerCase() === filterValue.toLowerCase()) {
              card.classList.remove('is-hidden');
              card.style.opacity = '0';
              setTimeout(() => {
                card.style.opacity = '1';
              }, 50);
            } else {
              card.classList.add('is-hidden');
            }
          });
        });
      });
    }

    // 6. Accessible Article Reader Modal
    const articleModalBackdrop = document.getElementById('article-modal-backdrop');
    const articleModalClose = document.getElementById('article-modal-close');
    const modalCategory = document.getElementById('modal-article-category');
    const modalTitle = document.getElementById('modal-article-title');
    const modalImage = document.getElementById('modal-article-image');
    const modalBody = document.getElementById('modal-article-content');
    const articleTriggers = document.querySelectorAll('[data-action="open-article"]');

    function openArticleModal(data) {
      if (!articleModalBackdrop) return;
      if (modalCategory) modalCategory.textContent = data.category || 'DESIGN JOURNAL';
      if (modalTitle) modalTitle.textContent = data.title || 'Journal Article';
      if (modalImage && data.image) {
        modalImage.src = data.image;
        modalImage.alt = data.title || 'LumeWood Journal';
      }
      if (modalBody && data.content) {
        modalBody.innerHTML = data.content;
      }
      articleModalBackdrop.classList.add('is-open');
      articleModalBackdrop.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      if (articleModalClose) articleModalClose.focus();
    }

    function closeArticleModal() {
      if (!articleModalBackdrop) return;
      articleModalBackdrop.classList.remove('is-open');
      articleModalBackdrop.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    if (articleTriggers.length > 0 && articleModalBackdrop) {
      articleTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
          e.preventDefault();
          const card = trigger.closest('.blog-card, .blog-featured-card');
          if (card) {
            const title = card.querySelector('.blog-card-title, .blog-featured-title')?.textContent.trim() || '';
            const category = card.querySelector('.blog-card-tag, .blog-meta-row span')?.textContent.trim() || '';
            const img = card.querySelector('img')?.getAttribute('src') || '';
            const desc = card.querySelector('.blog-card-desc, .blog-featured-desc')?.textContent.trim() || '';
            
            const detailedContent = `
              <p class="lead" style="font-size: 1.05rem; font-weight: 500; color: var(--color-text-deep); margin-bottom: 20px;">${desc}</p>
              <h3>Architectural Consideration</h3>
              <p>When designing residential joinery, the conversation starts with the structural realities of the room. Proportion, natural illumination, ceiling datum lines, and circulation paths determine whether a wardrobe feels native to the architecture or like an imposed piece of standalone furniture.</p>
              <h3>Material Harmony & Tactility</h3>
              <p>Combining grain-matched natural veneers with understated matte surfaces creates a balanced textural dialogue. The goal is visual calm: cabinetry that recedes gracefully into the background while providing an exquisite tactile sensation every time a door or drawer is opened.</p>
              <h3>Internal Planning for Everyday Life</h3>
              <p>True luxury in storage lies in bespoke internal organization. Tailored hanging heights, soft-closing dovetailed drawers, dedicated accessory trays, and warm 2700K integrated LED illumination transform daily morning and evening routines into seamless moments of calm.</p>
            `;

            openArticleModal({
              title,
              category,
              image: img,
              content: detailedContent
            });
          }
        });
      });

      if (articleModalClose) {
        articleModalClose.addEventListener('click', closeArticleModal);
      }

      articleModalBackdrop.addEventListener('click', (e) => {
        if (e.target === articleModalBackdrop) {
          closeArticleModal();
        }
      });

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && articleModalBackdrop.classList.contains('is-open')) {
          closeArticleModal();
        }
      });
    }

    // 7. Project Enquiry Form Submission & File Upload Handler
    const enquiryForm = document.getElementById('project-enquiry-form');
    const fileInput = document.getElementById('reference-file');
    const fileNameDisplay = document.getElementById('file-name-display');
    const formSuccessAlert = document.getElementById('form-success-alert');

    if (fileInput && fileNameDisplay) {
      fileInput.addEventListener('change', () => {
        if (fileInput.files && fileInput.files.length > 0) {
          fileNameDisplay.textContent = `Selected: ${fileInput.files[0].name}`;
          fileNameDisplay.style.display = 'block';
        } else {
          fileNameDisplay.textContent = '';
          fileNameDisplay.style.display = 'none';
        }
      });
    }

    if (enquiryForm) {
      enquiryForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Check required fields
        if (!enquiryForm.checkValidity()) {
          enquiryForm.reportValidity();
          return;
        }

        const submitBtn = enquiryForm.querySelector('button[type="submit"]');
        const originalBtnHtml = submitBtn ? submitBtn.innerHTML : '';

        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.innerHTML = `
            <span>SUBMITTING ENQUIRY...</span>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" style="animation: spin 1s linear infinite;"><circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle><path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"></path></svg>
          `;
        }

        setTimeout(() => {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnHtml;
          }

          if (formSuccessAlert) {
            formSuccessAlert.style.display = 'block';
            formSuccessAlert.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }

          enquiryForm.reset();
          if (fileNameDisplay) {
            fileNameDisplay.textContent = '';
            fileNameDisplay.style.display = 'none';
          }
        }, 800);
      });
    }
  });
})();

/**
 * UNIITED SECURITY FORCE — Official Site Scripts
 * Supports instant in-page separate-page routing,
 * mobile drawer navigation, all-in-one scroll view toggle,
 * sticky header effects, and quote form dispatch simulation.
 */

document.addEventListener('DOMContentLoaded', function () {
  const pages = document.querySelectorAll('.page-view');
  const navLinks = document.querySelectorAll('[data-page]');
  const mobileDrawer = document.querySelector('.mobile-nav-drawer');
  const toggleBtn = document.querySelector('.nav-toggle-btn');
  const viewSingleBtn = document.getElementById('viewSingleBtn');
  const viewAllBtn = document.getElementById('viewAllBtn');

  // 1. Page Switcher Function
  function showPage(pageId, pushState = true) {
    if (!pageId || pageId === '') pageId = 'home';
    
    // Check if element exists
    const targetSection = document.getElementById(pageId);
    if (!targetSection) {
      pageId = 'home';
    }

    // Deactivate view all mode if switching specific page
    document.body.classList.remove('view-all-mode');
    if (viewSingleBtn && viewAllBtn) {
      viewSingleBtn.classList.add('active');
      viewAllBtn.classList.remove('active');
    }

    // Toggle pages
    pages.forEach(page => {
      if (page.id === pageId) {
        page.style.display = 'block';
        page.classList.add('active');
      } else {
        page.style.display = 'none';
        page.classList.remove('active');
      }
    });

    // Toggle active nav links
    navLinks.forEach(link => {
      if (link.getAttribute('data-page') === pageId) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // Close mobile drawer if open
    if (mobileDrawer) {
      mobileDrawer.classList.remove('open');
      if (toggleBtn) {
        toggleBtn.setAttribute('aria-expanded', 'false');
        toggleBtn.innerHTML = '☰';
      }
    }

    // Smooth scroll to top of content
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (pushState) {
      history.pushState({ page: pageId }, '', '#' + pageId);
    }
  }

  // 2. View All Mode Function (Continuous Scroll)
  function showAllPages() {
    document.body.classList.add('view-all-mode');
    pages.forEach(page => {
      page.style.display = 'block';
      page.classList.add('active');
    });
    navLinks.forEach(link => link.classList.remove('active'));
    if (viewSingleBtn && viewAllBtn) {
      viewSingleBtn.classList.remove('active');
      viewAllBtn.classList.add('active');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
    history.pushState({ page: 'all' }, '', '#all');
  }

  // Bind View Mode Buttons if present
  if (viewSingleBtn) {
    viewSingleBtn.addEventListener('click', () => {
      const currentHash = location.hash.replace('#', '') || 'home';
      showPage(currentHash === 'all' ? 'home' : currentHash);
    });
  }
  if (viewAllBtn) {
    viewAllBtn.addEventListener('click', showAllPages);
  }

  // Attach click to all data-page links
  navLinks.forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const pageId = this.getAttribute('data-page');
      showPage(pageId);
    });
  });

  // Handle URL Hash on load & history change
  function handleHashRoute() {
    const hash = window.location.hash.replace('#', '').trim();
    if (hash === 'all') {
      showAllPages();
    } else if (hash && document.getElementById(hash)) {
      showPage(hash, false);
    } else {
      showPage('home', false);
    }
  }

  window.addEventListener('popstate', handleHashRoute);
  window.addEventListener('hashchange', handleHashRoute);
  handleHashRoute();

  // 3. Mobile Drawer Toggle
  if (toggleBtn && mobileDrawer) {
    toggleBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      const isOpen = mobileDrawer.classList.toggle('open');
      toggleBtn.setAttribute('aria-expanded', isOpen);
      toggleBtn.innerHTML = isOpen ? '✕' : '☰';
    });

    document.addEventListener('click', function (e) {
      if (!mobileDrawer.contains(e.target) && !toggleBtn.contains(e.target)) {
        mobileDrawer.classList.remove('open');
        toggleBtn.setAttribute('aria-expanded', 'false');
        toggleBtn.innerHTML = '☰';
      }
    });
  }

  // 4. Sticky Header Scroll Effect
  const header = document.querySelector('.site-header');
  if (header) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }, { passive: true });
  }

  // 5. Interactive Quote Form Dispatch Simulation
  const contactForm = document.querySelector('.contact-form-panel form');
  const feedbackMsg = document.querySelector('.form-feedback-message');

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;

      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Dispatching Inquiry...';

      setTimeout(function () {
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Inquiry Dispatched ✓';
        submitBtn.style.background = 'linear-gradient(135deg, #2E8B57 0%, #1E663B 100%)';
        submitBtn.style.color = '#FFFFFF';

        if (feedbackMsg) {
          feedbackMsg.style.display = 'block';
          feedbackMsg.innerHTML = '<strong>Thank you!</strong> Your inquiry has been routed to our operations directors in Shenbakkam, Vellore. An officer will reach out promptly.';
        }

        contactForm.reset();

        setTimeout(function () {
          submitBtn.innerHTML = originalText;
          submitBtn.style.background = '';
          submitBtn.style.color = '';
        }, 6000);
      }, 900);
    });
  }
});

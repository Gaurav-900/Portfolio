/* ==========================================================================
   THE GAURAV SHARMA GAZETTE INTERACTIVE CORE
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Add JS support flag to enable animations without breaking non-JS fallback
  document.documentElement.classList.add('js-enabled');

  // Initialize all dynamic content and components
  initLiveClock();
  initArticleExpander();
  initIntersectionObserver();
  initNetlifyFormHandler();
  triggerInkStamp();
});

/**
 * 1. Live Vintage Clock
 * Calculates and formats the current date to match a traditional newspaper header.
 */
function initLiveClock() {
  const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  function fmtDate(d) {
    return DAYS[d.getDay()] + ', ' + MONTHS[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear();
  }

  const liveDateEl = document.getElementById('liveDate');
  const liveDateShortEl = document.getElementById('liveDateShort');
  
  const currentDate = new Date();
  const formattedDate = fmtDate(currentDate);

  if (liveDateEl) {
    liveDateEl.textContent = formattedDate;
  }
  if (liveDateShortEl) {
    liveDateShortEl.textContent = formattedDate;
  }
}

/**
 * 2. Smooth Scroll Navigation
 * Allows anchors to smoothly scroll to corresponding newspaper columns.
 */
window.go = function(id) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' });
    // Highlight the target briefly for visual feedback
    el.style.outline = '1px dashed var(--accent)';
    setTimeout(() => {
      el.style.outline = 'none';
    }, 1000);
  }
};

/**
 * 3. Smooth Article Accordion Toggles
 * Handles reading expanded columns with height and opacity transitions.
 */
function initArticleExpander() {
  const expandButtons = document.querySelectorAll('.expand-btn');
  
  expandButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      const el = document.getElementById(targetId);
      if (!el) return;

      const isOpen = el.classList.toggle('open');
      
      // Update label with rotation arrow
      if (isOpen) {
        btn.textContent = 'Close ▲';
      } else {
        if (targetId === 'gspaint') {
          btn.textContent = 'Read Full Story ▼';
        } else {
          btn.textContent = 'Read More ▼';
        }
      }
    });
  });
}

/**
 * 4. Scroll Reveal Intersection Observer
 * Fades and slides columns up as they enter the screen.
 */
function initIntersectionObserver() {
  if (!('IntersectionObserver' in window)) {
    // If browser doesn't support IntersectionObserver, show everything immediately
    document.querySelectorAll('.reveal-col').forEach(col => {
      col.classList.add('visible');
    });
    return;
  }

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -40px 0px', // Trigger slightly before it hits the viewport fold
    threshold: 0.05
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // Stop observing once triggered
      }
    });
  }, observerOptions);

  document.querySelectorAll('.reveal-col').forEach(col => {
    revealObserver.observe(col);
  });
}

/**
 * 5. Stamp Slam Entrance Effect
 * Adds the visual ink stamp mark to the newspaper after load.
 */
function triggerInkStamp() {
  const stamp = document.getElementById('hireStamp');
  if (stamp) {
    setTimeout(() => {
      stamp.classList.add('stamped');
    }, 400);
  }
}

/**
 * 6. Netlify AJAX Form Submission
 * Collects form inputs and submits them securely to Netlify's processing bot.
 */
function initNetlifyFormHandler() {
  const form = document.getElementById('contact-form');
  const submitBtn = document.getElementById('submit-btn');

  if (!form || !submitBtn) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Visual loading state
    submitBtn.disabled = true;
    submitBtn.textContent = 'Dispatched Transmitting...';
    submitBtn.style.background = 'var(--ink3)';

    const formData = new FormData(form);

    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(formData).toString()
    })
    .then(response => {
      if (response.ok) {
        submitBtn.textContent = 'Dispatch Sent ✓';
        submitBtn.style.background = '#1a5c1a';
        form.reset();
        
        // Return button to default state after visual delay
        setTimeout(() => {
          submitBtn.textContent = 'Submit Dispatch →';
          submitBtn.style.background = 'var(--ink)';
          submitBtn.disabled = false;
        }, 4000);
      } else {
        throw new Error('Connection error during submission');
      }
    })
    .catch(error => {
      console.error('Submission failed:', error);
      submitBtn.textContent = 'Dispatch Failed ✗';
      submitBtn.style.background = 'var(--accent)';
      
      setTimeout(() => {
        submitBtn.textContent = 'Submit Dispatch →';
        submitBtn.style.background = 'var(--ink)';
        submitBtn.disabled = false;
      }, 4000);
    });
  });
}

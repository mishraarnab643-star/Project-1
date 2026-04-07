/**
 * PRAYASH COMPETITIVE COACHING — script.js
 * Handles: Scroll animations, Navbar spy, Course expand,
 *          Teacher modal, Count-up, Ripple, Scroll-to-top,
 *          Mobile nav, Sticky navbar shadow
 */

/* =============================================
   1. DOM REFERENCES
============================================= */
const navbar       = document.getElementById('navbar');
const navToggle    = document.getElementById('navToggle');
const navLinks     = document.getElementById('navLinks');
const navLinkItems = document.querySelectorAll('.nav-link');
const scrollTopBtn = document.getElementById('scrollTop');
const teacherModal = document.getElementById('teacherModal');
const modalClose   = document.getElementById('modalClose');
const modalContent = document.getElementById('modalContent');

/* =============================================
   2. TEACHER DATA
   Edit this array to update teacher profiles
============================================= */
const teachers = [
  {
    name: 'Maths Expert',
    role: 'Quantitative Aptitude Faculty',
    icon: 'fas fa-user-tie',
    bio: 'A highly experienced educator specializing in Quantitative Aptitude and Reasoning. Expert in shortcut techniques for Railway, Banking, and SSC exams with an impressive track record of student selections.',
    subjects: ['Quantitative Aptitude', 'Reasoning', 'Data Interpretation', 'Railway', 'Banking', 'SSC'],
  },
  {
    name: 'English Specialist',
    role: 'English Language & Literature',
    icon: 'fas fa-user-tie',
    bio: 'An English language expert focused on Grammar, Reading Comprehension, and Vocabulary building strategies tailored for competitive exams. Students see measurable improvement in just weeks.',
    subjects: ['Grammar', 'Comprehension', 'Vocabulary', 'SSC', 'Banking', 'B.Ed'],
  },
  {
    name: 'GK & Current Affairs',
    role: 'General Awareness Mentor',
    icon: 'fas fa-user-tie',
    bio: 'Passionate about General Knowledge and current events with a focus on Odisha state-level GK. Keeps students updated daily and makes complex topics easy to remember with mnemonic techniques.',
    subjects: ['General Knowledge', 'Current Affairs', 'Odisha GK', 'OSSC', 'OSSSC', 'Railway'],
  },
  {
    name: 'Computer Faculty',
    role: 'IT & Computer Applications',
    icon: 'fas fa-user-tie',
    bio: 'Experienced computer instructor covering MS Office, Tally, Typing, and full OS-CIT / PGDCA / DCA syllabi. Combines theory with hands-on practical sessions for real job-ready skills.',
    subjects: ['MS Office', 'Tally', 'Typing', 'OS-CIT', 'DCA', 'PGDCA'],
  },
];

/* =============================================
   3. SCROLL REVEAL (Intersection Observer)
   Adds .visible class to .reveal-up elements as they enter viewport
============================================= */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Honour CSS --delay custom property for staggered animations
        entry.target.classList.add('visible');
        // Unobserve after first reveal (no need to repeat)
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

// Observe all reveal-up elements
document.querySelectorAll('.reveal-up').forEach((el) => revealObserver.observe(el));

/* =============================================
   4. SCROLL SPY — Active navbar link
   Highlights the nav link matching the current section in view
============================================= */
const sections = document.querySelectorAll('section[id]');

function updateActiveLink() {
  const scrollY = window.scrollY + 100;

  sections.forEach((section) => {
    const sectionTop    = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const sectionId     = section.getAttribute('id');

    if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
      navLinkItems.forEach((link) => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${sectionId}`) {
          link.classList.add('active');
        }
      });
    }
  });
}

/* =============================================
   5. STICKY NAVBAR SHADOW on scroll
============================================= */
function handleNavbarScroll() {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}

/* =============================================
   6. SCROLL TO TOP BUTTON visibility
============================================= */
function handleScrollTopBtn() {
  if (window.scrollY > 400) {
    scrollTopBtn.classList.add('visible');
  } else {
    scrollTopBtn.classList.remove('visible');
  }
}

// Scroll to top on click
scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Bind all scroll handlers
window.addEventListener('scroll', () => {
  updateActiveLink();
  handleNavbarScroll();
  handleScrollTopBtn();
  triggerCounters();
}, { passive: true });

/* =============================================
   7. MOBILE NAV TOGGLE
   Opens/closes the slide-in menu
============================================= */
navToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  navToggle.classList.toggle('open', isOpen);
  // Prevent body scroll when menu open
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

// Close nav when a link is clicked
navLinks.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// Close nav on outside click
document.addEventListener('click', (e) => {
  if (navLinks.classList.contains('open') &&
      !navLinks.contains(e.target) &&
      !navToggle.contains(e.target)) {
    navLinks.classList.remove('open');
    navToggle.classList.remove('open');
    document.body.style.overflow = '';
  }
});

/* =============================================
   8. RIPPLE EFFECT
   Attaches to any element with class .ripple on click
============================================= */
function createRipple(e) {
  const btn = e.currentTarget;
  const rect = btn.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const x = e.clientX - rect.left - size / 2;
  const y = e.clientY - rect.top - size / 2;

  const circle = document.createElement('span');
  circle.classList.add('ripple-circle');
  circle.style.cssText = `
    width: ${size}px;
    height: ${size}px;
    left: ${x}px;
    top: ${y}px;
  `;

  btn.appendChild(circle);
  // Remove the element after animation ends
  circle.addEventListener('animationend', () => circle.remove());
}

document.querySelectorAll('.ripple').forEach((el) => {
  el.addEventListener('click', createRipple);
});

/* =============================================
   9. COURSE CARD EXPAND / COLLAPSE on click
   Toggles .expanded class and updates hint text chevron
============================================= */
document.querySelectorAll('.course-card').forEach((card) => {
  card.addEventListener('click', (e) => {
    // Don't collapse if user clicked the "Enroll" button inside
    if (e.target.closest('.btn')) return;

    const isExpanded = card.classList.contains('expanded');

    // Close all cards first (accordion behaviour)
    document.querySelectorAll('.course-card.expanded').forEach((c) => {
      c.classList.remove('expanded');
    });

    // Open clicked card if it wasn't already open
    if (!isExpanded) {
      card.classList.add('expanded');
    }
  });
});

/* =============================================
   10. TEACHER MODAL
   Opens a popup with full teacher profile on card click
============================================= */
function openTeacherModal(index) {
  const t = teachers[index];
  if (!t) return;

  // Build modal HTML dynamically
  const subjectsHTML = t.subjects
    .map((s) => `<span>${s}</span>`)
    .join('');

  modalContent.innerHTML = `
    <div class="modal-avatar-big">
      <i class="${t.icon}"></i>
    </div>
    <div class="modal-name">${t.name}</div>
    <div class="modal-role">${t.role}</div>
    <p class="modal-bio">${t.bio}</p>
    <div class="modal-subjects">${subjectsHTML}</div>
    <a href="https://forms.gle/yourFormLink" target="_blank" class="btn btn-primary ripple" style="width:100%;justify-content:center">
      <i class="fas fa-pen-to-square"></i> Enroll in Their Batch
    </a>
  `;

  teacherModal.classList.add('open');
  document.body.style.overflow = 'hidden';

  // Re-attach ripple to the newly injected button
  modalContent.querySelectorAll('.ripple').forEach((el) => {
    el.addEventListener('click', createRipple);
  });
}

// Attach click handler to each teacher card
document.querySelectorAll('.teacher-card').forEach((card) => {
  card.addEventListener('click', () => {
    const index = parseInt(card.dataset.teacher, 10);
    openTeacherModal(index);
  });
});

// Close modal on close button or overlay click
function closeModal() {
  teacherModal.classList.remove('open');
  document.body.style.overflow = '';
}

modalClose.addEventListener('click', closeModal);
teacherModal.addEventListener('click', (e) => {
  if (e.target === teacherModal) closeModal();
});

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

/* =============================================
   11. COUNT-UP ANIMATION for Results section
   Triggered once when counters enter the viewport
============================================= */
let countersStarted = false;

function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 1800; // ms
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // Ease-out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target);

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      el.textContent = target; // ensure exact final value
    }
  }

  requestAnimationFrame(update);
}

// Observe the results section
const resultsSection = document.getElementById('results');

function triggerCounters() {
  if (countersStarted || !resultsSection) return;

  const rect = resultsSection.getBoundingClientRect();
  if (rect.top < window.innerHeight * 0.85) {
    countersStarted = true;
    document.querySelectorAll('.counter-num').forEach((counter) => {
      animateCounter(counter);
    });
  }
}

/* =============================================
   12. SMOOTH SCROLL for anchor links
   Overrides default jump and offsets for sticky navbar
============================================= */
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (e) => {
    const targetId = anchor.getAttribute('href');
    if (targetId === '#') return;

    const target = document.querySelector(targetId);
    if (!target) return;

    e.preventDefault();
    const navHeight = navbar.offsetHeight;
    const targetTop = target.getBoundingClientRect().top + window.scrollY - navHeight - 10;

    window.scrollTo({ top: targetTop, behavior: 'smooth' });
  });
});

/* =============================================
   13. INIT — run on page load
============================================= */
(function init() {
  updateActiveLink();
  handleNavbarScroll();
  handleScrollTopBtn();
  triggerCounters();

  // Trigger reveal for elements already in view on load
  document.querySelectorAll('.reveal-up').forEach((el) => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight) {
      el.classList.add('visible');
    }
  });
})();

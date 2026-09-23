/**
 * TWN Media - Premium Agency Interactive Features
 * Lenis Smooth Scrolling, Angepasstes 3D-Tilt, Custom Cursor,
 * Formular-Handling und scrollbare Pop-Up Modals
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // ==========================================================================
  // 1. Lenis Butter-Smooth Scrolling Integration
  // ==========================================================================
  let lenis = null;
  if (typeof Lenis !== 'undefined') {
    lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    if (typeof ScrollTrigger !== 'undefined') {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);
    }
  }

  // ==========================================================================
  // 2. Interactive Custom Cursor mit Magnetik
  // ==========================================================================
  const cursorDot = document.querySelector('.custom-cursor');
  const cursorFollower = document.querySelector('.custom-cursor-follower');

  if (cursorDot && cursorFollower && window.matchMedia('(pointer: fine)').matches) {
    let mouseX = -100, mouseY = -100;
    let followerX = -100, followerY = -100;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
    }, { passive: true });

    function animateFollower() {
      followerX += (mouseX - followerX) * 0.16;
      followerY += (mouseY - followerY) * 0.16;
      cursorFollower.style.transform = `translate(${followerX}px, ${followerY}px)`;
      requestAnimationFrame(animateFollower);
    }
    requestAnimationFrame(animateFollower);

    // Hover auf interaktiven Elementen
    const interactiveElements = document.querySelectorAll('a, button, input, textarea, select, .tilt-card, .service-card, label');
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursorDot.classList.add('hovering');
        cursorFollower.classList.add('hovering');
      });
      el.addEventListener('mouseleave', () => {
        cursorDot.classList.remove('hovering');
        cursorFollower.classList.remove('hovering');
      });
    });

    window.addEventListener('mousedown', () => {
      cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px) scale(0.7)`;
      cursorFollower.style.transform = `translate(${followerX}px, ${followerY}px) scale(0.85)`;
    });
    window.addEventListener('mouseup', () => {
      cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px) scale(1)`;
      cursorFollower.style.transform = `translate(${followerX}px, ${followerY}px) scale(1)`;
    });
  }

  // ==========================================================================
  // 3. 3D Card Tilt (Seriös & Dezent bei Preisen, Lebendig bei Services)
  // ==========================================================================
  const tiltCards = document.querySelectorAll('.tilt-card, .service-card, .business-card-showcase');

  tiltCards.forEach(card => {
    let glare = card.querySelector('.card-glare');
    if (!glare) {
      glare = document.createElement('div');
      glare.className = 'card-glare';
      card.appendChild(glare);
    }

    const isPricing = card.classList.contains('pricing-card');
    // Preiskarten nur minimal neigen (seriös: max 2.2 Grad), Services dynamischer (8 Grad)
    const maxRot = isPricing ? 2.2 : 8.0;
    const maxZ = isPricing ? 3 : 8;

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((y - centerY) / centerY) * -maxRot;
      const rotateY = ((x - centerX) / centerX) * maxRot;

      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateZ(${maxZ}px)`;
      
      const glareIntensity = isPricing ? 0.08 : 0.14;
      glare.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255, 255, 255, ${glareIntensity}) 0%, transparent 65%)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0)';
      glare.style.background = 'transparent';
    });
  });

  // ==========================================================================
  // 4. Header scroll state & Anchor smooth scrolling
  // ==========================================================================
  const header = document.querySelector('.glass-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  }, { passive: true });

  // Mobile navigation
  const mobileToggle = document.querySelector('.mobile-toggle');
  const mobileNav = document.querySelector('.mobile-nav');
  const mobileLinks = document.querySelectorAll('.mobile-nav .nav-link, .mobile-nav .btn');

  function openMobileNav() {
    mobileToggle?.classList.add('active');
    mobileNav?.classList.add('open');
    if (lenis) lenis.stop();
    document.body.style.overflow = 'hidden';
  }

  function closeMobileNav() {
    mobileToggle?.classList.remove('active');
    mobileNav?.classList.remove('open');
    if (lenis) lenis.start();
    document.body.style.overflow = '';
  }

  mobileToggle?.addEventListener('click', () => {
    if (mobileNav?.classList.contains('open')) {
      closeMobileNav();
    } else {
      openMobileNav();
    }
  });

  mobileLinks.forEach(link => link.addEventListener('click', closeMobileNav));

  // Anchor links smooth navigation
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const headerOffset = 70;
        
        if (lenis) {
          lenis.scrollTo(targetEl, { offset: -headerOffset, duration: 1.2 });
        } else {
          const elementPosition = targetEl.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
        }
      }
    });
  });

  // ==========================================================================
  // 5. GSAP Entrance Animations
  // ==========================================================================
  if (typeof gsap !== 'undefined') {
    const heroTl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 1 } });

    heroTl
      .from('.hero-badge', { y: 25, opacity: 0, delay: 0.15 })
      .from('.hero-title', { y: 40, opacity: 0, duration: 1.1 }, '-=0.7')
      .from('.hero-subtitle', { y: 25, opacity: 0 }, '-=0.8')
      .from('.hero-slogan-wrap', { y: 20, opacity: 0 }, '-=0.7')
      .from('.hero-actions .btn', { y: 20, opacity: 0, stagger: 0.15 }, '-=0.6')
      .from('.trust-item', { y: 15, opacity: 0, stagger: 0.1 }, '-=0.5');

    if (typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);

      gsap.utils.toArray('.section-header').forEach(sh => {
        gsap.from(sh.children, {
          scrollTrigger: {
            trigger: sh,
            start: 'top 88%',
            toggleActions: 'play none none none',
          },
          y: 30,
          opacity: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power2.out',
        });
      });

      gsap.from('.pricing-card', {
        scrollTrigger: {
          trigger: '.pricing-grid',
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
        y: 35,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
      });
    }
  }

  // ==========================================================================
  // 6. Interactive Package Selection via Buttons
  // ==========================================================================
  const packageButtons = document.querySelectorAll('[data-select-package]');
  const packageInputs = document.querySelectorAll('input[name="paket"]');

  packageButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const selectedPackage = btn.getAttribute('data-select-package');
      if (selectedPackage) {
        packageInputs.forEach(input => {
          if (input.value === selectedPackage) {
            input.checked = true;
          }
        });
      }
    });
  });

  // ==========================================================================
  // 7. Contact Form Handling
  // ==========================================================================
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');

  contactForm?.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('name')?.value.trim();
    const email = document.getElementById('email')?.value.trim();
    const message = document.getElementById('message')?.value.trim();
    const dsgvo = document.getElementById('dsgvo')?.checked;
    const selectedPkg = document.querySelector('input[name="paket"]:checked')?.value || 'Individuell';

    if (!name || !email || !message || !dsgvo) {
      showFormStatus('error', 'Bitte füllen Sie alle Pflichtfelder aus und bestätigen Sie die Datenschutzerklärung.');
      return;
    }

    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `Wird übertragen...`;

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;

      showFormStatus('success', `Vielen Dank, ${name}! Ihre Anfrage für das Paket „${selectedPkg}“ wurde erfolgreich entgegengenommen. Wir melden uns binnen 24 Stunden persönlich bei Ihnen.`);
      contactForm.reset();

      const defaultRadio = document.getElementById('pkg-premium');
      if (defaultRadio) defaultRadio.checked = true;
    }, 800);
  });

  function showFormStatus(type, text) {
    if (!formStatus) return;
    formStatus.className = `form-status ${type}`;
    formStatus.innerHTML = text;
    formStatus.style.display = 'block';

    if (type === 'success') {
      setTimeout(() => {
        formStatus.style.display = 'none';
      }, 9000);
    }
  }

  // ==========================================================================
  // 8. SCROLLBARE POP-UP MODALS MIT NATIVEM SCROLL-SUPPORT
  // ==========================================================================
  const modalImpressum = document.getElementById('modal-impressum');
  const modalDatenschutz = document.getElementById('modal-datenschutz');

  function openModal(dialog) {
    if (!dialog) return;
    if (typeof dialog.showModal === 'function') {
      dialog.showModal();
    } else {
      dialog.setAttribute('open', '');
    }
    // Wichtig: Lenis stoppen für den Hintergrund, aber Dialog behält data-lenis-prevent
    if (lenis) lenis.stop();
  }

  function closeModal(dialog) {
    if (!dialog) return;
    if (typeof dialog.close === 'function') {
      dialog.close();
    } else {
      dialog.removeAttribute('open');
    }
    if (lenis) lenis.start();
  }

  // Open triggers
  document.querySelectorAll('[data-open-modal]').forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const modalId = trigger.getAttribute('data-open-modal');
      const targetDialog = document.getElementById(modalId);
      if (targetDialog) {
        openModal(targetDialog);
      }
    });
  });

  // Close triggers
  document.querySelectorAll('.dialog-close, [data-close-modal]').forEach(closeBtn => {
    closeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const dialog = closeBtn.closest('dialog');
      if (dialog) {
        closeModal(dialog);
      }
    });
  });

  // Close when clicking directly on the backdrop (outside modal card)
  [modalImpressum, modalDatenschutz].forEach(dialog => {
    if (!dialog) return;

    // Radikale Absicherung: Wheel und Touch Events im Dialog dürfen NICHT vom Dokument abgefangen werden!
    dialog.addEventListener('wheel', (e) => {
      e.stopPropagation();
    }, { passive: true });

    dialog.addEventListener('touchmove', (e) => {
      e.stopPropagation();
    }, { passive: true });

    dialog.addEventListener('click', (e) => {
      const rect = dialog.getBoundingClientRect();
      const isInDialog = (
        rect.top <= e.clientY &&
        e.clientY <= rect.top + rect.height &&
        rect.left <= e.clientX &&
        e.clientX <= rect.left + rect.width
      );
      if (!isInDialog) {
        closeModal(dialog);
      }
    });

    dialog.addEventListener('cancel', () => {
      if (lenis) lenis.start();
    });
  });

  // Back to top button
  const backToTopBtn = document.querySelector('.btn-back-to-top');
  backToTopBtn?.addEventListener('click', () => {
    if (lenis) {
      lenis.scrollTo(0, { duration: 1.4 });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });
});

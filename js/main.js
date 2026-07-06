/**
 * Sahil Pathan Portfolio - Main Javascript File
 * Pure Vanilla JS + GSAP animations (Bootstrap 5 compatible, no jQuery dependency)
 */

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // 1. Preloader Screen & GSAP Entry Reveal
  // ==========================================
  const preloader = document.getElementById('preloader');
  
  const triggerEntryAnimations = () => {
    if (typeof gsap !== 'undefined') {
      // Set initial states to avoid flash of unstyled content
      gsap.set('.hero-sub, .hero-title, .hero-typing-wrap, .hero-description, .hero-buttons, .hero-metrics-grid, .hero-profile-card', { 
        visibility: 'visible' 
      });

      // Entry animations
      gsap.from('.hero-sub', { opacity: 0, y: 20, duration: 0.8, delay: 0.1 });
      gsap.from('.hero-title', { opacity: 0, y: 30, duration: 1, delay: 0.2, ease: 'power3.out' });
      gsap.from('.hero-typing-wrap', { opacity: 0, y: 20, duration: 0.8, delay: 0.3 });
      gsap.from('.hero-description', { opacity: 0, y: 25, duration: 0.8, delay: 0.4 });
      gsap.from('.hero-buttons', { opacity: 0, y: 20, duration: 0.8, delay: 0.5 });
      gsap.from('.hero-metrics-grid', { opacity: 0, y: 20, duration: 0.8, delay: 0.6 });
      
      // Profile card scaling & float intro
      gsap.from('.hero-profile-card', { 
        opacity: 0, 
        scale: 0.85, 
        y: 40,
        rotationY: 15,
        duration: 1.2, 
        delay: 0.5, 
        ease: 'back.out(1.2)' 
      });
    }
  };

  const hidePreloader = () => {
    if (preloader && !preloader.classList.contains('fade-out')) {
      preloader.classList.add('fade-out');
      triggerEntryAnimations();
    }
  };

  if (preloader) {
    if (document.readyState === 'complete') {
      hidePreloader();
    } else {
      window.addEventListener('load', hidePreloader);
      // Fallback in case window load event fails to fire
      setTimeout(hidePreloader, 2500);
    }
  } else {
    triggerEntryAnimations();
  }

  // ==========================================
  // 2. Initialize AOS (Animate on Scroll)
  // ==========================================
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      easing: 'ease-out-quad',
      once: true,
      offset: 100,
      delay: 50
    });
  }

  // ==========================================
  // 3. Custom Cursor Follower
  // ==========================================
  const cursor = document.getElementById('customCursor');
  const cursorDot = document.getElementById('customCursorDot');

  if (cursor && cursorDot) {
    let mouseX = -100, mouseY = -100;
    let cursorX = -100, cursorY = -100;
    let isMoving = false;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      isMoving = true;

      // Position inner dot instantly
      cursorDot.style.left = `${mouseX}px`;
      cursorDot.style.top = `${mouseY}px`;
      cursorDot.style.opacity = '1';
    });

    // Lerped outer circle animation
    const renderCursorRing = () => {
      if (isMoving) {
        let dx = mouseX - cursorX;
        let dy = mouseY - cursorY;

        cursorX += dx * 0.12; // Lerp factor (lag speed)
        cursorY += dy * 0.12;

        cursor.style.left = `${cursorX}px`;
        cursor.style.top = `${cursorY}px`;
        cursor.style.opacity = '1';
      }
      requestAnimationFrame(renderCursorRing);
    };
    renderCursorRing();

    // Hover scale effects on interactive elements
    const hoverables = document.querySelectorAll('a, button, .btn, .project-card, .cert-card, .skill-pill, .form-control-custom, .navbar-toggler');
    hoverables.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.classList.add('custom-cursor-hover');
      });
      el.addEventListener('mouseleave', () => {
        cursor.classList.remove('custom-cursor-hover');
      });
    });

    // Hide cursor when leaving window
    document.addEventListener('mouseleave', () => {
      cursor.style.opacity = '0';
      cursorDot.style.opacity = '0';
      isMoving = false;
    });
  }

  // ==========================================
  // 4. Interactive Canvas Particles Background
  // ==========================================
  const canvas = document.getElementById('particleCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouse = { x: null, y: null, radius: 160 };

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    window.addEventListener('mouseout', () => {
      mouse.x = null;
      mouse.y = null;
    });

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1; // Small clean tech dots
        this.vx = (Math.random() - 0.5) * 0.5; // Natural drift
        this.vy = (Math.random() - 0.5) * 0.5;
        this.density = (Math.random() * 25) + 12; // Repulsion factor
      }

      draw() {
        ctx.fillStyle = 'rgba(6, 182, 212, 0.35)'; // Cyan network node
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
      }

      update() {
        // Natural floating velocity
        this.x += this.vx;
        this.y += this.vy;

        // Boundary bounce
        if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
        if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;

        // Mouse push-back repulsion (data node physics)
        if (mouse.x !== null && mouse.y !== null) {
          let dx = mouse.x - this.x;
          let dy = mouse.y - this.y;
          let distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < mouse.radius) {
            let forceDirectionX = dx / distance;
            let forceDirectionY = dy / distance;
            let force = (mouse.radius - distance) / mouse.radius;
            let directionX = forceDirectionX * force * this.density * 0.5;
            let directionY = forceDirectionY * force * this.density * 0.5;

            // Push nodes away from cursor
            this.x -= directionX;
            this.y -= directionY;
          }
        }
      }
    }

    const initParticles = () => {
      particles = [];
      // Calculate count based on viewport area density
      let count = Math.min(95, Math.floor((canvas.width * canvas.height) / 15000));
      for (let i = 0; i < count; i++) {
        particles.push(new Particle());
      }
    };
    initParticles();

    // Line drawing logic between nearby nodes
    const connect = () => {
      let maxDistance = 110;
      for (let a = 0; a < particles.length; a++) {
        for (let b = a; b < particles.length; b++) {
          let dx = particles[a].x - particles[b].x;
          let dy = particles[a].y - particles[b].y;
          let distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < maxDistance) {
            // Gradient opacity based on distance
            let opacity = (1 - (distance / maxDistance)) * 0.12;
            ctx.strokeStyle = `rgba(6, 182, 212, ${opacity})`;
            ctx.lineWidth = 0.7;
            ctx.beginPath();
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            ctx.stroke();
          }
        }
      }
    };

    const animateParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
      }
      connect();
      requestAnimationFrame(animateParticles);
    };
    animateParticles();

    window.addEventListener('resize', () => {
      resizeCanvas();
      initParticles();
    });
  }

  // ==========================================
  // 5. Typing Animation (Hero Section)
  // ==========================================
  const typingTextEl = document.getElementById('typing-text');
  if (typingTextEl) {
    const roles = [
      "MCA Student", 
      "Aspiring Data Analyst", 
      "Aspiring Data Engineer", 
      "Power BI Developer", 
      "Data Enthusiast"
    ];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 90;

    const type = () => {
      const currentRole = roles[roleIndex];
      
      if (isDeleting) {
        typingTextEl.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
        typeSpeed = 40; // Deletion is faster
      } else {
        typingTextEl.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
        typeSpeed = 90; // Standard typing speed
      }

      if (!isDeleting && charIndex === currentRole.length) {
        isDeleting = true;
        typeSpeed = 2200; // Standstill delay on full title
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        typeSpeed = 400; // Brief delay before typing next
      }

      setTimeout(type, typeSpeed);
    };

    // Begin typing
    setTimeout(type, 1200);
  }

  // ==========================================
  // 6. Scroll Progress & Back to Top Circle
  // ==========================================
  const scrollProgressBar = document.getElementById('scrollProgressBar');
  const backToTopBtn = document.getElementById('backToTop');
  const backToTopProgress = document.getElementById('backToTopProgress');

  if (backToTopProgress) {
    const radius = 45;
    const circumference = 2 * Math.PI * radius; // 282.74
    
    // Set circle circumference
    backToTopProgress.style.strokeDasharray = circumference;
    backToTopProgress.style.strokeDashoffset = circumference;

    const handleScrollEffects = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = docHeight > 0 ? scrollTop / docHeight : 0;

      // Update horizontal top progress bar
      if (scrollProgressBar) {
        scrollProgressBar.style.width = `${scrollPercent * 100}%`;
      }

      // Update circular depth offset
      const offset = circumference - (scrollPercent * circumference);
      backToTopProgress.style.strokeDashoffset = offset;

      // Toggle floating button visibility
      if (scrollTop > 300) {
        backToTopBtn.classList.add('show');
      } else {
        backToTopBtn.classList.remove('show');
      }
    };

    window.addEventListener('scroll', handleScrollEffects);
    handleScrollEffects(); // Initial check

    // Smooth scroll back to top on click
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // ==========================================
  // 7. Navbar Shrink & Shadow on Scroll
  // ==========================================
  const navbar = document.getElementById('mainNavbar');
  const handleNavbarScroll = () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  if (navbar) {
    window.addEventListener('scroll', handleNavbarScroll);
    handleNavbarScroll(); // Initial check
  }

  // ==========================================
  // 8. ScrollSpy (Active Navigation Indicator)
  // ==========================================
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.navbar-custom .nav-link');

  const runScrollSpy = () => {
    let currentId = '';
    const scrollPos = window.scrollY + 150; // Offset for sticky navbar height

    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;

      if (scrollPos >= top && scrollPos < (top + height)) {
        currentId = sec.getAttribute('id');
      }
    });

    if (currentId) {
      navLinks.forEach(link => {
        link.parentElement.classList.remove('active');
        const href = link.getAttribute('href');
        if (href === `#${currentId}`) {
          link.parentElement.classList.add('active');
        }
      });
    }
  };

  window.addEventListener('scroll', runScrollSpy);
  runScrollSpy(); // Run initial spy

  // Navbar link smooth scroll handler
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId.startsWith('#')) {
        e.preventDefault();
        const targetSection = document.querySelector(targetId);
        if (targetSection) {
          const navHeight = navbar ? navbar.offsetHeight : 70;
          const pos = targetSection.offsetTop - navHeight + 5;
          
          window.scrollTo({
            top: pos,
            behavior: 'smooth'
          });

          // Collapse mobile dropdown if open
          const navbarCollapse = document.getElementById('navbarContent');
          if (navbarCollapse.classList.contains('show')) {
            const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
            if (bsCollapse) {
              bsCollapse.hide();
            } else if (typeof bootstrap.Collapse !== 'undefined') {
              new bootstrap.Collapse(navbarCollapse).hide();
            }
          }
        }
      }
    });
  });

  // ==========================================
  // 9. Skill Progress Bar Animation (Observer)
  // ==========================================
  const skillsSection = document.getElementById('skills');
  const progressBars = document.querySelectorAll('.skill-progress-bar');

  if (skillsSection && progressBars.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          progressBars.forEach(bar => {
            const width = bar.getAttribute('data-width');
            bar.style.width = width;
          });
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    observer.observe(skillsSection);
  }

  // ==========================================
  // 10. Project Filtering Logic
  // ==========================================
  const filterBtns = document.querySelectorAll('.project-filters .btn-filter');
  const projectItemCards = document.querySelectorAll('.project-item-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle button states
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterVal = btn.getAttribute('data-filter');

      projectItemCards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (filterVal === 'all' || cat === filterVal) {
          card.classList.remove('hidden');
          // Smooth fade-in
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95) translateY(10px)';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1) translateY(0)';
          }, 60);
        } else {
          card.classList.add('hidden');
        }
      });
      
      // Refresh AOS layout in case positions shifted
      if (typeof AOS !== 'undefined') {
        AOS.refresh();
      }
    });
  });

  // ==========================================
  // 11. 3D Project Card Tilt Effect
  // ==========================================
  const projectCards = document.querySelectorAll('.project-card');
  projectCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      // Disable tilt on small screen viewports for UX clarity
      if (window.innerWidth < 992) return;

      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Max Tilt limit (6 degrees)
      const rotateX = ((centerY - y) / centerY) * 5;
      const rotateY = ((x - centerX) / centerX) * 5;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
    });

    card.style.transition = 'transform 0.1s ease-out'; // Fast tracking transition

    card.addEventListener('mouseleave', () => {
      card.style.transition = 'transform 0.5s ease-out'; // Smooth return transition
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    });
  });

  // ==========================================
  // 12. Animated Stats Counters (Observer)
  // ==========================================
  const countObjects = document.querySelectorAll('.counter-val, .counter-up');

  const countUp = (el) => {
    const target = parseInt(el.getAttribute('data-target'));
    if (isNaN(target)) return;

    let current = 0;
    const duration = 1500; // Animation duration in ms
    const increment = target / (duration / 16); // 60fps refresh rate (approx 16ms)

    const runCount = () => {
      current += increment;
      if (current < target) {
        el.textContent = Math.floor(current);
        requestAnimationFrame(runCount);
      } else {
        el.textContent = target + (el.classList.contains('counter-up') && target === 5 ? '+' : '');
      }
    };
    runCount();
  };

  if (countObjects.length > 0) {
    const statsObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          countUp(entry.target);
          observer.unobserve(entry.target); // Trigger once
        }
      });
    }, { threshold: 0.3 });

    countObjects.forEach(obj => statsObserver.observe(obj));
  }

  // ==========================================
  // 13. Interactive Contact Form Handler
  // ==========================================
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();

      // Form validation
      const name = document.getElementById('formName').value.trim();
      const email = document.getElementById('formEmail').value.trim();
      const subject = document.getElementById('formSubject').value.trim();
      const message = document.getElementById('formMessage').value.trim();
      const submitBtn = contactForm.querySelector('button[type="submit"]');

      if (!name || !email || !message) {
        showFormAlert('Please fill in all required fields.', 'danger');
        return;
      }

      // Basic regex check for email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        showFormAlert('Please enter a valid email address.', 'danger');
        return;
      }

      // Simulate form submission
      const originalBtnText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-circle-notch fa-spin me-2"></i> Sending...';

      setTimeout(() => {
        submitBtn.innerHTML = '<i class="fas fa-check-circle me-2"></i> Message Sent!';
        submitBtn.classList.remove('btn-neon');
        submitBtn.style.backgroundColor = '#10b981'; // Green success color
        submitBtn.style.color = '#fff';
        submitBtn.style.boxShadow = '0 0 15px rgba(16, 185, 129, 0.4)';
        
        showFormAlert('Thank you! Your message has been sent successfully. I will get back to you soon.', 'success');
        
        // Reset form inputs
        contactForm.reset();

        // Revert submit button back to original state
        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnText;
          submitBtn.removeAttribute('style');
          submitBtn.classList.add('btn-neon');
        }, 3000);

      }, 1500);
    });
  }

  function showFormAlert(message, type) {
    let alertContainer = document.getElementById('formAlertContainer');
    if (!alertContainer) {
      alertContainer = document.createElement('div');
      alertContainer.id = 'formAlertContainer';
      alertContainer.className = 'mt-3';
      contactForm.appendChild(alertContainer);
    }

    const alertClass = type === 'success' ? 'alert-success glass-card' : 'alert-danger glass-card';
    const accentColor = type === 'success' ? '#10b981' : '#ef4444';
    
    alertContainer.innerHTML = `
      <div class="alert ${alertClass} d-flex align-items-center" role="alert" style="border-left: 4px solid ${accentColor}; color: #f8fafc; background: rgba(15, 23, 42, 0.9); margin-bottom: 0; padding: 1rem 1.25rem; border-radius: 12px;">
        <div>
          <i class="${type === 'success' ? 'fas fa-check-circle me-2' : 'fas fa-exclamation-circle me-2'}" style="color: ${accentColor}; font-size: 1.1rem;"></i>
          ${message}
        </div>
      </div>
    `;

    // Clear alert automatically after 5 seconds
    if (type === 'success') {
      setTimeout(() => {
        alertContainer.innerHTML = '';
      }, 5000);
    }
  }

});

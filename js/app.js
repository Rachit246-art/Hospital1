/**
 * AURA HEALTH SANCTUARY — CORE INTERACTIVITY & ANIMATION ENGINE
 * Smooth interactions, hero multi-slide carousel with Ken Burns zoom,
 * slide-in luxury mobile drawer, modals, counters, directory search, and filters.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Ensure document scroll is cleanly unlocked on fresh load
  document.body.style.overflow = '';
  document.documentElement.style.overflow = '';

  // ========================================================================
  // 1. STICKY NAVIGATION ON SCROLL
  // ========================================================================
  const header = document.querySelector('.site-header');
  if (header) {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  // ========================================================================
  // 2. LUXURY SLIDE-IN MOBILE NAVIGATION DRAWER
  // ========================================================================
  const mobileToggle = document.querySelector('.mobile-toggle');
  const mobileDrawer = document.getElementById('mobile-nav-drawer');
  const mobileBackdrop = document.getElementById('mobile-nav-backdrop');
  const mobileCloseBtn = document.getElementById('mobile-nav-close');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-item');

  const openMobileDrawer = () => {
    if (mobileDrawer && mobileBackdrop) {
      mobileDrawer.classList.add('active');
      mobileBackdrop.classList.add('active');
      mobileDrawer.setAttribute('aria-hidden', 'false');
      mobileBackdrop.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
  };

  const closeMobileDrawer = () => {
    if (mobileDrawer && mobileBackdrop) {
      mobileDrawer.classList.remove('active');
      mobileBackdrop.classList.remove('active');
      mobileDrawer.setAttribute('aria-hidden', 'true');
      mobileBackdrop.setAttribute('aria-hidden', 'true');
      const anyActiveModal = document.querySelector('.modal-backdrop.active');
      if (!anyActiveModal) {
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
      }
    }
  };

  if (mobileToggle) {
    mobileToggle.addEventListener('click', (e) => {
      e.preventDefault();
      if (mobileDrawer && mobileDrawer.classList.contains('active')) {
        closeMobileDrawer();
      } else {
        openMobileDrawer();
      }
    });
  }

  if (mobileCloseBtn) {
    mobileCloseBtn.addEventListener('click', (e) => {
      e.preventDefault();
      closeMobileDrawer();
    });
  }

  if (mobileBackdrop) {
    mobileBackdrop.addEventListener('click', (e) => {
      e.preventDefault();
      closeMobileDrawer();
    });
  }

  mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMobileDrawer();
    });
  });

  // ========================================================================
  // 3. APPOINTMENT & VIDEO MODAL CONTROLS
  // ========================================================================
  const appointmentModal = document.getElementById('appointment-modal');
  const videoModal = document.getElementById('video-modal');
  const openAppointmentBtns = document.querySelectorAll('[data-open-modal="appointment"]');
  const closeAppointmentBtn = document.getElementById('close-appointment-modal');
  const openVideoBtn = document.querySelector('[data-open-modal="video"]');
  const closeVideoBtn = document.getElementById('close-video-modal');
  const appointmentForm = document.getElementById('appointment-form');

  const openModal = (modal) => {
    if (modal) {
      closeMobileDrawer();
      modal.classList.add('active');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
  };

  const closeModal = (modal) => {
    if (modal) {
      modal.classList.remove('active');
      modal.setAttribute('aria-hidden', 'true');
    }
    const anyActiveModal = document.querySelector('.modal-backdrop.active');
    const drawerActive = document.querySelector('.mobile-nav-drawer.active');
    if (!anyActiveModal && !drawerActive) {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
  };

  openAppointmentBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(appointmentModal);
    });
  });

  if (closeAppointmentBtn) {
    closeAppointmentBtn.addEventListener('click', (e) => {
      e.preventDefault();
      closeModal(appointmentModal);
    });
  }

  if (appointmentModal) {
    appointmentModal.addEventListener('click', (e) => {
      if (e.target === appointmentModal) {
        closeModal(appointmentModal);
      }
    });
  }

  if (appointmentForm) {
    appointmentForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const patientName = document.getElementById('patient-name')?.value || 'Guest';
      const department = document.getElementById('patient-dept')?.value || 'General Medicine';
      appointmentForm.reset();
      closeModal(appointmentModal);
      showToast(`Appointment scheduled for ${patientName} (${department}). Our concierge will call you shortly.`);
    });
  }

  if (openVideoBtn && videoModal) {
    openVideoBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(videoModal);
    });
  }

  if (closeVideoBtn && videoModal) {
    closeVideoBtn.addEventListener('click', (e) => {
      e.preventDefault();
      closeModal(videoModal);
    });
  }

  if (videoModal) {
    videoModal.addEventListener('click', (e) => {
      if (e.target === videoModal) {
        closeModal(videoModal);
      }
    });
  }

  // ESC key listener closes all modals and mobile drawer
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal(appointmentModal);
      closeModal(videoModal);
      closeMobileDrawer();
    }
  });

  // ========================================================================
  // 4. TOAST NOTIFICATION UTILITY
  // ========================================================================
  function showToast(message) {
    let toast = document.querySelector('.toast-notice');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast-notice';
      document.body.appendChild(toast);
    }
    toast.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C5A36A" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>
      <span>${message}</span>
    `;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 4500);
  }

  // ========================================================================
  // 5. ANIMATED STATISTICS COUNTER ON SCROLL
  // ========================================================================
  const statsCols = document.querySelectorAll('.stat-col');
  let counted = false;

  const countUp = (el, target, suffix = '', duration = 1800) => {
    let start = 0;
    const stepTime = 20;
    const steps = duration / stepTime;
    const increment = target / steps;
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        el.textContent = target.toLocaleString() + suffix;
        clearInterval(timer);
      } else {
        el.textContent = Math.floor(start).toLocaleString() + suffix;
      }
    }, stepTime);
  };

  if (statsCols.length > 0 && 'IntersectionObserver' in window) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !counted) {
          counted = true;

          const num1 = document.querySelector('[data-stat="doctors"]');
          if (num1) countUp(num1, 500, '+');

          const num2 = document.querySelector('[data-stat="beds"]');
          if (num2) countUp(num2, 1000, '+');

          const num3 = document.querySelector('[data-stat="lives"]');
          if (num3) {
            let startM = 0;
            const timerM = setInterval(() => {
              startM += 0.05;
              if (startM >= 2) {
                num3.textContent = '2M+';
                clearInterval(timerM);
              } else {
                num3.textContent = startM.toFixed(1) + 'M+';
              }
            }, 35);
          }

          const num4 = document.querySelector('[data-stat="years"]');
          if (num4) countUp(num4, 25, '+');

          statsObserver.disconnect();
        }
      });
    }, { threshold: 0.2 });

    statsCols.forEach(col => statsObserver.observe(col));
  }

  // ========================================================================
  // 6. HERO CAROUSEL: 3 AUTO SLIDES, SLOW ZOOM-IN, TOUCH SWIPE & ARROWS
  // ========================================================================
  const heroSlides = document.querySelectorAll('.hero-slide');
  const indicatorBtns = document.querySelectorAll('.hero-indicator-btn');
  const prevBtn = document.querySelector('.hero-prev-btn');
  const nextBtn = document.querySelector('.hero-next-btn');
  const heroSection = document.querySelector('.hero-section');

  if (heroSlides.length > 0) {
    let currentSlide = 0;
    const totalSlides = heroSlides.length;
    const slideDuration = 6500; // 6.5 seconds per slide
    let slideTimer = null;

    const goToSlide = (index) => {
      // Deactivate all slides
      heroSlides.forEach(slide => {
        slide.classList.remove('active');
        const img = slide.querySelector('.hero-zoom-img');
        if (img) {
          img.style.transition = 'none';
          img.style.transform = 'scale(1)';
        }
      });

      indicatorBtns.forEach(btn => {
        btn.classList.remove('active');
        const progress = btn.querySelector('.indicator-progress');
        if (progress) progress.style.width = '0%';
      });

      // Wrap around index
      currentSlide = (index + totalSlides) % totalSlides;

      // Activate target slide
      const activeSlide = heroSlides[currentSlide];
      const activeIndicator = indicatorBtns[currentSlide];

      if (activeSlide) {
        activeSlide.classList.add('active');
        const activeImg = activeSlide.querySelector('.hero-zoom-img');
        if (activeImg) {
          setTimeout(() => {
            activeImg.style.transition = 'transform 9.5s cubic-bezier(0.25, 1, 0.5, 1)';
            activeImg.style.transform = 'scale(1.14)';
          }, 50);
        }
      }

      if (activeIndicator) {
        activeIndicator.classList.add('active');
      }

      startAutoSlide();
    };

    const nextSlide = () => goToSlide(currentSlide + 1);
    const prevSlide = () => goToSlide(currentSlide - 1);

    const startAutoSlide = () => {
      clearInterval(slideTimer);
      slideTimer = setInterval(nextSlide, slideDuration);
    };

    const stopAutoSlide = () => {
      clearInterval(slideTimer);
    };

    indicatorBtns.forEach((btn, idx) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        goToSlide(idx);
      });
    });

    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        nextSlide();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        prevSlide();
      });
    }

    if (heroSection) {
      heroSection.addEventListener('mouseenter', stopAutoSlide);
      heroSection.addEventListener('mouseleave', startAutoSlide);

      // Mobile Touch Swipe Navigation
      let touchStartX = 0;
      let touchEndX = 0;

      heroSection.addEventListener('touchstart', (e) => {
        if (e.touches && e.touches[0]) {
          touchStartX = e.touches[0].clientX;
        }
      }, { passive: true });

      heroSection.addEventListener('touchend', (e) => {
        if (e.changedTouches && e.changedTouches[0]) {
          touchEndX = e.changedTouches[0].clientX;
          const diff = touchEndX - touchStartX;
          if (Math.abs(diff) > 40) {
            if (diff < 0) {
              nextSlide(); // Swiped left
            } else {
              prevSlide(); // Swiped right
            }
          }
        }
      }, { passive: true });
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
    });

    // Start on first slide
    goToSlide(0);
  }

  // ========================================================================
  // 7. VIRTUAL TOUR ROOM SWITCHER
  // ========================================================================
  const roomBtns = document.querySelectorAll('[data-room-switch]');
  const roomTitle = document.getElementById('tour-room-title');
  const roomDesc = document.getElementById('tour-room-desc');
  const roomImage = document.getElementById('tour-main-img');

  const roomsData = {
    lobby: {
      title: "Double-Height Grand Lobby & Architectural Atrium",
      desc: "Featuring sculptural ambient illumination, acoustic natural marble, and living botanical gardens designed to instill peace upon arrival.",
      img: "assets/lobby-hero.svg"
    },
    surgery: {
      title: "Hybrid Robotic Surgical Theater",
      desc: "Ultra-clean laminar airflow Class-100 operating suite with real-time intraoperative imaging and high-precision robotic arms.",
      img: "assets/doctor-tech.svg"
    },
    mri: {
      title: "3.0 Tesla Bio-Matrix MRI Imaging Suite",
      desc: "Ultra-quiet scanning gantry with ambient circadian skylight ceilings and immersive relaxation audio.",
      img: "assets/mri-room.svg"
    },
    suite: {
      title: "Presidential Private Healing Pavilion",
      desc: "Floor-to-ceiling panoramic nature views, personalized concierge care, circadian lighting, and dedicated guest quarters.",
      img: "assets/patient-suite.svg"
    }
  };

  roomBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const roomKey = btn.getAttribute('data-room-switch');
      roomBtns.forEach(b => {
        b.style.backgroundColor = 'rgba(255,255,255,0.08)';
        b.style.color = '#FAF9F6';
        b.style.borderColor = 'rgba(255,255,255,0.15)';
      });
      btn.style.backgroundColor = 'var(--gold-accent)';
      btn.style.color = 'var(--forest-dark)';
      btn.style.borderColor = 'var(--gold-accent)';

      if (roomsData[roomKey]) {
        if (roomTitle) roomTitle.textContent = roomsData[roomKey].title;
        if (roomDesc) roomDesc.textContent = roomsData[roomKey].desc;
        if (roomImage) roomImage.src = roomsData[roomKey].img;
      }
    });
  });

  // ========================================================================
  // 8. SPECIALTY DETAIL INTERACTION & PRE-FILL
  // ========================================================================
  const specialtyCards = document.querySelectorAll('.specialty-card');
  specialtyCards.forEach(card => {
    const link = card.querySelector('.specialty-link');
    if (link) {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const deptTitle = card.querySelector('.specialty-title')?.textContent || 'Medical Specialty';
        const deptSelect = document.getElementById('patient-dept');
        if (deptSelect) {
          for (let i = 0; i < deptSelect.options.length; i++) {
            if (deptSelect.options[i].text.toLowerCase().includes(deptTitle.toLowerCase().split(' ')[0])) {
              deptSelect.selectedIndex = i;
              break;
            }
          }
        }
        openModal(appointmentModal);
      });
    }
  });

  // ========================================================================
  // 9. SCROLL REVEAL ANIMATIONS ENGINE
  // ========================================================================
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .stagger-parent');
  
  if (revealElements.length > 0 && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -30px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback: reveal immediately if IntersectionObserver not supported
    revealElements.forEach(el => el.classList.add('revealed'));
  }

  // ========================================================================
  // 10. DOCTOR DIRECTORY FILTERING & SEARCH
  // ========================================================================
  const doctorSearchInput = document.getElementById('doctor-search');
  const doctorFilterBtns = document.querySelectorAll('[data-doctor-filter]');
  const doctorCards = document.querySelectorAll('.doctor-profile-card');

  if (doctorCards.length > 0) {
    let currentCategory = 'all';
    let currentSearchTerm = '';

    const filterDoctors = () => {
      let visibleCount = 0;
      doctorCards.forEach(card => {
        const dept = card.getAttribute('data-department') || '';
        const name = card.querySelector('.doctor-card-name')?.textContent.toLowerCase() || '';
        const specialty = card.querySelector('.doctor-card-specialty')?.textContent.toLowerCase() || '';
        
        const matchesCategory = (currentCategory === 'all' || dept.toLowerCase() === currentCategory.toLowerCase());
        const matchesSearch = (name.includes(currentSearchTerm) || specialty.includes(currentSearchTerm) || dept.toLowerCase().includes(currentSearchTerm));

        if (matchesCategory && matchesSearch) {
          card.style.display = 'flex';
          card.style.animation = 'fadeInUp 0.5s ease forwards';
          visibleCount++;
        } else {
          card.style.display = 'none';
        }
      });

      const noResults = document.getElementById('doctor-no-results');
      if (noResults) {
        noResults.style.display = visibleCount === 0 ? 'block' : 'none';
      }
    };

    if (doctorSearchInput) {
      doctorSearchInput.addEventListener('input', (e) => {
        currentSearchTerm = e.target.value.trim().toLowerCase();
        filterDoctors();
      });
    }

    doctorFilterBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        doctorFilterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentCategory = btn.getAttribute('data-doctor-filter') || 'all';
        filterDoctors();
      });
    });

    document.querySelectorAll('[data-book-doctor]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const docName = btn.getAttribute('data-book-doctor');
        const docDept = btn.getAttribute('data-doctor-dept');
        const deptSelect = document.getElementById('patient-dept');
        const notesField = document.getElementById('patient-notes');
        
        if (deptSelect && docDept) {
          for (let i = 0; i < deptSelect.options.length; i++) {
            if (deptSelect.options[i].value.toLowerCase().includes(docDept.toLowerCase()) || 
                deptSelect.options[i].text.toLowerCase().includes(docDept.toLowerCase())) {
              deptSelect.selectedIndex = i;
              break;
            }
          }
        }

        if (notesField && docName) {
          notesField.value = `Requesting consultation specifically with ${docName}.`;
        }

        openModal(appointmentModal);
      });
    });
  }

  // ========================================================================
  // 11. SPECIALTY PAGE FILTER BAR
  // ========================================================================
  const specialtyFilterPills = document.querySelectorAll('[data-specialty-filter]');
  const specialtyDeepItems = document.querySelectorAll('.specialty-deep-item');

  if (specialtyFilterPills.length > 0 && specialtyDeepItems.length > 0) {
    specialtyFilterPills.forEach(pill => {
      pill.addEventListener('click', (e) => {
        e.preventDefault();
        specialtyFilterPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        const filterVal = pill.getAttribute('data-specialty-filter');

        specialtyDeepItems.forEach(item => {
          const itemDept = item.getAttribute('data-dept-key');
          if (filterVal === 'all' || itemDept === filterVal) {
            item.style.display = 'grid';
            item.style.animation = 'fadeInUp 0.6s ease forwards';
          } else {
            item.style.display = 'none';
          }
        });
      });
    });
  }

  // ========================================================================
  // 12. CONTACT FORM HANDLER
  // ========================================================================
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const senderName = document.getElementById('contact-name')?.value || 'Guest';
      showToast(`Thank you, ${senderName}. Your message has been routed to our Clinical Concierge.`);
      contactForm.reset();
    });
  }

  // ========================================================================
  // 13. SMOOTH ANCHOR LINK JUMPS
  // ========================================================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId && targetId !== '#' && !this.hasAttribute('data-open-modal')) {
        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          e.preventDefault();
          const headerOffset = 90;
          const elementPosition = targetEl.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }
    });
  });

});

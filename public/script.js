// =====================================
//   MODERN WEDDING INVITATION APP
//   iOS-Style Glassmorphism Design
// =====================================

class WeddingApp {
  constructor() {
    this.images = [];
    this.currentLightboxIndex = 0;
    this.isGalleryLoaded = false;
    this.isMusicPlaying = false;
    this.countdownInterval = null;
    this.heroSliderInterval = null;
    this.currentHeroIndex = 0;
    this.weddingDate = new Date('2026-07-15T08:00:00');
    this.isInvitationOpened = false;
    
    this.init();
  }

  // Initialize the entire application
  async init() {
    this.showPreloader();
    await this.loadImages();
    this.initializeEventListeners();
    this.initializeHeroSlider();
    this.initializeCountdown();
    this.initializeScrollAnimations();
    this.initializeNavigation();
    this.initializeFloatingDock();
    this.initializeRSVPForm();
    this.loadMessages();
    this.hidePreloader();
  }

  // =====================================
  //   PRELOADER MANAGEMENT
  // =====================================
  showPreloader() {
    const preloader = document.getElementById('preloader');
    const progressFill = document.querySelector('.progress-fill');
    
    document.body.classList.add('loading');
    
    // Simulate loading with progress animation
    let progress = 0;
    const progressInterval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress >= 100) {
        progress = 100;
        clearInterval(progressInterval);
      }
      progressFill.style.width = `${progress}%`;
    }, 200);
  }

  hidePreloader() {
    setTimeout(() => {
      const preloader = document.getElementById('preloader');
      preloader.classList.add('hidden');
      document.body.classList.remove('loading');
      
      // Lock scroll until invitation is opened
      this.enableScrollLock();
      
      // Trigger entrance animations
      this.triggerEntranceAnimations();
    }, 1500);
  }

  triggerEntranceAnimations() {
    const elementsToAnimate = document.querySelectorAll('.fade-in');
    elementsToAnimate.forEach((element, index) => {
      setTimeout(() => {
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
      }, index * 100);
    });
  }

  // =====================================
  //   SCROLL LOCK FUNCTIONALITY
  // =====================================
  enableScrollLock() {
    if (!this.isInvitationOpened) {
      document.body.classList.add('scroll-locked');
      
      // Prevent wheel scrolling
      this.preventScroll = (e) => {
        e.preventDefault();
        e.stopPropagation();
        return false;
      };

      // Prevent touch scrolling
      this.preventTouchMove = (e) => {
        e.preventDefault();
      };

      // Add event listeners
      document.addEventListener('wheel', this.preventScroll, { passive: false });
      document.addEventListener('touchmove', this.preventTouchMove, { passive: false });
      document.addEventListener('keydown', this.preventKeyScroll, false);
    }
  }

  disableScrollLock() {
    document.body.classList.remove('scroll-locked');
    
    // Remove event listeners
    if (this.preventScroll) {
      document.removeEventListener('wheel', this.preventScroll, { passive: false });
    }
    if (this.preventTouchMove) {
      document.removeEventListener('touchmove', this.preventTouchMove, { passive: false });
    }
    document.removeEventListener('keydown', this.preventKeyScroll, false);
  }

  preventKeyScroll = (e) => {
    // Prevent arrow keys, space, page up/down from scrolling
    const scrollKeys = [32, 33, 34, 35, 36, 37, 38, 39, 40];
    if (scrollKeys.indexOf(e.keyCode) > -1) {
      e.preventDefault();
      return false;
    }
  }

  openInvitation() {
    if (this.isInvitationOpened) return;
    
    this.isInvitationOpened = true;
    this.disableScrollLock();
    
    // Add nice animation to the button
    const openBtn = document.getElementById('openInvitation');
    if (openBtn) {
      openBtn.style.transform = 'scale(0.95)';
      openBtn.style.opacity = '0.7';
      
      setTimeout(() => {
        openBtn.style.transform = 'scale(1)';
        openBtn.style.opacity = '1';
      }, 200);
    }
    
    // Smooth scroll to couple section after brief delay
    setTimeout(() => {
      const coupleSection = document.getElementById('couple');
      if (coupleSection) {
        coupleSection.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }, 600);
  }

  // =====================================
  //   IMAGE MANAGEMENT
  // =====================================
  async loadImages() {
    try {
      const response = await fetch('/api/images');
      if (response.ok) {
        this.images = await response.json();
        console.log(`Loaded ${this.images.length} images`);
        this.setupHeroImages();
        this.setupCoupleImages();
        this.setupGallery();
      } else {
        console.warn('Failed to load images from API');
        this.setupFallbackImages();
      }
    } catch (error) {
      console.error('Error loading images:', error);
      this.setupFallbackImages();
    }
  }

  setupFallbackImages() {
    // Use placeholder images if API fails
    this.images = [
      { name: 'placeholder1.jpg', path: 'https://picsum.photos/800/600?random=1' },
      { name: 'placeholder2.jpg', path: 'https://picsum.photos/800/600?random=2' },
      { name: 'placeholder3.jpg', path: 'https://picsum.photos/800/600?random=3' },
      { name: 'placeholder4.jpg', path: 'https://picsum.photos/800/600?random=4' },
      { name: 'placeholder5.jpg', path: 'https://picsum.photos/800/600?random=5' },
      { name: 'placeholder6.jpg', path: 'https://picsum.photos/800/600?random=6' }
    ];
    this.setupHeroImages();
    this.setupCoupleImages();
    this.setupGallery();
  }

  setupHeroImages() {
    const heroSlider = document.getElementById('heroSlider');
    if (heroSlider && this.images.length > 0) {
      // Use first image as initial hero background
      heroSlider.style.backgroundImage = `url('${this.images[0].path}')`;
    }
  }

  setupCoupleImages() {
    const brideImage = document.getElementById('brideImage');
    const groomImage = document.getElementById('groomImage');
    
    if (brideImage && this.images.length > 1) {
      brideImage.style.backgroundImage = `url('${this.images[1].path}')`;
    }
    
    if (groomImage && this.images.length > 2) {
      groomImage.style.backgroundImage = `url('${this.images[2].path}')`;
    }
  }

  setupGallery() {
    const galleryGrid = document.getElementById('galleryGrid');
    if (!galleryGrid) return;

    galleryGrid.innerHTML = '';
    
    this.images.forEach((image, index) => {
      const galleryItem = this.createGalleryItem(image, index);
      galleryGrid.appendChild(galleryItem);
    });

    this.isGalleryLoaded = true;
    
    // Initialize slideshow after gallery is set up
    this.initializeSlideshow();
  }

  createGalleryItem(image, index) {
    const item = document.createElement('div');
    item.className = 'gallery-item glass-card';
    item.innerHTML = `
      <img src="${image.path}" alt="${image.name}" class="gallery-image" loading="lazy">
      <div class="gallery-overlay">
        <i class="fas fa-expand"></i>
      </div>
    `;
    
    item.addEventListener('click', () => {
      this.openLightbox(index);
    });

    return item;
  }

  // =====================================
  //   HERO SLIDER
  // =====================================
  initializeHeroSlider() {
    if (this.images.length <= 1) return;

    this.heroSliderInterval = setInterval(() => {
      this.nextHeroImage();
    }, 5000);
  }

  nextHeroImage() {
    if (this.images.length === 0) return;
    
    this.currentHeroIndex = (this.currentHeroIndex + 1) % this.images.length;
    const heroSlider = document.getElementById('heroSlider');
    
    if (heroSlider) {
      heroSlider.style.backgroundImage = `url('${this.images[this.currentHeroIndex].path}')`;
    }
  }

  // =====================================
  //   LIGHTBOX GALLERY
  // =====================================
  openLightbox(index) {
    if (!this.isGalleryLoaded || this.images.length === 0) return;

    this.currentLightboxIndex = index;
    const modal = document.getElementById('lightboxModal');
    const image = document.getElementById('lightboxImage');
    const counter = document.getElementById('lightboxCounter');

    if (modal && image && counter) {
      const currentImage = this.images[this.currentLightboxIndex];
      image.src = currentImage.path;
      image.alt = currentImage.name;
      counter.textContent = `${this.currentLightboxIndex + 1} / ${this.images.length}`;
      
      modal.classList.add('active');
      document.body.classList.add('no-scroll');
    }
  }

  closeLightbox() {
    const modal = document.getElementById('lightboxModal');
    if (modal) {
      modal.classList.remove('active');
      document.body.classList.remove('no-scroll');
    }
  }

  previousLightboxImage() {
    if (this.images.length === 0) return;
    
    this.currentLightboxIndex = 
      this.currentLightboxIndex === 0 ? 
      this.images.length - 1 : 
      this.currentLightboxIndex - 1;
    
    this.updateLightboxImage();
  }

  nextLightboxImage() {
    if (this.images.length === 0) return;
    
    this.currentLightboxIndex = (this.currentLightboxIndex + 1) % this.images.length;
    this.updateLightboxImage();
  }

  updateLightboxImage() {
    const image = document.getElementById('lightboxImage');
    const counter = document.getElementById('lightboxCounter');

    if (image && counter) {
      const currentImage = this.images[this.currentLightboxIndex];
      image.src = currentImage.path;
      image.alt = currentImage.name;
      counter.textContent = `${this.currentLightboxIndex + 1} / ${this.images.length}`;
    }
  }

  // =====================================
  //   COUNTDOWN TIMER
  // =====================================
  initializeCountdown() {
    this.updateCountdown();
    this.countdownInterval = setInterval(() => {
      this.updateCountdown();
    }, 1000);
  }

  updateCountdown() {
    const now = new Date().getTime();
    const timeLeft = this.weddingDate.getTime() - now;

    if (timeLeft < 0) {
      this.displayCountdownFinished();
      return;
    }

    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

    this.updateCountdownDisplay({
      days: days.toString().padStart(2, '0'),
      hours: hours.toString().padStart(2, '0'),
      minutes: minutes.toString().padStart(2, '0'),
      seconds: seconds.toString().padStart(2, '0')
    });
  }

  updateCountdownDisplay({ days, hours, minutes, seconds }) {
    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');

    if (daysEl) daysEl.textContent = days;
    if (hoursEl) hoursEl.textContent = hours;
    if (minutesEl) minutesEl.textContent = minutes;
    if (secondsEl) secondsEl.textContent = seconds;
  }

  displayCountdownFinished() {
    this.updateCountdownDisplay({
      days: '00',
      hours: '00',
      minutes: '00',
      seconds: '00'
    });
    
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  }

  // =====================================
  //   NAVIGATION
  // =====================================
  initializeNavigation() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Mobile menu toggle
    if (navToggle && navMenu) {
      navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
      });
    }

    // Smooth scroll navigation
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetId);
        
        if (targetSection) {
          targetSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
          
          // Update active nav link
          this.updateActiveNavLink(link);
          
          // Close mobile menu
          if (navMenu && navToggle) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
          }
        }
      });
    });

    // Update nav on scroll
    this.initializeScrollSpy();
  }

  initializeScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
      let current = '';
      
      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= (sectionTop - 200)) {
          current = section.getAttribute('id');
        }
      });

      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
          link.classList.add('active');
        }
      });
    });
  }

  updateActiveNavLink(activeLink) {
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.remove('active');
    });
    activeLink.classList.add('active');
  }

  // =====================================
  //   FLOATING DOCK
  // =====================================
  initializeFloatingDock() {
    const playMusicBtn = document.getElementById('playMusicBtn');
    const openRSVPBtn = document.getElementById('openRSVP');
    const shareBtn = document.getElementById('shareBtn');

    if (playMusicBtn) {
      playMusicBtn.addEventListener('click', () => {
        this.toggleBackgroundMusic();
      });
    }

    if (openRSVPBtn) {
      openRSVPBtn.addEventListener('click', () => {
        const rsvpSection = document.getElementById('rsvp');
        if (rsvpSection) {
          rsvpSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    }

    if (shareBtn) {
      shareBtn.addEventListener('click', () => {
        this.shareInvitation();
      });
    }
  }

  toggleBackgroundMusic() {
    const audio = document.getElementById('backgroundMusic');
    const playBtn = document.getElementById('playMusicBtn');
    
    if (!audio || !playBtn) return;

    if (this.isMusicPlaying) {
      audio.pause();
      playBtn.innerHTML = '<i class="fas fa-music"></i>';
      this.isMusicPlaying = false;
    } else {
      audio.play().then(() => {
        playBtn.innerHTML = '<i class="fas fa-pause"></i>';
        this.isMusicPlaying = true;
      }).catch(error => {
        console.warn('Audio play failed:', error);
        this.showToast('Tidak dapat memutar musik. Mohon berinteraksi dengan halaman terlebih dahulu.', 'error');
      });
    }
  }

  shareInvitation() {
    // Check if Web Share API is available and supported
    if (navigator.share && navigator.canShare) {
      const shareData = {
        title: 'Undangan Pernikahan Zayn & Nala',
        text: 'Anda diundang untuk merayakan hari spesial kami!',
        url: window.location.href
      };
      
      // Check if the data can be shared
      if (navigator.canShare(shareData)) {
        navigator.share(shareData).catch(error => {
          console.log('Error sharing:', error);
          this.copyToClipboard();
        });
      } else {
        this.copyToClipboard();
      }
    } else {
      this.copyToClipboard();
    }
  }

  copyToClipboard() {
    // Modern clipboard API with fallback
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(window.location.href).then(() => {
        this.showToast('Link undangan berhasil disalin ke clipboard!', 'success');
      }).catch(() => {
        this.fallbackCopyToClipboard();
      });
    } else {
      this.fallbackCopyToClipboard();
    }
  }
  
  fallbackCopyToClipboard() {
    // Fallback method for older browsers or non-secure contexts
    try {
      const textArea = document.createElement('textarea');
      textArea.value = window.location.href;
      textArea.style.position = 'fixed';
      textArea.style.top = '-9999px';
      textArea.style.left = '-9999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      
      if (successful) {
        this.showToast('Link undangan berhasil disalin ke clipboard!', 'success');
      } else {
        throw new Error('Copy command failed');
      }
    } catch (err) {
      console.log('Fallback copy failed:', err);
      this.showToast('Tidak dapat menyalin link. Mohon salin secara manual dari address bar.', 'error');
    }
  }

  // =====================================
  //   RSVP FORM
  // =====================================
  initializeRSVPForm() {
    const rsvpForm = document.getElementById('rsvpForm');
    const openInvitationBtn = document.getElementById('openInvitation');

    if (openInvitationBtn) {
      openInvitationBtn.addEventListener('click', () => {
        this.openInvitation();
      });
    }

    if (rsvpForm) {
      rsvpForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        await this.submitRSVP(rsvpForm);
      });
    }
  }

  async submitRSVP(form) {
    const submitBtn = form.querySelector('#submitRSVP');
    const formData = new FormData(form);
    
    const rsvpData = {
      name: formData.get('name'),
      attendance: formData.get('attendance'),
      message: formData.get('message') || ''
    };

    // Validate form
    if (!rsvpData.name || !rsvpData.attendance) {
      this.showToast('Mohon isi semua kolom yang wajib diisi.', 'error');
      return;
    }

    // Show loading state
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;

    try {
      const response = await fetch('/api/rsvp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(rsvpData)
      });

      const result = await response.json();

      if (response.ok && result.success) {
        this.showToast('Terima kasih! Konfirmasi kehadiran Anda berhasil terkirim.', 'success');
        form.reset();
        this.loadMessages(); // Refresh messages
      } else {
        throw new Error(result.error || 'Failed to submit RSVP');
      }
    } catch (error) {
      console.error('RSVP submission error:', error);
      this.showToast('Maaf, terjadi kesalahan saat mengirim konfirmasi. Mohon coba lagi.', 'error');
    } finally {
      submitBtn.classList.remove('loading');
      submitBtn.disabled = false;
    }
  }

  // =====================================
  //   MESSAGES/GUESTBOOK
  // =====================================
  async loadMessages() {
    try {
      const response = await fetch('/api/responses');
      if (response.ok) {
        const messages = await response.json();
        this.displayMessages(messages);
      } else {
        console.warn('Failed to load messages');
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  }

  displayMessages(messages) {
    const messagesContainer = document.getElementById('messagesContainer');
    if (!messagesContainer) return;

    if (!messages || messages.length === 0) {
      messagesContainer.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">
            <i class="fas fa-comments"></i>
          </div>
          <p>Jadilah yang pertama berbagi harapan untuk pasangan bahagia!</p>
        </div>
      `;
      return;
    }

    messagesContainer.innerHTML = messages
      .slice(-10) // Show last 10 messages
      .reverse() // Show newest first
      .map(message => this.createMessageElement(message))
      .join('');
  }

  createMessageElement(message) {
    const isAttending = message.attendance === 'Akan Hadir';
    const attendanceClass = isAttending ? 'attending' : 'not-attending';
    
    return `
      <div class="message-item">
        <div class="message-header">
          <span class="message-name">${this.escapeHtml(message.name)}</span>
          <span class="message-attendance ${attendanceClass}">
            ${message.attendance}
          </span>
        </div>
        ${message.message ? `<div class="message-text">${this.escapeHtml(message.message)}</div>` : ''}
        <div class="message-timestamp">${message.timestamp || ''}</div>
      </div>
    `;
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // =====================================
  //   SCROLL ANIMATIONS
  // =====================================
  initializeScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in');
        }
      });
    }, observerOptions);

    // Observe elements for animation
    const elementsToObserve = document.querySelectorAll('.glass-card, .timeline-item, .countdown-item');
    elementsToObserve.forEach(element => {
      observer.observe(element);
    });
  }

  // =====================================
  //   TOAST NOTIFICATIONS
  // =====================================
  showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastIcon = document.getElementById('toastIcon');
    const toastMessage = document.getElementById('toastMessage');

    if (!toast || !toastIcon || !toastMessage) return;

    // Update toast content
    toastMessage.textContent = message;
    toast.className = `toast ${type}`;
    
    // Update icon
    if (type === 'success') {
      toastIcon.innerHTML = '<i class="fas fa-check-circle"></i>';
    } else {
      toastIcon.innerHTML = '<i class="fas fa-exclamation-circle"></i>';
    }

    // Show toast
    toast.classList.add('show');

    // Auto hide after 5 seconds
    setTimeout(() => {
      toast.classList.remove('show');
    }, 5000);
  }

  // =====================================
  //   EVENT LISTENERS
  // =====================================
  initializeEventListeners() {
    // Lightbox controls
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxBackdrop = document.getElementById('lightboxBackdrop');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');

    if (lightboxClose) {
      lightboxClose.addEventListener('click', () => this.closeLightbox());
    }

    if (lightboxBackdrop) {
      lightboxBackdrop.addEventListener('click', () => this.closeLightbox());
    }

    if (lightboxPrev) {
      lightboxPrev.addEventListener('click', () => this.previousLightboxImage());
    }

    if (lightboxNext) {
      lightboxNext.addEventListener('click', () => this.nextLightboxImage());
    }

    // Toast close
    const toastClose = document.getElementById('toastClose');
    if (toastClose) {
      toastClose.addEventListener('click', () => {
        document.getElementById('toast').classList.remove('show');
      });
    }

    // Refresh messages
    const refreshBtn = document.getElementById('refreshMessages');
    if (refreshBtn) {
      refreshBtn.addEventListener('click', () => {
        this.loadMessages();
        refreshBtn.style.transform = 'rotate(360deg)';
        setTimeout(() => {
          refreshBtn.style.transform = '';
        }, 500);
      });
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      const modal = document.getElementById('lightboxModal');
      if (modal && modal.classList.contains('active')) {
        switch (e.key) {
          case 'Escape':
            this.closeLightbox();
            break;
          case 'ArrowLeft':
            this.previousLightboxImage();
            break;
          case 'ArrowRight':
            this.nextLightboxImage();
            break;
        }
      }
    });
  }

  // =====================================
  //   SLIDESHOW FUNCTIONALITY
  // =====================================
  initializeSlideshow() {
    this.currentSlideIndex = 0;
    this.slideshowInterval = null;
    this.isAutoPlaying = false;
    this.isGridView = false;
    
    // Get slideshow elements
    this.slideImage = document.getElementById('slideImage');
    this.slideCaption = document.getElementById('slideCaption');
    this.currentSlideNum = document.getElementById('currentSlideNum');
    this.totalSlides = document.getElementById('totalSlides');
    this.playPauseBtn = document.getElementById('playPauseBtn');
    this.playPauseIcon = document.getElementById('playPauseIcon');
    this.playPauseText = document.getElementById('playPauseText');
    this.viewAllBtn = document.getElementById('viewAllBtn');
    this.prevBtn = document.getElementById('prevBtn');
    this.nextBtn = document.getElementById('nextBtn');
    this.galleryGrid = document.getElementById('galleryGrid');
    this.slideshowContainer = document.querySelector('.gallery-slideshow-container');
    
    // Set up event listeners
    this.setupSlideshowEventListeners();
    
    // Initialize first slide
    this.updateSlideshow();
    this.updateSlideCounter();
    
    // Start auto-play by default
    this.startAutoPlay();
  }
  
  setupSlideshowEventListeners() {
    if (this.playPauseBtn) {
      this.playPauseBtn.addEventListener('click', () => this.toggleAutoPlay());
    }
    
    if (this.viewAllBtn) {
      this.viewAllBtn.addEventListener('click', () => this.toggleView());
    }
    
    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', () => this.previousSlide());
    }
    
    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', () => this.nextSlide());
    }
    
    // Keyboard navigation for slideshow
    document.addEventListener('keydown', (e) => {
      if (this.isGridView) return;
      
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          this.previousSlide();
          break;
        case 'ArrowRight':
          e.preventDefault();
          this.nextSlide();
          break;
        case ' ':
          e.preventDefault();
          this.toggleAutoPlay();
          break;
      }
    });
  }
  
  updateSlideshow() {
    if (!this.images || this.images.length === 0) {
      if (this.slideCaption) this.slideCaption.textContent = 'Memuat foto...';
      return;
    }
    
    const currentImage = this.images[this.currentSlideIndex];
    if (this.slideImage && currentImage) {
      this.slideImage.src = currentImage.path;
      this.slideImage.alt = `Foto ${this.currentSlideIndex + 1} - ${currentImage.name}`;
    }
    
    if (this.slideCaption) {
      const captions = [
        'Momen bahagia bersama keluarga dan teman ❤️',
        'Kenangan indah yang tak terlupakan 💕',
        'Perjalanan cinta yang penuh makna 🌹',
        'Senyuman yang menceritakan seribu kisah 😊',
        'Kebahagiaan yang terpancar dari hati 💖',
        'Momen romantis yang diabadikan selamanya 🥰',
        'Cinta yang tertuang dalam setiap frame 💝',
        'Kebersamaan yang menjadi kenangan terindah ✨',
        'Tawa dan canda dalam perjalanan hidup 😄',
        'Janji cinta yang abadi hingga akhir waktu 💍'
      ];
      this.slideCaption.textContent = captions[this.currentSlideIndex % captions.length];
    }
  }
  
  updateSlideCounter() {
    if (this.currentSlideNum) {
      this.currentSlideNum.textContent = this.currentSlideIndex + 1;
    }
    if (this.totalSlides) {
      this.totalSlides.textContent = this.images?.length || 0;
    }
  }
  
  nextSlide() {
    if (!this.images || this.images.length === 0) return;
    
    this.currentSlideIndex = (this.currentSlideIndex + 1) % this.images.length;
    this.updateSlideshow();
    this.updateSlideCounter();
  }
  
  previousSlide() {
    if (!this.images || this.images.length === 0) return;
    
    this.currentSlideIndex = this.currentSlideIndex === 0 ? 
      this.images.length - 1 : this.currentSlideIndex - 1;
    this.updateSlideshow();
    this.updateSlideCounter();
  }
  
  startAutoPlay() {
    if (this.slideshowInterval) return;
    
    this.isAutoPlaying = true;
    this.slideshowInterval = setInterval(() => {
      this.nextSlide();
    }, 4000); // Change slide every 4 seconds
    
    this.updatePlayPauseButton();
  }
  
  stopAutoPlay() {
    if (this.slideshowInterval) {
      clearInterval(this.slideshowInterval);
      this.slideshowInterval = null;
    }
    this.isAutoPlaying = false;
    this.updatePlayPauseButton();
  }
  
  toggleAutoPlay() {
    if (this.isAutoPlaying) {
      this.stopAutoPlay();
    } else {
      this.startAutoPlay();
    }
  }
  
  updatePlayPauseButton() {
    if (this.playPauseIcon) {
      this.playPauseIcon.className = this.isAutoPlaying ? 'fas fa-pause' : 'fas fa-play';
    }
    if (this.playPauseText) {
      this.playPauseText.textContent = this.isAutoPlaying ? 'Jeda Otomatis' : 'Putar Otomatis';
    }
    if (this.playPauseBtn) {
      this.playPauseBtn.classList.toggle('active', this.isAutoPlaying);
    }
  }
  
  toggleView() {
    this.isGridView = !this.isGridView;
    
    if (this.isGridView) {
      // Show grid view
      if (this.galleryGrid) this.galleryGrid.style.display = 'grid';
      if (this.slideshowContainer) this.slideshowContainer.style.display = 'none';
      if (this.viewAllBtn) {
        this.viewAllBtn.innerHTML = '<i class="fas fa-images"></i><span>Lihat Slideshow</span>';
      }
      this.stopAutoPlay();
    } else {
      // Show slideshow view
      if (this.galleryGrid) this.galleryGrid.style.display = 'none';
      if (this.slideshowContainer) this.slideshowContainer.style.display = 'block';
      if (this.viewAllBtn) {
        this.viewAllBtn.innerHTML = '<i class="fas fa-th"></i><span>Lihat Semua</span>';
      }
      this.startAutoPlay();
    }
  }

  // =====================================
  //   CLEANUP
  // =====================================
  destroy() {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
    if (this.heroSliderInterval) {
      clearInterval(this.heroSliderInterval);
    }
    if (this.slideshowInterval) {
      clearInterval(this.slideshowInterval);
    }
  }
}

// =====================================
//   INITIALIZE APPLICATION
// =====================================
document.addEventListener('DOMContentLoaded', () => {
  window.weddingApp = new WeddingApp();
});

// Handle page unload
window.addEventListener('beforeunload', () => {
  if (window.weddingApp) {
    window.weddingApp.destroy();
  }
});
'use strict';

document.addEventListener('DOMContentLoaded', () => {
    // Configuration Constants
    const SCROLL_THRESHOLDS = {
        headerSticky: 100,
        backToTop: 500
    };
    const SLIDER = {
        interval: 5000,
        desktopCardWidth: 33.33
    };

    // DOM Elements
    const elements = {
        menuBtn: document.getElementById('menuBtn'),
        mobileMenu: document.getElementById('mobileMenu'),
        overlay: document.getElementById('overlay'),
        menuClose: document.getElementById('menuClose'),
        mobileNavLinks: document.querySelectorAll('.mobile-nav li a'),
        header: document.getElementById('header'),
        backToTopBtn: document.getElementById('backToTop'),
        navLinks: document.querySelectorAll('.nav-links a'),
        testimonialsContainer: document.querySelector('.testimonials-container'),
        testimonialCards: document.querySelectorAll('.testimonial-card'),
        prevBtn: document.getElementById('prevBtn'),
        nextBtn: document.getElementById('nextBtn'),
        dots: document.querySelectorAll('.dot'),
        contactForm: document.getElementById('contactForm'),
        formSuccess: document.getElementById('formSuccess'),
        newsletterForm: document.getElementById('newsletterForm'),
        animatedElements: document.querySelectorAll('[data-animate]'),
        sliderElement: document.getElementById('testimonialsSlider')
    };

    // Mobile Menu Handling
    const handleMobileMenu = () => {
        const toggleMenu = () => {
            const isActive = elements.mobileMenu.classList.toggle('active');
            elements.overlay.classList.toggle('active');
            document.body.classList.toggle('no-scroll');
            elements.menuBtn.setAttribute('aria-expanded', isActive);
            
            if (isActive) {
                elements.menuClose.focus();
            }
        };

        [elements.menuBtn, elements.menuClose, elements.overlay].forEach(element => {
            element?.addEventListener('click', toggleMenu);
        });

        elements.mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                toggleMenu();
                elements.menuBtn.focus();
            });
        });
    };

    // Scroll Handlers
    const handleScrollEffects = () => {
        const handleHeaderSticky = () => {
            elements.header?.classList.toggle('sticky', window.scrollY > SCROLL_THRESHOLDS.headerSticky);
        };

        const handleBackToTop = () => {
            elements.backToTopBtn?.classList.toggle('active', window.scrollY > SCROLL_THRESHOLDS.backToTop);
        };

        window.addEventListener('scroll', () => {
            handleHeaderSticky();
            handleBackToTop();
        });

        elements.backToTopBtn?.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    };

    // Smooth Scroll
    const handleSmoothScroll = () => {
        elements.navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.hash);
                if (!target) return;

                const targetPosition = target.offsetTop - (elements.header?.offsetHeight || 0);
                window.scrollTo({ top: targetPosition, behavior: 'smooth' });
            });
        });
    };

    // Testimonials Slider
    const handleTestimonialsSlider = () => {
        if (!elements.testimonialsContainer) return;

        let currentIndex = 0;
        let slideInterval;

        const updateSlider = () => {
            const cardWidth = window.innerWidth > 768 ? 
                SLIDER.desktopCardWidth : 
                100;
            
            elements.testimonialsContainer.style.transform = `translateX(${currentIndex * -cardWidth}%)`;
            elements.dots.forEach((dot, i) => dot.classList.toggle('active', i === currentIndex));
        };

        const throttleResize = (fn, delay) => {
            let timeout;
            return () => {
                clearTimeout(timeout);
                timeout = setTimeout(fn, delay);
            };
        };

        elements.nextBtn?.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % elements.testimonialCards.length;
            updateSlider();
        });

        elements.prevBtn?.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + elements.testimonialCards.length) % elements.testimonialCards.length;
            updateSlider();
        });

        elements.dots.forEach((dot, i) => {
            dot.addEventListener('click', () => {
                currentIndex = i;
                updateSlider();
            });
        });

        const handleAutoSlide = () => {
            slideInterval = setInterval(() => {
                currentIndex = (currentIndex + 1) % elements.testimonialCards.length;
                updateSlider();
            }, SLIDER.interval);
        };

        elements.sliderElement?.addEventListener('mouseenter', () => clearInterval(slideInterval));
        elements.sliderElement?.addEventListener('mouseleave', handleAutoSlide);
        window.addEventListener('resize', throttleResize(updateSlider, 100));
        
        handleAutoSlide();
        updateSlider();
    };

    // Form Handling
    const handleForms = () => {
        const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        const validatePhone = (phone) => /^\+?[0-9\s\-()]+$/.test(phone);

        if (elements.contactForm) {
            elements.contactForm.addEventListener('submit', function(e) {
                e.preventDefault();

                const formData = {
                    name: this.name.value.trim(),
                    email: this.email.value.trim(),
                    phone: this.phone.value.trim(),
                    service: this.service.value,
                    message: this.message.value.trim(),
                    terms: this.terms.checked
                };

                if (!Object.values(formData).every(Boolean)) {
                    alert('يرجى ملء جميع الحقول المطلوبة');
                    return;
                }

                if (!validateEmail(formData.email)) {
                    alert('البريد الإلكتروني غير صحيح');
                    return;
                }

                if (!validatePhone(formData.phone)) {
                    alert('رقم الهاتف غير صحيح');
                    return;
                }

                const whatsappMessage = `مرحباً، لدي استفسار:\n\nالاسم: ${formData.name}\nالبريد الإلكتروني: ${formData.email}\nرقم الهاتف: ${formData.phone}\nنوع الخدمة: ${formData.service}\nالرسالة: ${formData.message}`;
                const phoneNumber = "967774494509";
                const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(whatsappMessage)}`;

                this.reset();
                elements.formSuccess.style.display = 'block';

                setTimeout(() => {
                    window.open(whatsappUrl, '_blank');
                    elements.formSuccess.style.display = 'none';
                }, 1000);
            });
        }

        if (elements.newsletterForm) {
            elements.newsletterForm.addEventListener('submit', function(e) {
                e.preventDefault();
                const email = this.querySelector('.newsletter-input').value.trim();
                
                if (!validateEmail(email)) {
                    alert('يرجى إدخال بريد إلكتروني صحيح');
                    return;
                }
            });
        }
    };

    // Animations
    const handleAnimations = () => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        elements.animatedElements.forEach(element => observer.observe(element));
    };

    // Initialize all handlers
    const init = () => {
        handleMobileMenu();
        handleScrollEffects();
        handleSmoothScroll();
        handleTestimonialsSlider();
        handleForms();
        handleAnimations();
    };

    init();
});
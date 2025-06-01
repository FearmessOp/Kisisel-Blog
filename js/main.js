// Main JavaScript File

// DOM elementlerini seç
document.addEventListener('DOMContentLoaded', function() {
    // Load site data from localStorage (updated by admin panel)
    loadSiteData();
    
    // Track page view
    trackPageView();
    // Mobile menu toggle
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    navToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        
        // Hamburger animasyonu
        const spans = navToggle.querySelectorAll('span');
        spans[0].style.transform = navMenu.classList.contains('active') ? 'rotate(-45deg) translate(-5px, 6px)' : '';
        spans[1].style.opacity = navMenu.classList.contains('active') ? '0' : '1';
        spans[2].style.transform = navMenu.classList.contains('active') ? 'rotate(45deg) translate(-5px, -6px)' : '';
    });

    // Scroll animasyonları
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Animasyon eklenecek elementleri gözlemle
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach(element => {
        observer.observe(element);
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Active nav link on scroll
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    function highlightNavLink() {
        const scrollY = window.pageYOffset;

        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href').includes(sectionId)) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', highlightNavLink);

    // Newsletter form handling
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value;
            
            // Basit email doğrulama
            if (validateEmail(email)) {
                // Başarı mesajı göster
                showNotification('Başarılı! Bültenimize kaydoldunuz.', 'success');
                emailInput.value = '';
            } else {
                showNotification('Lütfen geçerli bir e-posta adresi girin.', 'error');
            }
        });
    }

    // Email validation
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    // Notification system
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // CSS ile stil verilecek
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 2rem;
            background: ${type === 'success' ? '#48bb78' : '#f56565'};
            color: white;
            border-radius: 8px;
            z-index: 1000;
            animation: slideInRight 0.3s ease-out;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Parallax effect for hero section
    const hero = document.querySelector('.hero');
    if (hero) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallaxSpeed = 0.5;
            hero.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
        });
    }

    // Dynamic typing effect
    const typingElements = document.querySelectorAll('[data-typing]');
    typingElements.forEach(element => {
        const text = element.getAttribute('data-typing');
        element.textContent = '';
        let index = 0;

        function type() {
            if (index < text.length) {
                element.textContent += text.charAt(index);
                index++;
                setTimeout(type, 100);
            }
        }
        
        // Start typing when element is visible
        const typingObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    type();
                    typingObserver.unobserve(entry.target);
                }
            });
        });
        
        typingObserver.observe(element);
    });

    // Add hover effect to cards
    const cards = document.querySelectorAll('.post-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Lazy loading for images
    const images = document.querySelectorAll('img[data-src]');
    const imageOptions = {
        threshold: 0.01,
        rootMargin: '0px 0px 50px 0px'
    };

    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.getAttribute('data-src');
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    }, imageOptions);

    images.forEach(img => imageObserver.observe(img));

    // Back to top button
    const backToTopButton = document.createElement('button');
    backToTopButton.innerHTML = '<i class="fas fa-arrow-up"></i>';
    backToTopButton.className = 'back-to-top';
    backToTopButton.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        background: var(--primary-color);
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        display: none;
        align-items: center;
        justify-content: center;
        z-index: 999;
        transition: all 0.3s ease;
    `;

    document.body.appendChild(backToTopButton);

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopButton.style.display = 'flex';
        } else {
            backToTopButton.style.display = 'none';
        }
    });

    backToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Add page load animation
    document.body.classList.add('page-transition');

    // Performance optimization - Debounce scroll events
    let ticking = false;
    function updateOnScroll() {
        highlightNavLink();
        ticking = false;
    }

    function requestTick() {
        if (!ticking) {
            window.requestAnimationFrame(updateOnScroll);
            ticking = true;
        }
    }

    window.addEventListener('scroll', requestTick);
});

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Export for use in other modules
window.blogUtils = {
    debounce,
    throttle,
    showNotification: (msg, type) => {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = msg;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 2rem;
            background: ${type === 'success' ? '#48bb78' : '#f56565'};
            color: white;
            border-radius: 8px;
            z-index: 1000;
            animation: slideInRight 0.3s ease-out;
        `;
        document.body.appendChild(notification);
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
};

// Load site data from localStorage
function loadSiteData() {
    // Load profile data
    const profileData = localStorage.getItem('adminProfile');
    if (profileData) {
        const profile = JSON.parse(profileData);
        
        // Update hero section
        const heroTitle = document.querySelector('.hero-title');
        if (heroTitle) {
            heroTitle.innerHTML = `Merhaba, Ben <span class="text-gradient">${profile.fullName || 'Kişisel Blog'}</span>`;
        }
        
        const heroSubtitle = document.querySelector('.hero-subtitle');
        if (heroSubtitle) {
            heroSubtitle.textContent = profile.title || 'Yazılım geliştirici, tasarımcı ve teknoloji tutkunu';
        }
        
        // Update footer
        const footerEmail = document.querySelector('.footer-section p i.fa-envelope');
        if (footerEmail && footerEmail.parentElement) {
            footerEmail.parentElement.innerHTML = `<i class="fas fa-envelope"></i> ${profile.email || 'info@example.com'}`;
        }
        
        // Update social links
        if (profile.github) {
            document.querySelectorAll('a[href="#"][aria-label="GitHub"]').forEach(link => {
                link.href = profile.github;
                link.target = '_blank';
            });
        }
        if (profile.twitter) {
            document.querySelectorAll('a[href="#"][aria-label="Twitter"]').forEach(link => {
                link.href = profile.twitter;
                link.target = '_blank';
            });
        }
        if (profile.linkedin) {
            document.querySelectorAll('a[href="#"][aria-label="LinkedIn"]').forEach(link => {
                link.href = profile.linkedin;
                link.target = '_blank';
            });
        }
        if (profile.instagram) {
            document.querySelectorAll('a[href="#"][aria-label="Instagram"]').forEach(link => {
                link.href = profile.instagram;
                link.target = '_blank';
            });
        }
    }
    
    // Load site settings
    const settingsData = localStorage.getItem('siteSettings');
    if (settingsData) {
        const settings = JSON.parse(settingsData);
        
        // Update site title
        if (settings.siteName) {
            document.title = document.title.replace('Kişisel Blog', settings.siteName);
            
            // Update logo
            const navLogo = document.querySelector('.nav-logo a');
            if (navLogo) {
                // Get initials from site name
                const initials = settings.siteName.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
                navLogo.textContent = initials;
            }
        }
        
        // Apply color changes
        if (settings.primaryColor) {
            document.documentElement.style.setProperty('--primary-color', settings.primaryColor);
        }
        if (settings.secondaryColor) {
            document.documentElement.style.setProperty('--secondary-color', settings.secondaryColor);
        }
    }
    
    // Load profile image
    const profileImage = localStorage.getItem('adminProfileImage');
    if (profileImage) {
        // This would be used in about page
        // For now, we'll store it for later use
        window.profileImageUrl = profileImage;
    }
}

// Track page views
function trackPageView() {
    const currentPage = window.location.pathname;
    
    // Send page view to server
    fetch('/api/track-view', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ page: currentPage })
    }).catch(err => {
        console.error('Error tracking page view:', err);
    });
}
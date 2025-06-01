// About Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Load admin data
    loadAboutPageData();
    // Animate skill bars when visible
    const skillBars = document.querySelectorAll('.skill-progress');
    
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progress = entry.target.getAttribute('data-progress');
                entry.target.style.setProperty('--progress-width', `${progress}%`);
                entry.target.classList.add('animate');
                
                // Animate the number counter
                animateCounter(entry.target, progress);
                
                skillObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    skillBars.forEach(bar => {
        skillObserver.observe(bar);
    });

    // Animate counter
    function animateCounter(element, target) {
        let current = 0;
        const increment = target / 50;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.setAttribute('data-progress', Math.floor(current));
        }, 20);
    }

    // Timeline animation
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    const timelineObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 200);
            }
        });
    }, { threshold: 0.3 });

    timelineItems.forEach(item => {
        timelineObserver.observe(item);
    });

    // Fun facts counter animation
    const factCards = document.querySelectorAll('.fact-card h3');
    
    const factObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target.textContent.replace(/[^0-9]/g, '');
                const suffix = entry.target.textContent.replace(/[0-9]/g, '');
                animateFactCounter(entry.target, parseInt(target), suffix);
                factObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    factCards.forEach(fact => {
        factObserver.observe(fact);
    });

    function animateFactCounter(element, target, suffix) {
        let current = 0;
        const increment = target / 50;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current) + suffix;
        }, 30);
    }

    // Profile image parallax
    const profileImage = document.querySelector('.about-image');
    if (profileImage) {
        window.addEventListener('mousemove', (e) => {
            const x = (e.clientX - window.innerWidth / 2) / 50;
            const y = (e.clientY - window.innerHeight / 2) / 50;
            
            profileImage.style.transform = `translate(${x}px, ${y}px)`;
        });
    }

    // Add hover effect to stat items
    const statItems = document.querySelectorAll('.stat-item');
    statItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.background = 'linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1))';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.background = 'var(--bg-secondary)';
        });
    });

    // Download CV button (if needed)
    const cvButton = document.createElement('a');
    cvButton.href = '#';
    cvButton.className = 'cv-button';
    cvButton.innerHTML = '<i class="fas fa-download"></i> CV İndir';
    cvButton.style.cssText = `
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        margin-top: 1rem;
        padding: 0.8rem 1.5rem;
        background: var(--bg-secondary);
        color: var(--text-color);
        border-radius: var(--border-radius);
        text-decoration: none;
        transition: var(--transition);
        font-weight: 500;
    `;

    // Add CV button after description
    const aboutDescription = document.querySelector('.about-description');
    if (aboutDescription) {
        aboutDescription.parentNode.insertBefore(cvButton, aboutDescription.nextSibling);
    }

    cvButton.addEventListener('mouseenter', function() {
        this.style.background = 'var(--primary-color)';
        this.style.color = 'white';
        this.style.transform = 'translateY(-2px)';
    });

    cvButton.addEventListener('mouseleave', function() {
        this.style.background = 'var(--bg-secondary)';
        this.style.color = 'var(--text-color)';
        this.style.transform = 'translateY(0)';
    });

    // Smooth reveal for sections
    const sections = document.querySelectorAll('section');
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'all 0.6s ease-out';
        sectionObserver.observe(section);
    });
});

// Add dynamic CSS for timeline animations
const style = document.createElement('style');
style.textContent = `
    .timeline-item {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.6s ease-out;
    }
    
    .timeline-item.visible {
        opacity: 1;
        transform: translateY(0);
    }
    
    .timeline-item:nth-child(odd).visible .timeline-content {
        animation: slideInLeft 0.6s ease-out;
    }
    
    .timeline-item:nth-child(even).visible .timeline-content {
        animation: slideInRight 0.6s ease-out;
    }
    
    @keyframes slideInLeft {
        from {
            opacity: 0;
            transform: translateX(-50px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(50px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
`;
document.head.appendChild(style);

// Load about page data from localStorage
function loadAboutPageData() {
    // Load profile data
    const profileData = localStorage.getItem('adminProfile');
    if (profileData) {
        const profile = JSON.parse(profileData);
        
        // Update about page content
        const aboutTitle = document.querySelector('.about-title');
        if (aboutTitle) {
            aboutTitle.innerHTML = `Merhaba, Ben <span class="text-gradient">${profile.fullName || 'Kişisel Blog'}</span>`;
        }
        
        const aboutSubtitle = document.querySelector('.about-subtitle');
        if (aboutSubtitle) {
            aboutSubtitle.textContent = profile.title || 'Full Stack Developer & UI/UX Enthusiast';
        }
        
        const aboutDescription = document.querySelector('.about-description');
        if (aboutDescription) {
            aboutDescription.textContent = profile.bio || '5+ yıllık deneyime sahip tutkulu bir yazılım geliştiriciyim. Modern web teknolojileri, kullanıcı deneyimi tasarımı ve açık kaynak projeler üzerine çalışıyorum. Bu blogda teknoloji yolculuğumdaki deneyimlerimi ve öğrendiklerimi paylaşıyorum.';
        }
        
        // Update contact info
        const emailElements = document.querySelectorAll('.info-content p');
        emailElements.forEach(el => {
            if (el.textContent.includes('@')) {
                el.innerHTML = profile.email || 'info@example.com';
            }
            if (el.textContent.includes('İstanbul')) {
                el.textContent = profile.location || 'İstanbul, Türkiye';
            }
        });
        
        // Update social links
        if (profile.github) {
            document.querySelectorAll('.bio-social a[aria-label="GitHub"]').forEach(link => {
                link.href = profile.github;
                link.target = '_blank';
            });
        }
        if (profile.twitter) {
            document.querySelectorAll('.bio-social a[aria-label="Twitter"]').forEach(link => {
                link.href = profile.twitter;
                link.target = '_blank';
            });
        }
        if (profile.linkedin) {
            document.querySelectorAll('.bio-social a[aria-label="LinkedIn"]').forEach(link => {
                link.href = profile.linkedin;
                link.target = '_blank';
            });
        }
    }
    
    // Load profile image
    const profileImage = localStorage.getItem('adminProfileImage');
    if (profileImage) {
        const aboutImage = document.querySelector('.about-image img');
        if (aboutImage) {
            aboutImage.src = profileImage;
        }
    }
    
    // Load site settings for colors
    const settingsData = localStorage.getItem('siteSettings');
    if (settingsData) {
        const settings = JSON.parse(settingsData);
        
        // Apply color changes
        if (settings.primaryColor) {
            document.documentElement.style.setProperty('--primary-color', settings.primaryColor);
        }
        if (settings.secondaryColor) {
            document.documentElement.style.setProperty('--secondary-color', settings.secondaryColor);
        }
    }
}
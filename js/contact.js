// Contact Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Load contact page data
    loadContactPageData();
    // Contact Form Handling
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = {
                name: this.name.value.trim(),
                email: this.email.value.trim(),
                subject: this.subject.value.trim(),
                message: this.message.value.trim()
            };
            
            // Validate form
            if (!validateForm(formData)) {
                return;
            }
            
            // Show loading state
            const submitBtn = this.querySelector('.btn-submit');
            const originalText = submitBtn.innerHTML;
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;
            
            // Simulate sending email (in real app, this would be an API call)
            try {
                await sendMessage(formData);
                
                // Show success message
                showSuccessMessage();
                
                // Reset form
                this.reset();
                
                // Track event
                console.log('Contact form submitted:', formData);
                
            } catch (error) {
                showError('Mesaj gönderilemedi. Lütfen tekrar deneyin.');
            } finally {
                submitBtn.classList.remove('loading');
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        });
    }
    
    // Form validation
    function validateForm(data) {
        let isValid = true;
        
        // Reset previous errors
        document.querySelectorAll('.form-group').forEach(group => {
            group.classList.remove('error', 'success');
            const errorMsg = group.querySelector('.error-message');
            if (errorMsg) errorMsg.remove();
        });
        
        // Validate name
        if (data.name.length < 2) {
            showFieldError('name', 'Ad en az 2 karakter olmalıdır');
            isValid = false;
        } else {
            showFieldSuccess('name');
        }
        
        // Validate email
        if (!isValidEmail(data.email)) {
            showFieldError('email', 'Geçerli bir e-posta adresi girin');
            isValid = false;
        } else {
            showFieldSuccess('email');
        }
        
        // Validate subject
        if (data.subject.length < 3) {
            showFieldError('subject', 'Konu en az 3 karakter olmalıdır');
            isValid = false;
        } else {
            showFieldSuccess('subject');
        }
        
        // Validate message
        if (data.message.length < 10) {
            showFieldError('message', 'Mesaj en az 10 karakter olmalıdır');
            isValid = false;
        } else {
            showFieldSuccess('message');
        }
        
        return isValid;
    }
    
    function isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    function showFieldError(fieldName, message) {
        const field = document.getElementById(fieldName);
        const formGroup = field.closest('.form-group');
        formGroup.classList.add('error');
        
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.textContent = message;
        formGroup.appendChild(errorElement);
    }
    
    function showFieldSuccess(fieldName) {
        const field = document.getElementById(fieldName);
        const formGroup = field.closest('.form-group');
        formGroup.classList.add('success');
    }
    
    async function sendMessage(data) {
        // Simulate API call
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate 90% success rate
                if (Math.random() > 0.1) {
                    resolve();
                } else {
                    reject();
                }
            }, 2000);
        });
    }
    
    function showSuccessMessage() {
        const formWrapper = document.querySelector('.contact-form-wrapper');
        const originalContent = formWrapper.innerHTML;
        
        formWrapper.innerHTML = `
            <div class="form-success animate-scale-in">
                <i class="fas fa-check-circle"></i>
                <h2>Mesajınız Gönderildi!</h2>
                <p>En kısa sürede size dönüş yapacağım.</p>
                <button class="btn btn-primary" onclick="location.reload()">
                    Yeni Mesaj Gönder
                </button>
            </div>
        `;
        
        // Auto reset after 10 seconds
        setTimeout(() => {
            formWrapper.innerHTML = originalContent;
            attachFormListeners();
        }, 10000);
    }
    
    function showError(message) {
        window.blogUtils.showNotification(message, 'error');
    }
    
    // Real-time validation
    const inputs = contactForm?.querySelectorAll('input, textarea');
    inputs?.forEach(input => {
        input.addEventListener('blur', function() {
            const formData = {
                [this.name]: this.value.trim()
            };
            
            // Simple validation on blur
            if (this.name === 'email' && this.value) {
                if (!isValidEmail(this.value)) {
                    showFieldError('email', 'Geçerli bir e-posta adresi girin');
                } else {
                    showFieldSuccess('email');
                }
            }
        });
        
        // Remove error on input
        input.addEventListener('input', function() {
            const formGroup = this.closest('.form-group');
            formGroup.classList.remove('error');
            const errorMsg = formGroup.querySelector('.error-message');
            if (errorMsg) errorMsg.remove();
        });
    });
    
    // FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', function() {
            // Close other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            item.classList.toggle('active');
            
            // Smooth scroll to view
            if (item.classList.contains('active')) {
                setTimeout(() => {
                    item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }, 300);
            }
        });
    });
    
    // Social links hover effect
    const socialItems = document.querySelectorAll('.social-item');
    
    socialItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) rotate(5deg)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) rotate(0)';
        });
    });
    
    // Copy email to clipboard
    const emailInfo = document.querySelector('.info-item .info-content p');
    if (emailInfo && emailInfo.textContent.includes('@')) {
        emailInfo.style.cursor = 'pointer';
        emailInfo.title = 'Kopyalamak için tıklayın';
        
        emailInfo.addEventListener('click', function() {
            const email = this.textContent;
            navigator.clipboard.writeText(email).then(() => {
                window.blogUtils.showNotification('E-posta adresi kopyalandı!', 'success');
                
                // Visual feedback
                this.style.color = 'var(--primary-color)';
                setTimeout(() => {
                    this.style.color = '';
                }, 1000);
            });
        });
    }
    
    // Animate info items on scroll
    const infoItems = document.querySelectorAll('.info-item');
    const infoObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateX(0)';
                }, index * 100);
                infoObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    infoItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-20px)';
        item.style.transition = 'all 0.6s ease-out';
        infoObserver.observe(item);
    });
    
    // Add floating animation to map icon
    const mapIcon = document.querySelector('.map-placeholder i');
    if (mapIcon) {
        mapIcon.style.animation = 'float 3s ease-in-out infinite';
    }
    
    // Form character counter
    const messageTextarea = document.getElementById('message');
    if (messageTextarea) {
        const charCounter = document.createElement('div');
        charCounter.className = 'char-counter';
        charCounter.style.cssText = `
            text-align: right;
            font-size: 0.875rem;
            color: var(--text-light);
            margin-top: 0.25rem;
        `;
        
        messageTextarea.parentNode.appendChild(charCounter);
        
        function updateCharCount() {
            const length = messageTextarea.value.length;
            const maxLength = 500;
            charCounter.textContent = `${length}/${maxLength}`;
            
            if (length > maxLength * 0.8) {
                charCounter.style.color = '#f56565';
            } else {
                charCounter.style.color = 'var(--text-light)';
            }
        }
        
        messageTextarea.addEventListener('input', updateCharCount);
        updateCharCount();
    }
    
    // Re-attach form listeners (for when form is reset)
    function attachFormListeners() {
        const newForm = document.getElementById('contactForm');
        if (newForm) {
            // Re-attach all event listeners
            newForm.addEventListener('submit', arguments.callee);
        }
    }
});

// Add page-specific styles
const style = document.createElement('style');
style.textContent = `
    .char-counter {
        transition: color 0.3s ease;
    }
    
    .info-content p:hover {
        color: var(--primary-color);
        transition: color 0.3s ease;
    }
    
    .form-success button {
        margin-top: 1.5rem;
    }
`;
document.head.appendChild(style);

// Load contact page data from localStorage
function loadContactPageData() {
    // Load profile data
    const profileData = localStorage.getItem('adminProfile');
    if (profileData) {
        const profile = JSON.parse(profileData);
        
        // Update contact info
        const emailInfo = document.querySelector('.info-item .info-content p');
        if (emailInfo && emailInfo.parentElement.previousElementSibling.textContent.includes('E-posta')) {
            emailInfo.textContent = profile.email || 'info@example.com';
        }
        
        // Update location
        const locationInfo = document.querySelectorAll('.info-item .info-content p');
        locationInfo.forEach(p => {
            if (p.textContent.includes('İstanbul')) {
                p.textContent = profile.location || 'İstanbul, Türkiye';
            }
        });
        
        // Update social links
        if (profile.github) {
            const githubLink = document.querySelector('.social-item[aria-label="GitHub"]');
            if (githubLink) {
                githubLink.href = profile.github;
                githubLink.target = '_blank';
            }
        }
        if (profile.twitter) {
            const twitterLink = document.querySelector('.social-item[aria-label="Twitter"]');
            if (twitterLink) {
                twitterLink.href = profile.twitter;
                twitterLink.target = '_blank';
            }
        }
        if (profile.linkedin) {
            const linkedinLink = document.querySelector('.social-item[aria-label="LinkedIn"]');
            if (linkedinLink) {
                linkedinLink.href = profile.linkedin;
                linkedinLink.target = '_blank';
            }
        }
        if (profile.instagram) {
            const instagramLink = document.querySelector('.social-item[aria-label="Instagram"]');
            if (instagramLink) {
                instagramLink.href = profile.instagram;
                instagramLink.target = '_blank';
            }
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
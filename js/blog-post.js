// Blog Post JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Reading Progress Bar
    const progressBar = document.querySelector('.reading-progress');
    const article = document.querySelector('.blog-post');
    
    function updateProgress() {
        if (!article) return;
        
        const articleHeight = article.offsetHeight - window.innerHeight;
        const scrolled = window.pageYOffset - article.offsetTop;
        const progress = Math.max(0, Math.min(100, (scrolled / articleHeight) * 100));
        
        if (progressBar) {
            progressBar.style.width = `${progress}%`;
        }
    }
    
    window.addEventListener('scroll', updateProgress);
    window.addEventListener('resize', updateProgress);
    
    // Back to Top Button
    const backToTopBtn = document.getElementById('backToTop');
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopBtn.style.display = 'flex';
        } else {
            backToTopBtn.style.display = 'none';
        }
    });
    
    backToTopBtn?.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Share Functionality
    const shareLinks = document.querySelectorAll('.share-link');
    const currentUrl = window.location.href;
    const pageTitle = document.querySelector('.post-title').textContent;
    
    shareLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const platform = this.classList[1]; // Get platform class
            let shareUrl = '';
            
            switch(platform) {
                case 'twitter':
                    shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(pageTitle)}&url=${encodeURIComponent(currentUrl)}`;
                    break;
                case 'linkedin':
                    shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`;
                    break;
                case 'facebook':
                    shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`;
                    break;
                case 'copy':
                    copyToClipboard(currentUrl);
                    return;
            }
            
            if (shareUrl) {
                window.open(shareUrl, '_blank', 'width=600,height=400');
            }
        });
    });
    
    // Copy to Clipboard
    function copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            window.blogUtils.showNotification('Link kopyalandı!', 'success');
            
            // Visual feedback
            const copyBtn = document.querySelector('.share-link.copy');
            const originalHTML = copyBtn.innerHTML;
            copyBtn.innerHTML = '<i class="fas fa-check"></i>';
            
            setTimeout(() => {
                copyBtn.innerHTML = originalHTML;
            }, 2000);
        }).catch(err => {
            window.blogUtils.showNotification('Link kopyalanamadı', 'error');
        });
    }
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Add IDs to headings for anchor links
    const headings = document.querySelectorAll('.post-content h2, .post-content h3');
    headings.forEach(heading => {
        const id = heading.textContent.toLowerCase()
            .replace(/[^\w\s]/gi, '')
            .replace(/\s+/g, '-');
        heading.id = id;
        
        // Add anchor link
        const anchor = document.createElement('a');
        anchor.href = `#${id}`;
        anchor.className = 'heading-anchor';
        anchor.innerHTML = '<i class="fas fa-link"></i>';
        anchor.title = 'Bu başlığa link';
        heading.appendChild(anchor);
    });
    
    // Image zoom functionality
    const contentImages = document.querySelectorAll('.post-content img');
    contentImages.forEach(img => {
        img.style.cursor = 'zoom-in';
        
        img.addEventListener('click', function() {
            const overlay = document.createElement('div');
            overlay.className = 'image-overlay';
            overlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.9);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 9999;
                cursor: zoom-out;
                padding: 2rem;
            `;
            
            const clonedImg = img.cloneNode();
            clonedImg.style.cssText = `
                max-width: 90%;
                max-height: 90%;
                object-fit: contain;
            `;
            
            overlay.appendChild(clonedImg);
            document.body.appendChild(overlay);
            
            overlay.addEventListener('click', () => {
                overlay.remove();
            });
            
            // Close on ESC key
            document.addEventListener('keydown', function closeOnEsc(e) {
                if (e.key === 'Escape') {
                    overlay.remove();
                    document.removeEventListener('keydown', closeOnEsc);
                }
            });
        });
    });
    
    // Estimated reading time
    function calculateReadingTime() {
        const content = document.querySelector('.post-content');
        if (!content) return;
        
        const text = content.textContent;
        const wordsPerMinute = 200;
        const words = text.trim().split(/\s+/).length;
        const minutes = Math.ceil(words / wordsPerMinute);
        
        const readTimeElement = document.querySelector('.post-read-time');
        if (readTimeElement) {
            readTimeElement.innerHTML = `<i class="far fa-clock"></i> ${minutes} dk okuma`;
        }
    }
    
    calculateReadingTime();
    
    // Table of Contents (if needed)
    function generateTableOfContents() {
        const headings = document.querySelectorAll('.post-content h2');
        if (headings.length < 3) return; // Only show TOC if there are enough headings
        
        const toc = document.createElement('div');
        toc.className = 'table-of-contents';
        toc.innerHTML = '<h3>İçindekiler</h3><ul></ul>';
        
        const list = toc.querySelector('ul');
        
        headings.forEach(heading => {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = `#${heading.id}`;
            a.textContent = heading.textContent;
            li.appendChild(a);
            list.appendChild(li);
        });
        
        // Insert TOC after the lead paragraph
        const leadParagraph = document.querySelector('.post-content .lead');
        if (leadParagraph) {
            leadParagraph.parentNode.insertBefore(toc, leadParagraph.nextSibling);
        }
    }
    
    // Uncomment to enable TOC
    // generateTableOfContents();
    
    // Related posts hover effect
    const relatedItems = document.querySelectorAll('.related-item');
    relatedItems.forEach(item => {
        item.addEventListener('click', function() {
            // In a real app, this would navigate to the post
            console.log('Navigating to related post...');
        });
    });
    
    // Code syntax highlighting with Prism
    if (typeof Prism !== 'undefined') {
        Prism.highlightAll();
    }
    
    // Add line numbers to code blocks
    document.querySelectorAll('pre code').forEach(block => {
        block.parentElement.classList.add('line-numbers');
    });
});

// Add dynamic styles
const style = document.createElement('style');
style.textContent = `
    .heading-anchor {
        opacity: 0;
        margin-left: 0.5rem;
        color: var(--text-light);
        text-decoration: none;
        transition: opacity 0.3s ease;
    }
    
    h2:hover .heading-anchor,
    h3:hover .heading-anchor {
        opacity: 1;
    }
    
    .heading-anchor:hover {
        color: var(--primary-color);
    }
    
    .table-of-contents {
        background: var(--bg-secondary);
        padding: 1.5rem;
        border-radius: var(--border-radius);
        margin: 2rem 0;
    }
    
    .table-of-contents h3 {
        margin-bottom: 1rem;
        font-size: 1.2rem;
    }
    
    .table-of-contents ul {
        list-style: none;
        padding-left: 0;
    }
    
    .table-of-contents li {
        margin-bottom: 0.5rem;
    }
    
    .table-of-contents a {
        color: var(--text-color);
        text-decoration: none;
        transition: color 0.3s ease;
    }
    
    .table-of-contents a:hover {
        color: var(--primary-color);
    }
    
    .image-overlay {
        animation: fadeIn 0.3s ease;
    }
    
    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);
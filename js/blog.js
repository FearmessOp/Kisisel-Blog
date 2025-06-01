// Blog Page Functionality

document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const filterButtons = document.querySelectorAll('.filter-btn');
    const postCards = document.querySelectorAll('.post-card');
    const searchInput = document.getElementById('searchInput');
    const postsGrid = document.getElementById('postsGrid');
    const pageButtons = document.querySelectorAll('.page-btn');

    // Category Filtering
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            const filterValue = this.getAttribute('data-filter');
            
            // Filter posts
            postCards.forEach(post => {
                if (filterValue === 'all' || post.getAttribute('data-category') === filterValue) {
                    post.style.display = 'block';
                    post.classList.add('animate-scale-in');
                } else {
                    post.style.display = 'none';
                }
            });

            // Update URL without page reload
            const url = new URL(window.location);
            url.searchParams.set('category', filterValue);
            window.history.pushState({}, '', url);
        });
    });

    // Search Functionality
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        
        postCards.forEach(post => {
            const title = post.querySelector('.post-title').textContent.toLowerCase();
            const excerpt = post.querySelector('.post-excerpt').textContent.toLowerCase();
            const category = post.querySelector('.post-category').textContent.toLowerCase();
            
            if (title.includes(searchTerm) || excerpt.includes(searchTerm) || category.includes(searchTerm)) {
                post.style.display = 'block';
                highlightText(post, searchTerm);
            } else {
                post.style.display = 'none';
            }
        });

        // If search is empty, remove highlights
        if (searchTerm === '') {
            removeHighlights();
        }
    });

    // Highlight search terms
    function highlightText(element, searchTerm) {
        if (searchTerm === '') return;
        
        const title = element.querySelector('.post-title');
        const excerpt = element.querySelector('.post-excerpt');
        
        [title, excerpt].forEach(el => {
            const text = el.textContent;
            const regex = new RegExp(`(${searchTerm})`, 'gi');
            const highlightedText = text.replace(regex, '<mark>$1</mark>');
            el.innerHTML = highlightedText;
        });
    }

    // Remove highlights
    function removeHighlights() {
        document.querySelectorAll('mark').forEach(mark => {
            const parent = mark.parentNode;
            parent.replaceChild(document.createTextNode(mark.textContent), mark);
            parent.normalize();
        });
    }

    // Pagination
    pageButtons.forEach(button => {
        button.addEventListener('click', function() {
            pageButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Scroll to top of posts section
            postsGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
            
            // Simulate loading new posts (in real app, this would be an API call)
            loadNewPosts(this.textContent);
        });
    });

    // Simulate loading new posts
    function loadNewPosts(pageNumber) {
        // Show loading state
        postsGrid.style.opacity = '0.5';
        
        setTimeout(() => {
            // In a real app, you would fetch new posts here
            console.log(`Loading page ${pageNumber}`);
            postsGrid.style.opacity = '1';
            
            // Re-apply animations to new posts
            postCards.forEach((post, index) => {
                post.style.animationDelay = `${index * 0.1}s`;
                post.classList.add('animate-fade-in');
            });
        }, 500);
    }

    // Sort functionality
    const sortDropdown = document.createElement('select');
    sortDropdown.className = 'sort-dropdown';
    sortDropdown.innerHTML = `
        <option value="newest">En Yeni</option>
        <option value="oldest">En Eski</option>
        <option value="popular">Popüler</option>
        <option value="reading-time">Okuma Süresi</option>
    `;

    // Add sort dropdown to search box
    const searchBox = document.querySelector('.search-box');
    if (searchBox) {
        searchBox.appendChild(sortDropdown);
        
        sortDropdown.addEventListener('change', function() {
            sortPosts(this.value);
        });
    }

    // Sort posts
    function sortPosts(sortBy) {
        const postsArray = Array.from(postCards);
        
        postsArray.sort((a, b) => {
            switch(sortBy) {
                case 'newest':
                    return getPostDate(b) - getPostDate(a);
                case 'oldest':
                    return getPostDate(a) - getPostDate(b);
                case 'reading-time':
                    return getReadingTime(a) - getReadingTime(b);
                default:
                    return 0;
            }
        });
        
        // Re-append sorted posts
        postsArray.forEach(post => {
            postsGrid.appendChild(post);
        });
    }

    // Helper functions for sorting
    function getPostDate(post) {
        const dateText = post.querySelector('.post-date').textContent;
        // Parse date (this is simplified, in real app you'd have proper date parsing)
        return new Date(dateText.replace(/[^\d\s\w]/g, '')).getTime();
    }

    function getReadingTime(post) {
        const timeText = post.querySelector('.post-read-time').textContent;
        return parseInt(timeText.match(/\d+/)[0]);
    }

    // Load more posts on scroll (Infinite scroll)
    let loading = false;
    window.addEventListener('scroll', () => {
        if (loading) return;
        
        const scrollPosition = window.innerHeight + window.pageYOffset;
        const documentHeight = document.documentElement.offsetHeight;
        
        if (scrollPosition >= documentHeight - 500) {
            loading = true;
            loadMorePosts();
        }
    });

    function loadMorePosts() {
        // Simulate loading
        setTimeout(() => {
            console.log('Loading more posts...');
            loading = false;
            // In real app, append new posts here
        }, 1000);
    }

    // Check URL parameters on load
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get('category');
    if (categoryParam) {
        const categoryButton = document.querySelector(`[data-filter="${categoryParam}"]`);
        if (categoryButton) {
            categoryButton.click();
        }
    }

    // Add view counter (simulated)
    postCards.forEach(post => {
        post.addEventListener('click', function(e) {
            if (!e.target.closest('a')) return;
            
            // Simulate view count increment
            const viewCount = Math.floor(Math.random() * 1000) + 100;
            console.log(`Post viewed. Total views: ${viewCount}`);
        });
    });

    // Reading progress indicator
    const progressBar = document.createElement('div');
    progressBar.className = 'reading-progress';
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        height: 3px;
        background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
        width: 0%;
        z-index: 1000;
        transition: width 0.3s ease;
    `;
    document.body.appendChild(progressBar);

    // Update progress bar on scroll
    window.addEventListener('scroll', () => {
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPosition = window.pageYOffset;
        const progress = (scrollPosition / scrollHeight) * 100;
        progressBar.style.width = `${progress}%`;
    });
});

// Add CSS for new elements
const style = document.createElement('style');
style.textContent = `
    /* Blog page specific styles */
    .blog-header {
        padding: 3rem 0;
        text-align: center;
        background: var(--bg-secondary);
    }

    .blog-title {
        font-size: 3rem;
        margin-bottom: 1rem;
        font-family: 'Playfair Display', serif;
    }

    .blog-subtitle {
        font-size: 1.25rem;
        color: var(--text-light);
        margin-bottom: 2rem;
    }

    .category-filters {
        display: flex;
        justify-content: center;
        gap: 1rem;
        margin-bottom: 2rem;
        flex-wrap: wrap;
    }

    .filter-btn {
        padding: 0.5rem 1.5rem;
        border: 2px solid var(--border-color);
        background: transparent;
        color: var(--text-color);
        border-radius: 25px;
        cursor: pointer;
        transition: var(--transition);
        font-weight: 500;
    }

    .filter-btn:hover,
    .filter-btn.active {
        background: var(--primary-color);
        color: white;
        border-color: var(--primary-color);
        transform: translateY(-2px);
    }

    .search-box {
        max-width: 500px;
        margin: 0 auto;
        position: relative;
        display: flex;
        gap: 1rem;
        align-items: center;
    }

    .search-box input {
        flex: 1;
        padding: 1rem 3rem 1rem 1rem;
        border: 2px solid var(--border-color);
        border-radius: var(--border-radius);
        font-size: 1rem;
        background: var(--bg-color);
        color: var(--text-color);
        transition: var(--transition);
    }

    .search-box input:focus {
        outline: none;
        border-color: var(--primary-color);
    }

    .search-box i {
        position: absolute;
        right: 70px;
        color: var(--text-light);
    }

    .sort-dropdown {
        padding: 0.8rem;
        border: 2px solid var(--border-color);
        border-radius: var(--border-radius);
        background: var(--bg-color);
        color: var(--text-color);
        cursor: pointer;
    }

    .blog-posts {
        padding: 3rem 0;
    }

    .pagination {
        display: flex;
        justify-content: center;
        gap: 0.5rem;
        margin-top: 3rem;
    }

    .page-btn {
        width: 40px;
        height: 40px;
        border: 2px solid var(--border-color);
        background: transparent;
        color: var(--text-color);
        border-radius: 8px;
        cursor: pointer;
        transition: var(--transition);
        font-weight: 600;
    }

    .page-btn:hover,
    .page-btn.active {
        background: var(--primary-color);
        color: white;
        border-color: var(--primary-color);
    }

    mark {
        background: rgba(102, 126, 234, 0.2);
        color: inherit;
        padding: 0.1rem 0.2rem;
        border-radius: 3px;
    }

    @media (max-width: 768px) {
        .blog-title {
            font-size: 2rem;
        }

        .category-filters {
            justify-content: flex-start;
            overflow-x: auto;
            padding-bottom: 0.5rem;
        }

        .search-box {
            flex-direction: column;
        }

        .search-box input {
            width: 100%;
        }

        .sort-dropdown {
            width: 100%;
        }
    }
`;
document.head.appendChild(style);
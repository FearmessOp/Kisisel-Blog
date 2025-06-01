// Admin Panel JavaScript

// Default admin credentials (in production, this should be in a secure database)
const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'admin123' // In production, this should be hashed
};

// Check if user is logged in
function checkAuth() {
    const isLoggedIn = sessionStorage.getItem('adminLoggedIn') === 'true';
    const loginContainer = document.getElementById('loginContainer');
    const adminPanel = document.getElementById('adminPanel');

    if (isLoggedIn) {
        loginContainer.style.display = 'none';
        adminPanel.style.display = 'grid';
        loadAdminData();
    } else {
        loginContainer.style.display = 'flex';
        adminPanel.style.display = 'none';
    }
}

// Login functionality
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
        sessionStorage.setItem('adminLoggedIn', 'true');
        sessionStorage.setItem('adminUsername', username);
        checkAuth();
        showNotification('Giriş başarılı!', 'success');
    } else {
        showNotification('Kullanıcı adı veya şifre hatalı!', 'error');
        // Add shake animation to login box
        document.querySelector('.login-box').classList.add('animate-shake');
        setTimeout(() => {
            document.querySelector('.login-box').classList.remove('animate-shake');
        }, 500);
    }
});

// Logout functionality
document.getElementById('logoutBtn').addEventListener('click', function() {
    sessionStorage.removeItem('adminLoggedIn');
    sessionStorage.removeItem('adminUsername');
    checkAuth();
    showNotification('Çıkış yapıldı', 'info');
});

// Navigation
document.querySelectorAll('.admin-nav .nav-item').forEach(item => {
    item.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Remove active class from all items
        document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
        document.querySelectorAll('.admin-section').forEach(section => section.classList.remove('active'));
        
        // Add active class to clicked item
        this.classList.add('active');
        const sectionId = this.getAttribute('data-section');
        document.getElementById(sectionId).classList.add('active');
    });
});

// Profile image upload
document.getElementById('profileImageInput').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('profileImage').src = e.target.result;
            // Save to localStorage
            localStorage.setItem('adminProfileImage', e.target.result);
            showNotification('Profil fotoğrafı güncellendi!', 'success');
        };
        reader.readAsDataURL(file);
    }
});

// Profile form submission
document.getElementById('profileForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const profileData = {
        fullName: document.getElementById('fullName').value,
        title: document.getElementById('title').value,
        bio: document.getElementById('bio').value,
        email: document.getElementById('email').value,
        location: document.getElementById('location').value,
        github: document.getElementById('github').value,
        twitter: document.getElementById('twitter').value,
        linkedin: document.getElementById('linkedin').value,
        instagram: document.getElementById('instagram').value
    };
    
    // Save to localStorage
    localStorage.setItem('adminProfile', JSON.stringify(profileData));
    showNotification('Profil bilgileri güncellendi!', 'success');
    
    // Update the main site data
    updateMainSiteData();
});

// Settings form submission
document.getElementById('settingsForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const settingsData = {
        siteName: document.getElementById('siteName').value,
        siteDescription: document.getElementById('siteDescription').value,
        primaryColor: document.getElementById('primaryColor').value,
        secondaryColor: document.getElementById('secondaryColor').value
    };
    
    // Save to localStorage
    localStorage.setItem('siteSettings', JSON.stringify(settingsData));
    showNotification('Site ayarları güncellendi!', 'success');
    
    // Apply color changes
    applyColorChanges(settingsData.primaryColor, settingsData.secondaryColor);
});

// Color picker sync
document.querySelectorAll('input[type="color"]').forEach(colorInput => {
    colorInput.addEventListener('input', function() {
        const textInput = this.nextElementSibling;
        textInput.value = this.value;
    });
});

document.querySelectorAll('.color-input').forEach(textInput => {
    textInput.addEventListener('input', function() {
        const colorInput = this.previousElementSibling;
        if (/^#[0-9A-F]{6}$/i.test(this.value)) {
            colorInput.value = this.value;
        }
    });
});

// Load admin data
function loadAdminData() {
    // Load profile image
    const savedImage = localStorage.getItem('adminProfileImage');
    if (savedImage) {
        document.getElementById('profileImage').src = savedImage;
    }
    
    // Load profile data
    const profileData = localStorage.getItem('adminProfile');
    if (profileData) {
        const profile = JSON.parse(profileData);
        document.getElementById('fullName').value = profile.fullName || '';
        document.getElementById('title').value = profile.title || '';
        document.getElementById('bio').value = profile.bio || '';
        document.getElementById('email').value = profile.email || '';
        document.getElementById('location').value = profile.location || '';
        document.getElementById('github').value = profile.github || '';
        document.getElementById('twitter').value = profile.twitter || '';
        document.getElementById('linkedin').value = profile.linkedin || '';
        document.getElementById('instagram').value = profile.instagram || '';
    }
    
    // Load settings
    const settingsData = localStorage.getItem('siteSettings');
    if (settingsData) {
        const settings = JSON.parse(settingsData);
        document.getElementById('siteName').value = settings.siteName || '';
        document.getElementById('siteDescription').value = settings.siteDescription || '';
        document.getElementById('primaryColor').value = settings.primaryColor || '#667eea';
        document.getElementById('secondaryColor').value = settings.secondaryColor || '#764ba2';
        
        // Update color input text fields
        document.querySelectorAll('.color-input')[0].value = settings.primaryColor || '#667eea';
        document.querySelectorAll('.color-input')[1].value = settings.secondaryColor || '#764ba2';
    }
    
    // Set admin username
    const username = sessionStorage.getItem('adminUsername');
    if (username) {
        document.getElementById('adminUsername').textContent = username;
    }
}

// Update main site data
function updateMainSiteData() {
    // This function would update the actual site files in a real application
    // For now, we'll just store the data in localStorage
    console.log('Main site data updated');
}

// Apply color changes
function applyColorChanges(primaryColor, secondaryColor) {
    document.documentElement.style.setProperty('--primary-color', primaryColor);
    document.documentElement.style.setProperty('--secondary-color', secondaryColor);
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `admin-notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    // Trigger animation
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// New post button
document.getElementById('newPostBtn').addEventListener('click', function() {
    showNotification('Blog yazısı editörü yakında eklenecek!', 'info');
});

// Edit and delete buttons for posts
document.addEventListener('click', function(e) {
    if (e.target.closest('.btn-icon')) {
        const icon = e.target.closest('.btn-icon').querySelector('i');
        if (icon.classList.contains('fa-edit')) {
            showNotification('Düzenleme özelliği yakında eklenecek!', 'info');
        } else if (icon.classList.contains('fa-trash')) {
            if (confirm('Bu yazıyı silmek istediğinizden emin misiniz?')) {
                showNotification('Silme özelliği yakında eklenecek!', 'info');
            }
        }
    }
});

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    
    // Add notification styles
    const style = document.createElement('style');
    style.textContent = `
        .admin-notification {
            position: fixed;
            top: 20px;
            right: -300px;
            background: var(--bg-color);
            padding: 1rem 1.5rem;
            border-radius: var(--border-radius);
            box-shadow: var(--shadow-lg);
            display: flex;
            align-items: center;
            gap: 1rem;
            z-index: 1000;
            transition: right 0.3s ease;
            max-width: 300px;
        }
        
        .admin-notification.show {
            right: 20px;
        }
        
        .admin-notification.success {
            border-left: 4px solid #48bb78;
        }
        
        .admin-notification.success i {
            color: #48bb78;
        }
        
        .admin-notification.error {
            border-left: 4px solid #f56565;
        }
        
        .admin-notification.error i {
            color: #f56565;
        }
        
        .admin-notification.info {
            border-left: 4px solid var(--primary-color);
        }
        
        .admin-notification.info i {
            color: var(--primary-color);
        }
        
        @media (max-width: 768px) {
            .admin-notification {
                right: -100%;
                left: 20px;
                max-width: calc(100% - 40px);
            }
            
            .admin-notification.show {
                right: auto;
                left: 20px;
            }
        }
    `;
    document.head.appendChild(style);
});

// Simple chart for statistics (using Canvas API)
function drawChart() {
    const canvas = document.getElementById('visitorChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = 300;
    
    // Sample data
    const data = [120, 150, 180, 200, 170, 220, 250];
    const labels = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];
    
    const maxValue = Math.max(...data);
    const padding = 40;
    const chartWidth = canvas.width - padding * 2;
    const chartHeight = canvas.height - padding * 2;
    const barWidth = chartWidth / data.length * 0.8;
    const barSpacing = chartWidth / data.length * 0.2;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw bars
    data.forEach((value, index) => {
        const barHeight = (value / maxValue) * chartHeight;
        const x = padding + index * (barWidth + barSpacing) + barSpacing / 2;
        const y = canvas.height - padding - barHeight;
        
        // Draw bar
        const gradient = ctx.createLinearGradient(0, y, 0, y + barHeight);
        gradient.addColorStop(0, getComputedStyle(document.documentElement).getPropertyValue('--primary-color'));
        gradient.addColorStop(1, getComputedStyle(document.documentElement).getPropertyValue('--secondary-color'));
        
        ctx.fillStyle = gradient;
        ctx.fillRect(x, y, barWidth, barHeight);
        
        // Draw label
        ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-color');
        ctx.font = '12px Inter';
        ctx.textAlign = 'center';
        ctx.fillText(labels[index], x + barWidth / 2, canvas.height - padding + 20);
        
        // Draw value
        ctx.fillText(value, x + barWidth / 2, y - 10);
    });
}

// Draw chart when stats section is visible
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && entry.target.id === 'stats') {
            // Only load statistics if user is logged in
            if (sessionStorage.getItem('adminLoggedIn') === 'true') {
                loadStatistics();
            }
        }
    });
});

const statsSection = document.getElementById('stats');
if (statsSection) {
    observer.observe(statsSection);
}

// Load statistics from API
async function loadStatistics() {
    try {
        const response = await fetch('/api/admin/stats', {
            credentials: 'same-origin'
        });
        if (!response.ok) {
            throw new Error('İstatistikler yüklenemedi');
        }
        
        const stats = await response.json();
        
        // Update stat cards
        document.querySelector('.stat-card:nth-child(1) h3').textContent = stats.totalViews.toLocaleString('tr-TR');
        document.querySelector('.stat-card:nth-child(2) h3').textContent = stats.totalPosts;
        document.querySelector('.stat-card:nth-child(3) h3').textContent = stats.totalComments;
        document.querySelector('.stat-card:nth-child(4) h3').textContent = stats.uniqueVisitors.toLocaleString('tr-TR');
        
        // Draw chart with real data
        drawChartWithData(stats.weeklyData);
        
        // Add popular posts section if not exists
        addPopularPostsSection(stats.popularPosts);
        
    } catch (error) {
        console.error('İstatistikler yüklenirken hata:', error);
        showNotification('İstatistikler yüklenemedi', 'error');
    }
}

// Draw chart with real data
function drawChartWithData(weeklyData) {
    const canvas = document.getElementById('visitorChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = 300;
    
    const data = weeklyData.map(d => d.views);
    const labels = weeklyData.map(d => d.day);
    
    const maxValue = Math.max(...data);
    const padding = 40;
    const chartWidth = canvas.width - padding * 2;
    const chartHeight = canvas.height - padding * 2;
    const barWidth = chartWidth / data.length * 0.8;
    const barSpacing = chartWidth / data.length * 0.2;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw grid lines
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
        const y = padding + (chartHeight / 5) * i;
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(canvas.width - padding, y);
        ctx.stroke();
    }
    
    // Draw bars
    data.forEach((value, index) => {
        const barHeight = (value / maxValue) * chartHeight;
        const x = padding + index * (barWidth + barSpacing) + barSpacing / 2;
        const y = canvas.height - padding - barHeight;
        
        // Draw bar
        const gradient = ctx.createLinearGradient(0, y, 0, y + barHeight);
        gradient.addColorStop(0, getComputedStyle(document.documentElement).getPropertyValue('--primary-color'));
        gradient.addColorStop(1, getComputedStyle(document.documentElement).getPropertyValue('--secondary-color'));
        
        ctx.fillStyle = gradient;
        ctx.fillRect(x, y, barWidth, barHeight);
        
        // Draw label
        ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-color');
        ctx.font = '12px Inter';
        ctx.textAlign = 'center';
        ctx.fillText(labels[index], x + barWidth / 2, canvas.height - padding + 20);
        
        // Draw value
        ctx.fillText(value, x + barWidth / 2, y - 10);
    });
}

// Add popular posts section
function addPopularPostsSection(popularPosts) {
    const existingSection = document.getElementById('popularPosts');
    if (existingSection) {
        existingSection.remove();
    }
    
    const chartContainer = document.querySelector('.chart-container');
    const popularSection = document.createElement('div');
    popularSection.id = 'popularPosts';
    popularSection.className = 'popular-posts-section';
    popularSection.innerHTML = `
        <h3>En Popüler Yazılar</h3>
        <div class="popular-posts-list">
            ${popularPosts.map((post, index) => `
                <div class="popular-post-item">
                    <span class="post-rank">${index + 1}</span>
                    <div class="post-info">
                        <h4>${post.title}</h4>
                        <span class="post-views"><i class="fas fa-eye"></i> ${post.views} görüntülenme</span>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
    
    chartContainer.parentElement.appendChild(popularSection);
}

// Redraw chart on window resize
window.addEventListener('resize', () => {
    if (document.getElementById('stats').classList.contains('active')) {
        drawChart();
    }
});
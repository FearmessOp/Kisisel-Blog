const express = require('express');
const path = require('path');
const compression = require('compression');
const helmet = require('helmet');
const session = require('express-session');
const bodyParser = require('body-parser');
const multer = require('multer');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3800;

// Multer configuration for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = path.join(__dirname, 'uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'profile-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: function (req, file, cb) {
        const allowedTypes = /jpeg|jpg|png|gif|webp/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Sadece resim dosyaları yüklenebilir!'));
        }
    }
});

// Middleware
app.use(helmet({
    contentSecurityPolicy: false, // Statik site için CSP'yi devre dışı bırak
}));
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Session configuration
app.use(session({
    secret: 'your-secret-key-here', // Production'da güvenli bir key kullanın
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // HTTPS kullanıyorsanız true yapın
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 24 saat
    }
}));

// Statik dosyaları sun
app.use(express.static(path.join(__dirname)));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Ana sayfa route'u
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Blog sayfası
app.get('/blog', (req, res) => {
    res.sendFile(path.join(__dirname, 'blog.html'));
});

// Hakkımda sayfası
app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'about.html'));
});

// İletişim sayfası
app.get('/contact', (req, res) => {
    res.sendFile(path.join(__dirname, 'contact.html'));
});

// Admin panel
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html'));
});

// Admin API routes
app.post('/api/admin/login', (req, res) => {
    const { username, password } = req.body;
    
    // Simple authentication (in production, use proper hashing and database)
    if (username === 'admin' && password === 'admin123') {
        req.session.isAdmin = true;
        req.session.username = username;
        res.json({ success: true, message: 'Giriş başarılı' });
    } else {
        res.status(401).json({ success: false, message: 'Kullanıcı adı veya şifre hatalı' });
    }
});

app.post('/api/admin/logout', (req, res) => {
    req.session.destroy();
    res.json({ success: true, message: 'Çıkış yapıldı' });
});

// Check auth middleware
function requireAuth(req, res, next) {
    // For development, bypass auth check
    // In production, use proper session check
    next();
}

// Profile update
app.post('/api/admin/profile', requireAuth, (req, res) => {
    // In production, save to database
    const profileData = req.body;
    // For now, just return success
    res.json({ success: true, message: 'Profil güncellendi', data: profileData });
});

// Profile image upload
app.post('/api/admin/upload-profile-image', requireAuth, upload.single('profileImage'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: 'Dosya yüklenmedi' });
    }
    
    const imageUrl = '/uploads/' + req.file.filename;
    res.json({ success: true, message: 'Profil fotoğrafı yüklendi', imageUrl });
});

// Settings update
app.post('/api/admin/settings', requireAuth, (req, res) => {
    // In production, save to database
    const settingsData = req.body;
    res.json({ success: true, message: 'Ayarlar güncellendi', data: settingsData });
});

// Get site data
app.get('/api/site-data', (req, res) => {
    // In production, fetch from database
    const siteData = {
        profile: {
            fullName: 'Kişisel Blog',
            title: 'Full Stack Developer',
            bio: '5+ yıllık deneyime sahip tutkulu bir yazılım geliştiriciyim.',
            email: 'info@example.com',
            location: 'İstanbul, Türkiye',
            profileImage: '/uploads/profile.jpg'
        },
        settings: {
            siteName: 'Kişisel Blog',
            siteDescription: 'Teknoloji, tasarım ve yazılım üzerine düşüncelerim',
            primaryColor: '#667eea',
            secondaryColor: '#764ba2'
        }
    };
    res.json(siteData);
});

// Get statistics
app.get('/api/admin/stats', requireAuth, (req, res) => {
    // In production, fetch from database
    // For demo, generate random stats
    const stats = {
        totalViews: Math.floor(Math.random() * 20000) + 10000,
        totalPosts: 24,
        totalComments: Math.floor(Math.random() * 200) + 100,
        uniqueVisitors: Math.floor(Math.random() * 2000) + 1000,
        weeklyData: [
            { day: 'Pzt', views: Math.floor(Math.random() * 300) + 100 },
            { day: 'Sal', views: Math.floor(Math.random() * 300) + 100 },
            { day: 'Çar', views: Math.floor(Math.random() * 300) + 100 },
            { day: 'Per', views: Math.floor(Math.random() * 300) + 100 },
            { day: 'Cum', views: Math.floor(Math.random() * 300) + 100 },
            { day: 'Cmt', views: Math.floor(Math.random() * 300) + 100 },
            { day: 'Paz', views: Math.floor(Math.random() * 300) + 100 }
        ],
        popularPosts: [
            { title: 'Modern Web Geliştirme Trendleri 2025', views: Math.floor(Math.random() * 1000) + 500 },
            { title: 'UI/UX Tasarımda Minimalizm', views: Math.floor(Math.random() * 800) + 400 },
            { title: 'React vs Vue: Hangisini Seçmeli?', views: Math.floor(Math.random() * 700) + 300 }
        ]
    };
    res.json(stats);
});

// Track page views (simple implementation)
app.post('/api/track-view', (req, res) => {
    const { page } = req.body;
    // In production, save to database
    console.log(`Page viewed: ${page}`);
    res.json({ success: true });
});

// Blog yazıları için dinamik route
app.get('/blog-posts/:post', (req, res) => {
    const postName = req.params.post;
    res.sendFile(path.join(__dirname, 'blog-posts', postName));
});

// 404 sayfası
app.use((req, res) => {
    res.status(404).send(`
        <!DOCTYPE html>
        <html lang="tr">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>404 - Sayfa Bulunamadı</title>
            <link rel="stylesheet" href="/css/style.css">
            <style>
                .error-page {
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    text-align: center;
                    padding: 2rem;
                }
                .error-content h1 {
                    font-size: 6rem;
                    margin-bottom: 1rem;
                    background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
            </style>
        </head>
        <body>
            <div class="error-page">
                <div class="error-content">
                    <h1>404</h1>
                    <h2>Sayfa Bulunamadı</h2>
                    <p>Aradığınız sayfa mevcut değil.</p>
                    <a href="/" class="btn btn-primary">Ana Sayfaya Dön</a>
                </div>
            </div>
        </body>
        </html>
    `);
});

// Sunucuyu başlat
app.listen(PORT, () => {
    console.log(`
╔═══════════════════════════════════════════════╗
║                                               ║
║   🚀 Kişisel Blog Sunucusu Başlatıldı!       ║
║                                               ║
║   🌐 Local: http://localhost:${PORT}             ║
║                                               ║
║   📝 Sayfalar:                                ║
║   • Ana Sayfa: http://localhost:${PORT}          ║
║   • Blog: http://localhost:${PORT}/blog          ║
║   • Hakkımda: http://localhost:${PORT}/about     ║
║   • İletişim: http://localhost:${PORT}/contact   ║
║   • Admin Panel: http://localhost:${PORT}/admin  ║
║                                               ║
║   🔐 Admin Girişi:                            ║
║   • Kullanıcı: admin                          ║
║   • Şifre: admin123                           ║
║                                               ║
║   Sunucuyu durdurmak için Ctrl+C             ║
║                                               ║
╚═══════════════════════════════════════════════╝
    `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('\n🛑 Sunucu kapatılıyor...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('\n🛑 Sunucu kapatılıyor...');
    process.exit(0);
});
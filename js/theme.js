// Theme Toggle Functionality

(function() {
    'use strict';

    // DOM Elements
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;
    const icon = themeToggle.querySelector('i');

    // Tema tercihini localStorage'dan al
    const currentTheme = localStorage.getItem('theme') || 'light';
    
    // Sayfa yüklendiğinde temayı uygula
    setTheme(currentTheme);

    // Tema değiştirme butonu tıklama olayı
    themeToggle.addEventListener('click', () => {
        const theme = body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        setTheme(theme);
        
        // Animasyon ekle
        themeToggle.style.transform = 'rotate(360deg)';
        setTimeout(() => {
            themeToggle.style.transform = 'rotate(0deg)';
        }, 300);
    });

    // Tema ayarlama fonksiyonu
    function setTheme(theme) {
        body.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        
        // İkonu güncelle
        if (theme === 'dark') {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }

        // Meta theme-color'ı güncelle
        const metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (!metaThemeColor) {
            const meta = document.createElement('meta');
            meta.name = 'theme-color';
            meta.content = theme === 'dark' ? '#1a202c' : '#ffffff';
            document.head.appendChild(meta);
        } else {
            metaThemeColor.content = theme === 'dark' ? '#1a202c' : '#ffffff';
        }

        // Tema değişim event'i tetikle
        window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme } }));
    }

    // Sistem tema tercihini izle
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    // İlk yüklemede sistem tercihini kontrol et
    if (!localStorage.getItem('theme')) {
        setTheme(prefersDarkScheme.matches ? 'dark' : 'light');
    }

    // Sistem tema değişikliklerini dinle
    prefersDarkScheme.addEventListener('change', (e) => {
        // Sadece kullanıcı manuel olarak tema seçmemişse sistemi takip et
        if (!localStorage.getItem('theme')) {
            setTheme(e.matches ? 'dark' : 'light');
        }
    });

    // Klavye kısayolu (Ctrl/Cmd + Shift + L)
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'L') {
            e.preventDefault();
            themeToggle.click();
        }
    });

    // Tema geçişlerini yumuşat
    const style = document.createElement('style');
    style.textContent = `
        * {
            transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
        }
    `;
    document.head.appendChild(style);

    // API for other scripts
    window.themeManager = {
        getTheme: () => body.getAttribute('data-theme'),
        setTheme: setTheme,
        toggle: () => themeToggle.click()
    };

})();
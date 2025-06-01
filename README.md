# Kişisel Blog - Açık Kaynak Portfolio Sitesi

Modern, responsive ve şık tasarıma sahip açık kaynak kişisel blog/portfolio sitesi. 

## 🚀 Özellikler

- ✨ Modern ve minimalist tasarım
- 🌙 Karanlık/Aydınlık tema desteği
- 📱 Tam responsive tasarım
- ⚡ Hızlı ve performanslı
- 🎨 Özelleştirilebilir renkler ve stiller
- 📝 Blog yazıları için hazır şablon
- 📊 Yetenekler ve deneyim bölümleri
- 📬 İletişim formu
- 🔍 Blog yazılarında arama özelliği
- 🏷️ Kategori filtreleme
- 💫 Smooth animasyonlar
- 📈 SEO dostu yapı

## 📋 Gereksinimler

- Modern web tarayıcı (Chrome, Firefox, Safari, Edge)
- Basit bir web sunucusu (opsiyonel)

## 🛠️ Kurulum

### Yöntem 1: Node.js ile Çalıştırma (Önerilen)

1. Bu repository'yi klonlayın:
```bash
git clone https://github.com/FearmessOp/Kisisel-Blog.git
cd Kisisel-Blog
```

2. Bağımlılıkları yükleyin:
```bash
npm install
```

3. Sunucuyu başlatın:
```bash
# Normal başlatma
npm start

# Geliştirme modu (otomatik yenileme)
npm run dev
```

4. Tarayıcınızda açın:
```
http://localhost:3800
```

### Yöntem 2: Statik Dosya Olarak Açma

Dosyaları doğrudan tarayıcıda açabilirsiniz:
```bash
# Windows
start index.html

# macOS
open index.html

# Linux
xdg-open index.html
```

### Yöntem 3: Diğer HTTP Sunucular

```bash
# Python 3
python -m http.server 8000

# PHP
php -S localhost:8000
```

## 🎨 Özelleştirme

### Renk Teması

`css/style.css` dosyasındaki CSS değişkenlerini düzenleyerek renk temasını değiştirebilirsiniz:

```css
:root {
    --primary-color: #667eea;  /* Ana renk */
    --secondary-color: #764ba2; /* İkincil renk */
    --accent-color: #f093fb;    /* Vurgu rengi */
    /* ... diğer renkler */
}
```

### İçerik Düzenleme

1. **Profil Bilgileri**: `index.html`, `about.html` dosyalarındaki metinleri düzenleyin
2. **Sosyal Medya Linkleri**: HTML dosyalarındaki sosyal medya linklerini kendi profillerinizle değiştirin
3. **Blog Yazıları**: `blog-posts/` klasöründe yeni HTML dosyaları oluşturarak blog yazıları ekleyin

### Yeni Blog Yazısı Ekleme

1. `blog-posts/` klasöründe yeni bir HTML dosyası oluşturun
2. Mevcut blog yazısı şablonunu kopyalayın
3. `blog.html` dosyasına yeni yazı kartını ekleyin


## 🔧 Teknik Detaylar

### Kullanılan Teknolojiler

- **HTML5**: Semantik markup
- **CSS3**: Modern styling, CSS Grid, Flexbox
- **JavaScript**: Vanilla JS (framework bağımlılığı yok)
- **Font Awesome**: İkonlar
- **Google Fonts**: Typography

### Tarayıcı Desteği

- Chrome (son 2 versiyon)
- Firefox (son 2 versiyon)
- Safari (son 2 versiyon)
- Edge (son 2 versiyon)

## 📝 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasına bakın.

## 🤝 Katkıda Bulunma

1. Bu repository'yi fork edin
2. Feature branch'i oluşturun (`git checkout -b feature/YeniOzellik`)
3. Değişikliklerinizi commit edin (`git commit -m 'Yeni özellik eklendi'`)
4. Branch'inizi push edin (`git push origin feature/YeniOzellik`)
5. Pull Request oluşturun

## 📞 İletişim

Sorularınız veya önerileriniz için:
- E-posta: info@example.com
- GitHub: [@FearmessOp](https://github.com/FearmessOp)

## 🙏 Teşekkürler

- Font Awesome için [FontAwesome](https://fontawesome.com/)
- Fontlar için [Google Fonts](https://fonts.google.com/)
- Gradient fikirleri için [uiGradients](https://uigradients.com/)

## 🤩 Yapımcı
Fearmess
---

⭐ Bu projeyi beğendiyseniz yıldız vermeyi unutmayın!
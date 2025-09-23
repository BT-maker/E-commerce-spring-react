# 👨‍💼 Admin Panel - E-Ticaret Platformu
### Kapsamlı Yönetim ve Kontrol Paneli

[![Admin Panel](https://img.shields.io/badge/Admin%20Panel-Active-green.svg)](http://localhost:5173/admin)
[![Security](https://img.shields.io/badge/Security-JWT%20%2B%20Role%20Based-blue.svg)](#)
[![React](https://img.shields.io/badge/React-19-blue.svg)](https://reactjs.org/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5.3-brightgreen.svg)](https://spring.io/projects/spring-boot)

Bu dokümantasyon, E-Ticaret platformu için geliştirilen kapsamlı admin panelinin özelliklerini ve kullanımını açıklar.

---

## 🚀 Temel Özellikler

### 🔐 Güvenlik ve Erişim
- **Ayrı Admin Login**: `/admin/login` özel giriş sayfası
- **Rol Tabanlı Erişim**: Sadece `ADMIN` rolüne sahip kullanıcılar
- **SHA-256 Şifreleme**: Güvenli şifre doğrulama sistemi
- **JWT Token**: Güvenli oturum yönetimi

### 📊 Dashboard ve İstatistikler
- **Gerçek Zamanlı Veriler**: Canlı istatistik gösterimi
- **Kapsamlı Metrikler**:
  - 👥 Toplam kullanıcı sayısı
  - 🏪 Toplam satıcı sayısı
  - 📦 Toplam ürün sayısı
  - 🛒 Toplam sipariş sayısı
  - 💰 Toplam gelir
  - 📈 Aylık büyüme oranı
- **Son Aktiviteler**: En güncel 10 sipariş listesi
- **Trend Analizi**: Haftalık/aylık performans özeti

### 👥 Kullanıcı Yönetimi
- **Kullanıcı Listesi**: Tüm kullanıcıları görüntüleme ve yönetme
- **Gelişmiş Arama**: 
  - 🔍 Ad, soyad, email ile arama
  - 🎯 Durum filtresi (Aktif/Pasif)
  - 🏷️ Rol filtresi (Müşteri/Satıcı/Yönetici)
- **Kullanıcı İşlemleri**:
  - 👁️ Detaylı kullanıcı profili görüntüleme
  - ✅ Kullanıcı aktifleştirme/pasifleştirme
  - 💬 Mesaj gönderme sistemi
- **Elasticsearch Entegrasyonu**: Hızlı ve akıllı arama

### 🏪 Satıcı Yönetimi
- **Satıcı Listesi**: Tüm satıcıları görüntüleme ve kontrol
- **Performans Metrikleri**:
  - 📦 Ürün sayısı
  - 💰 Toplam satış miktarı
  - 📅 Kayıt tarihi
  - ⭐ Değerlendirme puanı
- **Satıcı İşlemleri**:
  - ✅ Satıcı başvuru onaylama/reddetme
  - 🔄 Satıcı durumu güncelleme
  - 📋 Detaylı satıcı analizi

---

## 🎨 Tasarım ve Kullanıcı Deneyimi

### 📱 Responsive Tasarım
- **Mobil Uyumlu**: Tüm cihazlarda mükemmel görünüm
- **Sidebar Navigation**: Kolay erişim menü sistemi
- **Modern Arayüz**: Tailwind CSS ile şık tasarım
- **Hızlı Yükleme**: Optimize edilmiş performans

### 🔔 Bildirim Sistemi
- **Gerçek Zamanlı Uyarılar**: Anlık sistem bildirimleri
- **Toast Mesajları**: Kullanıcı dostu geri bildirimler
- **Durum Göstergeleri**: Görsel işlem onayları

---

## 🛠️ Teknik Altyapı

### Frontend Teknolojileri
```javascript
{
  "framework": "React 18",
  "routing": "React Router",
  "styling": "Tailwind CSS",
  "icons": "Lucide React",
  "notifications": "React Hot Toast",
  "state": "React Context API"
}
```

### Backend Teknolojileri
```java
{
  "framework": "Spring Boot 3.5.3",
  "security": "Spring Security + JWT",
  "database": "PostgreSQL + JPA/Hibernate",
  "search": "Elasticsearch",
  "api": "RESTful API Design"
}
```

### Güvenlik Katmanları
- 🔐 **JWT Token**: Güvenli kimlik doğrulama
- 🛡️ **Role-Based Access**: Rol tabanlı yetkilendirme
- 🌐 **CORS Configuration**: Cross-origin güvenlik
- 🔒 **Password Hashing**: SHA-256 + BCrypt

---

## 📁 Proje Yapısı

```
frontend/src/
├── 📁 components/
│   ├── 📁 AdminLogin/
│   │   ├── 📄 AdminLogin.jsx        # Admin giriş bileşeni
│   │   └── 📄 AdminLogin.css        # Özel stiller
│   ├── 📁 AdminLayout/
│   │   ├── 📄 AdminLayout.jsx       # Ana layout bileşeni
│   │   └── 📄 AdminLayout.css       # Layout stilleri
│   └── 📁 AdminRoute/
│       └── 📄 AdminRoute.jsx        # Korumalı rota bileşeni
│
├── 📁 pages/
│   ├── 📁 AdminDashboard/
│   │   ├── 📄 AdminDashboard.jsx    # Dashboard ana sayfası
│   │   └── 📄 AdminDashboard.css    # Dashboard stilleri
│   ├── 📁 AdminUsers/
│   │   ├── 📄 AdminUsers.jsx        # Kullanıcı yönetimi
│   │   └── 📄 AdminUsers.css        # Kullanıcı stilleri
│   └── 📁 AdminSellers/
│       ├── 📄 AdminSellers.jsx      # Satıcı yönetimi
│       └── 📄 AdminSellers.css      # Satıcı stilleri
│
backend/src/main/java/com/bahattintok/e_commerce/
├── 📁 controller/
│   └── 📄 AdminController.java      # Admin API endpoints
├── 📁 service/
│   └── 📄 AdminService.java         # Admin business logic
└── 📁 repository/
    └── 📄 UserRepository.java       # Veri erişim katmanı
```

---

## 🚀 Kurulum ve Çalıştırma

### 1️⃣ Backend Kurulumu
```bash
cd backend
mvn clean install
mvn spring-boot:run
```

### 2️⃣ Frontend Kurulumu
```bash
cd frontend
npm install
npm run dev
```

### 3️⃣ Admin Paneli Erişimi
🌐 **Admin Login**: `http://localhost:5173/admin/login`  
🏠 **Dashboard**: `http://localhost:5173/admin/dashboard`

---

## 📡 API Endpoints

### 📊 Dashboard API
```http
GET /api/admin/dashboard/stats          # Dashboard istatistikleri
GET /api/admin/dashboard/recent-orders  # Son siparişler
GET /api/admin/dashboard/analytics      # Analitik veriler
```

### 👥 Kullanıcı Yönetimi API
```http
GET    /api/admin/users                 # Tüm kullanıcıları getir
PUT    /api/admin/users/{id}/activate   # Kullanıcı aktifleştir
PUT    /api/admin/users/{id}/deactivate # Kullanıcı pasifleştir
DELETE /api/admin/users/{id}            # Kullanıcı sil
```

### 🏪 Satıcı Yönetimi API
```http
GET /api/admin/sellers                  # Tüm satıcıları getir
PUT /api/admin/sellers/{id}/approve     # Satıcı onayla
PUT /api/admin/sellers/{id}/reject      # Satıcı reddet
GET /api/admin/sellers/{id}/analytics   # Satıcı analitikleri
```

### 🔍 Arama API
```http
GET /api/admin/search?q={query}         # Elasticsearch ile arama
GET /api/admin/search/suggestions       # Arama önerileri
```

---

## 📱 Responsive Breakpoints

| Cihaz | Boyut | Özellikler |
|-------|-------|------------|
| 📱 **Mobil** | < 768px | Tek sütun, tam genişlik, dokunmatik UI |
| 📟 **Tablet** | 768px - 1024px | İki sütun, optimize spacing, hover efektleri |
| 🖥️ **Desktop** | > 1024px | Çoklu sütun, tam animasyon, gelişmiş etkileşim |

---

## 🔒 Güvenlik Önlemleri

### 🛡️ Erişim Kontrolü
1. **Admin Rolü Kontrolü**: Sadece ADMIN rolüne sahip kullanıcılar
2. **JWT Token Doğrulama**: Her istek için token kontrolü
3. **Session Yönetimi**: Güvenli oturum süreleri
4. **IP Whitelist**: Belirli IP adreslerinden erişim (opsiyonel)

### 🔐 Veri Güvenliği
1. **Input Validation**: Tüm kullanıcı girdilerinin doğrulanması
2. **SQL Injection Koruması**: Parametreli sorgular
3. **XSS Koruması**: Güvenli HTML rendering
4. **CSRF Koruması**: Cross-site request forgery önlemi

---

## 📈 Gelecek Geliştirmeler

### 🎯 Planlanan Özellikler
- [ ] 📦 **Ürün Yönetimi**: Ürün onaylama/reddetme sistemi
- [ ] 🛒 **Sipariş Yönetimi**: Sipariş durumu güncelleme
- [ ] 💰 **Finansal Raporlar**: Detaylı gelir analizi ve grafikleri
- [ ] 📊 **Kullanıcı Analitikleri**: Davranış analizi ve heatmap
- [ ] 🔔 **Bildirim Merkezi**: Kapsamlı bildirim sistemi
- [ ] 📝 **Aktivite Logları**: Admin işlem geçmişi
- [ ] 💾 **Backup/Restore**: Otomatik veri yedekleme

### ⚡ Teknik İyileştirmeler
- [ ] 🚀 **Redis Cache**: Performans optimizasyonu
- [ ] 🔄 **WebSocket**: Gerçek zamanlı güncellemeler
- [ ] 📁 **File Upload**: Toplu dosya yükleme sistemi
- [ ] 📤 **Export/Import**: Excel/CSV veri aktarımı
- [ ] 🌍 **Multi-language**: Çoklu dil desteği
- [ ] 📱 **PWA**: Progressive Web App özellikleri

---

## 🎨 UI/UX Özellikleri

### 🎭 Animasyonlar ve Efektler
```css
/* Hover Efektleri */
.admin-button:hover {
  transform: scale(1.05);
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
}

/* Geçiş Animasyonları */
.admin-transition {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Loading States */
.admin-loading {
  animation: pulse 2s infinite;
}
```

### 🎨 Renk Paleti
| Renk | Hex | Kullanım |
|------|-----|----------|
| 🔵 **Primary** | `#3B82F6` | Ana butonlar, linkler |
| 🟢 **Success** | `#10B981` | Başarılı işlemler |
| 🔴 **Error** | `#EF4444` | Hata mesajları |
| 🟡 **Warning** | `#F59E0B` | Uyarı mesajları |
| ⚪ **Neutral** | `#6B7280` | Metin ve arka plan |

---

## 📞 Destek ve İletişim

### 🆘 Teknik Destek
- **Email**: bahattok5@gmail.com
- **GitHub Issues**: [Proje Repository](https://github.com/bahattintok/e-commerce-spring-react)
- **Dokümantasyon**: Bu README dosyası

### 🐛 Hata Bildirimi
Hata bildirimi yaparken lütfen şunları ekleyin:
1. 🖥️ İşletim sistemi ve tarayıcı bilgisi
2. 📝 Hatanın oluştuğu adımlar
3. 📸 Ekran görüntüsü (varsa)
4. 🔍 Console hata mesajları

---

## 📄 Lisans

Bu admin panel MIT lisansı altında lisanslanmıştır. Detaylar için ana [LICENSE](LICENSE) dosyasına bakın.

---

<div align="center">

### 🎉 Admin Panel Başarıyla Kuruldu!

**Modern, güvenli ve kullanıcı dostu admin deneyimi için hazır! 👑**

[![Admin Panel Demo](https://img.shields.io/badge/Demo-Live-brightgreen.svg)](http://localhost:5173/admin)

</div>


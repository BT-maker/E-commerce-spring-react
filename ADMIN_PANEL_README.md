# Admin Panel - E-Ticaret Platformu

Bu dokümantasyon, E-Ticaret platformu için geliştirilen kapsamlı admin panelinin özelliklerini ve kullanımını açıklar.

## 🚀 Özellikler

### 1. Admin Login Sistemi
- **Ayrı Admin Login Sayfası**: `/admin/login`
- **Güvenlik**: Sadece ADMIN rolüne sahip kullanıcılar erişebilir
- **Şifre Hashleme**: SHA-256 ile güvenli şifre doğrulama
- **Responsive Tasarım**: Mobil uyumlu modern arayüz

### 2. Admin Dashboard
- **Genel İstatistikler**:
  - Toplam kullanıcı sayısı
  - Toplam satıcı sayısı
  - Toplam ürün sayısı
  - Toplam sipariş sayısı
  - Toplam gelir
  - Aylık büyüme oranı
- **Son Siparişler**: En son 10 siparişin listesi
- **Hızlı İstatistikler**: Haftalık/aylık özet bilgiler
- **Gerçek Zamanlı Veriler**: API'den dinamik veri çekme

### 3. Kullanıcı Yönetimi
- **Kullanıcı Listesi**: Tüm kullanıcıları görüntüleme
- **Arama ve Filtreleme**: 
  - Ad, soyad, email ile arama
  - Durum filtresi (Aktif/Pasif)
  - Rol filtresi (Müşteri/Satıcı/Yönetici)
- **Kullanıcı İşlemleri**:
  - Kullanıcı detaylarını görüntüleme
  - Kullanıcı aktifleştirme/pasifleştirme
  - Mesaj gönderme
- **Elasticsearch Entegrasyonu**: Gelişmiş arama özellikleri

### 4. Satıcı Yönetimi
- **Satıcı Listesi**: Tüm satıcıları görüntüleme
- **Satıcı İstatistikleri**:
  - Ürün sayısı
  - Toplam satış
  - Kayıt tarihi
- **Satıcı İşlemleri**:
  - Satıcı onaylama/reddetme
  - Satıcı aktifleştirme/pasifleştirme
  - Detaylı satıcı bilgileri

### 5. Admin Layout
- **Sidebar Navigation**: Kolay erişim menüsü
- **Responsive Tasarım**: Mobil ve desktop uyumlu
- **Arama Özelliği**: Global arama fonksiyonu
- **Bildirim Sistemi**: Admin bildirimleri
- **Çıkış Yapma**: Güvenli oturum kapatma

## 🛠️ Teknik Detaylar

### Frontend (React)
- **React 18**: Modern React özellikleri
- **React Router**: Sayfa yönlendirme
- **Lucide React**: İkon kütüphanesi
- **Tailwind CSS**: Stil framework'ü
- **React Hot Toast**: Bildirim sistemi

### Backend (Spring Boot)
- **Spring Security**: Güvenlik ve yetkilendirme
- **JPA/Hibernate**: Veritabanı işlemleri
- **Elasticsearch**: Gelişmiş arama
- **RESTful API**: Modern API tasarımı

### Güvenlik
- **JWT Token**: Güvenli kimlik doğrulama
- **Role-Based Access Control**: Rol tabanlı erişim
- **CORS Configuration**: Cross-origin güvenlik
- **Password Hashing**: Şifre güvenliği

## 📁 Dosya Yapısı

```
frontend/src/
├── components/
│   ├── AdminLogin/
│   │   ├── AdminLogin.jsx
│   │   └── AdminLogin.css
│   ├── AdminLayout/
│   │   ├── AdminLayout.jsx
│   │   └── AdminLayout.css
│   └── AdminRoute/
│       └── AdminRoute.jsx
├── pages/
│   ├── AdminDashboard/
│   │   ├── AdminDashboard.jsx
│   │   └── AdminDashboard.css
│   ├── AdminUsers/
│   │   ├── AdminUsers.jsx
│   │   └── AdminUsers.css
│   └── AdminSellers/
│       ├── AdminSellers.jsx
│       └── AdminSellers.css

backend/src/main/java/com/bahattintok/e_commerce/
├── controller/
│   └── AdminController.java
├── service/
│   └── AdminService.java
└── repository/
    └── UserRepository.java (güncellenmiş)
```

## 🚀 Kurulum ve Çalıştırma

### 1. Backend Kurulumu
```bash
cd backend
mvn clean install
mvn spring-boot:run
```

### 2. Frontend Kurulumu
```bash
cd frontend
npm install
npm run dev
```

### 3. Admin Paneli Erişimi
- URL: `http://localhost:5173/admin/login`
- Admin kullanıcısı ile giriş yapın
- Dashboard: `http://localhost:5173/admin/dashboard`

## 📊 API Endpoints

### Admin Dashboard
- `GET /api/admin/dashboard/stats` - Dashboard istatistikleri
- `GET /api/admin/dashboard/recent-orders` - Son siparişler

### Kullanıcı Yönetimi
- `GET /api/admin/users` - Tüm kullanıcıları getir
- `PUT /api/admin/users/{id}/activate` - Kullanıcı aktifleştir
- `PUT /api/admin/users/{id}/deactivate` - Kullanıcı pasifleştir

### Satıcı Yönetimi
- `GET /api/admin/sellers` - Tüm satıcıları getir
- `PUT /api/admin/sellers/{id}/approve` - Satıcı onayla
- `PUT /api/admin/sellers/{id}/reject` - Satıcı reddet

### Arama
- `GET /api/admin/search?q={query}` - Elasticsearch ile arama

## 🎨 Tasarım Özellikleri

### Renk Paleti
- **Primary**: #FF6000 (Mavi)
- **Secondary**: #764ba2 (Mor)
- **Success**: #38a169 (Yeşil)
- **Danger**: #e53e3e (Kırmızı)
- **Warning**: #d69e2e (Sarı)

### Responsive Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🔒 Güvenlik Önlemleri

1. **Admin Rolü Kontrolü**: Sadece ADMIN rolüne sahip kullanıcılar erişebilir
2. **JWT Token Doğrulama**: Her istek için token kontrolü
3. **CORS Yapılandırması**: Güvenli cross-origin istekleri
4. **Input Validation**: Kullanıcı girdisi doğrulama
5. **Error Handling**: Güvenli hata yönetimi

## 📈 Gelecek Geliştirmeler

### Planlanan Özellikler
- [ ] **Ürün Yönetimi**: Ürün onaylama/reddetme
- [ ] **Sipariş Yönetimi**: Sipariş durumu güncelleme
- [ ] **Finansal Raporlar**: Detaylı gelir analizi
- [ ] **Kullanıcı Analitikleri**: Kullanıcı davranış analizi
- [ ] **Bildirim Sistemi**: Admin bildirimleri
- [ ] **Log Sistemi**: Admin aktivite logları
- [ ] **Backup/Restore**: Veri yedekleme sistemi

### Teknik İyileştirmeler
- [ ] **Redis Cache**: Performans optimizasyonu
- [ ] **WebSocket**: Gerçek zamanlı güncellemeler
- [ ] **File Upload**: Resim yükleme sistemi
- [ ] **Export/Import**: Veri dışa/içe aktarma
- [ ] **Multi-language**: Çoklu dil desteği

## 🐛 Bilinen Sorunlar

1. **Backend Bağlantı**: Elasticsearch bağlantısı gerekli
2. **Veritabanı**: User modelinde status alanı eksik
3. **Repository Methods**: Bazı özel sorgular eksik

## 📞 Destek

Herhangi bir sorun veya öneri için:
- **Email**: admin@example.com
- **GitHub Issues**: Proje repository'sinde issue açın

---

**Not**: Bu admin paneli sürekli geliştirilmektedir. Yeni özellikler ve iyileştirmeler düzenli olarak eklenmektedir.

# 🛒 E-Commerce Platform
### Modern Spring Boot + React E-Ticaret Uygulaması

[![Java](https://img.shields.io/badge/Java-21-orange.svg)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5.3-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-19-blue.svg)](https://reactjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Latest-blue.svg)](https://www.postgresql.org/)
[![Elasticsearch](https://img.shields.io/badge/Elasticsearch-Latest-yellow.svg)](https://www.elastic.co/)

Modern teknolojiler kullanılarak geliştirilmiş, tam özellikli e-ticaret platformu. Güvenli kimlik doğrulama, gelişmiş arama, sepet yönetimi ve kapsamlı admin paneli ile donatılmıştır.

---

## ✨ Özellikler

### 🔐 Güvenlik & Kimlik Doğrulama
- **JWT Tabanlı Oturum**: Güvenli `HttpOnly` cookie kullanımı
- **Rol Tabanlı Erişim**: `ADMIN`, `SELLER`, `USER` rolleri
- **SHA-256 + BCrypt**: Çift katmanlı şifre güvenliği
- **CORS Koruması**: Güvenli cross-origin istekleri

### 🛍️ E-Ticaret Özellikleri
- **Ürün Yönetimi**: Kategori bazlı listeleme ve filtreleme
- **Gelişmiş Arama**: Elasticsearch ile tam metin arama
- **Sepet & Sipariş**: Dinamik sepet yönetimi ve sipariş takibi
- **Favoriler**: Kullanıcı favori ürün sistemi
- **Yorumlar**: Ürün değerlendirme ve yorum sistemi

### 👨‍💼 Yönetim Panelleri
- **Satıcı Paneli**: Stok, sipariş ve ürün yönetimi
- **Admin Paneli**: Kullanıcı, satıcı ve sistem yönetimi
- **Dashboard**: Gerçek zamanlı istatistikler ve raporlar

### 📱 Modern UI/UX
- **Responsive Tasarım**: Mobil uyumlu arayüz
- **Tailwind CSS**: Modern ve hızlı stil sistemi
- **React 19**: En güncel React özellikleri
- **Bildirim Sistemi**: Kullanıcı dostu geri bildirimler

---

## 🚀 Teknoloji Yığını

### Backend
- **Framework**: Spring Boot 3.5.3
- **Güvenlik**: Spring Security + JWT
- **Veritabanı**: PostgreSQL + Spring Data JPA
- **Arama**: Elasticsearch
- **Dokümantasyon**: Swagger/OpenAPI
- **Java**: JDK 21

### Frontend
- **Framework**: React 19
- **Build Tool**: Vite 7
- **Routing**: React Router
- **HTTP Client**: Axios
- **Styling**: Tailwind CSS
- **Form Handling**: React Hook Form + Zod
- **Charts**: Chart.js

---

## 📁 Proje Yapısı

```
E-commerce-spring-react/
├── 📁 backend/                    # Spring Boot Backend
│   ├── 📁 src/main/java/com/bahattintok/e_commerce/
│   │   ├── 📁 controller/         # REST API Controllers
│   │   ├── 📁 service/           # Business Logic
│   │   ├── 📁 repository/        # Data Access Layer
│   │   ├── 📁 security/          # JWT & Security Config
│   │   ├── 📁 model/             # Entity Classes
│   │   └── 📁 dto/               # Data Transfer Objects
│   ├── 📁 src/main/resources/
│   │   └── 📄 application.properties
│   └── 📄 pom.xml                # Maven Dependencies
│
├── 📁 frontend/                   # React Frontend
│   ├── 📁 src/
│   │   ├── 📁 components/        # Reusable Components
│   │   ├── 📁 pages/             # Page Components
│   │   ├── 📁 services/          # API Services
│   │   ├── 📁 context/           # React Context
│   │   └── 📁 utils/             # Utility Functions
│   ├── 📄 vite.config.ts         # Vite Configuration
│   └── 📄 package.json           # NPM Dependencies
│
└── 📄 README.md                   # Bu dosya
```

---

## ⚙️ Kurulum ve Çalıştırma

### 📋 Gereksinimler
- ☕ Java 21 (JDK)
- 🟢 Node.js 18+ ve npm
- 🐘 PostgreSQL (port: 5432)
- 🔍 Elasticsearch (port: 9200)

### 1️⃣ Veritabanı Kurulumu
```sql
-- PostgreSQL'de veritabanı oluşturun
CREATE DATABASE "e-commerce_db";
```

### 2️⃣ Backend Kurulumu
```bash
cd backend

# Windows
mvnw.cmd spring-boot:run

# macOS/Linux
./mvnw spring-boot:run
```
🌐 **Backend URL**: `http://localhost:8082`  
📚 **Swagger UI**: `http://localhost:8082/swagger-ui.html`

### 3️⃣ Frontend Kurulumu
```bash
cd frontend
npm install
npm run dev
```
🌐 **Frontend URL**: `http://localhost:5173`

---

## 🔧 Konfigürasyon

### Backend (`application.properties`)
```properties
# Server Configuration
server.port=8082

# Database Configuration
spring.datasource.url=jdbc:postgresql://localhost:5432/e-commerce_db
spring.datasource.username=postgres
spring.datasource.password=147369

# JPA Configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

# JWT Configuration
jwt.secret=your-secret-key-here
jwt.expiration=86400000

# CORS Configuration
spring.web.cors.allowed-origins=http://localhost:5173
spring.web.cors.allowed-methods=GET,POST,PUT,DELETE,OPTIONS
spring.web.cors.allowed-headers=*

# Elasticsearch Configuration
elasticsearch.enabled=true
spring.elasticsearch.uris=http://localhost:9200
```

### Frontend (`src/services/api.ts`)
```typescript
const API_BASE_URL = 'http://localhost:8082/api';
```

---

## 🔐 Güvenlik

### Kimlik Doğrulama Akışı
1. **Giriş**: `POST /api/auth/signin`
2. **JWT Token**: `HttpOnly` cookie olarak saklanır
3. **Çıkış**: `POST /api/auth/logout`

### Şifre Güvenliği
- **Frontend**: SHA-256 hashleme
- **Backend**: BCrypt ile güvenli saklama
- **Network**: Sadece hash'lenmiş şifre iletimi

### Örnek Giriş İsteği
```bash
curl -X POST http://localhost:8082/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"password"}'
```

---

## 👥 Varsayılan Test Verileri

Uygulama ilk çalıştırıldığında otomatik olarak test verileri eklenir:

### Kullanıcılar
- **Test Kullanıcı**: `testuser` / `password`
- **Test Satıcı**: `testseller` / `password`

### Kategoriler
- 📱 Elektronik
- 👕 Giyim
- 📚 Kitap
- 🏠 Ev & Yaşam

---

## 🛠️ Geliştirme Komutları

### Backend
```bash
cd backend
mvnw.cmd test                    # Testleri çalıştır
mvnw.cmd clean package          # Projeyi derle
```

### Frontend
```bash
cd frontend
npm run lint                    # Kod kalitesi kontrolü
npm run build                   # Production build
npm run preview                 # Build önizleme
```

---

## 🐛 Sorun Giderme

### Backend Bağlantı Sorunları
- ✅ PostgreSQL servisinin çalıştığını kontrol edin
- ✅ Veritabanı bağlantı bilgilerini doğrulayın
- ✅ Port 8082'nin kullanılabilir olduğunu kontrol edin

### Frontend Sorunları
- ✅ Backend'in çalıştığını kontrol edin (`http://localhost:8082`)
- ✅ CORS ayarlarını kontrol edin
- ✅ Browser console'da hata mesajlarını inceleyin

### Elasticsearch Sorunları
- ✅ Elasticsearch servisinin çalıştığını kontrol edin
- ✅ `http://localhost:9200` adresine erişilebildiğini doğrulayın
- ✅ Gerekirse `elasticsearch.enabled=false` ile devre dışı bırakın

---

## 📈 Gelecek Geliştirmeler

- [ ] 📧 Email bildirimleri
- [ ] 💳 Ödeme sistemi entegrasyonu
- [ ] 📊 Gelişmiş analitik dashboard
- [ ] 🌍 Çoklu dil desteği
- [ ] 📱 Mobil uygulama
- [ ] 🔄 Real-time bildirimler

---

## 🤝 Katkıda Bulunma

1. Bu repository'yi fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

---

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasına bakın.

---

## 📞 İletişim

**Geliştirici**: Bahattin Tok  
**Email**: bahattok5@gmail.com  
**GitHub**: [bahattintok](https://github.com/bahattintok)

---

<div align="center">

**⭐ Bu projeyi beğendiyseniz yıldız vermeyi unutmayın! ⭐**

</div>

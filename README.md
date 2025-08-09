### E‑Commerce (Spring Boot + React)

Modern bir e‑ticaret uygulaması. Backend Spring Boot (JWT, JPA, Swagger, Elasticsearch) ile, frontend React + Vite + Tailwind ile geliştirilmiştir. Proje; kullanıcı/satıcı yönetimi, ürünler, kategoriler, arama, favoriler, sepet/sipariş, yorumlar ve satıcı paneli gibi modüller içerir.

---

### Özellikler
- **Kimlik Doğrulama**: JWT tabanlı oturum, güvenli `HttpOnly` cookie kullanımı
- **Rol Tabanlı Erişim**: `ADMIN`, `SELLER`, `USER` rollerine göre yetkilendirme
- **Ürün ve Kategoriler**: Listeleme, detay, kategori bazlı filtreleme
- **Elasticsearch Arama**: Tam metin arama ve arama önerileri
- **Sepet ve Sipariş**: Sepete ekleme/çıkarma, sipariş oluşturma ve takip
- **Favoriler ve Bildirimler**: Ürün favorileme, bildirim yönetimi
- **Yorumlar**: Ürün değerlendirme ve yorumlar
- **Satıcı Paneli**: Stok, sipariş, ürün ve kampanya yönetimi sayfaları
- **Admin Paneli**: `ADMIN` yetkili işlemler için korumalı alan
- **Swagger/OpenAPI**: Entegre API dokümantasyonu

---

### Teknoloji Yığını
- **Backend**: Spring Boot 3.5.3, Spring Web, Spring Security, Spring Data JPA, Validation, PostgreSQL, JJWT 0.12.3, springdoc-openapi, Hibernate Types, Spring Data Elasticsearch
- **Frontend**: React 19, Vite 7, React Router, Axios, Tailwind CSS, React Hook Form, Zod, Chart.js
- **Veritabanı**: PostgreSQL
- **Arama**: Elasticsearch (http://localhost:9200)
- **Java**: JDK 21

---

### Proje Yapısı
```
E-commerce-spring-react/
├─ backend/
│  ├─ src/main/java/com/bahattintok/e_commerce/
│  │  ├─ controller/      # REST controller'lar (Auth, Product, Seller, Order, vb.)
│  │  ├─ service/         # Servis katmanı (+impl)
│  │  ├─ repository/      # Spring Data JPA repository'leri
│  │  ├─ security/        # JWT filter, util ve UserDetailsService
│  │  ├─ config/          # Security, OpenAPI, Elasticsearch, DataInitializer
│  │  ├─ model/           # Varlıklar (User, Product, Category, Order, ...)
│  │  └─ dto/             # İstek/yanıt DTO'ları
│  ├─ src/main/resources/
│  │  ├─ application.properties
│  │  └─ db/              # (Flyway devre dışı)
│  └─ pom.xml             # Maven yapılandırması
└─ frontend/
   ├─ src/
   │  ├─ components/      # UI bileşenleri (Header, ProductList, AdminPanel, ...)
   │  ├─ pages/           # Sayfalar (Profile, Orders, SellerPanel, ...)
   │  ├─ services/        # API istemcisi (Axios)
   │  ├─ context/         # Context provider'lar (Auth, Cart, Language, ...)
   │  └─ App.jsx, main.jsx
   ├─ vite.config.ts      # Geliştirme proxy ayarları (5173 → 8082)
   └─ package.json
```

---

### Gereksinimler
- Java 21 (JDK)
- Node.js 18+ ve npm
- PostgreSQL (lokalde 5432 portu)
- Elasticsearch (lokalde 9200 portu)

---

### Kurulum ve Çalıştırma
#### 1) Veritabanı ve Elasticsearch
- PostgreSQL'de veritabanını oluşturun:
  ```sql
  CREATE DATABASE "e-commerce_db";
  ```
- `backend/src/main/resources/application.properties` dosyasındaki bağlantı bilgilerini gerekirse güncelleyin:
  ```properties
  spring.datasource.url=jdbc:postgresql://localhost:5432/e-commerce_db
  spring.datasource.username=postgres
  spring.datasource.password=147369
  ```
- Elasticsearch'i başlatın (varsayılan: `http://localhost:9200`).

#### 2) Backend
```bash
cd backend
# Windows
mvnw.cmd spring-boot:run
# macOS/Linux
./mvnw spring-boot:run
```
- Varsayılan port: `8082`
- Swagger UI: `http://localhost:8082/swagger-ui.html` (alternatif: `/swagger-ui/index.html`)

#### 3) Frontend
```bash
cd frontend
npm install
npm run dev
```
- Geliştirme URL'si: `http://localhost:5173`
- İstemci, API'ye doğrudan `http://localhost:8082/api` üzerinden bağlanır. Vite proxy tanımlı olsa da `axios` tabanı `frontend/src/services/api.ts` içinde sabit `http://localhost:8082/api` olarak ayarlanmıştır.

---

### Konfigürasyon
#### Backend (`application.properties`)
- Uygulama
  - `server.port=8082`
- Veritabanı
  - `spring.datasource.url=jdbc:postgresql://localhost:5432/e-commerce_db`
  - `spring.datasource.username=postgres`
  - `spring.datasource.password=147369`
- JPA
  - `spring.jpa.hibernate.ddl-auto=update`
  - `spring.jpa.show-sql=true`
- JWT
  - `jwt.secret=...` (değiştirin!)
  - `jwt.expiration=86400000` (ms)
- CORS
  - `spring.web.cors.allowed-origins=http://localhost:5173`
  - `spring.web.cors.allowed-methods=GET,POST,PUT,DELETE,OPTIONS`
  - `spring.web.cors.allowed-headers=*`
- Swagger
  - `springdoc.api-docs.path=/api-docs`
  - `springdoc.swagger-ui.path=/swagger-ui.html`
- Elasticsearch
  - `elasticsearch.enabled=true`
  - `spring.elasticsearch.uris=http://localhost:9200`

Not: Üretimde gizli bilgiler ortam değişkenlerinden yönetilmelidir. `SecurityConfig` içinde CORS `allowCredentials=true` ve izinli origin listesi tanımlıdır.

#### Frontend
- `frontend/src/services/api.ts` içinde API tabanı:
  ```ts
  const API_BASE_URL = 'http://localhost:8082/api';
  ```
  Gerekirse ortam değişkeni ile yönetilecek şekilde düzenleyebilirsiniz (ör. `import.meta.env.VITE_API_BASE_URL`).

---

### Kimlik Doğrulama ve Güvenlik
- JWT, `HttpOnly` cookie (`token`) olarak set edilir: `POST /api/auth/signin`
- Çıkış: `POST /api/auth/logout` (cookie temizlenir)
- Korumalı alanlar `SecurityConfig` ile yönetilir:
  - Public: `/api/products/**`, `/api/categories/**`, `/api/auth/**`, `/api/stores/**`, `/api/elasticsearch/**`, `/api/search-suggestions/**`, Swagger yolları
  - Admin: `/api/admin/**` → `hasRole('ADMIN')`

Örnek giriş isteği:
```bash
curl -i -X POST http://localhost:8082/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"password"}'
```
Yanıtla birlikte `Set-Cookie: token=...; HttpOnly` başlığı gelir.

---

### Varsayılan Test Verileri
`DataInitializer` ilk çalıştırmada örnek veriler ekler:
- Roller: `USER`, `ADMIN`, `SELLER`
- Kategoriler: Elektronik, Giyim, Kitap, Ev & Yaşam
- Kullanıcılar:
  - `testuser` / `password`
  - `testseller` / `password` (bağlı `Test Mağazası` ile)
- Örnek ürünler, siparişler ve yorumlar

Not: Admin rolü oluşturulur ancak varsayılan admin kullanıcı atanmaz.

---

### Geliştirme Komutları
- Backend test/build:
  ```bash
  cd backend
  mvnw.cmd test   # Windows
  mvnw.cmd clean package
  ```
- Frontend lint/build/preview:
  ```bash
  cd frontend
  npm run lint
  npm run build
  npm run preview
  ```

---

### Sorun Giderme
- **Backend bağlanamıyor**: Frontend ilk yüklemede `GET /api/auth/me` ile backend sağlığını kontrol eder. Çalışmıyorsa sayfada uyarı görürsünüz. `backend` ayakta ve `server.port=8082` olmalı.
- **CORS/Çerez**: `withCredentials=true` kullanılıyor. Backend CORS `allowed-origins` içinde `http://localhost:5173` yer almalı ve `allowCredentials=true` olmalı.
- **Veritabanı bağlantısı**: PostgreSQL servisinin çalıştığını ve kimlik bilgilerinin doğru olduğunu doğrulayın. `ddl-auto=update` şema oluşturur.
- **Elasticsearch**: `http://localhost:9200` erişilebilir olmalı. Gerekirse `elasticsearch.enabled=false` ile devre dışı bırakın.
- **Swagger açılmıyor**: `springdoc.swagger-ui.path=/swagger-ui.html` altında servis veriyor. Alternatif yol: `/swagger-ui/index.html`.

---

### Katkı
Hata/iyileştirme önerileri için issue veya PR açabilirsiniz. Kod stilini ve mevcut dizin yapısını korumaya özen gösterin.

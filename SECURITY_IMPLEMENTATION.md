# SHA-256 + BCrypt Güvenlik Implementasyonu

Bu proje, kullanıcı şifrelerini güvenli şekilde işlemek için **SHA-256 + BCrypt** kombinasyonu kullanır.

## 🔐 Güvenlik Mimarisi

### Frontend (React)
- Kullanıcı şifresini **SHA-256** ile hash'ler
- Network'te sadece hash'lenmiş şifre gönderilir
- Plain text şifre hiçbir zaman network'te görünmez

### Backend (Spring Boot)
- Gelen **SHA-256 hash'ini** "parola" olarak kabul eder
- Register işleminde: SHA-256 hash'ini **BCrypt** ile tekrar hash'ler
- Login işleminde: SHA-256 hash'ini DB'deki BCrypt hash ile karşılaştırır
- Veritabanında sadece **BCrypt hash** saklanır

## 📁 Dosya Yapısı

### Frontend
```
frontend/src/
├── utils/
│   ├── passwordUtils.js          # SHA-256 hashleme ve şifre güçlülük kontrolü
│   └── __tests__/
│       └── passwordUtils.test.js # Test dosyaları
├── components/
│   ├── Login/Login.jsx           # Giriş bileşeni (SHA-256 hashleme)
│   └── Register/Register.jsx     # Kayıt bileşeni (SHA-256 + güçlülük kontrolü)
└── services/
    └── api.ts                    # API servisleri
```

### Backend
```
backend/src/main/java/com/bahattintok/e_commerce/
├── service/impl/
│   └── AuthServiceImpl.java      # Auth servis (SHA-256 + BCrypt işleme)
└── dto/
    ├── SignInRequest.java        # Giriş DTO
    └── SignUpRequest.java        # Kayıt DTO
```

## 🚀 Kullanım

### 1. Frontend - Şifre Hashleme
```javascript
import { hashPassword } from '../../utils/passwordUtils';

// Şifreyi hash'le
const hashedPassword = await hashPassword('userPassword123');

// API'ye gönder
const response = await api.post('/auth/signin', {
  email: 'user@example.com',
  password: hashedPassword // SHA-256 hash
});
```

### 2. Backend - Şifre İşleme
```java
// Register işleminde
String hashedPassword = request.getPassword(); // Frontend'den gelen SHA-256 hash
String encodedPassword = passwordEncoder.encode(hashedPassword); // BCrypt ile hash'le
user.setPassword(encodedPassword); // DB'ye kaydet

// Login işleminde
String hashedPassword = request.getPassword(); // Frontend'den gelen SHA-256 hash
boolean matches = passwordEncoder.matches(hashedPassword, user.getPassword()); // BCrypt ile karşılaştır
```

## 🔒 Güvenlik Avantajları

1. **Network Güvenliği**: Plain text şifre hiçbir zaman network'te görünmez
2. **Veritabanı Güvenliği**: DB'de sadece BCrypt hash saklanır
3. **Çift Katmanlı Hashleme**: SHA-256 + BCrypt kombinasyonu
4. **Salt Koruması**: BCrypt otomatik salt üretir
5. **Şifre Güçlülük Kontrolü**: Frontend'de gerçek zamanlı güçlülük analizi

## 🧪 Test

```bash
# Frontend testleri
cd frontend
npm test passwordUtils.test.js

# Backend testleri
cd backend
mvn test
```

## 📊 Şifre Güçlülük Seviyeleri

| Skor | Seviye | Renk | Açıklama |
|------|--------|------|----------|
| 0-1  | Çok Zayıf | Kırmızı | Minimum gereksinimler karşılanmamış |
| 2    | Zayıf | Turuncu | Temel gereksinimler karşılanmış |
| 3    | Orta | Sarı | Orta seviye güvenlik |
| 4    | Güçlü | Mavi | İyi seviye güvenlik |
| 5    | Çok Güçlü | Yeşil | Maksimum güvenlik |

## 🔧 Konfigürasyon

### BCrypt Konfigürasyonu
```java
@Bean
public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
}
```

### Frontend Hashleme
```javascript
// SHA-256 hashleme (Web Crypto API)
const hashPassword = async (password) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};
```

## ⚠️ Önemli Notlar

1. **HTTPS Kullanın**: Production'da mutlaka HTTPS kullanın
2. **Cookie Güvenliği**: JWT token'ları güvenli cookie'lerde saklayın
3. **Rate Limiting**: Brute force saldırılarına karşı rate limiting uygulayın
4. **Log Güvenliği**: Şifre hash'lerini log dosyalarında saklamayın
5. **Session Yönetimi**: Güvenli session yönetimi uygulayın

## 🎯 Sonuç

Bu implementasyon ile:
- ✅ Network'te şifre güvenliği sağlanır
- ✅ Veritabanında güvenli hash saklanır
- ✅ Çift katmanlı şifreleme uygulanır
- ✅ Kullanıcı deneyimi iyileştirilir
- ✅ Güvenlik standartları karşılanır

**Güvenli kodlama için bu implementasyonu kullanın! 🔐**

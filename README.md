# 🛒 E-Commerce Platform
### Modern Full-Stack E-Commerce Solution with Spring Boot & React

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.0-brightgreen.svg)](#)
[![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](#)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](#)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4-38B2AC.svg)](#)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-336791.svg)](#)
[![Elasticsearch](https://img.shields.io/badge/Elasticsearch-8.0-005571.svg)](#)
[![JWT](https://img.shields.io/badge/JWT-Security-orange.svg)](#)

A modern, secure, and scalable e-commerce platform built with Spring Boot backend and React frontend. Features advanced search capabilities, comprehensive admin panel, and enterprise-level security.

---

## ✨ Key Features

### 🛍️ **Customer Experience**
- **Product Catalog**: Advanced filtering and sorting
- **Smart Search**: Elasticsearch-powered search with autocomplete
- **Shopping Cart**: Real-time cart management
- **User Authentication**: Secure JWT-based authentication
- **Order Management**: Complete order tracking system
- **Responsive Design**: Mobile-first approach with Tailwind CSS

### 🔧 **Admin Panel**
- **Dashboard**: Real-time analytics and metrics
- **Product Management**: CRUD operations with image upload
- **User Management**: Customer and seller administration
- **Order Processing**: Order status management
- **Category Management**: Hierarchical category system
- **Sales Analytics**: Revenue and performance tracking

### 🔒 **Security Features**
- **Dual-Layer Encryption**: SHA-256 + BCrypt password security
- **JWT Authentication**: HttpOnly cookie-based sessions
- **Role-Based Access**: Admin, Seller, Customer roles
- **CORS Protection**: Secure cross-origin configuration
- **Input Validation**: Comprehensive data validation
- **SQL Injection Protection**: Parameterized queries

---

## 🏗️ Technology Stack

### 🌐 **Frontend**
```
React 18.2.0          # Modern UI library
TypeScript 5.0        # Type-safe JavaScript
Tailwind CSS 3.4      # Utility-first CSS framework
Vite                  # Fast build tool
React Router          # Client-side routing
Axios                 # HTTP client
React Hook Form       # Form management
React Query           # Server state management
```

### ⚙️ **Backend**
```
Spring Boot 3.2.0     # Java framework
Spring Security       # Authentication & authorization
Spring Data JPA       # Data persistence
PostgreSQL 15         # Primary database
Elasticsearch 8.0     # Search engine
Redis                 # Caching layer
JWT                   # Token-based authentication
Maven                 # Dependency management
```

### 🛠️ **DevOps & Tools**
```
Docker                # Containerization
Docker Compose        # Multi-container orchestration
Git                   # Version control
Swagger/OpenAPI       # API documentation
Postman               # API testing
```

---

## 📁 Project Structure

```
e-commerce-platform/
├── 📁 backend/                    # Spring Boot Application
│   ├── 📁 src/main/java/com/bahattintok/e_commerce/
│   │   ├── 📁 config/             # Configuration classes
│   │   ├── 📁 controller/         # REST controllers
│   │   ├── 📁 dto/                # Data Transfer Objects
│   │   ├── 📁 entity/             # JPA entities
│   │   ├── 📁 repository/         # Data repositories
│   │   ├── 📁 service/            # Business logic
│   │   ├── 📁 security/           # Security configuration
│   │   └── 📄 ECommerceApplication.java
│   ├── 📁 src/main/resources/
│   │   ├── 📄 application.properties
│   │   └── 📄 data.sql
│   └── 📄 pom.xml
├── 📁 frontend/                   # React Application
│   ├── 📁 src/
│   │   ├── 📁 components/         # Reusable components
│   │   ├── 📁 pages/              # Page components
│   │   ├── 📁 services/           # API services
│   │   ├── 📁 utils/              # Utility functions
│   │   ├── 📁 context/            # React contexts
│   │   ├── 📁 assets/             # Static assets
│   │   └── 📄 App.jsx
│   ├── 📄 package.json
│   ├── 📄 tailwind.config.js
│   └── 📄 vite.config.ts
├── 📄 docker-compose.yml
├── 📄 README.md
└── 📄 LICENSE
```

---

## 🚀 Quick Start

### 📋 Prerequisites
- **Java 17+** - Backend runtime
- **Node.js 18+** - Frontend runtime
- **PostgreSQL 15+** - Database
- **Elasticsearch 8.0+** - Search engine
- **Redis** - Caching (optional)
- **Docker & Docker Compose** - Containerization

### 🐳 Docker Setup (Recommended)
```bash
# Clone the repository
git clone https://github.com/yourusername/e-commerce-platform.git
cd e-commerce-platform

# Start all services with Docker Compose
docker-compose up -d

# Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:8080
# Swagger UI: http://localhost:8080/swagger-ui.html
```

### 🔧 Manual Setup

#### Backend Setup
```bash
cd backend

# Install dependencies
./mvnw clean install

# Configure database (application.properties)
spring.datasource.url=jdbc:postgresql://localhost:5432/ecommerce
spring.datasource.username=your_username
spring.datasource.password=your_password

# Run the application
./mvnw spring-boot:run
```

#### Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Configure API endpoint (src/services/api.ts)
const API_BASE_URL = 'http://localhost:8080/api';

# Start development server
npm run dev
```

---

## 🔧 Configuration

### 🗄️ Database Configuration
```properties
# PostgreSQL Configuration
spring.datasource.url=jdbc:postgresql://localhost:5432/ecommerce
spring.datasource.username=ecommerce_user
spring.datasource.password=secure_password
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false
```

### 🔍 Elasticsearch Configuration
```properties
# Elasticsearch Configuration
spring.elasticsearch.uris=http://localhost:9200
spring.elasticsearch.username=elastic
spring.elasticsearch.password=elastic_password
```

### 🌐 Frontend API Configuration
```typescript
// src/services/api.ts
const API_CONFIG = {
  baseURL: 'http://localhost:8080/api',
  timeout: 10000,
  withCredentials: true
};
```

---

## 🔐 Authentication & Security

### 🔑 JWT Authentication
- **Access Tokens**: Short-lived (15 minutes)
- **Refresh Tokens**: Long-lived (7 days)
- **HttpOnly Cookies**: Secure token storage
- **CSRF Protection**: Built-in CSRF tokens

### 👥 User Roles
| Role | Permissions |
|------|-------------|
| **ADMIN** | Full system access, user management |
| **SELLER** | Product management, order processing |
| **CUSTOMER** | Shopping, order tracking |

### 🔒 Password Security
- **Frontend**: SHA-256 hashing before transmission
- **Backend**: BCrypt hashing for storage
- **Strength Validation**: Real-time password strength checking

### 📝 Example Login Request
```javascript
const loginData = {
  email: "user@example.com",
  password: await hashPassword("userPassword123") // SHA-256 hash
};

const response = await api.post('/auth/signin', loginData);
```

---

## 🧪 Default Test Data

The application includes pre-configured test data via `DataInitializer`:

### 👤 Test Users
```
Admin User:
- Email: admin@example.com
- Password: admin123
- Role: ADMIN

Seller User:
- Email: seller@example.com
- Password: seller123
- Role: SELLER

Customer User:
- Email: customer@example.com
- Password: customer123
- Role: CUSTOMER
```

### 📦 Sample Data
- **Categories**: Electronics, Clothing, Books, Home & Garden
- **Products**: 50+ sample products with images
- **Orders**: Sample order history
- **Reviews**: Product reviews and ratings

---

## 🛠️ Development Commands

### Backend Commands
```bash
# Run tests
./mvnw test

# Build JAR
./mvnw clean package

# Run with profile
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev

# Generate API documentation
./mvnw spring-boot:run
# Visit: http://localhost:8080/swagger-ui.html
```

### Frontend Commands
```bash
# Development server
npm run dev

# Type checking
npm run type-check

# Linting
npm run lint

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests
npm run test
```

---

## 📚 API Documentation

### 🔗 Swagger UI
Access interactive API documentation at: `http://localhost:8080/swagger-ui.html`

### 🌐 Main Endpoints

#### Authentication
```
POST /api/auth/signin     # User login
POST /api/auth/signup     # User registration
POST /api/auth/refresh    # Refresh token
POST /api/auth/logout     # User logout
```

#### Products
```
GET    /api/products           # Get all products
GET    /api/products/{id}      # Get product by ID
POST   /api/products           # Create product (SELLER+)
PUT    /api/products/{id}      # Update product (SELLER+)
DELETE /api/products/{id}      # Delete product (ADMIN)
GET    /api/products/search    # Search products
```

#### Orders
```
GET    /api/orders             # Get user orders
POST   /api/orders             # Create order
GET    /api/orders/{id}        # Get order details
PUT    /api/orders/{id}/status # Update order status (SELLER+)
```

#### Admin
```
GET    /api/admin/users        # Get all users (ADMIN)
GET    /api/admin/dashboard    # Dashboard metrics (ADMIN)
PUT    /api/admin/users/{id}   # Update user (ADMIN)
DELETE /api/admin/users/{id}   # Delete user (ADMIN)
```

---

## 🎨 UI/UX Features

### 🎯 Design System
- **Color Palette**: Modern blue and gray tones
- **Typography**: Inter font family
- **Icons**: Heroicons and Lucide React
- **Animations**: Smooth transitions and micro-interactions
- **Responsive**: Mobile-first design approach

### 📱 Responsive Breakpoints
```css
sm: 640px   # Small devices
md: 768px   # Medium devices
lg: 1024px  # Large devices
xl: 1280px  # Extra large devices
2xl: 1536px # 2X large devices
```

### ⚡ Performance Features
- **Code Splitting**: Route-based lazy loading
- **Image Optimization**: WebP format with fallbacks
- **Caching**: Redis-based API response caching
- **Compression**: Gzip compression for static assets
- **CDN Ready**: Optimized for CDN deployment

---

## 🔍 Troubleshooting

### 🔌 Backend Connection Issues
```bash
# Check if PostgreSQL is running
sudo systemctl status postgresql

# Check if Elasticsearch is running
curl -X GET "localhost:9200/_cluster/health"

# Verify application properties
cat backend/src/main/resources/application.properties
```

### 🌐 CORS & Cookie Issues
```javascript
// Ensure credentials are included in requests
axios.defaults.withCredentials = true;

// Check CORS configuration in SecurityConfig.java
.cors(cors -> cors.configurationSource(corsConfigurationSource()))
```

### 🗄️ Database Issues
```sql
-- Check database connection
\c ecommerce

-- Verify tables exist
\dt

-- Check sample data
SELECT COUNT(*) FROM users;
SELECT COUNT(*) FROM products;
```

### 🔍 Elasticsearch Issues
```bash
# Check Elasticsearch status
curl -X GET "localhost:9200/_cat/health?v"

# Verify indices
curl -X GET "localhost:9200/_cat/indices?v"

# Reindex products
curl -X POST "localhost:8080/api/admin/reindex"
```

### 📋 Swagger Access Issues
- Ensure backend is running on port 8080
- Visit: `http://localhost:8080/swagger-ui.html`
- Check for CORS issues in browser console

---

## 🚀 Future Enhancements

### 🎯 Planned Features
- [ ] **Payment Integration**: Stripe, PayPal support
- [ ] **Multi-language**: i18n internationalization
- [ ] **Real-time Chat**: Customer support chat
- [ ] **Push Notifications**: Order status updates
- [ ] **Advanced Analytics**: Business intelligence dashboard
- [ ] **Mobile App**: React Native mobile application
- [ ] **Microservices**: Service decomposition
- [ ] **GraphQL API**: Alternative to REST API

### 🔧 Technical Improvements
- [ ] **Kubernetes**: Container orchestration
- [ ] **CI/CD Pipeline**: Automated deployment
- [ ] **Monitoring**: Application performance monitoring
- [ ] **Load Balancing**: High availability setup
- [ ] **Database Sharding**: Horizontal scaling
- [ ] **CDN Integration**: Global content delivery

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### 📝 Development Guidelines
- Follow existing code style and conventions
- Write comprehensive tests for new features
- Update documentation for API changes
- Ensure all tests pass before submitting PR

---

## 📄 License

This project is licensed under the **GNU GENERAL PUBLIC LICENSE** - see the [LICENSE](LICENSE) file for details.

---

## 📞 Support & Contact

### 📧 Business Inquiries
- **LinkedIn**: [Bahattin Tok](www.linkedin.com/in/bahattin-tok-08aa2b242)

---

<div align="center">

### 🌟 Star this repository if you find it helpful!

[![GitHub stars](https://img.shields.io/github/stars/yourusername/e-commerce-platform.svg?style=social&label=Star)](#)
[![GitHub forks](https://img.shields.io/github/forks/yourusername/e-commerce-platform.svg?style=social&label=Fork)](#)

**Built with ❤️ by [BT-maker](https://github.com/BT-maker)**

</div>

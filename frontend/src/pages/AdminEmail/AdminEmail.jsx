import React, { useState } from "react";
import { Mail, Send, TestTube, FileText, UserCheck, AlertTriangle, Users, ShoppingCart } from "lucide-react";
import "./AdminEmail.css";
import PageTitle from '../../components/PageTitle/PageTitle';
import MetaTags from '../../components/MetaTags/MetaTags';
import toast from 'react-hot-toast';

const AdminEmail = () => {
  const [loading, setLoading] = useState(false);
  const [emailType, setEmailType] = useState('test');
  const [formData, setFormData] = useState({
    to: '',
    subject: '',
    content: '',
    customerName: '',
    orderNumber: '',
    totalAmount: '',
    resetToken: '',
    username: '',
    status: '',
    productName: '',
    currentStock: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const sendEmail = async (endpoint, data) => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8082/api/email/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (response.ok) {
        toast.success(result.message || 'Email başarıyla gönderildi!');
        setFormData({
          to: '',
          subject: '',
          content: '',
          customerName: '',
          orderNumber: '',
          totalAmount: '',
          resetToken: '',
          username: '',
          status: '',
          productName: '',
          currentStock: ''
        });
      } else {
        toast.error(result.error || 'Email gönderilemedi!');
      }
    } catch (error) {
      console.error('Email gönderme hatası:', error);
      toast.error('Email gönderilirken bir hata oluştu!');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    switch (emailType) {
      case 'test':
        sendEmail('test', { to: formData.to });
        break;
      case 'simple':
        sendEmail('simple', {
          to: formData.to,
          subject: formData.subject,
          content: formData.content
        });
        break;
      case 'html':
        sendEmail('html', {
          to: formData.to,
          subject: formData.subject,
          htmlContent: formData.content
        });
        break;
      case 'order-confirmation':
        sendEmail('order-confirmation', {
          to: formData.to,
          customerName: formData.customerName,
          orderNumber: formData.orderNumber,
          totalAmount: parseFloat(formData.totalAmount) || 0
        });
        break;
      case 'password-reset':
        sendEmail('password-reset', {
          to: formData.to,
          resetToken: formData.resetToken,
          username: formData.username
        });
        break;
      case 'welcome':
        sendEmail('welcome', {
          to: formData.to,
          customerName: formData.customerName
        });
        break;
      case 'order-status-update':
        sendEmail('order-status-update', {
          to: formData.to,
          customerName: formData.customerName,
          orderNumber: formData.orderNumber,
          status: formData.status
        });
        break;
      case 'low-stock-alert':
        sendEmail('low-stock-alert', {
          to: formData.to,
          productName: formData.productName,
          currentStock: parseInt(formData.currentStock) || 0
        });
        break;
      default:
        toast.error('Geçersiz email tipi!');
    }
  };

  const renderForm = () => {
    switch (emailType) {
      case 'test':
        return (
          <div className="form-group">
            <label>Email Adresi *</label>
            <input
              type="email"
              name="to"
              value={formData.to}
              onChange={handleInputChange}
              placeholder="test@example.com"
              required
            />
          </div>
        );

      case 'simple':
      case 'html':
        return (
          <>
            <div className="form-group">
              <label>Email Adresi *</label>
              <input
                type="email"
                name="to"
                value={formData.to}
                onChange={handleInputChange}
                placeholder="test@example.com"
                required
              />
            </div>
            <div className="form-group">
              <label>Konu</label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                placeholder="Email konusu"
              />
            </div>
            <div className="form-group">
              <label>{emailType === 'html' ? 'HTML İçerik' : 'İçerik'}</label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                placeholder={emailType === 'html' ? '<h1>HTML içerik</h1>' : 'Email içeriği'}
                rows={6}
              />
            </div>
          </>
        );

      case 'order-confirmation':
        return (
          <>
            <div className="form-group">
              <label>Email Adresi *</label>
              <input
                type="email"
                name="to"
                value={formData.to}
                onChange={handleInputChange}
                placeholder="musteri@example.com"
                required
              />
            </div>
            <div className="form-group">
              <label>Müşteri Adı</label>
              <input
                type="text"
                name="customerName"
                value={formData.customerName}
                onChange={handleInputChange}
                placeholder="Müşteri adı"
              />
            </div>
            <div className="form-group">
              <label>Sipariş Numarası</label>
              <input
                type="text"
                name="orderNumber"
                value={formData.orderNumber}
                onChange={handleInputChange}
                placeholder="ORD-123456"
              />
            </div>
            <div className="form-group">
              <label>Toplam Tutar (₺)</label>
              <input
                type="number"
                name="totalAmount"
                value={formData.totalAmount}
                onChange={handleInputChange}
                placeholder="1250.00"
                step="0.01"
              />
            </div>
          </>
        );

      case 'password-reset':
        return (
          <>
            <div className="form-group">
              <label>Email Adresi *</label>
              <input
                type="email"
                name="to"
                value={formData.to}
                onChange={handleInputChange}
                placeholder="kullanici@example.com"
                required
              />
            </div>
            <div className="form-group">
              <label>Kullanıcı Adı</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Kullanıcı adı"
              />
            </div>
            <div className="form-group">
              <label>Reset Token</label>
              <input
                type="text"
                name="resetToken"
                value={formData.resetToken}
                onChange={handleInputChange}
                placeholder="reset-token-123"
              />
            </div>
          </>
        );

      case 'welcome':
        return (
          <>
            <div className="form-group">
              <label>Email Adresi *</label>
              <input
                type="email"
                name="to"
                value={formData.to}
                onChange={handleInputChange}
                placeholder="yeni@example.com"
                required
              />
            </div>
            <div className="form-group">
              <label>Müşteri Adı</label>
              <input
                type="text"
                name="customerName"
                value={formData.customerName}
                onChange={handleInputChange}
                placeholder="Müşteri adı"
              />
            </div>
          </>
        );

      case 'order-status-update':
        return (
          <>
            <div className="form-group">
              <label>Email Adresi *</label>
              <input
                type="email"
                name="to"
                value={formData.to}
                onChange={handleInputChange}
                placeholder="musteri@example.com"
                required
              />
            </div>
            <div className="form-group">
              <label>Müşteri Adı</label>
              <input
                type="text"
                name="customerName"
                value={formData.customerName}
                onChange={handleInputChange}
                placeholder="Müşteri adı"
              />
            </div>
            <div className="form-group">
              <label>Sipariş Numarası</label>
              <input
                type="text"
                name="orderNumber"
                value={formData.orderNumber}
                onChange={handleInputChange}
                placeholder="ORD-123456"
              />
            </div>
            <div className="form-group">
              <label>Durum</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
              >
                <option value="">Durum seçin</option>
                <option value="Hazırlanıyor">Hazırlanıyor</option>
                <option value="Kargoya Verildi">Kargoya Verildi</option>
                <option value="Teslim Edildi">Teslim Edildi</option>
                <option value="İptal Edildi">İptal Edildi</option>
              </select>
            </div>
          </>
        );

      case 'low-stock-alert':
        return (
          <>
            <div className="form-group">
              <label>Email Adresi *</label>
              <input
                type="email"
                name="to"
                value={formData.to}
                onChange={handleInputChange}
                placeholder="admin@example.com"
                required
              />
            </div>
            <div className="form-group">
              <label>Ürün Adı</label>
              <input
                type="text"
                name="productName"
                value={formData.productName}
                onChange={handleInputChange}
                placeholder="Ürün adı"
              />
            </div>
            <div className="form-group">
              <label>Mevcut Stok</label>
              <input
                type="number"
                name="currentStock"
                value={formData.currentStock}
                onChange={handleInputChange}
                placeholder="5"
                min="0"
              />
            </div>
          </>
        );

      default:
        return null;
    }
  };

  const emailTypes = [
    { id: 'test', name: 'Test Email', icon: TestTube, description: 'Basit test emaili gönderir' },
    { id: 'simple', name: 'Basit Email', icon: FileText, description: 'Text formatında email gönderir' },
    { id: 'html', name: 'HTML Email', icon: FileText, description: 'HTML formatında email gönderir' },
    { id: 'order-confirmation', name: 'Sipariş Onayı', icon: ShoppingCart, description: 'Sipariş onay emaili gönderir' },
    { id: 'password-reset', name: 'Şifre Sıfırlama', icon: AlertTriangle, description: 'Şifre sıfırlama emaili gönderir' },
    { id: 'welcome', name: 'Hoş Geldin', icon: UserCheck, description: 'Hoş geldin emaili gönderir' },
    { id: 'order-status-update', name: 'Sipariş Durumu', icon: ShoppingCart, description: 'Sipariş durumu güncelleme emaili gönderir' },
    { id: 'low-stock-alert', name: 'Düşük Stok Uyarısı', icon: AlertTriangle, description: 'Düşük stok uyarısı emaili gönderir' }
  ];

  return (
    <div className="admin-email">
      <MetaTags title="Email Yönetimi - Admin Panel" description="Email gönderme ve yönetimi" />
      
      <div className="admin-email-header">
        <div className="header-content">
          <div className="header-title">
            <Mail className="header-icon" />
            <div>
              <h1>Email Yönetimi</h1>
              <p>Farklı türde email gönderimi yapabilirsiniz</p>
            </div>
          </div>
        </div>
      </div>

      <div className="email-container">
        <div className="email-sidebar">
          <h3>Email Türleri</h3>
          <div className="email-type-list">
            {emailTypes.map((type) => (
              <div
                key={type.id}
                className={`email-type-item ${emailType === type.id ? 'active' : ''}`}
                onClick={() => setEmailType(type.id)}
              >
                <type.icon className="email-type-icon" />
                <div className="email-type-content">
                  <h4>{type.name}</h4>
                  <p>{type.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="email-form-container">
          <div className="email-form-card">
            <h3>{emailTypes.find(t => t.id === emailType)?.name} Emaili Gönder</h3>
            
            <form onSubmit={handleSubmit} className="email-form">
              {renderForm()}
              
              <div className="form-actions">
                <button
                  type="submit"
                  className="send-button"
                  disabled={loading || !formData.to}
                >
                  {loading ? (
                    <div className="loading-spinner"></div>
                  ) : (
                    <>
                      <Send className="button-icon" />
                      Email Gönder
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          <div className="email-info">
            <h4>Email Konfigürasyonu</h4>
            <div className="info-item">
              <strong>SMTP Sunucu:</strong> smtp.gmail.com
            </div>
            <div className="info-item">
              <strong>Port:</strong> 587
            </div>
            <div className="info-item">
              <strong>Güvenlik:</strong> STARTTLS
            </div>
            <div className="info-item">
              <strong>Gönderen:</strong> noreply@ecommerce.com
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminEmail;

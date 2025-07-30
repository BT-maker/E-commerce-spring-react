import React, { useState } from 'react';
import PageTitle from '../components/PageTitle/PageTitle';
import MetaTags from '../components/MetaTags/MetaTags';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Simüle edilmiş form gönderimi
    setTimeout(() => {
      setSuccess('Mesajınız başarıyla gönderildi! En kısa sürede size dönüş yapacağız.');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="contact-container">
      <PageTitle title="İletişim" />
      <MetaTags 
        title="İletişim"
        description="Shopping platformu ile iletişime geçin. Müşteri hizmetleri, satış ve teknik destek için bize ulaşın."
        keywords="iletişim, müşteri hizmetleri, destek, shopping iletişim"
      />
      
      <div className="contact-content">
        <h1 className="contact-title">İletişim</h1>
        
        <div className="contact-grid">
          {/* İletişim Bilgileri */}
          <div className="contact-info">
            <h2>İletişim Bilgileri</h2>
            
            <div className="contact-item">
              <div className="contact-icon">
                <Mail size={24} />
              </div>
              <div>
                <h3>E-posta</h3>
                <p>info@shopping.com</p>
                <p>destek@shopping.com</p>
              </div>
            </div>

            <div className="contact-item">
              <div className="contact-icon">
                <Phone size={24} />
              </div>
              <div>
                <h3>Telefon</h3>
                <p>+90 (212) 555 0123</p>
                <p>+90 (212) 555 0124</p>
              </div>
            </div>

            <div className="contact-item">
              <div className="contact-icon">
                <MapPin size={24} />
              </div>
              <div>
                <h3>Adres</h3>
                <p>Levent Mahallesi, Büyükdere Caddesi</p>
                <p>No: 123, Şişli / İstanbul</p>
                <p>34330 Türkiye</p>
              </div>
            </div>

            <div className="contact-item">
              <div className="contact-icon">
                <Clock size={24} />
              </div>
              <div>
                <h3>Çalışma Saatleri</h3>
                <p>Pazartesi - Cuma: 09:00 - 18:00</p>
                <p>Cumartesi: 10:00 - 16:00</p>
                <p>Pazar: Kapalı</p>
              </div>
            </div>
          </div>

          {/* İletişim Formu */}
          <div className="contact-form-container">
            <h2>Bize Mesaj Gönderin</h2>
            <form className="contact-form" onSubmit={handleSubmit}>
              {error && <div className="error-message">{error}</div>}
              {success && <div className="success-message">{success}</div>}
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Ad Soyad *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">E-posta *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="subject">Konu *</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="message">Mesajınız *</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="6"
                  required
                  disabled={loading}
                  placeholder="Mesajınızı buraya yazın..."
                />
              </div>

              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? (
                  <>
                    <div className="loading-spinner"></div>
                    Gönderiliyor...
                  </>
                ) : (
                  <>
                    <Send size={20} />
                    Mesaj Gönder
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Harita Bölümü */}
        <div className="map-section">
          <h2>Konumumuz</h2>
          <div className="map-container">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3008.9633693359308!2d28.9836!3d41.0782!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDHCsDA0JzQxLjQiTiAyOMKwNTknMDAuOSJF!5e0!3m2!1str!2str!4v1234567890"
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Shopping Ofis Konumu"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact; 
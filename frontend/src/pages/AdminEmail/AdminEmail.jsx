import React, { useState } from "react";
import { Mail, Send, TestTube, FileText, UserCheck, AlertTriangle, Users, ShoppingCart, Eye } from "lucide-react";
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
    fullName: '',
    status: '',
    productName: '',
    currentStock: ''
  });

  const [emailTemplates, setEmailTemplates] = useState([
    {
      id: 1,
      name: 'Hoş Geldin Emaili',
      type: 'welcome',
      subject: 'Hoş Geldiniz!',
      content: 'Merhaba {{customerName}}, hesabınız başarıyla oluşturuldu.',
      isActive: true
    },
    {
      id: 2,
      name: 'Sipariş Onayı',
      type: 'order_confirmation',
      subject: 'Siparişiniz Onaylandı',
      content: 'Merhaba {{customerName}}, {{orderNumber}} numaralı siparişiniz onaylandı.',
      isActive: true
    },
    {
      id: 3,
      name: 'Şifre Sıfırlama',
      type: 'password_reset',
      subject: 'Şifre Sıfırlama',
      content: 'Merhaba {{fullName}}, şifre sıfırlama linkiniz otomatik olarak oluşturulmuştur.',
      isActive: true
    },
    {
      id: 4,
      name: 'Stok Uyarısı',
      type: 'low_stock',
      subject: 'Stok Uyarısı',
      content: '{{productName}} ürününün stoku azaldı. Mevcut stok: {{currentStock}}',
      isActive: false
    }
  ]);

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
          fullName: '',
          status: '',
          productName: '',
          currentStock: ''
        });
      } else {
        toast.error(result.message || 'Email gönderilirken hata oluştu!');
      }
    } catch (error) {
      console.error('Email gönderme hatası:', error);
      toast.error('Email gönderilirken hata oluştu!');
    } finally {
      setLoading(false);
    }
  };

  const handleSendTestEmail = () => {
    if (!formData.to || !formData.subject || !formData.content) {
      toast.error('Lütfen tüm alanları doldurun!');
      return;
    }

    sendEmail('test', {
      to: formData.to,
      subject: formData.subject,
      content: formData.content
    });
  };

  const handleSendWelcomeEmail = () => {
    if (!formData.to || !formData.customerName) {
      toast.error('Lütfen email ve müşteri adını girin!');
      return;
    }

    sendEmail('welcome', {
      to: formData.to,
      customerName: formData.customerName
    });
  };

  const handleSendOrderConfirmation = () => {
    if (!formData.to || !formData.customerName || !formData.orderNumber || !formData.totalAmount) {
      toast.error('Lütfen tüm alanları doldurun!');
      return;
    }

    sendEmail('order-confirmation', {
      to: formData.to,
      customerName: formData.customerName,
      orderNumber: formData.orderNumber,
      totalAmount: formData.totalAmount
    });
  };

  const handleSendPasswordReset = () => {
    if (!formData.to || !formData.fullName) {
      toast.error('Lütfen tüm alanları doldurun!');
      return;
    }

    // Otomatik reset token oluştur
    const resetToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

    sendEmail('password-reset', {
      to: formData.to,
      fullName: formData.fullName,
      resetToken: resetToken
    });
  };

  const handleSendLowStockAlert = () => {
    if (!formData.to || !formData.productName || !formData.currentStock) {
      toast.error('Lütfen tüm alanları doldurun!');
      return;
    }

    sendEmail('low-stock', {
      to: formData.to,
      productName: formData.productName,
      currentStock: formData.currentStock
    });
  };

  const getEmailTypeIcon = (type) => {
    switch (type) {
      case 'welcome':
        return <UserCheck className="w-5 h-5 text-green-600" />;
      case 'order_confirmation':
        return <ShoppingCart className="w-5 h-5 text-blue-600" />;
      case 'password_reset':
        return <AlertTriangle className="w-5 h-5 text-orange-600" />;
      case 'low_stock':
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
      default:
        return <Mail className="w-5 h-5 text-gray-600" />;
    }
  };

  const getEmailTypeColor = (type) => {
    switch (type) {
      case 'welcome':
        return 'bg-green-100 text-green-800';
      case 'order_confirmation':
        return 'bg-blue-100 text-blue-800';
      case 'password_reset':
        return 'bg-orange-100 text-orange-800';
      case 'low_stock':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <PageTitle title="Email Yönetimi" />
      <MetaTags 
        title="Email Yönetimi"
        description="E-posta yönetimi. Email şablonları ve otomatik gönderimler."
        keywords="email yönetimi, email şablonları, otomatik email"
      />

      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 shadow-sm">
          <div className="px-6 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Mail className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Email Yönetimi</h1>
                  <p className="text-gray-600 mt-1">E-posta şablonları ve otomatik gönderimler</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 px-6">
          {/* Email Templates */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
              <div className="p-6 border-b border-gray-200/50">
                <h2 className="text-xl font-bold text-gray-900">Email Şablonları</h2>
                <p className="text-gray-600 text-sm mt-1">Mevcut email şablonları</p>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {emailTemplates.map((template) => (
                    <div key={template.id} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors duration-200">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            {getEmailTypeIcon(template.type)}
                            <h3 className="font-semibold text-gray-900">{template.name}</h3>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{template.subject}</p>
                          <p className="text-xs text-gray-500 line-clamp-2">{template.content}</p>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          <button 
                            className={`p-1 rounded transition-colors duration-200 ${
                              template.isActive 
                                ? 'text-green-600 hover:bg-green-100' 
                                : 'text-gray-400 hover:bg-gray-100'
                            }`}
                            onClick={() => {
                              setEmailTemplates(prev => 
                                prev.map(t => 
                                  t.id === template.id 
                                    ? { ...t, isActive: !t.isActive }
                                    : t
                                )
                              );
                            }}
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getEmailTypeColor(template.type)}`}>
                          {template.type}
                        </span>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          template.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {template.isActive ? 'Aktif' : 'Pasif'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Email Sender */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
              <div className="p-6 border-b border-gray-200/50">
                <h2 className="text-xl font-bold text-gray-900">Email Gönder</h2>
                <p className="text-gray-600 text-sm mt-1">Test emaili gönder veya şablon kullan</p>
              </div>
              <div className="p-6">
                <div className="space-y-6">
                  {/* Email Type Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Email Türü</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {[
                        { value: 'test', label: 'Test Email', icon: TestTube },
                        { value: 'welcome', label: 'Hoş Geldin', icon: UserCheck },
                        { value: 'order', label: 'Sipariş', icon: ShoppingCart },
                        { value: 'reset', label: 'Şifre Sıfır', icon: AlertTriangle }
                      ].map((type) => {
                        const Icon = type.icon;
                        return (
                          <button
                            key={type.value}
                            onClick={() => setEmailType(type.value)}
                            className={`p-3 rounded-lg border-2 transition-all duration-200 flex flex-col items-center space-y-2 ${
                              emailType === type.value
                                ? 'border-orange-500 bg-orange-50 text-orange-700'
                                : 'border-gray-200 hover:border-gray-300 text-gray-600'
                            }`}
                          >
                            <Icon className="w-5 h-5" />
                            <span className="text-xs font-medium">{type.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Common Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Alıcı Email</label>
                      <input
                        type="email"
                        name="to"
                        value={formData.to}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="ornek@email.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Konu</label>
                      <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="Email konusu"
                      />
                    </div>
                  </div>

                  {/* Dynamic Fields Based on Email Type */}
                  {emailType === 'welcome' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Müşteri Adı</label>
                      <input
                        type="text"
                        name="customerName"
                        value={formData.customerName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="Müşteri adı"
                      />
                    </div>
                  )}

                  {emailType === 'order' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Müşteri Adı</label>
                        <input
                          type="text"
                          name="customerName"
                          value={formData.customerName}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          placeholder="Müşteri adı"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Sipariş No</label>
                        <input
                          type="text"
                          name="orderNumber"
                          value={formData.orderNumber}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          placeholder="Sipariş numarası"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Toplam Tutar</label>
                        <input
                          type="number"
                          name="totalAmount"
                          value={formData.totalAmount}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          placeholder="0.00"
                        />
                      </div>
                    </div>
                  )}

                  {emailType === 'reset' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">İsim Soyisim</label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="İsim Soyisim"
                      />
                    </div>
                  )}

                  {/* Content Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">İçerik</label>
                    <textarea
                      name="content"
                      value={formData.content}
                      onChange={handleInputChange}
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Email içeriği..."
                    />
                  </div>

                  {/* Send Button */}
                  <div className="flex justify-end">
                    <button
                      onClick={() => {
                        switch (emailType) {
                          case 'test':
                            handleSendTestEmail();
                            break;
                          case 'welcome':
                            handleSendWelcomeEmail();
                            break;
                          case 'order':
                            handleSendOrderConfirmation();
                            break;
                          case 'reset':
                            handleSendPasswordReset();
                            break;
                          default:
                            handleSendTestEmail();
                        }
                      }}
                      disabled={loading}
                      className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 disabled:from-gray-400 disabled:to-gray-500 text-white px-8 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-2"
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          <span>Gönderiliyor...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Email Gönder</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminEmail;
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CartContext } from '../../context/CartContext';
import { AuthContext } from '../../context/AuthContext';
import { NotificationContext } from '../../context/NotificationContext';
import api from '../../services/api';

import PageTitle from '../PageTitle/PageTitle';
import MetaTags from '../MetaTags/MetaTags';
import { 
  CreditCard, 
  Lock, 
  Eye, 
  EyeOff, 
  MapPin, 
  Truck, 
  Shield, 
  CheckCircle,
  Plus,
  Edit,
  ArrowLeft,
  Package,
  Clock,
  AlertCircle
} from 'lucide-react';

const CheckoutPage = () => {
  const { cartItems, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const { addNotification } = useContext(NotificationContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userAddress, setUserAddress] = useState(null);
  const [deliveryOptions, setDeliveryOptions] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  
  // Form state
  const [selectedDelivery, setSelectedDelivery] = useState('STANDARD');
  const [selectedPayment, setSelectedPayment] = useState('CREDIT_CARD');
  const [addressForm, setAddressForm] = useState({
    address1: '',
    address2: '',
    phone: ''
  });
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [notes, setNotes] = useState('');

  // Kredi kartı form state
  const [creditCardForm, setCreditCardForm] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: ''
  });
  const [showCvv, setShowCvv] = useState(false);
  const [cardType, setCardType] = useState('');

  // Sepet toplamını hesapla
  const subtotal = cartItems.reduce((sum, item) => {
    const price = item.product?.isDiscountActive ? item.product.discountedPrice : item.product?.price || 0;
    return sum + price * item.quantity;
  }, 0);

  const deliveryFee = selectedDelivery === 'EXPRESS' ? 15 : 0;
  const total = subtotal + deliveryFee;

  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/cart');
      return;
    }

    loadUserAddress();
    loadDeliveryOptions();
    loadPaymentMethods();
  }, []);

  // Kart numarası maskeleme
  const maskCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  // Kart tipini belirle
  const detectCardType = (cardNumber) => {
    const number = cardNumber.replace(/\s/g, '');
    if (number.startsWith('4')) return 'visa';
    if (number.startsWith('5')) return 'mastercard';
    if (number.startsWith('34') || number.startsWith('37')) return 'amex';
    if (number.startsWith('6')) return 'discover';
    return '';
  };

  // Kart numarası değişikliği
  const handleCardNumberChange = (e) => {
    const value = e.target.value;
    const maskedValue = maskCardNumber(value);
    const detectedType = detectCardType(maskedValue);
    
    setCreditCardForm(prev => ({ ...prev, cardNumber: maskedValue }));
    setCardType(detectedType);
  };

  // Son kullanma tarihi formatı
  const formatExpiry = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const handleExpiryChange = (e) => {
    const value = e.target.value;
    const formattedValue = formatExpiry(value);
    setCreditCardForm(prev => ({ ...prev, expiryMonth: formattedValue }));
  };

  // CVV formatı
  const handleCvvChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    setCreditCardForm(prev => ({ ...prev, cvv: value }));
  };

  // Kart sahibi formatı
  const handleCardHolderChange = (e) => {
    const value = e.target.value.toUpperCase();
    setCreditCardForm(prev => ({ ...prev, cardHolder: value }));
  };

  // Form validasyonu
  const validateCreditCard = () => {
    const { cardNumber, cardHolder, expiryMonth, cvv } = creditCardForm;
    
    if (!cardNumber || cardNumber.replace(/\s/g, '').length < 13) {
      return 'Geçerli bir kart numarası giriniz';
    }
    
    if (!cardHolder || cardHolder.length < 3) {
      return 'Kart sahibi adını giriniz';
    }
    
    if (!expiryMonth || expiryMonth.length !== 5) {
      return 'Geçerli bir son kullanma tarihi giriniz';
    }
    
    const [month, year] = expiryMonth.split('/');
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100;
    const currentMonth = currentDate.getMonth() + 1;
    
    if (parseInt(month) < 1 || parseInt(month) > 12) {
      return 'Geçerli bir ay giriniz';
    }
    
    if (parseInt(year) < currentYear || (parseInt(year) === currentYear && parseInt(month) < currentMonth)) {
      return 'Kartınızın son kullanma tarihi geçmiş';
    }
    
    if (!cvv || cvv.length < 3) {
      return 'Geçerli bir güvenlik kodu giriniz';
    }
    
    return null;
  };

  const loadUserAddress = async () => {
    try {
      const response = await api.get('/checkout/address');
      if (response.data.success) {
        setUserAddress(response.data.address);
        if (response.data.address) {
          setAddressForm({
            address1: response.data.address.address1 || '',
            address2: response.data.address.address2 || '',
            phone: response.data.address.phone || ''
          });
        }
      }
    } catch (error) {
      console.error('Adres yüklenirken hata:', error);
    }
  };

  const loadDeliveryOptions = async () => {
    try {
      const response = await api.get('/checkout/delivery-options');
      if (response.data.success) {
        setDeliveryOptions(response.data.options);
      }
    } catch (error) {
      console.error('Teslimat seçenekleri yüklenirken hata:', error);
    }
  };

  const loadPaymentMethods = async () => {
    try {
      const response = await api.get('/checkout/payment-methods');
      if (response.data.success) {
        setPaymentMethods(response.data.methods);
      }
    } catch (error) {
      console.error('Ödeme yöntemleri yüklenirken hata:', error);
    }
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.put('/checkout/address', addressForm);
      if (response.data.success) {
        setUserAddress(addressForm);
        setShowAddressForm(false);
        setError('');
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      setError('Adres güncellenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = async () => {
    if (!userAddress && !showAddressForm) {
      setError('Lütfen teslimat adresi ekleyin');
      return;
    }

    if (showAddressForm && (!addressForm.address1 || !addressForm.phone)) {
      setError('Lütfen tüm zorunlu adres alanlarını doldurun');
      return;
    }

    if (selectedPayment === 'CREDIT_CARD') {
      const cardError = validateCreditCard();
      if (cardError) {
        setError(cardError);
        return;
      }
      
      addNotification({
        id: Date.now(),
        type: 'info',
        title: 'Bilgilendirme',
        message: 'Kredi kartı işlemimiz şuan aktif değil çok yakında hizmetinizde'
      });
      return;
    }

    setLoading(true);
    setError('');

    try {
      const orderItems = cartItems.map(item => {
        const price = item.product.isDiscountActive ? item.product.discountedPrice : item.product.price;
        return {
            productId: item.product.id,
            quantity: item.quantity,
            price: price.toString()
        };
      });

      const checkoutData = {
        items: orderItems,
        total: total.toString(),
        deliveryAddress: `${addressForm.address1}, ${addressForm.address2 || ''}`,
        deliveryMethod: selectedDelivery,
        paymentMethod: selectedPayment,
        notes: notes,
        creditCard: null
      };

      const response = await api.post('/checkout/complete', checkoutData);
      
      if (response.data.success) {
        await clearCart();
        navigate('/orders', { 
          state: { 
            message: 'Siparişiniz başarıyla oluşturuldu!',
            orderId: response.data.orderId 
          } 
        });
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      setError('Sipariş oluşturulurken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const getPaymentIcon = (method) => {
    switch (method.icon) {
      case 'credit-card':
        return '💳';
      case 'bank':
        return '🏦';
      case 'cash':
        return '💰';
      default:
        return '💳';
    }
  };



  if (cartItems.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen  from-slate-50 to-blue-50">
      <PageTitle title="Teslimat ve Ödeme" />
      <MetaTags 
        title="Teslimat ve Ödeme"
        description="Güvenli ödeme ile siparişinizi tamamlayın. Teslimat adresi ve ödeme yöntemi seçin."
        keywords="teslimat, ödeme, sipariş, adres, kredi kartı"
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button 
            onClick={() => navigate('/cart')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors duration-200"
          >
            <ArrowLeft size={20} className="mr-2" />
            Sepete Dön
          </button>
          
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
              <CreditCard className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Teslimat ve Ödeme</h1>
              <p className="text-gray-600 mt-1">Siparişinizi güvenle tamamlayın</p>
            </div>
          </div>
        </div>
        
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-center space-x-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <p className="text-red-700">{error}</p>
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sol taraf - Form alanları */}
          <div className="lg:col-span-2 space-y-6">
            {/* Teslimat Adresi */}
            <div className="bg-white/80 backdrop-blur-lg rounded-xl border border-gray-200/50 shadow-sm p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Teslimat Adresi</h3>
              </div>
              
              {!userAddress && !showAddressForm ? (
                <div className="text-center py-8">
                  <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">Henüz adres bilginiz bulunmuyor.</p>
                  <button 
                    className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-2 mx-auto"
                    onClick={() => setShowAddressForm(true)}
                  >
                    <Plus size={20} />
                    <span>Adres Ekle</span>
                  </button>
                </div>
              ) : userAddress && !showAddressForm ? (
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span className="font-semibold text-gray-900">Ev Adresi</span>
                      </div>
                      <p className="text-gray-700 mb-1">{userAddress.address1}</p>
                      {userAddress.address2 && <p className="text-gray-700 mb-1">{userAddress.address2}</p>}
                      <p className="text-gray-600">📞 {userAddress.phone}</p>
                    </div>
                    <button 
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                      onClick={() => setShowAddressForm(true)}
                    >
                      <Edit size={18} />
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleAddressSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Adres Satırı 1 *</label>
                    <input
                      type="text"
                      value={addressForm.address1}
                      onChange={(e) => setAddressForm({...addressForm, address1: e.target.value})}
                      placeholder="Sokak, cadde, mahalle"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Adres Satırı 2</label>
                    <input
                      type="text"
                      value={addressForm.address2}
                      onChange={(e) => setAddressForm({...addressForm, address2: e.target.value})}
                      placeholder="Apartman, kat, daire no"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Telefon *</label>
                    <input
                      type="tel"
                      value={addressForm.phone}
                      onChange={(e) => setAddressForm({...addressForm, phone: e.target.value})}
                      placeholder="0555 123 45 67"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                      required
                    />
                  </div>
                  
                  <div className="flex items-center space-x-3 pt-4">
                    <button 
                      type="submit" 
                      className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-2 disabled:opacity-50"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          <span>Kaydediliyor...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle size={20} />
                          <span>Adresi Kaydet</span>
                        </>
                      )}
                    </button>
                    {userAddress && (
                      <button 
                        type="button" 
                        className="px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-semibold transition-colors duration-200"
                        onClick={() => setShowAddressForm(false)}
                      >
                        İptal
                      </button>
                    )}
                  </div>
                </form>
              )}
            </div>

            {/* Teslimat Seçenekleri */}
            <div className="bg-white/80 backdrop-blur-lg rounded-xl border border-gray-200/50 shadow-sm p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Truck className="w-5 h-5 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Teslimat Seçenekleri</h3>
              </div>
              
              <div className="space-y-3">
                {deliveryOptions.map((option) => (
                  <div 
                    key={option.id}
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                      selectedDelivery === option.id 
                        ? 'border-orange-500 bg-orange-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedDelivery(option.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <input
                          type="radio"
                          name="delivery"
                          value={option.id}
                          checked={selectedDelivery === option.id}
                          onChange={() => setSelectedDelivery(option.id)}
                          className="w-4 h-4 text-orange-600 focus:ring-orange-500"
                        />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="font-semibold text-gray-900">{option.name}</h4>
                            <div className="flex items-center space-x-1 text-sm text-gray-500">
                              <Clock size={14} />
                              <span>{option.estimatedDays}</span>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600">{option.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-semibold text-gray-900">
                          {option.price > 0 ? `${option.price.toFixed(2)} ₺` : 'Ücretsiz'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Ödeme Yöntemi */}
            <div className="bg-white/80 backdrop-blur-lg rounded-xl border border-gray-200/50 shadow-sm p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Ödeme Yöntemi</h3>
              </div>
              
              <div className="space-y-3">
                {paymentMethods.map((method) => (
                  <div 
                    key={method.id}
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                      selectedPayment === method.id 
                        ? 'border-orange-500 bg-orange-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedPayment(method.id)}
                  >
                    <div className="flex items-center space-x-4">
                      <input
                        type="radio"
                        name="payment"
                        value={method.id}
                        checked={selectedPayment === method.id}
                        onChange={() => setSelectedPayment(method.id)}
                        className="w-4 h-4 text-orange-600 focus:ring-orange-500"
                      />
                      <div className="text-2xl">{getPaymentIcon(method)}</div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{method.name}</h4>
                        <p className="text-sm text-gray-600">{method.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Kredi Kartı Bilgileri */}
            {selectedPayment === 'CREDIT_CARD' && (
              <div className="bg-white/80  rounded-xl border border-gray-200/50 shadow-sm p-6 relative">
                

                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Shield className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Kredi Kartı Bilgileri</h3>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Kart Numarası *</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <div className="text-gray-400">
                          {cardType ? '💳' : <CreditCard size={20} />}
                        </div>
                      </div>
                      <input
                        type="text"
                        value={creditCardForm.cardNumber}
                        onChange={handleCardNumberChange}
                        placeholder="1234 5678 9012 3456"
                        maxLength="19"
                        className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                        
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Kart Sahibi *</label>
                    <input
                      type="text"
                      value={creditCardForm.cardHolder}
                      onChange={handleCardHolderChange}
                      placeholder="AD SOYAD"
                      maxLength="50"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                      
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Son Kullanma Tarihi *</label>
                      <input
                        type="text"
                        value={creditCardForm.expiryMonth}
                        onChange={handleExpiryChange}
                        placeholder="AA/YY"
                        maxLength="5"
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                        
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Güvenlik Kodu *</label>
                      <div className="relative">
                        <input
                          type={showCvv ? "text" : "password"}
                          value={creditCardForm.cvv}
                          onChange={handleCvvChange}
                          placeholder="123"
                          maxLength="4"
                          className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                          
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          onClick={() => setShowCvv(!showCvv)}
                          
                        >
                          {showCvv ? <EyeOff size={16} className="text-gray-400" /> : <Eye size={16} className="text-gray-400" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center space-x-2">
                    <Lock size={16} className="text-green-600" />
                    <span className="text-sm text-green-700">Kart bilgileriniz SSL ile şifrelenerek güvenle işlenir</span>
                  </div>
                </div>
              </div>
            )}

            {/* Notlar */}
            <div className="bg-white/80 backdrop-blur-lg rounded-xl border border-gray-200/50 shadow-sm p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Package className="w-5 h-5 text-yellow-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Sipariş Notları (Opsiyonel)</h3>
              </div>
              
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Teslimat ile ilgili özel notlarınızı buraya yazabilirsiniz..."
                rows="3"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 resize-none"
              />
            </div>
          </div>

          {/* Sağ taraf - Sipariş özeti */}
          <div className="lg:col-span-1">
            <div className="bg-white/80 backdrop-blur-lg rounded-xl border border-gray-200/50 shadow-sm p-6 sticky top-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Sipariş Özeti</h3>
              
              <div className="space-y-4 mb-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center space-x-3">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                      <img 
                        src={item.product.imageUrl1 || item.product.imageUrl || '/img/default-product.png'} 
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = '/img/default-product.png';
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 text-sm line-clamp-2">{item.product.name}</h4>
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-sm text-gray-600">
                          {(item.product.isDiscountActive ? item.product.discountedPrice : item.product.price).toFixed(2)} ₺
                        </p>
                        <p className="text-sm text-gray-500">× {item.quantity}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900 text-sm">
                        {((item.product.isDiscountActive ? item.product.discountedPrice : item.product.price) * item.quantity).toFixed(2)} ₺
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Ara Toplam:</span>
                  <span className="font-medium text-gray-900">{subtotal.toFixed(2)} ₺</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Teslimat Ücreti:</span>
                  <span className="font-medium text-gray-900">{deliveryFee.toFixed(2)} ₺</span>
                </div>
                <div className="flex justify-between items-center text-lg font-bold text-gray-900 pt-3 border-t border-gray-200">
                  <span>Toplam:</span>
                  <span>{total.toFixed(2)} ₺</span>
                </div>
              </div>

              <button 
                className="w-full mt-6 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleCheckout}
                disabled={loading || (!userAddress && !showAddressForm)}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Sipariş Oluşturuluyor...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle size={20} />
                    <span>Siparişi Tamamla</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;

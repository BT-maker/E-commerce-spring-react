import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CartContext } from '../../context/CartContext';
import { AuthContext } from '../../context/AuthContext';
import api from '../../services/api';
import './CheckoutPage.css';
import PageTitle from '../PageTitle/PageTitle';
import MetaTags from '../MetaTags/MetaTags';
import { CreditCard, Lock, Eye, EyeOff } from 'lucide-react';

const CheckoutPage = () => {
  const { cartItems, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
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

    // Adres formu açıksa ve henüz kaydedilmemişse
    if (showAddressForm && (!addressForm.address1 || !addressForm.phone)) {
      setError('Lütfen tüm zorunlu adres alanlarını doldurun');
      return;
    }

    // Kredi kartı seçiliyse validasyon yap
    if (selectedPayment === 'CREDIT_CARD') {
      const cardError = validateCreditCard();
      if (cardError) {
        setError(cardError);
        return;
      }
    }

    setLoading(true);
    setError('');

    try {
      const orderItems = cartItems.map(item => ({
        productId: item.product.id,
        quantity: item.quantity,
        price: item.product.isDiscountActive ? item.product.discountedPrice : item.product.price
      }));

      const checkoutData = {
        items: orderItems,
        total: total,
        deliveryAddress: `${addressForm.address1}, ${addressForm.address2 || ''}`,
        deliveryMethod: selectedDelivery,
        paymentMethod: selectedPayment,
        notes: notes,
        ...(selectedPayment === 'CREDIT_CARD' && {
          creditCard: {
            cardNumber: creditCardForm.cardNumber.replace(/\s/g, ''),
            cardHolder: creditCardForm.cardHolder,
            expiryMonth: creditCardForm.expiryMonth,
            cvv: creditCardForm.cvv
          }
        })
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
    <div className="checkout-page">
      <PageTitle title="Teslimat ve Ödeme" />
      <MetaTags 
        title="Teslimat ve Ödeme"
        description="Güvenli ödeme ile siparişinizi tamamlayın. Teslimat adresi ve ödeme yöntemi seçin."
        keywords="teslimat, ödeme, sipariş, adres, kredi kartı"
      />
      
      <div className="checkout-container">
        <h1 className="checkout-title">Teslimat ve Ödeme</h1>
        
        {error && <div className="error-message">{error}</div>}
        
        <div className="checkout-content">
          {/* Sol taraf - Form alanları */}
          <div className="checkout-form">
            {/* Teslimat Adresi */}
            <div className="form-section">
              <h3 className="section-title">Teslimat Adresi</h3>
              
              {!userAddress && !showAddressForm ? (
                <div className="address-empty">
                  <p>Henüz adres bilginiz bulunmuyor.</p>
                  <button 
                    className="add-address-btn"
                    onClick={() => setShowAddressForm(true)}
                  >
                    Adres Ekle
                  </button>
                </div>
              ) : userAddress && !showAddressForm ? (
                <div className="address-display">
                  <div className="address-info">
                    <p><strong>Ev</strong></p>
                    <p>{userAddress.address1}</p>
                    {userAddress.address2 && <p>{userAddress.address2}</p>}
                    <p>📞 {userAddress.phone}</p>
                  </div>
                  <button 
                    className="edit-address-btn"
                    onClick={() => setShowAddressForm(true)}
                  >
                    Adresi Düzenle
                  </button>
                </div>
              ) : (
                <form onSubmit={handleAddressSubmit} className="address-form">
                  <div className="form-group">
                    <label>Adres Satırı 1 *</label>
                    <input
                      type="text"
                      value={addressForm.address1}
                      onChange={(e) => setAddressForm({...addressForm, address1: e.target.value})}
                      placeholder="Sokak, cadde, mahalle"
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Adres Satırı 2</label>
                    <input
                      type="text"
                      value={addressForm.address2}
                      onChange={(e) => setAddressForm({...addressForm, address2: e.target.value})}
                      placeholder="Apartman, kat, daire no"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Telefon *</label>
                    <input
                      type="tel"
                      value={addressForm.phone}
                      onChange={(e) => setAddressForm({...addressForm, phone: e.target.value})}
                      placeholder="0555 123 45 67"
                      required
                    />
                  </div>
                  
                  <div className="form-actions">
                    <button type="submit" className="save-address-btn" disabled={loading}>
                      {loading ? 'Kaydediliyor...' : 'Adresi Kaydet'}
                    </button>
                    {userAddress && (
                      <button 
                        type="button" 
                        className="cancel-btn"
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
            <div className="form-section">
              <h3 className="section-title">Teslimat Seçenekleri</h3>
              <div className="delivery-options">
                {deliveryOptions.map((option) => (
                  <div 
                    key={option.id}
                    className={`delivery-option ${selectedDelivery === option.id ? 'selected' : ''}`}
                    onClick={() => setSelectedDelivery(option.id)}
                  >
                    <div className="option-content">
                      <div className="option-header">
                        <input
                          type="radio"
                          name="delivery"
                          value={option.id}
                          checked={selectedDelivery === option.id}
                          onChange={() => setSelectedDelivery(option.id)}
                        />
                        <div className="option-info">
                          <h4>{option.name}</h4>
                          <p>{option.description}</p>
                          <span className="delivery-time">{option.estimatedDays}</span>
                        </div>
                      </div>
                      <div className="option-price">
                        {option.price > 0 ? `${option.price.toFixed(2)} ₺` : 'Ücretsiz'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Ödeme Yöntemi */}
            <div className="form-section">
              <h3 className="section-title">Ödeme Yöntemi</h3>
              <div className="payment-methods">
                {paymentMethods.map((method) => (
                  <div 
                    key={method.id}
                    className={`payment-method ${selectedPayment === method.id ? 'selected' : ''}`}
                    onClick={() => setSelectedPayment(method.id)}
                  >
                    <div className="method-content">
                      <div className="method-icon">{getPaymentIcon(method)}</div>
                      <div className="method-info">
                        <h4>{method.name}</h4>
                        <p>{method.description}</p>
                      </div>
                      <input
                        type="radio"
                        name="payment"
                        value={method.id}
                        checked={selectedPayment === method.id}
                        onChange={() => setSelectedPayment(method.id)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Kredi Kartı Bilgileri */}
            {selectedPayment === 'CREDIT_CARD' && (
              <div className="form-section">
                <h3 className="section-title">
                  <CreditCard size={20} className="section-icon" />
                  Kredi Kartı Bilgileri
                </h3>
                <div className="credit-card-form">
                                     <div className="form-group">
                     <label>Kart Numarası *</label>
                     <div className="card-input-wrapper">
                       <div className={`card-type-icon ${cardType}`}>
                         {cardType ? '💳' : <CreditCard size={20} />}
                       </div>
                       <input
                         type="text"
                         value={creditCardForm.cardNumber}
                         onChange={handleCardNumberChange}
                         placeholder="1234 5678 9012 3456"
                         maxLength="19"
                         className="card-number-input"
                       />
                     </div>
                   </div>

                  <div className="form-group">
                    <label>Kart Sahibi *</label>
                    <input
                      type="text"
                      value={creditCardForm.cardHolder}
                      onChange={handleCardHolderChange}
                      placeholder="AD SOYAD"
                      maxLength="50"
                    />
                  </div>

                  <div className="card-details-row">
                    <div className="form-group">
                      <label>Son Kullanma Tarihi *</label>
                      <input
                        type="text"
                        value={creditCardForm.expiryMonth}
                        onChange={handleExpiryChange}
                        placeholder="AA/YY"
                        maxLength="5"
                        className="expiry-input"
                      />
                    </div>

                    <div className="form-group">
                      <label>
                        Güvenlik Kodu *
                      </label>
                      <div className="cvv-input-wrapper">
                        <input
                          type={showCvv ? "text" : "password"}
                          value={creditCardForm.cvv}
                          onChange={handleCvvChange}
                          placeholder="123"
                          maxLength="4"
                          className="cvv-input"
                        />
                        <button
                          type="button"
                          className="toggle-cvv-btn"
                          onClick={() => setShowCvv(!showCvv)}
                        >
                          {showCvv ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="security-notice">
                    <Lock size={14} />
                    <span>Kart bilgileriniz SSL ile şifrelenerek güvenle işlenir</span>
                  </div>
                </div>
              </div>
            )}

            {/* Notlar */}
            <div className="form-section">
              <h3 className="section-title">Sipariş Notları (Opsiyonel)</h3>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Teslimat ile ilgili özel notlarınızı buraya yazabilirsiniz..."
                rows="3"
                className="notes-textarea"
              />
            </div>
          </div>

          {/* Sağ taraf - Sipariş özeti */}
          <div className="checkout-summary">
            <h3 className="summary-title">Sipariş Özeti</h3>
            
            <div className="order-items">
              {cartItems.map((item) => (
                <div key={item.id} className="order-item">
                  <div className="item-image">
                    <img 
                      src={item.product.imageUrl1 || item.product.imageUrl || '/img/default-product.png'} 
                      alt={item.product.name}
                      onError={(e) => {
                        e.target.src = '/img/default-product.png';
                      }}
                    />
                  </div>
                  <div className="item-details">
                    <h4 className="item-name">{item.product.name}</h4>
                    <div className="item-info">
                      <p className="item-price">
                        {(item.product.isDiscountActive ? item.product.discountedPrice : item.product.price).toFixed(2)} ₺
                      </p>
                      <p className="item-quantity">Adet: {item.quantity}</p>
                    </div>
                  </div>
                  <div className="item-total">
                    {((item.product.isDiscountActive ? item.product.discountedPrice : item.product.price) * item.quantity).toFixed(2)} ₺
                  </div>
                </div>
              ))}
            </div>

            <div className="order-totals">
              <div className="total-row">
                <span>Ara Toplam:</span>
                <span>{subtotal.toFixed(2)} ₺</span>
              </div>
              <div className="total-row">
                <span>Teslimat Ücreti:</span>
                <span>{deliveryFee.toFixed(2)} ₺</span>
              </div>
              <div className="total-row final-total">
                <span>Toplam:</span>
                <span>{total.toFixed(2)} ₺</span>
              </div>
            </div>

            <button 
              className="complete-order-btn"
              onClick={handleCheckout}
              disabled={loading || (!userAddress && !showAddressForm)}
            >
              {loading ? 'Sipariş Oluşturuluyor...' : 'Siparişi Tamamla'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;

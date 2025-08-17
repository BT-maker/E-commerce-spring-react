import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CartContext } from '../../context/CartContext';
import { AuthContext } from '../../context/AuthContext';
import api from '../../services/api';
import './CheckoutPage.css';
import PageTitle from '../PageTitle/PageTitle';
import MetaTags from '../MetaTags/MetaTags';

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
        notes: notes
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
        keywords="teslimat, ödeme, sipariş, adres"
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
                    <img src={item.product.imageUrl || '/images/default-product.jpg'} alt={item.product.name} />
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

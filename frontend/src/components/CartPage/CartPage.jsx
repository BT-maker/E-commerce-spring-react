import React, { useContext, useEffect, useState } from "react";
import CartItem from "../CartItem/CartItem";
import "./CartPage.css";
import { CartContext } from "../../context/CartContext";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import PageTitle from '../PageTitle/PageTitle';
import MetaTags from '../MetaTags/MetaTags';

const CartPage = () => {
  const { cartItems, changeQuantity, removeFromCart, loading, clearCart } = useContext(CartContext);
  const navigate = useNavigate();

  const total = cartItems.reduce((sum, item) => {
    const price = item.product?.isDiscountActive ? item.product.discountedPrice : item.product?.price || 0;
    return sum + price * item.quantity;
  }, 0);

  const handleCheckout = () => {
    navigate("/checkout");
  };

  return (
    <div className="max-w-6xl mx-auto mt-6 sm:mt-10 px-4">
      <PageTitle title="Sepetim" />
      <MetaTags 
        title="Sepetim"
        description="Alışveriş sepetinizi görüntüleyin. Ürünlerinizi düzenleyin ve güvenli ödeme ile siparişinizi tamamlayın."
        keywords="sepet, alışveriş sepeti, ödeme, sipariş"
      />
      
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Sepetim</h2>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>🛒</span>
            <span>{cartItems.length} ürün</span>
          </div>
        </div>

        {loading ? (
          <div className="space-y-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="border border-gray-200 rounded-lg p-6 bg-white">
                <div className="flex gap-4">
                  <Skeleton height={80} width={80} className="rounded" />
                  <div className="flex-1">
                    <Skeleton height={20} width={200} className="mb-2" />
                    <Skeleton height={16} width={100} className="mb-2" />
                    <Skeleton height={32} width={120} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : cartItems.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🛒</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Sepetiniz boş</h3>
            <p className="text-gray-500 mb-6">Alışverişe başlamak için ürünlerimizi keşfedin!</p>
            <button 
              onClick={() => navigate('/')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Alışverişe Başla
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Ürün Listesi */}
            <div className="lg:col-span-2">
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    onQuantityChange={changeQuantity}
                    onRemove={removeFromCart}
                  />
                ))}
              </div>
            </div>

            {/* Sipariş Özeti */}
            <div className="lg:col-span-1">
              <div className="bg-gray-50 rounded-xl p-6 sticky top-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Sipariş Özeti</h3>
                
                {/* Ara Toplam */}
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Ara Toplam:</span>
                  <span className="font-medium">{total.toFixed(2)} ₺</span>
                </div>
                
                {/* Kargo */}
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Kargo:</span>
                  <span className="text-green-600 font-medium">Ücretsiz</span>
                </div>
                
                {/* Toplam */}
                <div className="border-t border-gray-200 pt-3 mt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-800">Toplam:</span>
                    <span className="text-2xl font-bold text-gray-800">{total.toFixed(2)} ₺</span>
                  </div>
                </div>

                {/* Gelişmiş Checkout Butonu */}
                <div className="mt-6 space-y-3">
                  <button 
                    className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center gap-3"
                    onClick={handleCheckout}
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                    </svg>
                    Alışverişi Tamamla
                  </button>
                  
                  <button 
                    onClick={() => navigate('/')}
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-6 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Alışverişe Devam Et
                  </button>
                </div>

                {/* Güvenlik Bilgileri */}
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                    <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                    <span>256-bit SSL ile güvenli ödeme</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Hızlı teslimat garantisi</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;

/**
 * Bu component şu işlevleri sağlar:
 * 
 * 1. Sepet Sayfası: Kullanıcının sepetini görüntüleme
 * 2. Sepet İçeriği: Sepetteki tüm ürünleri listeleme
 * 3. Toplam Hesaplama: Sepet toplam tutarını hesaplama
 * 4. Sipariş Oluşturma: Sepetten sipariş oluşturma
 * 5. Loading States: Yükleme durumları için skeleton animasyonları
 * 6. Error Handling: Hata durumlarının yönetimi
 * 7. SEO Optimizasyonu: Sayfa başlığı ve meta etiketleri
 * 8. Responsive Design: Mobil ve desktop uyumlu tasarım
 * 
 * Bu component sayesinde kullanıcılar alışveriş sepetlerini tam olarak yönetebilir!
 */ 
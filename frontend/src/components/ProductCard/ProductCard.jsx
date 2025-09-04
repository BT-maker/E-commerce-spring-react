import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { Heart, Eye, ShoppingCart, Star, X, Trash2 } from 'lucide-react';
import { useFavorites } from '../../context/FavoritesContext';

const ProductCard = ({ product, loading, onAddToCart, isFavoritesPage = false }) => {
  const isMounted = useRef(false);
  const { isFavorite, addToFavorites, removeFromFavorites } = useFavorites();
  const [reviewStats, setReviewStats] = useState({ averageRating: 0, reviewCount: 0 });

  // Debug bilgileri
  console.log('ProductCard render - product:', product);
  console.log('ProductCard render - product.id:', product?.id);
  console.log('ProductCard render - product.name:', product?.name);

  useEffect(() => {
    isMounted.current = true;
    return () => { isMounted.current = false; };
  }, []);

  // Review istatistiklerini getir - Şimdilik devre dışı
  useEffect(() => {
    if (!product?.id) return;
    
    // Review stats API'si 403 hatası verdiği için şimdilik devre dışı
    // Bu özellik daha sonra aktif edilebilir
    /*
    fetch(`http://localhost:8082/api/reviews/product/${product.id}/stats`)
      .then(res => {
        if (res.ok) {
          return res.json();
        } else {
          throw new Error('Review stats alınamadı');
        }
      })
      .then(data => {
        if (isMounted.current) {
          setReviewStats(data);
        }
      })
      .catch((error) => {
        console.log('Review stats hatası (göz ardı edildi):', error.message);
        // Hata durumunda varsayılan değerler kullanılır
      });
    */
  }, [product]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
        <Skeleton height={200} className="mb-2" />
        <Skeleton height={20} width={150} className="mb-2" />
        <Skeleton height={16} width={80} className="mb-2" />
        <Skeleton height={40} width={120} />
      </div>
    );
  }

  const [added, setAdded] = useState(false);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [showQuickView, setShowQuickView] = useState(false);

  const onAdd = async () => {
    if (!onAddToCart) return;
    setLoadingBtn(true);
    try {
      await onAddToCart(product.id);
      if (isMounted.current) {
        setAdded(true);
        setTimeout(() => {
          if (isMounted.current) setAdded(false);
        }, 900);
      }
    } finally {
      if (isMounted.current) setLoadingBtn(false);
    }
  };

  const handleFavorite = async () => {
    try {
      if (isFavorite(product.id)) {
        await removeFromFavorites(product.id);
      } else {
        await addToFavorites(product.id);
      }
    } catch (error) {
      console.error('Favori işlemi hatası:', error);
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />);
    }
    
    const emptyStars = 5 - fullStars;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="w-3 h-3 text-gray-300" />);
    }
    
    return stars;
  };

  const handleCardClick = (e) => {
    // Eğer tıklanan element bir buton veya link ise, kart tıklamasını engelle
    if (e.target.closest('button') || e.target.closest('a')) {
      return;
    }
    // Ürün detay sayfasına git
    window.location.href = `/product/${product.id}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-1" onClick={handleCardClick} style={{ cursor: 'pointer' }}>
      <div className="relative">
        <img 
          src={product.imageUrl1 || product.imageUrl || '/img/default-product.png'} 
          alt={product.name} 
          className="w-full h-64 object-contain rounded-lg mb-4"
          onError={(e) => {
            e.target.src = '/img/default-product.png';
          }}
        />
        
        {/* İndirim Badge */}
        {product.isDiscountActive && (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            %{product.discountPercentage} İndirim
          </div>
        )}
        
        {/* Quick Actions */}
        <div className="absolute top-2 left-2 flex flex-col gap-2">
          {isFavoritesPage ? (
            // Favoriler sayfası için özel buton
            <button
              onClick={handleFavorite}
              className="bg-white hover:bg-red-50 p-2 rounded-full shadow-md transition-colors duration-200"
              title="Favorilerden çıkar"
            >
              <X className="w-4 h-4 text-red-500" />
            </button>
          ) : (
            // Normal sayfa için standart buton
            <button
              onClick={handleFavorite}
              className={`bg-white hover:bg-red-50 p-2 rounded-full shadow-md transition-colors duration-200 ${
                isFavorite(product.id) ? 'text-red-500' : 'text-gray-400'
              }`}
              title={isFavorite(product.id) ? 'Favorilerden çıkar' : 'Favorilere ekle'}
            >
              <Heart className="w-4 h-4" />
            </button>
          )}
          <Link to={`/product/${product.id}`} className="bg-white hover:bg-blue-50 p-2 rounded-full shadow-md transition-colors duration-200 text-gray-400 hover:text-blue-500" title="Hızlı görüntüle">
            <Eye className="w-4 h-4" />
          </Link>
        </div>
      </div>

      <div>
        <Link to={`/product/${product.id}`} className="text-gray-900 font-semibold text-lg mb-2 hover:text-orange-500 transition-colors block">
          {product.name}
        </Link>
        
        {/* Puanlama - Şimdilik devre dışı */}
        {/* 
        {reviewStats.reviewCount > 0 && (
          <div className="flex items-center gap-1 mb-2">
            <div className="flex items-center gap-1">
              {renderStars(reviewStats.averageRating)}
            </div>
            <span className="text-xs text-gray-500">
              ({reviewStats.reviewCount})
            </span>
          </div>
        )}
        */}
        
        <div className="mb-3">
          {product.isDiscountActive ? (
            <div className="flex items-center gap-2">
              <span className="text-gray-500 line-through text-sm">{Number(product.price).toLocaleString("tr-TR", {minimumFractionDigits:2})} ₺</span>
              <span className="text-orange-500 font-bold text-xl">{Number(product.discountedPrice).toLocaleString("tr-TR", {minimumFractionDigits:2})} ₺</span>
            </div>
          ) : (
            <span className="text-orange-500 font-bold text-xl">{Number(product.price).toLocaleString("tr-TR", {minimumFractionDigits:2})} ₺</span>
          )}
        </div>
        
        <div className="mb-3">
          {product.stock > 0 ? (
            product.stock <= 5 ? (
              <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">Kritik: {product.stock} adet</span>
            ) : product.stock <= 10 ? (
              <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">Düşük: {product.stock} adet</span>
            ) : (
              <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">Stokta var</span>
            )
          ) : (
            <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">Stokta yok</span>
          )}
        </div>
        
        <button
          className={`w-full font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 ${
            added 
              ? 'bg-green-500 text-white' 
              : product.stock <= 0 
                ? 'bg-gray-400 text-white cursor-not-allowed' 
                : 'bg-orange-500 hover:bg-orange-600 text-white'
          }`}
          onClick={onAdd}
          disabled={added || loadingBtn || product.stock <= 0}
        >
          {added ? (
            <>
              <ShoppingCart className="w-4 h-4" />
              Eklendi!
            </>
          ) : loadingBtn ? (
            "Ekleniyor..."
          ) : product.stock <= 0 ? (
            "Gelince Haber Ver"
          ) : (
            <>
              <ShoppingCart className="w-4 h-4" />
              Sepete Ekle
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;

/**
 * Bu component şu işlevleri sağlar:
 * 
 * 1. Ürün Kartı: Ürün bilgilerini görsel kart formatında gösterme
 * 2. Ürün Detayları: Ürün adı, fiyatı, stok durumu ve görseli
 * 3. Sepete Ekleme: Ürünü sepete ekleme fonksiyonu
 * 4. Favori Toggle: Ürünü favorilere ekleme/çıkarma
 * 5. Quick View: Ürün detay sayfasına hızlı erişim
 * 6. Review Sistemi: Ürün puanlama ve yorum sayısı
 * 7. Stok Durumu: Stok bilgisi ve uyarıları
 * 8. Loading States: Yükleme durumları için skeleton animasyonları
 * 
 * Bu component sayesinde ürünler çekici ve kullanıcı dostu kartlar halinde görüntülenir!
 */
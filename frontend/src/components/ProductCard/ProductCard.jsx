import React, { useState, useRef, useEffect } from "react";
import "./ProductCard.css";
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
    fetch(`http://localhost:8080/api/reviews/product/${product.id}/stats`)
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
      <div className="product-card">
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

  return (
    <div className="product-card">
      <div className="product-image-container">
        <img src={product.imageUrl} alt={product.name} className="product-card-img" />
        
        {/* İndirim Badge */}
        {product.isDiscountActive && (
          <div className="discount-badge-image">%{product.discountPercentage} İndirim</div>
        )}
        
        {/* Stok Badge */}
        {product.stock <= 0 && (
          <div className="stock-badge out-of-stock">Stokta Yok</div>
        )}
        {product.stock > 0 && product.stock <= 5 && (
          <div className="stock-badge low-stock">Son {product.stock} Adet</div>
        )}
        
        {/* Quick Actions */}
        <div className="quick-actions">
          {isFavoritesPage ? (
            // Favoriler sayfası için özel buton
            <button
              onClick={handleFavorite}
              className="quick-action-btn favorites-remove-btn"
              title="Favorilerden çıkar"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            // Normal sayfa için standart buton
            <button
              onClick={handleFavorite}
              className={`quick-action-btn ${isFavorite(product.id) ? 'active' : ''}`}
              title={isFavorite(product.id) ? 'Favorilerden çıkar' : 'Favorilere ekle'}
            >
              <Heart className="w-4 h-4" />
            </button>
          )}
          <Link to={`/product/${product.id}`} className="quick-action-btn" title="Hızlı görüntüle">
            <Eye className="w-4 h-4" />
          </Link>
        </div>
      </div>

      <div className="product-info">
        <Link to={`/product/${product.id}`} className="product-title">
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
        
        <div className="price-container">
          {product.isDiscountActive ? (
            <div className="discount-price-container">
              <span className="original-price">{Number(product.price).toLocaleString("tr-TR", {minimumFractionDigits:2})} ₺</span>
              <span className="discounted-price">{Number(product.discountedPrice).toLocaleString("tr-TR", {minimumFractionDigits:2})} ₺</span>
            </div>
          ) : (
            <span className="current-price">{Number(product.price).toLocaleString("tr-TR", {minimumFractionDigits:2})} ₺</span>
          )}
        </div>
        
        <div className="stock-info">
          {product.stock > 0 ? (
            product.stock <= 9 ? (
              <span className="stock-low">Son {product.stock} adet</span>
            ) : (
              <span className="stock-available">Stokta var</span>
            )
          ) : (
            <span className="stock-unavailable">Stokta yok</span>
          )}
        </div>
        
        <button
          className={`product-card-btn ${added ? 'added' : ''} ${product.stock <= 0 ? 'disabled' : ''}`}
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
            "Stokta Yok"
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
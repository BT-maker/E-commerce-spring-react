import React, { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { CartContext } from "../../context/CartContext";
import { AuthContext } from "../../context/AuthContext";
import "./ProductDetail.css";
import toast from 'react-hot-toast';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { 
  Heart, 
  Star, 
  ShoppingCart, 
  Truck, 
  Shield, 
  RotateCcw, 
  CheckCircle,
  XCircle,
  StarHalf,
  ChevronRight,
  Share2,
  Eye,
  Package,
  Zap,
  Clock,
  MapPin,
  Phone,
  Mail,
  ArrowRight,
  Minus,
  Plus
} from 'lucide-react';
import { useFavorites } from '../../context/FavoritesContext';
import PageTitle from '../PageTitle/PageTitle';
import MetaTags from '../MetaTags/MetaTags';
import SocialShare from '../SocialShare/SocialShare';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [added, setAdded] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState('description');
  const { addToCart } = useContext(CartContext);
  const { isLoggedIn } = useContext(AuthContext);
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  
  // Review state'leri
  const [reviews, setReviews] = useState([]);
  const [reviewStats, setReviewStats] = useState({ averageRating: 0, reviewCount: 0 });
  const [userReview, setUserReview] = useState(null);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewsLoading, setReviewsLoading] = useState(false);

  // Ürün önerileri state'leri
  const [recommendations, setRecommendations] = useState([]);
  const [recommendationsLoading, setRecommendationsLoading] = useState(false);

  // Ürün görselleri (örnek)
  const productImages = [
    product?.imageUrl || '/img/no-image.png',
    product?.imageUrl || '/img/no-image.png',
    product?.imageUrl || '/img/no-image.png',
    product?.imageUrl || '/img/no-image.png'
  ];

  useEffect(() => {
    fetch(`http://localhost:8082/api/products/${id}`)
      .then(res => {
        if (!res.ok) {
          if (res.status === 400) {
            throw new Error("Geçersiz ürün ID'si");
          } else if (res.status === 404) {
            throw new Error("Ürün bulunamadı");
          } else {
            throw new Error("Ürün yüklenirken bir hata oluştu");
          }
        }
        return res.json();
      })
      .then(data => {
        console.log("Ürün verisi:", data);
        console.log("Store ID:", data.storeId);
        console.log("Store Name:", data.storeName);
        setProduct(data);
        // Stok durumuna göre quantity'yi ayarla
        if (data.stock > 0 && data.stock < quantity) {
          setQuantity(data.stock);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Ürün yükleme hatası:", err);
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  // Ürün önerilerini getir
  useEffect(() => {
    if (product && product.category?.id) {
      setRecommendationsLoading(true);
      console.log('Öneriler için kategori ID:', product.category.id);
      console.log('Mevcut ürün ID:', product.id);
      console.log('Ürün objesi:', product);
      
      fetch(`http://localhost:8082/api/products?categoryId=${product.category.id}&page=0&size=8`)
        .then(res => {
          console.log('API yanıt durumu:', res.status);
          if (!res.ok) {
            throw new Error(`HTTP ${res.status}`);
          }
          return res.json();
        })
        .then(data => {
          console.log('Öneriler API yanıtı:', data);
          console.log('API yanıtı content:', data.content);
          console.log('Toplam ürün sayısı:', data.content?.length || 0);
          
          // Mevcut ürünü hariç tut
          const filteredProducts = data.content?.filter(p => p.id !== product.id) || [];
          console.log('Filtrelenmiş öneriler:', filteredProducts);
          console.log('Filtrelenmiş ürün sayısı:', filteredProducts.length);
          
          setRecommendations(filteredProducts.slice(0, 6)); // En fazla 6 öneri
          setRecommendationsLoading(false);
        })
        .catch(err => {
          console.error('Öneriler yüklenirken hata:', err);
          setRecommendationsLoading(false);
        });
    } else {
      console.log('Ürün veya kategori ID yok:', { product, category: product?.category });
    }
  }, [product]);

  // Review'ları ve istatistikleri getir
  useEffect(() => {
    if (!product) return;
    
    setReviewsLoading(true);
    Promise.all([
      fetch(`http://localhost:8082/api/reviews/product/${product.id}`)
        .then(res => {
          if (!res.ok) {
            throw new Error(`Reviews API Error: ${res.status}`);
          }
          return res.json();
        }),
      fetch(`http://localhost:8082/api/reviews/product/${product.id}/stats`)
        .then(res => {
          if (!res.ok) {
            throw new Error(`Stats API Error: ${res.status}`);
          }
          return res.json();
        })
    ])
      .then(([reviewsData, statsData]) => {
        setReviews(reviewsData);
        setReviewStats(statsData);
        setReviewsLoading(false);
      })
      .catch((error) => {
        console.error('Review API Error:', error);
        setReviewsLoading(false);
      });
  }, [product]);

  // Kullanıcının review'ını getir
  useEffect(() => {
    if (!product || !isLoggedIn) return;
    
    fetch(`http://localhost:8082/api/reviews/product/${product.id}/user`, {
      credentials: "include"
    })
      .then(res => {
        if (res.ok) return res.json();
        if (res.status === 404) {
          console.log('Kullanıcının bu ürün için review\'ı yok');
          return null;
        }
        throw new Error(`HTTP ${res.status}`);
      })
      .then(data => {
        if (data) {
          setUserReview(data);
          setReviewForm({ rating: data.rating, comment: data.comment || "" });
        }
      })
      .catch((error) => {
        console.log('Kullanıcı review\'ı alınamadı:', error.message);
        // Bu normal bir durum, kullanıcının review'ı yok
      });
  }, [product, isLoggedIn]);

  const handleAddToCart = async () => {
    if (!product?.id) return;
    
    // Stok kontrolü
    if (product.stock <= 0) {
      toast.error("Bu ürün stokta bulunmamaktadır!");
      return;
    }
    
    // Miktar kontrolü
    if (quantity > product.stock) {
      toast.error(`Stokta sadece ${product.stock} adet bulunmaktadır!`);
      return;
    }
    
    setAddLoading(true);
    try {
      await addToCart(product.id, quantity);
      setAdded(true);
      setTimeout(() => setAdded(false), 900);
    } finally {
      setAddLoading(false);
    }
  };

  const handleFavoriteToggle = () => {
    if (!isLoggedIn) {
      toast.error("Favorilere eklemek için giriş yapmalısınız!");
      return;
    }
    
    if (isFavorite(product.id)) {
      removeFromFavorites(product.id);
      toast.success("Favorilerden çıkarıldı!");
    } else {
      addToFavorites(product.id);
      toast.success("Favorilere eklendi!");
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      toast.error("Yorum yapmak için giriş yapmalısınız!");
      return;
    }
    
    setReviewLoading(true);
    try {
      const res = await fetch(`http://localhost:8082/api/reviews/product/${product.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(reviewForm)
      });
      
      if (res.ok) {
        const newReview = await res.json();
        setUserReview(newReview);
        toast.success("Yorumunuz kaydedildi!");
        
        // Review listesini güncelle
        const reviewsRes = await fetch(`http://localhost:8082/api/reviews/product/${product.id}`);
        const reviewsData = await reviewsRes.json();
        setReviews(reviewsData);
        
        // İstatistikleri güncelle
        const statsRes = await fetch(`http://localhost:8082/api/reviews/product/${product.id}/stats`);
        const statsData = await statsRes.json();
        setReviewStats(statsData);
      } else {
        toast.error("Yorum kaydedilemedi!");
      }
    } catch {
      toast.error("Bir hata oluştu!");
    } finally {
      setReviewLoading(false);
    }
  };

  const handleReviewDelete = async () => {
    if (!userReview) return;
    
    try {
      const res = await fetch(`http://localhost:8082/api/reviews/product/${product.id}`, {
        method: "DELETE",
        credentials: "include"
      });
      
      if (res.ok) {
        setUserReview(null);
        setReviewForm({ rating: 5, comment: "" });
        toast.success("Yorumunuz silindi!");
        
        // Review listesini güncelle
        const reviewsRes = await fetch(`http://localhost:8082/api/reviews/product/${product.id}`);
        const reviewsData = await reviewsRes.json();
        setReviews(reviewsData);
        
        // İstatistikleri güncelle
        const statsRes = await fetch(`http://localhost:8082/api/reviews/product/${product.id}/stats`);
        const statsData = await statsRes.json();
        setReviewStats(statsData);
      }
    } catch {
      toast.error("Yorum silinemedi!");
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />);
    }
    
    if (hasHalfStar) {
      stars.push(<StarHalf key="half" className="w-4 h-4 fill-yellow-400 text-yellow-400" />);
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />);
    }
    
    return stars;
  };

  if (loading) return (
    <div className="product-detail-container">
      <div className="product-detail-skeleton">
        <div className="product-images-skeleton">
          <Skeleton height={400} width={400} className="rounded-lg" />
          <div className="thumbnail-skeleton">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} height={80} width={80} className="rounded" />
            ))}
          </div>
        </div>
        <div className="product-info-skeleton">
          <Skeleton height={32} width={300} className="mb-4" />
          <Skeleton height={24} width={200} className="mb-2" />
          <Skeleton height={28} width={150} className="mb-4" />
          <Skeleton count={4} height={16} className="mb-2" />
          <Skeleton height={48} width={200} className="mt-6" />
        </div>
      </div>
    </div>
  );

  if (error) return (
    <div className="product-detail-container">
      <div className="error-message">{error}</div>
    </div>
  );

  if (!product) return null;

  return (
    <div className="product-detail-container">
      <PageTitle title={product ? product.name : "Ürün Detayı"} />
      <MetaTags 
        title={product ? product.name : "Ürün Detayı"}
        description={product ? `${product.name} - ${product.description || 'Detaylı ürün bilgileri ve kullanıcı yorumları'}. En uygun fiyat garantisi.` : "Ürün detayları"}
        keywords={product ? `${product.name}, ${product.category ? product.category.name : 'ürün'}, alışveriş, e-ticaret` : "ürün detayı, alışveriş"}
        image={product?.imageUrl || ""}
        type="product"
        siteName="E-Ticaret"
      />

      {/* Breadcrumb */}
      <div className="breadcrumb">
        <Link to="/" className="breadcrumb-item">Ana Sayfa</Link>
        <ChevronRight className="breadcrumb-separator" />
        <Link to={`/category/${product.category?.id}`} className="breadcrumb-item">
          {product.category?.name || 'Kategori'}
        </Link>
        <ChevronRight className="breadcrumb-separator" />
        <span className="breadcrumb-item active">{product.name}</span>
      </div>

      {/* Ana Ürün Bölümü */}
      <div className="product-main-section">
        {/* Sol Taraf - Ürün Görselleri */}
        <div className="product-images-section">
          <div className="main-image-container">
            <img 
              src={productImages[selectedImage]} 
              alt={product.name} 
              className="main-product-image"
              onError={(e) => { e.target.src = '/img/no-image.png'; }}
            />
            <div className="image-actions">
              <button className="image-action-btn" title="Paylaş">
                <Share2 size={16} />
              </button>
              <button className="image-action-btn" title="Büyüt">
                <Eye size={16} />
              </button>
            </div>
          </div>
          
          <div className="thumbnail-images">
            {productImages.map((image, index) => (
              <button
                key={index}
                className={`thumbnail-image ${selectedImage === index ? 'active' : ''}`}
                onClick={() => setSelectedImage(index)}
              >
                <img 
                  src={image} 
                  alt={`${product.name} ${index + 1}`}
                  onError={(e) => { e.target.src = '/img/no-image.png'; }}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Sağ Taraf - Ürün Bilgileri */}
        <div className="product-info-section">
          {/* Ürün Başlığı ve Marka */}
          <div className="product-header">
            <h1 className="product-title">{product.name}</h1>
                         <div className="product-brand">
               <span className="brand-label">Mağaza:</span>
               <span className="brand-name">{product.storeName || 'Bilinmeyen Mağaza'}</span>
             </div>
          </div>

                     {/* Puanlama */}
           <div className="product-rating">
             <div className="rating-stars">
               {renderStars(reviewStats?.averageRating || 0)}
             </div>
             <div className="rating-info">
               <span className="rating-score">{reviewStats?.averageRating?.toFixed(1) || '0.0'}</span>
               <span className="rating-count">({reviewStats?.reviewCount || 0} değerlendirme)</span>
             </div>
             <button className="rating-link" onClick={() => setActiveTab('reviews')}>
               Tüm değerlendirmeleri gör
             </button>
           </div>
                       <div style={{ textAlign: 'center', marginTop: '8px', display: 'flex', alignItems: 'center', justifyContent: 'normal', gap: '8px' }}>
              <span style={{ fontSize: '18px' }}>🧡</span>
              <span style={{ fontSize: '14px', color: '#666' }}>Sevilen ürün! <strong color="#ff6000">150</strong>  kişi bu ürünü favoriledi!</span>
            </div>

          {/* Hızlı Özellikler */}
          <div className="quick-features">
            <div className="feature-item">
              <Truck size={16} />
              <span>Ücretsiz Kargo</span>
            </div>
            <div className="feature-item">
              <Shield size={16} />
              <span>Güvenli Alışveriş</span>
            </div>
            <div className="feature-item">
              <RotateCcw size={16} />
              <span>Kolay İade</span>
            </div>
          </div>

          {/* Fiyat Bilgisi */}
          <div className="product-price-section">
            <div className="price-main">
              <span className="price-currency">₺</span>
              <span className="price-amount">{product.price?.toLocaleString() || '0'}</span>
            </div>
            <div className="price-details">
              <span className="price-tax">KDV Dahil</span>
              <span className="price-shipping">Ücretsiz Kargo</span>
            </div>
          </div>

                     {/* Stok Durumu */}
           <div className="product-stock">
             {product.stock > 0 ? (
               <>
                 <div className="stock-status available">
                   <CheckCircle size={16} />
                   <span>Stokta</span>
                 </div>
                 <div className="stock-info">
                   <span className="stock-text">
                     {product.stock <= 5 
                       ? `Son ${product.stock} adet!` 
                       : "Hızlı teslimat için stokta"
                     }
                   </span>
                 </div>
               </>
             ) : (
               <>
                 <div className="stock-status unavailable">
                   <XCircle size={16} />
                   <span>Stokta Yok</span>
                 </div>
                 <div className="stock-info">
                   <span className="stock-text">Bu ürün şu anda stokta bulunmamaktadır</span>
                 </div>
               </>
             )}
           </div>

                     {/* Miktar Seçimi */}
           {product.stock > 0 && (
             <div className="quantity-section">
               <span className="quantity-label">Adet:</span>
               <div className="quantity-controls">
                 <button 
                   className="quantity-btn"
                   onClick={() => setQuantity(Math.max(1, quantity - 1))}
                   disabled={quantity <= 1}
                 >
                   <Minus size={16} />
                 </button>
                 <span className="quantity-value">{quantity}</span>
                 <button 
                   className="quantity-btn"
                   onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                   disabled={quantity >= product.stock}
                 >
                   <Plus size={16} />
                 </button>
               </div>
               {product.stock <= 10 && (
                 <div className="stock-warning">
                   <span>Stok: {product.stock} adet</span>
                 </div>
               )}
             </div>
           )}

                     {/* Aksiyon Butonları */}
           <div className="product-actions">
             {product.stock > 0 ? (
               <button
                 className={`add-to-cart-btn ${added ? 'added' : ''}`}
                 onClick={handleAddToCart}
                 disabled={added || addLoading}
               >
                 <ShoppingCart size={20} />
                 {added ? "Sepete Eklendi!" : addLoading ? "Ekleniyor..." : "Sepete Ekle"}
               </button>
             ) : (
               <button
                 className="out-of-stock-btn"
                 disabled={true}
               >
                 <XCircle size={20} />
                 Stokta Yok
               </button>
             )}
             
             <button
               className={`favorite-btn ${isFavorite(product.id) ? 'active' : ''}`}
               onClick={handleFavoriteToggle}
             >
               <Heart size={20} />
             </button>
           </div>

          {/* Mağaza Bilgisi */}
          {product.storeName && (
            <div className="store-info">
              <div className="store-header">
                <Package size={16} />
                <span className="store-name">{product.storeName}</span>
                <Link to={`/store/${product.storeId || 'unknown'}`} className="store-btn primary">
                  Mağazaya Git
                </Link>
              </div>
              
            </div>
          )}
        </div>
      </div>

      {/* Alt Bölümler */}
      <div className="product-details-section">
        {/* Tab Menüsü */}
        <div className="product-tabs">
          <button 
            className={`tab-btn ${activeTab === 'description' ? 'active' : ''}`}
            onClick={() => setActiveTab('description')}
          >
            Ürün Açıklaması
          </button>
          <button 
            className={`tab-btn ${activeTab === 'specifications' ? 'active' : ''}`}
            onClick={() => setActiveTab('specifications')}
          >
            Teknik Özellikler
          </button>
          <button 
            className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
            onClick={() => setActiveTab('reviews')}
          >
            Değerlendirmeler ({reviewStats?.reviewCount || 0})
          </button>
        </div>

        {/* Tab İçerikleri */}
        <div className="tab-content">
          {activeTab === 'description' && (
            <div className="description-content">
              <h3>Ürün Açıklaması</h3>
              <p>{product.description || 'Bu ürün için detaylı açıklama bulunmamaktadır.'}</p>
            </div>
          )}

          {activeTab === 'specifications' && (
            <div className="specifications-content">
              <h3>Teknik Özellikler</h3>
              <div className="specs-grid">
                <div className="spec-item">
                  <span className="spec-label">Marka:</span>
                  <span className="spec-value">{product.storeName || 'Bilinmiyor'}</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Kategori:</span>
                  <span className="spec-value">{product.category?.name || 'Bilinmiyor'}</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Stok Durumu:</span>
                  <span className="spec-value">Mevcut</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="reviews-content">
              <div className="reviews-header">
                <h3>Değerlendirmeler</h3>
                <div className="reviews-summary">
                  <div className="average-rating">
                    <span className="rating-number">{reviewStats?.averageRating?.toFixed(1) || '0.0'}</span>
                    <div className="rating-stars-large">
                      {renderStars(reviewStats?.averageRating || 0)}
                    </div>
                    <span className="total-reviews">{reviewStats?.reviewCount || 0} değerlendirme</span>
                  </div>
                </div>
              </div>

              {/* Kullanıcı Review Formu */}
              {isLoggedIn && (
                <div className="review-form-section">
                  <h4>{userReview ? "Yorumunuzu Güncelleyin" : "Yorum Yapın"}</h4>
                  <form onSubmit={handleReviewSubmit} className="review-form">
                    <div className="rating-input">
                      <label>Puanınız:</label>
                      <div className="star-rating">
                        {[1, 2, 3, 4, 5].map(star => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                            className="star-btn"
                          >
                            <Star className={`star-icon ${star <= reviewForm.rating ? 'filled' : ''}`} />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="comment-input">
                      <label>Yorumunuz:</label>
                      <textarea
                        value={reviewForm.comment}
                        onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                        placeholder="Ürün hakkında düşüncelerinizi paylaşın..."
                        rows="4"
                      />
                    </div>
                    <div className="form-actions">
                      <button type="submit" className="submit-btn" disabled={reviewLoading}>
                        {reviewLoading ? "Kaydediliyor..." : (userReview ? "Güncelle" : "Gönder")}
                      </button>
                      {userReview && (
                        <button type="button" onClick={handleReviewDelete} className="delete-btn">
                          Sil
                        </button>
                      )}
                    </div>
                  </form>
                </div>
              )}

              {/* Review Listesi */}
              <div className="reviews-list">
                {reviewsLoading ? (
                  <div className="reviews-loading">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="review-skeleton">
                        <Skeleton height={20} width={150} className="mb-2" />
                        <Skeleton height={16} width={100} className="mb-2" />
                        <Skeleton count={2} height={16} />
                      </div>
                    ))}
                  </div>
                ) : reviews.length === 0 ? (
                  <div className="no-reviews">
                    <p>Henüz değerlendirme yapılmamış. İlk yorumu siz yapın!</p>
                  </div>
                ) : (
                  reviews.map((review) => (
                    <div key={review.id} className="review-item">
                      <div className="review-header">
                        <div className="reviewer-info">
                          <span className="reviewer-name">{review.userName || 'Anonim'}</span>
                          <div className="review-rating">
                            {renderStars(review.rating)}
                          </div>
                        </div>
                        <span className="review-date">
                          {new Date(review.createdAt).toLocaleDateString('tr-TR')}
                        </span>
                      </div>
                      {review.comment && (
                        <p className="review-comment">{review.comment}</p>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Ürün Önerileri Bölümü */}
          <div className="product-recommendations">
            <div className="recommendations-header">
              <h3>Benzer ürünleri keşfedin</h3>
            </div>
            
            {recommendationsLoading ? (
              <div className="recommendations-loading">
                <div className="recommendations-grid">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="recommendation-skeleton">
                      <Skeleton height={200} className="mb-3" />
                      <Skeleton height={20} width="80%" className="mb-2" />
                      <Skeleton height={16} width="60%" className="mb-2" />
                      <Skeleton height={24} width="40%" />
                    </div>
                  ))}
                </div>
              </div>
            ) : recommendations.length > 0 ? (
              <div className="recommendations-grid">
                {recommendations.map((recProduct) => (
                  <Link 
                    key={recProduct.id} 
                    to={`/product/${recProduct.id}`}
                    className="recommendation-card"
                  >
                    <div className="recommendation-image">
                      <img 
                        src={recProduct.imageUrl || '/img/no-image.png'} 
                        alt={recProduct.name}
                        onError={(e) => {
                          e.target.src = '/img/no-image.png';
                        }}
                      />
                      {recProduct.isDiscountActive && (
                        <div className="discount-badge">
                          %{recProduct.discountPercentage}
                        </div>
                      )}
                    </div>
                    <div className="recommendation-content">
                      <h4 className="recommendation-title">{recProduct.name}</h4>
                      <div className="recommendation-price">
                        {recProduct.isDiscountActive ? (
                          <>
                            <span className="original-price">
                              {Number(recProduct.price).toLocaleString('tr-TR')} ₺
                            </span>
                            <span className="discounted-price">
                              {Number(recProduct.discountedPrice).toLocaleString('tr-TR')} ₺
                            </span>
                          </>
                        ) : (
                          <span className="current-price">
                            {Number(recProduct.price).toLocaleString('tr-TR')} ₺
                          </span>
                        )}
                      </div>
                      <div className="recommendation-rating">
                        <div className="stars">
                          {renderStars(recProduct.averageRating || 0)}
                        </div>
                        <span className="rating-count">
                          ({recProduct.reviewCount || 0})
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="no-recommendations">
                <p>Bu kategoride henüz başka ürün bulunmuyor.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
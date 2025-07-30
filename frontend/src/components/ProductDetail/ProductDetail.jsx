import React, { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { CartContext } from "../../context/CartContext";
import { AuthContext } from "../../context/AuthContext";
import "./ProductDetail.css";
import toast from 'react-hot-toast';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { Heart, Star, ShoppingCart } from 'lucide-react';
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
  const { addToCart } = useContext(CartContext);
  const { isLoggedIn } = useContext(AuthContext);
  
  // Review state'leri
  const [reviews, setReviews] = useState([]);
  const [reviewStats, setReviewStats] = useState({ averageRating: 0, reviewCount: 0 });
  const [userReview, setUserReview] = useState(null);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewsLoading, setReviewsLoading] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:8080/api/products/${id}`)
      .then(res => {
        if (!res.ok) throw new Error("Ürün bulunamadı");
        return res.json();
      })
      .then(data => {
        setProduct(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  // Review'ları ve istatistikleri getir
  useEffect(() => {
    if (!product) return;
    
    setReviewsLoading(true);
    Promise.all([
      fetch(`http://localhost:8080/api/reviews/product/${product.id}`).then(res => res.json()),
      fetch(`http://localhost:8080/api/reviews/product/${product.id}/stats`).then(res => res.json())
    ])
      .then(([reviewsData, statsData]) => {
        setReviews(reviewsData);
        setReviewStats(statsData);
        setReviewsLoading(false);
      })
      .catch(() => {
        setReviewsLoading(false);
      });
  }, [product]);

  // Kullanıcının review'ını getir
  useEffect(() => {
    if (!product || !isLoggedIn) return;
    
    fetch(`http://localhost:8080/api/reviews/product/${product.id}/user`, {
      credentials: "include"
    })
      .then(res => {
        if (res.ok) return res.json();
        return null;
      })
      .then(data => {
        if (data) {
          setUserReview(data);
          setReviewForm({ rating: data.rating, comment: data.comment || "" });
        }
      })
      .catch(() => {
        // Kullanıcının review'ı yok
      });
  }, [product, isLoggedIn]);

  const handleAddToCart = async () => {
    if (!product?.id) return;
    setAddLoading(true);
    try {
      await addToCart(product.id, 1);
      setAdded(true);
      setTimeout(() => setAdded(false), 900);
    } finally {
      setAddLoading(false);
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
      const res = await fetch(`http://localhost:8080/api/reviews/product/${product.id}`, {
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
        const reviewsRes = await fetch(`http://localhost:8080/api/reviews/product/${product.id}`);
        const reviewsData = await reviewsRes.json();
        setReviews(reviewsData);
        
        // İstatistikleri güncelle
        const statsRes = await fetch(`http://localhost:8080/api/reviews/product/${product.id}/stats`);
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
      const res = await fetch(`http://localhost:8080/api/reviews/product/${product.id}`, {
        method: "DELETE",
        credentials: "include"
      });
      
      if (res.ok) {
        setUserReview(null);
        setReviewForm({ rating: 5, comment: "" });
        toast.success("Yorumunuz silindi!");
        
        // Review listesini güncelle
        const reviewsRes = await fetch(`http://localhost:8080/api/reviews/product/${product.id}`);
        const reviewsData = await reviewsRes.json();
        setReviews(reviewsData);
        
        // İstatistikleri güncelle
        const statsRes = await fetch(`http://localhost:8080/api/reviews/product/${product.id}/stats`);
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
    <div className="max-w-3xl mx-auto mt-10 bg-white rounded-xl shadow p-4 sm:p-8 flex flex-col sm:flex-row gap-4 sm:gap-8">
      <Skeleton height={220} width={220} className="rounded-lg" />
      <div className="flex-1 flex flex-col gap-4">
        <Skeleton height={32} width={180} />
        <Skeleton height={28} width={100} />
        <Skeleton height={20} width={120} />
        <Skeleton count={3} height={18} />
        <Skeleton height={44} width={180} className="mt-4 rounded" />
      </div>
    </div>
  );
  if (error) return <div className="cart-empty" style={{ color: "#d32f2f" }}>{error}</div>;
  if (!product) return null;

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <PageTitle title={product ? product.name : "Ürün Detayı"} />
      <MetaTags 
        title={product ? product.name : "Ürün Detayı"}
        description={product ? `${product.name} - ${product.description || 'Detaylı ürün bilgileri ve kullanıcı yorumları'}. En uygun fiyat garantisi.` : "Ürün detayları"}
        keywords={product ? `${product.name}, ${product.category?.name || 'ürün'}, alışveriş, e-ticaret` : "ürün detayı, alışveriş"}
        image={product?.imageUrl || ""}
        type="product"
        siteName="E-Ticaret"
      />
      {/* Ürün Detayları */}
      <div className="bg-white rounded-xl shadow p-4 sm:p-8 flex flex-col sm:flex-row gap-4 sm:gap-8 mb-8">
        <img src={product.imageUrl} alt={product.name} className="w-full sm:w-72 h-56 sm:h-72 object-contain rounded-lg bg-gray-100" />
        <div className="flex-1 flex flex-col gap-4">
          <h2 className="text-2xl font-bold">{product.name}</h2>
          
          {/* Puanlama */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              {renderStars(reviewStats.averageRating)}
            </div>
            <span className="text-sm text-gray-600">
              ({reviewStats.reviewCount} değerlendirme)
            </span>
          </div>
          
          <div className="text-lg text-green-700 font-semibold">{product.price} ₺</div>
          {product.storeName && (
            <div className="text-sm text-gray-500 mb-2">
              Mağaza: <Link to={`/store/${encodeURIComponent(product.storeName)}`} className="font-semibold text-green-700 hover:underline">{product.storeName}</Link>
            </div>
          )}
          <div className="text-gray-700">{product.description}</div>
          
          {/* Sosyal Medya Paylaşım */}
          <SocialShare 
            title={product.name}
            description={`${product.name} - ${product.description || 'Harika bir ürün!'} ${product.price} ₺`}
            url={window.location.href}
          />
          
          <button
            className={`product-card-btn mt-4${added ? " added" : ""}`}
            onClick={handleAddToCart}
            disabled={added || addLoading}
            style={{ width: "220px", fontSize: "1.1rem" }}
          >
            {added ? "Eklendi!" : addLoading ? "Ekleniyor..." : "Sepete Ekle"}
          </button>
        </div>
      </div>

      {/* Review Sistemi */}
      <div className="bg-white rounded-xl shadow p-4 sm:p-8">
        <h3 className="text-xl font-bold mb-6">Değerlendirmeler</h3>
        
        {/* Kullanıcı Review Formu */}
        {isLoggedIn && (
          <div className="border rounded-lg p-4 mb-6 bg-gray-50">
            <h4 className="font-semibold mb-3">
              {userReview ? "Yorumunuzu Güncelleyin" : "Yorum Yapın"}
            </h4>
            <form onSubmit={handleReviewSubmit} className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">Puanınız:</label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                      className="focus:outline-none"
                    >
                      <Star className={`w-6 h-6 ${star <= reviewForm.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Yorumunuz:</label>
                <textarea
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                  className="w-full p-2 border rounded-md"
                  rows="3"
                  placeholder="Ürün hakkında düşüncelerinizi paylaşın..."
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={reviewLoading}
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50"
                >
                  {reviewLoading ? "Kaydediliyor..." : (userReview ? "Güncelle" : "Gönder")}
                </button>
                {userReview && (
                  <button
                    type="button"
                    onClick={handleReviewDelete}
                    className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                  >
                    Sil
                  </button>
                )}
              </div>
            </form>
          </div>
        )}

        {/* Review Listesi */}
        {reviewsLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="border rounded-lg p-4">
                <Skeleton height={20} width={150} className="mb-2" />
                <Skeleton height={16} width={100} className="mb-2" />
                <Skeleton count={2} height={16} />
              </div>
            ))}
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            Henüz değerlendirme yapılmamış. İlk yorumu siz yapın!
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{review.user.username}</span>
                    <div className="flex items-center gap-1">
                      {renderStars(review.rating)}
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(review.createdAt).toLocaleDateString('tr-TR')}
                  </span>
                </div>
                {review.comment && (
                  <p className="text-gray-700">{review.comment}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;

/**
 * Bu component şu işlevleri sağlar:
 * 
 * 1. Ürün Detay Sayfası: Ürünün detaylı bilgilerini görüntüleme
 * 2. Ürün Bilgileri: Ürün adı, fiyatı, açıklaması ve görseli
 * 3. Review Sistemi: Ürün değerlendirme ve yorum sistemi
 * 4. Sepete Ekleme: Ürünü sepete ekleme fonksiyonu
 * 5. Sosyal Paylaşım: Ürünü sosyal medyada paylaşma
 * 6. Loading States: Yükleme durumları için skeleton animasyonları
 * 7. SEO Optimizasyonu: Sayfa başlığı ve meta etiketleri
 * 8. Responsive Design: Mobil ve desktop uyumlu tasarım
 * 
 * Bu component sayesinde kullanıcılar ürün detaylarını kapsamlı şekilde inceleyebilir!
 */
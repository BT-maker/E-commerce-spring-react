import React, { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { CartContext } from "../../context/CartContext";
import { AuthContext } from "../../context/AuthContext";

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

  // Ürün görselleri - Yeni çoklu resim sistemi
  const getProductImages = () => {
    if (!product) return ['/img/default-product.png'];
    
    const images = [
      product.imageUrl1,
      product.imageUrl2,
      product.imageUrl3,
      product.imageUrl4,
      product.imageUrl5,
      product.imageUrl // Eski alanı da ekle (geriye uyumluluk için)
    ].filter(img => {
      // Boş resimleri filtrele
      if (!img || img === null || img === undefined || img.trim() === '') {
        return false;
      }
      // Base64 resimleri de kabul et
      return true;
    });
    
    // Eğer hiç resim yoksa varsayılan resim ekle
    if (images.length === 0) {
      images.push('/img/default-product.png');
    }
    
    return images;
  };
  
  const productImages = getProductImages();
  
  // Debug için resim bilgilerini logla
  useEffect(() => {
    if (product) {
      console.log('Ürün resim bilgileri:', {
        imageUrl: product.imageUrl,
        imageUrl1: product.imageUrl1,
        imageUrl2: product.imageUrl2,
        imageUrl3: product.imageUrl3,
        imageUrl4: product.imageUrl4,
        imageUrl5: product.imageUrl5
      });
      console.log('Filtrelenmiş resimler:', productImages);
    }
  }, [product, productImages]);

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
    if (!product?.id) return;
    
    console.log('Review\'lar getiriliyor:', product.id);
    setReviewsLoading(true);
    
    Promise.all([
      fetch(`http://localhost:8082/api/reviews/product/${product.id}`)
        .then(res => {
          console.log('Reviews API yanıtı:', res.status);
          if (!res.ok) {
            throw new Error(`Reviews API Error: ${res.status}`);
          }
          return res.json();
        }),
      fetch(`http://localhost:8082/api/reviews/product/${product.id}/stats`)
        .then(res => {
          console.log('Stats API yanıtı:', res.status);
          if (!res.ok) {
            throw new Error(`Stats API Error: ${res.status}`);
          }
          return res.json();
        })
    ])
      .then(([reviewsData, statsData]) => {
        console.log('Reviews verisi:', reviewsData);
        console.log('Stats verisi:', statsData);
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
    if (!product?.id || !isLoggedIn) return;
    
    console.log('Kullanıcı review\'ı getiriliyor:', product.id);
    
    fetch(`http://localhost:8082/api/reviews/product/${product.id}/user`, {
      credentials: "include"
    })
      .then(res => {
        console.log('User review API yanıtı:', res.status);
        if (res.ok) return res.json();
        if (res.status === 404) {
          console.log('Kullanıcının bu ürün için review\'ı yok');
          return null;
        }
        throw new Error(`HTTP ${res.status}`);
      })
      .then(data => {
        console.log('User review verisi:', data);
        if (data) {
          setUserReview(data);
          setReviewForm({ rating: data.rating, comment: data.comment || "" });
        }
      })
      .catch((error) => {
        console.error('Kullanıcı review\'ı alınamadı:', error.message);
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
    
    if (!product?.id) {
      toast.error("Ürün bilgisi bulunamadı!");
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
    if (!userReview || !product?.id) return;
    
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
    <div className="min-h-screen  py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Sol taraf - Resim skeleton */}
          <div className="space-y-4">
            <Skeleton height={400} className="rounded-lg" />
            <div className="grid grid-cols-4 gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} height={80} className="rounded" />
              ))}
            </div>
          </div>
          {/* Sağ taraf - Bilgi skeleton */}
          <div className="space-y-4">
            <Skeleton height={32} width={300} />
            <Skeleton height={24} width={200} />
            <Skeleton height={28} width={150} />
            <Skeleton count={4} height={16} />
            <Skeleton height={48} width={200} />
          </div>
        </div>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen  flex items-center justify-center">
      <div className="text-center">
        <div className="text-red-500 text-xl font-semibold mb-4">{error}</div>
        <Link to="/" className="text-orange-600 hover:text-orange-800 underline">
          Ana Sayfaya Dön
        </Link>
      </div>
    </div>
  );

  if (!product) return null;

  return (
    <div className="min-h-screen ">
      <PageTitle title={product ? product.name : "Ürün Detayı"} />
      <MetaTags 
        title={product ? product.name : "Ürün Detayı"}
        description={product ? `${product.name} - ${product.description || 'Detaylı ürün bilgileri ve kullanıcı yorumları'}. En uygun fiyat garantisi.` : "Ürün detayları"}
        keywords={product ? `${product.name}, ${product.category ? product.category.name : 'ürün'}, alışveriş, e-ticaret` : "ürün detayı, alışveriş"}
        image={product?.imageUrl1 || product?.imageUrl || ""}
        type="product"
        siteName="E-Ticaret"
      />

      {/* Breadcrumb */}
      <div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <Link to="/" className="hover:text-orange-600 transition-colors">Ana Sayfa</Link>
            <ChevronRight className="w-4 h-4" />
            <Link to={`/category/${product.category?.id}`} className="hover:text-orange-600 transition-colors">
              {product.category?.name || 'Kategori'}
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 font-medium">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Ana Ürün Bölümü */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Sol Taraf - Ürün Görselleri */}
          <div className="space-y-6">
            {/* Ana Resim */}
            <div className="relative group">
              <div className="aspect-square bg-white rounded-2xl shadow-lg overflow-hidden">
                <img 
                  src={productImages.length > 0 ? productImages[selectedImage] : '/img/default-product.png'} 
                  alt={product.name} 
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => { 
                    console.log('Resim yüklenemedi:', e.target.src);
                    e.target.src = '/img/default-product.png'; 
                  }}
                />
              </div>
              {/* Resim Aksiyonları */}
              <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors" title="Paylaş">
                  <Share2 size={16} className="text-gray-700" />
                </button>
                <button className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors" title="Büyüt">
                  <Eye size={16} className="text-gray-700" />
                </button>
              </div>
            </div>
            
            {/* Küçük Resimler */}
            {productImages.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {productImages.map((image, index) => (
                  <button
                    key={index}
                    className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                      selectedImage === index 
                        ? 'border-orange-500 shadow-lg' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <img 
                      src={image} 
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => { 
                        console.log('Thumbnail resim yüklenemedi:', e.target.src);
                        e.target.src = '/img/default-product.png'; 
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Sağ Taraf - Ürün Bilgileri */}
          <div className="space-y-6">
            {/* Ürün Başlığı ve Marka */}
            <div className="space-y-3">
              <h1 className="text-3xl font-bold text-gray-900 leading-tight">{product.name}</h1>
              <div className="flex items-center space-x-2 text-gray-600">
                <span className="text-sm font-medium">Mağaza:</span>
                <span className="text-sm">{product.storeName || 'Bilinmeyen Mağaza'}</span>
              </div>
            </div>

            {/* Puanlama */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                {renderStars(reviewStats?.averageRating || 0)}
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <span className="font-semibold text-gray-900">{reviewStats?.averageRating?.toFixed(1) || '0.0'}</span>
                <span>({reviewStats?.reviewCount || 0} değerlendirme)</span>
              </div>
              <button 
                className="text-orange-600 hover:text-orange-800 text-sm font-medium transition-colors"
                onClick={() => setActiveTab('reviews')}
              >
                Tüm değerlendirmeleri gör
              </button>
            </div>

            {/* Favori Bilgisi */}
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span className="text-lg">🧡</span>
              <span>Sevilen ürün! <strong className="text-orange-600">150</strong> kişi bu ürünü favoriledi!</span>
            </div>

            {/* Hızlı Özellikler */}
            <div className="grid grid-cols-3 gap-4 py-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Truck size={16} className="text-green-500" />
                <span>Ücretsiz Kargo</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Shield size={16} className="text-orange-500" />
                <span>Güvenli Alışveriş</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <RotateCcw size={16} className="text-purple-500" />
                <span>Kolay İade</span>
              </div>
            </div>

            {/* Fiyat Bilgisi */}
            <div className="bg-gradient-to-r from-orange-50/30 to-orange-50/30 backdrop-blur-md shadow-xl border border-orange-500/30 rounded-2xl p-6">
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl font-bold text-gray-900">₺</span>
                <span className="text-4xl font-bold text-gray-900">{product.price?.toLocaleString() || '0'}</span>
              </div>
              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                <span>KDV Dahil</span>
                <span>•</span>
                <span>Ücretsiz Kargo</span>
              </div>
            </div>

            {/* Stok Durumu */}
            <div className="bg-white rounded-xl p-4 border border-gray-200">
              {product.stock > 0 ? (
                <div className="flex items-center space-x-3">
                  <CheckCircle size={20} className="text-green-500" />
                  <div>
                    <div className="font-medium text-green-700">Stokta</div>
                    <div className="text-sm text-gray-600">
                      {product.stock <= 5 
                        ? `Kritik stok: ${product.stock} adet!` 
                        : product.stock <= 10
                        ? `Düşük stok: ${product.stock} adet`
                        : "Hızlı teslimat için stokta"
                      }
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <XCircle size={20} className="text-red-500" />
                  <div>
                    <div className="font-medium text-red-700">Stokta Yok</div>
                    <div className="text-sm text-gray-600">Bu ürün şu anda stokta bulunmamaktadır</div>
                  </div>
                </div>
              )}
            </div>

            {/* Miktar Seçimi */}
            {product.stock > 0 && (
              <div className="bg-white rounded-xl p-4 border border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-700">Adet:</span>
                  <div className="flex items-center space-x-3">
                    <button 
                      className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-50"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                    >
                      <Minus size={16} />
                    </button>
                    <span className="w-12 text-center font-semibold text-gray-900">{quantity}</span>
                    <button 
                      className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-50"
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      disabled={quantity >= product.stock}
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
                {product.stock <= 10 && (
                  <div className="mt-2 text-sm text-orange-600 font-medium">
                    {product.stock <= 5 ? 'Kritik Stok' : 'Düşük Stok'}: {product.stock} adet
                  </div>
                )}
              </div>
            )}

            {/* Aksiyon Butonları */}
            <div className="flex space-x-4">
              {product.stock > 0 ? (
                <button
                  className={`flex-1 flex items-center justify-center space-x-2 py-4 px-6 rounded-xl font-semibold transition-all ${
                    added 
                      ? 'bg-green-500 text-white' 
                      : 'bg-orange-600 hover:bg-orange-700 text-white shadow-lg hover:shadow-xl'
                  } disabled:opacity-50`}
                  onClick={handleAddToCart}
                  disabled={added || addLoading}
                >
                  <ShoppingCart size={20} />
                  <span>{added ? "Sepete Eklendi!" : addLoading ? "Ekleniyor..." : "Sepete Ekle"}</span>
                </button>
              ) : (
                <button
                  className="flex-1 flex items-center justify-center space-x-2 py-4 px-6 rounded-xl font-semibold bg-gray-400 text-white cursor-not-allowed"
                  disabled={true}
                >
                  <XCircle size={20} />
                  <span>Stokta Yok</span>
                </button>
              )}
              
              <button
                className={`p-4 rounded-xl border-2 transition-all ${
                  isFavorite(product.id) 
                    ? 'border-red-500 bg-red-50 text-red-500' 
                    : 'border-gray-300 hover:border-red-300 hover:bg-red-50 text-gray-600 hover:text-red-500'
                }`}
                onClick={handleFavoriteToggle}
              >
                <Heart size={20} className={isFavorite(product.id) ? 'fill-current' : ''} />
              </button>
            </div>

            {/* Mağaza Bilgisi */}
            {product.storeName && (
              <div className="bg-white rounded-xl p-4 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Package size={20} className="text-orange-500" />
                    <div>
                      <div className="font-medium text-gray-900">{product.storeName}</div>
                      <div className="text-sm text-gray-600">Güvenilir Satıcı</div>
                    </div>
                  </div>
                  <Link 
                    to={`/store/${product.storeId || 'unknown'}`} 
                    className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm font-medium"
                  >
                    Mağazaya Git
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Alt Bölümler */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {/* Tab Menüsü */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 mb-8">
          <div className="flex border-b border-gray-200">
            <button 
              className={`flex-1 py-4 px-6 text-sm font-medium transition-colors ${
                activeTab === 'description' 
                  ? 'text-orange-600 border-b-2 border-orange-600' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              onClick={() => setActiveTab('description')}
            >
              Ürün Açıklaması
            </button>
            <button 
              className={`flex-1 py-4 px-6 text-sm font-medium transition-colors ${
                activeTab === 'specifications' 
                  ? 'text-orange-600 border-b-2 border-orange-600' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              onClick={() => setActiveTab('specifications')}
            >
              Teknik Özellikler
            </button>
            <button 
              className={`flex-1 py-4 px-6 text-sm font-medium transition-colors ${
                activeTab === 'reviews' 
                  ? 'text-orange-600 border-b-2 border-orange-600' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              onClick={() => setActiveTab('reviews')}
            >
              Değerlendirmeler ({reviewStats?.reviewCount || 0})
            </button>
          </div>

          {/* Tab İçerikleri */}
          <div className="p-6">
            {activeTab === 'description' && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900">Ürün Açıklaması</h3>
                <p className="text-gray-700 leading-relaxed">
                  {product.description || 'Bu ürün için detaylı açıklama bulunmamaktadır.'}
                </p>
              </div>
            )}

            {activeTab === 'specifications' && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900">Teknik Özellikler</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex justify-between py-3 border-b border-gray-100">
                    <span className="font-medium text-gray-700">Marka:</span>
                    <span className="text-gray-900">{product.storeName || 'Bilinmiyor'}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-gray-100">
                    <span className="font-medium text-gray-700">Kategori:</span>
                    <span className="text-gray-900">{product.category?.name || 'Bilinmiyor'}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-gray-100">
                    <span className="font-medium text-gray-700">Stok Durumu:</span>
                    <span className="text-gray-900">Mevcut</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-900">Değerlendirmeler</h3>
                  <div className="flex items-center space-x-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-gray-900">{reviewStats?.averageRating?.toFixed(1) || '0.0'}</div>
                      <div className="flex items-center justify-center space-x-1 mt-1">
                        {renderStars(reviewStats?.averageRating || 0)}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">{reviewStats?.reviewCount || 0} değerlendirme</div>
                    </div>
                  </div>
                </div>

                {/* Kullanıcı Review Formu */}
                {isLoggedIn && (
                  <div className=" rounded-xl p-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">
                      {userReview ? "Yorumunuzu Güncelleyin" : "Yorum Yapın"}
                    </h4>
                    <form onSubmit={handleReviewSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Puanınız:</label>
                        <div className="flex space-x-1">
                          {[1, 2, 3, 4, 5].map(star => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                              className="p-1 hover:scale-110 transition-transform"
                            >
                              <Star className={`w-6 h-6 ${
                                star <= reviewForm.rating 
                                  ? 'fill-yellow-400 text-yellow-400' 
                                  : 'text-gray-300'
                              }`} />
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Yorumunuz:</label>
                        <textarea
                          value={reviewForm.comment}
                          onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                          placeholder="Ürün hakkında düşüncelerinizi paylaşın..."
                          rows="4"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                        />
                      </div>
                      <div className="flex space-x-3">
                        <button 
                          type="submit" 
                          className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium disabled:opacity-50"
                          disabled={reviewLoading}
                        >
                          {reviewLoading ? "Kaydediliyor..." : (userReview ? "Güncelle" : "Gönder")}
                        </button>
                        {userReview && (
                          <button 
                            type="button" 
                            onClick={handleReviewDelete} 
                            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                          >
                            Sil
                          </button>
                        )}
                      </div>
                    </form>
                  </div>
                )}

                {/* Review Listesi */}
                <div className="space-y-4">
                  {reviewsLoading ? (
                    <div className="space-y-4">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="bg-white rounded-lg p-4 border border-gray-200">
                          <Skeleton height={20} width={150} className="mb-2" />
                          <Skeleton height={16} width={100} className="mb-2" />
                          <Skeleton count={2} height={16} />
                        </div>
                      ))}
                    </div>
                  ) : reviews.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-600">Henüz değerlendirme yapılmamış. İlk yorumu siz yapın!</p>
                    </div>
                  ) : (
                    reviews.map((review) => (
                      <div key={review.id} className="bg-white rounded-lg p-4 border border-gray-200">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <span className="font-medium text-gray-900">{review.userName || 'Anonim'}</span>
                            <div className="flex items-center space-x-1">
                              {renderStars(review.rating)}
                            </div>
                          </div>
                          <span className="text-sm text-gray-500">
                            {new Date(review.createdAt).toLocaleDateString('tr-TR')}
                          </span>
                        </div>
                        {review.comment && (
                          <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Ürün Önerileri Bölümü */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Benzer ürünleri keşfedin</h3>
          </div>
          
          {recommendationsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton height={200} className="rounded-lg" />
                  <Skeleton height={20} width="80%" />
                  <Skeleton height={16} width="60%" />
                  <Skeleton height={24} width="40%" />
                </div>
              ))}
            </div>
          ) : recommendations.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
              {recommendations.map((recProduct) => (
                <Link 
                  key={recProduct.id} 
                  to={`/product/${recProduct.id}`}
                  className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="relative aspect-square">
                    <img 
                      src={recProduct.imageUrl1 || recProduct.imageUrl || '/img/default-product.png'} 
                      alt={recProduct.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.src = '/img/default-product.png';
                      }}
                    />
                    {recProduct.isDiscountActive && (
                      <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        %{recProduct.discountPercentage}
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <h4 className="font-medium text-gray-900 text-sm line-clamp-2 mb-2 group-hover:text-orange-600 transition-colors">
                      {recProduct.name}
                    </h4>
                    <div className="space-y-1">
                      {recProduct.isDiscountActive ? (
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-500 line-through">
                            {Number(recProduct.price).toLocaleString('tr-TR')} ₺
                          </span>
                          <span className="text-sm font-bold text-red-600">
                            {Number(recProduct.discountedPrice).toLocaleString('tr-TR')} ₺
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm font-bold text-gray-900">
                          {Number(recProduct.price).toLocaleString('tr-TR')} ₺
                        </span>
                      )}
                      <div className="flex items-center space-x-1">
                        <div className="flex items-center space-x-1">
                          {renderStars(recProduct.averageRating || 0)}
                        </div>
                        <span className="text-xs text-gray-500">
                          ({recProduct.reviewCount || 0})
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600">Bu kategoride henüz başka ürün bulunmuyor.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
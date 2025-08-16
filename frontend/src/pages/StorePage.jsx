import React, { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import ProductCard from "../components/ProductCard/ProductCard";
import { CartContext } from "../context/CartContext";
import toast from 'react-hot-toast';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import PageTitle from '../components/PageTitle/PageTitle';
import MetaTags from '../components/MetaTags/MetaTags';
import SocialShare from '../components/SocialShare/SocialShare';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Clock, 
  Star, 
  Package, 
  Truck, 
  Shield, 
  Users,
  ShoppingBag,
  Heart,
  Share2,
  ArrowLeft
} from 'lucide-react';

const StorePage = () => {
  const { id } = useParams();
  const [store, setStore] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [productsLoading, setProductsLoading] = useState(true);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    // Sayfa yüklendiğinde scroll'u en üste taşı
    window.scrollTo(0, 0);
    
    setLoading(true);
    setError("");
    
    // Mağaza bilgilerini getir
    fetch(`http://localhost:8082/api/stores/${id}`)
      .then(res => {
        if (!res.ok) {
          throw new Error("Mağaza bulunamadı");
        }
        return res.json();
      })
      .then(storeData => {
        setStore(storeData);
        setLoading(false);
        
        // Mağaza ürünlerini getir
        setProductsLoading(true);
        return fetch(`http://localhost:8082/api/products?storeId=${storeData.id}&page=0&size=20`);
      })
      .then(res => res.json())
      .then(productData => {
        setProducts(productData.content || productData);
        setProductsLoading(false);
      })
      .catch(err => {
        console.error("Mağaza yükleme hatası:", err);
        setError(err.message);
        setLoading(false);
        setProductsLoading(false);
      });
  }, [id]);

  // Veri yüklendikten sonra scroll'u en üste taşı
  useEffect(() => {
    if (!loading && !productsLoading) {
      window.scrollTo(0, 0);
    }
  }, [loading, productsLoading]);

  const handleAddToCart = async (productId) => {
    try {
      await addToCart(productId, 1);
      toast.success('Ürün sepete eklendi!');
    } catch {
      toast.error('Ürün sepete eklenemedi!');
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-50">
      {/* Store Header Skeleton */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center space-x-4">
            <Skeleton height={80} width={80} className="rounded-lg" />
            <div className="flex-1">
              <Skeleton height={32} width={300} className="mb-2" />
              <Skeleton height={20} width={200} className="mb-2" />
              <Skeleton height={16} width={150} />
            </div>
          </div>
        </div>
      </div>
      
      {/* Products Skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Skeleton height={40} width={200} className="mb-8" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm p-4">
              <Skeleton height={200} className="mb-4 rounded" />
              <Skeleton height={20} width={150} className="mb-2" />
              <Skeleton height={16} width={80} className="mb-2" />
              <Skeleton height={40} width={120} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="text-red-500 text-xl mb-4">{error}</div>
        <Link to="/" className="text-blue-600 hover:text-blue-800">
          Ana Sayfaya Dön
        </Link>
      </div>
    </div>
  );

  if (!store) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="text-gray-500 text-xl mb-4">Mağaza bulunamadı.</div>
        <Link to="/" className="text-blue-600 hover:text-blue-800">
          Ana Sayfaya Dön
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <PageTitle title={`${store.name} Mağazası`} />
      <MetaTags 
        title={`${store.name} Mağazası`}
        description={`${store.name} mağazasının ürünlerini keşfedin. ${store.description || 'Kaliteli ürünler ve güvenilir alışveriş deneyimi.'}`}
        keywords={`${store.name}, ${store.name} mağazası, mağaza ürünleri, alışveriş, e-ticaret`}
        image={store.bannerUrl || store.logoUrl}
        type="website"
        siteName={`${store.name} - E-Ticaret`}
      />

      {/* Store Header */}
      <div className="bg-white shadow-sm">
        {/* Banner Image */}
        {store.bannerUrl && (
          <div className="relative h-48 md:h-64 bg-gradient-to-r from-blue-600 to-purple-600">
            <img 
              src={store.bannerUrl} 
              alt={`${store.name} Banner`}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div className="hidden absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 items-center justify-center">
              <div className="text-white text-center">
                <Package size={48} className="mx-auto mb-2" />
                <h1 className="text-2xl font-bold">{store.name}</h1>
              </div>
            </div>
          </div>
        )}

        {/* Store Info */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
            {/* Store Logo */}
            <div className="flex-shrink-0">
              {store.logoUrl ? (
                <img 
                  src={store.logoUrl} 
                  alt={`${store.name} Logo`}
                  className="w-20 h-20 md:w-24 md:h-24 rounded-lg object-cover border-2 border-gray-200"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div className={`w-20 h-20 md:w-24 md:h-24 rounded-lg border-2 border-gray-200 flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 ${store.logoUrl ? 'hidden' : ''}`}>
                <Package size={32} className="text-white" />
              </div>
            </div>

            {/* Store Details */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-3 mb-2">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{store.name}</h1>
                <div className="flex items-center space-x-1 text-yellow-400">
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                  <span className="text-gray-600 text-sm ml-1">(4.8)</span>
                </div>
              </div>
              
              {store.description && (
                <p className="text-gray-600 mb-3 max-w-2xl">{store.description}</p>
              )}

              {/* Store Stats */}
              <div className="flex flex-wrap items-center space-x-6 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <ShoppingBag size={16} />
                  <span>{products.length} ürün</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users size={16} />
                  <span>1.2K takipçi</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Truck size={16} />
                  <span>Ücretsiz kargo</span>
                </div>
              </div>
            </div>

            {/* Store Actions */}
            <div className="flex items-center space-x-3">
              <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Heart size={16} />
                <span>Takip Et</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                <Share2 size={16} />
                <span>Paylaş</span>
              </button>
            </div>
          </div>

          {/* Store Contact Info */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {store.address && (
                <div className="flex items-center space-x-2 text-gray-600">
                  <MapPin size={16} />
                  <span className="text-sm">{store.address}</span>
                </div>
              )}
              {store.phone && (
                <div className="flex items-center space-x-2 text-gray-600">
                  <Phone size={16} />
                  <span className="text-sm">{store.phone}</span>
                </div>
              )}
              {store.email && (
                <div className="flex items-center space-x-2 text-gray-600">
                  <Mail size={16} />
                  <span className="text-sm">{store.email}</span>
                </div>
              )}
              {store.website && (
                <div className="flex items-center space-x-2 text-gray-600">
                  <Globe size={16} />
                  <a href={store.website} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:text-blue-800">
                    {store.website}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Mağaza Ürünleri</h2>
            <p className="text-gray-600 mt-1">{products.length} ürün bulundu</p>
          </div>
          
          {/* Back to Home */}
          <Link 
            to="/" 
            className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Ana Sayfaya Dön</span>
          </Link>
        </div>

        {productsLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm p-4">
                <Skeleton height={200} className="mb-4 rounded" />
                <Skeleton height={20} width={150} className="mb-2" />
                <Skeleton height={16} width={80} className="mb-2" />
                <Skeleton height={40} width={120} />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <Package size={64} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Henüz ürün yok</h3>
            <p className="text-gray-600">Bu mağazada henüz ürün bulunmuyor.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
            ))}
          </div>
        )}
      </div>

      {/* Social Share */}
      <div className="bg-white border-t border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Bu mağazayı paylaşın</h3>
            <SocialShare 
              title={`${store.name} Mağazası`}
              description={`${store.name} mağazasının ürünlerini keşfedin. ${store.description || 'Kaliteli ürünler ve güvenilir alışveriş deneyimi.'}`}
              url={window.location.href}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StorePage;
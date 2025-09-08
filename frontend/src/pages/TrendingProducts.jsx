import React, { useEffect, useState, useContext } from "react";
import ProductCard from "../components/ProductCard/ProductCard";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { CartContext } from '../context/CartContext';
import toast from 'react-hot-toast';
import PageTitle from '../components/PageTitle/PageTitle';
import MetaTags from '../components/MetaTags/MetaTags';
import { TrendingUp, Flame, Star, Eye, ShoppingCart, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PAGE_SIZE = 12;

const TrendingProducts = () => {
  const { addToCart } = useContext(CartContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  // Trend ürünleri getir - En çok satılan ürünleri getir
  useEffect(() => {
    setLoading(true);
    setError(null);
    
    const fetchTrendingProducts = async () => {
      try {
        // Önce popular sort'u dene
        const popularUrl = `http://localhost:8082/api/products?page=${page}&size=${PAGE_SIZE}&sort=popular`;
        let response = await fetch(popularUrl);
        
        if (!response.ok) {
          // Eğer popular sort çalışmazsa, normal ürünleri getir
          console.warn('Popular sort çalışmıyor, normal ürünler getiriliyor...');
          response = await fetch(`http://localhost:8082/api/products?page=${page}&size=${PAGE_SIZE}`);
        }
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.content && data.content.length > 0) {
          setProducts(data.content);
          setTotalPages(data.totalPages);
        } else {
          setProducts([]);
          setTotalPages(0);
        }
      } catch (err) {
        console.error('Trend ürünleri yüklenirken hata:', err);
        setError('Trend ürünleri yüklenirken bir hata oluştu. Lütfen sayfayı yenileyin.');
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingProducts();
  }, [page]);

  const handleAddToCart = async (product) => {
    try {
      await addToCart(product, 1);
      toast.success(`${product.name} sepete eklendi!`);
    } catch (error) {
      console.error('Sepete ekleme hatası:', error);
      toast.error('Ürün sepete eklenemedi!');
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 py-8">
        <div className="container mx-auto px-4">
          <PageTitle title="Trend Ürünler" />
          <MetaTags 
            title="Trend Ürünler"
            description="En popüler ve trend ürünleri keşfedin. Haftanın en çok satan ürünleri burada!"
            keywords="trend ürünler, popüler ürünler, en çok satan, e-ticaret"
          />
          
          {/* Hero Section */}
          <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-8 mb-8 text-white">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h1 className="text-3xl font-bold">Trend Ürünler</h1>
            </div>
            <p className="text-lg opacity-90">
              Haftanın en popüler ve en çok satan ürünlerini keşfedin
            </p>
          </div>

          {/* Skeleton Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden">
                <Skeleton height={200} />
                <div className="p-4">
                  <Skeleton height={20} className="mb-2" />
                  <Skeleton height={16} className="mb-2" />
                  <Skeleton height={24} width="60%" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 py-8">
        <div className="container mx-auto px-4">
          <PageTitle title="Trend Ürünler" />
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📈</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Trend Ürünler Yüklenemedi</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg transition-colors"
            >
              Tekrar Dene
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 py-8">
      <div className="container mx-auto px-4">
        <PageTitle title="Trend Ürünler" />
        <MetaTags 
          title="Trend Ürünler"
          description="En popüler ve trend ürünleri keşfedin. Haftanın en çok satan ürünleri burada!"
          keywords="trend ürünler, popüler ürünler, en çok satan, e-ticaret"
        />
        
        {/* Hero Section */}
        <div className="bg-orange-500 rounded-2xl p-8 mb-8 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black bg-opacity-10"></div>
          <div className="relative z-10">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h1 className="text-3xl font-bold">Trend Ürünler</h1>
            </div>
            <p className="text-lg opacity-90 mb-4">
              Haftanın en popüler ve en çok satan ürünlerini keşfedin
            </p>
            <div className="flex items-center space-x-6 text-sm">
              <div className="flex items-center space-x-2">
                <Flame className="w-4 h-4" />
                <span>En Çok Satan</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="w-4 h-4" />
                <span>Popüler Ürünler</span>
              </div>
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4" />
                <span>Trend Analizi</span>
              </div>
            </div>
          </div>
          
          {/* Decorative Elements */}
          <div className="absolute top-4 right-4 w-20 h-20 bg-white bg-opacity-10 rounded-full"></div>
          <div className="absolute bottom-4 right-8 w-12 h-12 bg-white bg-opacity-10 rounded-full"></div>
        </div>

        {/* Back Button */}
        <div className="mb-6">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-gray-600 hover:text-orange-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Geri Dön</span>
          </button>
        </div>

        {/* Products Grid */}
        {products.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {products.map((product, index) => (
                <div key={product.id} className="group">
                  <div className="relative">
                    <ProductCard 
                      product={product} 
                      onAddToCart={handleAddToCart}
                    />
                    {/* Trend Badge with Rank */}
                    <div className="absolute top-2 left-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center space-x-1">
                      <TrendingUp className="w-3 h-3" />
                      <span>#{index + 1}</span>
                    </div>
                    {/* Popularity Indicator */}
                    <div className="absolute top-2 right-2 bg-white bg-opacity-90 rounded-full p-1">
                      <Flame className="w-4 h-4 text-orange-500" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center space-x-2">
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 0}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Önceki
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => handlePageChange(i)}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      page === i
                        ? 'bg-orange-500 text-white'
                        : 'bg-white border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                
                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === totalPages - 1}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Sonraki
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📈</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Henüz Trend Ürün Yok</h2>
            <p className="text-gray-600 mb-6">
              Şu anda trend olan ürün bulunmuyor. Diğer kategorileri keşfetmek ister misiniz?
            </p>
            <button 
              onClick={() => navigate('/')}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg transition-colors"
            >
              Ana Sayfaya Dön
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrendingProducts;

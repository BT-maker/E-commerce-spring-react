import React, { useEffect, useState, useContext } from "react";
import ProductCard from "../components/ProductCard/ProductCard";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { CartContext } from '../context/CartContext';
import toast from 'react-hot-toast';
import PageTitle from '../components/PageTitle/PageTitle';
import MetaTags from '../components/MetaTags/MetaTags';
import { ArrowLeft, Percent, Tag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PAGE_SIZE = 12;

const DiscountedProducts = () => {
  const { addToCart } = useContext(CartContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  // İndirimli ürünleri getir
  useEffect(() => {
    setLoading(true);
    const url = `http://localhost:8082/api/products/discounted?page=${page}&size=${PAGE_SIZE}`;

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error("İndirimli ürünler alınamadı");
        return res.json();
      })
      .then((data) => {
        console.log('=== İNDİRİMLİ ÜRÜNLER DEBUG ===');
        console.log('Backend\'den gelen veri:', data);
        console.log('Toplam sayfa sayısı:', data.totalPages);
        console.log('Toplam ürün sayısı:', data.totalElements);
        console.log('Mevcut sayfa:', data.number);
        console.log('Sayfa boyutu:', data.size);
        console.log('Ürün sayısı:', data.content?.length || data.length);
        console.log('=== DEBUG END ===');
        
        setProducts(data.content || data);
        setTotalPages(data.totalPages || 1);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [page]);

  const handleAddToCart = (product) => {
    addToCart(product);
    toast.success(`${product.name} sepete eklendi!`);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen ">
      <PageTitle title="İndirimli Ürünler" />
      <MetaTags 
        title="İndirimli Ürünler"
        description="En iyi fiyatlarla indirimli ürünlerimizi keşfedin. Kaçırılmayacak fırsatlar sizi bekliyor!"
        keywords="indirim, fırsat, ucuz, kampanya, özel fiyat"
      />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4 transition-colors"
          >
            <ArrowLeft size={20} />
            Geri Dön
          </button>
          
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-red-100 p-3 rounded-full">
              <Percent className="text-red-600" size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">İndirimli Ürünler</h1>
              <p className="text-gray-600">En iyi fırsatları kaçırmayın!</p>
            </div>
          </div>
          
          {!loading && products.length > 0 && (
            <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-red-700">
                <Tag size={20} />
                <span className="font-medium">
                  {products.length} indirimli ürün bulundu
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-md p-4">
                <Skeleton height={200} className="mb-4 rounded" />
                <Skeleton height={20} width="80%" className="mb-2" />
                <Skeleton height={16} width="60%" className="mb-2" />
                <Skeleton height={24} width="40%" className="mb-4" />
                <Skeleton height={40} className="rounded" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="text-red-500 text-xl mb-4">⚠️</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Bir hata oluştu</h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Tekrar Dene
            </button>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🏷️</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Şu anda indirimli ürün bulunmuyor</h3>
            <p className="text-gray-500 mb-6">Fırsatları kaçırmamak için düzenli olarak kontrol edin!</p>
            <button
              onClick={() => navigate('/')}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Tüm Ürünleri Gör
            </button>
          </div>
        ) : (
          <>
            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={() => handleAddToCart(product)}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 0}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
                >
                  Önceki
                </button>
                
                <div className="flex gap-1">
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i}
                      onClick={() => handlePageChange(i)}
                      className={`px-3 py-2 rounded-lg transition-colors ${
                        page === i
                          ? 'bg-orange-600 text-white'
                          : 'bg-gray-200 hover:bg-gray-300'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
                
                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === totalPages - 1}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
                >
                  Sonraki
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default DiscountedProducts;

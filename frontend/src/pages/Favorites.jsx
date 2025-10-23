import React, { useContext } from "react";
import { useFavorites } from "../context/FavoritesContext";
import { useAuth } from '../context/AuthContext';
import { CartContext } from "../context/CartContext";
import ProductCard from '../components/ProductCard/ProductCard';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { Heart, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import PageTitle from '../components/PageTitle/PageTitle';
import MetaTags from '../components/MetaTags/MetaTags';

const Favorites = () => {
  const { favorites, loading, removeFromFavorites } = useFavorites();
  const { isLoggedIn } = useAuth();
  const { addToCart } = useContext(CartContext);

  // Debug bilgileri
  console.log('Favorites sayfası - isLoggedIn:', isLoggedIn);
  console.log('Favorites sayfası - loading:', loading);
  console.log('Favorites sayfası - favorites:', favorites);
  console.log('Favorites sayfası - favorites.length:', favorites?.length);

  if (!isLoggedIn) {
    return (
      <div className="max-w-4xl mx-auto mt-8 px-4">
        <div className="text-center py-12">
          <Heart size={64} className="mx-auto text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-700 mb-4">Favorileriniz</h2>
          <p className="text-gray-600 mb-6">Favorilerinizi görmek için giriş yapmalısınız.</p>
          <Link 
            to="/login" 
            className="inline-flex items-center px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
          >
            Giriş Yap
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 mt-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">Favorilerim</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="product-card">
              <Skeleton height={200} className="mb-2" />
              <Skeleton height={20} width={150} className="mb-2" />
              <Skeleton height={16} width={80} className="mb-2" />
              <Skeleton height={40} width={120} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const handleAddToCart = async (productId) => {
    try {
      await addToCart(productId, 1);
      toast.success("Ürün sepete eklendi!");
    } catch {
      toast.error("Ürün sepete eklenemedi!");
    }
  };

  return (
          <div className="max-w-7xl mx-auto px-4 mt-8">
        <PageTitle title="Favorilerim" />
        <MetaTags 
          title="Favorilerim"
          description="Favori ürünlerinizi görüntüleyin. Beğendiğiniz ürünleri kaydedin ve daha sonra kolayca erişin."
          keywords="favoriler, beğenilen ürünler, favori ürünler"
        />
        <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Favorilerim</h2>
        <div className="flex items-center gap-2 text-gray-600">
          <Heart size={20} className="text-red-500" />
          <span>{favorites.length} ürün</span>
        </div>
      </div>

      {favorites.length === 0 ? (
        <div className="text-center py-12">
          <Heart size={64} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Henüz favori ürününüz yok</h3>
          <p className="text-gray-600 mb-6">Beğendiğiniz ürünleri favorilere ekleyerek buradan kolayca erişebilirsiniz.</p>
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-700 transition-colors"
          >
            <ShoppingCart size={20} />
            Alışverişe Başla
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
          {favorites.filter(fav => fav.product).map((favorite) => {
            console.log('Favori render ediliyor:', favorite);
            console.log('Favori product:', favorite.product);
            return (
              <ProductCard 
                key={favorite.id} 
                product={favorite.product} 
                onAddToCart={handleAddToCart}
                isFavoritesPage={true}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Favorites; 
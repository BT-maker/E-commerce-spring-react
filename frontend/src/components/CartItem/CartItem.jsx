import React from "react";
import { Link } from "react-router-dom";
import { Heart, Trash2 } from "lucide-react";
import { useFavorites } from "../../context/FavoritesContext";


const CartItem = ({ item, onQuantityChange, onRemove }) => {
  const { product, quantity, id } = item;
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();

  const handleFavoriteToggle = () => {
    if (isFavorite(product.id)) {
      removeFromFavorites(product.id);
    } else {
      addToFavorites(product.id);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex gap-3 sm:gap-4">
        {/* Ürün Resmi */}
        <Link to={`/product/${product.id}`} className="flex-shrink-0">
                  <img 
          src={product.imageUrl1 || product.imageUrl || '/img/default-product.png'} 
            alt={product.name} 
            className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg border border-gray-200"
            onError={(e) => {
              e.target.src = '/img/default-product.png';
            }}
          />
        </Link>
        
                 {/* Ürün Bilgileri */}
         <div className="flex-1 min-w-0 flex flex-col justify-between pr-2">
           <div>
             <Link to={`/product/${product.id}`} className="block">
               <h3 className="font-semibold text-gray-800 text-sm leading-tight hover:text-blue-600 transition-colors overflow-hidden text-ellipsis display-webkit-box -webkit-line-clamp-2 -webkit-box-orient-vertical">
                 {product.name}
               </h3>
             </Link>
             
                           {/* Fiyat Bilgisi */}
              <div className="mt-2">
                {product.isDiscountActive ? (
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1">
                    <div className="flex items-center gap-1">
                      <span className="text-sm sm:text-base font-bold text-green-600">
                        {Number(product.discountedPrice).toLocaleString("tr-TR", {minimumFractionDigits:2})} ₺
                      </span>
                      <span className="text-xs text-gray-500 line-through">
                        {Number(product.price).toLocaleString("tr-TR", {minimumFractionDigits:2})} ₺
                      </span>
                    </div>
                    <span className="bg-red-100 text-red-800 text-xs px-1.5 py-0.5 rounded-full font-medium w-fit">
                      %{product.discountPercentage}
                    </span>
                  </div>
                ) : (
                  <span className="text-sm sm:text-base font-bold text-gray-800">
                    {Number(product.price).toLocaleString("tr-TR", {minimumFractionDigits:2})} ₺
                  </span>
                )}
              </div>
           </div>
           
                       {/* Miktar Kontrolü ve Toplam */}
            <div className="mt-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="flex items-center border border-gray-300 rounded-lg w-fit">
                  <button 
                    onClick={() => onQuantityChange(product.id, quantity - 1)} 
                    disabled={quantity <= 1}
                    className="px-2 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
                  >
                    -
                  </button>
                  <span className="px-3 py-1 font-medium text-gray-800 min-w-[32px] text-center text-sm">
                    {quantity}
                  </span>
                  <button 
                    onClick={() => onQuantityChange(product.id, quantity + 1)}
                    className="px-2 py-1 text-gray-600 hover:bg-gray-100 transition-colors text-sm"
                  >
                    +
                  </button>
                </div>
                
                {/* Toplam Fiyat */}
                <div className="text-right sm:text-right">
                  <div className="text-xs text-gray-500">Toplam</div>
                  <div className="font-bold text-gray-800 text-sm">
                    {((product.isDiscountActive ? product.discountedPrice : product.price) * quantity).toLocaleString("tr-TR", {minimumFractionDigits:2})} ₺
                  </div>
                </div>
              </div>
            </div>
         </div>
        
                 {/* Aksiyon Butonları */}
         <div className="flex flex-col gap-1 sm:gap-2 flex-shrink-0">
           <button 
             className={`p-1.5 sm:p-2 rounded-full transition-colors ${
               isFavorite(product.id) 
                 ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                 : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
             }`}
             onClick={handleFavoriteToggle}
             title={isFavorite(product.id) ? "Favorilerden Çıkar" : "Favorilere Ekle"}
           >
             <Heart size={14} className="sm:w-4 sm:h-4" fill={isFavorite(product.id) ? "currentColor" : "none"} />
           </button>
           
           <button 
             className="p-1.5 sm:p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors"
             onClick={() => onRemove(product.id)}
             title="Sepetten Kaldır"
           >
             <Trash2 size={14} className="sm:w-4 sm:h-4" />
           </button>
         </div>
      </div>
    </div>
  );
};

export default CartItem;

/**
 * Bu component şu işlevleri sağlar:
 * 
 * 1. Sepet Ürünü: Sepetteki her ürün için ayrı kart
 * 2. Ürün Bilgileri: Ürün adı, fiyatı ve görseli
 * 3. Miktar Kontrolü: Ürün miktarını artırma/azaltma
 * 4. Favori Toggle: Ürünü favorilere ekleme/çıkarma
 * 5. Sepetten Kaldırma: Ürünü sepetten silme
 * 6. Ürün Detayı: Ürün sayfasına yönlendirme
 * 7. Responsive Design: Mobil ve desktop uyumlu tasarım
 * 
 * Bu component sayesinde kullanıcılar sepet içeriklerini kolayca yönetebilir!
 */ 
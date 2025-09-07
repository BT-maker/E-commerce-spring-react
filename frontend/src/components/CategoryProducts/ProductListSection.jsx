import React, { memo } from 'react';
import ProductCard from "../ProductCard/ProductCard";
import Skeleton from 'react-loading-skeleton';

const ProductListSection = memo(({
  category,
  products,
  loading,
  error,
  page,
  totalPages,
  onAddToCart,
  onPageChange,
  onClearFilters
}) => {
  if (loading) {
    return (
      <div className="lg:w-3/4">
        <h2 className="text-2xl md:text-3xl font-bold mb-8 text-gray-800 text-center">
          {category ? `${category.name} Ürünleri` : "Öne Çıkan Ürünler"}
        </h2>
                 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 py-8">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="p-4">
              <Skeleton height={160} className="mb-4 rounded-lg" />
              <Skeleton height={24} width={120} className="mb-2" />
              <Skeleton height={20} width={80} />
              <Skeleton height={36} className="mt-4 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="lg:w-3/4">
        <div className="text-center text-red-500 py-8">{error}</div>
      </div>
    );
  }

  return (
    <div className="lg:w-3/4">
      <h2 className="text-2xl md:text-3xl font-bold mb-8 text-gray-800 text-center">
        {category ? `${category.name} Ürünleri` : "Öne Çıkan Ürünler"}
      </h2>
      
      {products.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 text-lg">Bu kategoride aradığınız kriterlere uygun ürün bulunamadı.</p>
                     <button
             onClick={onClearFilters}
             className="mt-4 px-4 py-2 bg-white border border-orange-500 text-orange-600 rounded hover:bg-orange-50 transition-colors"
           >
             Filtreleri Temizle
           </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 py-8">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={onAddToCart}
              />
            ))}
          </div>
          
          {/* Sayfalama */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8 space-x-2">
              {/* Önceki sayfa */}
              {page > 0 && (
                <button
                  onClick={() => onPageChange(page - 1)}
                  className="px-3 py-2 rounded bg-gray-100 text-orange-700"
                >
                  Önceki
                </button>
              )}
              
              {/* Sayfa numaraları */}
              {Array.from({ length: totalPages }, (_, i) => {
                // Sadece mevcut sayfa ve etrafındaki 2 sayfayı göster
                if (i === 0 || i === totalPages - 1 || (i >= page - 1 && i <= page + 1)) {
                  return (
                    <button
                      key={i}
                      onClick={() => onPageChange(i)}
                                             className={`px-3 py-2 rounded ${
                         page === i
                           ? "bg-orange-700 text-white"
                           : "bg-gray-100 text-orange-700"
                       }`}
                    >
                      {i + 1}
                    </button>
                  );
                } else if (i === page - 2 || i === page + 2) {
                  return <span key={i} className="px-2 py-2">...</span>;
                }
                return null;
              })}
              
              {/* Sonraki sayfa */}
              {page < totalPages - 1 && (
                <button
                  onClick={() => onPageChange(page + 1)}
                  className="px-3 py-2 rounded bg-gray-100 text-orange-700"
                >
                  Sonraki
                </button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
});

ProductListSection.displayName = 'ProductListSection';

export default ProductListSection;

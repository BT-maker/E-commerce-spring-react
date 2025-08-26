import React, { memo } from 'react';

const FilterPanel = memo(({
  searchQuery,
  minPrice,
  maxPrice,
  selectedStore,
  selectedCategory,
  categories,
  sort,
  stores,
  storesLoading,
  showFilters,
  onSearchChange,
  onMinPriceChange,
  onMaxPriceChange,
  onStoreChange,
  onCategoryChange,
  onSortChange,
  onToggleFilters,
  onClearFilters
}) => {
  return (
    <div className="lg:w-1/4">
      <div className="filter-panel bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-800">Filtreler</h3>
          <button
            onClick={onToggleFilters}
            className="lg:hidden text-gray-500 hover:text-gray-700 flex items-center gap-2"
          >
            <span>{showFilters ? 'Gizle' : 'Göster'}</span>
            <svg className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
        
        <div className={`${showFilters ? 'block' : 'hidden'} lg:block space-y-6`}>
          {/* Arama Kutusu */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ürün Ara
            </label>
            <input
              type="text"
              placeholder="Ürün adı, açıklama..."
              value={searchQuery}
              onChange={onSearchChange}
              className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          {/* Kategori Filtresi - Sadece categories prop'u varsa göster */}
          {categories && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kategori
              </label>
              <select
                value={selectedCategory || ""}
                onChange={onCategoryChange}
                className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">Tüm Kategoriler</option>
                {Array.isArray(categories) && categories.map((category) => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Fiyat Aralığı */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fiyat Aralığı
            </label>
            <div className="space-y-2">
              <input
                type="number"
                placeholder="Min Fiyat"
                value={minPrice}
                onChange={onMinPriceChange}
                className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <input
                type="number"
                placeholder="Max Fiyat"
                value={maxPrice}
                onChange={onMaxPriceChange}
                className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Mağaza Filtresi */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mağaza
            </label>
            <select
              value={selectedStore}
              onChange={onStoreChange}
              className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              disabled={storesLoading}
            >
              <option value="">Tüm Mağazalar</option>
              {stores.map((store) => (
                <option key={store.id} value={store.name}>
                  {store.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sıralama */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sıralama
            </label>
            <select
              value={sort}
              onChange={onSortChange}
              className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="">Varsayılan</option>
              <option value="price,asc">Fiyat: Artan</option>
              <option value="price,desc">Fiyat: Azalan</option>
              <option value="popular">Popüler</option>
            </select>
          </div>

          {/* Filtreleri Temizle */}
          <button
            onClick={onClearFilters}
            className="w-full bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors"
          >
            Filtreleri Temizle
          </button>
        </div>
      </div>
    </div>
  );
});

FilterPanel.displayName = 'FilterPanel';

export default FilterPanel;

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
    <div className="w-full lg:w-1/5 lg:sticky lg:top-4 lg:self-start h-fit z-10 mt-20">
      <div className="filter-panel bg-white p-4 flex-shrink-5 border border-gray-200 rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-gray-700">Filtreler</h3> 
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
        
        <div className={`${showFilters ? 'block' : 'hidden'} lg:block space-y-4`}>
          {/* Arama Kutusu */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Ürün Ara
            </label>
            <input
              type="text"
              placeholder="Ürün ara..."
              value={searchQuery}
              onChange={onSearchChange}
              className="w-full border border-gray-200 px-2 py-1.5 text-sm rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Kategori Filtresi - Sadece categories prop'u varsa göster */}
          {categories && (
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Kategori
              </label>
              <select
                value={selectedCategory || ""}
                onChange={onCategoryChange}
                className="w-full border border-gray-200 px-2 py-1.5 text-sm rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
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
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Fiyat Aralığı
            </label>
            <div className="space-y-1">
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={onMinPriceChange}
                min="0"
                className="w-full border border-gray-200 px-2 py-1.5 text-sm rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={onMaxPriceChange}
                min="0"
                className="w-full border border-gray-200 px-2 py-1.5 text-sm rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Mağaza Filtresi */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Mağaza
            </label>
            <select
              value={selectedStore}
              onChange={onStoreChange}
              className="w-full border border-gray-200 px-2 py-1.5 text-sm rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
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
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Sıralama
            </label>
            <select
              value={sort}
              onChange={onSortChange}
              className="w-full border border-gray-200 px-2 py-1.5 text-sm rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
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
            className="w-full bg-gray-100 text-gray-600 py-1.5 px-3 text-sm rounded-md hover:bg-gray-200 transition-colors border border-gray-200"
          >
            Temizle
          </button>
        </div>
      </div>
    </div>
  );
});

FilterPanel.displayName = 'FilterPanel';

export default FilterPanel;
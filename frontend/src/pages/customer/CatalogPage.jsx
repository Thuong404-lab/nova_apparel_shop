import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, SlidersHorizontal, RotateCcw, Search, Check, Sparkles } from 'lucide-react';
import { productApi } from '../../services/api';
import { ProductCard } from '../../components/common/ProductCard';
import { ProductQuickViewModal } from '../../components/common/ProductQuickViewModal';
import { formatCurrency } from '../../utils/formatters';

export const CatalogPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // Filters State
  const categoryParam = searchParams.get('category') || 'all';
  const searchParam = searchParams.get('search') || '';
  const sortParam = searchParams.get('sort') || 'default';

  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [selectedColor, setSelectedColor] = useState('all');
  const [selectedSize, setSelectedSize] = useState('all');
  const [priceRange, setPriceRange] = useState(2000000);
  const [sortBy, setSortBy] = useState(sortParam);
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  useEffect(() => {
    setSelectedCategory(searchParams.get('category') || 'all');
  }, [searchParams]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [prodRes, catRes, colRes, sizeRes] = await Promise.all([
          productApi.getAll({
            category: selectedCategory !== 'all' ? selectedCategory : undefined,
            search: searchParam || undefined
          }),
          productApi.getCategories(),
          productApi.getColors(),
          productApi.getSizes()
        ]);

        if (prodRes.success) setProducts(prodRes.data);
        if (catRes.success) setCategories(catRes.data);
        if (colRes.success) setColors(colRes.data);
        if (sizeRes.success) setSizes(sizeRes.data);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedCategory, searchParam]);

  // Client-side filtering for color, size, price, and sorting
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Category filter
      if (selectedCategory !== 'all' && p.categoryId !== selectedCategory) {
        return false;
      }
      // Price filter
      if (p.basePrice > priceRange) {
        return false;
      }
      // Color filter
      if (selectedColor !== 'all') {
        const hasColor = p.variants?.some((v) => v.colorId === selectedColor);
        if (!hasColor) return false;
      }
      // Size filter
      if (selectedSize !== 'all') {
        const hasSize = p.variants?.some((v) => v.sizeName === selectedSize);
        if (!hasSize) return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.basePrice - b.basePrice;
      if (sortBy === 'price-desc') return b.basePrice - a.basePrice;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0;
    });
  }, [products, selectedCategory, selectedColor, selectedSize, priceRange, sortBy]);

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSelectedColor('all');
    setSelectedSize('all');
    setPriceRange(2000000);
    setSortBy('default');
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* 1. Header & Breadcrumb */}
      <div className="bg-zinc-950 text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <span className="text-xs font-semibold uppercase tracking-widest text-emerald-400">
            NOVA APPAREL // COLLECTION 2026
          </span>
          <h1 className="font-display font-bold text-3xl sm:text-5xl text-white">
            {searchParam ? `Kết Quả Tìm Kiếm: "${searchParam}"` : 'Tất Cả Sản Phẩm'}
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 font-light max-w-xl">
            Tuyển tập các mẫu áo thun, áo khoác biker, quần cargo và phụ kiện may đo cao cấp.
          </p>
        </div>
      </div>

      {/* 2. Main Filter & Grid Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Mobile Filter Toggle */}
        <div className="lg:hidden flex items-center justify-between col-span-1 bg-white p-4 rounded-2xl border border-zinc-200 shadow-sm">
          <button
            onClick={() => setShowMobileFilter(!showMobileFilter)}
            className="luxury-btn-secondary text-xs flex items-center gap-2"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Bộ Lọc ({filteredProducts.length})</span>
          </button>
          <button
            onClick={handleResetFilters}
            className="text-xs text-zinc-500 hover:text-black flex items-center gap-1 font-medium"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Đặt lại</span>
          </button>
        </div>

        {/* Sidebar Filters (Desktop) */}
        <aside className={`lg:col-span-3 space-y-6 ${showMobileFilter ? 'block' : 'hidden lg:block'}`}>
          <div className="bg-white rounded-2xl border border-zinc-200 p-6 space-y-6 shadow-sm sticky top-28">
            
            <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
              <h3 className="font-display font-bold text-base text-zinc-900 flex items-center gap-2">
                <Filter className="w-4 h-4 text-emerald-600" />
                <span>Bộ Lọc Tìm Kiếm</span>
              </h3>
              <button
                onClick={handleResetFilters}
                className="text-[11px] text-zinc-500 hover:text-black flex items-center gap-1 font-medium transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Xóa lọc</span>
              </button>
            </div>

            {/* Category Filter */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">Danh Mục</h4>
              <div className="space-y-1.5">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-colors flex items-center justify-between ${
                    selectedCategory === 'all'
                      ? 'bg-zinc-950 text-white font-semibold'
                      : 'text-zinc-600 hover:bg-zinc-100'
                  }`}
                >
                  <span>Tất cả danh mục</span>
                  {selectedCategory === 'all' && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.categoryId}
                    onClick={() => setSelectedCategory(cat.categoryId)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-colors flex items-center justify-between ${
                      selectedCategory === cat.categoryId
                        ? 'bg-zinc-950 text-white font-semibold'
                        : 'text-zinc-600 hover:bg-zinc-100'
                    }`}
                  >
                    <span>{cat.name}</span>
                    {selectedCategory === cat.categoryId && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div className="space-y-3 pt-4 border-t border-zinc-100">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-zinc-900 uppercase tracking-wider">Khoảng Giá</span>
                <span className="font-mono text-zinc-900 font-semibold">{formatCurrency(priceRange)}</span>
              </div>
              <input
                type="range"
                min={200000}
                max={2000000}
                step={50000}
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full accent-zinc-950 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-zinc-400 font-mono">
                <span>200.000₫</span>
                <span>2.000.000₫</span>
              </div>
            </div>

            {/* Colors Filter */}
            <div className="space-y-3 pt-4 border-t border-zinc-100">
              <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">Màu Sắc</h4>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedColor('all')}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                    selectedColor === 'all'
                      ? 'bg-zinc-950 text-white border-zinc-950'
                      : 'bg-white text-zinc-700 border-zinc-200 hover:border-zinc-400'
                  }`}
                >
                  Tất cả
                </button>
                {colors.map((col) => (
                  <button
                    key={col.colorId}
                    onClick={() => setSelectedColor(col.colorId)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                      selectedColor === col.colorId
                        ? 'bg-zinc-950 text-white border-zinc-950'
                        : 'bg-white text-zinc-700 border-zinc-200 hover:border-zinc-400'
                    }`}
                  >
                    <span 
                      className="w-2.5 h-2.5 rounded-full border border-black/20" 
                      style={{ backgroundColor: col.hexCode }}
                    ></span>
                    <span>{col.colorName.split(' ')[0]}</span>
                  </button>
                ))}
              </div>
            </div>

          </div>
        </aside>

        {/* Product Grid Area */}
        <div className="lg:col-span-9 space-y-6">
          
          {/* Active Filters & Sort Bar */}
          <div className="bg-white rounded-2xl border border-zinc-200 p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
            <div className="text-xs text-zinc-600">
              Tìm thấy <strong className="text-zinc-950 font-bold">{filteredProducts.length}</strong> sản phẩm phù hợp
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs text-zinc-500 whitespace-nowrap">Sắp xếp theo:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-xs font-medium bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 outline-none focus:border-zinc-950 cursor-pointer"
              >
                <option value="default">Mới nhất / Nổi bật</option>
                <option value="price-asc">Giá tăng dần (Thấp - Cao)</option>
                <option value="price-desc">Giá giảm dần (Cao - Thấp)</option>
                <option value="rating">Đánh giá cao nhất</option>
              </select>
            </div>
          </div>

          {/* Product Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="aspect-[3/4] bg-zinc-200/60 rounded-2xl animate-pulse"></div>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="bg-white rounded-2xl border border-zinc-200 p-16 text-center space-y-4 shadow-sm">
              <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mx-auto text-zinc-400">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="font-display font-bold text-xl text-zinc-900">Không Tìm Thấy Sản Phẩm Nào</h3>
              <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                Không có sản phẩm nào phù hợp với tiêu chí lọc đã chọn. Hãy thử điều chỉnh khoảng giá hoặc xóa bộ lọc.
              </p>
              <button
                onClick={handleResetFilters}
                className="luxury-btn-primary text-xs"
              >
                <span>Xóa Tất Cả Bộ Lọc</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((prod) => (
                <ProductCard
                  key={prod.productId}
                  product={prod}
                  onQuickView={(p) => setQuickViewProduct(p)}
                />
              ))}
            </div>
          )}

        </div>

      </div>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <ProductQuickViewModal
          product={quickViewProduct}
          isOpen={!!quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}

    </div>
  );
};

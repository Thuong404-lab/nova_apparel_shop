import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, SlidersHorizontal, RotateCcw, Search, Grid, Check } from 'lucide-react';
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
  const [priceRange, setPriceRange] = useState(1000000);
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
    setPriceRange(1000000);
    setSortBy('default');
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 1. Header & Breadcrumb */}
      <div className="bg-black text-white p-8 border-3 border-black shadow-[6px_6px_0px_#00ff66]">
        <span className="font-mono text-xs text-[#00ff66] uppercase tracking-widest block mb-1">
          NOVA APPAREL // CATALOG 2026
        </span>
        <h1 className="font-display font-black text-3xl sm:text-5xl uppercase tracking-tight">
          {searchParam ? `KẾT QUẢ TÌM KIẾM: "${searchParam}"` : 'TẤT CẢ SẢN PHẨM'}
        </h1>
        <p className="text-xs sm:text-sm text-neutral-400 mt-2">
          Hiển thị {filteredProducts.length} sản phẩm phù hợp với phong cách của bạn
        </p>
      </div>

      {/* 2. Main Filter & Grid Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Mobile Filter Toggle */}
        <div className="lg:hidden flex items-center justify-between col-span-1 bg-white p-4 border-2 border-black shadow-[3px_3px_0px_#000]">
          <button
            onClick={() => setShowMobileFilter(!showMobileFilter)}
            className="neo-btn neo-btn-secondary text-xs flex items-center gap-2"
          >
            <Filter className="w-4 h-4" /> {showMobileFilter ? 'Ẩn Bộ Lọc' : 'Mở Bộ Lọc'}
          </button>
          <span className="font-display font-bold text-xs">{filteredProducts.length} sản phẩm</span>
        </div>

        {/* LEFT SIDEBAR: FILTERS */}
        <aside className={`lg:col-span-3 space-y-6 ${showMobileFilter ? 'block' : 'hidden lg:block'}`}>
          <div className="bg-white border-2 border-black p-6 shadow-[5px_5px_0px_#000] space-y-6 sticky top-28">
            
            <div className="flex items-center justify-between pb-3 border-b-2 border-black">
              <h3 className="font-display font-black text-base uppercase flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4" /> BỘ LỌC
              </h3>
              <button
                onClick={handleResetFilters}
                className="text-xs font-mono font-bold text-neutral-500 hover:text-red-600 flex items-center gap-1"
                title="Đặt lại bộ lọc"
              >
                <RotateCcw className="w-3 h-3" /> Reset
              </button>
            </div>

            {/* Category Filter */}
            <div>
              <h4 className="font-display font-bold text-xs uppercase tracking-wider mb-3">
                Danh Mục
              </h4>
              <div className="space-y-1.5">
                <button
                  onClick={() => { setSelectedCategory('all'); setSearchParams({}); }}
                  className={`w-full text-left px-3 py-2 text-xs font-display font-bold transition-all border ${
                    selectedCategory === 'all'
                      ? 'bg-black text-[#00ff66] border-black shadow-[2px_2px_0px_#000]'
                      : 'bg-neutral-50 text-neutral-700 border-neutral-200 hover:bg-neutral-100'
                  }`}
                >
                  Tất Cả Danh Mục
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.categoryId}
                    onClick={() => {
                      setSelectedCategory(cat.categoryId);
                      setSearchParams({ category: cat.categoryId });
                    }}
                    className={`w-full text-left px-3 py-2 text-xs font-display font-bold transition-all border flex items-center justify-between ${
                      selectedCategory === cat.categoryId
                        ? 'bg-black text-[#00ff66] border-black shadow-[2px_2px_0px_#000]'
                        : 'bg-neutral-50 text-neutral-700 border-neutral-200 hover:bg-neutral-100'
                    }`}
                  >
                    <span>{cat.name}</span>
                    <span className="font-mono text-[10px] opacity-75">{cat.count}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range Slider */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-display font-bold text-xs uppercase tracking-wider">
                  Mức Giá Tối Đa
                </h4>
                <span className="font-mono text-xs font-black text-black">
                  {formatCurrency(priceRange)}
                </span>
              </div>
              <input
                type="range"
                min={100000}
                max={1000000}
                step={50000}
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full accent-black cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-neutral-500 mt-1">
                <span>100.000₫</span>
                <span>1.000.000₫</span>
              </div>
            </div>

            {/* Color Swatch Filter */}
            <div>
              <h4 className="font-display font-bold text-xs uppercase tracking-wider mb-3">
                Màu Sắc
              </h4>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedColor('all')}
                  className={`px-2.5 py-1 text-[11px] font-bold border-2 border-black ${
                    selectedColor === 'all' ? 'bg-black text-white' : 'bg-white text-black'
                  }`}
                >
                  Tất cả
                </button>
                {colors.map((c) => (
                  <button
                    key={c.colorId}
                    onClick={() => setSelectedColor(selectedColor === c.colorId ? 'all' : c.colorId)}
                    className={`w-7 h-7 rounded-full border-2 border-black flex items-center justify-center transition-transform ${
                      selectedColor === c.colorId ? 'scale-110 ring-2 ring-black ring-offset-2' : 'hover:scale-105'
                    }`}
                    style={{ backgroundColor: c.hexCode || '#000' }}
                    title={c.colorName}
                  >
                    {selectedColor === c.colorId && (
                      <Check className={`w-3.5 h-3.5 ${c.colorName.includes('Trắng') || c.colorName.includes('Be') ? 'text-black' : 'text-white'}`} />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Pills Filter */}
            <div>
              <h4 className="font-display font-bold text-xs uppercase tracking-wider mb-3">
                Kích Thước
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {['all', 'S', 'M', 'L', 'XL', 'FreeSize', '29', '30', '31', '32'].map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setSelectedSize(selectedSize === sz ? 'all' : sz)}
                    className={`px-3 py-1 text-xs font-display font-bold border-2 border-black transition-all ${
                      selectedSize === sz
                        ? 'bg-black text-[#00ff66] shadow-[2px_2px_0px_#000]'
                        : 'bg-white hover:bg-neutral-100 shadow-[1px_1px_0px_#000]'
                    }`}
                  >
                    {sz === 'all' ? 'Tất cả' : sz}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </aside>

        {/* RIGHT CONTENT: PRODUCT GRID */}
        <main className="lg:col-span-9 space-y-6">
          {/* Top Sort & Count Bar */}
          <div className="bg-white border-2 border-black p-4 shadow-[4px_4px_0px_#000] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="text-xs font-mono font-bold text-neutral-600">
              HIỂN THỊ <span className="text-black font-black">{filteredProducts.length}</span> KẾT QUẢ
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-display font-bold uppercase text-neutral-600">Sắp xếp theo:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-1.5 bg-white border-2 border-black font-display font-bold text-xs focus:outline-none shadow-[2px_2px_0px_#000]"
              >
                <option value="default">Mặc định (Nổi bật)</option>
                <option value="price-asc">Giá: Thấp đến Cao</option>
                <option value="price-desc">Giá: Cao đến Thấp</option>
                <option value="rating">Đánh giá cao nhất</option>
              </select>
            </div>
          </div>

          {/* Product Grid */}
          {filteredProducts.length === 0 ? (
            <div className="bg-white border-2 border-black p-16 text-center shadow-[6px_6px_0px_#000] space-y-4">
              <div className="w-16 h-16 bg-neutral-100 border-2 border-black flex items-center justify-center mx-auto shadow-[4px_4px_0px_#000]">
                <Search className="w-8 h-8 text-neutral-400" />
              </div>
              <h3 className="font-display font-black text-lg uppercase">Không tìm thấy sản phẩm</h3>
              <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                Không có sản phẩm nào khớp với bộ lọc bạn đã chọn. Vui lòng thử tìm kiếm hoặc thiết lập lại bộ lọc.
              </p>
              <button
                onClick={handleResetFilters}
                className="neo-btn neo-btn-neon text-xs"
              >
                Xóa Bộ Lọc
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map((prod) => (
                <ProductCard
                  key={prod.productId}
                  product={prod}
                  onQuickView={(p) => setQuickViewProduct(p)}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Quick View Modal */}
      <ProductQuickViewModal
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </div>
  );
};

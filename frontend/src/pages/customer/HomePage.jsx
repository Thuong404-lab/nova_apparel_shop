import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Sparkles, 
  Flame, 
  TrendingUp, 
  ShoppingBag, 
  ShieldCheck, 
  Zap, 
  Star,
  Quote
} from 'lucide-react';
import { productApi } from '../../services/api';
import { ProductCard } from '../../components/common/ProductCard';
import { ProductQuickViewModal } from '../../components/common/ProductQuickViewModal';

export const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          productApi.getAll(),
          productApi.getCategories()
        ]);
        if (prodRes.success) setProducts(prodRes.data);
        if (catRes.success) setCategories(catRes.data);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const bestSellers = products.slice(0, 4);
  const newArrivals = products.slice(4, 8);

  return (
    <div className="space-y-20">
      {/* 1. HERO BANNER */}
      <section className="relative bg-black text-white border-b-4 border-black overflow-hidden py-16 md:py-24">
        {/* Background Gradients & Grid Pattern */}
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#00ff66_1px,transparent_1px)] [background-size:24px_24px]" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <span className="inline-block px-3 py-1 bg-black text-[#00ff66] font-mono text-xs font-bold uppercase tracking-widest border border-black shadow-[2px_2px_0px_#000] mb-4">
                NOVA APPAREL // 2026 RUNWAY DROP
              </span>
              <h1 className="font-display font-black text-4xl sm:text-6xl lg:text-7xl tracking-tighter uppercase leading-[0.9] text-white">
                ĐỊNH HÌNH <br className="hidden sm:inline" />
                <span className="text-stroke-white text-transparent hover:text-white transition-colors">PHONG CÁCH</span> <br />
                ĐƯỜNG PHỐ
              </h1>

              <p className="text-neutral-300 text-sm sm:text-base max-w-lg leading-relaxed font-medium">
                Khám phá các thiết kế thời trang đường phố phá cách, chất liệu cao cấp chuẩn xuất khẩu với trải nghiệm mua sắm mượt mà nhất.
              </p>

              <div className="flex flex-wrap gap-4 pt-4">
                <Link
                  to="/catalog"
                  className="px-8 py-4 bg-[#00ff66] text-black font-display font-black text-sm uppercase tracking-wider border-2 border-white shadow-[5px_5px_0px_#fff] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_#fff] transition-all flex items-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" /> Mua Sắm Ngay
                </Link>
                <Link
                  to="/catalog?category=CAT002"
                  className="px-8 py-4 bg-transparent text-white font-display font-black text-sm uppercase tracking-wider border-2 border-white shadow-[5px_5px_0px_#00ff66] hover:bg-white hover:text-black transition-all flex items-center gap-2"
                >
                  Outerwear 2026 <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Stats Bar */}
              <div className="grid grid-cols-3 gap-6 pt-8 border-t border-neutral-800 max-w-md">
                <div>
                  <span className="font-display font-black text-2xl text-[#00ff66] block">5,000+</span>
                  <span className="text-[11px] text-neutral-400 font-mono">ĐƠN HÀNG ĐÃ GIAO</span>
                </div>
                <div>
                  <span className="font-display font-black text-2xl text-[#00ff66] block">99.4%</span>
                  <span className="text-[11px] text-neutral-400 font-mono">HÀI LÒNG</span>
                </div>
                <div>
                  <span className="font-display font-black text-2xl text-[#00ff66] block">100%</span>
                  <span className="text-[11px] text-neutral-400 font-mono">CHÍNH HÃNG</span>
                </div>
              </div>
            </div>

            {/* Right Hero Image Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md bg-neutral-900 border-4 border-white p-3 shadow-[12px_12px_0px_#00ff66]">
                <img
                  src="https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800"
                  alt="Streetwear Hero"
                  className="w-full aspect-[3/4] object-cover border-2 border-black"
                />
                
                {/* Floating Badge */}
                <div className="absolute -bottom-6 -left-6 bg-white text-black p-4 border-3 border-black shadow-[6px_6px_0px_#000] max-w-[200px]">
                  <span className="text-[10px] font-mono font-bold text-neutral-500 uppercase block">Ưu đãi hôm nay</span>
                  <span className="font-display font-black text-sm leading-tight block">GIẢM 20% CHO KHÁCH HÀNG MỚI</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. CATEGORY SPOTLIGHT GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b-2 border-black gap-4">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-[#ff4d00] font-bold block mb-1">
              DISCOVER BY CATEGORY
            </span>
            <h2 className="font-display font-black text-2xl sm:text-4xl uppercase tracking-tight">
              DANH MỤC THỜI TRANG
            </h2>
          </div>
          <Link
            to="/catalog"
            className="font-display font-bold text-xs uppercase tracking-wider hover:text-[#ff4d00] flex items-center gap-1.5"
          >
            Xem toàn bộ <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.categoryId}
              to={`/catalog?category=${cat.categoryId}`}
              className="group relative bg-white border-2 border-black p-4 shadow-[4px_4px_0px_#000] hover:shadow-[7px_7px_0px_#00ff66] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all flex flex-col justify-between aspect-square"
            >
              <div className="aspect-[4/3] bg-neutral-100 border border-black overflow-hidden mb-3">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div>
                <h3 className="font-display font-bold text-sm uppercase leading-tight group-hover:text-[#ff4d00] transition-colors">
                  {cat.name}
                </h3>
                <span className="text-[10px] font-mono text-neutral-500 font-semibold block mt-0.5">
                  {cat.count} SẢN PHẨM
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. BEST SELLERS SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8 pb-4 border-b-2 border-black">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-black text-[#00ff66] flex items-center justify-center border-2 border-black shadow-[2px_2px_0px_#000]">
              <Flame className="w-4 h-4 fill-current" />
            </div>
            <div>
              <h2 className="font-display font-black text-2xl sm:text-3xl uppercase tracking-tight">
                SẢN PHẨM BÁN CHẠY NHẤT
              </h2>
              <p className="text-xs text-neutral-500 font-mono">XU HƯỚNG ĐƯỢC YÊU THÍCH TRONG TUẦN</p>
            </div>
          </div>
          <Link
            to="/catalog?sort=rating"
            className="hidden sm:inline-flex neo-btn neo-btn-secondary text-xs"
          >
            Xem Tất Cả
          </Link>
        </div>

        <div className="fashion-grid">
          {bestSellers.map((prod) => (
            <ProductCard
              key={prod.productId}
              product={prod}
              onQuickView={(p) => setQuickViewProduct(p)}
            />
          ))}
        </div>
      </section>

      {/* 4. HIGH-FASHION PROMO BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative bg-gradient-to-r from-neutral-950 via-neutral-900 to-black text-white border-4 border-black p-8 md:p-14 shadow-[10px_10px_0px_#ff4d00] overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center relative z-10">
            <div className="space-y-4">
              <span className="neo-badge bg-[#ff4d00] text-white border-white text-xs">
                LIMITED EDITION
              </span>
              <h2 className="font-display font-black text-3xl sm:text-5xl uppercase tracking-tight leading-none">
                BỘ SƯU TẬP HOODIE & BIKER JACKET 2026
              </h2>
              <p className="text-xs sm:text-sm text-neutral-300 max-w-md leading-relaxed font-medium">
                Da PU cao cấp không nổ kết hợp nỉ bông 380gsm chuẩn Y2K. Thiết kế giới hạn chỉ 100 chiếc mỗi mẫu.
              </p>
              <div className="pt-2">
                <Link
                  to="/catalog?category=CAT002"
                  className="inline-flex neo-btn neo-btn-neon text-xs"
                >
                  Khám Phá Ngay <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="flex justify-center lg:justify-end">
              <div className="relative max-w-xs border-2 border-white bg-white p-2 shadow-[8px_8px_0px_#00ff66]">
                <img
                  src="https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600"
                  alt="Hoodie Cyberpunk"
                  className="w-full aspect-[4/5] object-cover border border-black"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. NEW ARRIVALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8 pb-4 border-b-2 border-black">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-black text-[#ff4d00] flex items-center justify-center border-2 border-black shadow-[2px_2px_0px_#000]">
              <Sparkles className="w-4 h-4 fill-current" />
            </div>
            <div>
              <h2 className="font-display font-black text-2xl sm:text-3xl uppercase tracking-tight">
                HÀNG MỚI VỀ
              </h2>
              <p className="text-xs text-neutral-500 font-mono">CẬP NHẬT MỖI TUẦN TẠI HỆ THỐNG</p>
            </div>
          </div>
          <Link
            to="/catalog"
            className="hidden sm:inline-flex neo-btn neo-btn-secondary text-xs"
          >
            Xem Thêm
          </Link>
        </div>

        <div className="fashion-grid">
          {newArrivals.map((prod) => (
            <ProductCard
              key={prod.productId}
              product={prod}
              onQuickView={(p) => setQuickViewProduct(p)}
            />
          ))}
        </div>
      </section>

      {/* 6. CUSTOMER REVIEWS & TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border-3 border-black p-8 md:p-12 shadow-[8px_8px_0px_#000]">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="font-mono text-xs uppercase tracking-widest text-[#ff4d00] font-bold block mb-1">
              COMMUNITY VOICES
            </span>
            <h2 className="font-display font-black text-2xl sm:text-4xl uppercase tracking-tight">
              KHÁCH HÀNG NÓI GÌ VỀ CHÚNG TÔI
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-neutral-50 border-2 border-black shadow-[4px_4px_0px_#000] space-y-4">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-xs text-neutral-700 leading-relaxed font-medium">
                "Áo thun Shark oversize dày dặn, vải 100% cotton mát rượi, giao hàng cực nhanh chỉ 2 ngày là nhận được!"
              </p>
              <div className="flex items-center gap-3 pt-2 border-t border-neutral-200">
                <img
                  src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100"
                  alt="Avatar"
                  className="w-8 h-8 rounded-full border border-black"
                />
                <div>
                  <h4 className="font-display font-bold text-xs">Nguyễn Văn A</h4>
                  <span className="text-[10px] font-mono text-neutral-500">Khách hàng thân thiết</span>
                </div>
              </div>
            </div>

            <div className="p-6 bg-neutral-50 border-2 border-black shadow-[4px_4px_0px_#000] space-y-4">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-xs text-neutral-700 leading-relaxed font-medium">
                "Biker jacket lên form cực đỉnh, khóa kéo mạ tĩnh điện sáng bóng. Trải nghiệm thanh toán qua ví rất mượt."
              </p>
              <div className="flex items-center gap-3 pt-2 border-t border-neutral-200">
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100"
                  alt="Avatar"
                  className="w-8 h-8 rounded-full border border-black"
                />
                <div>
                  <h4 className="font-display font-bold text-xs">Trần Thị Bích</h4>
                  <span className="text-[10px] font-mono text-neutral-500">Hà Nội</span>
                </div>
              </div>
            </div>

            <div className="p-6 bg-neutral-50 border-2 border-black shadow-[4px_4px_0px_#000] space-y-4">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-xs text-neutral-700 leading-relaxed font-medium">
                "Giao diện website cực kỳ xịn xò, hiện đại, xem chi tiết từng màu sắc và kích thước tồn kho rất rõ ràng!"
              </p>
              <div className="flex items-center gap-3 pt-2 border-t border-neutral-200">
                <img
                  src="https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100"
                  alt="Avatar"
                  className="w-8 h-8 rounded-full border border-black"
                />
                <div>
                  <h4 className="font-display font-bold text-xs">Lê Quang Cường</h4>
                  <span className="text-[10px] font-mono text-neutral-500">Đà Nẵng</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick View Modal */}
      <ProductQuickViewModal
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </div>
  );
};

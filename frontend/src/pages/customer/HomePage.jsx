import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Truck, 
  RefreshCw, 
  CreditCard, 
  Star,
  ChevronRight,
  TrendingUp,
  Plus,
  ShoppingBag,
  Zap,
  Flame,
  Layers
} from 'lucide-react';
import { ProductCard } from '../../components/common/ProductCard';
import { ProductQuickViewModal } from '../../components/common/ProductQuickViewModal';
import { productApi } from '../../services/api';
import { formatCurrency } from '../../utils/formatters';
import { useCart } from '../../context/CartContext';

export const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [activeHeroSlide, setActiveHeroSlide] = useState(0);
  const [activeHotspot, setActiveHotspot] = useState(null);
  const { addItem } = useCart();

  useEffect(() => {
    async function loadData() {
      const prodRes = await productApi.getAll();
      if (prodRes.success) setProducts(prodRes.data);

      const catRes = await productApi.getCategories();
      if (catRes.success) setCategories(catRes.data);
    }
    loadData();
  }, []);

  // Auto-switch hero slide
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveHeroSlide((prev) => (prev + 1) % 3);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const heroSlides = [
    {
      subtitle: 'SPRING / SUMMER 2026 RUNWAY',
      title: 'ĐỊNH HÌNH PHONG CÁCH',
      highlight: 'ĐỘC BẢN',
      description: 'Phá vỡ các giới hạn thiết kế với chất liệu da PU cao cấp, kỹ thuật wash xám khói và đường cắt may thủ công tỉ mỉ.',
      cta: 'Khám Phá Bộ Sưu Tập',
      link: '/catalog?category=CAT002',
      bgImg: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1600',
      badge: 'NEW DROP 2026'
    },
    {
      subtitle: 'CYBER TECHWEAR & TACTICAL',
      title: 'HIỆN ĐẠI & PHÓNG KHOÁNG',
      highlight: 'ĐƯỜNG PHỐ',
      description: 'Vải Cotton 380gsm siêu dày dặn kết hợp cùng quần Cargo 6 túi hộp đa năng mang đến diện mạo cực chất.',
      cta: 'Xem Techwear Drop',
      link: '/catalog?category=CAT003',
      bgImg: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=1600',
      badge: 'BEST FOR WINTER'
    },
    {
      subtitle: 'MINIMALIST LUXE ESSENTIALS',
      title: 'SỰ TINH TẾ TỪ',
      highlight: 'SỢI VẢI',
      description: 'Áo thun Shark Graphic 250gsm dập phom đứng dáng cùng phụ kiện nón đính kim loại laser tinh xảo.',
      cta: 'Mua Ngay Bán Chạy',
      link: '/catalog?category=CAT001',
      bgImg: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=1600',
      badge: 'TOP TRENDING'
    }
  ];

  const bestSellers = products.slice(0, 4);
  const newArrivals = products.slice(2, 6);

  return (
    <div className="space-y-24 pb-24">
      
      {/* 1. DYNAMIC HERO LOOKBOOK SLIDER */}
      <section className="relative bg-zinc-950 text-white min-h-[580px] lg:min-h-[660px] flex items-center overflow-hidden">
        
        {/* Background Slide Images with Crossfade */}
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              activeHeroSlide === index ? 'opacity-40 scale-100' : 'opacity-0 scale-105 pointer-events-none'
            }`}
          >
            <img 
              src={slide.bgImg} 
              alt={slide.title}
              className="w-full h-full object-cover object-center filter grayscale contrast-125 transition-transform duration-10000 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/80 to-transparent"></div>
          </div>
        ))}

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
          <div className="max-w-2xl space-y-6 animate-in fade-in duration-700">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-zinc-900/90 backdrop-blur-md rounded-full text-zinc-300 text-xs font-semibold border border-zinc-700/80 shadow-lg">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span className="font-mono uppercase tracking-wider">{heroSlides[activeHeroSlide].subtitle}</span>
            </div>

            <h1 className="font-display font-black text-4xl sm:text-6xl lg:text-7xl tracking-tight text-white leading-[1.02]">
              {heroSlides[activeHeroSlide].title} <br />
              <span className="text-emerald-400 italic font-serif underline decoration-zinc-700 decoration-2 underline-offset-8">
                {heroSlides[activeHeroSlide].highlight}
              </span>
            </h1>

            <p className="text-zinc-300 text-base sm:text-lg leading-relaxed font-normal max-w-xl">
              {heroSlides[activeHeroSlide].description}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-3">
              <Link 
                to={heroSlides[activeHeroSlide].link} 
                className="luxury-btn-accent px-8 py-4 text-sm font-bold shadow-lg shadow-emerald-500/20"
              >
                <span>{heroSlides[activeHeroSlide].cta}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              
              <Link 
                to="/catalog" 
                className="px-6 py-4 rounded-xl text-sm font-semibold bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20 transition-all hover:scale-[1.02]"
              >
                Xem Toàn Bộ Catalog
              </Link>
            </div>

            {/* Slide Indicators */}
            <div className="flex items-center gap-3 pt-8">
              {heroSlides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveHeroSlide(i)}
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    activeHeroSlide === i ? 'w-10 bg-emerald-400' : 'w-3 bg-zinc-700 hover:bg-zinc-500'
                  }`}
                  aria-label={`Chuyển đến slide ${i + 1}`}
                />
              ))}
            </div>

          </div>
        </div>

        {/* Ambient Glow Orb */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
      </section>

      {/* 2. INFINITE RUNWAY TYPOGRAPHY TICKER */}
      <div className="bg-zinc-950 text-white py-4 border-y border-zinc-800 overflow-hidden select-none">
        <div className="animate-ticker text-xs font-mono font-bold tracking-widest uppercase flex items-center gap-8">
          {[...Array(6)].map((_, i) => (
            <React.Fragment key={i}>
              <span className="flex items-center gap-2 text-zinc-300">
                <Flame className="w-4 h-4 text-emerald-400" />
                SPRING / SUMMER 2026 RUNWAY
              </span>
              <span className="text-zinc-600">•</span>
              <span className="text-emerald-400">LIMITED EDITION DROPS</span>
              <span className="text-zinc-600">•</span>
              <span className="text-zinc-300">HAUTE COUTURE MEETS STREETWEAR</span>
              <span className="text-zinc-600">•</span>
              <span className="text-zinc-400">NOVA // RAW & REFINED</span>
              <span className="text-zinc-600">•</span>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* 3. CATEGORY CURATION CARDS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">
              DANH MỤC TUYỂN CHỌN
            </span>
            <h2 className="font-display font-black text-2xl sm:text-4xl text-zinc-900 mt-1">
              Khám Phá Theo Phong Cách
            </h2>
          </div>
          <Link 
            to="/catalog" 
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-zinc-900 hover:text-emerald-600 transition-colors group"
          >
            <span>Xem tất cả danh mục</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {[
            { id: 'CAT001', name: 'Áo Thun Graphic', img: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800', count: '18 sản phẩm' },
            { id: 'CAT002', name: 'Áo Khoác Biker & Bomber', img: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800', count: '12 sản phẩm' },
            { id: 'CAT003', name: 'Quần Cargo Tactical', img: 'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?w=800', count: '15 sản phẩm' },
            { id: 'CAT004', name: 'Đầm & Chân Váy', img: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=800', count: '9 sản phẩm' },
          ].map((cat) => (
            <Link
              key={cat.id}
              to={`/catalog?category=${cat.id}`}
              className="group relative aspect-[4/5] rounded-3xl overflow-hidden bg-zinc-100 shadow-sm hover:shadow-2xl transition-all duration-500 ease-out"
            >
              <img 
                src={cat.img} 
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent"></div>
              <div className="absolute inset-x-5 bottom-5 text-white">
                <p className="font-display font-bold text-base sm:text-lg leading-tight group-hover:text-emerald-400 transition-colors">
                  {cat.name}
                </p>
                <p className="text-xs text-zinc-300 font-light mt-1">{cat.count}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. BEST SELLERS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500"></span>
              <span className="text-xs font-bold uppercase tracking-widest text-rose-600">
                XU HƯỚNG BÁN CHẠY
              </span>
            </div>
            <h2 className="font-display font-black text-2xl sm:text-4xl text-zinc-900 mt-1">
              Top Sản Phẩm Yêu Thích Nhất
            </h2>
          </div>
          <Link 
            to="/catalog" 
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-zinc-900 hover:text-emerald-600 transition-colors group"
          >
            <span>Xem toàn bộ BST</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
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

      {/* 5. SHOPPABLE OUTFIT LOOKBOOK (Interactive Hotspots) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-zinc-950 text-white rounded-3xl p-8 sm:p-12 lg:p-16 relative overflow-hidden">
          <div className="grid lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Description */}
            <div className="lg:col-span-5 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-950 text-emerald-400 border border-emerald-800 rounded-full text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>INTERACTIVE LOOKBOOK</span>
              </div>

              <h2 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl leading-tight">
                Shop The Full <br />
                <span className="text-emerald-400">Streetwear Look</span>
              </h2>

              <p className="text-zinc-300 text-sm sm:text-base leading-relaxed">
                Khám phá bản phối thời trang đỉnh cao từ bộ sưu tập Xuân Hè 2026. Di chuột vào từng điểm chấm trên người mẫu để khám phá chi tiết sản phẩm và thêm ngay vào giỏ hàng.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-zinc-900 border border-zinc-800">
                  <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping"></div>
                  <span className="text-xs text-zinc-300 font-medium">Điểm chạm 1: Áo Khoác Biker Jacket (1.450.000₫)</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-zinc-900 border border-zinc-800">
                  <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping"></div>
                  <span className="text-xs text-zinc-300 font-medium">Điểm chạm 2: Quần Cargo Multi-Pocket (680.000₫)</span>
                </div>
              </div>

              <Link 
                to="/catalog"
                className="luxury-btn-accent mt-4"
              >
                <span>Xem Thêm Bản Phối Khác</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Right Interactive Image with Hotspots */}
            <div className="lg:col-span-7 relative aspect-[4/5] sm:aspect-[16/11] rounded-2xl overflow-hidden bg-zinc-900 shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1551028719-00167b16eac5?w=1200" 
                alt="Model Outfit Lookbook"
                className="w-full h-full object-cover object-center filter contrast-110"
              />
              <div className="absolute inset-0 bg-black/20"></div>

              {/* Hotspot 1: Biker Jacket */}
              <div className="absolute top-[35%] left-[45%]">
                <button
                  onMouseEnter={() => setActiveHotspot(1)}
                  onMouseLeave={() => setActiveHotspot(null)}
                  className="relative group p-2 bg-white text-zinc-950 rounded-full shadow-xl hover:scale-125 transition-transform"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span className="absolute inset-0 rounded-full bg-white/60 animate-ping"></span>
                </button>

                {/* Hotspot Card Popup */}
                {activeHotspot === 1 && (
                  <div className="absolute top-8 left-1/2 -translate-x-1/2 w-60 bg-white text-zinc-950 p-3 rounded-2xl shadow-2xl border border-zinc-200 z-30 animate-in zoom-in-95 duration-200">
                    <p className="font-bold text-xs line-clamp-1">Áo Khoác Da Biker Asymmetric</p>
                    <p className="font-mono text-xs font-semibold text-emerald-600 mt-0.5">1.450.000₫</p>
                    <Link
                      to="/product/PROD002"
                      className="mt-2 block w-full py-1.5 bg-zinc-950 text-white text-[11px] font-bold text-center rounded-xl hover:bg-zinc-800"
                    >
                      Xem Chi Tiết
                    </Link>
                  </div>
                )}
              </div>

              {/* Hotspot 2: Cargo Pants */}
              <div className="absolute top-[70%] left-[55%]">
                <button
                  onMouseEnter={() => setActiveHotspot(2)}
                  onMouseLeave={() => setActiveHotspot(null)}
                  className="relative group p-2 bg-white text-zinc-950 rounded-full shadow-xl hover:scale-125 transition-transform"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span className="absolute inset-0 rounded-full bg-white/60 animate-ping"></span>
                </button>

                {/* Hotspot Card Popup */}
                {activeHotspot === 2 && (
                  <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-60 bg-white text-zinc-950 p-3 rounded-2xl shadow-2xl border border-zinc-200 z-30 animate-in zoom-in-95 duration-200">
                    <p className="font-bold text-xs line-clamp-1">Quần Cargo Multi-Pocket Tactical</p>
                    <p className="font-mono text-xs font-semibold text-emerald-600 mt-0.5">680.000₫</p>
                    <Link
                      to="/product/PROD003"
                      className="mt-2 block w-full py-1.5 bg-zinc-950 text-white text-[11px] font-bold text-center rounded-xl hover:bg-zinc-800"
                    >
                      Xem Chi Tiết
                    </Link>
                  </div>
                )}
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* 6. NEW ARRIVALS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">
                THIẾT KẾ MỚI TUẦN NÀY
              </span>
            </div>
            <h2 className="font-display font-black text-2xl sm:text-4xl text-zinc-900 mt-1">
              Bộ Sưu Tập New Arrivals
            </h2>
          </div>
          <Link 
            to="/catalog" 
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-zinc-900 hover:text-emerald-600 transition-colors group"
          >
            <span>Khám phá thêm</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
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

      {/* 7. BRAND VALUE PILLARS */}
      <section className="border-t border-zinc-200 pt-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          
          <div className="flex items-start gap-4 p-4 rounded-2xl bg-zinc-50 border border-zinc-100">
            <div className="p-3 bg-zinc-950 rounded-2xl text-emerald-400 flex-shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h4 className="font-display font-bold text-base text-zinc-900">Giao Hàng Siêu Tốc</h4>
              <p className="text-xs text-zinc-500 leading-relaxed">Hỏa tốc 2h nội thành Hà Nội & TP.HCM. Miễn phí vận chuyển toàn quốc từ 500k.</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-2xl bg-zinc-50 border border-zinc-100">
            <div className="p-3 bg-zinc-950 rounded-2xl text-emerald-400 flex-shrink-0">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h4 className="font-display font-bold text-base text-zinc-900">Đổi Trả Trong 7 Ngày</h4>
              <p className="text-xs text-zinc-500 leading-relaxed">Hỗ trợ đổi size và đổi mẫu tận nơi nhanh chóng, miễn phí nếu phát sinh lỗi may.</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-2xl bg-zinc-50 border border-zinc-100">
            <div className="p-3 bg-zinc-950 rounded-2xl text-emerald-400 flex-shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h4 className="font-display font-bold text-base text-zinc-900">Chính Hãng 100%</h4>
              <p className="text-xs text-zinc-500 leading-relaxed">Cam kết chất liệu vải Cotton cao cấp định lượng 250 - 380gsm bền bỉ theo thời gian.</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-2xl bg-zinc-50 border border-zinc-100">
            <div className="p-3 bg-zinc-950 rounded-2xl text-emerald-400 flex-shrink-0">
              <CreditCard className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h4 className="font-display font-bold text-base text-zinc-900">Ví Tiền & VNPay QR</h4>
              <p className="text-xs text-zinc-500 leading-relaxed">Tích hợp Ví Nova Wallet nạp tiền tức thì cùng cổng thanh toán VNPay tiện lợi.</p>
            </div>
          </div>

        </div>
      </section>

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

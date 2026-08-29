import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
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
  Layers,
  Check
} from 'lucide-react';
import { ProductCard } from '../../components/common/ProductCard';
import { ProductQuickViewModal } from '../../components/common/ProductQuickViewModal';
import { productApi } from '../../services/api';
import { formatCurrency } from '../../utils/formatters';
import { useCart } from '../../context/CartContext';
import confetti from 'canvas-confetti';

export const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [activeHeroSlide, setActiveHeroSlide] = useState(0);
  const [activeHotspot, setActiveHotspot] = useState(null);
  const { addItem } = useCart();

  // Mouse Spotlight Effect for Hero
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const heroRef = useRef(null);

  const handleHeroMouseMove = (e) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  useEffect(() => {
    async function loadData() {
      const prodRes = await productApi.getAll();
      if (prodRes.success) setProducts(prodRes.data);

      const catRes = await productApi.getCategories();
      if (catRes.success) setCategories(catRes.data);
    }
    loadData();
  }, []);

  // Auto-switch hero slide every 7s
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveHeroSlide((prev) => (prev + 1) % 3);
    }, 7000);
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

  const handleQuickAdd = (product, e) => {
    e.preventDefault();
    e.stopPropagation();
    const variant = product.variants?.[0] || {
      variantId: `${product.productId}-DEFAULT`,
      productId: product.productId,
      sizeName: 'M',
      colorName: 'Đen (Obsidian)',
      stockQty: 10
    };
    addItem(product, variant, 1);
    
    // Confetti
    const rect = e.currentTarget.getBoundingClientRect();
    confetti({
      particleCount: 30,
      spread: 60,
      origin: {
        x: (rect.left + rect.width / 2) / window.innerWidth,
        y: (rect.top + rect.height / 2) / window.innerHeight
      },
      colors: ['#00ff66', '#09090b', '#ffffff']
    });
  };

  return (
    <div className="space-y-28 pb-28 overflow-x-hidden">
      
      {/* 1. DYNAMIC HERO LOOKBOOK SLIDER WITH MOUSE SPOTLIGHT */}
      <section 
        ref={heroRef}
        onMouseMove={handleHeroMouseMove}
        className="relative bg-zinc-950 text-white min-h-[620px] lg:min-h-[720px] flex items-center overflow-hidden select-none"
      >
        
        {/* Interactive Mouse Spotlight Gradient Glow */}
        <div 
          className="absolute inset-0 pointer-events-none transition-opacity duration-300 z-10"
          style={{
            background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(0, 255, 102, 0.08), transparent 80%)`
          }}
        />

        {/* Background Slide Images with AnimatePresence */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeHeroSlide}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 0.42, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
          >
            <img 
              src={heroSlides[activeHeroSlide].bgImg} 
              alt={heroSlides[activeHeroSlide].title}
              className="w-full h-full object-cover object-center filter grayscale contrast-125"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/80 to-transparent"></div>
          </motion.div>
        </AnimatePresence>

        {/* Hero Content */}
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
          <div className="max-w-2xl space-y-7">
            
            {/* Animated Subtitle Badge */}
            <motion.div 
              key={`badge-${activeHeroSlide}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 bg-zinc-900/90 backdrop-blur-md rounded-full text-zinc-300 text-xs font-semibold border border-zinc-700/80 shadow-lg"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span className="font-mono uppercase tracking-wider">{heroSlides[activeHeroSlide].subtitle}</span>
            </motion.div>

            {/* Title with Smooth Stagger Animation */}
            <motion.h1 
              key={`title-${activeHeroSlide}`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-display font-black text-4xl sm:text-6xl lg:text-7xl tracking-tight text-white leading-[1.02]"
            >
              {heroSlides[activeHeroSlide].title} <br />
              <span className="text-emerald-400 italic font-serif underline decoration-zinc-700 decoration-2 underline-offset-8">
                {heroSlides[activeHeroSlide].highlight}
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p 
              key={`desc-${activeHeroSlide}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-zinc-300 text-base sm:text-lg leading-relaxed font-normal max-w-xl"
            >
              {heroSlides[activeHeroSlide].description}
            </motion.p>

            {/* Magnetic CTA Buttons */}
            <motion.div 
              key={`cta-${activeHeroSlide}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="flex flex-wrap items-center gap-4 pt-3"
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link 
                  to={heroSlides[activeHeroSlide].link} 
                  className="luxury-btn-accent px-8 py-4 text-sm font-bold shadow-xl shadow-emerald-500/20"
                >
                  <span>{heroSlides[activeHeroSlide].cta}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link 
                  to="/catalog" 
                  className="px-6 py-4 rounded-xl text-sm font-semibold bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20 transition-all"
                >
                  Xem Toàn Bộ Catalog
                </Link>
              </motion.div>
            </motion.div>

            {/* Slide Indicators */}
            <div className="flex items-center gap-3 pt-6">
              {heroSlides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveHeroSlide(i)}
                  className={`h-1.5 rounded-full transition-all duration-500 cursor-pointer ${
                    activeHeroSlide === i ? 'w-10 bg-emerald-400' : 'w-3 bg-zinc-700 hover:bg-zinc-500'
                  }`}
                  aria-label={`Chuyển đến slide ${i + 1}`}
                />
              ))}
            </div>

          </div>
        </div>

        {/* Ambient Subtle Glow */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none"></div>
      </section>

      {/* 2. INFINITE RUNWAY TYPOGRAPHY TICKER */}
      <div className="bg-zinc-950 text-white py-4.5 border-y border-zinc-800 overflow-hidden select-none">
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

      {/* 3. CATEGORY CURATION CARDS WITH FRAMER MOTION HOVER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10"
        >
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
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {[
            { id: 'CAT001', name: 'Áo Thun Graphic', img: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800', count: '18 sản phẩm' },
            { id: 'CAT002', name: 'Áo Khoác Biker & Bomber', img: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800', count: '12 sản phẩm' },
            { id: 'CAT003', name: 'Quần Cargo Tactical', img: 'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?w=800', count: '15 sản phẩm' },
            { id: 'CAT004', name: 'Đầm & Chân Váy', img: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=800', count: '9 sản phẩm' },
          ].map((cat, idx) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              whileHover={{ y: -6 }}
            >
              <Link
                to={`/catalog?category=${cat.id}`}
                className="group relative block aspect-[4/5] rounded-3xl overflow-hidden bg-zinc-100 shadow-sm hover:shadow-2xl transition-all duration-500 ease-out"
              >
                <img 
                  src={cat.img} 
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent"></div>
                <div className="absolute inset-x-5 bottom-5 text-white">
                  <p className="font-display font-bold text-base sm:text-lg leading-tight group-hover:text-emerald-400 transition-colors">
                    {cat.name}
                  </p>
                  <p className="text-xs text-zinc-300 font-light mt-1">{cat.count}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 4. BEST SELLERS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10"
        >
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
        </motion.div>

        <div className="fashion-grid">
          {bestSellers.map((prod, idx) => (
            <ProductCard 
              key={prod.productId} 
              product={prod} 
              index={idx}
              onQuickView={(p) => setQuickViewProduct(p)} 
            />
          ))}
        </div>
      </section>

      {/* 5. SHOPPABLE OUTFIT LOOKBOOK WITH INTERACTIVE RADAR HOTSPOTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="bg-zinc-950 text-white rounded-3xl p-8 sm:p-12 lg:p-16 relative overflow-hidden shadow-2xl"
        >
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
                Khám phá bản phối thời trang đỉnh cao từ bộ sưu tập Xuân Hè 2026. Di chuột vào từng điểm chạm nhấp nháy trên người mẫu để mở thông tin sản phẩm và thêm ngay vào giỏ hàng với 1 click!
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-zinc-900/90 border border-zinc-800 hover:border-emerald-500/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></div>
                    <div>
                      <p className="text-xs font-bold text-white">Áo Khoác Da Biker Asymmetric</p>
                      <p className="text-[11px] text-zinc-400 font-mono">1.450.000₫</p>
                    </div>
                  </div>
                  <button
                    onClick={(e) => handleQuickAdd(products.find(p => p.productId === 'PROD002') || products[0], e)}
                    className="p-2 rounded-xl bg-emerald-400 text-zinc-950 hover:bg-emerald-300 transition-transform active:scale-90"
                    title="Thêm vào giỏ hàng"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-zinc-900/90 border border-zinc-800 hover:border-emerald-500/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></div>
                    <div>
                      <p className="text-xs font-bold text-white">Quần Cargo Multi-Pocket Tactical</p>
                      <p className="text-[11px] text-zinc-400 font-mono">680.000₫</p>
                    </div>
                  </div>
                  <button
                    onClick={(e) => handleQuickAdd(products.find(p => p.productId === 'PROD003') || products[0], e)}
                    className="p-2 rounded-xl bg-emerald-400 text-zinc-950 hover:bg-emerald-300 transition-transform active:scale-90"
                    title="Thêm vào giỏ hàng"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <Link 
                  to="/catalog"
                  className="luxury-btn-accent inline-flex"
                >
                  <span>Xem Thêm Bản Phối Khác</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Right Interactive Image with Hotspots */}
            <div className="lg:col-span-7 relative aspect-[4/5] sm:aspect-[16/11] rounded-3xl overflow-hidden bg-zinc-900 shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1551028719-00167b16eac5?w=1200" 
                alt="Model Outfit Lookbook"
                className="w-full h-full object-cover object-center filter contrast-110"
              />
              <div className="absolute inset-0 bg-black/20"></div>

              {/* Hotspot 1: Biker Jacket */}
              <div className="absolute top-[35%] left-[45%]">
                <motion.button
                  whileHover={{ scale: 1.3 }}
                  whileTap={{ scale: 0.9 }}
                  onMouseEnter={() => setActiveHotspot(1)}
                  onMouseLeave={() => setActiveHotspot(null)}
                  className="relative group p-2.5 bg-white text-zinc-950 rounded-full shadow-2xl cursor-pointer"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span className="absolute inset-0 rounded-full bg-emerald-400/60 animate-ping"></span>
                </motion.button>

                {/* Hotspot Card Popup */}
                <AnimatePresence>
                  {activeHotspot === 1 && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, y: 10 }}
                      className="absolute top-10 left-1/2 -translate-x-1/2 w-64 bg-white text-zinc-950 p-4 rounded-2xl shadow-2xl border border-zinc-200 z-30 pointer-events-auto"
                    >
                      <p className="font-bold text-xs line-clamp-1">Áo Khoác Da Biker Asymmetric</p>
                      <p className="font-mono text-xs font-bold text-emerald-600 mt-0.5">1.450.000₫</p>
                      <Link
                        to="/product/PROD002"
                        className="mt-2.5 block w-full py-2 bg-zinc-950 text-white text-xs font-bold text-center rounded-xl hover:bg-zinc-800 transition-colors"
                      >
                        Xem Chi Tiết
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Hotspot 2: Cargo Pants */}
              <div className="absolute top-[70%] left-[55%]">
                <motion.button
                  whileHover={{ scale: 1.3 }}
                  whileTap={{ scale: 0.9 }}
                  onMouseEnter={() => setActiveHotspot(2)}
                  onMouseLeave={() => setActiveHotspot(null)}
                  className="relative group p-2.5 bg-white text-zinc-950 rounded-full shadow-2xl cursor-pointer"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span className="absolute inset-0 rounded-full bg-emerald-400/60 animate-ping"></span>
                </motion.button>

                {/* Hotspot Card Popup */}
                <AnimatePresence>
                  {activeHotspot === 2 && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, y: -10 }}
                      className="absolute bottom-10 left-1/2 -translate-x-1/2 w-64 bg-white text-zinc-950 p-4 rounded-2xl shadow-2xl border border-zinc-200 z-30 pointer-events-auto"
                    >
                      <p className="font-bold text-xs line-clamp-1">Quần Cargo Multi-Pocket Tactical</p>
                      <p className="font-mono text-xs font-bold text-emerald-600 mt-0.5">680.000₫</p>
                      <Link
                        to="/product/PROD003"
                        className="mt-2.5 block w-full py-2 bg-zinc-950 text-white text-xs font-bold text-center rounded-xl hover:bg-zinc-800 transition-colors"
                      >
                        Xem Chi Tiết
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

            </div>

          </div>
        </motion.div>
      </section>

      {/* 6. NEW ARRIVALS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10"
        >
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
        </motion.div>

        <div className="fashion-grid">
          {newArrivals.map((prod, idx) => (
            <ProductCard 
              key={prod.productId} 
              product={prod} 
              index={idx}
              onQuickView={(p) => setQuickViewProduct(p)} 
            />
          ))}
        </div>
      </section>

      {/* 7. BRAND VALUE PILLARS */}
      <section className="border-t border-zinc-200 pt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          
          <motion.div 
            whileHover={{ y: -4 }}
            className="flex items-start gap-4 p-5 rounded-3xl bg-zinc-50 border border-zinc-100 shadow-sm"
          >
            <div className="p-3.5 bg-zinc-950 rounded-2xl text-emerald-400 flex-shrink-0 shadow-md">
              <Truck className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h4 className="font-display font-bold text-base text-zinc-900">Giao Hàng Siêu Tốc</h4>
              <p className="text-xs text-zinc-500 leading-relaxed">Hỏa tốc 2h nội thành Hà Nội & TP.HCM. Miễn phí vận chuyển toàn quốc từ 500k.</p>
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ y: -4 }}
            className="flex items-start gap-4 p-5 rounded-3xl bg-zinc-50 border border-zinc-100 shadow-sm"
          >
            <div className="p-3.5 bg-zinc-950 rounded-2xl text-emerald-400 flex-shrink-0 shadow-md">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h4 className="font-display font-bold text-base text-zinc-900">Đổi Trả Trong 7 Ngày</h4>
              <p className="text-xs text-zinc-500 leading-relaxed">Hỗ trợ đổi size và đổi mẫu tận nơi nhanh chóng, miễn phí nếu phát sinh lỗi may.</p>
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ y: -4 }}
            className="flex items-start gap-4 p-5 rounded-3xl bg-zinc-50 border border-zinc-100 shadow-sm"
          >
            <div className="p-3.5 bg-zinc-950 rounded-2xl text-emerald-400 flex-shrink-0 shadow-md">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h4 className="font-display font-bold text-base text-zinc-900">Chính Hãng 100%</h4>
              <p className="text-xs text-zinc-500 leading-relaxed">Cam kết chất liệu vải Cotton cao cấp định lượng 250 - 380gsm bền bỉ theo thời gian.</p>
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ y: -4 }}
            className="flex items-start gap-4 p-5 rounded-3xl bg-zinc-50 border border-zinc-100 shadow-sm"
          >
            <div className="p-3.5 bg-zinc-950 rounded-2xl text-emerald-400 flex-shrink-0 shadow-md">
              <CreditCard className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h4 className="font-display font-bold text-base text-zinc-900">Ví Tiền & VNPay QR</h4>
              <p className="text-xs text-zinc-500 leading-relaxed">Tích hợp Ví Nova Wallet nạp tiền tức thì cùng cổng thanh toán VNPay tiện lợi.</p>
            </div>
          </motion.div>

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

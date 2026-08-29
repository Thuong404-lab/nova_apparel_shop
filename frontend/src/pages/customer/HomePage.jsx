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
  TrendingUp
} from 'lucide-react';
import { ProductCard } from '../../components/common/ProductCard';
import { ProductQuickViewModal } from '../../components/common/ProductQuickViewModal';
import { productApi } from '../../services/api';
import { formatCurrency } from '../../utils/formatters';

export const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  useEffect(() => {
    async function loadData() {
      const prodRes = await productApi.getAll();
      if (prodRes.success) setProducts(prodRes.data);

      const catRes = await productApi.getCategories();
      if (catRes.success) setCategories(catRes.data);
    }
    loadData();
  }, []);

  const bestSellers = products.slice(0, 4);
  const newArrivals = products.slice(2, 6);

  return (
    <div className="space-y-20 pb-20">
      
      {/* 1. HERO LOOKBOOK BANNER (Minimalist Luxury) */}
      <section className="relative bg-zinc-950 text-white overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-40">
          <img 
            src="https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1600" 
            alt="Runway Fashion"
            className="w-full h-full object-cover object-center filter grayscale contrast-125"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/80 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-36">
          <div className="max-w-2xl space-y-6">
            
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-800/80 backdrop-blur-md rounded-full text-zinc-300 text-xs font-medium border border-zinc-700">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>BỘ SƯU TẬP XUÂN HÈ 2026</span>
            </div>

            <h1 className="font-display font-bold text-4xl sm:text-6xl lg:text-7xl tracking-tight text-white leading-[1.05]">
              Định Hình <br />
              <span className="text-emerald-400 italic font-serif">Phong Cách</span> Riêng
            </h1>

            <p className="text-zinc-300 text-base sm:text-lg leading-relaxed font-normal max-w-xl">
              Khám phá các thiết kế thời trang đường phố cao cấp, phom dáng chuẩn quốc tế, may đo tỉ mỉ trên nền chất liệu bền vững.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Link 
                to="/catalog" 
                className="luxury-btn-accent px-8 py-3.5 text-sm"
              >
                <span>Khám Phá Ngay</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link 
                to="/catalog?category=CAT002" 
                className="px-6 py-3.5 rounded-xl text-sm font-semibold bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20 transition-colors"
              >
                Áo Khoác Outerwear
              </Link>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-6 pt-10 border-t border-zinc-800/80 max-w-lg">
              <div>
                <p className="font-display font-bold text-2xl text-white">5,000+</p>
                <p className="text-xs text-zinc-400 mt-0.5">Khách hàng tin chọn</p>
              </div>
              <div>
                <p className="font-display font-bold text-2xl text-white">100%</p>
                <p className="text-xs text-zinc-400 mt-0.5">Chất liệu cao cấp</p>
              </div>
              <div>
                <p className="font-display font-bold text-2xl text-emerald-400">4.9/5</p>
                <p className="text-xs text-zinc-400 mt-0.5">Đánh giá 5 sao</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. CATEGORY CURATION CARDS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
              DANH MỤC TUYỂN CHỌN
            </span>
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-zinc-900 mt-1">
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
            { id: 'CAT001', name: 'Áo Thun (Tops & Tees)', img: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600', count: '18 sản phẩm' },
            { id: 'CAT002', name: 'Áo Khoác (Outerwear)', img: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600', count: '12 sản phẩm' },
            { id: 'CAT003', name: 'Quần & Jeans (Bottoms)', img: 'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?w=600', count: '15 sản phẩm' },
            { id: 'CAT004', name: 'Đầm & Váy (Dresses)', img: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=600', count: '9 sản phẩm' },
          ].map((cat) => (
            <Link
              key={cat.id}
              to={`/catalog?category=${cat.id}`}
              className="group relative aspect-[4/5] rounded-2xl overflow-hidden bg-zinc-100 shadow-sm hover:shadow-xl transition-all duration-500"
            >
              <img 
                src={cat.img} 
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              <div className="absolute inset-x-4 bottom-4 text-white">
                <p className="font-display font-bold text-base sm:text-lg leading-tight group-hover:text-emerald-400 transition-colors">
                  {cat.name}
                </p>
                <p className="text-xs text-zinc-300 font-light mt-0.5">{cat.count}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. BEST SELLERS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
              XU HƯỚNG BÁN CHẠY
            </span>
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-zinc-900 mt-1">
              Sản Phẩm Được Yêu Thích Nhất
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

      {/* 4. EDITORIAL STORY BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-zinc-900 text-white overflow-hidden">
          <div className="grid lg:grid-cols-2 items-center">
            
            {/* Left Narrative */}
            <div className="p-8 sm:p-12 lg:p-16 space-y-6">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
                TRIẾT LÝ THIẾT KẾ // RAW & REFINED
              </span>
              <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl leading-tight">
                Sự Tinh Tế Trong Từng Chi Tiết Đường Phố
              </h2>
              <p className="text-zinc-300 text-sm sm:text-base leading-relaxed">
                Tại NOVA, chúng tôi kết hợp phom dáng phóng khoáng của văn hóa đường phố đương đại cùng kỹ thuật may đo tỉ mỉ chuẩn Haute Couture. Từng đường kim, nút kim loại và chất vải đều được kiểm duyệt kỹ lưỡng để mang đến cảm giác thoải mái và khác biệt nhất.
              </p>
              <div className="pt-2">
                <Link 
                  to="/catalog" 
                  className="luxury-btn-accent"
                >
                  <span>Tìm Hiểu Bộ Sưu Tập</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Right Image */}
            <div className="relative aspect-square lg:aspect-auto lg:h-full w-full bg-zinc-800">
              <img 
                src="https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800" 
                alt="Editorial Streetwear"
                className="w-full h-full object-cover"
              />
            </div>

          </div>
        </div>
      </section>

      {/* 5. NEW ARRIVALS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
              MỚI RA MẮT
            </span>
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-zinc-900 mt-1">
              Thiết Kế Mới Nhất Tuần Này
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

      {/* 6. BRAND VALUE PILLARS */}
      <section className="border-t border-zinc-200 pt-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          
          <div className="flex items-start gap-4">
            <div className="p-3 bg-zinc-100 rounded-2xl text-zinc-900 flex-shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h4 className="font-display font-bold text-base text-zinc-900">Giao Hàng Siêu Tốc</h4>
              <p className="text-xs text-zinc-500 leading-relaxed">Hỏa tốc 2h nội thành Hà Nội & TP.HCM. Miễn phí vận chuyển toàn quốc từ 500k.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 bg-zinc-100 rounded-2xl text-zinc-900 flex-shrink-0">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h4 className="font-display font-bold text-base text-zinc-900">Đổi Trả Trong 7 Ngày</h4>
              <p className="text-xs text-zinc-500 leading-relaxed">Hỗ trợ đổi size và đổi mẫu tận nơi nhanh chóng, miễn phí nếu phát sinh lỗi may.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 bg-zinc-100 rounded-2xl text-zinc-900 flex-shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h4 className="font-display font-bold text-base text-zinc-900">Chính Hãng 100%</h4>
              <p className="text-xs text-zinc-500 leading-relaxed">Cam kết chất liệu vải Cotton cao cấp định lượng 250 - 380gsm bền bỉ theo thời gian.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 bg-zinc-100 rounded-2xl text-zinc-900 flex-shrink-0">
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

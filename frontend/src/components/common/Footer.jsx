import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Globe,
  Share2,
  Mail, 
  Phone, 
  MapPin,
  ShieldCheck,
  Truck,
  ArrowRight
} from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-zinc-950 text-white border-t border-zinc-800">
      
      {/* 1. Newsletter Call to Action */}
      <div className="border-b border-zinc-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1">
              <span className="text-emerald-400 font-mono text-xs uppercase tracking-widest block font-semibold">
                NOVA CLUB // EXCLUSIVE ACCESS
              </span>
              <h3 className="font-display font-bold text-xl sm:text-2xl text-white">
                Nhận Voucher Giảm 15% Cho Đơn Hàng Đầu Tiên
              </h3>
              <p className="text-xs text-zinc-400">Đăng ký email để nhận thông báo về các đợt mở bán BST giới hạn và mã ưu đãi độc quyền.</p>
            </div>

            <form onSubmit={(e) => e.preventDefault()} className="flex items-center gap-2 max-w-md w-full">
              <input
                type="email"
                placeholder="Nhập địa chỉ email của bạn..."
                className="flex-1 bg-zinc-900 border border-zinc-700 text-white text-xs px-4 py-3 rounded-xl focus:outline-none focus:border-white transition-colors placeholder:text-zinc-500"
              />
              <button
                type="submit"
                className="luxury-btn-accent text-xs px-5 py-3 rounded-xl whitespace-nowrap"
              >
                <span>Đăng Ký</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* 2. Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="inline-block">
              <span className="font-display font-black text-2xl tracking-tighter text-white">
                NOVA<span className="text-emerald-400">.</span> APPAREL
              </span>
            </Link>
            <p className="text-xs text-zinc-400 leading-relaxed max-w-sm">
              Thương hiệu thời trang đường phố cao cấp định hình phong cách hiện đại. Sự kết hợp giữa phom dáng phá cách và chất liệu tuyển chọn đạt chuẩn xuất khẩu.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <span className="p-2 bg-zinc-900 rounded-lg text-zinc-400">
                <Globe className="w-4 h-4" />
              </span>
              <span className="p-2 bg-zinc-900 rounded-lg text-zinc-400">
                <Share2 className="w-4 h-4" />
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-display font-bold text-xs uppercase tracking-wider text-zinc-200">
              Khám Phá
            </h4>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li><Link to="/catalog" className="hover:text-white transition-colors">Tất cả sản phẩm</Link></li>
              <li><Link to="/catalog?category=CAT001" className="hover:text-white transition-colors">Áo thun Graphic</Link></li>
              <li><Link to="/catalog?category=CAT002" className="hover:text-white transition-colors">Áo khoác Biker & Bomber</Link></li>
              <li><Link to="/catalog?category=CAT003" className="hover:text-white transition-colors">Quần túi hộp Cargo</Link></li>
              <li><Link to="/catalog?category=CAT005" className="hover:text-white transition-colors">Phụ kiện thời trang</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-3">
            <h4 className="font-display font-bold text-xs uppercase tracking-wider text-zinc-200">
              Dịch Vụ Khách Hàng
            </h4>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li><Link to="/orders" className="hover:text-white transition-colors">Tra cứu đơn hàng</Link></li>
              <li><Link to="/wallet" className="hover:text-white transition-colors">Ví điện tử Nova Wallet</Link></li>
              <li><Link to="/profile" className="hover:text-white transition-colors">Tài khoản cá nhân</Link></li>
              <li><Link to="/catalog" className="hover:text-white transition-colors">Hướng dẫn chọn Size</Link></li>
              <li><Link to="/catalog" className="hover:text-white transition-colors">Chính sách đổi trả 7 ngày</Link></li>
            </ul>
          </div>

          {/* Contact & Stores */}
          <div className="space-y-3">
            <h4 className="font-display font-bold text-xs uppercase tracking-wider text-zinc-200">
              Liên Hệ & Cửa Hàng
            </h4>
            <div className="space-y-2 text-xs text-zinc-400">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>12 Hai Bà Trưng, Hoàn Kiếm, Hà Nội</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Hotline: 1900 8888 (8h - 22h)</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>support@novaapparel.vn</span>
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* 3. Bottom Bar */}
      <div className="border-t border-zinc-900 bg-zinc-950 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-zinc-500 font-mono">
          <p>© 2026 NOVA APPAREL. ALL RIGHTS RESERVED.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-zinc-300 transition-colors">Điều khoản dịch vụ</a>
            <a href="#" className="hover:text-zinc-300 transition-colors">Chính sách bảo mật</a>
            <a href="#" className="hover:text-zinc-300 transition-colors">Quy chế hoạt động</a>
          </div>
        </div>
      </div>

    </footer>
  );
};

import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ShieldCheck, Truck, RotateCcw, ArrowRight } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-black text-white border-t-4 border-black mt-20">
      {/* Brand Value Props Banner */}
      <div className="border-b border-neutral-800 py-10 bg-neutral-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="flex items-center gap-4 p-4 border border-neutral-800 bg-neutral-900/50">
              <Truck className="w-8 h-8 text-[#00ff66] flex-shrink-0" />
              <div>
                <h4 className="font-display font-bold text-sm tracking-wider uppercase text-white">Giao Hàng Hỏa Tốc</h4>
                <p className="text-xs text-neutral-400 mt-0.5">Nhận hàng 2-3 ngày toàn quốc</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 border border-neutral-800 bg-neutral-900/50">
              <RotateCcw className="w-8 h-8 text-[#00ff66] flex-shrink-0" />
              <div>
                <h4 className="font-display font-bold text-sm tracking-wider uppercase text-white">Đổi Trả Dễ Dàng</h4>
                <p className="text-xs text-neutral-400 mt-0.5">Hỗ trợ đổi size trong 7 ngày</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 border border-neutral-800 bg-neutral-900/50">
              <ShieldCheck className="w-8 h-8 text-[#00ff66] flex-shrink-0" />
              <div>
                <h4 className="font-display font-bold text-sm tracking-wider uppercase text-white">100% Chính Hãng</h4>
                <p className="text-xs text-neutral-400 mt-0.5">Chất liệu cao cấp chuẩn xuất khẩu</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 border border-neutral-800 bg-neutral-900/50">
              <Sparkles className="w-8 h-8 text-[#00ff66] flex-shrink-0" />
              <div>
                <h4 className="font-display font-bold text-sm tracking-wider uppercase text-white">Ví Fashion Tích Điểm</h4>
                <p className="text-xs text-neutral-400 mt-0.5">Hoàn tiền 5% cho mỗi đơn hàng</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          
          {/* Col 1 & 2: Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="inline-block">
              <span className="font-display font-black text-2xl sm:text-3xl tracking-tighter uppercase">
                NOVA<span className="text-[#00ff66]">.</span>APPAREL
              </span>
            </Link>
            <p className="text-xs text-neutral-400 font-medium leading-relaxed">
              Hệ sinh thái thời trang đường phố cao cấp và sàn diễn công nghệ tương lai. Khẳng định cá tính độc bản trong từng chuyển động.
            </p>
            <div className="pt-2">
              <span className="text-xs font-display font-bold text-neutral-300 block mb-2 uppercase tracking-wider">
                Đăng ký nhận mã giảm giá 50.000₫
              </span>
              <div className="flex max-w-sm">
                <input
                  type="email"
                  placeholder="Nhập email của bạn..."
                  className="bg-neutral-900 border border-neutral-700 px-3 py-2 text-xs text-white placeholder-neutral-500 flex-1 focus:outline-none focus:border-[#00ff66]"
                />
                <button className="bg-[#00ff66] text-black px-4 font-display font-black text-xs uppercase hover:bg-white transition-colors flex items-center gap-1">
                  Gửi <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Col 3: Catalog */}
          <div>
            <h5 className="font-display font-bold text-sm uppercase tracking-widest text-[#00ff66] mb-4">
              Danh Mục
            </h5>
            <ul className="space-y-2.5 text-xs text-neutral-400">
              <li><Link to="/catalog?category=CAT001" className="hover:text-white transition-colors">Tops & Tees</Link></li>
              <li><Link to="/catalog?category=CAT002" className="hover:text-white transition-colors">Outerwear & Jackets</Link></li>
              <li><Link to="/catalog?category=CAT005" className="hover:text-white transition-colors">Pants & Jeans</Link></li>
              <li><Link to="/catalog?category=CAT004" className="hover:text-white transition-colors">Dresses & Skirts</Link></li>
              <li><Link to="/catalog?category=CAT003" className="hover:text-white transition-colors">Accessories</Link></li>
            </ul>
          </div>

          {/* Col 4: Support */}
          <div>
            <h5 className="font-display font-bold text-sm uppercase tracking-widest text-[#00ff66] mb-4">
              Hỗ Trợ Khách Hàng
            </h5>
            <ul className="space-y-2.5 text-xs text-neutral-400">
              <li><Link to="/orders" className="hover:text-white transition-colors">Tra cứu đơn hàng</Link></li>
              <li><Link to="/wallet" className="hover:text-white transition-colors">Ví tiền & Thanh toán VNPay</Link></li>
              <li><Link to="/catalog" className="hover:text-white transition-colors">Hướng dẫn chọn size</Link></li>
              <div>
                <h4 className="font-display font-bold text-sm tracking-wider uppercase text-white">Ví Nova Wallet</h4>
                <p className="text-neutral-400 text-xs mt-1">Nạp tiền nhận thêm 10% voucher độc quyền.</p>
              </div>
            </ul>
          </div>

          {/* Col 4: Contact */}
          <div className="space-y-3">
            <h3 className="font-display font-black text-sm tracking-wider uppercase text-white">LIÊN HỆ</h3>
            <div className="space-y-1.5 text-xs text-neutral-400 font-mono">
              <p>📍 12 Hai Bà Trưng, Hoàn Kiếm, Hà Nội</p>
              <p>📞 Hotline: 1900 8888 (8h - 22h)</p>
              <p>✉️ Email: support@novaapparel.vn</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-neutral-800 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-neutral-500">
          <p>© 2026 NOVA APPAREL. ALL RIGHTS RESERVED.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Điều khoản dịch vụ</a>
            <a href="#" className="hover:text-white transition-colors">Chính sách bảo mật</a>
            <a href="#" className="hover:text-white transition-colors">Quy chế hoạt động</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

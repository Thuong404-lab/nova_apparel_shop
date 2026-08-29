import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  ShoppingBag, 
  Heart, 
  User, 
  Search, 
  Menu, 
  X, 
  Shield, 
  Briefcase, 
  LogOut, 
  CreditCard, 
  Package, 
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';

export const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  
  const { totalItems, setIsCartOpen } = useCart();
  const { count: wishlistCount } = useWishlist();
  const { user, isAuthenticated, isAdmin, isStaff, logout, switchDemoRole } = useAuth();
  
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/catalog?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-white border-b-2 border-black">
      {/* 1. SCROLLING TICKER MARQUEE */}
      <div className="bg-black text-[#00ff66] text-xs font-display font-bold py-2 overflow-hidden border-b border-neutral-800 select-none">
        <div className="animate-ticker flex gap-8 items-center">
          {[...Array(3)].map((_, i) => (
            <React.Fragment key={i}>
              <span className="flex items-center gap-2 tracking-widest uppercase">
                <Sparkles className="w-3.5 h-3.5 text-white" /> MIỄN PHÍ VẬN CHUYỂN CHO ĐƠN HÀNG TỪ 500.000₫
              </span>
              <span className="text-white">•</span>
              <span className="tracking-widest uppercase text-white">
                BỘ SƯU TẬP CYBER STREETWEAR 2026 ĐÃ RA MẮT
              </span>
              <span className="text-white">•</span>
              <span className="tracking-widest uppercase text-[#00ff66]">
                GIẢM NGAY 15% CHO ĐƠN HÀNG ĐẦU TIÊN QUA VÍ NOVA WALLET
              </span>
              <span className="text-white">•</span>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* 2. MAIN NAVIGATION BAR */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-1 group">
            <span className="font-display font-black text-2xl sm:text-3xl tracking-tighter uppercase transition-transform group-hover:scale-105">
              NOVA<span className="text-[#00ff66]">.</span>
            </span>
            <span className="hidden sm:inline-block px-1.5 py-0.5 bg-black text-[#00ff66] text-[9px] font-mono font-bold uppercase tracking-wider ml-1">
              APPAREL
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-8">
            <Link 
              to="/" 
              className={`font-display font-bold text-sm tracking-wide uppercase hover:text-[#ff4d00] transition-colors ${
                isActive('/') ? 'text-[#ff4d00] border-b-2 border-[#ff4d00] pb-1' : 'text-black'
              }`}
            >
              Trang Chủ
            </Link>
            <Link 
              to="/catalog" 
              className={`font-display font-bold text-sm tracking-wide uppercase hover:text-[#ff4d00] transition-colors ${
                isActive('/catalog') ? 'text-[#ff4d00] border-b-2 border-[#ff4d00] pb-1' : 'text-black'
              }`}
            >
              Bộ Sưu Tập
            </Link>
            <Link 
              to="/catalog?category=CAT001" 
              className="font-display font-bold text-sm tracking-wide uppercase text-neutral-700 hover:text-black transition-colors"
            >
              Tops & Tees
            </Link>
            <Link 
              to="/catalog?category=CAT002" 
              className="font-display font-bold text-sm tracking-wide uppercase text-neutral-700 hover:text-black transition-colors"
            >
              Outerwear
            </Link>
            <Link 
              to="/catalog?category=CAT005" 
              className="font-display font-bold text-sm tracking-wide uppercase text-neutral-700 hover:text-black transition-colors"
            >
              Pants & Jeans
            </Link>
          </nav>

          {/* Search Bar & Actions */}
          <div className="flex items-center gap-4">
            {/* Search Form */}
            <form onSubmit={handleSearch} className="hidden md:flex relative items-center">
              <input
                type="text"
                placeholder="Tìm áo, quần, phụ kiện..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-48 lg:w-64 py-2 pl-3 pr-9 text-xs border-2 border-black font-medium focus:w-72 focus:outline-none transition-all shadow-[2px_2px_0px_#000]"
              />
              <button 
                type="submit" 
                className="absolute right-2.5 text-neutral-600 hover:text-black"
                title="Tìm kiếm"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>

            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="relative p-2.5 bg-neutral-100 hover:bg-neutral-200 border-2 border-black shadow-[2px_2px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0px_#000] transition-all"
              title="Danh sách yêu thích"
            >
              <Heart className="w-4 h-4 text-black" />
              {wishlistCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#ff4d00] text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border border-black">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart Drawer Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 bg-black text-white hover:bg-neutral-800 border-2 border-black shadow-[3px_3px_0px_#00ff66] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0px_#00ff66] transition-all flex items-center gap-2"
              title="Giỏ hàng"
            >
              <ShoppingBag className="w-4 h-4 text-[#00ff66]" />
              <span className="hidden sm:inline font-display font-bold text-xs tracking-wider">GIỎ HÀNG</span>
              {totalItems > 0 && (
                <span className="bg-[#00ff66] text-black text-[10px] font-black px-1.5 py-0.5 border border-black">
                  {totalItems}
                </span>
              )}
            </button>

            {/* User Account / Role Switcher Menu */}
            <div className="relative">
              {isAuthenticated ? (
                <div>
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 p-1.5 bg-neutral-100 hover:bg-neutral-200 border-2 border-black shadow-[2px_2px_0px_#000] transition-all"
                  >
                    <img 
                      src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'} 
                      alt={user.fullName}
                      className="w-7 h-7 object-cover border border-black" 
                    />
                    <div className="hidden xl:block text-left text-xs leading-tight">
                      <span className="font-display font-bold block truncate max-w-[100px]">{user.fullName}</span>
                      <span className={`text-[10px] font-black uppercase ${
                        user.role === 'Admin' ? 'text-red-600' : user.role === 'Staff' ? 'text-blue-600' : 'text-neutral-500'
                      }`}>
                        {user.role}
                      </span>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>

                  {userDropdownOpen && (
                    <div 
                      className="absolute right-0 mt-2 w-64 bg-white border-2 border-black shadow-[6px_6px_0px_#000] py-2 z-50 animate-in fade-in slide-in-from-top-2"
                      onMouseLeave={() => setUserDropdownOpen(false)}
                    >
                      <div className="px-4 py-2 border-b border-neutral-200">
                        <p className="font-display font-black text-sm">{user.fullName}</p>
                        <p className="text-xs text-neutral-500">{user.email}</p>
                        <div className="mt-1">
                          <span className="neo-badge bg-black text-[#00ff66] text-[10px]">
                            {user.role}
                          </span>
                        </div>
                      </div>

                      {/* Role Navigation */}
                      {isAdmin && (
                        <Link 
                          to="/admin" 
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold hover:bg-neutral-100 text-purple-700"
                        >
                          <Shield className="w-4 h-4" /> Bảng Quản Trị Admin
                        </Link>
                      )}

                      {isStaff && (
                        <Link 
                          to="/staff" 
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold hover:bg-neutral-100 text-blue-700"
                        >
                          <Briefcase className="w-4 h-4" /> Cổng Xử Lý Đơn & Kho Staff
                        </Link>
                      )}

                      <Link 
                        to="/orders" 
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold hover:bg-neutral-100 text-black"
                      >
                        <Package className="w-4 h-4" /> Đơn Hàng Của Tôi
                      </Link>

                      <Link 
                        to="/wallet" 
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold hover:bg-neutral-100 text-black"
                      >
                        <CreditCard className="w-4 h-4" /> Ví Tiền & Nạp VNPay
                      </Link>

                      <Link 
                        to="/profile" 
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold hover:bg-neutral-100 text-black"
                      >
                        <User className="w-4 h-4" /> Hồ Sơ Cá Nhân
                      </Link>

                      {/* Fast Demo Role Switchers */}
                      <div className="px-4 py-2 border-t border-b border-neutral-200 bg-neutral-50 my-1">
                        <span className="text-[10px] font-black uppercase text-neutral-400 block mb-1">
                          Chuyển Role Nhanh (Demo):
                        </span>
                        <div className="flex gap-1">
                          <button
                            onClick={() => { switchDemoRole('Admin'); setUserDropdownOpen(false); }}
                            className={`text-[10px] font-bold px-2 py-0.5 border border-black ${user.role === 'Admin' ? 'bg-purple-600 text-white' : 'bg-white'}`}
                          >
                            Admin
                          </button>
                          <button
                            onClick={() => { switchDemoRole('Staff'); setUserDropdownOpen(false); }}
                            className={`text-[10px] font-bold px-2 py-0.5 border border-black ${user.role === 'Staff' ? 'bg-blue-600 text-white' : 'bg-white'}`}
                          >
                            Staff
                          </button>
                          <button
                            onClick={() => { switchDemoRole('Customer'); setUserDropdownOpen(false); }}
                            className={`text-[10px] font-bold px-2 py-0.5 border border-black ${user.role === 'Customer' ? 'bg-black text-[#00ff66]' : 'bg-white'}`}
                          >
                            Customer
                          </button>
                        </div>
                      </div>

                      <button
                        onClick={() => { logout(); setUserDropdownOpen(false); }}
                        className="w-full text-left flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50"
                      >
                        <LogOut className="w-4 h-4" /> Đăng Xuất
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    to="/login"
                    className="font-display font-bold text-xs uppercase px-3 py-2 border-2 border-black hover:bg-black hover:text-white transition-all shadow-[2px_2px_0px_#000]"
                  >
                    Đăng Nhập
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 border-2 border-black bg-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t-2 border-black py-4 space-y-3 bg-white">
            <Link 
              to="/" 
              onClick={() => setMobileMenuOpen(false)}
              className="block font-display font-bold text-sm uppercase px-2 py-1 hover:text-[#ff4d00]"
            >
              Trang Chủ
            </Link>
            <Link 
              to="/catalog" 
              onClick={() => setMobileMenuOpen(false)}
              className="block font-display font-bold text-sm uppercase px-2 py-1 hover:text-[#ff4d00]"
            >
              Tất Cả Sản Phẩm
            </Link>
            <Link 
              to="/catalog?category=CAT001" 
              onClick={() => setMobileMenuOpen(false)}
              className="block font-display font-bold text-sm uppercase px-2 py-1 text-neutral-600"
            >
              Tops & Tees
            </Link>
            <Link 
              to="/catalog?category=CAT002" 
              onClick={() => setMobileMenuOpen(false)}
              className="block font-display font-bold text-sm uppercase px-2 py-1 text-neutral-600"
            >
              Outerwear
            </Link>
            <Link 
              to="/catalog?category=CAT005" 
              onClick={() => setMobileMenuOpen(false)}
              className="block font-display font-bold text-sm uppercase px-2 py-1 text-neutral-600"
            >
              Pants & Jeans
            </Link>
            <Link 
              to="/catalog?category=CAT003" 
              onClick={() => setMobileMenuOpen(false)}
              className="block font-display font-bold text-sm uppercase px-2 py-1 text-neutral-600"
            >
              Accessories
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

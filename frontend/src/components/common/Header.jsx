import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  ShoppingBag, 
  Heart, 
  Search, 
  User, 
  ChevronDown, 
  Menu, 
  X, 
  ShieldCheck,
  LogOut,
  Wallet,
  Package,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { NotificationDropdown } from './NotificationDropdown';

export const Header = () => {
  const { user, logout, isStaff, isAdmin } = useAuth();
  const { totalItems, setIsCartOpen } = useCart();
  const { count: wishlistCount } = useWishlist();
  const navigate = useNavigate();
  const location = useLocation();

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/catalog?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
    }
  };

  const categories = [
    { id: 'CAT001', name: 'Áo Thun & Graphic Tees', count: '18 mẫu' },
    { id: 'CAT002', name: 'Áo Khoác Biker & Bomber', count: '12 mẫu' },
    { id: 'CAT003', name: 'Quần Cargo & Jeans Baggy', count: '15 mẫu' },
    { id: 'CAT004', name: 'Đầm Bodycon & Chân Váy', count: '9 mẫu' },
    { id: 'CAT005', name: 'Mũ & Phụ Kiện Đường Phố', count: '24 mẫu' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-zinc-200/80 transition-all duration-200">
      
      {/* Top micro announcement bar */}
      <div className="bg-zinc-950 text-white text-[11px] font-mono py-1.5 px-4 text-center border-b border-zinc-900 flex items-center justify-between">
        <div className="hidden sm:flex items-center gap-4 text-zinc-400">
          <span>Hà Nội: 12 Hai Bà Trưng</span>
          <span>•</span>
          <span>Hotline: 1900 8888</span>
        </div>
        <div className="mx-auto sm:mx-0 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
          <span className="text-zinc-200">BST XUÂN HÈ 2026 // MIỄN PHÍ VẬN CHUYỂN TỪ 500K</span>
        </div>
        <div className="hidden md:flex items-center gap-3 text-zinc-400">
          <Link to="/orders" className="hover:text-white transition-colors">Tra cứu đơn hàng</Link>
        </div>
      </div>

      {/* Main Header Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-6">
        
        {/* 1. Left: Brand Logo */}
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2 group select-none">
            <span className="font-display font-black text-2xl tracking-tighter text-zinc-950 group-hover:text-emerald-600 transition-colors">
              NOVA<span className="text-emerald-500">.</span>
            </span>
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-600 font-bold border border-zinc-200">
              APPAREL
            </span>
          </Link>

          {/* Clean Main Navigation Menu */}
          <nav className="hidden lg:flex items-center gap-7 text-xs font-semibold text-zinc-700">
            <Link 
              to="/" 
              className={`hover:text-black transition-colors ${location.pathname === '/' ? 'text-black font-bold' : ''}`}
            >
              Trang Chủ
            </Link>

            {/* Category Dropdown on Hover */}
            <div 
              className="relative py-4"
              onMouseEnter={() => setIsCategoryMenuOpen(true)}
              onMouseLeave={() => setIsCategoryMenuOpen(false)}
            >
              <Link 
                to="/catalog" 
                className={`flex items-center gap-1 hover:text-black transition-colors ${
                  location.pathname.startsWith('/catalog') ? 'text-black font-bold' : ''
                }`}
              >
                <span>Bộ Sưu Tập</span>
                <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
              </Link>

              {/* Category Popover */}
              {isCategoryMenuOpen && (
                <div className="absolute top-full left-0 w-64 bg-white rounded-2xl shadow-xl border border-zinc-200/80 p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="p-2 border-b border-zinc-100 text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                    Phân Loại Danh Mục
                  </div>
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      to={`/catalog?category=${cat.id}`}
                      onClick={() => setIsCategoryMenuOpen(false)}
                      className="flex items-center justify-between p-2.5 rounded-xl hover:bg-zinc-50 text-xs font-medium text-zinc-700 hover:text-black transition-colors"
                    >
                      <span>{cat.name}</span>
                      <span className="text-[10px] text-zinc-400 font-mono">{cat.count}</span>
                    </Link>
                  ))}
                  <div className="p-2 border-t border-zinc-100">
                    <Link
                      to="/catalog"
                      onClick={() => setIsCategoryMenuOpen(false)}
                      className="text-[11px] font-bold text-emerald-600 hover:underline flex items-center justify-between"
                    >
                      <span>Xem Tất Cả Sản Phẩm</span>
                      <ChevronRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <Link 
              to="/orders" 
              className={`hover:text-black transition-colors ${location.pathname.startsWith('/orders') ? 'text-black font-bold' : ''}`}
            >
              Tra Cứu Đơn Hàng
            </Link>

            <Link 
              to="/wallet" 
              className={`hover:text-black transition-colors ${location.pathname.startsWith('/wallet') ? 'text-black font-bold' : ''}`}
            >
              Ví Nova Wallet
            </Link>
          </nav>
        </div>

        {/* 2. Right: Action Buttons */}
        <div className="flex items-center gap-3">
          
          {/* Search Trigger */}
          <div className="relative">
            {isSearchOpen ? (
              <form onSubmit={handleSearchSubmit} className="flex items-center">
                <input
                  type="text"
                  placeholder="Tìm sản phẩm, áo thun, jacket..."
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-48 sm:w-64 bg-zinc-100 border border-zinc-300 text-xs rounded-full px-4 py-2 outline-none focus:border-zinc-950"
                />
                <button 
                  type="button" 
                  onClick={() => setIsSearchOpen(false)}
                  className="p-2 text-zinc-400 hover:text-black"
                >
                  <X className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2.5 rounded-full hover:bg-zinc-100 text-zinc-700 hover:text-black transition-colors cursor-pointer"
                aria-label="Tìm kiếm"
              >
                <Search className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Notification Center */}
          <NotificationDropdown />

          {/* Wishlist Link */}
          <Link
            to="/wishlist"
            className="relative p-2.5 rounded-full hover:bg-zinc-100 text-zinc-700 hover:text-black transition-colors"
            aria-label="Yêu thích"
          >
            <Heart className="w-4 h-4" />
            {wishlistCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center font-mono">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Cart Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-bold rounded-full shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Giỏ Hàng</span>
            {totalItems > 0 && (
              <span className="w-4 h-4 bg-emerald-400 text-zinc-950 rounded-full flex items-center justify-center text-[10px] font-mono">
                {totalItems}
              </span>
            )}
          </button>

          {/* User Profile Menu / Login Button */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 p-1.5 rounded-full hover:bg-zinc-100 border border-zinc-200 transition-colors cursor-pointer"
              >
                <img
                  src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
                  alt={user.fullName || 'User'}
                  className="w-7 h-7 rounded-full object-cover"
                />
                <span className="text-xs font-semibold text-zinc-800 hidden md:inline max-w-[100px] truncate">
                  {user.fullName?.split(' ').slice(-1)[0] || 'Tài khoản'}
                </span>
                <ChevronDown className="w-3 h-3 text-zinc-400" />
              </button>

              {/* User Dropdown */}
              {isUserMenuOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setIsUserMenuOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-zinc-200/80 p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                    
                    {/* User Profile Header */}
                    <div className="p-3 border-b border-zinc-100 flex items-center gap-3">
                      <img
                        src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
                        alt=""
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-zinc-950 truncate">{user.fullName || 'Người dùng'}</p>
                        <span className="text-[10px] font-mono text-emerald-600 font-bold uppercase">
                          {user.role || 'Customer'}
                        </span>
                      </div>
                    </div>

                    {/* Navigation Links */}
                    <div className="py-1">
                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100 text-xs font-bold mb-1"
                        >
                          <ShieldCheck className="w-4 h-4 text-purple-600" />
                          <span>Trang Quản Trị (Admin)</span>
                        </Link>
                      )}

                      {isStaff && !isAdmin && (
                        <Link
                          to="/staff"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-bold mb-1"
                        >
                          <ShieldCheck className="w-4 h-4 text-blue-600" />
                          <span>Trang Nhân Viên (Staff)</span>
                        </Link>
                      )}

                      <Link
                        to="/profile"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-zinc-50 text-xs text-zinc-700 font-medium"
                      >
                        <User className="w-4 h-4 text-zinc-400" />
                        <span>Thông tin cá nhân</span>
                      </Link>

                      <Link
                        to="/orders"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-zinc-50 text-xs text-zinc-700 font-medium"
                      >
                        <Package className="w-4 h-4 text-zinc-400" />
                        <span>Đơn hàng của tôi</span>
                      </Link>

                      <Link
                        to="/wallet"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-zinc-50 text-xs text-zinc-700 font-medium"
                      >
                        <Wallet className="w-4 h-4 text-emerald-600" />
                        <span>Ví Nova Wallet</span>
                      </Link>
                    </div>

                    {/* Auth Actions */}
                    <div className="pt-1 border-t border-zinc-100">
                      <button
                        onClick={() => { 
                          logout(); 
                          setIsUserMenuOpen(false); 
                          navigate('/');
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-rose-50 text-xs text-rose-600 font-medium cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Đăng xuất</span>
                      </button>
                    </div>

                  </div>
                </>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-2 px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 rounded-full text-xs font-bold transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <User className="w-3.5 h-3.5" />
              <span>Đăng Nhập</span>
            </Link>
          )}

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-zinc-700"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

        </div>

      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-zinc-200 bg-white p-4 space-y-3">
          <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-sm font-semibold">Trang Chủ</Link>
          <Link to="/catalog" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-sm font-semibold">Bộ Sưu Tập</Link>
          <Link to="/orders" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-sm font-semibold">Tra Cứu Đơn Hàng</Link>
          <Link to="/wallet" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-sm font-semibold">Ví Nova Wallet</Link>
          <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-sm font-semibold">Tài Khoản</Link>
          <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-sm font-semibold text-emerald-600">Đăng Nhập / Đăng Ký</Link>
        </div>
      )}

    </header>
  );
};

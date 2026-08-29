import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  ShoppingBag, 
  Heart, 
  User, 
  Search, 
  Menu, 
  X, 
  Wallet, 
  ShieldCheck, 
  LogOut, 
  Package,
  Layers,
  ChevronDown,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

export const Header = () => {
  const { user, role, logout, switchDemoRole } = useAuth();
  const { getCartCount, setIsCartOpen } = useCart();
  const { wishlist } = useWishlist();
  const navigate = useNavigate();
  const location = useLocation();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);

  const cartCount = getCartCount();
  const wishlistCount = wishlist.length;

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/catalog?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
    }
  };

  const navLinks = [
    { name: 'Trang Chủ', path: '/' },
    { name: 'Bộ Sưu Tập', path: '/catalog' },
    { name: 'Áo (Tops)', path: '/catalog?category=CAT001' },
    { name: 'Áo Khoác (Outerwear)', path: '/catalog?category=CAT002' },
    { name: 'Quần & Jeans', path: '/catalog?category=CAT003' },
    { name: 'Phụ Kiện', path: '/catalog?category=CAT005' },
  ];

  return (
    <>
      {/* 1. Top Announcement Bar */}
      <div className="bg-zinc-950 text-white text-xs font-medium py-2 px-4 border-b border-zinc-800 overflow-hidden">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-mono text-[11px] text-zinc-300 tracking-wide uppercase">
              NOVA 2026 RUNWAY DROP // MIỄN PHÍ VẬN CHUYỂN TOÀN QUỐC CHO ĐƠN TỪ 500K
            </span>
          </div>

          {/* Quick Demo Switcher */}
          <div className="relative">
            <button
              onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
              className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-[11px] font-medium transition-colors"
            >
              <Sparkles className="w-3 h-3 text-emerald-400" />
              <span>Demo: <strong className="text-white capitalize">{role}</strong></span>
              <ChevronDown className="w-3 h-3 text-zinc-400" />
            </button>

            {isRoleDropdownOpen && (
              <div className="absolute right-0 mt-2 w-52 bg-white text-zinc-900 rounded-xl shadow-xl border border-zinc-100 py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-3 py-1.5 text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
                  Chuyển Vai Trò Test
                </div>
                <button
                  onClick={() => { switchDemoRole('customer'); setIsRoleDropdownOpen(false); }}
                  className="w-full px-3 py-2 text-left text-xs font-medium hover:bg-zinc-50 flex items-center justify-between"
                >
                  <span>Khách Hàng (Customer)</span>
                  {role === 'customer' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>}
                </button>
                <button
                  onClick={() => { switchDemoRole('staff'); setIsRoleDropdownOpen(false); }}
                  className="w-full px-3 py-2 text-left text-xs font-medium hover:bg-zinc-50 flex items-center justify-between"
                >
                  <span>Nhân Viên (Staff)</span>
                  {role === 'staff' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>}
                </button>
                <button
                  onClick={() => { switchDemoRole('admin'); setIsRoleDropdownOpen(false); }}
                  className="w-full px-3 py-2 text-left text-xs font-medium hover:bg-zinc-50 flex items-center justify-between"
                >
                  <span>Quản Trị Viên (Admin)</span>
                  {role === 'admin' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. Main Luxury Sticky Header */}
      <header className="sticky top-0 z-40 glass-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Left: Mobile Menu Toggle & Brand Logo */}
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 text-zinc-700 hover:text-black rounded-lg hover:bg-zinc-100"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>

              <Link to="/" className="flex items-center gap-2 group">
                <span className="font-display font-black text-2xl tracking-tighter text-zinc-950 group-hover:opacity-80 transition-opacity">
                  NOVA<span className="text-emerald-500">.</span>
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-semibold tracking-widest uppercase bg-zinc-100 text-zinc-600 rounded-md border border-zinc-200">
                  APPAREL
                </span>
              </Link>
            </div>

            {/* Middle: Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`text-sm font-medium transition-colors hover:text-black ${
                      isActive ? 'text-black font-semibold' : 'text-zinc-600'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>

            {/* Right: Actions (Search, Wishlist, Cart, Profile) */}
            <div className="flex items-center gap-3 sm:gap-4">
              
              {/* Search Bar / Button */}
              <div className="relative">
                {isSearchOpen ? (
                  <form onSubmit={handleSearchSubmit} className="flex items-center">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Tìm áo khoác, hoodie, quần..."
                      className="w-48 sm:w-64 pl-3 pr-8 py-1.5 text-xs bg-zinc-100 border border-zinc-300 rounded-full focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => setIsSearchOpen(false)}
                      className="absolute right-2 text-zinc-400 hover:text-zinc-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </form>
                ) : (
                  <button
                    onClick={() => setIsSearchOpen(true)}
                    className="p-2 text-zinc-600 hover:text-black rounded-full hover:bg-zinc-100 transition-colors"
                    title="Tìm kiếm"
                  >
                    <Search className="w-5 h-5" />
                  </button>
                )}
              </div>

              {/* Wishlist Button */}
              <Link
                to="/wishlist"
                className="relative p-2 text-zinc-600 hover:text-black rounded-full hover:bg-zinc-100 transition-colors"
                title="Yêu thích"
              >
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart Drawer Button */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative flex items-center gap-2 px-3.5 py-2 bg-zinc-950 hover:bg-zinc-800 text-white rounded-full transition-all text-xs font-semibold shadow-sm"
              >
                <ShoppingBag className="w-4 h-4" />
                <span className="hidden sm:inline">Giỏ Hàng</span>
                <span className="px-1.5 py-0.2 bg-emerald-400 text-zinc-950 rounded-full text-[11px] font-bold">
                  {cartCount}
                </span>
              </button>

              {/* User Account / Dropdown */}
              {user ? (
                <div className="flex items-center gap-2 pl-2 border-l border-zinc-200">
                  <Link to="/profile" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                    <img 
                      src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'} 
                      alt={user.fullName}
                      className="w-8 h-8 rounded-full object-cover border border-zinc-300"
                    />
                    <div className="hidden xl:block text-left text-xs">
                      <p className="font-semibold text-zinc-900 truncate max-w-[100px]">{user.fullName}</p>
                      <p className="text-[10px] text-zinc-500 capitalize">{role}</p>
                    </div>
                  </Link>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="p-2 text-zinc-600 hover:text-black rounded-full hover:bg-zinc-100 transition-colors"
                  title="Đăng nhập"
                >
                  <User className="w-5 h-5" />
                </Link>
              )}

            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-zinc-200 px-6 py-6 space-y-4 animate-in slide-in-from-top-4 duration-200">
            <div className="space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-2.5 text-base font-medium text-zinc-800 hover:text-black border-b border-zinc-50"
                >
                  {link.name}
                </Link>
              ))}
            </div>

            <div className="pt-4 border-t border-zinc-200 flex flex-col gap-2.5">
              <Link
                to="/wallet"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-2.5 py-2 text-sm text-zinc-700 font-medium"
              >
                <Wallet className="w-4 h-4 text-emerald-600" />
                <span>Ví Điện Tử Nova Wallet</span>
              </Link>
              <Link
                to="/orders"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-2.5 py-2 text-sm text-zinc-700 font-medium"
              >
                <Package className="w-4 h-4 text-blue-600" />
                <span>Lịch Sử Đơn Hàng</span>
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
};

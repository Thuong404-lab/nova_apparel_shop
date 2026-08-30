import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  PackageCheck, 
  Warehouse, 
  LogOut, 
  ArrowLeft, 
  ShieldCheck, 
  Menu, 
  X,
  Sparkles,
  ClipboardList
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const StaffLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const navItems = [
    { title: 'Xử Lý Đơn Hàng & In Bill', path: '/staff', icon: ClipboardList, exact: true },
    { title: 'Quản Lý Kho & Nhập Hàng', path: '/staff/warehouse', icon: Warehouse },
  ];

  return (
    <div className="min-h-screen flex bg-zinc-100 text-zinc-900 font-sans antialiased">
      
      {/* 1. Desktop Sidebar */}
      <aside className="hidden lg:flex w-72 bg-zinc-950 text-white flex-col justify-between p-6 border-r border-zinc-800 flex-shrink-0 sticky top-0 h-screen">
        
        <div className="space-y-8">
          {/* Staff Brand Logo */}
          <div className="space-y-1">
            <Link to="/staff" className="inline-block">
              <span className="font-display font-black text-2xl tracking-tighter text-white">
                NOVA<span className="text-emerald-400">.</span> STAFF
              </span>
            </Link>
            <p className="text-[11px] text-zinc-400 font-mono">BỘ PHẬN KHO & BÁN HÀNG</p>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.exact 
                ? location.pathname === item.path 
                : location.pathname.startsWith(item.path);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
                    isActive 
                      ? 'bg-emerald-500 text-zinc-950 shadow-lg shadow-emerald-500/20' 
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.title}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Sidebar User Info */}
        <div className="space-y-4 pt-6 border-t border-zinc-900">
          
          <Link
            to="/"
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white text-xs font-semibold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Về Trang Bán Hàng</span>
          </Link>

          <div className="flex items-center justify-between p-3 rounded-2xl bg-zinc-900/60 border border-zinc-800/80">
            <div className="flex items-center gap-2.5 min-w-0">
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100'}
                alt=""
                className="w-8 h-8 rounded-full object-cover border border-emerald-400"
              />
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate">{user?.fullName || 'Staff'}</p>
                <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold">STAFF MEMBER</span>
              </div>
            </div>
            <button
              onClick={() => { logout(); navigate('/login'); }}
              title="Đăng xuất"
              className="p-1.5 text-zinc-400 hover:text-rose-400 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

        </div>

      </aside>

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-zinc-200 px-6 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
              className="lg:hidden p-2 text-zinc-700 hover:bg-zinc-100 rounded-xl"
            >
              {isMobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div className="flex items-center gap-2 text-xs text-zinc-500 font-medium">
              <span>Staff Portal</span>
              <span>/</span>
              <span className="text-zinc-900 font-bold capitalize">
                {location.pathname === '/staff' ? 'Quản lý đơn hàng' : 'Nhập kho hàng'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-200">
              SPRING BOOT API READY: ROLE_STAFF
            </span>
          </div>
        </header>

        {/* Mobile Nav */}
        {isMobileSidebarOpen && (
          <div className="lg:hidden bg-zinc-950 text-white p-4 space-y-2 border-b border-zinc-800">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileSidebarOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold hover:bg-zinc-900 text-zinc-300"
              >
                <item.icon className="w-4 h-4" />
                <span>{item.title}</span>
              </Link>
            ))}
            <Link to="/" onClick={() => setIsMobileSidebarOpen(false)} className="block py-2 text-xs text-zinc-400">
              ← Quay về Trang Bán Hàng
            </Link>
          </div>
        )}

        {/* Content */}
        <main className="flex-1 p-6 sm:p-10">
          <Outlet />
        </main>
      </div>

    </div>
  );
};

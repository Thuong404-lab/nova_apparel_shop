import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, Link } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';

import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { CartDrawer } from './components/common/CartDrawer';

// Customer Pages
import { HomePage } from './pages/customer/HomePage';
import { CatalogPage } from './pages/customer/CatalogPage';
import { ProductDetailPage } from './pages/customer/ProductDetailPage';
import { CartPage } from './pages/customer/CartPage';
import { CheckoutPage } from './pages/customer/CheckoutPage';
import { OrdersPage } from './pages/customer/OrdersPage';
import { OrderDetailPage } from './pages/customer/OrderDetailPage';
import { WalletPage } from './pages/customer/WalletPage';
import { WishlistPage } from './pages/customer/WishlistPage';
import { ProfilePage } from './pages/customer/ProfilePage';

// Auth Pages
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';

// Staff Pages
import { StaffDashboard } from './pages/staff/StaffDashboard';
import { StaffWarehousePage } from './pages/staff/StaffWarehousePage';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminProductsPage } from './pages/admin/AdminProductsPage';
import { AdminAccountsPage } from './pages/admin/AdminAccountsPage';

// Sub-nav for Staff / Admin
const SubNavigation = () => {
  const location = useLocation();
  
  if (location.pathname.startsWith('/staff')) {
    return (
      <div className="bg-zinc-900 text-white border-b border-zinc-800 py-3 px-4 sticky top-20 z-40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs font-semibold">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="text-emerald-400 uppercase tracking-wider font-mono">STAFF PORTAL</span>
          </div>
          <div className="flex gap-2">
            <Link 
              to="/staff" 
              className={`px-3.5 py-1.5 rounded-xl transition-colors ${
                location.pathname === '/staff' ? 'bg-white text-zinc-950 font-bold' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
            >
              Xử Lý Đơn Hàng & In Bill
            </Link>
            <Link 
              to="/staff/warehouse" 
              className={`px-3.5 py-1.5 rounded-xl transition-colors ${
                location.pathname === '/staff/warehouse' ? 'bg-white text-zinc-950 font-bold' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
            >
              Quản Lý Tồn Kho & Nhập Hàng
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (location.pathname.startsWith('/admin')) {
    return (
      <div className="bg-zinc-950 text-white border-b border-zinc-800 py-3 px-4 sticky top-20 z-40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs font-semibold">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-purple-400"></span>
            <span className="text-purple-400 uppercase tracking-wider font-mono">ADMIN CONTROL CENTER</span>
          </div>
          <div className="flex gap-2">
            <Link 
              to="/admin" 
              className={`px-3.5 py-1.5 rounded-xl transition-colors ${
                location.pathname === '/admin' ? 'bg-white text-zinc-950 font-bold' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
            >
              Thống Kê Doanh Thu
            </Link>
            <Link 
              to="/admin/products" 
              className={`px-3.5 py-1.5 rounded-xl transition-colors ${
                location.pathname === '/admin/products' ? 'bg-white text-zinc-950 font-bold' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
            >
              Quản Lý Sản Phẩm
            </Link>
            <Link 
              to="/admin/accounts" 
              className={`px-3.5 py-1.5 rounded-xl transition-colors ${
                location.pathname === '/admin/accounts' ? 'bg-white text-zinc-950 font-bold' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
            >
              Quản Lý Tài Khoản
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <BrowserRouter>
              <div className="min-h-screen flex flex-col bg-[#fafafa] text-zinc-900 selection:bg-emerald-500 selection:text-white font-sans antialiased">
                
                {/* Global Header */}
                <Header />
                <CartDrawer />

                {/* Sub-navbars when accessing Staff/Admin routes */}
                <SubNavigation />

                {/* Main Content Area */}
                <main className="flex-1">
                  <Routes>
                    {/* Customer / Guest Storefront */}
                    <Route path="/" element={<HomePage />} />
                    <Route path="/catalog" element={<CatalogPage />} />
                    <Route path="/product/:id" element={<ProductDetailPage />} />
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/checkout" element={<CheckoutPage />} />
                    <Route path="/orders" element={<OrdersPage />} />
                    <Route path="/orders/:id" element={<OrderDetailPage />} />
                    <Route path="/wallet" element={<WalletPage />} />
                    <Route path="/wishlist" element={<WishlistPage />} />
                    <Route path="/profile" element={<ProfilePage />} />

                    {/* Auth */}
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/forgot-password" element={<ForgotPasswordPage />} />

                    {/* Staff */}
                    <Route path="/staff" element={<StaffDashboard />} />
                    <Route path="/staff/orders" element={<StaffDashboard />} />
                    <Route path="/staff/warehouse" element={<StaffWarehousePage />} />

                    {/* Admin */}
                    <Route path="/admin" element={<AdminDashboard />} />
                    <Route path="/admin/products" element={<AdminProductsPage />} />
                    <Route path="/admin/accounts" element={<AdminAccountsPage />} />

                    {/* 404 Fallback */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </main>

                {/* Global Footer */}
                <Footer />
              </div>
            </BrowserRouter>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </ToastProvider>
  );
}

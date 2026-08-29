import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider, useAuth } from './context/AuthContext';
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

// Sub-nav for Staff
const StaffNav = () => (
  <div className="bg-neutral-900 text-white border-b-2 border-black py-2.5 px-4">
    <div className="max-w-7xl mx-auto flex items-center justify-between text-xs font-display font-bold">
      <span className="text-[#00ff66] uppercase">CỔNG NHÂN VIÊN (STAFF)</span>
      <div className="flex gap-4">
        <a href="/staff" className="hover:text-[#00ff66]">Xử Lý Đơn Hàng & Bill</a>
        <a href="/staff/warehouse" className="hover:text-[#00ff66]">Quản Lý Tồn Kho & Nhập Hàng</a>
      </div>
    </div>
  </div>
);

// Sub-nav for Admin
const AdminNav = () => (
  <div className="bg-neutral-950 text-white border-b-2 border-black py-2.5 px-4">
    <div className="max-w-7xl mx-auto flex items-center justify-between text-xs font-display font-bold">
      <span className="text-purple-400 uppercase">BẢNG QUẢN TRỊ (ADMIN)</span>
      <div className="flex gap-4">
        <a href="/admin" className="hover:text-purple-400">Thống Kê Doanh Thu</a>
        <a href="/admin/products" className="hover:text-purple-400">Quản Lý Sản Phẩm</a>
        <a href="/admin/accounts" className="hover:text-purple-400">Quản Lý Tài Khoản</a>
      </div>
    </div>
  </div>
);

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <BrowserRouter>
              <div className="min-h-screen flex flex-col bg-[#f8f9fa] text-black">
                
                {/* Global Header */}
                <Header />
                <CartDrawer />

                {/* Sub-navbars when accessing Staff/Admin routes */}
                <Routes>
                  <Route path="/staff/*" element={<StaffNav />} />
                  <Route path="/admin/*" element={<AdminNav />} />
                </Routes>

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

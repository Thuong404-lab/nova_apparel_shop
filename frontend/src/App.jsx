import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';

// Layouts
import { CustomerLayout } from './layouts/CustomerLayout';
import { AdminLayout } from './layouts/AdminLayout';
import { StaffLayout } from './layouts/StaffLayout';
import { AuthLayout } from './layouts/AuthLayout';
import { ProtectedRoute } from './components/guards/ProtectedRoute';

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

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <BrowserRouter>
              <Routes>
                
                {/* 1. STOREFRONT & CUSTOMER ROUTES (CustomerLayout) */}
                <Route element={<CustomerLayout />}>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/catalog" element={<CatalogPage />} />
                  <Route path="/product/:id" element={<ProductDetailPage />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/wishlist" element={<WishlistPage />} />
                  
                  {/* Protected Customer Routes */}
                  <Route path="/checkout" element={
                    <ProtectedRoute allowedRoles={['customer', 'staff', 'admin']}>
                      <CheckoutPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/orders" element={
                    <ProtectedRoute allowedRoles={['customer', 'staff', 'admin']}>
                      <OrdersPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/orders/:id" element={
                    <ProtectedRoute allowedRoles={['customer', 'staff', 'admin']}>
                      <OrderDetailPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/wallet" element={
                    <ProtectedRoute allowedRoles={['customer', 'staff', 'admin']}>
                      <WalletPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/profile" element={
                    <ProtectedRoute allowedRoles={['customer', 'staff', 'admin']}>
                      <ProfilePage />
                    </ProtectedRoute>
                  } />
                </Route>

                {/* 2. AUTH ROUTES (AuthLayout) */}
                <Route element={<AuthLayout />}>
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                </Route>

                {/* 3. STAFF PORTAL ROUTES (StaffLayout with Role Guard) */}
                <Route 
                  path="/staff" 
                  element={
                    <ProtectedRoute allowedRoles={['staff', 'admin']}>
                      <StaffLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<StaffDashboard />} />
                  <Route path="orders" element={<StaffDashboard />} />
                  <Route path="warehouse" element={<StaffWarehousePage />} />
                </Route>

                {/* 4. ADMIN CONTROL CENTER ROUTES (AdminLayout with Role Guard) */}
                <Route 
                  path="/admin" 
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AdminLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<AdminDashboard />} />
                  <Route path="products" element={<AdminProductsPage />} />
                  <Route path="accounts" element={<AdminAccountsPage />} />
                </Route>

                {/* 5. 404 CATCH ALL */}
                <Route path="*" element={<Navigate to="/" replace />} />

              </Routes>
            </BrowserRouter>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </ToastProvider>
  );
}

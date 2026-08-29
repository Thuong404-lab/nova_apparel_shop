import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '../components/common/Header';
import { Footer } from '../components/common/Footer';
import { CartDrawer } from '../components/common/CartDrawer';

export const CustomerLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#fafafa] text-zinc-900 selection:bg-emerald-500 selection:text-white font-sans antialiased">
      {/* Customer Header */}
      <Header />
      
      {/* Slide-over Cart Drawer */}
      <CartDrawer />

      {/* Main Storefront Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Customer Footer */}
      <Footer />
    </div>
  );
};

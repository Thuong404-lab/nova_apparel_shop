import React from 'react';
import { Outlet, Link } from 'react-router-dom';

export const AuthLayout = () => {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#fafafa] text-zinc-900 font-sans antialiased">
      {/* Micro header */}
      <div className="p-6 flex items-center justify-between max-w-7xl mx-auto w-full">
        <Link to="/" className="font-display font-black text-2xl tracking-tighter text-zinc-950">
          NOVA<span className="text-emerald-500">.</span> APPAREL
        </Link>
        <Link to="/" className="text-xs font-semibold text-zinc-500 hover:text-black">
          ← Về trang chủ
        </Link>
      </div>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <Outlet />
      </main>

      {/* Micro footer */}
      <div className="p-6 text-center text-[11px] text-zinc-400 font-mono">
        © 2026 NOVA APPAREL. SECURE AUTHENTICATION SYSTEM.
      </div>
    </div>
  );
};

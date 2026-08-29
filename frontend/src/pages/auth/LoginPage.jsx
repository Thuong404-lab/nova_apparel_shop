import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, User, ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const LoginPage = () => {
  const { login, switchDemoRole } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState('nguyenvana');
  const [password, setPassword] = useState('123456');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const success = await login(username, password);
    setLoading(false);
    if (success) {
      navigate('/');
    }
  };

  const handleQuickDemo = async (role) => {
    await switchDemoRole(role);
    if (role === 'admin') navigate('/admin');
    else if (role === 'staff') navigate('/staff');
    else navigate('/');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-5xl bg-white rounded-3xl border border-zinc-200/80 shadow-2xl overflow-hidden grid lg:grid-cols-12">
        
        {/* Left: High-Fashion Editorial Banner (5 cols) */}
        <div className="lg:col-span-5 relative bg-zinc-950 text-white p-8 sm:p-12 flex flex-col justify-between overflow-hidden hidden md:flex">
          <div className="absolute inset-0 opacity-40">
            <img
              src="https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800"
              alt="Editorial"
              className="w-full h-full object-cover filter grayscale contrast-125"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent"></div>
          </div>

          <div className="relative z-10 space-y-2">
            <span className="font-display font-black text-2xl tracking-tighter text-white">
              NOVA<span className="text-emerald-400">.</span> APPAREL
            </span>
            <p className="text-xs text-zinc-400 font-mono">SPRING / SUMMER 2026</p>
          </div>

          <div className="relative z-10 space-y-3">
            <p className="text-xs font-bold uppercase tracking-widest text-emerald-400">
              EXCLUSIVE MEMBERSHIP
            </p>
            <h2 className="font-display font-bold text-2xl text-white leading-snug">
              Trải Nghiệm Mua Sắm Thời Trang Đỉnh Cao
            </h2>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Đăng nhập để tích lũy điểm thưởng Nova Pass, nhận mã giảm giá độc quyền và theo dõi đơn hàng thời gian thực.
            </p>
          </div>
        </div>

        {/* Right: Login Form (7 cols) */}
        <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-between space-y-8">
          
          <div className="space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 font-mono">
                AUTHENTICATION
              </span>
              <h1 className="font-display font-black text-3xl text-zinc-950 mt-1">
                Đăng Nhập Tài Khoản
              </h1>
              <p className="text-xs text-zinc-500 mt-1">
                Chưa có tài khoản?{' '}
                <Link to="/register" className="font-bold text-emerald-600 hover:underline">
                  Đăng ký ngay
                </Link>
              </p>
            </div>

            {/* Quick Demo Login Tabs */}
            <div className="p-3 bg-zinc-50 rounded-2xl border border-zinc-200/80 space-y-2">
              <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider block">
                ⚡ Đăng Nhập Nhanh (1-Click Demo Roles)
              </span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickDemo('customer')}
                  className="py-2 px-3 rounded-xl bg-white border border-zinc-200 text-xs font-bold hover:border-zinc-950 transition-colors shadow-2xs cursor-pointer"
                >
                  Khách Hàng
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemo('staff')}
                  className="py-2 px-3 rounded-xl bg-white border border-zinc-200 text-xs font-bold hover:border-zinc-950 transition-colors shadow-2xs cursor-pointer"
                >
                  Nhân Viên
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemo('admin')}
                  className="py-2 px-3 rounded-xl bg-purple-50 border border-purple-200 text-purple-700 text-xs font-bold hover:bg-purple-100 transition-colors shadow-2xs cursor-pointer"
                >
                  Quản Trị Viên
                </button>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-800">Tên đăng nhập hoặc Email</label>
                <div className="relative">
                  <User className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="nguyenvana"
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl pl-10 pr-4 py-3 text-xs outline-none focus:border-zinc-950"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <label className="font-bold text-zinc-800">Mật khẩu</label>
                  <Link to="/forgot-password" className="text-zinc-500 hover:text-black">
                    Quên mật khẩu?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl pl-10 pr-4 py-3 text-xs outline-none focus:border-zinc-950"
                  />
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full luxury-btn-accent text-xs py-3.5 justify-center shadow-lg shadow-emerald-500/20 cursor-pointer"
              >
                <span>{loading ? 'Đang Xử Lý...' : 'Đăng Nhập Vào Hệ Thống'}</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </form>
          </div>

          <div className="pt-4 border-t border-zinc-100 text-center text-[11px] text-zinc-400 font-mono">
            Bảo mật SSL 256-bit chuẩn thương mại điện tử quốc tế.
          </div>

        </div>

      </div>
    </div>
  );
};

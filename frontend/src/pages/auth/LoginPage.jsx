import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, User, ArrowRight, Shield, Zap } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const LoginPage = () => {
  const [username, setUsername] = useState('nguyenvana');
  const [password, setPassword] = useState('123456');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const success = await login(username, password);
    setLoading(false);
    if (success) {
      if (username.includes('admin')) {
        navigate('/admin');
      } else if (username.includes('staff')) {
        navigate('/staff');
      } else {
        navigate('/');
      }
    }
  };

  const handleQuickDemo = async (demoUser) => {
    setUsername(demoUser);
    setPassword('123456');
    setLoading(true);
    const success = await login(demoUser, '123456');
    setLoading(false);
    if (success) {
      if (demoUser === 'admin') navigate('/admin');
      else if (demoUser === 'staff01') navigate('/staff');
      else navigate('/');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-white border-3 border-black p-8 shadow-[10px_10px_0px_#000] space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2 pb-4 border-b-2 border-black">
          <div className="w-12 h-12 bg-black text-[#00ff66] font-display font-black text-2xl flex items-center justify-center mx-auto border-2 border-black shadow-[3px_3px_0px_#000]">
            FS
          </div>
          <h1 className="font-display font-black text-2xl uppercase tracking-tight">
            ĐĂNG NHẬP HỆ THỐNG
          </h1>
          <span className="font-mono text-xs text-[#00ff66] uppercase tracking-widest block font-bold">
            NOVA APPAREL // PORTAL 2026
          </span>
        </div>

        {/* Quick Demo Role Switcher */}
        <div className="p-3 bg-neutral-100 border-2 border-black space-y-2">
          <span className="text-[10px] font-display font-black uppercase text-neutral-500 flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-[#ff4d00]" /> ĐĂNG NHẬP NHANH (DEMO TEST):
          </span>
          <div className="grid grid-cols-3 gap-1.5">
            <button
              type="button"
              onClick={() => handleQuickDemo('admin')}
              className="py-1.5 px-2 bg-purple-600 text-white font-display font-bold text-[10px] uppercase border border-black hover:bg-purple-700 shadow-[1px_1px_0px_#000]"
            >
              Admin
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('staff01')}
              className="py-1.5 px-2 bg-blue-600 text-white font-display font-bold text-[10px] uppercase border border-black hover:bg-blue-700 shadow-[1px_1px_0px_#000]"
            >
              Staff
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('nguyenvana')}
              className="py-1.5 px-2 bg-black text-[#00ff66] font-display font-bold text-[10px] uppercase border border-black hover:bg-neutral-800 shadow-[1px_1px_0px_#000]"
            >
              Khách Hàng
            </button>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-display font-bold uppercase mb-1">
              Tên Đăng Nhập
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Ví dụ: admin, staff01, nguyenvana"
                className="neo-input text-xs pl-9"
              />
              <User className="w-4 h-4 absolute left-3 top-3.5 text-neutral-400" />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-display font-bold uppercase">
                Mật Khẩu
              </label>
              <Link to="/forgot-password" className="text-[11px] font-mono text-neutral-500 hover:text-black underline">
                Quên mật khẩu?
              </Link>
            </div>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nhập 123456"
                className="neo-input text-xs pl-9"
              />
              <Lock className="w-4 h-4 absolute left-3 top-3.5 text-neutral-400" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 neo-btn neo-btn-neon text-xs tracking-wider flex items-center justify-center gap-2"
          >
            {loading ? 'Đang Xử Lý...' : 'Đăng Nhập Ngay'} <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Footer */}
        <div className="text-center pt-4 border-t border-neutral-200 text-xs">
          <span className="text-neutral-500">Chưa có tài khoản? </span>
          <Link to="/register" className="font-display font-bold uppercase hover:text-[#ff4d00] underline">
            Đăng ký thành viên
          </Link>
        </div>

      </div>
    </div>
  );
};

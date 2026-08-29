import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Lock, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    const success = await register({ username, fullName, email, phone, password });
    setLoading(false);
    if (success) {
      navigate('/');
    }
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-16">
      <div className="bg-white border-3 border-black p-8 shadow-[10px_10px_0px_#00ff66] space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2 pb-4 border-b-2 border-black">
          <div className="w-12 h-12 bg-[#00ff66] text-black font-display font-black text-2xl flex items-center justify-center mx-auto border-2 border-black shadow-[3px_3px_0px_#000]">
            FS
          </div>
          <h1 className="font-display font-black text-2xl uppercase tracking-tight">
            ĐĂNG KÝ TÀI KHOẢN
          </h1>
          <p className="text-xs text-neutral-500 font-mono">
            NHẬN NGAY VOUCHER 50.000₫ & VÍ TÍCH ĐIỂM
          </p>
        </div>

        {/* Register Form */}
        <form onSubmit={handleRegister} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-display font-bold uppercase mb-1">
                Tên Đăng Nhập *
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="nguyenvana"
                className="neo-input text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-display font-bold uppercase mb-1">
                Họ và Tên *
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Nguyễn Văn A"
                className="neo-input text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-display font-bold uppercase mb-1">
                Email *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@gmail.com"
                className="neo-input text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-display font-bold uppercase mb-1">
                Số Điện Thoại *
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0901234567"
                className="neo-input text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-display font-bold uppercase mb-1">
              Mật Khẩu *
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Ít nhất 6 ký tự..."
              className="neo-input text-xs"
            />
          </div>

          <div className="flex items-center gap-2 text-[11px] text-neutral-600">
            <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>Tôi đồng ý với Điều khoản sử dụng và Chính sách bảo mật của NOVA Apparel.</span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 neo-btn neo-btn-neon text-xs tracking-wider flex items-center justify-center gap-2"
          >
            {loading ? 'Đang Xử Lý...' : 'Hoàn Tất Đăng Ký'} <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Footer */}
        <div className="text-center pt-4 border-t border-neutral-200 text-xs">
          <span className="text-neutral-500">Đã có tài khoản? </span>
          <Link to="/login" className="font-display font-bold uppercase hover:text-[#ff4d00] underline">
            Đăng nhập ngay
          </Link>
        </div>

      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Lock, ArrowRight, ShieldCheck, Sparkles, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import confetti from 'canvas-confetti';

export const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [loading, setLoading] = useState(false);

  const { register, switchDemoRole } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!agreeTerms) {
      addToast('Vui lòng đồng ý với điều khoản sử dụng!', 'warning');
      return;
    }

    setLoading(true);
    const success = await register({ username, fullName, email, phone, password });
    setLoading(false);
    if (success) {
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 }
      });
      navigate('/');
    }
  };

  const handleSocialRegister = async (provider) => {
    setLoading(true);
    addToast(`Đang liên kết tài khoản ${provider}...`, 'info');
    setTimeout(async () => {
      await switchDemoRole('customer');
      setLoading(false);
      addToast(`Đăng ký thành công qua ${provider}! Tặng bạn Voucher 50.000₫`, 'success');
      confetti({
        particleCount: 60,
        spread: 80,
        origin: { y: 0.6 }
      });
      navigate('/');
    }, 600);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-5xl bg-white rounded-3xl border border-zinc-200/80 shadow-2xl overflow-hidden grid lg:grid-cols-12">
        
        {/* Left: High-Fashion Editorial Banner (5 cols) */}
        <div className="lg:col-span-5 relative bg-zinc-950 text-white p-8 sm:p-12 flex flex-col justify-between overflow-hidden hidden md:flex">
          <div className="absolute inset-0 opacity-40">
            <img
              src="https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800"
              alt="Fashion Runway"
              className="w-full h-full object-cover filter contrast-125"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent"></div>
          </div>

          <div className="relative z-10 space-y-2">
            <span className="font-display font-black text-2xl tracking-tighter text-white">
              NOVA<span className="text-emerald-400">.</span> APPAREL
            </span>
            <p className="text-xs text-zinc-400 font-mono">MEMBERSHIP PRIVILEGES</p>
          </div>

          <div className="relative z-10 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-950/80 border border-emerald-800 text-emerald-400 rounded-full text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>TẶNG VOUCHER 50.000₫ KHI ĐĂNG KÝ</span>
            </div>
            <h2 className="font-display font-bold text-2xl text-white leading-snug">
              Gia Nhập Cộng Đồng NOVA Streetwear
            </h2>
            <ul className="text-xs text-zinc-300 space-y-2 font-light">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Ưu tiên săn các phiên bản giới hạn (Limited Drop)</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Tích lũy điểm hoàn tiền vào Ví Nova Wallet</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Miễn phí đổi size tận nhà trong 7 ngày</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Right: Registration Form (7 cols) */}
        <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-between space-y-6">
          
          <div className="space-y-5">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 font-mono">
                CREATE ACCOUNT
              </span>
              <h1 className="font-display font-black text-3xl text-zinc-950 mt-1">
                Đăng Ký Thành Viên
              </h1>
              <p className="text-xs text-zinc-500 mt-1">
                Đã có tài khoản NOVA?{' '}
                <Link to="/login" className="font-bold text-emerald-600 hover:underline">
                  Đăng nhập ngay
                </Link>
              </p>
            </div>

            {/* Social Logins */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
                Đăng ký nhanh qua mạng xã hội
              </span>
              <div className="grid grid-cols-3 gap-2.5">
                
                {/* Google */}
                <button
                  type="button"
                  onClick={() => handleSocialRegister('Google')}
                  className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-2xl border border-zinc-200 bg-white hover:bg-zinc-50 hover:border-zinc-300 text-xs font-semibold transition-all shadow-xs cursor-pointer"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"/>
                    <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"/>
                    <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12 0 14.5s.7 4.8 1.9 7.2l3.7-2.9z"/>
                    <path fill="#34A853" d="M12 24c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 17C3.7 20.7 7.5 24 12 24z"/>
                  </svg>
                  <span className="hidden sm:inline">Google</span>
                </button>

                {/* Facebook */}
                <button
                  type="button"
                  onClick={() => handleSocialRegister('Facebook')}
                  className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-2xl border border-zinc-200 bg-white hover:bg-zinc-50 hover:border-zinc-300 text-xs font-semibold transition-all shadow-xs cursor-pointer text-[#1877F2]"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  <span className="hidden sm:inline text-zinc-800">Facebook</span>
                </button>

                {/* GitHub */}
                <button
                  type="button"
                  onClick={() => handleSocialRegister('GitHub')}
                  className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-2xl border border-zinc-200 bg-white hover:bg-zinc-50 hover:border-zinc-300 text-xs font-semibold transition-all shadow-xs cursor-pointer text-zinc-900"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                  </svg>
                  <span className="hidden sm:inline">GitHub</span>
                </button>

              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-zinc-200"></div>
              <span className="text-[11px] text-zinc-400 font-mono">hoặc điền thông tin</span>
              <div className="flex-1 h-px bg-zinc-200"></div>
            </div>

            {/* Form */}
            <form onSubmit={handleRegister} className="space-y-3.5">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-800">Tên đăng nhập *</label>
                  <div className="relative">
                    <User className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-3.5" />
                    <input
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="novafan2026"
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl pl-9 pr-3 py-2.5 text-xs outline-none focus:border-zinc-950"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-800">Họ và Tên *</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Nguyễn Văn A"
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2.5 text-xs outline-none focus:border-zinc-950"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-800">Email *</label>
                  <div className="relative">
                    <Mail className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-3.5" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="user@gmail.com"
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl pl-9 pr-3 py-2.5 text-xs outline-none focus:border-zinc-950"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-800">Số Điện Thoại *</label>
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-3.5" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="0987654321"
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl pl-9 pr-3 py-2.5 text-xs outline-none focus:border-zinc-950"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-800">Mật khẩu *</label>
                <div className="relative">
                  <Lock className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-3.5" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Ít nhất 6 ký tự bảo mật..."
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl pl-9 pr-3 py-2.5 text-xs outline-none focus:border-zinc-950"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 text-[11px] text-zinc-600 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="accent-zinc-950 rounded"
                />
                <span>Tôi đồng ý với Điều khoản dịch vụ và Chính sách bảo mật của NOVA Apparel.</span>
              </label>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full luxury-btn-accent text-xs py-3.5 justify-center shadow-lg shadow-emerald-500/20 cursor-pointer"
              >
                <span>{loading ? 'Đang Tạo Tài Khoản...' : 'Hoàn Tất Đăng Ký (Nhận 50k)'}</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>

            </form>
          </div>

          <div className="pt-3 border-t border-zinc-100 text-center text-[11px] text-zinc-400 font-mono">
            Bảo mật thông tin khách hàng 100% theo tiêu chuẩn quốc tế.
          </div>

        </div>

      </div>
    </div>
  );
};

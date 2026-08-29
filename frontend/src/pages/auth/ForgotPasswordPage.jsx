import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, KeyRound, Lock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const ForgotPasswordPage = () => {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password, 4: Success
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleSendEmail = (e) => {
    e.preventDefault();
    if (!email) return;
    setStep(2);
    addToast('Mã OTP xác thực đã được gửi tới email của bạn (Mã demo: 888888)', 'info', 'ĐÃ GỬI MÃ OTP');
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (otp === '888888' || otp.length === 6) {
      setStep(3);
      addToast('Xác thực OTP thành công!', 'success');
    } else {
      addToast('Mã OTP không chính xác! Vui lòng nhập: 888888', 'error');
    }
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      addToast('Mật khẩu xác nhận không khớp!', 'error');
      return;
    }
    setStep(4);
    addToast('Đặt lại mật khẩu thành công!', 'success');
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-white border-3 border-black p-8 shadow-[10px_10px_0px_#000] space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2 pb-4 border-b-2 border-black">
          <h1 className="font-display font-black text-2xl uppercase tracking-tight">
            QUÊN MẬT KHẨU
          </h1>
          <p className="text-xs text-neutral-500 font-mono">
            BƯỚC {step} / 3: {step === 1 ? 'NHẬP EMAIL' : step === 2 ? 'XÁC THỰC OTP' : 'ĐỔI MẬT KHẨU'}
          </p>
        </div>

        {/* Step 1: Input Email */}
        {step === 1 && (
          <form onSubmit={handleSendEmail} className="space-y-4">
            <p className="text-xs text-neutral-600 leading-relaxed">
              Vui lòng nhập địa chỉ email đã đăng ký tài khoản để nhận mã xác thực OTP khôi phục mật khẩu.
            </p>

            <div>
              <label className="block text-xs font-display font-bold uppercase mb-1">Email</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="customer@gmail.com"
                  className="neo-input text-xs pl-9"
                />
                <Mail className="w-4 h-4 absolute left-3 top-3.5 text-neutral-400" />
              </div>
            </div>

            <button type="submit" className="w-full py-3.5 neo-btn neo-btn-neon text-xs">
              Gửi Mã Xác Thực OTP <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* Step 2: Input OTP */}
        {step === 2 && (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div className="p-3 bg-amber-50 border border-amber-300 text-xs text-amber-900 font-mono">
              💡 Mã OTP demo của bạn là: <strong className="text-black font-black text-sm">888888</strong>
            </div>

            <div>
              <label className="block text-xs font-display font-bold uppercase mb-1">Nhập Mã OTP (6 số)</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="888888"
                  className="neo-input text-xs tracking-widest text-center font-display font-black text-lg pl-3"
                />
              </div>
            </div>

            <button type="submit" className="w-full py-3.5 neo-btn neo-btn-neon text-xs">
              Xác Nhận OTP <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-full text-center text-xs font-mono text-neutral-500 hover:underline"
            >
              ← Thay đổi email khác
            </button>
          </form>
        )}

        {/* Step 3: New Password */}
        {step === 3 && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label className="block text-xs font-display font-bold uppercase mb-1">Mật khẩu mới</label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Ít nhất 6 ký tự..."
                className="neo-input text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-display font-bold uppercase mb-1">Xác nhận mật khẩu mới</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Nhập lại mật khẩu..."
                className="neo-input text-xs"
              />
            </div>

            <button type="submit" className="w-full py-3.5 neo-btn neo-btn-neon text-xs">
              Lưu Mật Khẩu Mới <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* Step 4: Success */}
        {step === 4 && (
          <div className="text-center space-y-4 py-4">
            <div className="w-16 h-16 bg-[#00ff66] text-black border-2 border-black flex items-center justify-center mx-auto shadow-[4px_4px_0px_#000]">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="font-display font-black text-lg uppercase">ĐỔI MẬT KHẨU THÀNH CÔNG</h3>
            <p className="text-xs text-neutral-600">
              Bạn có thể đăng nhập lại vào hệ thống bằng mật khẩu mới vừa thiết lập.
            </p>
            <Link to="/login" className="inline-flex neo-btn neo-btn-neon text-xs w-full justify-center">
              Đăng Nhập Ngay
            </Link>
          </div>
        )}

        <div className="text-center pt-4 border-t border-neutral-200 text-xs">
          <Link to="/login" className="font-display font-bold uppercase hover:text-[#ff4d00]">
            ← Quay Lại Đăng Nhập
          </Link>
        </div>

      </div>
    </div>
  );
};

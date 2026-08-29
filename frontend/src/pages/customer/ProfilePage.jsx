import React, { useState } from 'react';
import { User, Lock, Save, ShieldCheck, Mail, Phone, MapPin } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export const ProfilePage = () => {
  const { user } = useAuth();
  const { addToast } = useToast();

  const [fullName, setFullName] = useState(user?.fullName || 'Nguyễn Văn A');
  const [email, setEmail] = useState(user?.email || 'customer@gmail.com');
  const [phone, setPhone] = useState(user?.phone || '0901112223');
  const [address, setAddress] = useState(user?.address || '12 Hai Bà Trưng, Hoàn Kiếm, Hà Nội');

  // Change Password State
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    addToast('Cập nhật thông tin tài khoản thành công!', 'success');
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      addToast('Mật khẩu mới không khớp!', 'error');
      return;
    }
    if (newPassword.length < 6) {
      addToast('Mật khẩu phải có ít nhất 6 ký tự!', 'error');
      return;
    }
    addToast('Đổi mật khẩu thành công!', 'success');
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="bg-black text-white p-6 border-3 border-black shadow-[6px_6px_0px_#00ff66]">
        <span className="font-mono text-xs text-[#00ff66] uppercase tracking-widest block mb-1">
          USER ACCOUNT // PROFILE SETTINGS
        </span>
        <h1 className="font-display font-black text-2xl sm:text-4xl uppercase tracking-tight">
          HỒ SƠ CÁ NHÂN
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Left: Info Card */}
        <div className="md:col-span-4 bg-white border-2 border-black p-6 shadow-[6px_6px_0px_#000] text-center space-y-4">
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300'}
            alt="Avatar"
            className="w-28 h-28 object-cover rounded-full border-3 border-black mx-auto shadow-[4px_4px_0px_#000]"
          />
          <div>
            <h3 className="font-display font-black text-lg">{fullName}</h3>
            <span className="neo-badge bg-black text-[#00ff66] text-xs mt-1">
              {user?.role || 'Khách Hàng'}
            </span>
          </div>
          <div className="text-xs text-neutral-500 font-mono pt-4 border-t border-neutral-200">
            Tài khoản tạo: 2026-08-01
          </div>
        </div>

        {/* Right: Edit Forms */}
        <div className="md:col-span-8 space-y-8">
          {/* 1. General Profile */}
          <form onSubmit={handleUpdateProfile} className="bg-white border-2 border-black p-6 shadow-[6px_6px_0px_#000] space-y-4">
            <h3 className="font-display font-black text-base uppercase pb-3 border-b-2 border-black flex items-center gap-2">
              <User className="w-5 h-5" /> THÔNG TIN CÁ NHÂN
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-display font-bold uppercase mb-1">Họ và tên</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="neo-input text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-display font-bold uppercase mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="neo-input text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-display font-bold uppercase mb-1">Số điện thoại</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="neo-input text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-display font-bold uppercase mb-1">Địa chỉ mặc định</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="neo-input text-xs"
                />
              </div>
            </div>

            <button type="submit" className="neo-btn neo-btn-neon text-xs">
              <Save className="w-4 h-4" /> Lưu Thay Đổi
            </button>
          </form>

          {/* 2. Change Password */}
          <form onSubmit={handleChangePassword} className="bg-white border-2 border-black p-6 shadow-[6px_6px_0px_#000] space-y-4">
            <h3 className="font-display font-black text-base uppercase pb-3 border-b-2 border-black flex items-center gap-2">
              <Lock className="w-5 h-5" /> ĐỔI MẬT KHẨU
            </h3>

            <div>
              <label className="block text-xs font-display font-bold uppercase mb-1">Mật khẩu hiện tại</label>
              <input
                type="password"
                required
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="Nhập mật khẩu hiện tại..."
                className="neo-input text-xs"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            </div>

            <button type="submit" className="neo-btn neo-btn-secondary text-xs">
              Đổi Mật Khẩu
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

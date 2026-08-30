import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  ShieldCheck, 
  Save, 
  KeyRound, 
  Wallet, 
  Package, 
  Heart,
  Sparkles,
  Camera
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Link } from 'react-router-dom';

export const ProfilePage = () => {
  const { user } = useAuth();
  const { addToast } = useToast();

  const [activeTab, setActiveTab] = useState('general');
  const [formData, setFormData] = useState({
    fullName: user?.fullName || 'Nguyễn Văn A',
    email: user?.email || 'nguyenvana@gmail.com',
    phone: '0987654321',
    address: '123 Đường Cầu Giấy, Quận Cầu Giấy, Hà Nội',
    birthdate: '1998-05-20',
    gender: 'male'
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    addToast('Đã lưu thông tin tài khoản thành công!', 'success', 'CẬP NHẬT THÀNH CÔNG');
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      addToast('Mật khẩu mới và xác nhận mật khẩu không khớp!', 'error');
      return;
    }
    addToast('Đã đổi mật khẩu thành công!', 'success');
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header */}
      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 font-mono">
          ACCOUNT SETTINGS
        </span>
        <h1 className="font-display font-black text-3xl sm:text-4xl text-zinc-950 mt-1">
          Hồ Sơ Cá Nhân
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: User Overview Card & Menu (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl border border-zinc-200 p-6 sm:p-8 shadow-sm text-center space-y-6">
            
            {/* Avatar with edit icon */}
            <div className="relative w-24 h-24 mx-auto">
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300'}
                alt=""
                className="w-24 h-24 rounded-full object-cover border-4 border-zinc-100 shadow-md"
              />
              <button className="absolute bottom-0 right-0 p-2 bg-zinc-950 text-white rounded-full shadow-lg hover:scale-110 transition-transform">
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>

            <div>
              <h3 className="font-display font-bold text-lg text-zinc-950">{user?.fullName || 'Nguyễn Văn A'}</h3>
              <p className="text-xs text-zinc-500 font-mono mt-0.5">{user?.email || 'nguyenvana@gmail.com'}</p>
              <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-200">
                <Sparkles className="w-3.5 h-3.5" />
                <span>THÀNH VIÊN NOVA VIP</span>
              </div>
            </div>

            {/* Quick Links */}
            <div className="pt-4 border-t border-zinc-100 grid grid-cols-3 gap-2 text-center">
              <Link to="/orders" className="p-3 rounded-2xl bg-zinc-50 hover:bg-zinc-100 transition-colors">
                <Package className="w-5 h-5 mx-auto text-zinc-700" />
                <span className="text-[11px] font-bold text-zinc-800 block mt-1">Đơn Hàng</span>
              </Link>
              <Link to="/wallet" className="p-3 rounded-2xl bg-zinc-50 hover:bg-zinc-100 transition-colors">
                <Wallet className="w-5 h-5 mx-auto text-emerald-600" />
                <span className="text-[11px] font-bold text-zinc-800 block mt-1">Ví Tiền</span>
              </Link>
              <Link to="/wishlist" className="p-3 rounded-2xl bg-zinc-50 hover:bg-zinc-100 transition-colors">
                <Heart className="w-5 h-5 mx-auto text-rose-500" />
                <span className="text-[11px] font-bold text-zinc-800 block mt-1">Yêu Thích</span>
              </Link>
            </div>

          </div>

          {/* Navigation Tabs */}
          <div className="bg-white rounded-3xl border border-zinc-200 p-3 shadow-sm space-y-1">
            <button
              onClick={() => setActiveTab('general')}
              className={`w-full text-left px-4 py-3 rounded-2xl text-xs font-bold transition-all flex items-center gap-3 ${
                activeTab === 'general' ? 'bg-zinc-950 text-white' : 'text-zinc-600 hover:bg-zinc-50'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Thông tin chung & Địa chỉ</span>
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`w-full text-left px-4 py-3 rounded-2xl text-xs font-bold transition-all flex items-center gap-3 ${
                activeTab === 'security' ? 'bg-zinc-950 text-white' : 'text-zinc-600 hover:bg-zinc-50'
              }`}
            >
              <KeyRound className="w-4 h-4" />
              <span>Đổi mật khẩu & Bảo mật</span>
            </button>
          </div>
        </div>

        {/* Right: Form Details (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-zinc-200 p-6 sm:p-10 shadow-sm">
          
          {activeTab === 'general' ? (
            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <h3 className="font-display font-bold text-lg text-zinc-950 border-b border-zinc-100 pb-4">
                Thông Tin Cá Nhân & Giao Hàng
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-bold text-zinc-800">Họ và Tên</label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-xs outline-none focus:border-zinc-950"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-800">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-xs outline-none focus:border-zinc-950"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-800">Số Điện Thoại</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-xs outline-none focus:border-zinc-950"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-bold text-zinc-800">Địa chỉ nhận hàng mặc định</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-xs outline-none focus:border-zinc-950"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-800">Ngày sinh</label>
                  <input
                    type="date"
                    value={formData.birthdate}
                    onChange={(e) => setFormData({ ...formData, birthdate: e.target.value })}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-xs outline-none focus:border-zinc-950"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-800">Giới tính</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-xs outline-none focus:border-zinc-950 cursor-pointer"
                  >
                    <option value="male">Nam</option>
                    <option value="female">Nữ</option>
                    <option value="other">Khác</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-100 flex justify-end">
                <button type="submit" className="luxury-btn-accent text-xs px-6 py-3">
                  <Save className="w-4 h-4" />
                  <span>Lưu Thay Đổi</span>
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleChangePassword} className="space-y-6">
              <h3 className="font-display font-bold text-lg text-zinc-950 border-b border-zinc-100 pb-4">
                Đổi Mật Khẩu
              </h3>

              <div className="space-y-4 max-w-md">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-800">Mật khẩu hiện tại</label>
                  <input
                    type="password"
                    required
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-xs outline-none focus:border-zinc-950"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-800">Mật khẩu mới</label>
                  <input
                    type="password"
                    required
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-xs outline-none focus:border-zinc-950"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-800">Xác nhận mật khẩu mới</label>
                  <input
                    type="password"
                    required
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-xs outline-none focus:border-zinc-950"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-100 flex justify-end">
                <button type="submit" className="luxury-btn-accent text-xs px-6 py-3">
                  <KeyRound className="w-4 h-4" />
                  <span>Cập Nhật Mật Khẩu</span>
                </button>
              </div>
            </form>
          )}

        </div>

      </div>

    </div>
  );
};

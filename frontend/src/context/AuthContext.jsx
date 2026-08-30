import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../services/api';
import { useToast } from './ToastContext';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    const existing = authApi.getCurrentUser();
    if (existing) {
      setUser(existing);
    } else {
      // Default to guest/demo customer
      const defaultUser = {
        userId: 'USER003',
        username: 'nguyenvana',
        fullName: 'Nguyễn Văn A',
        email: 'nguyenvana@gmail.com',
        role: 'customer',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300'
      };
      setUser(defaultUser);
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      const res = await authApi.login({ username, password });
      if (res.success) {
        setUser(res.user);
        addToast(`Chào mừng trở lại, ${res.user.fullName}!`, 'success', 'ĐĂNG NHẬP THÀNH CÔNG');
        return true;
      }
    } catch (err) {
      addToast('Tên đăng nhập hoặc mật khẩu không chính xác!', 'error', 'ĐĂNG NHẬP THẤT BẠI');
      return false;
    }
  };

  const register = async (data) => {
    try {
      const res = await authApi.register(data);
      if (res.success) {
        setUser(res.user);
        addToast('Đăng ký tài khoản thành công!', 'success');
        return true;
      }
    } catch (err) {
      addToast('Không thể đăng ký tài khoản. Vui lòng thử lại!', 'error');
      return false;
    }
  };

  const logout = () => {
    authApi.logout();
    setUser(null);
    addToast('Bạn đã đăng xuất khỏi hệ thống.', 'info', 'ĐÃ ĐĂNG XUẤT');
  };

  const switchDemoRole = async (roleName) => {
    const r = roleName.toLowerCase();
    if (r === 'admin') {
      const adminUser = {
        userId: 'USER001',
        username: 'admin',
        fullName: 'Quản Trị Viên Hệ Thống',
        email: 'admin@novaapparel.vn',
        role: 'admin',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300'
      };
      setUser(adminUser);
      localStorage.setItem('fms_current_user', JSON.stringify(adminUser));
      addToast('Đã chuyển sang vai trò: QUẢN TRỊ VIÊN (ADMIN)', 'info');
    } else if (r === 'staff') {
      const staffUser = {
        userId: 'USER002',
        username: 'staff01',
        fullName: 'Nguyễn Văn Kho',
        email: 'staff01@novaapparel.vn',
        role: 'staff',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300'
      };
      setUser(staffUser);
      localStorage.setItem('fms_current_user', JSON.stringify(staffUser));
      addToast('Đã chuyển sang vai trò: NHÂN VIÊN KHO & BÁN HÀNG (STAFF)', 'info');
    } else {
      const custUser = {
        userId: 'USER003',
        username: 'nguyenvana',
        fullName: 'Nguyễn Văn A',
        email: 'nguyenvana@gmail.com',
        role: 'customer',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300'
      };
      setUser(custUser);
      localStorage.setItem('fms_current_user', JSON.stringify(custUser));
      addToast('Đã chuyển sang vai trò: KHÁCH HÀNG (CUSTOMER)', 'info');
    }
  };

  const role = user?.role?.toLowerCase() || 'guest';

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        switchDemoRole,
        isAuthenticated: !!user,
        isAdmin: role === 'admin',
        isStaff: role === 'staff' || role === 'admin',
        isCustomer: role === 'customer'
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

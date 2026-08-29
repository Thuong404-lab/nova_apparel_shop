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
    let targetUsername = 'nguyenvana';
    if (roleName === 'Admin') targetUsername = 'admin';
    if (roleName === 'Staff') targetUsername = 'staff01';
    await login(targetUsername, '123456');
  };

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
        isAdmin: user?.role === 'Admin',
        isStaff: user?.role === 'Staff' || user?.role === 'Admin',
        isCustomer: user?.role === 'Customer'
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

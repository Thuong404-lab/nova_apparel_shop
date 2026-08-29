import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const { addToast } = useToast();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center font-mono text-xs">Đang xác thực quyền truy cập...</div>;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const userRole = user.role?.toLowerCase() || 'customer';

  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-4 text-center space-y-4">
        <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center font-mono font-black text-xl shadow-md">
          403
        </div>
        <h2 className="font-display font-bold text-2xl text-zinc-900">Không Có Quyền Truy Cập (Forbidden)</h2>
        <p className="text-xs text-zinc-500 max-w-md">
          Tài khoản của bạn ({user.fullName} - vai trò: <strong className="uppercase text-zinc-800">{userRole}</strong>) không có quyền truy cập vào khu vực này.
        </p>
        <Navigate to="/" replace />
      </div>
    );
  }

  return children;
};

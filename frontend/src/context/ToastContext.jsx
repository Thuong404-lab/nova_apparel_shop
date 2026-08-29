import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success', title = '') => {
    const id = Date.now() + Math.random();
    const defaultTitle = type === 'success' ? 'THÀNH CÔNG' : type === 'error' ? 'LỖI' : 'THÔNG BÁO';
    const newToast = { id, message, type, title: title || defaultTitle };
    
    setToasts(prev => [...prev, newToast]);

    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      {/* Toast Notification Container */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
        {toasts.map(t => (
          <div
            key={t.id}
            className={`pointer-events-auto p-4 border-2 border-black flex items-start gap-3 transition-all duration-300 ${
              t.type === 'success'
                ? 'bg-black text-white shadow-[6px_6px_0px_#00ff66]'
                : t.type === 'error'
                ? 'bg-white text-black shadow-[6px_6px_0px_#ef4444]'
                : 'bg-white text-black shadow-[6px_6px_0px_#000000]'
            }`}
          >
            <div className="mt-0.5">
              {t.type === 'success' && <CheckCircle2 className="w-5 h-5 text-[#00ff66]" />}
              {t.type === 'error' && <AlertCircle className="w-5 h-5 text-red-500" />}
              {t.type === 'info' && <Info className="w-5 h-5 text-blue-500" />}
            </div>
            <div className="flex-1">
              <div className="font-display font-black text-sm tracking-wider uppercase mb-0.5">
                {t.title}
              </div>
              <p className="text-xs font-medium opacity-90 leading-relaxed">{t.message}</p>
            </div>
            <button
              onClick={() => removeToast(t.id)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);

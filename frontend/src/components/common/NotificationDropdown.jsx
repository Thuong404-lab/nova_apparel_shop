import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Package, Wallet, Tag, Sparkles, Check, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const initialNotifications = [
  {
    id: 'NOTIF001',
    type: 'order',
    title: 'Đơn hàng #ORD1001 đang được giao',
    desc: 'Shipper hỏa tốc đang trên đường giao đơn hàng đến địa chỉ Cầu Giấy, Hà Nội.',
    time: '5 phút trước',
    unread: true,
    link: '/orders/ORD1001'
  },
  {
    id: 'NOTIF002',
    type: 'wallet',
    title: 'Nạp tiền thành công +2.000.000₫',
    desc: 'Số dư ví Nova Wallet của bạn hiện tại là 5.000.000₫.',
    time: '2 giờ trước',
    unread: true,
    link: '/wallet'
  },
  {
    id: 'NOTIF003',
    type: 'promo',
    title: 'Tặng bạn mã giảm giá NOVA15 (-15%)',
    desc: 'Áp dụng cho toàn bộ BST Áo Khoác Biker và Quần Cargo mới ra mắt.',
    time: 'Hôm qua',
    unread: true,
    link: '/catalog'
  },
  {
    id: 'NOTIF004',
    type: 'system',
    title: 'Chào mừng bạn đến với NOVA APPAREL',
    desc: 'Tài khoản thành viên VIP của bạn đã được kích hoạt thành công.',
    time: '3 ngày trước',
    unread: false,
    link: '/profile'
  }
];

export const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState(initialNotifications);
  const [activeFilter, setActiveFilter] = useState('all');

  const unreadCount = notifications.filter(n => n.unread).length;

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  };

  const filteredNotifs = notifications.filter(n => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'unread') return n.unread;
    return n.type === activeFilter;
  });

  return (
    <div className="relative">
      
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 rounded-full hover:bg-zinc-100 text-zinc-700 hover:text-black transition-colors cursor-pointer"
        aria-label="Thông báo"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center font-mono">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Popover Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop for closing */}
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-3xl shadow-2xl border border-zinc-200/80 z-50 overflow-hidden"
            >
              {/* Header */}
              <div className="p-4 border-b border-zinc-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="font-display font-bold text-sm text-zinc-950">Thông Báo</h3>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 bg-rose-100 text-rose-600 text-[10px] font-bold rounded-full">
                      {unreadCount} mới
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-[11px] font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 cursor-pointer"
                  >
                    <Check className="w-3 h-3" />
                    <span>Đọc tất cả</span>
                  </button>
                )}
              </div>

              {/* Filter Tabs */}
              <div className="flex gap-1 p-2 bg-zinc-50 border-b border-zinc-100 text-[11px] font-semibold">
                {[
                  { id: 'all', label: 'Tất cả' },
                  { id: 'unread', label: 'Chưa đọc' },
                  { id: 'order', label: 'Đơn hàng' },
                  { id: 'wallet', label: 'Ví tiền' },
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveFilter(tab.id)}
                    className={`flex-1 py-1.5 rounded-xl transition-all cursor-pointer ${
                      activeFilter === tab.id 
                        ? 'bg-zinc-950 text-white shadow-xs' 
                        : 'text-zinc-500 hover:text-black'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Notification Items List */}
              <div className="max-h-80 overflow-y-auto divide-y divide-zinc-100">
                {filteredNotifs.length === 0 ? (
                  <div className="p-8 text-center text-xs text-zinc-400">
                    Không có thông báo nào.
                  </div>
                ) : (
                  filteredNotifs.map((notif) => {
                    const isOrder = notif.type === 'order';
                    const isWallet = notif.type === 'wallet';
                    const isPromo = notif.type === 'promo';

                    return (
                      <Link
                        key={notif.id}
                        to={notif.link}
                        onClick={() => setIsOpen(false)}
                        className={`flex gap-3.5 p-4 hover:bg-zinc-50 transition-colors block ${
                          notif.unread ? 'bg-emerald-50/30' : ''
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${
                          isOrder ? 'bg-blue-100 text-blue-600' :
                          isWallet ? 'bg-emerald-100 text-emerald-600' :
                          isPromo ? 'bg-rose-100 text-rose-600' : 'bg-zinc-100 text-zinc-600'
                        }`}>
                          {isOrder && <Package className="w-4 h-4" />}
                          {isWallet && <Wallet className="w-4 h-4" />}
                          {isPromo && <Tag className="w-4 h-4" />}
                          {!isOrder && !isWallet && !isPromo && <Sparkles className="w-4 h-4" />}
                        </div>

                        <div className="flex-1 min-w-0 space-y-1">
                          <div className="flex items-center justify-between">
                            <p className="text-xs font-bold text-zinc-900 truncate">{notif.title}</p>
                            {notif.unread && <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0"></span>}
                          </div>
                          <p className="text-[11px] text-zinc-500 leading-snug line-clamp-2">{notif.desc}</p>
                          <span className="text-[10px] text-zinc-400 font-mono block">{notif.time}</span>
                        </div>
                      </Link>
                    );
                  })
                )}
              </div>

              {/* Footer */}
              <div className="p-3 bg-zinc-50 border-t border-zinc-100 text-center">
                <Link
                  to="/orders"
                  onClick={() => setIsOpen(false)}
                  className="text-xs font-semibold text-zinc-700 hover:text-black inline-flex items-center gap-1"
                >
                  <span>Theo dõi tất cả đơn hàng</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Package, 
  ChevronRight, 
  Clock, 
  CheckCircle2, 
  Truck, 
  XCircle, 
  ShoppingBag,
  ArrowRight
} from 'lucide-react';
import { orderApi } from '../../services/api';
import { formatCurrency, formatDate, getOrderStatusInfo, getPaymentStatusInfo } from '../../utils/formatters';

export const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrders() {
      setLoading(true);
      try {
        const res = await orderApi.getAll();
        if (res.success) setOrders(res.data);
      } finally {
        setLoading(false);
      }
    }
    loadOrders();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header */}
      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 font-mono">
          PURCHASE HISTORY
        </span>
        <h1 className="font-display font-black text-3xl sm:text-4xl text-zinc-950 mt-1">
          Lịch Sử Mua Hàng ({orders.length} đơn)
        </h1>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((n) => (
            <div key={n} className="h-40 bg-zinc-200 rounded-3xl animate-pulse"></div>
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-3xl border border-zinc-200 p-16 text-center space-y-4 shadow-sm">
          <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mx-auto text-zinc-400">
            <Package className="w-8 h-8" />
          </div>
          <h3 className="font-display font-bold text-xl text-zinc-900">Bạn Chưa Có Đơn Hàng Nào</h3>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto">
            Hãy khám phá các thiết kế thời trang mới nhất và sắm ngay cho mình món đồ yêu thích.
          </p>
          <Link to="/catalog" className="luxury-btn-accent text-xs inline-flex">
            <span>Bắt Đầu Mua Sắm</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const statusInfo = getOrderStatusInfo(order.orderStatus);
            return (
              <div
                key={order.orderId}
                className="bg-white rounded-3xl border border-zinc-200/80 p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow space-y-6"
              >
                {/* Header Row */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-100 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-zinc-100 rounded-2xl text-zinc-900">
                      <Package className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="font-display font-bold text-sm text-zinc-950 block">
                        Đơn hàng #{order.orderId}
                      </span>
                      <span className="text-[11px] text-zinc-400 font-mono">
                        Đặt ngày {formatDate(order.createdAt)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 text-xs font-bold rounded-full ${statusInfo.color} ${statusInfo.bg}`}>
                      {statusInfo.label}
                    </span>
                  </div>
                </div>

                {/* Items Preview */}
                <div className="space-y-3">
                  {order.items?.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4 text-xs">
                      <img src={item.image} alt="" className="w-14 h-16 object-cover rounded-xl bg-zinc-100 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-zinc-900 line-clamp-1">{item.name}</p>
                        <p className="text-zinc-500 text-[11px]">
                          Phân loại: {item.sizeName} • {item.colorName} • SL: {item.quantity}
                        </p>
                      </div>
                      <span className="font-mono font-bold text-zinc-900">
                        {formatCurrency(item.unitPrice * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Footer Row */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-zinc-100">
                  <div className="text-xs text-zinc-500">
                    Phương thức: <strong className="text-zinc-900">{order.paymentMethod}</strong>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <span className="text-[11px] text-zinc-400 block font-mono">Tổng thanh toán</span>
                      <span className="font-display font-black text-lg text-emerald-600">
                        {formatCurrency(order.totalAmount)}
                      </span>
                    </div>

                    <Link
                      to={`/orders/${order.orderId}`}
                      className="luxury-btn-secondary text-xs px-4 py-2.5 flex items-center gap-1.5"
                    >
                      <span>Chi Tiết</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Clock, Eye, AlertTriangle, ArrowRight } from 'lucide-react';
import { orderApi } from '../../services/api';
import { formatCurrency, formatDate, getOrderStatusInfo, getPaymentStatusInfo } from '../../utils/formatters';
import { useToast } from '../../context/ToastContext';

export const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('All');
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await orderApi.getMyOrders();
      if (res.success) {
        setOrders(res.data);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCancelOrder = async (orderId) => {
    if (window.confirm(`Bạn có chắc chắn muốn hủy đơn hàng ${orderId}?`)) {
      const res = await orderApi.cancel(orderId);
      if (res.success) {
        addToast(res.message, 'success');
        fetchOrders();
      }
    }
  };

  const filteredOrders = orders.filter((o) => {
    if (activeTab === 'All') return true;
    return o.orderStatus === activeTab;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-black text-white p-6 border-3 border-black shadow-[6px_6px_0px_#00ff66] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="font-mono text-xs text-[#00ff66] uppercase tracking-widest block mb-1">
            CUSTOMER PORTAL // ORDERS TRACKING
          </span>
          <h1 className="font-display font-black text-2xl sm:text-4xl uppercase tracking-tight">
            LỊCH SỬ ĐƠN HÀNG ({orders.length})
          </h1>
        </div>
        <Link to="/catalog" className="inline-flex neo-btn neo-btn-neon text-xs">
          Tiếp Tục Mua Sắm
        </Link>
      </div>

      {/* Tabs Bar */}
      <div className="flex gap-2 overflow-x-auto pb-2 border-b-2 border-black">
        {[
          { id: 'All', label: 'Tất Cả' },
          { id: 'Pending', label: 'Chờ Xác Nhận' },
          { id: 'Confirmed', label: 'Đã Xác Nhận' },
          { id: 'Shipping', label: 'Đang Giao' },
          { id: 'Delivered', label: 'Đã Giao' },
          { id: 'Cancelled', label: 'Đã Hủy' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 font-display font-bold text-xs uppercase tracking-wider border-2 border-black transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-black text-[#00ff66] shadow-[3px_3px_0px_#000]'
                : 'bg-white text-black hover:bg-neutral-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="text-center py-16 font-display font-bold text-xs uppercase">
          Đang tải danh sách đơn hàng...
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="bg-white border-2 border-black p-12 text-center shadow-[6px_6px_0px_#000] space-y-4">
          <div className="w-16 h-16 bg-neutral-100 border-2 border-black flex items-center justify-center mx-auto shadow-[4px_4px_0px_#000]">
            <Package className="w-8 h-8 text-neutral-400" />
          </div>
          <h3 className="font-display font-black text-base uppercase">Không Có Đơn Hàng Nào</h3>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto">
            Bạn chưa có đơn hàng nào trong trạng thái này. Khám phá các bộ sưu tập của chúng tôi để mua sắm ngay!
          </p>
          <Link to="/catalog" className="inline-flex neo-btn neo-btn-neon text-xs">
            Khám Phá Sản Phẩm
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredOrders.map((order) => {
            const statusInfo = getOrderStatusInfo(order.orderStatus);
            const paymentInfo = getPaymentStatusInfo(order.paymentStatus);
            const isPending = order.orderStatus === 'Pending';

            return (
              <div
                key={order.orderId}
                className="bg-white border-2 border-black shadow-[6px_6px_0px_#000] p-6 space-y-6"
              >
                {/* Order Top Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b-2 border-black gap-3">
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="font-display font-black text-base tracking-tight">
                        ĐƠN HÀNG #{order.orderId}
                      </h3>
                      <span className={`neo-badge text-[10px] ${statusInfo.color}`}>
                        {statusInfo.label}
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-neutral-500 block mt-1">
                      Đặt ngày: {formatDate(order.placedAt)} | Phương thức: <strong className="text-black uppercase">{order.paymentMethod}</strong> ({paymentInfo.label})
                    </span>
                  </div>

                  {/* Expiration Countdown badge for Pending */}
                  {isPending && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 border border-amber-400 text-amber-900 text-xs font-mono font-bold">
                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                      Hết hạn thanh toán/xác nhận sau: 47 giờ
                    </div>
                  )}
                </div>

                {/* Items List */}
                <div className="divide-y divide-neutral-200">
                  {order.items?.map((item, idx) => (
                    <div key={idx} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image}
                          alt={item.productName || item.name}
                          className="w-14 h-18 object-cover border border-black flex-shrink-0"
                        />
                        <div>
                          <h4 className="font-display font-bold text-xs line-clamp-1">
                            {item.productName || item.name}
                          </h4>
                          <span className="text-[10px] font-mono text-neutral-500 block mt-0.5">
                            Biến thể: {item.sizeName} - {item.colorName} | SL: x{item.quantity}
                          </span>
                        </div>
                      </div>
                      <span className="font-display font-black text-xs text-black">
                        {formatCurrency(item.unitPrice * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Bottom Total & Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-4 border-t-2 border-black gap-4 bg-neutral-50 p-4 -mx-6 -mb-6">
                  <div>
                    <span className="text-xs text-neutral-500 font-medium">Tổng số tiền:</span>
                    <span className="font-display font-black text-lg text-[#ff4d00] block sm:inline sm:ml-2">
                      {formatCurrency(order.totalAmount)}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    {isPending && (
                      <button
                        onClick={() => handleCancelOrder(order.orderId)}
                        className="py-2.5 px-4 neo-btn neo-btn-danger text-xs"
                      >
                        Hủy Đơn Hàng
                      </button>
                    )}
                    <Link
                      to={`/orders/${order.orderId}`}
                      className="py-2.5 px-4 neo-btn neo-btn-secondary text-xs flex items-center gap-1.5"
                    >
                      <Eye className="w-4 h-4" /> Chi Tiết Đơn Hàng
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

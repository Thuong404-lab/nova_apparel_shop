import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Package, 
  ChevronLeft, 
  MapPin, 
  Phone, 
  CreditCard, 
  Truck, 
  CheckCircle2, 
  Clock, 
  ShieldCheck,
  Printer,
  Sparkles
} from 'lucide-react';
import { orderApi } from '../../services/api';
import { formatCurrency, formatDate, getOrderStatusInfo, getPaymentStatusInfo } from '../../utils/formatters';

export const OrderDetailPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrder() {
      setLoading(true);
      try {
        const res = await orderApi.getById(id);
        if (res.success) setOrder(res.data);
      } finally {
        setLoading(false);
      }
    }
    loadOrder();
  }, [id]);

  if (loading) {
    return <div className="max-w-4xl mx-auto px-4 py-20 animate-pulse h-96 bg-zinc-200 rounded-3xl"></div>;
  }

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-display font-bold text-2xl">Không tìm thấy thông tin đơn hàng #{id}!</h2>
        <Link to="/orders" className="luxury-btn-primary inline-flex">Quay lại danh sách đơn</Link>
      </div>
    );
  }

  const statusInfo = getOrderStatusInfo(order.orderStatus);

  const trackingSteps = [
    { title: 'Đặt hàng thành công', desc: 'Đơn hàng đã được tiếp nhận', done: true },
    { title: 'Kho đóng gói', desc: 'Sản phẩm đã kiểm định chất lượng', done: true },
    { title: 'Đang vận chuyển', desc: 'Bưu tá NOVA Express đang giao', done: order.orderStatus === 'Shipping' || order.orderStatus === 'Delivered' },
    { title: 'Giao hàng thành công', desc: 'Khách hàng đã nhận kiện hàng', done: order.orderStatus === 'Delivered' },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Back Link */}
      <Link to="/orders" className="inline-flex items-center gap-1 text-xs font-semibold text-zinc-500 hover:text-black">
        <ChevronLeft className="w-4 h-4" />
        <span>Quay lại lịch sử mua hàng</span>
      </Link>

      {/* Main Order Card */}
      <div className="bg-white rounded-3xl border border-zinc-200 p-6 sm:p-10 shadow-sm space-y-10">
        
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-100 pb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 font-mono">
              ORDER TRACKING
            </span>
            <h1 className="font-display font-black text-2xl sm:text-3xl text-zinc-950 mt-1">
              Chi Tiết Đơn Hàng #{order.orderId}
            </h1>
            <p className="text-xs text-zinc-400 font-mono mt-1">Thời gian đặt: {formatDate(order.createdAt)}</p>
          </div>

          <div className="flex items-center gap-3">
            <span className={`px-3.5 py-1.5 text-xs font-bold rounded-full ${statusInfo.color} ${statusInfo.bg}`}>
              {statusInfo.label}
            </span>
            <button 
              onClick={() => window.print()}
              className="p-2.5 rounded-xl border border-zinc-200 hover:bg-zinc-50 text-zinc-700 transition-colors"
              title="In hóa đơn"
            >
              <Printer className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Live Tracking Timeline */}
        <div className="bg-zinc-50 rounded-2xl p-6 border border-zinc-100 space-y-6">
          <h3 className="font-display font-bold text-sm text-zinc-900 flex items-center gap-2">
            <Truck className="w-4 h-4 text-emerald-600" />
            <span>Tiến Độ Giao Hàng Hỏa Tốc</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            {trackingSteps.map((step, idx) => (
              <div key={idx} className="flex sm:flex-col items-start gap-3 sm:gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                  step.done ? 'bg-emerald-500 text-white shadow-md' : 'bg-zinc-200 text-zinc-400'
                }`}>
                  {step.done ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                </div>
                <div>
                  <p className="font-bold text-xs text-zinc-900">{step.title}</p>
                  <p className="text-[11px] text-zinc-500 leading-tight mt-0.5">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Customer & Shipping Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-6 rounded-2xl border border-zinc-100 bg-white">
          <div className="space-y-1.5 text-xs">
            <h4 className="font-bold text-zinc-900 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-emerald-600" />
              <span>Địa Chỉ Giao Hàng</span>
            </h4>
            <p className="text-zinc-800 font-semibold">{order.customerName}</p>
            <p className="text-zinc-500">SĐT: {order.phone || '0987654321'}</p>
            <p className="text-zinc-500">{order.address}</p>
          </div>

          <div className="space-y-1.5 text-xs">
            <h4 className="font-bold text-zinc-900 flex items-center gap-1.5">
              <CreditCard className="w-4 h-4 text-emerald-600" />
              <span>Phương Thức Thanh Toán</span>
            </h4>
            <p className="text-zinc-800 font-semibold">{order.paymentMethod}</p>
            <p className="text-zinc-500">Trạng thái: <strong className="text-emerald-600">Đã thanh toán</strong></p>
            <p className="text-zinc-400">Đơn vị vận chuyển: NOVA Express Hỏa Tốc</p>
          </div>
        </div>

        {/* Items Table */}
        <div className="space-y-4">
          <h3 className="font-display font-bold text-base text-zinc-950">Danh Sách Món Đồ</h3>
          <div className="divide-y divide-zinc-100 border border-zinc-100 rounded-2xl overflow-hidden">
            {order.items?.map((item, idx) => (
              <div key={idx} className="p-4 flex items-center justify-between gap-4 bg-zinc-50/30">
                <div className="flex items-center gap-4">
                  <img src={item.image} alt="" className="w-14 h-16 object-cover rounded-xl bg-zinc-200" />
                  <div>
                    <h5 className="font-bold text-xs text-zinc-900">{item.name}</h5>
                    <p className="text-[11px] text-zinc-400 mt-0.5">
                      Phân loại: {item.sizeName} • {item.colorName} • Đơn giá: {formatCurrency(item.unitPrice)}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs text-zinc-500 block">SL: {item.quantity}</span>
                  <span className="font-display font-bold text-sm text-zinc-950">
                    {formatCurrency(item.unitPrice * item.quantity)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Total Calculation */}
        <div className="border-t border-zinc-100 pt-6 flex justify-end">
          <div className="w-full sm:w-72 space-y-2 text-xs text-zinc-600">
            <div className="flex justify-between">
              <span>Tạm tính tiền hàng:</span>
              <span className="font-mono font-bold text-zinc-950">{formatCurrency(order.totalAmount)}</span>
            </div>
            <div className="flex justify-between">
              <span>Phí vận chuyển:</span>
              <span className="font-mono font-semibold text-emerald-600">MIỄN PHÍ</span>
            </div>
            <div className="pt-3 border-t border-zinc-200 flex justify-between items-baseline">
              <span className="font-bold text-sm text-zinc-950">Tổng thanh toán:</span>
              <span className="font-display font-black text-2xl text-emerald-600">
                {formatCurrency(order.totalAmount)}
              </span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

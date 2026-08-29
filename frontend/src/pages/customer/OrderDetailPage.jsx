import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Package, 
  Clock, 
  Truck, 
  CheckCircle2, 
  Printer, 
  ArrowLeft, 
  MapPin, 
  Phone, 
  CreditCard,
  AlertCircle
} from 'lucide-react';
import { orderApi } from '../../services/api';
import { formatCurrency, formatDate, getOrderStatusInfo, getPaymentStatusInfo } from '../../utils/formatters';

export const OrderDetailPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      try {
        const res = await orderApi.getById(id);
        if (res.success && res.data) {
          setOrder(res.data);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center font-display font-bold uppercase text-xs">
        Đang tải thông tin đơn hàng #{id}...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-display font-black text-2xl uppercase">Không tìm thấy đơn hàng #{id}</h2>
        <Link to="/orders" className="inline-flex neo-btn neo-btn-neon text-xs">Quay lại danh sách đơn hàng</Link>
      </div>
    );
  }

  const statusInfo = getOrderStatusInfo(order.orderStatus);
  const paymentInfo = getPaymentStatusInfo(order.paymentStatus);

  const steps = [
    { label: 'Chờ Xác Nhận', stepNum: 1 },
    { label: 'Đã Xác Nhận', stepNum: 2 },
    { label: 'Đang Chuẩn Bị', stepNum: 3 },
    { label: 'Đang Vận Chuyển', stepNum: 4 },
    { label: 'Giao Thành Công', stepNum: 5 }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Top Action Bar */}
      <div className="flex items-center justify-between">
        <Link to="/orders" className="inline-flex items-center gap-1.5 text-xs font-display font-bold uppercase hover:text-[#ff4d00]">
          <ArrowLeft className="w-4 h-4" /> Quay Lại Đơn Hàng
        </Link>
        <button
          onClick={() => window.print()}
          className="py-2 px-4 neo-btn neo-btn-secondary text-xs flex items-center gap-2"
        >
          <Printer className="w-4 h-4" /> In Hóa Đơn (PDF)
        </button>
      </div>

      {/* Main Order Card */}
      <div className="bg-white border-3 border-black p-8 shadow-[8px_8px_0px_#000] space-y-8">
        
        {/* Order Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b-2 border-black gap-4">
          <div>
            <span className="font-mono text-xs text-neutral-500 uppercase tracking-wider block mb-1">
              CHI TIẾT ĐƠN HÀNG TRỰC TUYẾN
            </span>
            <h1 className="font-display font-black text-2xl sm:text-3xl uppercase tracking-tight">
              ĐƠN HÀNG #{order.orderId}
            </h1>
            <span className="text-xs font-mono text-neutral-600 block mt-1">
              Thời gian tạo: {formatDate(order.placedAt)}
            </span>
          </div>

          <span className={`neo-badge text-xs px-3 py-1.5 ${statusInfo.color}`}>
            {statusInfo.label}
          </span>
        </div>

        {/* Progress Tracker Timeline */}
        {order.orderStatus !== 'Cancelled' ? (
          <div className="p-6 bg-neutral-900 text-white border-2 border-black space-y-4">
            <h3 className="font-display font-black text-xs uppercase tracking-wider text-[#00ff66]">
              TIẾN TRÌNH VẬN CHUYỂN
            </h3>
            <div className="grid grid-cols-5 gap-2 text-center">
              {steps.map((s) => {
                const isPassed = statusInfo.step >= s.stepNum;
                const isCurrent = statusInfo.step === s.stepNum;
                return (
                  <div key={s.stepNum} className="space-y-2">
                    <div className={`w-8 h-8 rounded-full border-2 border-black flex items-center justify-center mx-auto text-xs font-black ${
                      isPassed ? 'bg-[#00ff66] text-black ring-2 ring-white' : 'bg-neutral-800 text-neutral-500'
                    }`}>
                      {isPassed ? '✓' : s.stepNum}
                    </div>
                    <span className={`text-[10px] font-mono font-bold block ${
                      isCurrent ? 'text-[#00ff66]' : isPassed ? 'text-white' : 'text-neutral-500'
                    }`}>
                      {s.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="p-4 bg-red-100 border-2 border-red-500 text-red-900 text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <span>Đơn hàng này đã bị hủy. Mọi khoản hoàn tiền (nếu có qua Ví) sẽ được hoàn trả tự động.</span>
          </div>
        )}

        {/* Customer & Shipping Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-neutral-50 border-2 border-black">
          <div className="space-y-2">
            <h4 className="font-display font-black text-xs uppercase flex items-center gap-1.5 text-neutral-800">
              <MapPin className="w-4 h-4 text-black" /> THÔNG TIN NHẬN HÀNG
            </h4>
            <div className="text-xs space-y-1">
              <p><strong className="text-black">Họ tên:</strong> {order.customerName}</p>
              <p><strong className="text-black">Điện thoại:</strong> {order.customerPhone}</p>
              <p><strong className="text-black">Địa chỉ:</strong> {order.shippingAddress}</p>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-display font-black text-xs uppercase flex items-center gap-1.5 text-neutral-800">
              <CreditCard className="w-4 h-4 text-black" /> THANH TOÁN
            </h4>
            <div className="text-xs space-y-1">
              <p><strong className="text-black">Hình thức:</strong> <span className="uppercase text-blue-600 font-bold">{order.paymentMethod}</span></p>
              <p><strong className="text-black">Trạng thái:</strong> <span className={`neo-badge text-[10px] ${paymentInfo.color}`}>{paymentInfo.label}</span></p>
              <p><strong className="text-black">Đã thanh toán:</strong> {formatCurrency(order.paidAmount || 0)}</p>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="space-y-3">
          <h3 className="font-display font-black text-sm uppercase">DANH SÁCH SẢN PHẨM</h3>
          <div className="border-2 border-black divide-y divide-neutral-200">
            {order.items?.map((item, idx) => (
              <div key={idx} className="p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <img src={item.image} alt={item.productName} className="w-14 h-18 object-cover border border-black" />
                  <div>
                    <h4 className="font-display font-bold text-xs">{item.productName}</h4>
                    <span className="text-[11px] font-mono text-neutral-500 block">
                      Size: {item.sizeName} | Màu: {item.colorName}
                    </span>
                    <span className="text-[11px] font-mono text-neutral-500 block">
                      Đơn giá: {formatCurrency(item.unitPrice)} x {item.quantity}
                    </span>
                  </div>
                </div>
                <span className="font-display font-black text-sm text-black">
                  {formatCurrency(item.unitPrice * item.quantity)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Total Summary */}
        <div className="pt-4 border-t-2 border-black space-y-2 text-xs">
          <div className="flex justify-between text-neutral-600">
            <span>Tạm tính tiền hàng:</span>
            <span className="font-mono font-bold text-black">{formatCurrency(order.totalAmount)}</span>
          </div>
          <div className="flex justify-between text-neutral-600">
            <span>Phí vận chuyển:</span>
            <span className="font-mono font-bold text-emerald-600">MIỄN PHÍ</span>
          </div>
          <div className="flex justify-between text-base font-display font-black pt-3 border-t border-neutral-300">
            <span>TỔNG TIỀN ĐƠN HÀNG:</span>
            <span className="text-[#ff4d00]">{formatCurrency(order.totalAmount)}</span>
          </div>
        </div>

      </div>
    </div>
  );
};

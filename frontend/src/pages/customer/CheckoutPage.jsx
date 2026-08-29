import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  CreditCard, 
  Wallet, 
  Truck, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles,
  QrCode,
  MapPin,
  User,
  Phone
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { orderApi, walletApi } from '../../services/api';
import { formatCurrency } from '../../utils/formatters';
import confetti from 'canvas-confetti';

const FREE_SHIPPING_THRESHOLD = 500000;

export const CheckoutPage = () => {
  const { items, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: user?.fullName || 'Nguyễn Văn A',
    phone: '0987654321',
    address: '123 Đường Cầu Giấy',
    city: 'Hà Nội',
    paymentMethod: 'Wallet', // Wallet | COD | VNPay
    note: ''
  });

  const [walletBalance, setWalletBalance] = useState(5000000);
  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);

  useEffect(() => {
    async function loadWallet() {
      const res = await walletApi.get();
      if (res.success && res.data) {
        setWalletBalance(res.data.balance);
      }
    }
    loadWallet();
  }, []);

  const shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 30000;
  const finalTotal = subtotal + shippingFee;

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    if (items.length === 0) return;

    if (formData.paymentMethod === 'Wallet' && walletBalance < finalTotal) {
      addToast('Số dư Ví Nova Wallet không đủ. Vui lòng nạp thêm tiền hoặc chọn hình thức COD!', 'error', 'SỐ DƯ KHÔNG ĐỦ');
      return;
    }

    setLoading(true);
    try {
      const orderPayload = {
        customerId: user?.userId || 'CUST001',
        customerName: formData.fullName,
        phone: formData.phone,
        address: `${formData.address}, ${formData.city}`,
        paymentMethod: formData.paymentMethod,
        items: items,
        totalAmount: finalTotal,
        note: formData.note
      };

      const res = await orderApi.create(orderPayload);
      if (res.success) {
        setOrderSuccess(res.data);
        clearCart();
        
        // Confetti explosion
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 }
        });
      }
    } finally {
      setLoading(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', damping: 15 }}
          className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-xl"
        >
          <CheckCircle2 className="w-12 h-12" />
        </motion.div>

        <div className="space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 font-mono">
            ORDER COMPLETED
          </span>
          <h1 className="font-display font-black text-3xl sm:text-4xl text-zinc-950">
            Đặt Hàng Thành Công!
          </h1>
          <p className="text-sm text-zinc-500 max-w-md mx-auto">
            Mã đơn hàng: <strong className="text-zinc-950 font-mono">{orderSuccess.orderId}</strong>. Đơn hàng đang được bộ phận kho NOVA đóng gói và giao hỏa tốc đến bạn.
          </p>
        </div>

        <div className="p-6 bg-white rounded-3xl border border-zinc-200 shadow-sm max-w-md mx-auto text-left space-y-3 text-xs">
          <div className="flex justify-between">
            <span className="text-zinc-500">Khách hàng:</span>
            <span className="font-bold text-zinc-900">{orderSuccess.customerName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-500">Phương thức:</span>
            <span className="font-bold text-zinc-900">{orderSuccess.paymentMethod}</span>
          </div>
          <div className="flex justify-between border-t border-zinc-100 pt-3">
            <span className="text-zinc-500">Tổng tiền:</span>
            <span className="font-display font-black text-base text-emerald-600">
              {formatCurrency(orderSuccess.totalAmount)}
            </span>
          </div>
        </div>

        <div className="flex justify-center gap-4 pt-4">
          <Link to="/orders" className="luxury-btn-accent text-xs">
            <span>Quản Lý Đơn Hàng</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link to="/catalog" className="luxury-btn-secondary text-xs">
            Tiếp Tục Mua Sắm
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header */}
      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 font-mono">
          CHECKOUT // STEP 2
        </span>
        <h1 className="font-display font-black text-3xl sm:text-4xl text-zinc-950 mt-1">
          Thông Tin Thanh Toán
        </h1>
      </div>

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Form: Shipping & Payment (7 cols) */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* 1. Shipping Details */}
          <div className="bg-white rounded-3xl border border-zinc-200 p-6 sm:p-8 space-y-6 shadow-sm">
            <h3 className="font-display font-bold text-lg text-zinc-950 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-emerald-600" />
              <span>Địa Chỉ Nhận Hàng</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-bold text-zinc-800">Họ và Tên người nhận *</label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-xs outline-none focus:border-zinc-950"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-800">Số Điện Thoại *</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-xs outline-none focus:border-zinc-950"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-800">Tỉnh / Thành Phố *</label>
                <input
                  type="text"
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-xs outline-none focus:border-zinc-950"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-bold text-zinc-800">Địa chỉ cụ thể (Số nhà, tên đường, phường/xã) *</label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-xs outline-none focus:border-zinc-950"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-bold text-zinc-800">Ghi chú cho shipper (Tùy chọn)</label>
                <textarea
                  rows="2"
                  value={formData.note}
                  onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                  placeholder="VD: Giao hàng vào giờ hành chính, gọi trước khi đến..."
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-xs outline-none focus:border-zinc-950"
                />
              </div>
            </div>
          </div>

          {/* 2. Payment Method */}
          <div className="bg-white rounded-3xl border border-zinc-200 p-6 sm:p-8 space-y-6 shadow-sm">
            <h3 className="font-display font-bold text-lg text-zinc-950 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-emerald-600" />
              <span>Phương Thức Thanh Toán</span>
            </h3>

            <div className="space-y-3">
              
              {/* Option 1: Nova Wallet */}
              <label 
                className={`flex items-start gap-4 p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                  formData.paymentMethod === 'Wallet' ? 'border-zinc-950 bg-zinc-50' : 'border-zinc-200 bg-white hover:border-zinc-300'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="Wallet"
                  checked={formData.paymentMethod === 'Wallet'}
                  onChange={() => setFormData({ ...formData, paymentMethod: 'Wallet' })}
                  className="mt-1 accent-zinc-950"
                />
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-display font-bold text-xs text-zinc-950 flex items-center gap-1.5">
                      <Wallet className="w-4 h-4 text-emerald-600" />
                      Ví Điện Tử Nova Wallet (Khuyên dùng)
                    </span>
                    <span className="text-[11px] font-mono font-bold text-emerald-600">
                      Số dư: {formatCurrency(walletBalance)}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-500">
                    Thanh toán trừ tiền tức thì không mất phí, tự động tích lũy điểm thành viên.
                  </p>
                  {walletBalance < finalTotal && (
                    <p className="text-[11px] text-rose-500 font-semibold">
                      ⚠️ Số dư ví không đủ (Cần thêm {formatCurrency(finalTotal - walletBalance)}). Hãy nạp thêm tại trang Ví hoặc chọn COD.
                    </p>
                  )}
                </div>
              </label>

              {/* Option 2: COD */}
              <label 
                className={`flex items-start gap-4 p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                  formData.paymentMethod === 'COD' ? 'border-zinc-950 bg-zinc-50' : 'border-zinc-200 bg-white hover:border-zinc-300'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="COD"
                  checked={formData.paymentMethod === 'COD'}
                  onChange={() => setFormData({ ...formData, paymentMethod: 'COD' })}
                  className="mt-1 accent-zinc-950"
                />
                <div className="flex-1 space-y-1">
                  <span className="font-display font-bold text-xs text-zinc-950 flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-emerald-600" />
                    Thanh toán tiền mặt khi nhận hàng (COD)
                  </span>
                  <p className="text-[11px] text-zinc-500">
                    Kiểm tra hàng trước khi thanh toán cho nhân viên bưu tá.
                  </p>
                </div>
              </label>

              {/* Option 3: VNPay QR */}
              <label 
                className={`flex items-start gap-4 p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                  formData.paymentMethod === 'VNPay' ? 'border-zinc-950 bg-zinc-50' : 'border-zinc-200 bg-white hover:border-zinc-300'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="VNPay"
                  checked={formData.paymentMethod === 'VNPay'}
                  onChange={() => setFormData({ ...formData, paymentMethod: 'VNPay' })}
                  className="mt-1 accent-zinc-950"
                />
                <div className="flex-1 space-y-1">
                  <span className="font-display font-bold text-xs text-zinc-950 flex items-center gap-1.5">
                    <QrCode className="w-4 h-4 text-emerald-600" />
                    Cổng Thanh Toán VNPay (Quét mã QR Ngân Hàng)
                  </span>
                  <p className="text-[11px] text-zinc-500">
                    Hỗ trợ quét mã QR qua hơn 40 ứng dụng ngân hàng và ví điện tử.
                  </p>
                </div>
              </label>

            </div>
          </div>

        </div>

        {/* Right: Order Review & Submit (5 cols) */}
        <div className="lg:col-span-5 space-y-6 sticky top-28">
          <div className="bg-white rounded-3xl border border-zinc-200 p-6 sm:p-8 space-y-6 shadow-sm">
            <h3 className="font-display font-bold text-base text-zinc-950">
              Kiểm Tra Đơn Hàng ({items.length} món)
            </h3>

            {/* Items Mini List */}
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.variantId} className="flex items-center gap-3 text-xs">
                  <img src={item.image} alt="" className="w-12 h-14 object-cover rounded-xl bg-zinc-100 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-zinc-900 truncate">{item.name}</p>
                    <p className="text-zinc-400 text-[11px]">{item.sizeName} • {item.colorName} • SL: {item.quantity}</p>
                  </div>
                  <span className="font-mono font-bold text-zinc-900">
                    {formatCurrency(item.unitPrice * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Price Calculations */}
            <div className="space-y-3 pt-4 border-t border-zinc-100 text-xs text-zinc-600">
              <div className="flex justify-between">
                <span>Tạm tính tiền hàng:</span>
                <span className="font-mono font-bold text-zinc-950">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Phí vận chuyển:</span>
                <span className="font-mono font-semibold text-zinc-950">
                  {shippingFee === 0 ? 'MIỄN PHÍ' : formatCurrency(shippingFee)}
                </span>
              </div>
              <div className="pt-4 border-t border-zinc-200 flex justify-between items-baseline">
                <span className="font-bold text-sm text-zinc-950">Tổng thanh toán:</span>
                <span className="font-display font-black text-2xl text-emerald-600">
                  {formatCurrency(finalTotal)}
                </span>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full luxury-btn-accent text-sm py-4 justify-center shadow-lg shadow-emerald-500/20 cursor-pointer"
            >
              <span>{loading ? 'Đang Xử Lý Đơn Hàng...' : `Xác Nhận Đặt Hàng (${formatCurrency(finalTotal)})`}</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </div>
        </div>

      </form>

    </div>
  );
};

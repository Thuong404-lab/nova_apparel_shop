import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  CreditCard, 
  Wallet, 
  Truck, 
  QrCode, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { orderApi, walletApi } from '../../services/api';
import { formatCurrency } from '../../utils/formatters';

export const CheckoutPage = () => {
  const { items, subtotal, totalItems, clearCart } = useCart();
  const { user } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  // Form State
  const [fullName, setFullName] = useState(user?.fullName || 'Nguyễn Văn A');
  const [phone, setPhone] = useState(user?.phone || '0901112223');
  const [address, setAddress] = useState(user?.address || '12 Hai Bà Trưng, Hoàn Kiếm, Hà Nội');
  const [note, setNote] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('COD'); // 'COD' | 'Wallet' | 'VNPay'

  // Wallet State
  const [walletBalance, setWalletBalance] = useState(0);
  const [loading, setLoading] = useState(false);

  // VNPay Modal State
  const [showVNPayModal, setShowVNPayModal] = useState(false);
  const [vnpayCountdown, setVnpayCountdown] = useState(300); // 5 mins
  const [orderSuccess, setOrderSuccess] = useState(null);

  const shippingFee = subtotal >= 500000 || subtotal === 0 ? 0 : 30000;
  const finalTotal = subtotal + shippingFee;

  useEffect(() => {
    const fetchWallet = async () => {
      const res = await walletApi.get();
      if (res.success && res.data) {
        setWalletBalance(res.data.balance);
      }
    };
    fetchWallet();
  }, []);

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!fullName || !phone || !address) {
      addToast('Vui lòng điền đầy đủ thông tin nhận hàng!', 'error');
      return;
    }

    if (items.length === 0) {
      addToast('Giỏ hàng của bạn đang trống!', 'error');
      return;
    }

    // Check wallet balance
    if (paymentMethod === 'Wallet' && walletBalance < finalTotal) {
      addToast('Số dư Ví Nova Wallet không đủ để thanh toán. Vui lòng nạp thêm hoặc chọn phương thức khác!', 'error');
      return;
    }

    // If VNPay selected -> open VNPay QR Simulator modal
    if (paymentMethod === 'VNPay') {
      setShowVNPayModal(true);
      return;
    }

    // Proceed with COD or Wallet payment
    setLoading(true);
    try {
      const orderPayload = {
        customerId: user?.id || 'CUST001',
        customerName: fullName,
        customerPhone: phone,
        shippingAddress: address,
        totalAmount: finalTotal,
        paymentMethod: paymentMethod,
        items: items
      };

      const res = await orderApi.create(orderPayload);
      if (res.success) {
        setOrderSuccess(res.data);
        triggerConfetti();
        addToast('Đặt hàng thành công!', 'success', 'ĐƠN HÀNG ĐÃ TẠO');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVNPayPaymentSuccess = async () => {
    setShowVNPayModal(false);
    setLoading(true);
    try {
      const orderPayload = {
        customerId: user?.id || 'CUST001',
        customerName: fullName,
        customerPhone: phone,
        shippingAddress: address,
        totalAmount: finalTotal,
        paymentMethod: 'VNPay',
        items: items
      };

      const res = await orderApi.create(orderPayload);
      if (res.success) {
        setOrderSuccess(res.data);
        triggerConfetti();
        addToast('Thanh toán VNPay thành công!', 'success', 'GIAO DỊCH HOÀN TẤT');
      }
    } finally {
      setLoading(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16">
        <div className="bg-white border-3 border-black p-8 sm:p-12 text-center shadow-[10px_10px_0px_#00ff66] space-y-6">
          <div className="w-20 h-20 bg-[#00ff66] text-black border-2 border-black flex items-center justify-center mx-auto shadow-[4px_4px_0px_#000]">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <span className="neo-badge bg-black text-[#00ff66] text-xs mb-2">
              ĐẶT HÀNG THÀNH CÔNG
            </span>
            <h2 className="font-display font-black text-3xl uppercase tracking-tight">
              CẢM ƠN BẠN ĐÃ MUA SẮM!
            </h2>
            <p className="text-xs text-neutral-600 font-mono mt-1">
              Mã đơn hàng: <span className="font-black text-black">{orderSuccess.orderId}</span>
            </p>
          </div>

          <div className="p-4 bg-neutral-50 border-2 border-black text-left text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-neutral-500 font-medium">Người nhận:</span>
              <span className="font-bold">{orderSuccess.customerName} ({orderSuccess.customerPhone})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500 font-medium">Địa chỉ giao:</span>
              <span className="font-bold text-right max-w-xs">{orderSuccess.shippingAddress}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500 font-medium">Phương thức:</span>
              <span className="font-bold uppercase text-blue-600">{orderSuccess.paymentMethod}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-neutral-300 font-display font-black text-sm">
              <span>Tổng thanh toán:</span>
              <span className="text-[#ff4d00]">{formatCurrency(orderSuccess.totalAmount)}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link
              to={`/orders/${orderSuccess.orderId}`}
              className="flex-1 py-3.5 neo-btn neo-btn-neon text-xs text-center"
            >
              Theo Dõi Đơn Hàng
            </Link>
            <Link
              to="/catalog"
              className="flex-1 py-3.5 neo-btn neo-btn-secondary text-xs text-center"
            >
              Tiếp Tục Mua Sắm
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-black text-white p-6 border-3 border-black shadow-[6px_6px_0px_#00ff66]">
        <span className="font-mono text-xs text-[#00ff66] uppercase tracking-widest block mb-1">
          SECURE CHECKOUT // 256-BIT ENCRYPTION
        </span>
        <h1 className="font-display font-black text-2xl sm:text-4xl uppercase tracking-tight">
          TIẾN HÀNH ĐẶT HÀNG & THANH TOÁN
        </h1>
      </div>

      <form onSubmit={handlePlaceOrder}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Shipping & Payment (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Step 1: Shipping Info */}
            <div className="bg-white border-2 border-black p-6 shadow-[6px_6px_0px_#000] space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b-2 border-black">
                <div className="w-6 h-6 bg-black text-white font-display font-black text-xs flex items-center justify-center">
                  1
                </div>
                <h3 className="font-display font-black text-base uppercase">
                  THÔNG TIN GIAO HÀNG
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-display font-bold uppercase mb-1">
                    Họ và tên người nhận *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Nguyễn Văn A"
                    className="neo-input text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-display font-bold uppercase mb-1">
                    Số điện thoại liên hệ *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0901234567"
                    className="neo-input text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-display font-bold uppercase mb-1">
                  Địa chỉ nhận hàng chi tiết *
                </label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố"
                  className="neo-input text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-display font-bold uppercase mb-1">
                  Ghi chú đơn hàng (Tùy chọn)
                </label>
                <textarea
                  rows="2"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Ví dụ: Giao giờ hành chính, gọi trước khi đến..."
                  className="neo-input text-xs"
                />
              </div>
            </div>

            {/* Step 2: Payment Method Selector */}
            <div className="bg-white border-2 border-black p-6 shadow-[6px_6px_0px_#000] space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b-2 border-black">
                <div className="w-6 h-6 bg-black text-white font-display font-black text-xs flex items-center justify-center">
                  2
                </div>
                <h3 className="font-display font-black text-base uppercase">
                  CHỌN PHƯƠNG THỨC THANH TOÁN
                </h3>
              </div>

              <div className="space-y-3">
                {/* 1. COD */}
                <label 
                  className={`p-4 border-2 border-black flex items-start gap-3 cursor-pointer transition-all ${
                    paymentMethod === 'COD' ? 'bg-neutral-50 shadow-[3px_3px_0px_#000] ring-2 ring-black' : 'hover:bg-neutral-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="COD"
                    checked={paymentMethod === 'COD'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mt-1 accent-black"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-display font-black text-sm uppercase">Thanh toán khi nhận hàng (COD)</span>
                      <Truck className="w-5 h-5 text-black" />
                    </div>
                    <p className="text-xs text-neutral-500 mt-0.5">Thanh toán tiền mặt cho shipper khi nhận và kiểm tra hàng.</p>
                  </div>
                </label>

                {/* 2. Wallet */}
                <label 
                  className={`p-4 border-2 border-black flex items-start gap-3 cursor-pointer transition-all ${
                    paymentMethod === 'Wallet' ? 'bg-neutral-50 shadow-[3px_3px_0px_#000] ring-2 ring-black' : 'hover:bg-neutral-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="Wallet"
                    checked={paymentMethod === 'Wallet'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mt-1 accent-black"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-display font-black text-sm uppercase">Ví Điện Tử Fashion Wallet</span>
                      <Wallet className="w-5 h-5 text-purple-600" />
                    </div>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      Số dư khả dụng: <span className="font-mono font-bold text-black">{formatCurrency(walletBalance)}</span>
                    </p>
                    {walletBalance < finalTotal && (
                      <span className="text-[11px] text-red-600 font-bold block mt-1">
                        ⚠️ Số dư không đủ (Cần thêm {formatCurrency(finalTotal - walletBalance)})
                      </span>
                    )}
                  </div>
                </label>

                {/* 3. VNPay */}
                <label 
                  className={`p-4 border-2 border-black flex items-start gap-3 cursor-pointer transition-all ${
                    paymentMethod === 'VNPay' ? 'bg-neutral-50 shadow-[3px_3px_0px_#000] ring-2 ring-black' : 'hover:bg-neutral-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="VNPay"
                    checked={paymentMethod === 'VNPay'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mt-1 accent-black"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-display font-black text-sm uppercase">Cổng Thanh Toán VNPay QR</span>
                      <QrCode className="w-5 h-5 text-blue-600" />
                    </div>
                    <p className="text-xs text-neutral-500 mt-0.5">Quét mã QR qua ứng dụng ngân hàng / VNPAY để thanh toán ngay lập tức.</p>
                  </div>
                </label>
              </div>
            </div>

          </div>

          {/* Right: Order Review & Submit (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white border-2 border-black p-6 shadow-[6px_6px_0px_#000] space-y-6 sticky top-28">
              <h3 className="font-display font-black text-lg uppercase pb-3 border-b-2 border-black">
                ĐƠN HÀNG ({totalItems} SẢN PHẨM)
              </h3>

              {/* Items Preview */}
              <div className="divide-y divide-neutral-200 max-h-60 overflow-y-auto space-y-3 pr-2">
                {items.map((item) => (
                  <div key={item.variantId} className="flex gap-3 items-center pt-3 first:pt-0">
                    <img src={item.image} alt={item.name} className="w-12 h-16 object-cover border border-black" />
                    <div className="flex-1 text-xs leading-tight">
                      <h4 className="font-display font-bold line-clamp-1">{item.name}</h4>
                      <span className="text-[10px] font-mono text-neutral-500">
                        {item.sizeName} - {item.colorName} x {item.quantity}
                      </span>
                    </div>
                    <span className="font-display font-bold text-xs">
                      {formatCurrency(item.unitPrice * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Calculations */}
              <div className="space-y-2 pt-4 border-t-2 border-black text-xs">
                <div className="flex justify-between text-neutral-600">
                  <span>Tạm tính:</span>
                  <span className="font-mono font-bold text-black">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-neutral-600">
                  <span>Phí vận chuyển:</span>
                  <span className="font-mono font-bold text-emerald-600">
                    {shippingFee === 0 ? 'MIỄN PHÍ' : formatCurrency(shippingFee)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-lg font-display font-black pt-3 border-t border-neutral-300">
                  <span>TỔNG THANH TOÁN:</span>
                  <span className="text-[#ff4d00]">{formatCurrency(finalTotal)}</span>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={loading || (paymentMethod === 'Wallet' && walletBalance < finalTotal)}
                className="w-full py-4 neo-btn neo-btn-neon text-xs tracking-wider flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? 'Đang Xử Lý...' : `Xác Nhận Đặt Hàng (${formatCurrency(finalTotal)})`} <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center">
                <Link to="/cart" className="text-xs font-display font-bold uppercase text-neutral-500 hover:text-black">
                  ← Chỉnh Sửa Giỏ Hàng
                </Link>
              </div>
            </div>
          </div>

        </div>
      </form>

      {/* VNPay Simulator Modal */}
      {showVNPayModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-white border-3 border-black p-8 max-w-md w-full shadow-[10px_10px_0px_#00ff66] text-center space-y-6">
            <div className="flex items-center justify-between pb-3 border-b-2 border-black">
              <span className="font-display font-black text-lg text-blue-600">VNPay Gateway Sandbox</span>
              <span className="text-xs font-mono font-bold bg-neutral-100 px-2 py-1 border border-black">05:00</span>
            </div>

            <div className="p-4 bg-neutral-50 border-2 border-black inline-block shadow-[4px_4px_0px_#000]">
              {/* Simulated QR Image */}
              <img
                src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=VNPAY_SIMULATOR_ORDER_FASHION"
                alt="VNPay QR"
                className="w-48 h-48 mx-auto"
              />
              <span className="text-[10px] font-mono text-neutral-500 mt-2 block font-bold">
                MÃ ĐƠN: ORD-FMS-{Date.now().toString().slice(-4)}
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-xs text-neutral-500 font-medium">Số tiền thanh toán:</span>
              <div className="font-display font-black text-2xl text-[#ff4d00]">
                {formatCurrency(finalTotal)}
              </div>
              <p className="text-xs text-neutral-600">
                Mở ứng dụng Mobile Banking của bạn để quét mã QR và xác nhận thanh toán.
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <button
                onClick={handleVNPayPaymentSuccess}
                className="w-full py-3 neo-btn neo-btn-neon text-xs tracking-wider"
              >
                Giả Lập Thanh Toán Thành Công (Demo)
              </button>
              <button
                onClick={() => setShowVNPayModal(false)}
                className="w-full py-2.5 neo-btn neo-btn-secondary text-xs"
              >
                Hủy Giao Dịch
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

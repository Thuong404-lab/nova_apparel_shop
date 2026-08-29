import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ArrowRight, ShoppingBag, Truck, Tag, ShieldCheck } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { formatCurrency } from '../../utils/formatters';

export const CartPage = () => {
  const { items, updateQuantity, removeItem, clearCart, subtotal, totalItems } = useCart();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [couponCode, setCouponCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  const FREE_SHIPPING_THRESHOLD = 500000;
  const shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : 30000;
  const finalTotal = Math.max(0, subtotal + shippingFee - discountAmount);

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    const code = couponCode.trim().toUpperCase();
    if (code === 'NOVA2026' || code === 'STREETWEAR10') {
      const discount = subtotal * 0.1;
      setDiscountAmount(discount);
      setAppliedCoupon(code);
      addToast('Áp dụng mã giảm giá 10% thành công!', 'success');
      setCouponCode('');
    } else {
      addToast('Mã giảm giá không hợp lệ hoặc đã hết hạn!', 'error');
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="bg-white border-3 border-black p-12 text-center shadow-[8px_8px_0px_#000] max-w-lg mx-auto space-y-6">
          <div className="w-20 h-20 bg-neutral-100 border-2 border-black flex items-center justify-center mx-auto shadow-[4px_4px_0px_#000]">
            <ShoppingBag className="w-10 h-10 text-neutral-400" />
          </div>
          <h2 className="font-display font-black text-2xl uppercase tracking-tight">Giỏ Hàng Của Bạn Trống</h2>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto leading-relaxed">
            Chưa có sản phẩm nào trong giỏ hàng. Hãy khám phá ngay các bộ sưu tập thời trang đường phố độc đáo tại NOVA Apparel!
          </p>
          <Link to="/catalog" className="inline-flex neo-btn neo-btn-neon text-xs">
            Khám Phá Sản Phẩm Ngay <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-black text-white p-6 border-3 border-black shadow-[6px_6px_0px_#00ff66] flex items-center justify-between">
        <div>
          <span className="font-mono text-xs text-[#00ff66] uppercase tracking-widest block mb-1">
            SHOPPING CART // CHECKOUT READY
          </span>
          <h1 className="font-display font-black text-2xl sm:text-4xl uppercase tracking-tight">
            GIỎ HÀNG CỦA BẠN ({totalItems} MÓN)
          </h1>
        </div>
        <button
          onClick={clearCart}
          className="text-xs font-mono font-bold text-neutral-400 hover:text-red-400 flex items-center gap-1.5"
        >
          <Trash2 className="w-4 h-4" /> Xóa Tất Cả
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Items Table (8 Cols) */}
        <div className="lg:col-span-8 bg-white border-2 border-black p-6 shadow-[6px_6px_0px_#000] space-y-6">
          <div className="divide-y-2 divide-black">
            {items.map((item) => (
              <div key={item.variantId} className="py-6 first:pt-0 last:pb-0 flex flex-col sm:flex-row gap-6 items-center">
                {/* Image */}
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-24 h-32 object-cover border-2 border-black shadow-[3px_3px_0px_#000] bg-white flex-shrink-0"
                />

                {/* Info */}
                <div className="flex-1 space-y-2 text-center sm:text-left">
                  <h3 className="font-display font-bold text-base hover:text-[#ff4d00] transition-colors">
                    {item.name}
                  </h3>
                  <div className="text-xs font-mono text-neutral-600">
                    Kích thước: <span className="font-bold text-black">{item.sizeName}</span> | Màu sắc: <span className="font-bold text-black">{item.colorName}</span>
                  </div>
                  <div className="font-display font-black text-sm text-black">
                    {formatCurrency(item.unitPrice)}
                  </div>
                </div>

                {/* Quantity & Actions */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-4">
                  <div className="flex items-center border-2 border-black bg-white shadow-[2px_2px_0px_#000]">
                    <button
                      onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                      className="w-8 h-8 flex items-center justify-center font-bold hover:bg-neutral-100 border-r-2 border-black"
                    >
                      -
                    </button>
                    <span className="w-10 text-center font-display font-bold text-xs">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center font-bold hover:bg-neutral-100 border-l-2 border-black"
                    >
                      +
                    </button>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="font-display font-black text-base text-black">
                      {formatCurrency(item.unitPrice * item.quantity)}
                    </span>
                    <button
                      onClick={() => removeItem(item.variantId)}
                      className="p-1 text-neutral-400 hover:text-red-600 transition-colors"
                      title="Xóa"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t-2 border-black flex justify-between items-center">
            <Link to="/catalog" className="text-xs font-display font-bold uppercase hover:text-[#ff4d00] flex items-center gap-1">
              ← Tiếp Tục Mua Sắm
            </Link>
          </div>
        </div>

        {/* Right: Order Summary Box (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white border-2 border-black p-6 shadow-[6px_6px_0px_#000] space-y-6 sticky top-28">
            <h3 className="font-display font-black text-lg uppercase pb-3 border-b-2 border-black">
              TÓM TẮT ĐƠN HÀNG
            </h3>

            {/* Coupon Box */}
            <form onSubmit={handleApplyCoupon} className="space-y-2">
              <label className="block text-xs font-display font-bold uppercase">
                Mã Giảm Giá:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Nhập FASHION2026..."
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="w-full neo-input text-xs uppercase"
                />
                <button type="submit" className="neo-btn neo-btn-secondary text-xs px-4">
                  Áp Dụng
                </button>
              </div>
              {appliedCoupon && (
                <div className="flex items-center justify-between text-xs text-emerald-600 font-mono font-bold bg-emerald-50 p-2 border border-emerald-300">
                  <span>Mã {appliedCoupon} (-50.000₫)</span>
                  <button onClick={() => { setAppliedCoupon(null); setDiscountAmount(0); }} className="text-red-500 hover:underline">Xóa</button>
                </div>
              )}
            </form>

            {/* Price Calculations */}
            <div className="space-y-3 pt-3 border-t border-neutral-200 text-xs">
              <div className="flex justify-between text-neutral-600">
                <span>Tạm tính hàng hóa:</span>
                <span className="font-mono font-bold text-black">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>Phí giao hàng:</span>
                <span className="font-mono font-bold text-emerald-600">
                  {shippingFee === 0 ? 'MIỄN PHÍ' : formatCurrency(shippingFee)}
                </span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Giảm giá voucher:</span>
                  <span className="font-mono">-{formatCurrency(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between items-center text-lg font-display font-black pt-4 border-t-2 border-black">
                <span>TỔNG CỘNG:</span>
                <span className="text-[#ff4d00]">{formatCurrency(finalTotal)}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              onClick={() => navigate('/checkout')}
              className="w-full py-4 neo-btn neo-btn-neon text-xs tracking-wider flex items-center justify-center gap-2"
            >
              Tiến Hành Đặt Hàng <ArrowRight className="w-4 h-4" />
            </button>

            <div className="p-3 bg-neutral-50 border border-black text-[11px] text-neutral-600 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-black">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Bảo mật thanh toán đa phương thức</span>
              </div>
              <p>Hỗ trợ thanh toán khi nhận hàng (COD), Ví điện tử Fashion Wallet và VNPay QR code.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

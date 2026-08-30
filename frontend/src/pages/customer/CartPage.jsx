import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ShoppingBag, 
  Trash2, 
  ArrowRight, 
  Plus, 
  Minus, 
  Truck, 
  ShieldCheck, 
  Tag, 
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { formatCurrency } from '../../utils/formatters';

const FREE_SHIPPING_THRESHOLD = 500000;

export const CartPage = () => {
  const { items, updateQuantity, removeItem, clearCart, subtotal, totalItems } = useCart();
  const navigate = useNavigate();
  const [couponCode, setCouponCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [couponError, setCouponError] = useState('');

  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const freeShippingProgress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  const shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD || items.length === 0 ? 0 : 30000;
  const discountAmount = Math.round(subtotal * (discountPercent / 100));
  const finalTotal = subtotal - discountAmount + shippingFee;

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (couponCode.toUpperCase() === 'NOVA15') {
      setDiscountPercent(15);
      setCouponError('');
    } else if (couponCode.toUpperCase() === 'VIP20') {
      setDiscountPercent(20);
      setCouponError('');
    } else {
      setCouponError('Mã giảm giá không hợp lệ hoặc đã hết hạn.');
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center space-y-6">
        <div className="w-20 h-20 bg-zinc-100 rounded-full flex items-center justify-center mx-auto text-zinc-400">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="font-display font-black text-3xl text-zinc-950">Giỏ Hàng Của Bạn Đang Trống</h2>
        <p className="text-sm text-zinc-500 max-w-md mx-auto">
          Chưa có món đồ nào trong giỏ. Hãy dạo quanh bộ sưu tập mới nhất để tìm cho mình item ưng ý nhé!
        </p>
        <div className="pt-2">
          <Link to="/catalog" className="luxury-btn-accent inline-flex">
            <span>Khám Phá Sản Phẩm Ngay</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-zinc-200 pb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 font-mono">
            SHOPPING BAG
          </span>
          <h1 className="font-display font-black text-3xl sm:text-4xl text-zinc-950 mt-1">
            Giỏ Hàng ({totalItems} món đồ)
          </h1>
        </div>
        <button
          onClick={clearCart}
          className="text-xs text-zinc-500 hover:text-rose-600 font-medium flex items-center gap-1 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Xóa tất cả</span>
        </button>
      </div>

      {/* Free Shipping Banner */}
      <div className="p-4 bg-white rounded-2xl border border-zinc-200 shadow-sm space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="flex items-center gap-2 font-medium text-zinc-800">
            <Truck className="w-4 h-4 text-emerald-600" />
            {remainingForFreeShipping === 0 
              ? 'Đơn hàng của bạn đã đạt điều kiện FREESHIP toàn quốc!' 
              : `Mua thêm ${formatCurrency(remainingForFreeShipping)} để được Miễn Phí Vận Chuyển`}
          </span>
          <span className="font-mono font-bold text-zinc-600">{Math.round(freeShippingProgress)}%</span>
        </div>
        <div className="w-full h-2 bg-zinc-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-emerald-500 transition-all duration-500 rounded-full"
            style={{ width: `${freeShippingProgress}%` }}
          />
        </div>
      </div>

      {/* 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Left: Items List (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {items.map((item) => (
            <motion.div
              key={item.variantId}
              layout
              className="bg-white rounded-3xl border border-zinc-200/80 p-5 flex flex-col sm:flex-row gap-5 shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Product Image */}
              <img
                src={item.image}
                alt={item.name}
                className="w-24 h-32 object-cover rounded-2xl bg-zinc-100 flex-shrink-0"
              />

              {/* Details */}
              <div className="flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex justify-between items-start gap-4">
                    <h3 className="font-display font-bold text-base text-zinc-950 leading-tight">
                      {item.name}
                    </h3>
                    <button
                      onClick={() => removeItem(item.variantId)}
                      className="text-zinc-400 hover:text-rose-500 transition-colors p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-xs text-zinc-500 mt-1">
                    Phân loại: <strong className="text-zinc-800">{item.sizeName}</strong> • <strong className="text-zinc-800">{item.colorName}</strong>
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-zinc-100">
                  <div>
                    <span className="text-[11px] text-zinc-400 block font-mono">Đơn giá</span>
                    <span className="font-display font-bold text-base text-zinc-950">
                      {formatCurrency(item.unitPrice)}
                    </span>
                  </div>

                  {/* Quantity Counter */}
                  <div className="flex items-center border border-zinc-200 rounded-2xl bg-zinc-50 p-1">
                    <button
                      onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                      className="w-8 h-8 rounded-xl hover:bg-white flex items-center justify-center text-zinc-600 text-xs transition-colors"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-9 text-center font-mono font-bold text-sm">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                      className="w-8 h-8 rounded-xl hover:bg-white flex items-center justify-center text-zinc-600 text-xs transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="text-right">
                    <span className="text-[11px] text-zinc-400 block font-mono">Thành tiền</span>
                    <span className="font-display font-black text-base text-emerald-600">
                      {formatCurrency(item.unitPrice * item.quantity)}
                    </span>
                  </div>
                </div>

              </div>
            </motion.div>
          ))}
        </div>

        {/* Right: Summary Card (4 cols) */}
        <div className="lg:col-span-4 space-y-6 sticky top-28">
          
          {/* Coupon Box */}
          <div className="bg-white rounded-3xl border border-zinc-200 p-6 shadow-sm space-y-3">
            <h3 className="font-display font-bold text-xs uppercase tracking-wider text-zinc-900 flex items-center gap-2">
              <Tag className="w-4 h-4 text-emerald-600" />
              <span>Mã Giảm Giá / Voucher</span>
            </h3>
            <form onSubmit={handleApplyCoupon} className="flex gap-2">
              <input
                type="text"
                placeholder="Nhập mã (VD: NOVA15, VIP20)"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="flex-1 uppercase font-mono text-xs bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2.5 outline-none focus:border-zinc-950"
              />
              <button type="submit" className="luxury-btn-primary text-xs px-4 py-2.5 rounded-xl">
                Áp Dụng
              </button>
            </form>
            {discountPercent > 0 && (
              <p className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Đã áp dụng mã giảm {discountPercent}%!
              </p>
            )}
            {couponError && <p className="text-xs text-rose-500">{couponError}</p>}
          </div>

          {/* Order Total Card */}
          <div className="bg-white rounded-3xl border border-zinc-200 p-6 shadow-sm space-y-6">
            <h3 className="font-display font-bold text-base text-zinc-950">Tóm Tắt Đơn Hàng</h3>

            <div className="space-y-3 text-xs text-zinc-600">
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
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Giảm giá voucher:</span>
                  <span className="font-mono">-{formatCurrency(discountAmount)}</span>
                </div>
              )}
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
              onClick={() => navigate('/checkout')}
              className="w-full luxury-btn-accent text-sm py-4 justify-center shadow-lg shadow-emerald-500/20"
            >
              <span>Tiến Hành Đặt Hàng</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </div>

        </div>

      </div>

    </div>
  );
};

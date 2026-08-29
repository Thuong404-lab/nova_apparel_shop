import React from 'react';
import { X, ShoppingBag, Trash2, ArrowRight, ShieldCheck, Truck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { formatCurrency } from '../../utils/formatters';

export const CartDrawer = () => {
  const { items, isCartOpen, setIsCartOpen, updateQuantity, removeItem, subtotal, totalItems } = useCart();
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  const FREE_SHIPPING_THRESHOLD = 500000;
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const progressPercent = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  const handleCheckout = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l-4 border-black shadow-[-10px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between">
          
          {/* 1. Header */}
          <div className="p-5 border-b-2 border-black flex items-center justify-between bg-neutral-50">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-black" />
              <h2 className="font-display font-black text-lg uppercase tracking-tight">
                Giỏ Hàng Của Bạn ({totalItems})
              </h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 border-2 border-black bg-white hover:bg-black hover:text-white transition-all shadow-[2px_2px_0px_#000]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* 2. Free Shipping Bar */}
          <div className="px-5 py-3 bg-neutral-900 text-white border-b-2 border-black">
            <div className="flex items-center justify-between text-xs mb-1.5 font-display font-bold">
              <span className="flex items-center gap-1.5 text-[#00ff66]">
                <Truck className="w-4 h-4" />
                {remainingForFreeShipping > 0 
                  ? `Mua thêm ${formatCurrency(remainingForFreeShipping)} để FREESHIP` 
                  : '🎉 BẠN ĐÃ ĐƯỢC MIỄN PHÍ VẬN CHUYỂN!'}
              </span>
              <span className="font-mono text-[10px] text-neutral-400">{Math.round(progressPercent)}%</span>
            </div>
            <div className="w-full bg-neutral-800 h-2 border border-neutral-700 overflow-hidden">
              <div
                className="bg-[#00ff66] h-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* 3. Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 bg-neutral-100 border-2 border-black flex items-center justify-center mx-auto shadow-[4px_4px_0px_#000]">
                  <ShoppingBag className="w-8 h-8 text-neutral-400" />
                </div>
                <h3 className="font-display font-bold text-base uppercase">Giỏ hàng đang trống</h3>
                <p className="text-xs text-neutral-500 max-w-xs mx-auto">
                  Khám phá các sản phẩm streetwear mới nhất và thêm vào giỏ hàng ngay hôm nay!
                </p>
                <Link
                  to="/catalog"
                  onClick={() => setIsCartOpen(false)}
                  className="inline-flex neo-btn neo-btn-neon text-xs"
                >
                  Mua Sắm Ngay
                </Link>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.variantId}
                  className="flex gap-4 p-3 bg-neutral-50 border-2 border-black shadow-[3px_3px_0px_#000] relative"
                >
                  {/* Image */}
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-24 object-cover border border-black flex-shrink-0 bg-white"
                  />

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="font-display font-bold text-xs leading-snug line-clamp-2">
                          {item.name}
                        </h4>
                        <button
                          onClick={() => removeItem(item.variantId)}
                          className="text-neutral-400 hover:text-red-600 transition-colors p-1"
                          title="Xóa món này"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="text-[11px] font-mono text-neutral-500 mt-1">
                        Size: <span className="font-bold text-black">{item.sizeName}</span> | Màu: <span className="font-bold text-black">{item.colorName}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-neutral-200">
                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-black bg-white">
                        <button
                          onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                          className="w-6 h-6 flex items-center justify-center font-bold text-xs hover:bg-neutral-100 border-r border-black"
                        >
                          -
                        </button>
                        <span className="w-8 text-center text-xs font-mono font-bold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                          className="w-6 h-6 flex items-center justify-center font-bold text-xs hover:bg-neutral-100 border-l border-black"
                        >
                          +
                        </button>
                      </div>

                      {/* Price */}
                      <span className="font-display font-black text-xs text-black">
                        {formatCurrency(item.unitPrice * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* 4. Footer & Checkout */}
          {items.length > 0 && (
            <div className="p-5 border-t-2 border-black bg-neutral-50 space-y-4">
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-neutral-600">
                  <span>Tạm tính ({totalItems} sản phẩm):</span>
                  <span className="font-mono font-bold text-black">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-xs text-neutral-600">
                  <span>Phí vận chuyển:</span>
                  <span className="font-mono font-bold text-emerald-600">
                    {subtotal >= FREE_SHIPPING_THRESHOLD ? 'MIỄN PHÍ' : '30.000 ₫'}
                  </span>
                </div>
                <div className="flex justify-between text-base font-display font-black pt-2 border-t border-neutral-300">
                  <span>Tổng tiền thanh toán:</span>
                  <span className="text-[#ff4d00]">
                    {formatCurrency(subtotal + (subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 30000))}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <button
                  onClick={handleCheckout}
                  className="w-full py-3.5 neo-btn neo-btn-neon text-xs tracking-wider flex items-center justify-center gap-2"
                >
                  Tiến Hành Thanh Toán <ArrowRight className="w-4 h-4" />
                </button>
                <Link
                  to="/cart"
                  onClick={() => setIsCartOpen(false)}
                  className="w-full py-2.5 neo-btn neo-btn-secondary text-xs text-center block"
                >
                  Xem Chi Tiết Giỏ Hàng
                </Link>
              </div>

              <div className="flex items-center justify-center gap-2 text-[10px] text-neutral-500 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-black" />
                <span>Thanh toán an toàn 100% với bảo mật SSL & VNPay</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

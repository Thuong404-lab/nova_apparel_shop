import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Trash2, ArrowRight, Plus, Minus, Truck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { formatCurrency } from '../../utils/formatters';

const FREE_SHIPPING_THRESHOLD = 500000;

export const CartDrawer = () => {
  const { items, isCartOpen, setIsCartOpen, updateQuantity, removeItem, subtotal, totalItems } = useCart();
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const freeShippingProgress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  const handleCheckout = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsCartOpen(false)}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Drawer */}
        <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between"
          >
            {/* Header */}
            <div className="p-6 border-b border-zinc-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-emerald-600" />
                <h2 className="font-display font-black text-lg text-zinc-950">
                  Giỏ Hàng Của Bạn <span className="text-xs font-mono font-normal text-zinc-500">({totalItems})</span>
                </h2>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-2 rounded-full hover:bg-zinc-100 text-zinc-500 hover:text-black transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Free Shipping Progress Bar */}
            <div className="px-6 py-4 bg-zinc-50 border-b border-zinc-100 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 font-medium text-zinc-700">
                  <Truck className="w-4 h-4 text-emerald-600" />
                  {remainingForFreeShipping === 0 
                    ? 'Bạn được FREESHIP toàn quốc!' 
                    : `Mua thêm ${formatCurrency(remainingForFreeShipping)} để FREESHIP`}
                </span>
                <span className="font-mono text-zinc-500">{Math.round(freeShippingProgress)}%</span>
              </div>
              <div className="w-full h-1.5 bg-zinc-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 transition-all duration-500 rounded-full"
                  style={{ width: `${freeShippingProgress}%` }}
                />
              </div>
            </div>

            {/* Items List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12">
                  <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center text-zinc-400">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <h3 className="font-display font-bold text-lg text-zinc-900">Giỏ Hàng Đang Trống</h3>
                  <p className="text-xs text-zinc-500 max-w-xs">
                    Hãy khám phá các thiết kế thời trang mới nhất và thêm sản phẩm vào giỏ.
                  </p>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="luxury-btn-primary text-xs"
                  >
                    <span>Tiếp Tục Mua Sắm</span>
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <div 
                    key={item.variantId} 
                    className="flex gap-4 p-3.5 rounded-2xl border border-zinc-100 hover:border-zinc-200 bg-zinc-50/50 transition-colors"
                  >
                    {/* Item Image */}
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-24 object-cover rounded-xl bg-zinc-200 flex-shrink-0"
                    />

                    {/* Details */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="text-xs font-bold text-zinc-900 line-clamp-2 leading-tight">
                            {item.name}
                          </h4>
                          <button
                            onClick={() => removeItem(item.variantId)}
                            className="text-zinc-400 hover:text-rose-500 transition-colors p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-[11px] text-zinc-500 mt-1">
                          Phân loại: {item.sizeName} • {item.colorName}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <span className="font-display font-bold text-sm text-zinc-950">
                          {formatCurrency(item.unitPrice)}
                        </span>

                        {/* Quantity Counter */}
                        <div className="flex items-center border border-zinc-200 rounded-xl bg-white p-0.5">
                          <button
                            onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                            className="w-6 h-6 rounded-lg hover:bg-zinc-100 flex items-center justify-center text-zinc-600 text-xs"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-7 text-center font-mono font-bold text-xs">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                            className="w-6 h-6 rounded-lg hover:bg-zinc-100 flex items-center justify-center text-zinc-600 text-xs"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer Summary & Checkout */}
            {items.length > 0 && (
              <div className="p-6 border-t border-zinc-100 space-y-4 bg-white">
                <div className="flex justify-between items-baseline">
                  <span className="text-xs text-zinc-500 font-medium">Tạm tính (chưa gồm phí ship):</span>
                  <span className="font-display font-black text-xl text-zinc-950">
                    {formatCurrency(subtotal)}
                  </span>
                </div>

                <div className="space-y-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCheckout}
                    className="w-full luxury-btn-accent text-sm py-4 justify-center"
                  >
                    <span>Tiến Hành Thanh Toán</span>
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>

                  <Link
                    to="/cart"
                    onClick={() => setIsCartOpen(false)}
                    className="block text-center text-xs font-semibold text-zinc-600 hover:text-black py-1.5"
                  >
                    Xem toàn bộ giỏ hàng & áp mã giảm giá →
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};

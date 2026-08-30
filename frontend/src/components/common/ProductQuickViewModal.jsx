import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Heart, Star, Check, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { formatCurrency } from '../../utils/formatters';
import confetti from 'canvas-confetti';

export const ProductQuickViewModal = ({ product, isOpen, onClose }) => {
  const { addItem } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [selectedColor, setSelectedColor] = useState(product?.variants?.[0]?.colorName);
  const [selectedSize, setSelectedSize] = useState(product?.variants?.[0]?.sizeName);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  if (!isOpen || !product) return null;

  const currentVariant = product.variants?.find(
    v => v.colorName === selectedColor && v.sizeName === selectedSize
  ) || product.variants?.[0];

  const currentPrice = currentVariant?.priceOverride || product.basePrice;
  const isFavorited = isInWishlist(product.productId);

  const handleAddToCart = (e) => {
    addItem(product, currentVariant, quantity);
    
    // Confetti
    const rect = e.currentTarget.getBoundingClientRect();
    confetti({
      particleCount: 30,
      spread: 60,
      origin: {
        x: (rect.left + rect.width / 2) / window.innerWidth,
        y: (rect.top + rect.height / 2) / window.innerHeight
      },
      colors: ['#00ff66', '#09090b', '#ffffff']
    });

    onClose();
  };

  const availableColors = Array.from(new Set(product.variants?.map(v => v.colorName) || []));
  const availableSizes = Array.from(new Set(product.variants?.map(v => v.sizeName) || []));

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-3xl bg-white rounded-3xl overflow-hidden shadow-2xl z-10 grid md:grid-cols-2"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2.5 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-600 transition-colors z-20 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Left: Product Image */}
          <div className="relative aspect-[3/4] bg-zinc-100 overflow-hidden">
            <img
              src={product.images?.[selectedImage]?.imageUrl || product.images?.[0]?.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {product.tag && (
              <span className="absolute top-4 left-4 px-3 py-1 bg-zinc-950 text-white text-[11px] font-bold uppercase rounded-full">
                {product.tag}
              </span>
            )}
          </div>

          {/* Right: Info & Controls */}
          <div className="p-6 md:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-600 font-mono">
                {product.categoryName}
              </span>
              <h2 className="font-display font-black text-xl text-zinc-950 leading-snug">
                {product.name}
              </h2>

              <div className="flex items-center gap-2 text-xs">
                <div className="flex text-amber-500">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                </div>
                <span className="font-bold text-zinc-800">{product.rating || 4.9}</span>
                <span className="text-zinc-400">({product.reviewCount || 48} đánh giá)</span>
              </div>

              <div className="font-display font-black text-2xl text-zinc-950">
                {formatCurrency(currentPrice)}
              </div>

              {/* Color.java Options */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-zinc-900 block">Màu sắc:</span>
                <div className="flex flex-wrap gap-2">
                  {availableColors.map((col) => {
                    const isSelected = selectedColor === col;
                    return (
                      <button
                        key={col}
                        onClick={() => setSelectedColor(col)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                          isSelected ? 'bg-zinc-950 text-white border-zinc-950' : 'border-zinc-200 text-zinc-700 hover:border-zinc-400'
                        }`}
                      >
                        {col}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Size Options */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-zinc-900 block">Kích thước (Size):</span>
                <div className="flex flex-wrap gap-2">
                  {availableSizes.map((sz) => {
                    const isSelected = selectedSize === sz;
                    return (
                      <button
                        key={sz}
                        onClick={() => setSelectedSize(sz)}
                        className={`w-10 h-10 rounded-xl text-xs font-bold border transition-all flex items-center justify-center cursor-pointer ${
                          isSelected ? 'bg-zinc-950 text-white border-zinc-950' : 'border-zinc-200 text-zinc-800 hover:border-zinc-400'
                        }`}
                      >
                        {sz}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3 pt-4 border-t border-zinc-100">
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddToCart}
                  className="flex-1 luxury-btn-accent text-xs py-3.5 justify-center"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Thêm Vào Giỏ Hàng</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => toggleWishlist(product)}
                  className={`p-3.5 rounded-2xl border transition-colors ${
                    isFavorited ? 'border-rose-500 bg-rose-50 text-rose-500' : 'border-zinc-200 text-zinc-700 hover:border-zinc-400'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isFavorited ? 'fill-rose-500' : ''}`} />
                </motion.button>
              </div>

              <Link
                to={`/product/${product.productId}`}
                onClick={onClose}
                className="block text-center text-xs font-semibold text-zinc-600 hover:text-black py-1"
              >
                Xem chi tiết đầy đủ sản phẩm →
              </Link>
            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

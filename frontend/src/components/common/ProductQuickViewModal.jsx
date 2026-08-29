import React, { useState, useEffect } from 'react';
import { X, Star, ShoppingBag, Heart, Check, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatCurrency } from '../../utils/formatters';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

export const ProductQuickViewModal = ({ product, isOpen, onClose }) => {
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const { addItem } = useCart();
  const { toggleWishlist, isFavorite } = useWishlist();

  useEffect(() => {
    if (product && product.variants?.length > 0) {
      setSelectedVariant(product.variants[0]);
      setQuantity(1);
      setActiveImageIndex(0);
    }
  }, [product]);

  if (!isOpen || !product) return null;

  const currentPrice = selectedVariant?.priceOverride || product.basePrice;
  const availableStock = selectedVariant ? selectedVariant.stockQty - (selectedVariant.reservedQty || 0) : 0;

  const handleAddToCart = () => {
    if (selectedVariant && availableStock > 0) {
      addItem(product, selectedVariant, quantity);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-3xl bg-white border-3 border-black shadow-[10px_10px_0px_#000000] max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 bg-white border-2 border-black hover:bg-black hover:text-white transition-all shadow-[2px_2px_0px_#000]"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left: Gallery */}
          <div className="p-6 bg-neutral-100 border-b-2 md:border-b-0 md:border-r-2 border-black flex flex-col justify-between">
            <div className="aspect-[4/5] bg-white border-2 border-black overflow-hidden mb-4 shadow-[3px_3px_0px_#000]">
              <img
                src={product.images?.[activeImageIndex] || product.images?.[0]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-16 h-16 border-2 border-black overflow-hidden flex-shrink-0 transition-all ${
                      activeImageIndex === idx ? 'ring-2 ring-black scale-105' : 'opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="thumb" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Info & Variant Selector */}
          <div className="p-6 md:p-8 flex flex-col justify-between">
            <div>
              {/* Category & Badge */}
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-xs uppercase tracking-widest text-neutral-500 font-bold">
                  {product.categoryName || 'Streetwear'}
                </span>
                {product.tag && (
                  <span className="neo-badge bg-[#00ff66] text-black text-[10px]">
                    {product.tag}
                  </span>
                )}
              </div>

              {/* Title */}
              <h2 className="font-display font-black text-xl md:text-2xl leading-tight mb-2">
                {product.name}
              </h2>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <span className="text-xs font-bold text-neutral-600">
                  {product.rating} ({product.reviewCount} đánh giá)
                </span>
              </div>

              {/* Price */}
              <div className="p-3 bg-neutral-100 border-2 border-black mb-5 shadow-[2px_2px_0px_#000]">
                <span className="font-display font-black text-2xl text-black">
                  {formatCurrency(currentPrice)}
                </span>
              </div>

              {/* Description */}
              <p className="text-xs text-neutral-600 leading-relaxed mb-6 line-clamp-3">
                {product.description}
              </p>

              {/* Variants Selector */}
              {product.variants && product.variants.length > 0 && (
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-xs font-display font-bold uppercase tracking-wider mb-2">
                      Chọn Biến Thể (Size - Màu):
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {product.variants.map((v) => {
                        const isSelected = selectedVariant?.variantId === v.variantId;
                        const inStock = v.stockQty > 0;
                        return (
                          <button
                            key={v.variantId}
                            onClick={() => setSelectedVariant(v)}
                            disabled={!inStock}
                            className={`p-2.5 border-2 border-black text-left flex items-center justify-between text-xs transition-all ${
                              isSelected
                                ? 'bg-black text-white shadow-[2px_2px_0px_#00ff66]'
                                : inStock
                                ? 'bg-white hover:bg-neutral-50 shadow-[2px_2px_0px_#000]'
                                : 'bg-neutral-100 text-neutral-400 border-neutral-300 cursor-not-allowed'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <span
                                className="w-3.5 h-3.5 rounded-full border border-black inline-block"
                                style={{ backgroundColor: v.hexCode || '#000' }}
                              />
                              <span className="font-display font-bold">
                                {v.sizeName} - {v.colorName}
                              </span>
                            </div>
                            {isSelected && <Check className="w-3.5 h-3.5 text-[#00ff66]" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Stock Alert */}
                  <div className="text-xs font-mono">
                    Tình trạng kho: {' '}
                    {availableStock > 0 ? (
                      <span className="text-emerald-600 font-bold">Còn {availableStock} sản phẩm có sẵn</span>
                    ) : (
                      <span className="text-red-600 font-bold">Hết hàng</span>
                    )}
                  </div>
                </div>
              )}

              {/* Quantity Stepper */}
              <div className="flex items-center gap-3 mb-6">
                <span className="text-xs font-display font-bold uppercase">Số lượng:</span>
                <div className="flex items-center border-2 border-black bg-white shadow-[2px_2px_0px_#000]">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 flex items-center justify-center font-bold hover:bg-neutral-100 border-r-2 border-black"
                  >
                    -
                  </button>
                  <span className="w-10 text-center font-display font-bold text-sm">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(availableStock, quantity + 1))}
                    disabled={quantity >= availableStock}
                    className="w-8 h-8 flex items-center justify-center font-bold hover:bg-neutral-100 border-l-2 border-black disabled:opacity-50"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="space-y-2 pt-4 border-t-2 border-black">
              <div className="flex gap-2">
                <button
                  onClick={handleAddToCart}
                  disabled={availableStock <= 0}
                  className="flex-1 py-3.5 neo-btn neo-btn-neon text-xs disabled:opacity-50"
                >
                  <ShoppingBag className="w-4 h-4" /> Thêm Vào Giỏ Hàng
                </button>
                <button
                  onClick={() => toggleWishlist(product.productId, product.name)}
                  className={`p-3.5 border-2 border-black flex items-center justify-center shadow-[4px_4px_0px_#000] ${
                    isFavorite(product.productId) ? 'bg-red-500 text-white' : 'bg-white hover:bg-neutral-100'
                  }`}
                  title="Yêu thích"
                >
                  <Heart className={`w-4 h-4 ${isFavorite(product.productId) ? 'fill-current' : ''}`} />
                </button>
              </div>

              <Link
                to={`/product/${product.productId}`}
                onClick={onClose}
                className="w-full py-2.5 neo-btn neo-btn-secondary text-xs text-center flex items-center justify-center gap-1.5"
              >
                Xem Toàn Bộ Chi Tiết & Đánh Giá <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

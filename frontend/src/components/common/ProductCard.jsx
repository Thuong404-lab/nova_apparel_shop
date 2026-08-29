import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Eye, ShoppingBag, Star } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';

export const ProductCard = ({ product, onQuickView }) => {
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  
  const { toggleWishlist, isFavorite } = useWishlist();
  const { addItem } = useCart();

  const currentVariant = product.variants?.[selectedVariantIndex] || product.variants?.[0];
  const price = currentVariant?.priceOverride || product.basePrice;
  const primaryImage = product.images?.[0] || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800';
  const secondaryImage = product.images?.[1] || primaryImage;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (currentVariant) {
      addItem(product, currentVariant, 1);
    }
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.productId, product.name);
  };

  return (
    <div 
      className="group relative bg-white border-2 border-black shadow-[4px_4px_0px_#000000] hover:shadow-[7px_7px_0px_#000000] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all duration-200 flex flex-col h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Tag Badge */}
      {product.tag && (
        <div className="absolute top-3 left-3 z-10">
          <span className="neo-badge bg-[#00ff66] text-black">
            {product.tag}
          </span>
        </div>
      )}

      {/* Wishlist Button */}
      <button
        onClick={handleWishlist}
        className={`absolute top-3 right-3 z-10 w-9 h-9 border-2 border-black flex items-center justify-center transition-all ${
          isFavorite(product.productId)
            ? 'bg-red-500 text-white shadow-[2px_2px_0px_#000]'
            : 'bg-white text-black hover:bg-neutral-100 shadow-[2px_2px_0px_#000]'
        }`}
        title="Yêu thích"
      >
        <Heart className={`w-4 h-4 ${isFavorite(product.productId) ? 'fill-current' : ''}`} />
      </button>

      {/* Image Container */}
      <Link to={`/product/${product.productId}`} className="relative block overflow-hidden aspect-[4/5] bg-neutral-100 border-b-2 border-black">
        <img
          src={isHovered ? secondaryImage : primaryImage}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Quick View Button Overlay */}
        <div className="absolute inset-x-0 bottom-3 flex justify-center px-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onQuickView?.(product);
            }}
            className="w-full py-2.5 bg-white text-black border-2 border-black font-display font-black text-xs uppercase flex items-center justify-center gap-2 shadow-[3px_3px_0px_#000] hover:bg-black hover:text-white transition-all"
          >
            <Eye className="w-4 h-4" /> Xem Nhanh
          </button>
        </div>
      </Link>

      {/* Product Content Details */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-xs text-neutral-500 mb-1">
            <span className="font-mono uppercase tracking-wider text-[11px] font-semibold text-neutral-600">
              {product.categoryName || 'Streetwear'}
            </span>
            <div className="flex items-center gap-1 font-bold text-black">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{product.rating || 5.0}</span>
            </div>
          </div>

          {/* Product Title */}
          <Link to={`/product/${product.productId}`}>
            <h3 className="font-display font-bold text-sm leading-snug line-clamp-2 hover:text-[#ff4d00] transition-colors mb-2">
              {product.name}
            </h3>
          </Link>
        </div>

        <div>
          {/* Color Variations Preview */}
          {product.variants && product.variants.length > 0 && (
            <div className="flex items-center gap-1.5 mb-3">
              {product.variants.slice(0, 4).map((variant, idx) => (
                <button
                  key={variant.variantId || idx}
                  onClick={() => setSelectedVariantIndex(idx)}
                  className={`w-4 h-4 rounded-full border border-black transition-transform ${
                    selectedVariantIndex === idx ? 'scale-125 ring-2 ring-black ring-offset-1' : 'hover:scale-110'
                  }`}
                  style={{ backgroundColor: variant.hexCode || '#000000' }}
                  title={`${variant.sizeName} - ${variant.colorName}`}
                />
              ))}
              {product.variants.length > 4 && (
                <span className="text-[10px] font-mono text-neutral-500">+{product.variants.length - 4}</span>
              )}
            </div>
          )}

          {/* Price & Add to Cart Action */}
          <div className="flex items-center justify-between pt-2 border-t border-neutral-200">
            <div>
              <span className="font-display font-black text-base tracking-tight text-black block">
                {formatCurrency(price)}
              </span>
              <span className="text-[10px] font-mono text-emerald-600 font-bold block">
                {currentVariant?.stockQty > 0 ? `Còn ${currentVariant.stockQty} sp` : 'Hết hàng'}
              </span>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={!currentVariant || currentVariant.stockQty <= 0}
              className="p-2.5 bg-black text-white hover:bg-[#00ff66] hover:text-black border-2 border-black shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all disabled:opacity-50"
              title="Thêm vào giỏ"
            >
              <ShoppingBag className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

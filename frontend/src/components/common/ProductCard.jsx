import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Eye, Star } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import { formatCurrency } from '../../utils/formatters';

export const ProductCard = ({ product, onQuickView }) => {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();

  const isFavorited = isInWishlist(product.productId);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Pick first available variant
    const firstVariant = product.variants?.[0] || {
      variantId: `${product.productId}-DEFAULT`,
      productId: product.productId,
      sizeId: 'SZ002',
      colorId: 'COL001',
      stockQty: 10,
    };

    addToCart(product, firstVariant, 1);
  };

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const handleQuickViewClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onQuickView) {
      onQuickView(product);
    }
  };

  const primaryImage = product.images?.find(img => img.isPrimary)?.imageUrl || 
                       product.images?.[0]?.imageUrl || 
                       'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800';

  const secondaryImage = product.images?.[1]?.imageUrl || primaryImage;

  return (
    <div className="group relative flex flex-col bg-white rounded-2xl border border-zinc-200/80 overflow-hidden hover:border-zinc-300 hover:shadow-lg transition-all duration-300">
      
      {/* 1. Image Container */}
      <div className="relative aspect-[3/4] w-full bg-zinc-100 overflow-hidden">
        <Link to={`/product/${product.productId}`}>
          <img
            src={primaryImage}
            alt={product.name}
            className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
            loading="lazy"
          />
          {secondaryImage !== primaryImage && (
            <img
              src={secondaryImage}
              alt={product.name}
              className="absolute inset-0 h-full w-full object-cover object-center opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              loading="lazy"
            />
          )}
        </Link>

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.categoryName && (
            <span className="px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider bg-white/90 backdrop-blur-md text-zinc-900 rounded-md shadow-sm">
              {product.categoryName}
            </span>
          )}
        </div>

        {/* Floating Wishlist Button */}
        <button
          onClick={handleToggleWishlist}
          aria-label="Thêm vào yêu thích"
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all ${
            isFavorited 
              ? 'bg-rose-50 text-rose-500 shadow-sm' 
              : 'bg-white/80 text-zinc-600 hover:bg-white hover:text-black shadow-sm'
          }`}
        >
          <Heart className={`w-4 h-4 ${isFavorited ? 'fill-rose-500' : ''}`} />
        </button>

        {/* Quick View Button on Hover */}
        <div className="absolute inset-x-3 bottom-3 flex gap-2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
          <button
            onClick={handleQuickViewClick}
            className="flex-1 py-2.5 bg-white/95 backdrop-blur-md hover:bg-white text-zinc-900 text-xs font-semibold rounded-xl shadow-md flex items-center justify-center gap-1.5 transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Xem Nhanh</span>
          </button>
          <button
            onClick={handleAddToCart}
            aria-label="Thêm vào giỏ"
            className="p-2.5 bg-zinc-950 hover:bg-zinc-800 text-white rounded-xl shadow-md transition-colors"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Product Details */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
        <div>
          <div className="flex items-center gap-1 text-amber-500 text-xs mb-1">
            <Star className="w-3.5 h-3.5 fill-amber-400" />
            <span className="font-semibold text-zinc-800">4.9</span>
            <span className="text-zinc-400 text-[11px]">(48)</span>
          </div>

          <Link to={`/product/${product.productId}`}>
            <h3 className="font-sans font-medium text-sm text-zinc-900 line-clamp-2 hover:text-emerald-600 transition-colors leading-snug">
              {product.name}
            </h3>
          </Link>
        </div>

        <div className="flex items-baseline justify-between pt-1 border-t border-zinc-100">
          <div>
            <span className="text-xs text-zinc-400 block font-mono">Giá niêm yết</span>
            <span className="font-display font-bold text-base text-zinc-950">
              {formatCurrency(product.basePrice)}
            </span>
          </div>

          <div className="flex items-center gap-1 text-[11px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
            <span>Sẵn hàng</span>
          </div>
        </div>
      </div>

    </div>
  );
};

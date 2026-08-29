import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Eye, Star, Sparkles } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import { formatCurrency } from '../../utils/formatters';

export const ProductCard = ({ product, onQuickView }) => {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);

  const isFavorited = isInWishlist(product.productId);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const variant = product.variants?.[selectedColorIndex] || product.variants?.[0] || {
      variantId: `${product.productId}-DEFAULT`,
      productId: product.productId,
      sizeName: 'M',
      colorName: 'Đen (Obsidian)',
      stockQty: 10,
    };

    addToCart(product, variant, 1);
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
    <div className="group relative flex flex-col bg-white rounded-3xl border border-zinc-200/80 overflow-hidden hover:border-zinc-300 hover:shadow-xl transition-all duration-500 ease-out">
      
      {/* 1. Image Container with Smooth Zoom & Secondary Crossfade */}
      <div className="relative aspect-[3/4] w-full bg-zinc-100 overflow-hidden">
        <Link to={`/product/${product.productId}`}>
          <img
            src={primaryImage}
            alt={product.name}
            className="h-full w-full object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out"
            loading="lazy"
          />
          {secondaryImage !== primaryImage && (
            <img
              src={secondaryImage}
              alt={product.name}
              className="absolute inset-0 h-full w-full object-cover object-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out"
              loading="lazy"
            />
          )}
        </Link>

        {/* Top Badges */}
        <div className="absolute top-3.5 left-3.5 flex flex-col gap-1.5 z-10 pointer-events-none">
          {product.tag && (
            <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full shadow-sm backdrop-blur-md ${
              product.tag === 'HOT DROP' 
                ? 'bg-rose-500 text-white' 
                : product.tag === 'BESTSELLER' 
                ? 'bg-zinc-950 text-white' 
                : 'bg-emerald-500 text-white'
            }`}>
              {product.tag}
            </span>
          )}
        </div>

        {/* Floating Heart Wishlist Button */}
        <button
          onClick={handleToggleWishlist}
          aria-label="Thêm vào yêu thích"
          className={`absolute top-3.5 right-3.5 p-2.5 rounded-full backdrop-blur-md transition-all duration-300 z-10 ${
            isFavorited 
              ? 'bg-rose-50 text-rose-500 scale-110 shadow-md' 
              : 'bg-white/80 text-zinc-700 hover:bg-white hover:text-black hover:scale-110 shadow-sm'
          }`}
        >
          <Heart className={`w-4 h-4 transition-transform active:scale-125 ${isFavorited ? 'fill-rose-500' : ''}`} />
        </button>

        {/* Quick Action Overlay Buttons */}
        <div className="absolute inset-x-3.5 bottom-3.5 flex gap-2 opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-out z-10">
          <button
            onClick={handleQuickViewClick}
            className="flex-1 py-2.5 bg-white/95 backdrop-blur-md hover:bg-white text-zinc-900 text-xs font-semibold rounded-2xl shadow-lg flex items-center justify-center gap-1.5 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Eye className="w-3.5 h-3.5 text-zinc-600" />
            <span>Xem Nhanh</span>
          </button>
          
          <button
            onClick={handleAddToCart}
            aria-label="Thêm vào giỏ"
            className="p-2.5 bg-zinc-950 hover:bg-zinc-800 text-white rounded-2xl shadow-lg transition-all hover:scale-[1.05] active:scale-[0.95] flex items-center justify-center"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Product Details */}
      <div className="p-5 flex flex-col flex-1 justify-between gap-3">
        <div>
          {/* Rating and Reviews */}
          <div className="flex items-center justify-between mb-1.5 text-xs">
            <span className="text-[11px] font-medium uppercase tracking-wider text-zinc-400">
              {product.categoryName}
            </span>
            <div className="flex items-center gap-1 text-amber-500">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span className="font-semibold text-zinc-800 text-xs">{product.rating || 4.9}</span>
              <span className="text-zinc-400 text-[10px]">({product.reviewCount || 48})</span>
            </div>
          </div>

          <Link to={`/product/${product.productId}`}>
            <h3 className="font-sans font-medium text-sm text-zinc-900 line-clamp-2 hover:text-emerald-600 transition-colors leading-snug">
              {product.name}
            </h3>
          </Link>
        </div>

        {/* Variants Color Swatches & Price */}
        <div className="flex items-end justify-between pt-2 border-t border-zinc-100">
          <div>
            <span className="text-[11px] text-zinc-400 block font-mono">Giá niêm yết</span>
            <span className="font-display font-bold text-base text-zinc-950">
              {formatCurrency(product.basePrice)}
            </span>
          </div>

          {/* Color Preview Dots */}
          <div className="flex items-center gap-1">
            {product.variants?.slice(0, 3).map((v, i) => (
              <span
                key={v.variantId || i}
                title={v.colorName}
                className="w-3 h-3 rounded-full border border-zinc-300 shadow-2xs"
                style={{ backgroundColor: v.hexCode || (i === 0 ? '#09090b' : '#ffffff') }}
              />
            ))}
          </div>
        </div>
      </div>

    </div>
  );
};

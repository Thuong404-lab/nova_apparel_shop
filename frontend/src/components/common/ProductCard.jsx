import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Heart, ShoppingBag, Eye, Star, Sparkles, Check } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import { formatCurrency } from '../../utils/formatters';
import confetti from 'canvas-confetti';

export const ProductCard = ({ product, onQuickView, index = 0 }) => {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [isAdded, setIsAdded] = useState(false);
  const cardRef = useRef(null);

  // 3D Tilt Physics
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['6deg', '-6deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-6deg', '6deg']);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    x.set(mouseX / width - 0.5);
    y.set(mouseY / height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

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
    setIsAdded(true);

    // Particle Confetti Explosion on Add to Cart!
    const rect = e.currentTarget.getBoundingClientRect();
    confetti({
      particleCount: 25,
      spread: 60,
      origin: {
        x: (rect.left + rect.width / 2) / window.innerWidth,
        y: (rect.top + rect.height / 2) / window.innerHeight
      },
      colors: ['#00ff66', '#09090b', '#ffffff']
    });

    setTimeout(() => setIsAdded(false), 1500);
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
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      }}
      initial={{ opacity: 0, y: 35 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay: (index % 4) * 0.1, ease: [0.21, 0.47, 0.32, 0.98] }}
      className="group relative flex flex-col bg-white rounded-3xl border border-zinc-200/80 overflow-hidden hover:border-zinc-300 hover:shadow-2xl transition-all duration-500 will-change-transform"
    >
      
      {/* 1. Image Container with Parallax Zoom & Dual Image Crossfade */}
      <div className="relative aspect-[3/4] w-full bg-zinc-100 overflow-hidden select-none">
        <Link to={`/product/${product.productId}`}>
          <motion.img
            src={primaryImage}
            alt={product.name}
            className="h-full w-full object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-out"
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

        {/* Top Floating Badge */}
        <div className="absolute top-3.5 left-3.5 flex flex-col gap-1.5 z-10 pointer-events-none">
          {product.tag && (
            <motion.span 
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full shadow-md backdrop-blur-md ${
                product.tag === 'HOT DROP' 
                  ? 'bg-rose-500 text-white' 
                  : product.tag === 'BESTSELLER' 
                  ? 'bg-zinc-950 text-white' 
                  : 'bg-emerald-500 text-white'
              }`}
            >
              {product.tag}
            </motion.span>
          )}
        </div>

        {/* Floating Heart Wishlist Button with Spring Physics */}
        <motion.button
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.85 }}
          onClick={handleToggleWishlist}
          aria-label="Thêm vào yêu thích"
          className={`absolute top-3.5 right-3.5 p-2.5 rounded-full backdrop-blur-md transition-colors z-10 shadow-sm ${
            isFavorited 
              ? 'bg-rose-50 text-rose-500' 
              : 'bg-white/85 text-zinc-700 hover:bg-white hover:text-black'
          }`}
        >
          <Heart className={`w-4 h-4 transition-colors ${isFavorited ? 'fill-rose-500' : ''}`} />
        </motion.button>

        {/* Quick Action Overlay Buttons with Smooth Stagger Slide-up */}
        <div className="absolute inset-x-3.5 bottom-3.5 flex gap-2 opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-out z-10">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleQuickViewClick}
            className="flex-1 py-2.5 bg-white/95 backdrop-blur-md hover:bg-white text-zinc-900 text-xs font-semibold rounded-2xl shadow-lg flex items-center justify-center gap-1.5 transition-colors"
          >
            <Eye className="w-3.5 h-3.5 text-zinc-600" />
            <span>Xem Nhanh</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={handleAddToCart}
            aria-label="Thêm vào giỏ"
            className={`p-2.5 rounded-2xl shadow-lg transition-colors flex items-center justify-center ${
              isAdded ? 'bg-emerald-500 text-white' : 'bg-zinc-950 hover:bg-zinc-800 text-white'
            }`}
          >
            {isAdded ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
          </motion.button>
        </div>
      </div>

      {/* 2. Product Details */}
      <div className="p-5 flex flex-col flex-1 justify-between gap-3">
        <div>
          {/* Category & Star Rating */}
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
          <div className="flex items-center gap-1.5">
            {product.variants?.slice(0, 3).map((v, i) => (
              <button
                key={v.variantId || i}
                onClick={() => setSelectedColorIndex(i)}
                title={v.colorName}
                className={`w-3.5 h-3.5 rounded-full border transition-all ${
                  selectedColorIndex === i ? 'ring-2 ring-emerald-500 scale-110' : 'border-zinc-300 hover:scale-110'
                }`}
                style={{ backgroundColor: v.hexCode || (i === 0 ? '#09090b' : '#ffffff') }}
              />
            ))}
          </div>
        </div>
      </div>

    </motion.div>
  );
};

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, ArrowRight } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';
import { productApi } from '../../services/api';
import { ProductCard } from '../../components/common/ProductCard';

export const WishlistPage = () => {
  const { wishlistIds } = useWishlist();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadWishlistProducts() {
      setLoading(true);
      try {
        const res = await productApi.getAll();
        if (res.success) {
          setProducts(res.data.filter(p => wishlistIds.includes(p.productId)));
        }
      } finally {
        setLoading(false);
      }
    }
    loadWishlistProducts();
  }, [wishlistIds]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header */}
      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 font-mono">
          SAVED ITEMS
        </span>
        <h1 className="font-display font-black text-3xl sm:text-4xl text-zinc-950 mt-1">
          Danh Sách Yêu Thích ({products.length} món đồ)
        </h1>
      </div>

      {loading ? (
        <div className="fashion-grid">
          {[1, 2, 3, 4].map(n => <div key={n} className="aspect-[3/4] bg-zinc-200 rounded-3xl animate-pulse"></div>)}
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white rounded-3xl border border-zinc-200 p-16 text-center space-y-4 shadow-sm">
          <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto text-rose-500">
            <Heart className="w-8 h-8" />
          </div>
          <h3 className="font-display font-bold text-xl text-zinc-900">Danh Sách Yêu Thích Đang Trống</h3>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto">
            Bấm vào biểu tượng trái tim trên các sản phẩm bạn thích để lưu lại và theo dõi ưu đãi giảm giá nhé.
          </p>
          <Link to="/catalog" className="luxury-btn-accent text-xs inline-flex">
            <span>Khám Phá Bộ Sưu Tập</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="fashion-grid">
          {products.map((prod, idx) => (
            <ProductCard key={prod.productId} product={prod} index={idx} />
          ))}
        </div>
      )}

    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, ArrowRight } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';
import { productApi } from '../../services/api';
import { ProductCard } from '../../components/common/ProductCard';

export const WishlistPage = () => {
  const { wishlistIds } = useWishlist();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlistProducts = async () => {
      setLoading(true);
      try {
        const res = await productApi.getAll();
        if (res.success) {
          const favoriteList = res.data.filter((p) => wishlistIds.includes(p.productId));
          setProducts(favoriteList);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchWishlistProducts();
  }, [wishlistIds]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-black text-white p-6 border-3 border-black shadow-[6px_6px_0px_#ff4d00] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="font-mono text-xs text-[#00ff66] uppercase tracking-widest block mb-1">
            SAVED ITEMS // WISHLIST
          </span>
          <h1 className="font-display font-black text-2xl sm:text-4xl uppercase tracking-tight">
            SẢN PHẨM YÊU THÍCH ({wishlistIds.length})
          </h1>
        </div>
        <Link to="/catalog" className="inline-flex neo-btn neo-btn-neon text-xs">
          Khám Phá Thêm
        </Link>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="text-center py-20 font-display font-bold text-xs uppercase">
          Đang tải danh sách yêu thích...
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white border-2 border-black p-12 text-center shadow-[6px_6px_0px_#000] space-y-4 max-w-md mx-auto">
          <div className="w-16 h-16 bg-neutral-100 border-2 border-black flex items-center justify-center mx-auto shadow-[4px_4px_0px_#000]">
            <Heart className="w-8 h-8 text-neutral-400" />
          </div>
          <h3 className="font-display font-black text-base uppercase">Danh sách yêu thích trống</h3>
          <p className="text-xs text-neutral-500">
            Lưu lại các sản phẩm streetwear bạn yêu thích bằng cách bấm vào biểu tượng trái tim để xem lại bất kỳ lúc nào!
          </p>
          <Link to="/catalog" className="inline-flex neo-btn neo-btn-neon text-xs">
            Xem Sản Phẩm Ngay <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="fashion-grid">
          {products.map((prod) => (
            <ProductCard key={prod.productId} product={prod} />
          ))}
        </div>
      )}
    </div>
  );
};

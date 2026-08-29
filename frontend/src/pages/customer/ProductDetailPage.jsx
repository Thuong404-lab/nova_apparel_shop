import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Heart, 
  ShoppingBag, 
  Star, 
  Truck, 
  ShieldCheck, 
  RotateCcw, 
  ChevronRight, 
  Share2, 
  Check, 
  Minus, 
  Plus, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { productApi } from '../../services/api';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useToast } from '../../context/ToastContext';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { ProductCard } from '../../components/common/ProductCard';
import confetti from 'canvas-confetti';

export const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToast } = useToast();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      window.scrollTo(0, 0);
      try {
        const res = await productApi.getById(id);
        if (res.success && res.data) {
          setProduct(res.data);
          // Set default color & size
          if (res.data.variants && res.data.variants.length > 0) {
            setSelectedColor(res.data.variants[0].colorName);
            setSelectedSize(res.data.variants[0].sizeName);
          }

          // Fetch related
          const allRes = await productApi.getAll({ category: res.data.categoryId });
          if (allRes.success) {
            setRelatedProducts(allRes.data.filter(p => p.productId !== id).slice(0, 4));
          }
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 animate-pulse space-y-8">
        <div className="h-6 w-48 bg-zinc-200 rounded-lg"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="aspect-[3/4] bg-zinc-200 rounded-3xl"></div>
          <div className="space-y-6">
            <div className="h-10 bg-zinc-200 rounded-xl w-3/4"></div>
            <div className="h-6 bg-zinc-200 rounded-lg w-1/4"></div>
            <div className="h-32 bg-zinc-200 rounded-2xl"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-display font-bold text-2xl">Không tìm thấy sản phẩm!</h2>
        <Link to="/catalog" className="luxury-btn-primary inline-flex">Quay lại Catalog</Link>
      </div>
    );
  }

  // Available unique colors and sizes from variants
  const availableColors = Array.from(new Set(product.variants?.map(v => v.colorName) || []));
  const availableSizes = Array.from(new Set(product.variants?.map(v => v.sizeName) || []));

  // Current selected variant
  const currentVariant = product.variants?.find(
    v => v.colorName === selectedColor && v.sizeName === selectedSize
  ) || product.variants?.[0];

  const currentPrice = currentVariant?.priceOverride || product.basePrice;
  const isOutOfStock = !currentVariant || currentVariant.stockQty <= 0;

  const handleAddToCart = (e) => {
    if (isOutOfStock) return;
    addItem(product, currentVariant, quantity);
    
    // Confetti
    const rect = e.currentTarget.getBoundingClientRect();
    confetti({
      particleCount: 35,
      spread: 70,
      origin: {
        x: (rect.left + rect.width / 2) / window.innerWidth,
        y: (rect.top + rect.height / 2) / window.innerHeight
      },
      colors: ['#00ff66', '#09090b', '#ffffff']
    });
  };

  const isFavorited = isInWishlist(product.productId);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-zinc-500">
        <Link to="/" className="hover:text-black">Trang Chủ</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to="/catalog" className="hover:text-black">Sản Phẩm</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-zinc-950 font-semibold truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Product Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Left: Image Gallery (7 cols) */}
        <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-4">
          
          {/* Thumbnails */}
          <div className="flex md:flex-col gap-3 overflow-x-auto md:w-24 flex-shrink-0">
            {product.images?.map((img, idx) => (
              <button
                key={img.imageId || idx}
                onClick={() => setSelectedImage(idx)}
                className={`relative aspect-[3/4] rounded-2xl overflow-hidden border-2 transition-all flex-shrink-0 w-20 md:w-full cursor-pointer ${
                  selectedImage === idx ? 'border-zinc-950 ring-2 ring-emerald-400' : 'border-transparent opacity-70 hover:opacity-100'
                }`}
              >
                <img src={img.imageUrl} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>

          {/* Main Large Image */}
          <div className="relative aspect-[3/4] flex-1 rounded-3xl overflow-hidden bg-zinc-100 shadow-xl border border-zinc-200/80 group select-none">
            <motion.img
              key={selectedImage}
              initial={{ opacity: 0.8, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              src={product.images?.[selectedImage]?.imageUrl || product.images?.[0]?.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            {product.tag && (
              <span className="absolute top-4 left-4 px-3.5 py-1.5 bg-zinc-950 text-white text-xs font-bold uppercase rounded-full shadow-lg">
                {product.tag}
              </span>
            )}
          </div>
        </div>

        {/* Right: Product Info & Buy Controls (5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-8">
          
          <div className="space-y-6">
            
            {/* Header / Brand Tag */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 font-mono">
                {product.categoryName} // NOVA APPAREL
              </span>
              <h1 className="font-display font-black text-2xl sm:text-3xl text-zinc-950 leading-tight">
                {product.name}
              </h1>

              {/* Rating & Reviews */}
              <div className="flex items-center gap-3 pt-1">
                <div className="flex items-center gap-1 text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                  <span className="font-bold text-zinc-900 text-xs ml-1">{product.rating || 4.9}</span>
                </div>
                <span className="text-zinc-300">•</span>
                <span className="text-xs text-zinc-500 font-medium">({product.reviewCount || 86} đánh giá chính hãng)</span>
              </div>
            </div>

            {/* Price */}
            <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/80 flex items-baseline justify-between">
              <div>
                <span className="text-xs text-zinc-500 block font-mono">Giá niêm yết chính thức</span>
                <span className="font-display font-black text-3xl text-zinc-950">
                  {formatCurrency(currentPrice)}
                </span>
              </div>
              <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full">
                Miễn phí giao hàng
              </span>
            </div>

            {/* Color Selector */}
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-zinc-900 uppercase tracking-wider">Màu Sắc:</span>
                <span className="font-semibold text-zinc-600">{selectedColor}</span>
              </div>
              <div className="flex flex-wrap gap-3">
                {availableColors.map((colorName) => {
                  const variant = product.variants?.find(v => v.colorName === colorName);
                  const isSelected = selectedColor === colorName;
                  return (
                    <button
                      key={colorName}
                      onClick={() => setSelectedColor(colorName)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-semibold border transition-all cursor-pointer ${
                        isSelected 
                          ? 'border-zinc-950 bg-zinc-950 text-white shadow-md' 
                          : 'border-zinc-200 bg-white text-zinc-700 hover:border-zinc-400'
                      }`}
                    >
                      <span 
                        className="w-3 h-3 rounded-full border border-black/20" 
                        style={{ backgroundColor: variant?.hexCode || '#000000' }}
                      />
                      <span>{colorName}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Size Selector */}
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-zinc-900 uppercase tracking-wider">Kích Thước (Size):</span>
                <button className="text-emerald-600 hover:underline font-medium">Bảng hướng dẫn chọn size</button>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {availableSizes.map((sizeName) => {
                  const isSelected = selectedSize === sizeName;
                  return (
                    <button
                      key={sizeName}
                      onClick={() => setSelectedSize(sizeName)}
                      className={`w-12 h-12 rounded-2xl text-xs font-bold border transition-all flex items-center justify-center cursor-pointer ${
                        isSelected 
                          ? 'border-zinc-950 bg-zinc-950 text-white shadow-md' 
                          : 'border-zinc-200 bg-white text-zinc-800 hover:border-zinc-400'
                      }`}
                    >
                      {sizeName}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity Selector & Stock Status */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-zinc-900 uppercase tracking-wider block">Số Lượng</span>
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-zinc-200 rounded-2xl bg-white p-1 shadow-xs">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-xl hover:bg-zinc-100 flex items-center justify-center text-zinc-600 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center font-display font-bold text-sm">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 rounded-xl hover:bg-zinc-100 flex items-center justify-center text-zinc-600 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <span className="text-xs text-zinc-500 font-mono">
                  {currentVariant?.stockQty > 0 ? `(Còn ${currentVariant.stockQty} sản phẩm trong kho)` : '(Hết hàng)'}
                </span>
              </div>
            </div>

            {/* Action Buttons: Add to Cart & Wishlist */}
            <div className="flex items-center gap-3 pt-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isOutOfStock}
                onClick={handleAddToCart}
                className={`flex-1 py-4 px-6 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-xl cursor-pointer ${
                  isOutOfStock 
                    ? 'bg-zinc-300 text-zinc-500 cursor-not-allowed' 
                    : 'luxury-btn-accent shadow-emerald-500/20'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{isOutOfStock ? 'Tạm Hết Hàng' : 'Thêm Vào Giỏ Hàng'}</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => toggleWishlist(product)}
                className={`p-4 rounded-2xl border transition-colors cursor-pointer ${
                  isFavorited 
                    ? 'border-rose-500 bg-rose-50 text-rose-500' 
                    : 'border-zinc-200 bg-white text-zinc-700 hover:border-zinc-400'
                }`}
              >
                <Heart className={`w-5 h-5 ${isFavorited ? 'fill-rose-500' : ''}`} />
              </motion.button>
            </div>

          </div>

          {/* Value Highlights */}
          <div className="grid grid-cols-3 gap-3 pt-6 border-t border-zinc-100 text-center">
            <div className="p-3 rounded-2xl bg-zinc-50 border border-zinc-100 space-y-1">
              <Truck className="w-5 h-5 mx-auto text-emerald-600" />
              <p className="text-[11px] font-bold text-zinc-900">Giao Hỏa Tốc</p>
              <p className="text-[10px] text-zinc-500">2h tại HN & HCM</p>
            </div>
            <div className="p-3 rounded-2xl bg-zinc-50 border border-zinc-100 space-y-1">
              <RotateCcw className="w-5 h-5 mx-auto text-emerald-600" />
              <p className="text-[11px] font-bold text-zinc-900">Đổi Trả 7 Ngày</p>
              <p className="text-[10px] text-zinc-500">Miễn phí đổi size</p>
            </div>
            <div className="p-3 rounded-2xl bg-zinc-50 border border-zinc-100 space-y-1">
              <ShieldCheck className="w-5 h-5 mx-auto text-emerald-600" />
              <p className="text-[11px] font-bold text-zinc-900">Chính Hãng 100%</p>
              <p className="text-[10px] text-zinc-500">Bảo hành đường may</p>
            </div>
          </div>

        </div>

      </div>

      {/* Tabs: Description & Specs */}
      <div className="bg-white rounded-3xl border border-zinc-200 p-8 space-y-6 shadow-sm">
        <div className="flex gap-6 border-b border-zinc-200 pb-4 text-sm font-bold">
          <button
            onClick={() => setActiveTab('description')}
            className={`pb-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'description' ? 'border-zinc-950 text-zinc-950' : 'border-transparent text-zinc-400 hover:text-zinc-700'
            }`}
          >
            Mô Tả Chi Tiết & Chất Liệu
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`pb-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'reviews' ? 'border-zinc-950 text-zinc-950' : 'border-transparent text-zinc-400 hover:text-zinc-700'
            }`}
          >
            Đánh Giá Của Khách Hàng ({product.reviewCount || 86})
          </button>
        </div>

        {activeTab === 'description' ? (
          <div className="space-y-4 text-sm text-zinc-600 leading-relaxed max-w-4xl">
            <p>{product.description}</p>
            <div className="grid sm:grid-cols-2 gap-4 pt-4 border-t border-zinc-100 text-xs">
              <div className="space-y-2">
                <p><strong className="text-zinc-900">Thương hiệu:</strong> NOVA APPAREL</p>
                <p><strong className="text-zinc-900">Xuất xứ:</strong> Thiết kế & Sản xuất tại Việt Nam</p>
                <p><strong className="text-zinc-900">Phom dáng:</strong> Streetwear Relaxed Fit / Boxy Oversize</p>
              </div>
              <div className="space-y-2">
                <p><strong className="text-zinc-900">Chất liệu:</strong> 100% Organic Cotton định lượng cao</p>
                <p><strong className="text-zinc-900">Bảo quản:</strong> Giặt máy chế độ nhẹ, không sấy nhiệt độ cao</p>
                <p><strong className="text-zinc-900">Mã SKU:</strong> {product.productId}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center gap-4 p-6 rounded-2xl bg-zinc-50 border border-zinc-100">
              <div className="text-center">
                <span className="font-display font-black text-4xl text-zinc-950">{product.rating || 4.9}</span>
                <div className="flex justify-center text-amber-500 mt-1">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />)}
                </div>
                <span className="text-[11px] text-zinc-400">100% Đánh giá 5 sao</span>
              </div>
              <div className="border-l border-zinc-200 pl-6 space-y-1 text-xs text-zinc-600">
                <p>• 98% khách hàng khen form áo dày dặn và tôn dáng.</p>
                <p>• 99% khách hàng hài lòng về tốc độ giao hàng 2h.</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="space-y-8">
          <div className="flex justify-between items-end">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">GỢI Ý CHO BẠN</span>
              <h2 className="font-display font-black text-2xl text-zinc-900 mt-1">Sản Phẩm Cùng Bộ Sưu Tập</h2>
            </div>
            <Link to="/catalog" className="text-xs font-semibold text-zinc-900 hover:text-emerald-600 flex items-center gap-1">
              Xem tất cả <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="fashion-grid">
            {relatedProducts.map((prod, idx) => (
              <ProductCard key={prod.productId} product={prod} index={idx} />
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

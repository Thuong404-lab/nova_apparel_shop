import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Star, 
  ShoppingBag, 
  Heart, 
  Share2, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Check, 
  ArrowRight,
  MessageSquare,
  Sparkles
} from 'lucide-react';
import { productApi } from '../../services/api';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useToast } from '../../context/ToastContext';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { ProductCard } from '../../components/common/ProductCard';

export const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { toggleWishlist, isFavorite } = useWishlist();
  const { addToast } = useToast();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  // Review Form State
  const [reviews, setReviews] = useState([
    { commentId: 'CMT01', customerName: 'Nguyễn Văn A', rating: 5, content: 'Chất vải dày dặn 100% cotton rất thích, form oversize mặc siêu đẹp.', createdAt: '2026-08-25T14:00:00' },
    { commentId: 'CMT02', customerName: 'Trần Thị Bích', rating: 5, content: 'Đóng gói cẩn thận 2 lớp, tag mác đầy đủ xịn xò.', createdAt: '2026-08-26T10:30:00' }
  ]);
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewContent, setNewReviewContent] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await productApi.getById(id);
        if (res.success && res.data) {
          setProduct(res.data);
          setSelectedVariant(res.data.variants?.[0] || null);
          setActiveImageIndex(0);
          setQuantity(1);

          // Get related
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
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="w-12 h-12 border-4 border-black border-t-[#00ff66] rounded-full animate-spin mx-auto mb-4" />
        <p className="font-display font-bold uppercase tracking-wider text-xs">Đang tải thông tin sản phẩm...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-display font-black text-2xl uppercase">Không tìm thấy sản phẩm</h2>
        <Link to="/catalog" className="inline-flex neo-btn neo-btn-neon text-xs">Quay lại danh mục</Link>
      </div>
    );
  }

  const currentPrice = selectedVariant?.priceOverride || product.basePrice;
  const availableStock = selectedVariant ? selectedVariant.stockQty - (selectedVariant.reservedQty || 0) : 0;

  const handleAddToCart = () => {
    if (selectedVariant && availableStock > 0) {
      addItem(product, selectedVariant, quantity);
    }
  };

  const handleBuyNow = () => {
    if (selectedVariant && availableStock > 0) {
      addItem(product, selectedVariant, quantity);
      navigate('/checkout');
    }
  };

  const handleAddReview = (e) => {
    e.preventDefault();
    if (!newReviewContent.trim()) return;

    const newComment = {
      commentId: 'CMT_' + Date.now(),
      customerName: 'Bạn (Khách hàng)',
      rating: newReviewRating,
      content: newReviewContent.trim(),
      createdAt: new Date().toISOString()
    };

    setReviews([newComment, ...reviews]);
    setNewReviewContent('');
    addToast('Cảm ơn bạn đã gửi đánh giá sản phẩm!', 'success');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
      
      {/* 1. Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs font-mono font-bold text-neutral-500 uppercase">
        <Link to="/" className="hover:text-black">Trang Chủ</Link>
        <span>/</span>
        <Link to={`/catalog?category=${product.categoryId}`} className="hover:text-black">{product.categoryName}</Link>
        <span>/</span>
        <span className="text-black truncate max-w-xs">{product.name}</span>
      </div>

      {/* 2. Main Product Showcase Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Left: Images Gallery (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Main Large Image */}
          <div className="relative aspect-[4/5] bg-neutral-100 border-3 border-black overflow-hidden shadow-[8px_8px_0px_#000000]">
            <img
              src={product.images?.[activeImageIndex] || product.images?.[0]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {product.tag && (
              <span className="absolute top-4 left-4 neo-badge bg-[#00ff66] text-black">
                {product.tag}
              </span>
            )}
          </div>

          {/* Thumbnails Row */}
          {product.images && product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`aspect-square border-2 border-black overflow-hidden transition-all ${
                    activeImageIndex === idx
                      ? 'ring-3 ring-black shadow-[4px_4px_0px_#00ff66] scale-105'
                      : 'opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="thumb" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Purchase Controls (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="border-b-2 border-black pb-6 space-y-3">
            <span className="font-mono text-xs uppercase tracking-widest text-[#ff4d00] font-bold">
              {product.categoryName} // SKU: {selectedVariant?.sku || 'N/A'}
            </span>
            <h1 className="font-display font-black text-2xl sm:text-4xl uppercase tracking-tight leading-tight">
              {product.name}
            </h1>
            
            {/* Rating Stars */}
            <div className="flex items-center gap-3">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <span className="text-xs font-bold font-mono">
                {product.rating} / 5.0 ({reviews.length} đánh giá)
              </span>
            </div>

            {/* Price Box */}
            <div className="p-4 bg-neutral-100 border-2 border-black shadow-[4px_4px_0px_#000] flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-neutral-500 uppercase font-bold block">Giá niêm yết:</span>
                <span className="font-display font-black text-3xl text-black">
                  {formatCurrency(currentPrice)}
                </span>
              </div>
              <span className="neo-badge bg-black text-[#00ff66] text-xs">
                CHÍNH HÃNG 100%
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h4 className="font-display font-bold text-xs uppercase tracking-wider">Mô tả sản phẩm:</h4>
            <p className="text-xs text-neutral-600 leading-relaxed font-medium">
              {product.description}
            </p>
          </div>

          {/* Variant Selectors */}
          {product.variants && product.variants.length > 0 && (
            <div className="space-y-4 pt-2">
              <label className="block font-display font-bold text-xs uppercase tracking-wider">
                Chọn biến thể (Kích cỡ & Màu sắc):
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                {product.variants.map((v) => {
                  const isSelected = selectedVariant?.variantId === v.variantId;
                  const inStock = v.stockQty > 0;
                  return (
                    <button
                      key={v.variantId}
                      onClick={() => setSelectedVariant(v)}
                      disabled={!inStock}
                      className={`p-3 border-2 border-black text-left flex items-center justify-between text-xs transition-all ${
                        isSelected
                          ? 'bg-black text-white shadow-[3px_3px_0px_#00ff66]'
                          : inStock
                          ? 'bg-white hover:bg-neutral-50 shadow-[2px_2px_0px_#000]'
                          : 'bg-neutral-100 text-neutral-400 border-neutral-300 cursor-not-allowed'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className="w-4 h-4 rounded-full border border-black inline-block"
                          style={{ backgroundColor: v.hexCode || '#000' }}
                        />
                        <span className="font-display font-bold">
                          {v.sizeName} - {v.colorName}
                        </span>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-[#00ff66]" />}
                    </button>
                  );
                })}
              </div>

              {/* Stock status */}
              <div className="text-xs font-mono pt-1">
                Tình trạng kho: {' '}
                {availableStock > 0 ? (
                  <span className="text-emerald-600 font-bold">Còn {availableStock} sản phẩm có thể giao ngay</span>
                ) : (
                  <span className="text-red-600 font-bold">Tạm thời hết hàng biến thể này</span>
                )}
              </div>
            </div>
          )}

          {/* Quantity & CTA Buttons */}
          <div className="space-y-4 pt-4 border-t-2 border-black">
            <div className="flex items-center gap-4">
              <span className="font-display font-bold text-xs uppercase">Số lượng:</span>
              <div className="flex items-center border-2 border-black bg-white shadow-[2px_2px_0px_#000]">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-9 h-9 flex items-center justify-center font-bold hover:bg-neutral-100 border-r-2 border-black"
                >
                  -
                </button>
                <span className="w-12 text-center font-display font-bold text-sm">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(availableStock, quantity + 1))}
                  disabled={quantity >= availableStock}
                  className="w-9 h-9 flex items-center justify-center font-bold hover:bg-neutral-100 border-l-2 border-black disabled:opacity-50"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                disabled={availableStock <= 0}
                className="flex-1 py-4 neo-btn neo-btn-secondary text-xs disabled:opacity-50"
              >
                <ShoppingBag className="w-4 h-4" /> Thêm Vào Giỏ
              </button>
              <button
                onClick={handleBuyNow}
                disabled={availableStock <= 0}
                className="flex-1 py-4 neo-btn neo-btn-neon text-xs disabled:opacity-50"
              >
                Mua Ngay <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => toggleWishlist(product.productId, product.name)}
                className={`p-4 border-2 border-black flex items-center justify-center shadow-[4px_4px_0px_#000] ${
                  isFavorite(product.productId) ? 'bg-red-500 text-white' : 'bg-white hover:bg-neutral-100'
                }`}
                title="Yêu thích"
              >
                <Heart className={`w-5 h-5 ${isFavorite(product.productId) ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>

          {/* Value Assurance Badges */}
          <div className="p-4 bg-neutral-50 border-2 border-black space-y-2.5 text-xs text-neutral-700">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-black" />
              <span>Giao hàng hỏa tốc 2-3 ngày toàn quốc</span>
            </div>
            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-black" />
              <span>Đổi trả size miễn phí trong vòng 7 ngày</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-black" />
              <span>Bảo hành đường may & hình in trọn đời</span>
            </div>
          </div>

        </div>
      </div>

      {/* 3. Customer Reviews Section */}
      <section className="bg-white border-3 border-black p-8 shadow-[8px_8px_0px_#000] space-y-8">
        <div className="flex items-center justify-between pb-4 border-b-2 border-black">
          <div className="flex items-center gap-3">
            <MessageSquare className="w-6 h-6 text-black" />
            <h2 className="font-display font-black text-2xl uppercase">
              ĐÁNH GIÁ TỪ KHÁCH HÀNG ({reviews.length})
            </h2>
          </div>
        </div>

        {/* Add Review Form */}
        <form onSubmit={handleAddReview} className="bg-neutral-50 border-2 border-black p-6 space-y-4 shadow-[4px_4px_0px_#000]">
          <h3 className="font-display font-bold text-sm uppercase">Gửi Đánh Giá Của Bạn</h3>
          
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold">Số sao:</span>
            <div className="flex gap-1 text-amber-400 cursor-pointer">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setNewReviewRating(star)}
                  className="focus:outline-none"
                >
                  <Star className={`w-5 h-5 ${star <= newReviewRating ? 'fill-current' : 'text-neutral-300'}`} />
                </button>
              ))}
            </div>
          </div>

          <textarea
            rows="3"
            placeholder="Chia sẻ trải nghiệm thực tế của bạn về chất liệu, form dáng, dịch vụ..."
            value={newReviewContent}
            onChange={(e) => setNewReviewContent(e.target.value)}
            className="w-full p-3 border-2 border-black text-xs font-sans focus:outline-none shadow-[2px_2px_0px_#000]"
            required
          />

          <button type="submit" className="neo-btn neo-btn-neon text-xs">
            Gửi Đánh Giá Ngay
          </button>
        </form>

        {/* Reviews List */}
        <div className="space-y-4">
          {reviews.map((rev) => (
            <div key={rev.commentId} className="p-4 bg-neutral-50 border-2 border-black shadow-[3px_3px_0px_#000] space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 bg-black text-[#00ff66] font-display font-black text-xs flex items-center justify-center border border-black">
                    {rev.customerName.charAt(0)}
                  </div>
                  <span className="font-display font-bold text-xs">{rev.customerName}</span>
                </div>
                <span className="text-[10px] font-mono text-neutral-500">{formatDate(rev.createdAt)}</span>
              </div>
              <div className="flex text-amber-400">
                {[...Array(rev.rating)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
              <p className="text-xs text-neutral-700 leading-relaxed font-medium">{rev.content}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Related Products */}
      {relatedProducts.length > 0 && (
        <section className="space-y-6">
          <h2 className="font-display font-black text-2xl uppercase pb-3 border-b-2 border-black">
            SẢN PHẨM CÙNG DANH MỤC
          </h2>
          <div className="fashion-grid">
            {relatedProducts.map((p) => (
              <ProductCard key={p.productId} product={p} />
            ))}
          </div>
        </section>
      )}

    </div>
  );
};

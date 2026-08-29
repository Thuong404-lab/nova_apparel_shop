import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, Star, Layers, Check, X } from 'lucide-react';
import { productApi, adminApi } from '../../services/api';
import { formatCurrency } from '../../utils/formatters';
import { useToast } from '../../context/ToastContext';

export const AdminProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Add/Edit Product Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    categoryId: 'CAT001',
    categoryName: 'Tops & Tees',
    basePrice: 290000,
    description: '',
    tag: 'NEW',
    images: ['https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800']
  });

  const { addToast } = useToast();

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        productApi.getAll(),
        productApi.getCategories()
      ]);
      if (prodRes.success) setProducts(prodRes.data);
      if (catRes.success) setCategories(catRes.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      categoryId: 'CAT001',
      categoryName: 'Tops & Tees',
      basePrice: 290000,
      description: '',
      tag: 'NEW',
      images: ['https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800']
    });
    setShowModal(true);
  };

  const handleOpenEdit = (p) => {
    setEditingProduct(p);
    setFormData({
      productId: p.productId,
      name: p.name,
      categoryId: p.categoryId,
      categoryName: p.categoryName,
      basePrice: p.basePrice,
      description: p.description,
      tag: p.tag || '',
      images: p.images || ['https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800']
    });
    setShowModal(true);
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      const res = await adminApi.deleteProduct(productId);
      if (res.success) {
        addToast(res.message, 'success');
        fetchProducts();
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cat = categories.find(c => c.categoryId === formData.categoryId);
    const payload = {
      ...formData,
      categoryName: cat ? cat.name : 'Streetwear',
      variants: editingProduct?.variants || [
        { variantId: 'VAR_' + Date.now(), sizeId: 'SZ002', sizeName: 'M', colorId: 'COL001', colorName: 'Đen (Black)', hexCode: '#000', sku: 'NEW-M-BLK', stockQty: 50, reservedQty: 0 }
      ]
    };

    const res = await adminApi.saveProduct(payload);
    if (res.success) {
      addToast(res.message, 'success');
      setShowModal(false);
      fetchProducts();
    }
  };

  const filteredProducts = products.filter(p => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return p.name.toLowerCase().includes(q) || p.productId.toLowerCase().includes(q);
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-black text-white p-6 border-3 border-black shadow-[6px_6px_0px_#7928ca] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="font-mono text-xs text-[#00ff66] uppercase tracking-widest block mb-1">
            ADMINISTRATOR // CATALOG & PRODUCTS CRUD
          </span>
          <h1 className="font-display font-black text-2xl sm:text-4xl uppercase tracking-tight">
            QUẢN LÝ SẢN PHẨM & BIẾN THỂ
          </h1>
        </div>
        <button
          onClick={handleOpenAdd}
          className="py-3 px-6 neo-btn neo-btn-neon text-xs flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Thêm Sản Phẩm Mới
        </button>
      </div>

      {/* Search Input */}
      <div className="bg-white border-2 border-black p-4 shadow-[4px_4px_0px_#000] flex justify-between items-center">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Tìm theo Tên hoặc Mã sản phẩm..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="neo-input text-xs pl-9"
          />
          <Search className="w-4 h-4 absolute left-3 top-3.5 text-neutral-400" />
        </div>
        <span className="text-xs font-mono font-bold text-neutral-500">
          Tổng cộng: {filteredProducts.length} sản phẩm
        </span>
      </div>

      {/* Products Table */}
      <div className="bg-white border-2 border-black shadow-[6px_6px_0px_#000] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-black text-white font-display uppercase tracking-wider text-[11px] border-b-2 border-black">
                <th className="p-4">Ảnh & Sản Phẩm</th>
                <th className="p-4">Mã SP</th>
                <th className="p-4">Danh Mục</th>
                <th className="p-4">Giá Niêm Yết</th>
                <th className="p-4">Biến Thể</th>
                <th className="p-4">Đánh Giá</th>
                <th className="p-4 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {filteredProducts.map((prod) => (
                <tr key={prod.productId} className="hover:bg-neutral-50 transition-colors">
                  <td className="p-4 flex items-center gap-3">
                    <img src={prod.images?.[0]} alt={prod.name} className="w-12 h-14 object-cover border border-black flex-shrink-0" />
                    <div>
                      <h4 className="font-bold text-neutral-900 line-clamp-1 max-w-xs">{prod.name}</h4>
                      {prod.tag && <span className="neo-badge bg-[#00ff66] text-black text-[9px] mt-1">{prod.tag}</span>}
                    </div>
                  </td>
                  <td className="p-4 font-mono font-black">{prod.productId}</td>
                  <td className="p-4 font-bold text-neutral-700">{prod.categoryName}</td>
                  <td className="p-4 font-display font-black text-sm text-black">{formatCurrency(prod.basePrice)}</td>
                  <td className="p-4 font-mono font-bold">
                    <span className="px-2 py-0.5 bg-neutral-100 border border-black rounded-xs">
                      {prod.variants?.length || 0} Size/Màu
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1 font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{prod.rating}</span>
                    </div>
                  </td>
                  <td className="p-4 text-right space-x-2 whitespace-nowrap">
                    <button
                      onClick={() => handleOpenEdit(prod)}
                      className="p-2 bg-neutral-100 hover:bg-neutral-200 border border-black shadow-[1px_1px_0px_#000]"
                      title="Sửa"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(prod.productId)}
                      className="p-2 bg-red-100 hover:bg-red-200 text-red-700 border border-black shadow-[1px_1px_0px_#000]"
                      title="Xóa"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="bg-white border-3 border-black p-8 max-w-xl w-full shadow-[10px_10px_0px_#7928ca] max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex justify-between items-center pb-3 border-b-2 border-black">
              <h3 className="font-display font-black text-lg uppercase">
                {editingProduct ? 'CHỈNH SỬA SẢN PHẨM' : 'THÊM SẢN PHẨM MỚI'}
              </h3>
              <button type="button" onClick={() => setShowModal(false)} className="p-1 border border-black">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-display font-bold uppercase mb-1">Tên sản phẩm *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ví dụ: Áo Thun Shark Streetwear..."
                className="neo-input text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-display font-bold uppercase mb-1">Danh mục *</label>
                <select
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  className="w-full neo-input text-xs"
                >
                  {categories.map((c) => (
                    <option key={c.categoryId} value={c.categoryId}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-display font-bold uppercase mb-1">Giá niêm yết (VNĐ) *</label>
                <input
                  type="number"
                  required
                  min={0}
                  step={10000}
                  value={formData.basePrice}
                  onChange={(e) => setFormData({ ...formData, basePrice: Number(e.target.value) })}
                  className="neo-input text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-display font-bold uppercase mb-1">Tag nhãn (Pill Badge)</label>
              <input
                type="text"
                value={formData.tag}
                onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                placeholder="HOT, BESTSELLER, SALE -10%..."
                className="neo-input text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-display font-bold uppercase mb-1">Mô tả sản phẩm</label>
              <textarea
                rows="3"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Mô tả chất liệu, form dáng..."
                className="neo-input text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-display font-bold uppercase mb-1">Link ảnh đại diện (URL)</label>
              <input
                type="text"
                value={formData.images[0]}
                onChange={(e) => setFormData({ ...formData, images: [e.target.value] })}
                className="neo-input text-xs"
              />
            </div>

            <div className="flex gap-2 pt-4 border-t-2 border-black">
              <button type="submit" className="flex-1 py-3 neo-btn neo-btn-neon text-xs">
                Lưu Sản Phẩm
              </button>
              <button type="button" onClick={() => setShowModal(false)} className="py-3 px-5 neo-btn neo-btn-secondary text-xs">
                Hủy
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

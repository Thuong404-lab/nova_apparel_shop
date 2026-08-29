import React, { useState, useEffect } from 'react';
import { Warehouse, Plus, AlertTriangle, Search, CheckCircle2, ArrowRight } from 'lucide-react';
import { productApi, staffApi } from '../../services/api';
import { formatCurrency } from '../../utils/formatters';
import { useToast } from '../../context/ToastContext';

export const StaffWarehousePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Stock Import Modal State
  const [showImportModal, setShowImportModal] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [importQuantity, setImportQuantity] = useState(50);
  const [importPrice, setImportPrice] = useState(150000);
  const { addToast } = useToast();

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await productApi.getAll();
      if (res.success) {
        setProducts(res.data);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleOpenImport = (product, variant) => {
    setSelectedVariant({ ...variant, productName: product.name, productId: product.productId });
    setImportQuantity(50);
    setImportPrice(Math.round(product.basePrice * 0.5));
    setShowImportModal(true);
  };

  const handleConfirmImport = async (e) => {
    e.preventDefault();
    if (!selectedVariant || importQuantity <= 0) return;

    const res = await staffApi.importWarehouse({
      variantId: selectedVariant.variantId,
      quantity: importQuantity,
      importPrice: importPrice,
      employeeId: 'EMP002'
    });

    if (res.success) {
      addToast(`Đã nhập ${importQuantity} sản phẩm cho ${selectedVariant.productName} (${selectedVariant.sizeName} - ${selectedVariant.colorName})`, 'success', 'NHẬP KHO THÀNH CÔNG');
      setShowImportModal(false);
      fetchProducts();
    }
  };

  // Flatten variants list
  const allVariants = products.flatMap(p => 
    (p.variants || []).map(v => ({
      ...v,
      productName: p.name,
      categoryName: p.categoryName,
      basePrice: p.basePrice,
      image: p.images?.[0]
    }))
  );

  const filteredVariants = allVariants.filter(v => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      v.productName.toLowerCase().includes(q) ||
      v.sku?.toLowerCase().includes(q) ||
      v.sizeName?.toLowerCase().includes(q) ||
      v.colorName?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-neutral-900 via-neutral-950 to-black text-white p-6 border-3 border-black shadow-[6px_6px_0px_#00ff66] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="font-mono text-xs text-[#00ff66] uppercase tracking-widest block mb-1">
            STAFF OPERATIONS // INVENTORY & WAREHOUSE
          </span>
          <h1 className="font-display font-black text-2xl sm:text-4xl uppercase tracking-tight">
            QUẢN LÝ TỒN KHO & NHẬP HÀNG
          </h1>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border-2 border-black p-4 shadow-[4px_4px_0px_#000]">
          <span className="text-[10px] font-mono font-bold text-neutral-500 uppercase">Tổng số mẫu biến thể</span>
          <div className="font-display font-black text-2xl text-black">
            {allVariants.length} MẪU
          </div>
        </div>
        <div className="bg-white border-2 border-black p-4 shadow-[4px_4px_0px_#000]">
          <span className="text-[10px] font-mono font-bold text-neutral-500 uppercase">Tổng tồn kho vật lý</span>
          <div className="font-display font-black text-2xl text-blue-600">
            {allVariants.reduce((acc, v) => acc + (v.stockQty || 0), 0)} SẢN PHẨM
          </div>
        </div>
        <div className="bg-white border-2 border-black p-4 shadow-[4px_4px_0px_#000]">
          <span className="text-[10px] font-mono font-bold text-neutral-500 uppercase">Đang giữ chỗ (Pending)</span>
          <div className="font-display font-black text-2xl text-amber-600">
            {allVariants.reduce((acc, v) => acc + (v.reservedQty || 0), 0)} SẢN PHẨM
          </div>
        </div>
      </div>

      {/* Search Input */}
      <div className="bg-white border-2 border-black p-4 shadow-[4px_4px_0px_#000]">
        <div className="relative max-w-md">
          <input
            type="text"
            placeholder="Tìm theo Tên sản phẩm, Mã SKU, Size, Màu..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="neo-input text-xs pl-9"
          />
          <Search className="w-4 h-4 absolute left-3 top-3.5 text-neutral-400" />
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white border-2 border-black shadow-[6px_6px_0px_#000] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-black text-white font-display uppercase tracking-wider text-[11px] border-b-2 border-black">
                <th className="p-4">Sản Phẩm</th>
                <th className="p-4">Mã SKU</th>
                <th className="p-4">Biến Thể</th>
                <th className="p-4 text-center">Tồn Vật Lý (stockQty)</th>
                <th className="p-4 text-center">Giữ Chỗ (reservedQty)</th>
                <th className="p-4 text-center">Khả Dụng</th>
                <th className="p-4">Tình Trạng</th>
                <th className="p-4 text-right">Nhập Hàng</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {filteredVariants.map((v) => {
                const available = v.stockQty - (v.reservedQty || 0);
                const isLowStock = available <= 10 && available > 0;
                const isOutOfStock = available <= 0;

                return (
                  <tr key={v.variantId} className="hover:bg-neutral-50 transition-colors">
                    <td className="p-4 flex items-center gap-3">
                      <img src={v.image} alt={v.productName} className="w-10 h-12 object-cover border border-black flex-shrink-0" />
                      <div className="font-bold text-neutral-900 max-w-xs">{v.productName}</div>
                    </td>
                    <td className="p-4 font-mono font-bold text-neutral-600">{v.sku}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-1.5 font-display font-bold">
                        <span className="w-3 h-3 rounded-full border border-black" style={{ backgroundColor: v.hexCode || '#000' }} />
                        <span>{v.sizeName} - {v.colorName}</span>
                      </div>
                    </td>
                    <td className="p-4 text-center font-mono font-black text-sm">{v.stockQty}</td>
                    <td className="p-4 text-center font-mono font-bold text-amber-600">{v.reservedQty || 0}</td>
                    <td className="p-4 text-center font-mono font-black text-sm text-emerald-600">{available}</td>
                    <td className="p-4">
                      {isOutOfStock ? (
                        <span className="neo-badge bg-red-500 text-white text-[10px]">HẾT HÀNG</span>
                      ) : isLowStock ? (
                        <span className="neo-badge bg-amber-400 text-black text-[10px]">SẮP HẾT</span>
                      ) : (
                        <span className="neo-badge bg-[#00ff66] text-black text-[10px]">SẴN SÀNG</span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleOpenImport({ name: v.productName, basePrice: v.basePrice }, v)}
                        className="py-1.5 px-3 neo-btn neo-btn-neon text-[11px] inline-flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" /> Nhập Kho
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Import Modal */}
      {showImportModal && selectedVariant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <form onSubmit={handleConfirmImport} className="bg-white border-3 border-black p-8 max-w-md w-full shadow-[10px_10px_0px_#00ff66] space-y-6">
            <h3 className="font-display font-black text-xl uppercase pb-3 border-b-2 border-black">
              PHIẾU NHẬP HÀNG VÀO KHO
            </h3>

            <div className="p-3 bg-neutral-100 border border-black text-xs space-y-1">
              <strong className="block text-black">{selectedVariant.productName}</strong>
              <div className="text-neutral-600 font-mono">
                Biến thể: {selectedVariant.sizeName} - {selectedVariant.colorName} | SKU: {selectedVariant.sku}
              </div>
            </div>

            <div>
              <label className="block text-xs font-display font-bold uppercase mb-1">
                Số lượng nhập thêm *
              </label>
              <input
                type="number"
                required
                min={1}
                value={importQuantity}
                onChange={(e) => setImportQuantity(Number(e.target.value))}
                className="neo-input text-xs font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-display font-bold uppercase mb-1">
                Giá nhập đơn vị (VNĐ) *
              </label>
              <input
                type="number"
                required
                min={0}
                step={10000}
                value={importPrice}
                onChange={(e) => setImportPrice(Number(e.target.value))}
                className="neo-input text-xs font-bold"
              />
            </div>

            <div className="p-3 bg-neutral-50 border border-neutral-300 text-xs flex justify-between font-display font-black">
              <span>Tổng chi phí nhập:</span>
              <span className="text-blue-600">{formatCurrency(importQuantity * importPrice)}</span>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                className="flex-1 py-3 neo-btn neo-btn-neon text-xs tracking-wider"
              >
                Xác Nhận Nhập Kho
              </button>
              <button
                type="button"
                onClick={() => setShowImportModal(false)}
                className="py-3 px-5 neo-btn neo-btn-secondary text-xs"
              >
                Hủy
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

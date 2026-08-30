import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Package, 
  CheckCircle, 
  Truck, 
  Clock, 
  Search, 
  Printer, 
  Filter, 
  Eye, 
  X,
  FileText
} from 'lucide-react';
import { staffApi } from '../../services/api';
import { formatCurrency, formatDate, getOrderStatusInfo, getPaymentStatusInfo } from '../../utils/formatters';
import { useToast } from '../../context/ToastContext';

export const StaffDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrderForBill, setSelectedOrderForBill] = useState(null);

  const { addToast } = useToast();

  const loadOrders = async () => {
    setLoading(true);
    try {
      const res = await staffApi.getOrders();
      if (res.success) {
        setOrders(res.data);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleUpdateStatus = async (orderId, newStatus) => {
    const res = await staffApi.updateOrderStatus(orderId, newStatus);
    if (res.success) {
      addToast(`Đã cập nhật đơn hàng ${orderId} sang "${newStatus}"!`, 'success');
      loadOrders();
    }
  };

  const filteredOrders = orders.filter((o) => {
    if (filterStatus !== 'ALL' && o.orderStatus?.toUpperCase() !== filterStatus) {
      return false;
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchId = o.orderId.toLowerCase().includes(q);
      const matchName = o.customerName?.toLowerCase().includes(q);
      const matchPhone = o.phone?.includes(q);
      return matchId || matchName || matchPhone;
    }
    return true;
  });

  return (
    <div className="space-y-8">
      
      {/* 1. Header Banner */}
      <div className="bg-zinc-950 text-white rounded-3xl p-8 relative overflow-hidden shadow-xl border border-zinc-800">
        <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 font-mono">
          STAFF OPERATIONS // ORDER FULFILLMENT
        </span>
        <h1 className="font-display font-black text-2xl sm:text-3xl text-white mt-1">
          Cổng Xử Lý Đơn Hàng & In Hóa Đơn
        </h1>
        <p className="text-xs text-zinc-400 mt-1">
          Xác nhận đơn, cập nhật tiến độ vận chuyển và xuất phiếu đóng gói.
        </p>
      </div>

      {/* 2. Quick Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-3xl border border-zinc-200/80 p-6 shadow-sm space-y-2">
          <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Chờ Xác Nhận</span>
          <p className="font-display font-black text-3xl text-amber-500">
            {orders.filter(o => o.orderStatus === 'Pending').length} Đơn
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-zinc-200/80 p-6 shadow-sm space-y-2">
          <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Đang Vận Chuyển</span>
          <p className="font-display font-black text-3xl text-purple-600">
            {orders.filter(o => o.orderStatus === 'Shipping').length} Đơn
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-zinc-200/80 p-6 shadow-sm space-y-2">
          <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Đã Hoàn Thành</span>
          <p className="font-display font-black text-3xl text-emerald-600">
            {orders.filter(o => o.orderStatus === 'Delivered').length} Đơn
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-zinc-200/80 p-6 shadow-sm space-y-2">
          <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Tổng Doanh Thu Đơn</span>
          <p className="font-display font-black text-2xl text-zinc-950">
            {formatCurrency(orders.reduce((acc, o) => acc + (o.orderStatus !== 'Cancelled' ? o.totalAmount : 0), 0))}
          </p>
        </div>
      </div>

      {/* 3. Search & Filter Bar */}
      <div className="bg-white rounded-3xl border border-zinc-200 p-4 sm:p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="Tìm theo Mã đơn, Họ tên khách, SĐT..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-50 border border-zinc-200 rounded-xl pl-10 pr-4 py-2.5 text-xs outline-none focus:border-zinc-950"
          />
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
          {['ALL', 'PENDING', 'CONFIRMED', 'SHIPPING', 'DELIVERED', 'CANCELLED'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filterStatus === st 
                  ? 'bg-zinc-950 text-white shadow-xs' 
                  : 'bg-zinc-50 border border-zinc-200 text-zinc-600 hover:bg-zinc-100'
              }`}
            >
              {st === 'ALL' ? 'TẤT CẢ' : st}
            </button>
          ))}
        </div>

      </div>

      {/* 4. Orders Data Table */}
      <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-950 text-white uppercase text-[11px] font-mono tracking-wider">
              <tr>
                <th className="p-4">Mã Đơn</th>
                <th className="p-4">Khách Hàng</th>
                <th className="p-4">Ngày Đặt</th>
                <th className="p-4">Tổng Tiền</th>
                <th className="p-4">Thanh Toán</th>
                <th className="p-4">Trạng Thái</th>
                <th className="p-4 text-right">Thao Tác Xử Lý</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {loading ? (
                <tr>
                  <td colSpan="7" className="p-10 text-center text-zinc-400">Đang tải dữ liệu đơn hàng...</td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-10 text-center text-zinc-400">Không có đơn hàng nào khớp với điều kiện lọc.</td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const statusInfo = getOrderStatusInfo(order.orderStatus);
                  const payInfo = getPaymentStatusInfo(order.paymentStatus || 'Paid');

                  return (
                    <tr key={order.orderId} className="hover:bg-zinc-50/80 transition-colors">
                      <td className="p-4 font-mono font-bold text-zinc-950">{order.orderId}</td>
                      <td className="p-4">
                        <p className="font-bold text-zinc-900">{order.customerName}</p>
                        <p className="text-[11px] text-zinc-400 font-mono">{order.phone || '0901112223'}</p>
                      </td>
                      <td className="p-4 text-zinc-500 font-mono">{formatDate(order.createdAt)}</td>
                      <td className="p-4 font-display font-bold text-zinc-950">{formatCurrency(order.totalAmount)}</td>
                      <td className="p-4">
                        <span className="font-bold block text-zinc-800">{order.paymentMethod}</span>
                        <span className="text-[10px] text-emerald-600 font-bold uppercase">{payInfo.label}</span>
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${statusInfo.color} ${statusInfo.bg}`}>
                          {statusInfo.label}
                        </span>
                      </td>
                      <td className="p-4 text-right space-x-2">
                        {order.orderStatus === 'Pending' && (
                          <button
                            onClick={() => handleUpdateStatus(order.orderId, 'Confirmed')}
                            className="luxury-btn-accent text-[11px] px-3 py-1.5 rounded-xl inline-flex"
                          >
                            Xác Nhận
                          </button>
                        )}
                        {order.orderStatus === 'Confirmed' && (
                          <button
                            onClick={() => handleUpdateStatus(order.orderId, 'Shipping')}
                            className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-[11px] px-3 py-1.5 rounded-xl inline-flex"
                          >
                            Giao Hàng
                          </button>
                        )}
                        {order.orderStatus === 'Shipping' && (
                          <button
                            onClick={() => handleUpdateStatus(order.orderId, 'Delivered')}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] px-3 py-1.5 rounded-xl inline-flex"
                          >
                            Đã Giao
                          </button>
                        )}

                        <button
                          onClick={() => setSelectedOrderForBill(order)}
                          className="luxury-btn-secondary text-[11px] px-3 py-1.5 rounded-xl inline-flex items-center gap-1"
                        >
                          <Printer className="w-3 h-3" />
                          <span>In Bill</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Bill Printing Modal */}
      {selectedOrderForBill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 space-y-6 shadow-2xl relative">
            <button
              onClick={() => setSelectedOrderForBill(null)}
              className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-black rounded-full"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center space-y-1 border-b border-zinc-100 pb-4">
              <h2 className="font-display font-black text-xl text-zinc-950">NOVA APPAREL</h2>
              <p className="text-xs text-zinc-500 font-mono">HÓA ĐƠN BÁN LẺ & PHIẾU XUẤT KHO</p>
              <p className="text-[11px] font-mono text-zinc-400">Mã đơn: #{selectedOrderForBill.orderId}</p>
            </div>

            <div className="space-y-2 text-xs text-zinc-600">
              <p><strong>Khách hàng:</strong> {selectedOrderForBill.customerName}</p>
              <p><strong>Địa chỉ:</strong> {selectedOrderForBill.address || 'Hà Nội'}</p>
              <p><strong>Phương thức:</strong> {selectedOrderForBill.paymentMethod}</p>
            </div>

            <div className="space-y-2 border-t border-b border-zinc-100 py-3 text-xs">
              {selectedOrderForBill.items?.map((it, i) => (
                <div key={i} className="flex justify-between">
                  <span>{it.name} (x{it.quantity})</span>
                  <span className="font-mono font-bold">{formatCurrency(it.unitPrice * it.quantity)}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-baseline pt-1 text-sm font-bold">
              <span>Tổng Tiền:</span>
              <span className="font-display font-black text-xl text-emerald-600">
                {formatCurrency(selectedOrderForBill.totalAmount)}
              </span>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => { window.print(); setSelectedOrderForBill(null); }}
                className="flex-1 luxury-btn-accent text-xs py-3 justify-center"
              >
                <Printer className="w-4 h-4" />
                <span>In Hóa Đơn Ngay</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

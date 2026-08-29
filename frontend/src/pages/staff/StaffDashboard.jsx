import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Truck, 
  CheckCircle2, 
  AlertCircle, 
  Printer, 
  Eye, 
  Warehouse, 
  Search,
  Filter
} from 'lucide-react';
import { staffApi, orderApi } from '../../services/api';
import { formatCurrency, formatDate, getOrderStatusInfo, getPaymentStatusInfo } from '../../utils/formatters';
import { useToast } from '../../context/ToastContext';

export const StaffDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrderForBill, setSelectedOrderForBill] = useState(null);
  const { addToast } = useToast();

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await staffApi.getAllOrders();
      if (res.success) {
        setOrders(res.data);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (orderId, newStatus) => {
    const res = await staffApi.updateStatus(orderId, newStatus);
    if (res.success) {
      addToast(res.message, 'success');
      fetchOrders();
    }
  };

  const filteredOrders = orders.filter((o) => {
    if (selectedStatus !== 'All' && o.orderStatus !== selectedStatus) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        o.orderId.toLowerCase().includes(q) ||
        o.customerName?.toLowerCase().includes(q) ||
        o.customerPhone?.includes(q)
      );
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-neutral-900 to-black text-white p-6 border-3 border-black shadow-[6px_6px_0px_#000] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="font-mono text-xs text-[#00ff66] uppercase tracking-widest block mb-1">
            STAFF OPERATIONS // ORDER FULFILLMENT PORTAL
          </span>
          <h1 className="font-display font-black text-2xl sm:text-4xl uppercase tracking-tight">
            CỔNG XỬ LÝ ĐƠN HÀNG & IN HÓA ĐƠN
          </h1>
        </div>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white border-2 border-black p-4 shadow-[4px_4px_0px_#000]">
          <span className="text-[10px] font-mono font-bold text-neutral-500 uppercase">Chờ xác nhận</span>
          <div className="font-display font-black text-2xl text-amber-600">
            {orders.filter(o => o.orderStatus === 'Pending').length} ĐƠN
          </div>
        </div>
        <div className="bg-white border-2 border-black p-4 shadow-[4px_4px_0px_#000]">
          <span className="text-[10px] font-mono font-bold text-neutral-500 uppercase">Đang vận chuyển</span>
          <div className="font-display font-black text-2xl text-purple-600">
            {orders.filter(o => o.orderStatus === 'Shipping').length} ĐƠN
          </div>
        </div>
        <div className="bg-white border-2 border-black p-4 shadow-[4px_4px_0px_#000]">
          <span className="text-[10px] font-mono font-bold text-neutral-500 uppercase">Đã hoàn thành</span>
          <div className="font-display font-black text-2xl text-emerald-600">
            {orders.filter(o => o.orderStatus === 'Delivered').length} ĐƠN
          </div>
        </div>
        <div className="bg-white border-2 border-black p-4 shadow-[4px_4px_0px_#000]">
          <span className="text-[10px] font-mono font-bold text-neutral-500 uppercase">Tổng doanh thu đơn</span>
          <div className="font-display font-black text-2xl text-[#ff4d00]">
            {formatCurrency(orders.reduce((acc, o) => acc + (o.orderStatus !== 'Cancelled' ? o.totalAmount : 0), 0))}
          </div>
        </div>
      </div>

      {/* Controls: Search & Filter */}
      <div className="bg-white border-2 border-black p-4 shadow-[4px_4px_0px_#000] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Tìm theo Mã đơn, Họ tên khách, SĐT..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="neo-input text-xs pl-9"
          />
          <Search className="w-4 h-4 absolute left-3 top-3.5 text-neutral-400" />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto">
          {['All', 'Pending', 'Confirmed', 'Shipping', 'Delivered', 'Cancelled'].map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-3 py-1.5 font-display font-bold text-xs uppercase border-2 border-black whitespace-nowrap transition-all ${
                selectedStatus === st
                  ? 'bg-black text-[#00ff66] shadow-[2px_2px_0px_#000]'
                  : 'bg-white hover:bg-neutral-100'
              }`}
            >
              {st === 'All' ? 'Tất cả' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white border-2 border-black shadow-[6px_6px_0px_#000] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-black text-white font-display uppercase tracking-wider text-[11px] border-b-2 border-black">
                <th className="p-4">Mã Đơn</th>
                <th className="p-4">Khách Hàng</th>
                <th className="p-4">Ngày Đặt</th>
                <th className="p-4">Tổng Tiền</th>
                <th className="p-4">Thanh Toán</th>
                <th className="p-4">Trạng Thái</th>
                <th className="p-4 text-right">Thao Tác Xử Lý</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {filteredOrders.map((order) => {
                const statusInfo = getOrderStatusInfo(order.orderStatus);
                const paymentInfo = getPaymentStatusInfo(order.paymentStatus);

                return (
                  <tr key={order.orderId} className="hover:bg-neutral-50 transition-colors">
                    <td className="p-4 font-mono font-black">{order.orderId}</td>
                    <td className="p-4">
                      <div className="font-bold text-neutral-900">{order.customerName}</div>
                      <div className="text-[10px] font-mono text-neutral-500">{order.customerPhone}</div>
                    </td>
                    <td className="p-4 font-mono text-neutral-600">{formatDate(order.placedAt)}</td>
                    <td className="p-4 font-display font-black text-neutral-900">
                      {formatCurrency(order.totalAmount)}
                    </td>
                    <td className="p-4">
                      <span className="font-bold uppercase text-neutral-800">{order.paymentMethod}</span>
                      <span className={`block text-[10px] font-bold ${paymentInfo.color} px-1 rounded-xs w-max mt-0.5`}>
                        {paymentInfo.label}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`neo-badge text-[10px] ${statusInfo.color}`}>
                        {statusInfo.label}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-1.5 whitespace-nowrap">
                      {order.orderStatus === 'Pending' && (
                        <button
                          onClick={() => handleUpdateStatus(order.orderId, 'Confirmed')}
                          className="px-2.5 py-1.5 bg-blue-600 text-white font-bold border border-black shadow-[1px_1px_0px_#000] hover:bg-blue-700 text-[11px]"
                        >
                          Xác Nhận
                        </button>
                      )}
                      {order.orderStatus === 'Confirmed' && (
                        <button
                          onClick={() => handleUpdateStatus(order.orderId, 'Shipping')}
                          className="px-2.5 py-1.5 bg-purple-600 text-white font-bold border border-black shadow-[1px_1px_0px_#000] hover:bg-purple-700 text-[11px]"
                        >
                          Giao Shipper
                        </button>
                      )}
                      {order.orderStatus === 'Shipping' && (
                        <button
                          onClick={() => handleUpdateStatus(order.orderId, 'Delivered')}
                          className="px-2.5 py-1.5 bg-emerald-600 text-white font-bold border border-black shadow-[1px_1px_0px_#000] hover:bg-emerald-700 text-[11px]"
                        >
                          Đã Giao
                        </button>
                      )}
                      <button
                        onClick={() => setSelectedOrderForBill(order)}
                        className="px-2.5 py-1.5 bg-white text-black font-bold border border-black shadow-[1px_1px_0px_#000] hover:bg-neutral-100 text-[11px] inline-flex items-center gap-1"
                      >
                        <Printer className="w-3.5 h-3.5" /> In Bill
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Printable Invoice Modal */}
      {selectedOrderForBill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-white border-3 border-black p-8 max-w-2xl w-full shadow-[10px_10px_0px_#000] max-h-[90vh] overflow-y-auto space-y-6">
            
            <div className="flex justify-between items-start border-b-2 border-black pb-4">
              <div>
                <span className="font-display font-black text-2xl tracking-tighter">
                  NOVA<span className="text-[#00ff66]">.</span>SYS
                </span>
                <p className="text-xs text-neutral-500 font-mono">12 Hai Bà Trưng, Hoàn Kiếm, Hà Nội • Hotline: 1900 8888</p>
              </div>
              <div className="text-right">
                <h3 className="font-display font-black text-lg uppercase">PHIẾU GIAO HÀNG / BILL</h3>
                <span className="font-mono text-xs font-bold text-neutral-600">MÃ: #{selectedOrderForBill.orderId}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <strong className="block text-neutral-500">Người nhận:</strong>
                <p className="font-bold text-black">{selectedOrderForBill.customerName} ({selectedOrderForBill.customerPhone})</p>
                <p>{selectedOrderForBill.shippingAddress}</p>
              </div>
              <div>
                <strong className="block text-neutral-500">Ngày đặt:</strong>
                <p className="font-mono">{formatDate(selectedOrderForBill.placedAt)}</p>
                <strong className="block text-neutral-500 mt-1">Phương thức thanh toán:</strong>
                <p className="font-bold uppercase text-blue-600">{selectedOrderForBill.paymentMethod} ({selectedOrderForBill.paymentStatus})</p>
              </div>
            </div>

            <table className="w-full text-left text-xs border-t-2 border-b-2 border-black">
              <thead>
                <tr className="border-b border-neutral-300">
                  <th className="py-2">Sản phẩm</th>
                  <th className="py-2">Biến thể</th>
                  <th className="py-2">SL</th>
                  <th className="py-2 text-right">Đơn giá</th>
                  <th className="py-2 text-right">Thành tiền</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {selectedOrderForBill.items?.map((item, idx) => (
                  <tr key={idx}>
                    <td className="py-2 font-bold">{item.productName || item.name}</td>
                    <td className="py-2 font-mono text-neutral-600">{item.sizeName} - {item.colorName}</td>
                    <td className="py-2 font-mono">{item.quantity}</td>
                    <td className="py-2 text-right font-mono">{formatCurrency(item.unitPrice)}</td>
                    <td className="py-2 text-right font-mono font-bold">{formatCurrency(item.unitPrice * item.quantity)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-between items-center text-sm font-display font-black pt-2">
              <span>TỔNG TIỀN THANH TOÁN:</span>
              <span className="text-xl text-[#ff4d00]">{formatCurrency(selectedOrderForBill.totalAmount)}</span>
            </div>

            <div className="flex gap-3 pt-4 border-t-2 border-black">
              <button
                onClick={() => window.print()}
                className="flex-1 py-3 neo-btn neo-btn-neon text-xs flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4" /> In Phiếu Giao Hàng
              </button>
              <button
                onClick={() => setSelectedOrderForBill(null)}
                className="py-3 px-6 neo-btn neo-btn-secondary text-xs"
              >
                Đóng
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  ShoppingBag, 
  Users, 
  Shield, 
  ArrowUpRight, 
  PieChart, 
  Calendar,
  Sparkles
} from 'lucide-react';
import { adminApi } from '../../services/api';
import { formatCurrency } from '../../utils/formatters';

export const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const res = await adminApi.getStats();
        if (res.success) {
          setStats(res.data);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading || !stats) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center font-display font-bold uppercase text-xs">
        Đang tải báo cáo thống kê quản trị...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-neutral-900 to-black text-white p-6 border-3 border-black shadow-[6px_6px_0px_#7928ca] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="font-mono text-xs text-[#00ff66] uppercase tracking-widest block mb-1">
            EXECUTIVE SUITE // ADMIN ANALYTICS & INSIGHTS
          </span>
          <h1 className="font-display font-black text-2xl sm:text-4xl uppercase tracking-tight">
            BẢNG QUẢN TRỊ TỔNG QUAN
          </h1>
        </div>
        <div className="flex items-center gap-2 font-mono text-xs text-neutral-300">
          <Calendar className="w-4 h-4 text-[#00ff66]" />
          <span>DỮ LIỆU THÁNG 08/2026</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white border-2 border-black p-6 shadow-[5px_5px_0px_#000] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-neutral-500 uppercase">Tổng Doanh Thu</span>
            <div className="w-8 h-8 bg-black text-[#00ff66] flex items-center justify-center border border-black">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="font-display font-black text-2xl sm:text-3xl text-black">
            {formatCurrency(stats.totalRevenue)}
          </div>
          <span className="text-[10px] font-mono text-emerald-600 font-bold block">
            ↑ +18.4% so với tháng trước
          </span>
        </div>

        <div className="bg-white border-2 border-black p-6 shadow-[5px_5px_0px_#000] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-neutral-500 uppercase">Doanh Thu Tháng Này</span>
            <div className="w-8 h-8 bg-[#00ff66] text-black flex items-center justify-center border border-black">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="font-display font-black text-2xl sm:text-3xl text-black">
            {formatCurrency(stats.monthlyRevenue)}
          </div>
          <span className="text-[10px] font-mono text-emerald-600 font-bold block">
            ↑ +24.2% mục tiêu tháng
          </span>
        </div>

        <div className="bg-white border-2 border-black p-6 shadow-[5px_5px_0px_#000] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-neutral-500 uppercase">Tổng Đơn Hàng</span>
            <div className="w-8 h-8 bg-[#ff4d00] text-white flex items-center justify-center border border-black">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="font-display font-black text-2xl sm:text-3xl text-black">
            {stats.totalOrders} ĐƠN
          </div>
          <span className="text-[10px] font-mono text-blue-600 font-bold block">
            Tỉ lệ hoàn thành: 96.8%
          </span>
        </div>

        <div className="bg-white border-2 border-black p-6 shadow-[5px_5px_0px_#000] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-neutral-500 uppercase">Khách Hàng Đăng Ký</span>
            <div className="w-8 h-8 bg-purple-600 text-white flex items-center justify-center border border-black">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="font-display font-black text-2xl sm:text-3xl text-black">
            {stats.totalCustomers}
          </div>
          <span className="text-[10px] font-mono text-purple-600 font-bold block">
            +142 khách hàng tuần này
          </span>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Weekly Revenue Trend (8 Cols) */}
        <div className="lg:col-span-8 bg-white border-2 border-black p-6 shadow-[6px_6px_0px_#000] space-y-6">
          <div className="flex items-center justify-between pb-4 border-b-2 border-black">
            <div>
              <h3 className="font-display font-black text-lg uppercase">
                DOANH THU THEO TUẦN (7 NGÀY GẦN NHẤT)
              </h3>
              <p className="text-xs text-neutral-500 font-mono">ĐƠN VỊ TÍNH: TRIỆU ĐỒNG (VNĐ)</p>
            </div>
            <span className="neo-badge bg-[#00ff66] text-black text-xs">
              LIVE STATS
            </span>
          </div>

          {/* Styled Bar Chart */}
          <div className="space-y-4 pt-2">
            {stats.salesOverTime?.map((item, idx) => {
              const maxRev = 20000000;
              const percent = Math.min(100, (item.revenue / maxRev) * 100);
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs font-mono font-bold">
                    <span>{item.day} ({item.orders} đơn)</span>
                    <span className="font-display text-black">{formatCurrency(item.revenue)}</span>
                  </div>
                  <div className="w-full bg-neutral-100 h-6 border-2 border-black relative overflow-hidden shadow-[2px_2px_0px_#000]">
                    <div
                      className="bg-black h-full transition-all duration-500 flex items-center justify-end pr-2"
                      style={{ width: `${percent}%` }}
                    >
                      {percent > 20 && (
                        <span className="text-[10px] font-mono font-black text-[#00ff66]">
                          {Math.round(percent)}%
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Category Revenue Share (4 Cols) */}
        <div className="lg:col-span-4 bg-white border-2 border-black p-6 shadow-[6px_6px_0px_#000] space-y-6">
          <div className="pb-4 border-b-2 border-black">
            <h3 className="font-display font-black text-lg uppercase">
              TỈ TRỌNG DOANH MỤC
            </h3>
            <p className="text-xs text-neutral-500 font-mono">PHÂN BỔ DOANH SỐ</p>
          </div>

          <div className="space-y-4">
            {stats.categoryShare?.map((cat, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs font-display font-bold">
                  <span className="flex items-center gap-2">
                    <span className="w-3 h-3 border border-black inline-block" style={{ backgroundColor: cat.color }} />
                    {cat.name}
                  </span>
                  <span className="font-mono">{cat.value}%</span>
                </div>
                <div className="w-full bg-neutral-100 h-3 border border-black overflow-hidden">
                  <div
                    className="h-full"
                    style={{ width: `${cat.value}%`, backgroundColor: cat.color }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 bg-neutral-50 border-2 border-black text-xs text-neutral-700 leading-relaxed font-medium">
            💡 <strong>Tops & Tees</strong> và <strong>Outerwear</strong> hiện đang là 2 dòng sản phẩm chủ lực đóng góp hơn 70% tổng doanh thu cửa hàng.
          </div>
        </div>

      </div>

      {/* Top Selling Products Table */}
      <div className="bg-white border-2 border-black shadow-[6px_6px_0px_#000] p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b-2 border-black">
          <h3 className="font-display font-black text-lg uppercase">
            TOP 5 SẢN PHẨM BÁN CHẠY NHẤT
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-black text-white font-display uppercase tracking-wider text-[11px]">
                <th className="p-3">Hạng</th>
                <th className="p-3">Tên Sản Phẩm</th>
                <th className="p-3 text-center">Số Lượng Đã Bán</th>
                <th className="p-3 text-right">Tổng Doanh Thu</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {stats.topProducts?.map((tp, idx) => (
                <tr key={tp.id} className="hover:bg-neutral-50">
                  <td className="p-3 font-display font-black text-sm">#{idx + 1}</td>
                  <td className="p-3 font-bold text-neutral-900">{tp.name}</td>
                  <td className="p-3 text-center font-mono font-black text-blue-600">{tp.sales} SP</td>
                  <td className="p-3 text-right font-display font-black text-sm text-[#ff4d00]">
                    {formatCurrency(tp.revenue)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

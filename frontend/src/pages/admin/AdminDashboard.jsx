import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  DollarSign, 
  ShoppingBag, 
  Users, 
  TrendingUp, 
  ArrowUpRight, 
  Calendar,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { adminApi } from '../../services/api';
import { formatCurrency } from '../../utils/formatters';

export const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      setLoading(true);
      try {
        const res = await adminApi.getStats();
        if (res.success) setStats(res.data);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  if (loading || !stats) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 animate-pulse space-y-8">
        <div className="h-10 w-64 bg-zinc-200 rounded-xl"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(n => <div key={n} className="h-32 bg-zinc-200 rounded-3xl"></div>)}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-purple-600 font-mono">
            ADMIN ANALYTICS // REVENUE & GROWTH
          </span>
          <h1 className="font-display font-black text-3xl sm:text-4xl text-zinc-950 mt-1">
            Báo Cáo Hoạt Động Hệ Thống
          </h1>
        </div>
        <div className="flex items-center gap-2 px-3.5 py-1.5 bg-white border border-zinc-200 rounded-xl text-xs font-mono font-medium shadow-xs">
          <Calendar className="w-3.5 h-3.5 text-zinc-500" />
          <span>Cập nhật thời gian thực 2026</span>
        </div>
      </div>

      {/* 4 Stat Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <motion.div 
          whileHover={{ y: -4 }}
          className="bg-white rounded-3xl border border-zinc-200/80 p-6 shadow-sm space-y-4"
        >
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Tổng Doanh Thu</span>
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-2xl">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div>
            <p className="font-display font-black text-2xl sm:text-3xl text-zinc-950">
              {formatCurrency(stats.totalRevenue)}
            </p>
            <p className="text-xs text-emerald-600 font-semibold mt-1 flex items-center gap-1">
              <ArrowUpRight className="w-3.5 h-3.5" /> +24.8% so với cùng kỳ
            </p>
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ y: -4 }}
          className="bg-white rounded-3xl border border-zinc-200/80 p-6 shadow-sm space-y-4"
        >
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Doanh Thu Tháng Này</span>
            <div className="p-2.5 bg-purple-50 text-purple-600 rounded-2xl">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div>
            <p className="font-display font-black text-2xl sm:text-3xl text-zinc-950">
              {formatCurrency(stats.monthlyRevenue)}
            </p>
            <p className="text-xs text-purple-600 font-semibold mt-1 flex items-center gap-1">
              <ArrowUpRight className="w-3.5 h-3.5" /> Vượt 18% KPI đề ra
            </p>
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ y: -4 }}
          className="bg-white rounded-3xl border border-zinc-200/80 p-6 shadow-sm space-y-4"
        >
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Tổng Số Đơn Hàng</span>
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-2xl">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div>
            <p className="font-display font-black text-2xl sm:text-3xl text-zinc-950">
              {stats.totalOrders} đơn
            </p>
            <p className="text-xs text-blue-600 font-semibold mt-1">
              Tỷ lệ hoàn tất giao 97.2%
            </p>
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ y: -4 }}
          className="bg-white rounded-3xl border border-zinc-200/80 p-6 shadow-sm space-y-4"
        >
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Khách Hàng Thành Viên</span>
            <div className="p-2.5 bg-amber-50 text-amber-600 rounded-2xl">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div>
            <p className="font-display font-black text-2xl sm:text-3xl text-zinc-950">
              {stats.activeCustomers} user
            </p>
            <p className="text-xs text-amber-600 font-semibold mt-1">
              +142 khách hàng mới tuần này
            </p>
          </div>
        </motion.div>

      </div>

      {/* Revenue Trend & Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Revenue Bars (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-zinc-200/80 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex justify-between items-center border-b border-zinc-100 pb-4">
            <h3 className="font-display font-bold text-lg text-zinc-950">Biểu Đồ Doanh Thu 6 Tháng</h3>
            <span className="text-xs font-mono text-zinc-400">Đơn vị: VNĐ</span>
          </div>

          <div className="space-y-4 pt-2">
            {stats.revenueTrend?.map((item) => {
              const maxRev = 100000000;
              const percent = Math.min(100, (item.revenue / maxRev) * 100);
              return (
                <div key={item.month} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-zinc-600 font-mono">{item.month} (Tháng {item.month.replace('T', '')})</span>
                    <span className="font-display font-bold text-zinc-950">{formatCurrency(item.revenue)}</span>
                  </div>
                  <div className="w-full h-3 bg-zinc-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-purple-500 to-emerald-400 rounded-full transition-all duration-700"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Selling Products (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-zinc-200/80 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex justify-between items-center border-b border-zinc-100 pb-4">
            <h3 className="font-display font-bold text-lg text-zinc-950">Top Sản Phẩm Doanh Thu Cao</h3>
            <span className="text-xs font-mono text-emerald-600 font-bold">BEST SELLERS</span>
          </div>

          <div className="space-y-4">
            {stats.topProducts?.map((tp, idx) => (
              <div key={idx} className="flex items-center justify-between p-3.5 rounded-2xl bg-zinc-50 border border-zinc-100">
                <div className="space-y-0.5">
                  <p className="font-bold text-xs text-zinc-900 line-clamp-1">{tp.name}</p>
                  <p className="text-[11px] text-zinc-500">Đã bán: <strong className="text-zinc-800">{tp.sales} chiếc</strong></p>
                </div>
                <span className="font-display font-black text-sm text-emerald-600">
                  {formatCurrency(tp.revenue)}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};

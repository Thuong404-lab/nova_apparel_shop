import React, { useState, useEffect } from 'react';
import { Users, Shield, Lock, Unlock, Search, CheckCircle2 } from 'lucide-react';
import { adminApi } from '../../services/api';
import { formatCurrency } from '../../utils/formatters';
import { useToast } from '../../context/ToastContext';

export const AdminAccountsPage = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const { addToast } = useToast();

  const fetchAccounts = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getAccounts();
      if (res.success) {
        setAccounts(res.data);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const handleToggleStatus = (accId, currentStatus) => {
    const nextStatus = currentStatus === 'Active' ? 'Locked' : 'Active';
    setAccounts(accounts.map(a => a.id === accId ? { ...a, status: nextStatus } : a));
    addToast(`Đã chuyển trạng thái tài khoản sang ${nextStatus}!`, 'info');
  };

  const filteredAccounts = accounts.filter(a => {
    if (roleFilter !== 'All' && a.role !== roleFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return a.fullName.toLowerCase().includes(q) || a.username.toLowerCase().includes(q) || a.email.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-black text-white p-6 border-3 border-black shadow-[6px_6px_0px_#7928ca] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="font-mono text-xs text-[#00ff66] uppercase tracking-widest block mb-1">
            ADMINISTRATOR // USER & EMPLOYEE ACCOUNTS
          </span>
          <h1 className="font-display font-black text-2xl sm:text-4xl uppercase tracking-tight">
            QUẢN LÝ TÀI KHOẢN & PHÂN QUYỀN
          </h1>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="bg-white border-2 border-black p-4 shadow-[4px_4px_0px_#000] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Tìm theo Tên, Username, Email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="neo-input text-xs pl-9"
          />
          <Search className="w-4 h-4 absolute left-3 top-3.5 text-neutral-400" />
        </div>

        <div className="flex gap-2">
          {['All', 'Admin', 'Staff', 'Customer'].map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`px-3 py-1.5 font-display font-bold text-xs uppercase border-2 border-black ${
                roleFilter === r ? 'bg-black text-[#00ff66]' : 'bg-white hover:bg-neutral-100'
              }`}
            >
              {r === 'All' ? 'Tất cả' : r}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border-2 border-black shadow-[6px_6px_0px_#000] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-black text-white font-display uppercase tracking-wider text-[11px] border-b-2 border-black">
                <th className="p-4">Người Dùng</th>
                <th className="p-4">Username</th>
                <th className="p-4">Email</th>
                <th className="p-4">Vai Trò</th>
                <th className="p-4">Mức Lương / SĐT</th>
                <th className="p-4">Trạng Thái</th>
                <th className="p-4 text-right">Khóa / Mở</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {filteredAccounts.map((acc) => (
                <tr key={acc.id} className="hover:bg-neutral-50 transition-colors">
                  <td className="p-4 flex items-center gap-3">
                    <img src={acc.avatar} alt={acc.fullName} className="w-9 h-9 rounded-full object-cover border border-black" />
                    <span className="font-bold text-black">{acc.fullName}</span>
                  </td>
                  <td className="p-4 font-mono font-bold text-neutral-600">{acc.username}</td>
                  <td className="p-4 font-mono text-neutral-600">{acc.email}</td>
                  <td className="p-4">
                    <span className={`neo-badge text-[10px] ${
                      acc.role === 'Admin' ? 'bg-purple-600 text-white' : acc.role === 'Staff' ? 'bg-blue-600 text-white' : 'bg-neutral-100 text-black'
                    }`}>
                      {acc.role}
                    </span>
                  </td>
                  <td className="p-4 font-mono font-bold">
                    {acc.salary ? formatCurrency(acc.salary) : acc.phone || 'N/A'}
                  </td>
                  <td className="p-4">
                    <span className={`neo-badge text-[10px] ${
                      acc.status === 'Active' ? 'bg-[#00ff66] text-black' : 'bg-red-500 text-white'
                    }`}>
                      {acc.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    {acc.role !== 'Admin' && (
                      <button
                        onClick={() => handleToggleStatus(acc.id, acc.status)}
                        className={`py-1.5 px-3 font-bold border border-black shadow-[1px_1px_0px_#000] text-[11px] inline-flex items-center gap-1 ${
                          acc.status === 'Active' ? 'bg-red-100 text-red-700 hover:bg-red-200' : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                        }`}
                      >
                        {acc.status === 'Active' ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                        {acc.status === 'Active' ? 'Khóa' : 'Mở Khóa'}
                      </button>
                    )}
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

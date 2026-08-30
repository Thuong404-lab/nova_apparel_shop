import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Plus, 
  ShieldCheck, 
  CreditCard, 
  QrCode, 
  History, 
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { walletApi } from '../../services/api';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { useToast } from '../../context/ToastContext';
import confetti from 'canvas-confetti';

export const WalletPage = () => {
  const [wallet, setWallet] = useState(null);
  const [depositAmount, setDepositAmount] = useState(500000);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    async function loadWallet() {
      setLoading(true);
      try {
        const res = await walletApi.get();
        if (res.success) setWallet(res.data);
      } finally {
        setLoading(false);
      }
    }
    loadWallet();
  }, []);

  const handleDeposit = async (e) => {
    e.preventDefault();
    if (depositAmount < 50000) {
      addToast('Số tiền nạp tối thiểu là 50.000₫', 'warning', 'SỐ TIỀN KHÔNG HỢP LỆ');
      return;
    }

    const res = await walletApi.deposit(depositAmount);
    if (res.success) {
      setWallet(res.data);
      addToast(`Nạp thành công ${formatCurrency(depositAmount)} vào Ví Nova Wallet!`, 'success', 'NẠP TIỀN THÀNH CÔNG');
      
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 }
      });
    }
  };

  const quickAmounts = [200000, 500000, 1000000, 2000000];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header */}
      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 font-mono">
          NOVA DIGITAL WALLET
        </span>
        <h1 className="font-display font-black text-3xl sm:text-4xl text-zinc-950 mt-1">
          Ví Điện Tử Của Tôi
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Balance Card & Deposit Form (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Luxury Metallic Balance Card */}
          <div className="bg-zinc-950 text-white rounded-3xl p-8 shadow-2xl relative overflow-hidden space-y-8 border border-zinc-800">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[11px] text-zinc-400 font-mono tracking-widest uppercase block">
                  NOVA EXCLUSIVE VIP PASS
                </span>
                <p className="font-display font-bold text-lg text-white mt-1">Nova Wallet</p>
              </div>
              <div className="p-3 bg-zinc-900 rounded-2xl border border-zinc-800 text-emerald-400">
                <Wallet className="w-6 h-6" />
              </div>
            </div>

            <div>
              <span className="text-xs text-zinc-400 font-mono">Số dư khả dụng</span>
              <p className="font-display font-black text-3xl sm:text-4xl text-emerald-400 tracking-tight mt-1">
                {formatCurrency(wallet?.balance || 0)}
              </p>
            </div>

            <div className="flex justify-between items-center text-xs text-zinc-400 pt-4 border-t border-zinc-900 font-mono">
              <span>TRẠNG THÁI: <strong className="text-emerald-400">ĐANG HOẠT ĐỘNG</strong></span>
              <span>100% BẢO MẬT</span>
            </div>

            {/* Glowing blur orb */}
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-emerald-500/20 rounded-full blur-2xl pointer-events-none"></div>
          </div>

          {/* Quick Deposit Box */}
          <div className="bg-white rounded-3xl border border-zinc-200 p-6 sm:p-8 space-y-6 shadow-sm">
            <h3 className="font-display font-bold text-base text-zinc-950 flex items-center gap-2">
              <Plus className="w-5 h-5 text-emerald-600" />
              <span>Nạp Tiền Vào Ví Tức Thì</span>
            </h3>

            <form onSubmit={handleDeposit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-800">Chọn mệnh giá nhanh</label>
                <div className="grid grid-cols-2 gap-2.5">
                  {quickAmounts.map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setDepositAmount(amt)}
                      className={`py-2.5 px-3 rounded-xl text-xs font-bold font-mono border transition-all cursor-pointer ${
                        depositAmount === amt 
                          ? 'bg-zinc-950 text-white border-zinc-950 shadow-sm' 
                          : 'border-zinc-200 text-zinc-700 hover:border-zinc-400 bg-zinc-50'
                      }`}
                    >
                      +{formatCurrency(amt)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-800">Hoặc nhập số tiền tùy ý (₫)</label>
                <input
                  type="number"
                  min="50000"
                  step="50000"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(Number(e.target.value))}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-xs font-mono font-bold outline-none focus:border-zinc-950"
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full luxury-btn-accent text-xs py-3.5 justify-center shadow-lg shadow-emerald-500/20 cursor-pointer"
              >
                <span>Xác Nhận Nạp {formatCurrency(depositAmount)}</span>
                <ArrowUpRight className="w-4 h-4" />
              </motion.button>
            </form>
          </div>

        </div>

        {/* Right: Transactions History (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-zinc-200 p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
            <h3 className="font-display font-bold text-lg text-zinc-950 flex items-center gap-2">
              <History className="w-5 h-5 text-emerald-600" />
              <span>Lịch Sử Giao Dịch</span>
            </h3>
            <span className="text-xs text-zinc-400 font-mono">
              {wallet?.transactions?.length || 0} giao dịch
            </span>
          </div>

          <div className="space-y-3">
            {wallet?.transactions?.length === 0 ? (
              <p className="text-xs text-zinc-400 text-center py-10">Chưa có giao dịch nào phát sinh.</p>
            ) : (
              wallet?.transactions?.map((tx) => {
                const isDeposit = tx.transactionType === 'Deposit';
                return (
                  <div
                    key={tx.transactionId}
                    className="flex items-center justify-between p-4 rounded-2xl border border-zinc-100 hover:border-zinc-200 bg-zinc-50/50 transition-colors"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className={`p-2.5 rounded-xl ${
                        isDeposit ? 'bg-emerald-100 text-emerald-700' : 'bg-zinc-200 text-zinc-800'
                      }`}>
                        {isDeposit ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                      </div>
                      <div>
                        <p className="font-bold text-xs text-zinc-900 leading-tight">{tx.description}</p>
                        <p className="text-[11px] text-zinc-400 mt-0.5 font-mono">{formatDate(tx.createdAt)}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className={`font-display font-black text-sm ${
                        isDeposit ? 'text-emerald-600' : 'text-zinc-950'
                      }`}>
                        {isDeposit ? '+' : '-'}{formatCurrency(tx.amount)}
                      </span>
                      <span className="block text-[10px] text-emerald-600 font-bold uppercase mt-0.5">
                        {tx.transactionStatus}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>

    </div>
  );
};

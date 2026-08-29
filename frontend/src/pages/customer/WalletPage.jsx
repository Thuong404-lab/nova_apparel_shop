import React, { useState, useEffect } from 'react';
import { Wallet, ArrowDownLeft, ArrowUpRight, Plus, QrCode, ShieldCheck, History } from 'lucide-react';
import { walletApi } from '../../services/api';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { useToast } from '../../context/ToastContext';

export const WalletPage = () => {
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [depositAmount, setDepositAmount] = useState(500000);
  const { addToast } = useToast();

  const fetchWallet = async () => {
    setLoading(true);
    try {
      const res = await walletApi.get();
      if (res.success && res.data) {
        setWallet(res.data);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWallet();
  }, []);

  const handleDeposit = async () => {
    if (depositAmount <= 0) return;
    const res = await walletApi.deposit(depositAmount);
    if (res.success) {
      setWallet(res.data);
      setShowDepositModal(false);
      addToast(`Nạp thành công ${formatCurrency(depositAmount)} vào Ví Nova Wallet!`, 'success', 'NẠP TIỀN THÀNH CÔNG');
      setDepositAmount(500000);
      setShowDepositModal(false);
      fetchWallet();
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Banner */}
      <div className="bg-black text-white p-6 border-3 border-black shadow-[6px_6px_0px_#00ff66] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="font-mono text-xs text-[#00ff66] uppercase tracking-widest block mb-1">
            CUSTOMER PORTAL // WALLET MANAGEMENT
          </span>
          <h1 className="font-display font-black text-2xl sm:text-4xl uppercase tracking-tight">
            VÍ ĐIỆN TỬ NOVA WALLET
          </h1>
        </div>
        <button
          onClick={() => setShowDepositModal(true)}
          className="py-3 px-6 neo-btn neo-btn-neon text-xs flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Nạp Tiền Qua VNPay
        </button>
      </div>

      {/* Balance Card */}
      <div className="bg-gradient-to-br from-neutral-900 to-black text-white border-3 border-black p-8 shadow-[8px_8px_0px_#000] relative overflow-hidden">
        <div className="absolute right-6 top-6 opacity-10">
          <Wallet className="w-48 h-48 text-[#00ff66]" />
        </div>

        <div className="relative z-10 space-y-6">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-neutral-400 tracking-wider">
              MÃ VÍ: {wallet?.walletId || 'WAL001'}
            </span>
            <span className="neo-badge bg-[#00ff66] text-black text-xs">
              ĐANG HOẠT ĐỘNG
            </span>
          </div>

          <div>
            <span className="text-xs font-mono text-neutral-400 block mb-1 uppercase">
              Số dư khả dụng hiện tại:
            </span>
            <div className="font-display font-black text-4xl sm:text-5xl text-white">
              {formatCurrency(wallet?.balance || 0)}
            </div>
          </div>

          <div className="flex flex-wrap gap-4 pt-4 border-t border-neutral-800 text-xs text-neutral-300">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#00ff66]" />
              <span>Bảo hiểm giao dịch 100%</span>
            </div>
            <div className="flex items-center gap-2">
              <QrCode className="w-4 h-4 text-[#00ff66]" />
              <span>Thanh toán 1 chạm không cần nhập lại thẻ</span>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-white border-2 border-black p-6 shadow-[6px_6px_0px_#000] space-y-6">
        <div className="flex items-center justify-between pb-4 border-b-2 border-black">
          <h3 className="font-display font-black text-base uppercase flex items-center gap-2">
            <History className="w-5 h-5" /> LỊCH SỬ GIAO DỊCH VÍ
          </h3>
          <span className="text-xs font-mono text-neutral-500 font-bold">
            {wallet?.transactions?.length || 0} Giao dịch
          </span>
        </div>

        <div className="divide-y divide-neutral-200">
          {wallet?.transactions?.map((tx) => {
            const isDeposit = tx.type === 'Deposit';
            return (
              <div key={tx.transactionId} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 border-2 border-black flex items-center justify-center ${
                    isDeposit ? 'bg-emerald-100 text-emerald-800' : 'bg-purple-100 text-purple-800'
                  }`}>
                    {isDeposit ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-xs">
                      {isDeposit ? 'Nạp tiền vào ví' : 'Thanh toán đơn hàng'}
                    </h4>
                    <p className="text-[11px] text-neutral-500 font-mono mt-0.5">
                      {tx.description} • {formatDate(tx.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className={`font-display font-black text-sm block ${
                    isDeposit ? 'text-emerald-600' : 'text-neutral-900'
                  }`}>
                    {isDeposit ? '+' : '-'}{formatCurrency(tx.amount)}
                  </span>
                  <span className="text-[10px] font-mono font-bold text-neutral-500 uppercase">
                    {tx.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Deposit Modal */}
      {showDepositModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-white border-3 border-black p-8 max-w-md w-full shadow-[10px_10px_0px_#00ff66] space-y-6">
            <h3 className="font-display font-black text-xl uppercase pb-3 border-b-2 border-black">
              NẠP TIỀN VÀO VÍ QUA VNPAY
            </h3>

            <div className="space-y-4">
              <label className="block text-xs font-display font-bold uppercase">
                Chọn số tiền cần nạp:
              </label>
              
              <div className="grid grid-cols-2 gap-2">
                {[100000, 200000, 500000, 1000000, 2000000, 5000000].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setDepositAmount(amt)}
                    className={`py-3 px-2 border-2 border-black font-display font-bold text-xs transition-all ${
                      depositAmount === amt
                        ? 'bg-black text-[#00ff66] shadow-[3px_3px_0px_#000]'
                        : 'bg-white hover:bg-neutral-100 shadow-[1px_1px_0px_#000]'
                    }`}
                  >
                    {formatCurrency(amt)}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <button
                onClick={handleDeposit}
                className="w-full py-3.5 neo-btn neo-btn-neon text-xs tracking-wider"
              >
                Xác Nhận Nạp {formatCurrency(depositAmount)}
              </button>
              <button
                onClick={() => setShowDepositModal(false)}
                className="w-full py-2.5 neo-btn neo-btn-secondary text-xs"
              >
                Hủy Bỏ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

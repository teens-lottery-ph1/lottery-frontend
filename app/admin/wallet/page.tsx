'use client';

import { useState } from 'react';
import { walletData } from '../_components/mock-data';
import StatCard from '../_components/StatCard';
import Badge from '../_components/Badge';
import Avatar from '../_components/Avatar';

// Format currency to Indian format
const formatINR = (value: number) => {
  return value.toLocaleString('en-IN');
};

export default function WalletPage() {
  // API CALL: Backend endpoint to fetch wallet data
  // GET /api/admin/wallet/users
  const [adjustmentOpen, setAdjustmentOpen] = useState(false);
  const [selectedUserWallet, setSelectedUserWallet] =
    useState<(typeof walletData)[0] | null>(null);
  const [adjustmentForm, setAdjustmentForm] = useState({
    amount: '',
    type: 'Add',
    reason: 'Bonus Award',
    note: '',
  });

  const totalBalance = 12000000;
  const avgBalance = 482000;
  const txnToday = 1842;
  const lockedPrizes = 2400000;

  const handleOpenAdjustment = (user: (typeof walletData)[0]) => {
    setSelectedUserWallet(user);
    setAdjustmentOpen(true);
  };

  const handleCloseAdjustment = () => {
    setAdjustmentOpen(false);
    setSelectedUserWallet(null);
    setAdjustmentForm({
      amount: '',
      type: 'Add',
      reason: 'Bonus Award',
      note: '',
    });
  };

  const handleSubmitAdjustment = () => {
    // API CALL: Backend endpoint to apply wallet adjustment
    // POST /api/admin/wallet/adjust with adjustmentForm
    console.log('Adjustment submitted:', {
      userId: selectedUserWallet?.userId,
      ...adjustmentForm,
    });
    handleCloseAdjustment();
  };

  return (
    <div className="space-y-8">
      {/* STAT CARDS */}
      <div className="grid grid-cols-4 gap-6">
        <StatCard
          icon="👛"
          value={`₹${formatINR(totalBalance)}`}
          label="Total Wallet Balance"
          accentColor="#d97706"
        />
        <StatCard
          icon="📊"
          value={`₹${formatINR(avgBalance)}`}
          label="Average Balance"
          accentColor="#1e40af"
        />
        <StatCard
          icon="💫"
          value={txnToday}
          label="Transactions Today"
          accentColor="#16a34a"
        />
        <StatCard
          icon="🔒"
          value={`₹${formatINR(lockedPrizes)}`}
          label="Locked Prizes"
          accentColor="#dc2626"
        />
      </div>

      {/* WALLET TABLE + ADJUSTMENT PANEL */}
      <div className="grid grid-cols-[1fr_350px] gap-6">
        {/* WALLET TABLE */}
        <div className="bg-white border border-[#e5e7eb] rounded-2xl p-6">
          <h3 className="text-[18px] font-bold text-[#111827] mb-6">
            User Wallets
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="border-b border-[#e5e7eb]">
                  <th className="py-3 px-4 text-left text-[11px] font-semibold text-[#6b7280] uppercase tracking-wider">
                    User
                  </th>
                  <th className="py-3 px-4 text-left text-[11px] font-semibold text-[#6b7280] uppercase tracking-wider">
                    Balance
                  </th>
                  <th className="py-3 px-4 text-left text-[11px] font-semibold text-[#6b7280] uppercase tracking-wider">
                    Bonus
                  </th>
                  <th className="py-3 px-4 text-left text-[11px] font-semibold text-[#6b7280] uppercase tracking-wider">
                    Locked
                  </th>
                  <th className="py-3 px-4 text-left text-[11px] font-semibold text-[#6b7280] uppercase tracking-wider">
                    Last Txn
                  </th>
                  <th className="py-3 px-4 text-left text-[11px] font-semibold text-[#6b7280] uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {walletData.map((user) => (
                  <tr
                    key={user.userId}
                    className="border-b border-[#f3f4f6] hover:bg-[#f9fafb]"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Avatar name={user.userName} size="sm" />
                        <p className="text-[#111827] font-semibold">
                          {user.userName}
                        </p>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-semibold text-[#00d68f]">
                      ₹{formatINR(user.balance)}
                    </td>
                    <td className="py-3 px-4 font-semibold text-[#f5c518]">
                      ₹{formatINR(user.bonus)}
                    </td>
                    <td className="py-3 px-4 text-[#ff4d6d]">
                      ₹{formatINR(user.locked)}
                    </td>
                    <td className="py-3 px-4 text-[#4b5563]">
                      {user.lastTxn}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleOpenAdjustment(user)}
                          className="bg-[rgba(0,214,143,0.12)] text-[#00d68f] border border-[rgba(0,214,143,0.2)] px-2 py-1 rounded-lg hover:bg-[rgba(0,214,143,0.2)] text-[11px] font-semibold transition-colors"
                        >
                          ➕
                        </button>
                        <button
                          onClick={() => handleOpenAdjustment(user)}
                          className="bg-[rgba(255,77,109,0.12)] text-[#ff4d6d] border border-[rgba(255,77,109,0.2)] px-2 py-1 rounded-lg hover:bg-[rgba(255,77,109,0.2)] text-[11px] font-semibold transition-colors"
                        >
                          ➖
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* MANUAL ADJUSTMENT PANEL */}
        {adjustmentOpen && selectedUserWallet && (
          <div className="bg-white border border-[#e5e7eb] rounded-2xl p-6 h-fit sticky top-20">
            <h3 className="text-[16px] font-bold text-[#111827] mb-4">
              Manual Adjustment
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-[12px] font-semibold text-[#4b5563] mb-2">
                  User
                </label>
                <p className="bg-[#f3f4f6] rounded-lg px-3 py-2 text-[#111827]">
                  {selectedUserWallet.userName}
                </p>
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-[#4b5563] mb-2">
                  Amount
                </label>
                <input
                  type="number"
                  value={adjustmentForm.amount}
                  onChange={(e) =>
                    setAdjustmentForm((prev) => ({
                      ...prev,
                      amount: e.target.value,
                    }))
                  }
                  placeholder="0"
                  className="w-full bg-[#f9fafb] border border-[#e5e7eb] rounded-lg px-3 py-2 text-[#111827] text-[13px] outline-none focus:border-[#d97706] transition-colors placeholder:text-[#6b7280]"
                />
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-[#4b5563] mb-2">
                  Type
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      setAdjustmentForm((prev) => ({
                        ...prev,
                        type: 'Add',
                      }))
                    }
                    className={`flex-1 py-2 rounded-lg text-[12px] font-semibold transition-colors ${
                      adjustmentForm.type === 'Add'
                        ? 'bg-[#f5c518] text-black'
                        : 'bg-[#f9fafb] border border-[#e5e7eb] text-[#4b5563]'
                    }`}
                  >
                    Add Funds
                  </button>
                  <button
                    onClick={() =>
                      setAdjustmentForm((prev) => ({
                        ...prev,
                        type: 'Deduct',
                      }))
                    }
                    className={`flex-1 py-2 rounded-lg text-[12px] font-semibold transition-colors ${
                      adjustmentForm.type === 'Deduct'
                        ? 'bg-[#f5c518] text-black'
                        : 'bg-[#f9fafb] border border-[#e5e7eb] text-[#4b5563]'
                    }`}
                  >
                    Deduct
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-[#4b5563] mb-2">
                  Reason
                </label>
                <select
                  value={adjustmentForm.reason}
                  onChange={(e) =>
                    setAdjustmentForm((prev) => ({
                      ...prev,
                      reason: e.target.value,
                    }))
                  }
                  className="w-full bg-[#f9fafb] border border-[#e5e7eb] rounded-lg px-3 py-2 text-[#4b5563] text-[13px] outline-none focus:border-[#d97706] transition-colors"
                >
                  <option>Bonus Award</option>
                  <option>Contest Winner</option>
                  <option>Refund</option>
                  <option>Correction</option>
                  <option>Penalty</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-[#4b5563] mb-2">
                  Note
                </label>
                <textarea
                  value={adjustmentForm.note}
                  onChange={(e) =>
                    setAdjustmentForm((prev) => ({
                      ...prev,
                      note: e.target.value,
                    }))
                  }
                  placeholder="Admin note..."
                  rows={3}
                  className="w-full bg-[#f9fafb] border border-[#e5e7eb] rounded-lg px-3 py-2 text-[#111827] text-[13px] outline-none focus:border-[#d97706] transition-colors placeholder:text-[#6b7280] resize-none"
                />
              </div>

              <div className="bg-[rgba(255,77,109,0.12)] border border-[rgba(255,77,109,0.2)] rounded-lg p-3 text-[12px] text-[#ff4d6d]">
                ⚠️ This action will be logged in the audit trail
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleSubmitAdjustment}
                  className="flex-1 bg-[#f5c518] text-black font-bold px-3 py-2 rounded-lg hover:bg-[#e6a800] transition-colors text-[13px]"
                >
                  Apply 💰
                </button>
                <button
                  onClick={handleCloseAdjustment}
                  className="flex-1 bg-[#f9fafb] border border-[#e5e7eb] text-[#4b5563] px-3 py-2 rounded-lg hover:border-[rgba(255,255,255,0.15)] transition-colors text-[13px]"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

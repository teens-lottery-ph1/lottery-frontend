'use client';

import { useEffect, useState } from 'react';
import StatCard from '../_components/StatCard';
import Avatar from '../_components/Avatar';

// ✅ BACKEND URL
const BASE_URL = 'http://localhost:10000/api/admin/wallets';

const formatINR = (value: number) => {
  return value.toLocaleString('en-IN');
};

export default function WalletPage() {
  const [walletData, setWalletData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [totalBalance, setTotalBalance] = useState(0);
  const [avgBalance, setAvgBalance] = useState(0);
  const [txnToday, setTxnToday] = useState(0);
  const [lockedPrizes, setLockedPrizes] = useState(0);

  const [adjustmentOpen, setAdjustmentOpen] = useState(false);
  const [selectedUserWallet, setSelectedUserWallet] = useState<any>(null);

  const [adjustmentForm, setAdjustmentForm] = useState({
    amount: '',
    type: 'Add',
    reason: 'Bonus Award',
    note: '',
  });

  // ✅ FETCH DATA
  useEffect(() => {
    fetchWalletData();
  }, []);

  const fetchWalletData = async () => {
    try {
      const res = await fetch(BASE_URL);

      if (!res.ok) throw new Error('Failed to fetch wallets');

      const data = await res.json();

      console.log('API DATA:', data);

      // ✅ TABLE DATA
      setWalletData(data.wallets || []);

      // ✅ STATS
      setTotalBalance(data.totalBalance || 0);
      setAvgBalance(data.averageBalance || 0);
      setTxnToday(data.transactionsToday || 0);
      setLockedPrizes(data.lockedPrizes || 0);
    } catch (err: any) {
      console.error('Fetch Error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ OPEN PANEL
  const handleOpenAdjustment = (user: any) => {
    setSelectedUserWallet(user);
    setAdjustmentOpen(true);
  };

  const handleCloseAdjustment = () => {
    setAdjustmentOpen(false);
    setSelectedUserWallet(null);
  };

  // ✅ SUBMIT (API READY)
  const handleSubmitAdjustment = () => {
    console.log('Adjustment:', {
      userId: selectedUserWallet?.id,
      ...adjustmentForm,
    });

    handleCloseAdjustment();
  };

  return (
    <div className="space-y-8">
      {/* ✅ STAT CARDS */}
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

      {/* ✅ TABLE + PANEL */}
      <div className="grid grid-cols-[1fr_350px] gap-6">
        {/* ✅ TABLE */}
        <div className="bg-white border rounded-2xl p-6">
          <h3 className="text-[18px] font-bold mb-6">
            User Wallets
          </h3>

          {loading ? (
            <p>Loading...</p>
          ) : (
            <table className="w-full text-[13px]">
              <thead>
                <tr className="border-b">
                  <th>User</th>
                  <th>Balance</th>
                  <th>Bonus</th>
                  <th>Locked</th>
                  <th>Last Txn</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {walletData.map((user) => (
                  <tr key={user.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 flex items-center gap-2">
                      <Avatar name={user.userName || 'User'} size="sm" />
                      {user.userName}
                    </td>

                    <td className="text-green-600 font-semibold">
                      ₹{formatINR(Number(user.balance || 0))}
                    </td>

                    <td className="text-yellow-500 font-semibold">
                      ₹{formatINR(Number(user.bonus || 0))}
                    </td>

                    <td className="text-red-500">
                      ₹{formatINR(Number(user.locked || 0))}
                    </td>

                    <td>
                      {user.lastTxn || '—'}
                    </td>

                    <td>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleOpenAdjustment(user)}
                          className="bg-green-100 text-green-600 px-2 py-1 rounded"
                        >
                          ➕
                        </button>
                        <button
                          onClick={() => handleOpenAdjustment(user)}
                          className="bg-red-100 text-red-600 px-2 py-1 rounded"
                        >
                          ➖
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* ✅ ADJUSTMENT PANEL */}
        {adjustmentOpen && selectedUserWallet && (
          <div className="bg-white border rounded-2xl p-6">
            <h3 className="font-bold mb-4">Manual Adjustment</h3>

            <div className="space-y-4">
              <p className="bg-gray-100 p-2 rounded">
                {selectedUserWallet.userName}
              </p>

              <input
                type="number"
                placeholder="Amount"
                value={adjustmentForm.amount}
                onChange={(e) =>
                  setAdjustmentForm({
                    ...adjustmentForm,
                    amount: e.target.value,
                  })
                }
                className="w-full border p-2 rounded"
              />

              <div className="flex gap-2">
                <button
                  onClick={() =>
                    setAdjustmentForm({ ...adjustmentForm, type: 'Add' })
                  }
                  className="flex-1 bg-yellow-400 p-2 rounded"
                >
                  Add
                </button>
                <button
                  onClick={() =>
                    setAdjustmentForm({ ...adjustmentForm, type: 'Deduct' })
                  }
                  className="flex-1 border p-2 rounded"
                >
                  Deduct
                </button>
              </div>

              <select
                value={adjustmentForm.reason}
                onChange={(e) =>
                  setAdjustmentForm({
                    ...adjustmentForm,
                    reason: e.target.value,
                  })
                }
                className="w-full border p-2 rounded"
              >
                <option>Bonus Award</option>
                <option>Refund</option>
                <option>Penalty</option>
              </select>

              <textarea
                placeholder="Note"
                value={adjustmentForm.note}
                onChange={(e) =>
                  setAdjustmentForm({
                    ...adjustmentForm,
                    note: e.target.value,
                  })
                }
                className="w-full border p-2 rounded"
              />

              <div className="flex gap-2">
                <button
                  onClick={handleSubmitAdjustment}
                  className="flex-1 bg-yellow-400 p-2 rounded font-bold"
                >
                  Apply 💰
                </button>

                <button
                  onClick={handleCloseAdjustment}
                  className="flex-1 border p-2 rounded"
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
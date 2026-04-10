'use client';

import { users } from '../_components/mock-data';
import StatCard from '../_components/StatCard';
import Badge from '../_components/Badge';
import Avatar from '../_components/Avatar';

// Format currency to Indian format
const formatINR = (value: number) => {
  return value.toLocaleString('en-IN');
};

const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
  });
};

export default function ReferralPage() {
  // API CALL: Backend endpoint to fetch referral data
  // GET /api/admin/referral/data
  const totalReferrals = 0;
  const rewardsPaid = 0;
  const activeReferrers = 0;
  const conversionRate = 0;

  // Top referrers sorted
  const topReferrers = [...users]
    .sort((a, b) => b.referrals - a.referrals)
    .slice(0, 10);

  return (
    <div className="space-y-8">
      {/* STAT CARDS */}
      <div className="grid grid-cols-4 gap-6">
        <StatCard
          icon="🔗"
          value={totalReferrals}
          label="Total Referrals"
          change="0%"
          changeType="up"
          accentColor="#d97706"
        />
        <StatCard
          icon="💰"
          value={`₹${formatINR(rewardsPaid)}`}
          label="Rewards Paid"
          accentColor="#16a34a"
        />
        <StatCard
          icon="👥"
          value={activeReferrers}
          label="Active Referrers"
          accentColor="#1e40af"
        />
        <StatCard
          icon="📊"
          value={`${conversionRate}%`}
          label="Conversion Rate"
          accentColor="#7c3aed"
        />
      </div>

      {/* TOP REFERRERS LEADERBOARD */}
      <div className="bg-white border border-[#e5e7eb] rounded-2xl p-6">
        <h3 className="text-[18px] font-bold text-[#111827] mb-6">
          Top Referrers Leaderboard
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-[#e5e7eb]">
                <th className="py-3 px-4 text-left text-[11px] font-semibold text-[#6b7280] uppercase tracking-wider">
                  Rank
                </th>
                <th className="py-3 px-4 text-left text-[11px] font-semibold text-[#6b7280] uppercase tracking-wider">
                  User
                </th>
                <th className="py-3 px-4 text-left text-[11px] font-semibold text-[#6b7280] uppercase tracking-wider">
                  Referrals
                </th>
                <th className="py-3 px-4 text-left text-[11px] font-semibold text-[#6b7280] uppercase tracking-wider">
                  Total Earned
                </th>
                <th className="py-3 px-4 text-left text-[11px] font-semibold text-[#6b7280] uppercase tracking-wider">
                  Level
                </th>
                <th className="py-3 px-4 text-left text-[11px] font-semibold text-[#6b7280] uppercase tracking-wider">
                  Joined
                </th>
              </tr>
            </thead>
            <tbody>
              {topReferrers.map((user, idx) => (
                <tr
                  key={user.id}
                  className="border-b border-[#f3f4f6] hover:bg-[#f9fafb]"
                >
                  <td className="py-3 px-4 font-bold text-[#f5c518]">
                    {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : idx + 1}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <Avatar name={user.name} size="sm" />
                      <p className="font-semibold text-[#111827]">
                        {user.name}
                      </p>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <Badge
                      label={user.referrals.toString()}
                      variant="blue"
                    />
                  </td>
                  <td className="py-3 px-4 font-bold text-[#00d68f]">
                    ₹{formatINR(user.referrals * 500)}
                  </td>
                  <td className="py-3 px-4">
                    <Badge
                      label={`${user.levelName} L${user.level}`}
                      variant={
                        user.level >= 8
                          ? 'purple'
                          : user.level >= 6
                            ? 'blue'
                            : 'gold'
                      }
                    />
                  </td>
                  <td className="py-3 px-4 text-[#4b5563]">
                    {formatDate(user.joinedDate)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* REFERRAL PROGRAM CONFIG */}
      <div className="bg-white border border-[#e5e7eb] rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-[18px] font-bold text-[#111827]">
            Program Configuration
          </h3>
          <button className="bg-[#f5c518] text-black font-bold px-4 py-2 rounded-xl hover:bg-[#e6a800] transition-colors text-[13px]">
            Save Changes
          </button>
        </div>

        <div className="space-y-4">
          {[
            {
              label: 'Referrer Reward',
              value: '₹500 per signup',
              icon: '💰',
            },
            {
              label: 'Referee Bonus',
              value: '₹200 on first ticket',
              icon: '🎁',
            },
            {
              label: 'Level Multiplier',
              value: '1.5× for Gold+ members',
              icon: '📈',
            },
            {
              label: 'Max Referrals',
              value: 'Unlimited',
              icon: '∞',
            },
            {
              label: 'Reward Expiry',
              value: '30 days after signup',
              icon: '⏰',
            },
            {
              label: 'Minimum Payout',
              value: '₹500',
              icon: '💵',
            },
          ].map((setting, idx) => (
            <div
              key={idx}
              className="bg-[#f3f4f6] rounded-lg p-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <span className="text-[18px]">{setting.icon}</span>
                <div>
                  <p className="text-[13px] font-semibold text-[#111827]">
                    {setting.label}
                  </p>
                  <p className="text-[12px] text-[#4b5563]">{setting.value}</p>
                </div>
              </div>
              <button className="text-[#4b5563] hover:text-[#f5c518] text-[13px] font-medium transition-colors">
                ✎ Edit
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* REFERRAL CHAIN VISUALIZATION */}
      <div className="bg-white border border-[#e5e7eb] rounded-2xl p-6">
        <h3 className="text-[18px] font-bold text-[#111827] mb-6">
          Top Referrer Chain — Deepak Mehta
        </h3>

        <div className="space-y-6">
          {/* Level 0 - Root */}
          <div className="flex flex-col items-center">
            <div className="bg-[rgba(245,197,24,0.12)] border border-[rgba(245,197,24,0.2)] rounded-lg px-6 py-4 text-center">
              <div className="flex items-center justify-center gap-2">
                <Avatar name="Deepak Mehta" size="sm" />
                <div>
                  <p className="font-bold text-[#111827]">Deepak Mehta</p>
                  <Badge label="28 referrals" variant="gold" />
                </div>
              </div>
            </div>
            <div className="w-1 h-8 bg-[rgba(255,255,255,0.1)]"></div>
          </div>

          {/* Level 1 - Direct Referrals */}
          <div className="flex justify-center gap-8">
            {[
              { name: 'Ravi Kumar', referrals: 8 },
              { name: 'Priya Sharma', referrals: 12 },
              { name: 'Amit Singh', referrals: 5 },
            ].map((ref) => (
              <div key={ref.name} className="flex flex-col items-center">
                <div className="w-1 h-8 bg-[rgba(255,255,255,0.1)]"></div>
                <div className="bg-[rgba(61,158,255,0.12)] border border-[rgba(61,158,255,0.2)] rounded-lg px-4 py-3 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <Avatar name={ref.name} size="sm" />
                    <div>
                      <p className="font-bold text-[#3d9eff] text-[12px]">
                        {ref.name}
                      </p>
                      <Badge label={`${ref.referrals} refs`} variant="blue" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Connecting lines */}
          <div className="flex justify-center gap-8 mb-4">
            <div className="w-px h-4 bg-[rgba(255,255,255,0.1)]"></div>
            <div className="w-px h-4 bg-[rgba(255,255,255,0.1)]"></div>
            <div className="w-px h-4 bg-[rgba(255,255,255,0.1)]"></div>
          </div>

          {/* Level 2 - Sub-referrals */}
          <div className="grid grid-cols-3 gap-8">
            {[
              [
                { name: 'Vikram Desai', referrals: 3 },
                { name: 'Neha Gupta', referrals: 2 },
              ],
              [
                { name: 'Rohan Verma', referrals: 4 },
                { name: 'Divya Nair', referrals: 5 },
              ],
              [
                { name: 'Sanjay Iyer', referrals: 2 },
                { name: 'Meera Kapoor', referrals: 1 },
              ],
            ].map((group, groupIdx) => (
              <div key={groupIdx} className="space-y-4">
                {group.map((user) => (
                  <div key={user.name} className="text-center">
                    <div className="w-px h-4 bg-[rgba(255,255,255,0.1)] mx-auto mb-2"></div>
                    <div className="bg-[rgba(0,214,143,0.12)] border border-[rgba(0,214,143,0.2)] rounded-lg px-3 py-2 text-center text-[12px]">
                      <p className="font-bold text-[#00d68f]">
                        {user.name}
                      </p>
                      <p className="text-[11px] text-[#4b5563]">
                        {user.referrals} refs
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

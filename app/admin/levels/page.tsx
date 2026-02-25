'use client';

import { levelConfig, pointsRules, users } from '../_components/mock-data';
import StatCard from '../_components/StatCard';
import Badge from '../_components/Badge';
import Avatar from '../_components/Avatar';

// Format currency to Indian format
const formatINR = (value: number) => {
  return value.toLocaleString('en-IN');
};

export default function LevelsPage() {
  // API CALL: Backend endpoint to fetch levels configuration
  // GET /api/admin/levels/config
  const vipMembers = users.filter((u) => u.level === 10).length;
  const totalRewardsPaid = 820000;
  const avgProgress = 68;

  // Top level users sorted by points
  const topUsers = [...users]
    .sort((a, b) => b.points - a.points)
    .slice(0, 8);

  return (
    <div className="space-y-8">
      {/* STAT CARDS */}
      <div className="grid grid-cols-4 gap-6">
        <StatCard
          icon="🏅"
          value="10"
          label="Total Levels"
          accentColor="#06b6d4"
        />
        <StatCard
          icon="👑"
          value={vipMembers}
          label="VIP Members"
          accentColor="#f5c518"
        />
        <StatCard
          icon="💰"
          value={`₹${formatINR(totalRewardsPaid)}`}
          label="Rewards Paid"
          accentColor="#00d68f"
        />
        <StatCard
          icon="📊"
          value={`${avgProgress}%`}
          label="Avg Level Progress"
          accentColor="#a855f7"
        />
      </div>

      {/* LEVEL CONFIG TABLE */}
      <div className="bg-[#0d1117] border border-[rgba(255,255,255,0.07)] rounded-2xl p-6">
        <h3 className="text-[18px] font-bold text-[#e8edf3] mb-6">
          Level Configuration
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-[rgba(255,255,255,0.07)]">
                <th className="py-3 px-4 text-left text-[11px] font-semibold text-[#4a5568] uppercase tracking-wider">
                  Level
                </th>
                <th className="py-3 px-4 text-left text-[11px] font-semibold text-[#4a5568] uppercase tracking-wider">
                  Name
                </th>
                <th className="py-3 px-4 text-left text-[11px] font-semibold text-[#4a5568] uppercase tracking-wider">
                  Color
                </th>
                <th className="py-3 px-4 text-left text-[11px] font-semibold text-[#4a5568] uppercase tracking-wider">
                  Users
                </th>
                <th className="py-3 px-4 text-left text-[11px] font-semibold text-[#4a5568] uppercase tracking-wider">
                  Points Range
                </th>
                <th className="py-3 px-4 text-left text-[11px] font-semibold text-[#4a5568] uppercase tracking-wider">
                  Perks
                </th>
                <th className="py-3 px-4 text-left text-[11px] font-semibold text-[#4a5568] uppercase tracking-wider">
                  Discount
                </th>
                <th className="py-3 px-4 text-left text-[11px] font-semibold text-[#4a5568] uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {levelConfig.map((level) => (
                <tr
                  key={level.level}
                  className="border-b border-[rgba(255,255,255,0.04)] hover:bg-[rgba(255,255,255,0.03)]"
                >
                  <td className="py-3 px-4">
                    <Badge
                      label={`L${level.level}`}
                      variant={
                        level.level === 10
                          ? 'gold'
                          : level.level >= 8
                            ? 'purple'
                            : level.level >= 6
                              ? 'blue'
                              : 'gray'
                      }
                    />
                  </td>
                  <td className="py-3 px-4 font-semibold text-[#e8edf3]">
                    {level.name}
                  </td>
                  <td className="py-3 px-4">
                    <div
                      className="w-8 h-8 rounded-full border border-[rgba(255,255,255,0.2)]"
                      style={{ backgroundColor: level.color }}
                    ></div>
                  </td>
                  <td className="py-3 px-4 text-[#8b9bb4]">
                    {formatINR(level.users)}
                  </td>
                  <td className="py-3 px-4 text-[#8b9bb4]">
                    {formatINR(level.pointsMin)}-{formatINR(level.pointsMax)}
                  </td>
                  <td className="py-3 px-4 text-[#8b9bb4] text-[12px]">
                    {level.perks
                      .slice(0, 2)
                      .join(', ')}{' '}
                    {level.perks.length > 2 && '+'}
                  </td>
                  <td className="py-3 px-4 font-semibold text-[#00d68f]">
                    {level.discount}%
                  </td>
                  <td className="py-3 px-4">
                    <button className="text-[#8b9bb4] hover:text-[#f5c518] text-[12px] font-medium transition-colors">
                      ✎ Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* POINTS EARNING RULES */}
      <div className="bg-[#0d1117] border border-[rgba(255,255,255,0.07)] rounded-2xl p-6">
        <h3 className="text-[18px] font-bold text-[#e8edf3] mb-6">
          Points Configuration
        </h3>

        <div className="grid grid-cols-2 gap-6">
          {pointsRules.map((rule) => (
            <div
              key={rule.id}
              className="bg-[rgba(255,255,255,0.03)] rounded-xl p-4 border border-[rgba(255,255,255,0.07)] flex items-start justify-between"
            >
              <div>
                <p className="text-[13px] font-semibold text-[#e8edf3]">
                  {rule.action}
                </p>
                <p className="text-[24px] font-bold text-[#f5c518] my-2">
                  {rule.points} pts
                </p>
                <p className="text-[12px] text-[#8b9bb4]">
                  {rule.description}
                </p>
              </div>
              <button className="text-[#8b9bb4] hover:text-[#f5c518] text-[13px] font-medium transition-colors">
                ✎
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* TOP LEVEL USERS LEADERBOARD */}
      <div className="bg-[#0d1117] border border-[rgba(255,255,255,0.07)] rounded-2xl p-6">
        <h3 className="text-[18px] font-bold text-[#e8edf3] mb-6">
          Top Level Users
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-[rgba(255,255,255,0.07)]">
                <th className="py-3 px-4 text-left text-[11px] font-semibold text-[#4a5568] uppercase tracking-wider">
                  Rank
                </th>
                <th className="py-3 px-4 text-left text-[11px] font-semibold text-[#4a5568] uppercase tracking-wider">
                  User
                </th>
                <th className="py-3 px-4 text-left text-[11px] font-semibold text-[#4a5568] uppercase tracking-wider">
                  Level
                </th>
                <th className="py-3 px-4 text-left text-[11px] font-semibold text-[#4a5568] uppercase tracking-wider">
                  Points
                </th>
                <th className="py-3 px-4 text-left text-[11px] font-semibold text-[#4a5568] uppercase tracking-wider">
                  Tickets
                </th>
                <th className="py-3 px-4 text-left text-[11px] font-semibold text-[#4a5568] uppercase tracking-wider">
                  Joined
                </th>
              </tr>
            </thead>
            <tbody>
              {topUsers.map((user, idx) => (
                <tr
                  key={user.id}
                  className="border-b border-[rgba(255,255,255,0.04)] hover:bg-[rgba(255,255,255,0.03)]"
                >
                  <td className="py-3 px-4 font-bold text-[#f5c518]">
                    {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : idx + 1}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <Avatar name={user.name} size="sm" />
                      <p className="font-semibold text-[#e8edf3]">
                        {user.name}
                      </p>
                    </div>
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
                  <td className="py-3 px-4 font-bold text-[#00d68f]">
                    {formatINR(user.points)}
                  </td>
                  <td className="py-3 px-4 text-[#8b9bb4]">
                    {user.tickets}
                  </td>
                  <td className="py-3 px-4 text-[#8b9bb4]">
                    {new Date(user.joinedDate).toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

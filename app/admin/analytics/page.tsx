'use client';

import StatCard from '../_components/StatCard';
import Badge from '../_components/Badge';

// Format currency to Indian format
const formatINR = (value: number) => {
  return value.toLocaleString('en-IN');
};

export default function AnalyticsPage() {
  // API CALL: Backend endpoint to fetch analytics data
  // GET /api/admin/analytics/overview?startDate=&endDate=
  // Description: Fetch analytics data including page views, conversion rate, session metrics, bounce rate
  // Query Params:
  //   - startDate: Start date for analytics (YYYY-MM-DD)
  //   - endDate: End date for analytics (YYYY-MM-DD)
  // Response: { pageViews: number, conversionRate: number, avgSession: number, bounceRate: number }

  const pageViews = 284291;
  const conversionRate = 8.42;
  const avgSession = 5.24;
  const bounceRate = 12.8;

  // Mock 30-day revenue data
  const revenueData = [
    { date: 'Feb 1', revenue: 1200000, entries: 8420 },
    { date: 'Feb 2', revenue: 1350000, entries: 9210 },
    { date: 'Feb 3', revenue: 980000, entries: 6800 },
    { date: 'Feb 4', revenue: 1450000, entries: 9950 },
    { date: 'Feb 5', revenue: 1100000, entries: 7600 },
    { date: 'Feb 6', revenue: 1600000, entries: 11200 },
    { date: 'Feb 7', revenue: 1900000, entries: 13400 },
  ];

  // Mock traffic sources data
  const trafficSources = [
    { source: 'Direct', users: 42891, percentage: 35 },
    { source: 'Organic Search', users: 38120, percentage: 31 },
    { source: 'Referral Links', users: 28450, percentage: 23 },
    { source: 'Social Media', users: 12800, percentage: 11 },
  ];

  // Mock platform breakdown
  const platformData = [
    { platform: 'Mobile', users: 89120, percentage: 62 },
    { platform: 'Desktop', users: 45300, percentage: 31 },
    { platform: 'Tablet', users: 8940, percentage: 7 },
  ];

  // Mock top performing draws
  const topDraws = [
    {
      id: '1',
      name: 'Mega Millions #4821',
      entries: 12450,
      revenue: 1245000,
      winnings: 520000,
    },
    {
      id: '2',
      name: 'Super Jackpot #892',
      entries: 9840,
      revenue: 984000,
      winnings: 420000,
    },
    {
      id: '3',
      name: 'Power Ball #156',
      entries: 7620,
      revenue: 762000,
      winnings: 310000,
    },
    {
      id: '4',
      name: 'Daily Draw #485',
      entries: 5430,
      revenue: 543000,
      winnings: 180000,
    },
  ];

  // Calculate max revenue for chart scaling
  const maxRevenue = Math.max(...revenueData.map((d) => d.revenue));

  return (
    <div className="space-y-8">
      {/* STAT CARDS */}
      <div className="grid grid-cols-4 gap-6">
        <StatCard
          icon="📊"
          value={formatINR(pageViews)}
          label="Page Views"
          accentColor="#1e40af"
        />
        <StatCard
          icon="🎯"
          value={`${conversionRate}%`}
          label="Conversion Rate"
          accentColor="#16a34a"
        />
        <StatCard
          icon="⏱️"
          value={`${avgSession}m`}
          label="Avg Session Duration"
          accentColor="#d97706"
        />
        <StatCard
          icon="📉"
          value={`${bounceRate}%`}
          label="Bounce Rate"
          accentColor="#dc2626"
        />
      </div>

      {/* 30-DAY REVENUE CHART */}
      <div className="bg-white border border-[#e5e7eb] rounded-2xl p-6">
        <h3 className="text-[18px] font-bold text-[#111827] mb-6">
          30-Day Revenue Trend
        </h3>

        <div className="flex items-end justify-between gap-2 h-64">
          {revenueData.map((data, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center gap-2 flex-1"
            >
              <div className="relative h-full w-full flex items-end">
                <div
                  className="w-full bg-[rgba(217,119,6,0.12)] border border-[#d97706] rounded-t-lg hover:bg-[rgba(217,119,6,0.2)] transition-colors"
                  style={{
                    height: `${(data.revenue / maxRevenue) * 100}%`,
                  }}
                >
                  <div className="absolute -top-8 left-0 right-0 text-center">
                    <p className="text-[11px] font-semibold text-[#111827]">
                      ₹{formatINR(data.revenue / 100000)}L
                    </p>
                  </div>
                </div>
              </div>
              <p className="text-[11px] text-[#6b7280] text-center">
                {data.date}
              </p>
              <p className="text-[10px] text-[#4b5563]">
                {formatINR(data.entries)} entries
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* TRAFFIC SOURCES & PLATFORM */}
      <div className="grid grid-cols-2 gap-6">
        {/* TRAFFIC SOURCES */}
        <div className="bg-white border border-[#e5e7eb] rounded-2xl p-6">
          <h3 className="text-[18px] font-bold text-[#111827] mb-6">
            Traffic Sources
          </h3>

          <div className="space-y-4">
            {trafficSources.map((source, idx) => (
              <div key={idx}>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[13px] font-semibold text-[#111827]">
                    {source.source}
                  </p>
                  <Badge label={`${source.percentage}%`} variant="blue" />
                </div>
                <div className="h-2 bg-[#f3f4f6] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#1e40af] rounded-full"
                    style={{ width: `${source.percentage}%` }}
                  ></div>
                </div>
                <p className="text-[11px] text-[#6b7280] mt-1">
                  {formatINR(source.users)} users
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* PLATFORM BREAKDOWN */}
        <div className="bg-white border border-[#e5e7eb] rounded-2xl p-6">
          <h3 className="text-[18px] font-bold text-[#111827] mb-6">
            Platform Breakdown
          </h3>

          <div className="space-y-4">
            {platformData.map((platform, idx) => (
              <div key={idx}>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[13px] font-semibold text-[#111827]">
                    {platform.platform}
                  </p>
                  <Badge
                    label={`${platform.percentage}%`}
                    variant={idx === 0 ? 'green' : idx === 1 ? 'gold' : 'blue'}
                  />
                </div>
                <div className="h-2 bg-[#f3f4f6] rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      idx === 0
                        ? 'bg-[#16a34a]'
                        : idx === 1
                          ? 'bg-[#d97706]'
                          : 'bg-[#1e40af]'
                    }`}
                    style={{ width: `${platform.percentage}%` }}
                  ></div>
                </div>
                <p className="text-[11px] text-[#6b7280] mt-1">
                  {formatINR(platform.users)} users
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* MONTHLY USER GROWTH */}
      <div className="bg-white border border-[#e5e7eb] rounded-2xl p-6">
        <h3 className="text-[18px] font-bold text-[#111827] mb-6">
          Monthly User Growth
        </h3>

        <div className="grid grid-cols-12 gap-2 h-40">
          {[
            { month: 'Jan', users: 42000, growth: 0 },
            { month: 'Feb', users: 58000, growth: 38 },
            { month: 'Mar', users: 72000, growth: 24 },
            { month: 'Apr', users: 89000, growth: 24 },
            { month: 'May', users: 94000, growth: 6 },
            { month: 'Jun', users: 108000, growth: 15 },
            { month: 'Jul', users: 125000, growth: 16 },
            { month: 'Aug', users: 142000, growth: 14 },
            { month: 'Sep', users: 158000, growth: 11 },
            { month: 'Oct', users: 178000, growth: 13 },
            { month: 'Nov', users: 195000, growth: 10 },
            { month: 'Dec', users: 215000, growth: 10 },
          ].map((item, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center justify-end gap-2"
            >
              <div className="relative h-full w-full flex items-end">
                <div
                  className="w-full bg-[rgba(22,163,74,0.12)] border border-[#16a34a] rounded-t-lg hover:bg-[rgba(22,163,74,0.2)] transition-colors"
                  style={{
                    height: `${(item.users / 215000) * 100}%`,
                  }}
                >
                  <div className="absolute -top-6 left-0 right-0">
                    <p className="text-[9px] font-bold text-[#16a34a] text-center whitespace-nowrap">
                      +{item.growth}%
                    </p>
                  </div>
                </div>
              </div>
              <p className="text-[10px] text-[#6b7280] text-center">
                {item.month}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* TOP PERFORMING DRAWS TABLE */}
      <div className="bg-white border border-[#e5e7eb] rounded-2xl p-6">
        <h3 className="text-[18px] font-bold text-[#111827] mb-6">
          Top Performing Draws
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-[#e5e7eb]">
                <th className="py-3 px-4 text-left text-[11px] font-semibold text-[#6b7280] uppercase tracking-wider">
                  Draw Name
                </th>
                <th className="py-3 px-4 text-left text-[11px] font-semibold text-[#6b7280] uppercase tracking-wider">
                  Entries
                </th>
                <th className="py-3 px-4 text-left text-[11px] font-semibold text-[#6b7280] uppercase tracking-wider">
                  Revenue Generated
                </th>
                <th className="py-3 px-4 text-left text-[11px] font-semibold text-[#6b7280] uppercase tracking-wider">
                  Winnings Paid
                </th>
                <th className="py-3 px-4 text-left text-[11px] font-semibold text-[#6b7280] uppercase tracking-wider">
                  Margin
                </th>
              </tr>
            </thead>
            <tbody>
              {topDraws.map((draw) => (
                <tr
                  key={draw.id}
                  className="border-b border-[#f3f4f6] hover:bg-[#f9fafb]"
                >
                  <td className="py-3 px-4 font-semibold text-[#111827]">
                    {draw.name}
                  </td>
                  <td className="py-3 px-4 text-[#4b5563]">
                    {formatINR(draw.entries)}
                  </td>
                  <td className="py-3 px-4 font-bold text-[#16a34a]">
                    ₹{formatINR(draw.revenue)}
                  </td>
                  <td className="py-3 px-4 text-[#dc2626]">
                    ₹{formatINR(draw.winnings)}
                  </td>
                  <td className="py-3 px-4">
                    <Badge
                      label={`${Math.round(((draw.revenue - draw.winnings) / draw.revenue) * 100)}%`}
                      variant="gold"
                    />
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

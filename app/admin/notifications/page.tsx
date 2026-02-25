'use client';

import { useState } from 'react';
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
    hour: '2-digit',
    minute: '2-digit',
  });
};

export default function NotificationsPage() {
  // API CALL: Backend endpoint to fetch notification statistics
  // GET /api/admin/notifications/stats
  // Description: Fetch notification delivery metrics
  // Response: { sentToday: number, deliveryRate: number, openRate: number, clickRate: number }

  // API CALL: Backend endpoint to send notification
  // POST /api/admin/notifications/send
  // Body: { title, message, targetAudience, scheduleTime }
  // Response: { success: boolean, notificationId: string, recipientCount: number }

  const sentToday = 284;
  const deliveryRate = 98.4;
  const openRate = 62.3;
  const clickRate = 28.7;

  const [formData, setFormData] = useState({
    title: '',
    message: '',
    targetAudience: 'All Users',
    scheduleTime: 'Now',
  });

  // Mock notification history
  const notificationHistory = [
    {
      id: '1',
      title: 'New Draw Available',
      message: 'Mega Millions #4822 is now live!',
      sentAt: new Date('2026-02-25 14:30'),
      recipients: 89420,
      delivered: 87950,
      opened: 54824,
      clicked: 15732,
    },
    {
      id: '2',
      title: 'Congratulations!',
      message: 'You won ₹50,000 in Daily Draw #485',
      sentAt: new Date('2026-02-24 20:15'),
      recipients: 2450,
      delivered: 2405,
      opened: 1956,
      clicked: 284,
    },
    {
      id: '3',
      title: 'Limited Time Offer',
      message: 'Get 20% bonus on your next deposit',
      sentAt: new Date('2026-02-23 09:00'),
      recipients: 142300,
      delivered: 140024,
      opened: 87534,
      clicked: 24892,
    },
    {
      id: '4',
      title: 'Referral Reward Earned',
      message: 'Your friend Rahul joined! Earn ₹500',
      sentAt: new Date('2026-02-22 16:45'),
      recipients: 34560,
      delivered: 33895,
      opened: 20934,
      clicked: 8429,
    },
    {
      id: '5',
      title: 'Draw Results Announced',
      message: 'Power Ball #156 results are out',
      sentAt: new Date('2026-02-21 22:00'),
      recipients: 98760,
      delivered: 96834,
      opened: 58102,
      clicked: 12435,
    },
  ];

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSendNotification = () => {
    // API CALL: Submit notification
    // POST /api/admin/notifications/send with formData
    console.log('Send notification:', formData);
    setFormData({
      title: '',
      message: '',
      targetAudience: 'All Users',
      scheduleTime: 'Now',
    });
  };

  return (
    <div className="space-y-8">
      {/* STAT CARDS */}
      <div className="grid grid-cols-4 gap-6">
        <StatCard
          icon="📤"
          value={sentToday}
          label="Sent Today"
          accentColor="#d97706"
        />
        <StatCard
          icon="✅"
          value={`${deliveryRate}%`}
          label="Delivery Rate"
          accentColor="#16a34a"
        />
        <StatCard
          icon="👁"
          value={`${openRate}%`}
          label="Open Rate"
          accentColor="#1e40af"
        />
        <StatCard
          icon="🖱️"
          value={`${clickRate}%`}
          label="Click Rate"
          accentColor="#7c3aed"
        />
      </div>

      {/* SEND NOTIFICATION FORM + PREVIEW */}
      <div className="grid grid-cols-2 gap-6">
        {/* LEFT: SEND FORM */}
        <div className="bg-white border border-[#e5e7eb] rounded-2xl p-8">
          <h3 className="text-[20px] font-bold text-[#111827] mb-6">
            Send Notification
          </h3>

          <div className="space-y-6">
            <div>
              <label className="block text-[12px] font-semibold text-[#4b5563] mb-2">
                Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Notification title..."
                className="w-full bg-[#f9fafb] border border-[#e5e7eb] rounded-xl px-4 py-2.5 text-[#111827] text-[13px] outline-none focus:border-[#d97706] transition-colors placeholder:text-[#6b7280]"
              />
            </div>

            <div>
              <label className="block text-[12px] font-semibold text-[#4b5563] mb-2">
                Message *
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Write your notification message..."
                rows={4}
                className="w-full bg-[#f9fafb] border border-[#e5e7eb] rounded-xl px-4 py-2.5 text-[#111827] text-[13px] outline-none focus:border-[#d97706] transition-colors placeholder:text-[#6b7280] resize-none"
              />
              <p className="text-[11px] text-[#6b7280] mt-1">
                {formData.message.length}/160 characters
              </p>
            </div>

            <div>
              <label className="block text-[12px] font-semibold text-[#4b5563] mb-2">
                Target Audience *
              </label>
              <select
                name="targetAudience"
                value={formData.targetAudience}
                onChange={handleInputChange}
                className="w-full bg-[#f9fafb] border border-[#e5e7eb] rounded-xl px-4 py-2.5 text-[#111827] text-[13px] outline-none focus:border-[#d97706] transition-colors"
              >
                <option>All Users</option>
                <option>Active Players</option>
                <option>VIP Users</option>
                <option>New Users (This Week)</option>
                <option>Inactive (>30 days)</option>
                <option>Custom Segment</option>
              </select>
            </div>

            <div>
              <label className="block text-[12px] font-semibold text-[#4b5563] mb-2">
                Schedule *
              </label>
              <select
                name="scheduleTime"
                value={formData.scheduleTime}
                onChange={handleInputChange}
                className="w-full bg-[#f9fafb] border border-[#e5e7eb] rounded-xl px-4 py-2.5 text-[#111827] text-[13px] outline-none focus:border-[#d97706] transition-colors"
              >
                <option>Now</option>
                <option>In 1 Hour</option>
                <option>In 6 Hours</option>
                <option>Tomorrow at 9 AM</option>
                <option>Schedule Custom</option>
              </select>
            </div>

            <div className="bg-[rgba(217,119,6,0.12)] border border-[rgba(217,119,6,0.2)] rounded-lg p-3 text-[12px] text-[#d97706]">
              💡 Estimated reach: ~{formatINR(Math.floor(Math.random() * 50000 + 50000))} users
            </div>

            <button
              onClick={handleSendNotification}
              disabled={!formData.title || !formData.message}
              className="w-full bg-[#d97706] text-white font-bold px-6 py-3 rounded-xl hover:bg-[#b45309] transition-colors text-[13px] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              📤 Send Notification
            </button>
          </div>
        </div>

        {/* RIGHT: MOBILE PREVIEW */}
        <div className="bg-white border border-[#e5e7eb] rounded-2xl p-8 flex flex-col justify-start">
          <h3 className="text-[20px] font-bold text-[#111827] mb-6">
            Mobile Preview
          </h3>

          {/* Phone Frame */}
          <div className="mx-auto w-full max-w-xs bg-white border-8 border-[#1f2937] rounded-3xl overflow-hidden shadow-lg">
            {/* Phone Header */}
            <div className="bg-[#1f2937] text-white px-4 py-2 text-center text-[11px]">
              9:41
            </div>

            {/* Notification */}
            <div className="bg-[#f9fafb] border-b border-[#e5e7eb] p-4 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#d97706] rounded-full flex items-center justify-center text-white font-bold text-[14px]">
                  L
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-[#6b7280]">
                    Lottery Pro
                  </p>
                  <p className="text-[10px] text-[#9ca3af]">now</p>
                </div>
              </div>

              <div className="bg-white rounded-lg p-3 ml-13">
                <p className="text-[13px] font-bold text-[#111827] mb-1">
                  {formData.title || 'Notification title...'}
                </p>
                <p className="text-[12px] text-[#4b5563] line-clamp-2">
                  {formData.message || 'Your notification message will appear here...'}
                </p>
              </div>
            </div>

            {/* Screen Content */}
            <div className="bg-white p-4 h-96 flex items-center justify-center">
              <p className="text-center text-[#9ca3af] text-[12px]">
                App Content
              </p>
            </div>

            {/* Home Indicator */}
            <div className="bg-[#1f2937] h-6 flex items-center justify-center">
              <div className="w-32 h-1 bg-[#4b5563] rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* NOTIFICATION HISTORY TABLE */}
      <div className="bg-white border border-[#e5e7eb] rounded-2xl p-6">
        <h3 className="text-[18px] font-bold text-[#111827] mb-6">
          Notification History
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-[#e5e7eb]">
                <th className="py-3 px-4 text-left text-[11px] font-semibold text-[#6b7280] uppercase tracking-wider">
                  Title
                </th>
                <th className="py-3 px-4 text-left text-[11px] font-semibold text-[#6b7280] uppercase tracking-wider">
                  Sent At
                </th>
                <th className="py-3 px-4 text-left text-[11px] font-semibold text-[#6b7280] uppercase tracking-wider">
                  Recipients
                </th>
                <th className="py-3 px-4 text-left text-[11px] font-semibold text-[#6b7280] uppercase tracking-wider">
                  Delivered
                </th>
                <th className="py-3 px-4 text-left text-[11px] font-semibold text-[#6b7280] uppercase tracking-wider">
                  Opened
                </th>
                <th className="py-3 px-4 text-left text-[11px] font-semibold text-[#6b7280] uppercase tracking-wider">
                  Clicked
                </th>
                <th className="py-3 px-4 text-left text-[11px] font-semibold text-[#6b7280] uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {notificationHistory.map((notif) => (
                <tr
                  key={notif.id}
                  className="border-b border-[#f3f4f6] hover:bg-[#f9fafb]"
                >
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-semibold text-[#111827]">
                        {notif.title}
                      </p>
                      <p className="text-[11px] text-[#6b7280]">
                        {notif.message}
                      </p>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-[#4b5563]">
                    {formatDate(notif.sentAt)}
                  </td>
                  <td className="py-3 px-4 font-semibold text-[#111827]">
                    {formatINR(notif.recipients)}
                  </td>
                  <td className="py-3 px-4">
                    <Badge
                      label={`${((notif.delivered / notif.recipients) * 100).toFixed(1)}%`}
                      variant="green"
                    />
                  </td>
                  <td className="py-3 px-4">
                    <Badge
                      label={`${((notif.opened / notif.delivered) * 100).toFixed(1)}%`}
                      variant="blue"
                    />
                  </td>
                  <td className="py-3 px-4">
                    <Badge
                      label={`${((notif.clicked / notif.opened) * 100).toFixed(1)}%`}
                      variant="gold"
                    />
                  </td>
                  <td className="py-3 px-4">
                    <button className="text-[#1e40af] hover:text-[#1e3a8a] text-[12px] font-medium">
                      📊 View
                    </button>
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

'use client';

import { useState } from 'react';
import Badge from '../_components/Badge';
import Avatar from '../_components/Avatar';

// Format date
const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export default function SettingsPage() {
  // API CALL: Backend endpoint to fetch settings
  // GET /api/admin/settings
  // Description: Fetch all platform configuration settings
  // Response: { platformConfig: {}, securitySettings: {}, paymentGateways: [] }

  // API CALL: Backend endpoint to update settings
  // POST /api/admin/settings/update
  // Body: { settingKey, settingValue }
  // Response: { success: boolean, message: string }

  const [saveStatus, setSaveStatus] = useState(false);

  // Platform Configuration
  const [platformConfig, setPlatformConfig] = useState({
    platformName: 'Lottery Pro',
    platformUrl: 'www.lotterypro.com',
    supportEmail: 'support@lotterypro.com',
    timezone: 'Asia/Kolkata',
    currency: 'INR',
    maintenanceMode: false,
  });

  // Security Settings
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: true,
    passwordExpiry: 90,
    sessionTimeout: 30,
    ipWhitelisting: false,
  });

  // Payment Gateways
  const paymentGateways = [
    {
      id: '1',
      name: 'Razorpay',
      status: 'Active',
      transactions: 145230,
      lastSync: new Date('2026-02-25 14:30'),
    },
    {
      id: '2',
      name: 'PayU',
      status: 'Active',
      transactions: 89450,
      lastSync: new Date('2026-02-25 14:25'),
    },
    {
      id: '3',
      name: 'Instamojo',
      status: 'Inactive',
      transactions: 34200,
      lastSync: new Date('2026-02-20 10:15'),
    },
  ];

  // Admin Accounts
  const adminAccounts = [
    {
      id: '1',
      name: 'Raj Kumar',
      email: 'raj@lotterypro.com',
      role: 'Super Admin',
      status: 'Active',
      lastLogin: new Date('2026-02-25 09:30'),
      joinedDate: new Date('2025-01-15'),
    },
    {
      id: '2',
      name: 'Priya Singh',
      email: 'priya@lotterypro.com',
      role: 'Admin - KYC',
      status: 'Active',
      lastLogin: new Date('2026-02-24 14:20'),
      joinedDate: new Date('2025-06-20'),
    },
    {
      id: '3',
      name: 'Amit Patel',
      email: 'amit@lotterypro.com',
      role: 'Admin - Payments',
      status: 'Active',
      lastLogin: new Date('2026-02-23 11:15'),
      joinedDate: new Date('2025-08-10'),
    },
    {
      id: '4',
      name: 'Sneha Reddy',
      email: 'sneha@lotterypro.com',
      role: 'Moderator',
      status: 'Inactive',
      lastLogin: new Date('2026-01-15 16:45'),
      joinedDate: new Date('2025-09-05'),
    },
  ];

  // Audit Log
  const auditLog = [
    {
      id: '1',
      action: 'Draw Created',
      admin: 'Raj Kumar',
      details: 'Created Mega Millions #4822 with ₹1Cr prize pool',
      timestamp: new Date('2026-02-25 15:30'),
      ipAddress: '192.168.1.100',
    },
    {
      id: '2',
      action: 'KYC Approved',
      admin: 'Priya Singh',
      details: 'Approved KYC for user ID: user_123456',
      timestamp: new Date('2026-02-25 14:15'),
      ipAddress: '192.168.1.105',
    },
    {
      id: '3',
      action: 'Wallet Adjustment',
      admin: 'Amit Patel',
      details: 'Added ₹5000 bonus to user ID: user_789012',
      timestamp: new Date('2026-02-25 13:45'),
      ipAddress: '192.168.1.110',
    },
    {
      id: '4',
      action: 'Settings Updated',
      admin: 'Raj Kumar',
      details: 'Updated platform timezone to Asia/Kolkata',
      timestamp: new Date('2026-02-25 10:20'),
      ipAddress: '192.168.1.100',
    },
    {
      id: '5',
      action: 'Admin Added',
      admin: 'Raj Kumar',
      details: 'Added new admin user: Sneha Reddy with role Moderator',
      timestamp: new Date('2026-02-24 16:00'),
      ipAddress: '192.168.1.100',
    },
  ];

  const handlePlatformChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setPlatformConfig((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
    setSaveStatus(false);
  };

  const handleSecurityChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setSecuritySettings((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : type === 'number' ? parseInt(value) : value,
    }));
    setSaveStatus(false);
  };

  const handleSaveSettings = () => {
    // API CALL: Save settings
    // POST /api/admin/settings/update
    console.log('Save settings:', { platformConfig, securitySettings });
    setSaveStatus(true);
    setTimeout(() => setSaveStatus(false), 3000);
  };

  return (
    <div className="space-y-8">
      <h1 className="text-[28px] font-bold text-[#111827]">Settings</h1>

      {/* PLATFORM CONFIGURATION */}
      <div className="bg-white border border-[#e5e7eb] rounded-2xl p-8">
        <h3 className="text-[20px] font-bold text-[#111827] mb-6">
          Platform Configuration
        </h3>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-[12px] font-semibold text-[#4b5563] mb-2">
                Platform Name
              </label>
              <input
                type="text"
                name="platformName"
                value={platformConfig.platformName}
                onChange={handlePlatformChange}
                className="w-full bg-[#f9fafb] border border-[#e5e7eb] rounded-xl px-4 py-2.5 text-[#111827] text-[13px] outline-none focus:border-[#d97706] transition-colors"
              />
            </div>
            <div>
              <label className="block text-[12px] font-semibold text-[#4b5563] mb-2">
                Platform URL
              </label>
              <input
                type="text"
                name="platformUrl"
                value={platformConfig.platformUrl}
                onChange={handlePlatformChange}
                className="w-full bg-[#f9fafb] border border-[#e5e7eb] rounded-xl px-4 py-2.5 text-[#111827] text-[13px] outline-none focus:border-[#d97706] transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-[12px] font-semibold text-[#4b5563] mb-2">
              Support Email
            </label>
            <input
              type="email"
              name="supportEmail"
              value={platformConfig.supportEmail}
              onChange={handlePlatformChange}
              className="w-full bg-[#f9fafb] border border-[#e5e7eb] rounded-xl px-4 py-2.5 text-[#111827] text-[13px] outline-none focus:border-[#d97706] transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-[12px] font-semibold text-[#4b5563] mb-2">
                Timezone
              </label>
              <select
                name="timezone"
                value={platformConfig.timezone}
                onChange={handlePlatformChange}
                className="w-full bg-[#f9fafb] border border-[#e5e7eb] rounded-xl px-4 py-2.5 text-[#111827] text-[13px] outline-none focus:border-[#d97706] transition-colors"
              >
                <option>Asia/Kolkata (IST)</option>
                <option>Asia/Singapore</option>
                <option>Asia/Dubai</option>
                <option>UTC</option>
              </select>
            </div>
            <div>
              <label className="block text-[12px] font-semibold text-[#4b5563] mb-2">
                Currency
              </label>
              <select
                name="currency"
                value={platformConfig.currency}
                onChange={handlePlatformChange}
                className="w-full bg-[#f9fafb] border border-[#e5e7eb] rounded-xl px-4 py-2.5 text-[#111827] text-[13px] outline-none focus:border-[#d97706] transition-colors"
              >
                <option>INR</option>
                <option>USD</option>
                <option>EUR</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              name="maintenanceMode"
              checked={platformConfig.maintenanceMode}
              onChange={handlePlatformChange}
              className="cursor-pointer"
            />
            <label className="text-[13px] text-[#4b5563] cursor-pointer">
              Enable Maintenance Mode
            </label>
          </div>
        </div>
      </div>

      {/* SECURITY SETTINGS */}
      <div className="bg-white border border-[#e5e7eb] rounded-2xl p-8">
        <h3 className="text-[20px] font-bold text-[#111827] mb-6">
          Security Settings
        </h3>

        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              name="twoFactorAuth"
              checked={securitySettings.twoFactorAuth}
              onChange={handleSecurityChange}
              className="cursor-pointer"
            />
            <label className="text-[13px] text-[#4b5563] cursor-pointer">
              Require Two-Factor Authentication for Admins
            </label>
          </div>

          <div>
            <label className="block text-[12px] font-semibold text-[#4b5563] mb-2">
              Password Expiry (Days)
            </label>
            <input
              type="number"
              name="passwordExpiry"
              value={securitySettings.passwordExpiry}
              onChange={handleSecurityChange}
              className="w-full bg-[#f9fafb] border border-[#e5e7eb] rounded-xl px-4 py-2.5 text-[#111827] text-[13px] outline-none focus:border-[#d97706] transition-colors"
            />
          </div>

          <div>
            <label className="block text-[12px] font-semibold text-[#4b5563] mb-2">
              Session Timeout (Minutes)
            </label>
            <input
              type="number"
              name="sessionTimeout"
              value={securitySettings.sessionTimeout}
              onChange={handleSecurityChange}
              className="w-full bg-[#f9fafb] border border-[#e5e7eb] rounded-xl px-4 py-2.5 text-[#111827] text-[13px] outline-none focus:border-[#d97706] transition-colors"
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              name="ipWhitelisting"
              checked={securitySettings.ipWhitelisting}
              onChange={handleSecurityChange}
              className="cursor-pointer"
            />
            <label className="text-[13px] text-[#4b5563] cursor-pointer">
              Enable IP Whitelisting
            </label>
          </div>
        </div>
      </div>

      {/* SAVE BUTTON */}
      <div className="flex gap-4">
        <button
          onClick={handleSaveSettings}
          className="bg-[#d97706] text-white font-bold px-6 py-3 rounded-xl hover:bg-[#b45309] transition-colors text-[13px]"
        >
          💾 Save Settings
        </button>
        {saveStatus && (
          <div className="bg-[rgba(22,163,74,0.12)] border border-[rgba(22,163,74,0.2)] rounded-lg px-4 py-3 text-[#16a34a] text-[13px] font-semibold">
            ✅ Settings saved successfully!
          </div>
        )}
      </div>

      {/* PAYMENT GATEWAYS */}
      <div className="bg-white border border-[#e5e7eb] rounded-2xl p-6">
        <h3 className="text-[18px] font-bold text-[#111827] mb-6">
          Payment Gateways
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-[#e5e7eb]">
                <th className="py-3 px-4 text-left text-[11px] font-semibold text-[#6b7280] uppercase tracking-wider">
                  Gateway Name
                </th>
                <th className="py-3 px-4 text-left text-[11px] font-semibold text-[#6b7280] uppercase tracking-wider">
                  Status
                </th>
                <th className="py-3 px-4 text-left text-[11px] font-semibold text-[#6b7280] uppercase tracking-wider">
                  Transactions
                </th>
                <th className="py-3 px-4 text-left text-[11px] font-semibold text-[#6b7280] uppercase tracking-wider">
                  Last Sync
                </th>
                <th className="py-3 px-4 text-left text-[11px] font-semibold text-[#6b7280] uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {paymentGateways.map((gateway) => (
                <tr
                  key={gateway.id}
                  className="border-b border-[#f3f4f6] hover:bg-[#f9fafb]"
                >
                  <td className="py-3 px-4 font-semibold text-[#111827]">
                    {gateway.name}
                  </td>
                  <td className="py-3 px-4">
                    <Badge
                      label={gateway.status}
                      variant={gateway.status === 'Active' ? 'green' : 'gray'}
                    />
                  </td>
                  <td className="py-3 px-4 text-[#4b5563]">
                    {gateway.transactions.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-4 text-[#4b5563]">
                    {formatDate(gateway.lastSync)}
                  </td>
                  <td className="py-3 px-4">
                    <button className="text-[#1e40af] hover:text-[#1e3a8a] text-[12px] font-medium">
                      ⚙️ Configure
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADMIN ACCOUNTS */}
      <div className="bg-white border border-[#e5e7eb] rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-[18px] font-bold text-[#111827]">
            Admin Accounts
          </h3>
          <button className="bg-[#d97706] text-white font-bold px-4 py-2 rounded-xl hover:bg-[#b45309] transition-colors text-[13px]">
            ➕ Add Admin
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-[#e5e7eb]">
                <th className="py-3 px-4 text-left text-[11px] font-semibold text-[#6b7280] uppercase tracking-wider">
                  Admin Name
                </th>
                <th className="py-3 px-4 text-left text-[11px] font-semibold text-[#6b7280] uppercase tracking-wider">
                  Email
                </th>
                <th className="py-3 px-4 text-left text-[11px] font-semibold text-[#6b7280] uppercase tracking-wider">
                  Role
                </th>
                <th className="py-3 px-4 text-left text-[11px] font-semibold text-[#6b7280] uppercase tracking-wider">
                  Status
                </th>
                <th className="py-3 px-4 text-left text-[11px] font-semibold text-[#6b7280] uppercase tracking-wider">
                  Last Login
                </th>
                <th className="py-3 px-4 text-left text-[11px] font-semibold text-[#6b7280] uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {adminAccounts.map((admin) => (
                <tr
                  key={admin.id}
                  className="border-b border-[#f3f4f6] hover:bg-[#f9fafb]"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <Avatar name={admin.name} size="sm" />
                      <p className="font-semibold text-[#111827]">
                        {admin.name}
                      </p>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-[#4b5563]">{admin.email}</td>
                  <td className="py-3 px-4 text-[#4b5563]">{admin.role}</td>
                  <td className="py-3 px-4">
                    <Badge
                      label={admin.status}
                      variant={admin.status === 'Active' ? 'green' : 'gray'}
                    />
                  </td>
                  <td className="py-3 px-4 text-[#4b5563]">
                    {formatDate(admin.lastLogin)}
                  </td>
                  <td className="py-3 px-4">
                    <button className="text-[#dc2626] hover:text-[#991b1b] text-[12px] font-medium">
                      🚫 Revoke
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* AUDIT LOG */}
      <div className="bg-white border border-[#e5e7eb] rounded-2xl p-6">
        <h3 className="text-[18px] font-bold text-[#111827] mb-6">
          Audit Log
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-[#e5e7eb]">
                <th className="py-3 px-4 text-left text-[11px] font-semibold text-[#6b7280] uppercase tracking-wider">
                  Action
                </th>
                <th className="py-3 px-4 text-left text-[11px] font-semibold text-[#6b7280] uppercase tracking-wider">
                  Admin
                </th>
                <th className="py-3 px-4 text-left text-[11px] font-semibold text-[#6b7280] uppercase tracking-wider">
                  Details
                </th>
                <th className="py-3 px-4 text-left text-[11px] font-semibold text-[#6b7280] uppercase tracking-wider">
                  Timestamp
                </th>
                <th className="py-3 px-4 text-left text-[11px] font-semibold text-[#6b7280] uppercase tracking-wider">
                  IP Address
                </th>
              </tr>
            </thead>
            <tbody>
              {auditLog.map((log) => (
                <tr
                  key={log.id}
                  className="border-b border-[#f3f4f6] hover:bg-[#f9fafb]"
                >
                  <td className="py-3 px-4 font-semibold text-[#111827]">
                    {log.action}
                  </td>
                  <td className="py-3 px-4 text-[#4b5563]">{log.admin}</td>
                  <td className="py-3 px-4 text-[#4b5563]">{log.details}</td>
                  <td className="py-3 px-4 text-[#4b5563]">
                    {formatDate(log.timestamp)}
                  </td>
                  <td className="py-3 px-4 text-[#6b7280] font-mono text-[11px]">
                    {log.ipAddress}
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

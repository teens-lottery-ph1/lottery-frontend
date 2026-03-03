'use client';

import { useState } from 'react';
import Link from 'next/link';
import Badge from '../_components/Badge';

// Format currency to Indian format
const formatINR = (value: number) => {
  return value.toLocaleString('en-IN');
};

export default function CreateDrawPage() {
  // API CALL: Backend endpoint to create new draw
  // POST /api/admin/draws/create
  const [formData, setFormData] = useState({
    drawName: '',
    gameType: 'Mega Millions',
    prizePool: 10000000,
    ticketPrice: 100,
    maxEntries: 10000,
    guaranteedPrize: true,
    drawDate: '2026-02-28',
    drawTime: '20:00',
    eligibleLevels: ['All'],
    description: '',
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const input = e.target as HTMLInputElement;
      setFormData((prev) => ({
        ...prev,
        [name]: input.checked,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]:
          name === 'prizePool' || name === 'ticketPrice' || name === 'maxEntries'
            ? parseInt(value) || 0
            : value,
      }));
    }
  };

  const handleLevelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (e.target.checked) {
      if (value === 'All') {
        setFormData((prev) => ({
          ...prev,
          eligibleLevels: ['All'],
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          eligibleLevels: prev.eligibleLevels.includes('All')
            ? [value]
            : [...prev.eligibleLevels, value],
        }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        eligibleLevels: prev.eligibleLevels.filter((l) => l !== value),
      }));
    }
  };

  return (
    <div className="space-y-8">
      <Link
        href="/admin/draws"
        className="text-[#d97706] hover:text-[#e6a800] text-[13px] font-medium inline-flex items-center gap-2"
      >
        ← Back to Draws
      </Link>

      <div className="grid grid-cols-2 gap-8">
        {/* LEFT: FORM */}
        <div className="bg-white border border-[#e5e7eb] rounded-2xl p-8 space-y-6">
          <h2 className="text-[20px] font-bold text-[#111827]">
            Create New Draw
          </h2>

          <div>
            <label className="block text-[12px] font-semibold text-[#4b5563] mb-2">
              Draw Name
            </label>
            <input
              type="text"
              name="drawName"
              value={formData.drawName}
              onChange={handleInputChange}
              placeholder="e.g., Mega Millions #4822"
              className="w-full bg-[#f9fafb] border border-[#e5e7eb] rounded-xl px-4 py-2.5 text-[#111827] text-[13px] outline-none focus:border-[#d97706] transition-colors placeholder:text-[#6b7280]"
            />
          </div>

          <div>
            <label className="block text-[12px] font-semibold text-[#4b5563] mb-2">
              Game Type
            </label>
            <select
              name="gameType"
              value={formData.gameType}
              onChange={handleInputChange}
              className="w-full bg-[#f9fafb] border border-[#e5e7eb] rounded-xl px-4 py-2.5 text-[#111827] text-[13px] outline-none focus:border-[#d97706] transition-colors"
            >
              <option>Mega Millions</option>
              <option>Super Jackpot</option>
              <option>Power Ball</option>
              <option>Daily Draw</option>
              <option>Weekly Special</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[12px] font-semibold text-[#4b5563] mb-2">
                Prize Pool ₹
              </label>
              <input
                type="number"
                name="prizePool"
                value={formData.prizePool}
                onChange={handleInputChange}
                className="w-full bg-[#f9fafb] border border-[#e5e7eb] rounded-xl px-4 py-2.5 text-[#111827] text-[13px] outline-none focus:border-[#d97706] transition-colors"
              />
            </div>
            <div>
              <label className="block text-[12px] font-semibold text-[#4b5563] mb-2">
                Ticket Price ₹
              </label>
              <input
                type="number"
                name="ticketPrice"
                value={formData.ticketPrice}
                onChange={handleInputChange}
                className="w-full bg-[#f9fafb] border border-[#e5e7eb] rounded-xl px-4 py-2.5 text-[#111827] text-[13px] outline-none focus:border-[#d97706] transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-[12px] font-semibold text-[#4b5563] mb-2">
              Max Entries
            </label>
            <input
              type="number"
              name="maxEntries"
              value={formData.maxEntries}
              onChange={handleInputChange}
              className="w-full bg-[#f9fafb] border border-[#e5e7eb] rounded-xl px-4 py-2.5 text-[#111827] text-[13px] outline-none focus:border-[#d97706] transition-colors"
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              name="guaranteedPrize"
              checked={formData.guaranteedPrize}
              onChange={handleInputChange}
              className="cursor-pointer"
            />
            <label className="text-[13px] text-[#4b5563] cursor-pointer">
              Guaranteed Prize Distribution
            </label>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[12px] font-semibold text-[#4b5563] mb-2">
                Draw Date
              </label>
              <input
                type="date"
                name="drawDate"
                value={formData.drawDate}
                onChange={handleInputChange}
                className="w-full bg-[#f9fafb] border border-[#e5e7eb] rounded-xl px-4 py-2.5 text-[#111827] text-[13px] outline-none focus:border-[#d97706] transition-colors"
              />
            </div>
            <div>
              <label className="block text-[12px] font-semibold text-[#4b5563] mb-2">
                Draw Time
              </label>
              <input
                type="time"
                name="drawTime"
                value={formData.drawTime}
                onChange={handleInputChange}
                className="w-full bg-[#f9fafb] border border-[#e5e7eb] rounded-xl px-4 py-2.5 text-[#111827] text-[13px] outline-none focus:border-[#d97706] transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-[12px] font-semibold text-[#4b5563] mb-3">
              Eligible Levels
            </label>
            <div className="space-y-2">
              {['All', 'Gold+', 'Platinum+', 'Diamond+', 'VIP Only'].map(
                (level) => (
                  <div key={level} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      value={level}
                      checked={formData.eligibleLevels.includes(level)}
                      onChange={handleLevelChange}
                      className="cursor-pointer"
                    />
                    <label className="text-[13px] text-[#4b5563] cursor-pointer">
                      {level}
                    </label>
                  </div>
                )
              )}
            </div>
          </div>

          <div>
            <label className="block text-[12px] font-semibold text-[#4b5563] mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter draw description..."
              rows={4}
              className="w-full bg-[#f9fafb] border border-[#e5e7eb] rounded-xl px-4 py-2.5 text-[#111827] text-[13px] outline-none focus:border-[#d97706] transition-colors placeholder:text-[#6b7280] resize-none"
            />
          </div>

          <button
            onClick={() => {
              // API CALL: Submit form data to backend
              // POST /api/admin/draws with formData
              console.log('Create draw:', formData);
            }}
            className="w-full bg-[#f5c518] text-black font-bold px-6 py-3 rounded-xl hover:bg-[#e6a800] transition-colors text-[13px]"
          >
            🎯 Launch Draw
          </button>
        </div>

        {/* RIGHT: LIVE PREVIEW */}
        <div className="bg-white border border-[#e5e7eb] rounded-2xl p-8 flex flex-col justify-start">
          <h2 className="text-[20px] font-bold text-[#111827] mb-6">
            Preview
          </h2>

          <div className="bg-[#f3f4f6] rounded-2xl p-6 border border-[#e5e7eb]">
            <Badge label="UPCOMING" variant="gold" />

            <h3 className="text-[18px] font-bold text-[#111827] my-4">
              {formData.drawName || 'Draw Name'}
            </h3>

            <p className="text-[32px] font-bold text-[#d97706] mb-2">
              ₹{formatINR(formData.prizePool)}
            </p>

            <div className="space-y-2 mb-4 text-[12px] text-[#4b5563]">
              <p>
                💰 Ticket Price: <span className="text-[#d97706]">₹{formatINR(formData.ticketPrice)}</span>
              </p>
              <p>
                📊 Max Entries:{' '}
                <span className="text-[#d97706]">
                  {formatINR(formData.maxEntries)}
                </span>
              </p>
              <p>
                📋 Eligible:{' '}
                <span className="text-[#d97706]">
                  {formData.eligibleLevels.join(', ')}
                </span>
              </p>
            </div>

            <p className="text-[12px] text-[#6b7280] mb-6">
              {formData.description || 'Enter description for preview...'}
            </p>

            <button className="w-full bg-[rgba(217,119,6,0.12)] text-[#d97706] border border-[rgba(217,119,6,0.2)] py-2 rounded-lg text-[13px] font-semibold hover:bg-[rgba(217,119,6,0.2)] transition-colors mb-4">
              🎟️ Buy Ticket
            </button>

            <div className="text-center">
              <p className="text-[12px] text-[#6b7280]">Countdown:</p>
              <p className="text-[24px] font-bold text-[#d97706] font-mono">
                XX:XX:XX
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

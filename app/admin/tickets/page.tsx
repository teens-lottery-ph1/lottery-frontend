'use client';

import { useState, useEffect } from 'react';
import Badge from '../_components/Badge';

interface Ticket {
  id: string;
  userId: string;
  drawId: string;
  ticketNumber: string; // The specific box booked
  pricePaid: string;
  status: string;
  purchasedAt: string;
  transactionRef?: string;
}

export default function TicketsAdminPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch all tickets for the admin view
  const fetchTickets = async () => {
    setIsLoading(true);
    try {
      // Connecting to the backend tickets table to retrieve all booked boxes
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/tickets`);
      if (res.ok) {
        const data = await res.json();
        // Assuming the backend returns an array of tickets
        setTickets(Array.isArray(data) ? data : data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch tickets:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredTickets = tickets.filter(
    (ticket) =>
      ticket.ticketNumber.includes(searchTerm) ||
      ticket.drawId.includes(searchTerm) ||
      ticket.userId.includes(searchTerm)
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Purchased Tickets & Boxes</h1>
        <p className="text-sm text-gray-500 mt-1">
          View all individual boxes booked by users, connected directly to the <code className="bg-gray-100 px-1 rounded">tickets</code> table.
        </p>
      </div>

      {/* Toolbar */}
      <div className="bg-white border border-[#e5e7eb] rounded-2xl p-6 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-2 bg-[#f9fafb] border border-[#e5e7eb] rounded-xl px-4 py-2.5 w-72 focus-within:border-[#d97706] transition-colors">
          <span className="text-[13px]">🔍</span>
          <input
            type="text"
            placeholder="Search by Box, User, or Draw ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent outline-none text-[#111827] text-[13px] w-full placeholder:text-[#9ca3af]"
          />
        </div>
        <div className="text-sm font-bold text-gray-700">
          Total Boxes Booked: <span className="text-[#d97706]">{filteredTickets.length}</span>
        </div>
      </div>

      {/* Tickets Table */}
      <div className="bg-white border border-[#e5e7eb] rounded-2xl p-6 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-[#e5e7eb]">
                <th className="py-3 px-4 text-left text-[11px] font-semibold text-[#4b5563] uppercase tracking-wider">
                  Ticket ID
                </th>
                <th className="py-3 px-4 text-left text-[11px] font-semibold text-[#4b5563] uppercase tracking-wider">
                  Box Number
                </th>
                <th className="py-3 px-4 text-left text-[11px] font-semibold text-[#4b5563] uppercase tracking-wider">
                  User ID
                </th>
                <th className="py-3 px-4 text-left text-[11px] font-semibold text-[#4b5563] uppercase tracking-wider">
                  Price Paid
                </th>
                <th className="py-3 px-4 text-left text-[11px] font-semibold text-[#4b5563] uppercase tracking-wider">
                  Status
                </th>
                <th className="py-3 px-4 text-left text-[11px] font-semibold text-[#4b5563] uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-400">
                    Loading tickets securely from database...
                  </td>
                </tr>
              ) : filteredTickets.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-500">
                    No tickets or boxes found.
                  </td>
                </tr>
              ) : (
                filteredTickets.map((ticket) => (
                  <tr key={ticket.id} className="border-b border-[#f3f4f6] hover:bg-[#f9fafb]">
                    <td className="py-3 px-4 font-mono text-[11px] text-gray-500">
                      {ticket.id.split('-')[0]}...
                    </td>
                    <td className="py-3 px-4">
                      <span className="bg-[#00FFA3]/20 border border-[#00FFA3]/50 text-black font-black w-8 h-8 flex items-center justify-center rounded-lg shadow-sm">
                        {ticket.ticketNumber}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-gray-500">
                      {ticket.userId}
                    </td>
                    <td className="py-3 px-4 font-bold text-[#d97706]">
                      ₹{parseFloat(ticket.pricePaid).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4">
                      {ticket.status === 'active' ? (
                        <Badge label="ACTIVE" variant="green" />
                      ) : (
                        <Badge label={ticket.status.toUpperCase()} variant="gray" />
                      )}
                    </td>
                    <td className="py-3 px-4 text-[#6b7280]">
                      {new Date(ticket.purchasedAt || Date.now()).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

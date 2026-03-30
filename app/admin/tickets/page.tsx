'use client';

import { useState, useEffect } from 'react';
import Badge from '../_components/Badge';

interface Ticket {
  ticketNumber: string;
  pickedNumbers: string;
  pricePaid: string;
  status: string;
  purchasedAt: string;
  userName: string;
}

export default function TicketsAdminPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchTickets = async () => {
    setIsLoading(true);

    try {
      const [ticketsRes, usersRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/tickets`),
        fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users`)
      ]);

      const ticketsJson = await ticketsRes.json();
      const usersJson = await usersRes.json();

      console.log("TICKETS 👉", ticketsJson);
      console.log("USERS 👉", usersJson);

      // ✅ SAFE user map
      const userMap: Record<string, string> = {};
      (usersJson.users || []).forEach((user: any) => {
        userMap[user.id] = user.name;
      });

      // ✅ FIXED mapping (IMPORTANT)
      const formatted: Ticket[] = (ticketsJson.data || []).map((item: any) => ({
        ticketNumber: item.ticket_number || "",
        pickedNumbers: item.picked_numbers || "",
        pricePaid: item.price_paid || "0",
        status: item.status || "inactive",
        purchasedAt: item.purchased_at || new Date().toISOString(),
        userName: userMap[item.user_id] || "Unknown User",
      }));

      console.log("FINAL 👉", formatted);

      setTickets(formatted);

    } catch (error) {
      console.error("Fetch error ❌", error);
      setTickets([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  // ✅ SAFE SEARCH
  const filteredTickets = tickets.filter(
    (ticket) =>
      (ticket.ticketNumber || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (ticket.userName || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Purchased Tickets & Boxes
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          View all tickets with picked numbers and user details.
        </p>
      </div>

      {/* Toolbar */}
      <div className="bg-white border border-[#e5e7eb] rounded-2xl p-6 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-2 bg-[#f9fafb] border border-[#e5e7eb] rounded-xl px-4 py-2.5 w-72 focus-within:border-[#d97706] transition-colors">
          <span className="text-[13px]">🔍</span>
          <input
            type="text"
            placeholder="Search by Ticket or User..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent outline-none text-[#111827] text-[13px] w-full placeholder:text-[#9ca3af]"
          />
        </div>

        <div className="text-sm font-bold text-gray-700">
          Total Tickets:{" "}
          <span className="text-[#d97706]">{filteredTickets.length}</span>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-[#e5e7eb] rounded-2xl p-6 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-[#e5e7eb]">
                <th className="py-3 px-4 text-left text-[11px] font-semibold text-[#4b5563] uppercase">
                  Ticket Number
                </th>
                <th className="py-3 px-4 text-left text-[11px] font-semibold text-[#4b5563] uppercase">
                  Picked Numbers
                </th>
                <th className="py-3 px-4 text-left text-[11px] font-semibold text-[#4b5563] uppercase">
                  User Name
                </th>
                <th className="py-3 px-4 text-left text-[11px] font-semibold text-[#4b5563] uppercase">
                  Price
                </th>
                <th className="py-3 px-4 text-left text-[11px] font-semibold text-[#4b5563] uppercase">
                  Status
                </th>
                <th className="py-3 px-4 text-left text-[11px] font-semibold text-[#4b5563] uppercase">
                  Date
                </th>
              </tr>
            </thead>

            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-400">
                    Loading tickets...
                  </td>
                </tr>
              ) : filteredTickets.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-500">
                    No tickets found.
                  </td>
                </tr>
              ) : (
                filteredTickets.map((ticket, index) => (
                  <tr
                    key={index}
                    className="border-b border-[#f3f4f6] hover:bg-[#f9fafb]"
                  >
                    <td className="py-3 px-4 font-semibold text-gray-700">
                      {ticket.ticketNumber}
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex gap-1 flex-wrap">
                        {ticket.pickedNumbers
                          ? ticket.pickedNumbers.split(',').map((num) => (
                              <span
                                key={num}
                                className="bg-[#00FFA3]/20 border border-[#00FFA3]/50 text-black font-bold px-2 py-1 rounded-md text-xs"
                              >
                                {num}
                              </span>
                            ))
                          : "-"}
                      </div>
                    </td>

                    <td className="py-3 px-4 font-medium text-gray-700">
                      {ticket.userName}
                    </td>

                    <td className="py-3 px-4 font-bold text-[#d97706]">
                      ₹{parseFloat(ticket.pricePaid).toLocaleString("en-IN")}
                    </td>

                    <td className="py-3 px-4">
                      {ticket.status === 'active' ? (
                        <Badge label="ACTIVE" variant="green" />
                      ) : (
                        <Badge label={ticket.status.toUpperCase()} variant="gray" />
                      )}
                    </td>

                    <td className="py-3 px-4 text-[#6b7280]">
                      {new Date(ticket.purchasedAt).toLocaleDateString()}
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
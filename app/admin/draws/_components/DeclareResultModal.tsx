"use client";

import { useState, useEffect } from "react";
import { X, CheckCircle2, Ticket, Search, AlertCircle, Loader2, Trophy } from "lucide-react";

interface DeclareResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  draw: any;
  onSuccess: () => void;
}

export default function DeclareResultModal({ isOpen, onClose, draw, onSuccess }: DeclareResultModalProps) {
  const [tickets, setTickets] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  const API = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    if (isOpen && draw) {
      setSelected([]);
      setSearch("");
      setError("");
      fetchTickets();
    }
  }, [isOpen, draw]);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API}/api/draws/${draw.id}/tickets`, { credentials: "include" });
      const data = await res.json();
      setTickets(data.success ? data.data || [] : []);
    } catch {
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

  const toggle = (num: string) =>
    setSelected((prev) => (prev.includes(num) ? prev.filter((n) => n !== num) : [...prev, num]));

  const handleDeclare = async () => {
    if (selected.length === 0) return;
    setError("");
    try {
      setSubmitting(true);
      const res = await fetch(`${API}/api/draw-results`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ drawId: draw.id, winningTicketNumbers: selected }),
      });
      const data = await res.json();
      if (data.success) {
        onSuccess();
        onClose();
      } else {
        setError(data.error || "Failed to declare result");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen || !draw) return null;

  const filtered = tickets.filter((t) => t.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl flex flex-col max-h-[88vh] overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-7 py-5 border-b border-gray-100 bg-gradient-to-r from-amber-50 to-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 flex items-center justify-center shadow">
              <Trophy className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Declare Result</h2>
              <p className="text-xs text-gray-500">Select winning tickets for <span className="font-semibold text-gray-700">{draw.name}</span></p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Search */}
        <div className="px-6 py-3 border-b border-gray-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search ticket numbers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 rounded-xl text-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-400/30 focus:border-amber-400"
            />
          </div>
        </div>

        {/* Ticket Grid */}
        <div className="flex-grow overflow-y-auto px-6 py-5">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <Loader2 className="w-8 h-8 animate-spin mb-3" />
              <p className="text-sm">Loading sold tickets...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <Ticket className="w-12 h-12 mb-3 opacity-20" />
              <p className="text-sm font-medium">{tickets.length === 0 ? "No tickets sold yet" : "No tickets match your search"}</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {filtered.map((ticketNum) => {
                const isSelected = selected.includes(ticketNum);
                return (
                  <button
                    key={ticketNum}
                    onClick={() => toggle(ticketNum)}
                    className={`relative p-4 rounded-2xl text-left transition-all duration-200 border-2 flex items-center justify-between
                      ${isSelected
                        ? "bg-amber-50 border-amber-500 shadow-md shadow-amber-100"
                        : "bg-white border-gray-200 hover:border-amber-300 hover:shadow-sm"
                      }`}
                  >
                    <span className={`font-mono font-bold text-sm ${isSelected ? "text-amber-700" : "text-gray-600"}`}>
                      {ticketNum}
                    </span>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-amber-500 flex-shrink-0" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="mx-6 mb-2 flex items-center gap-2 p-3 bg-red-50 rounded-xl border border-red-200">
            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
            <p className="text-xs text-red-700">{error}</p>
          </div>
        )}

        {/* Warning */}
        <div className="px-6 pb-2">
          <div className="flex items-start gap-2 p-3 bg-orange-50 rounded-xl border border-orange-100">
            <AlertCircle className="w-4 h-4 text-orange-400 flex-shrink-0 mt-0.5" />
            <p className="text-[11px] text-orange-700 leading-snug">
              <b>This action is permanent.</b> Declaring results will complete the draw, mark winners, credit their wallets, and publish results publicly.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50/60">
          <p className="text-sm text-gray-500">
            <span className="font-bold text-amber-600">{selected.length}</span> ticket{selected.length !== 1 ? "s" : ""} selected
          </p>
          <div className="flex gap-3">
            <button onClick={onClose} className="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-500 hover:bg-white transition-colors border border-gray-200">
              Cancel
            </button>
            <button
              onClick={handleDeclare}
              disabled={selected.length === 0 || submitting}
              className={`px-7 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all
                ${selected.length > 0 && !submitting
                  ? "bg-amber-500 hover:bg-amber-600 text-white shadow-lg shadow-amber-500/25"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
            >
              {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Declaring...</> : "Confirm Winners"}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

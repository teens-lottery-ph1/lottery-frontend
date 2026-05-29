'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  Ticket, 
  Trophy, 
  Gift, 
  Users, 
  Settings2,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRightLeft
} from 'lucide-react';

export interface Transaction {
  id: string;
  txnRef: string;
  amount: string | number;
  type: 'deposit' | 'withdrawal' | 'ticket_purchase' | 'prize_payout' | 'bonus_credit' | 'referral_reward' | 'manual_adjustment';
  status: 'pending' | 'success' | 'failed' | 'refunded';
  note?: string;
  createdAt: string;
}

interface TransactionTableProps {
  transactions: Transaction[];
  currentBalance?: number; // Used to calculate running balance if provided
}

export default function TransactionTable({ transactions, currentBalance = 0 }: TransactionTableProps) {
  
  // Calculate running balances (assuming transactions are sorted newest first)
  const transactionsWithBalance = useMemo(() => {
    let runningBalance = currentBalance;
    
    return [...transactions].map((txn) => {
      const amount = Number(txn.amount);
      const isDebit = ['withdrawal', 'ticket_purchase'].includes(txn.type) || (txn.type === 'manual_adjustment' && amount < 0);
      const isCredit = ['deposit', 'prize_payout', 'bonus_credit', 'referral_reward'].includes(txn.type) || (txn.type === 'manual_adjustment' && amount > 0);
      
      const absAmount = Math.abs(amount);
      
      // The balance at this row (after this transaction)
      const balanceAfterRow = runningBalance;
      
      // Calculate what the balance was *before* this transaction for the next iteration (older transactions)
      if (txn.status === 'success') {
        if (isDebit) {
          runningBalance += absAmount; // Revert debit
        } else if (isCredit) {
          runningBalance -= absAmount; // Revert credit
        }
      }

      return {
        ...txn,
        isDebit,
        isCredit,
        absAmount,
        balanceAfterRow
      };
    });
  }, [transactions, currentBalance]);

  const getTxnIcon = (type: string) => {
    switch (type) {
      case 'deposit': return <ArrowDownLeft className="w-4 h-4 text-emerald-400" />;
      case 'withdrawal': return <ArrowUpRight className="w-4 h-4 text-rose-400" />;
      case 'ticket_purchase': return <Ticket className="w-4 h-4 text-purple-400" />;
      case 'prize_payout': return <Trophy className="w-4 h-4 text-amber-400" />;
      case 'bonus_credit': return <Gift className="w-4 h-4 text-pink-400" />;
      case 'referral_reward': return <Users className="w-4 h-4 text-blue-400" />;
      default: return <Settings2 className="w-4 h-4 text-slate-400" />;
    }
  };

  const formatType = (type: string) => {
    return type.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Success
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Clock className="w-3.5 h-3.5" />
            Pending
          </span>
        );
      case 'failed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <XCircle className="w-3.5 h-3.5" />
            Failed
          </span>
        );
      case 'refunded':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-500/10 text-slate-400 border border-slate-500/20">
            <ArrowRightLeft className="w-3.5 h-3.5" />
            Refunded
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-500/10 text-slate-400">
            {status}
          </span>
        );
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(date);
  };

  return (
    <div className="w-full bg-[hsl(var(--surface))] rounded-2xl border border-[hsl(var(--border))] overflow-hidden shadow-2xl relative z-10">
      {/* Decorative Glow */}
      <div className="absolute top-0 left-1/4 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-[hsl(var(--primary))] to-transparent opacity-50"></div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs uppercase bg-[hsl(var(--background))]/50 text-[hsl(var(--muted-foreground))] border-b border-[hsl(var(--border))]">
            <tr>
              <th scope="col" className="px-6 py-5 font-semibold tracking-wider">Transaction ID</th>
              <th scope="col" className="px-6 py-5 font-semibold tracking-wider">Date & Time</th>
              <th scope="col" className="px-6 py-5 font-semibold tracking-wider">Type</th>
              <th scope="col" className="px-6 py-5 font-semibold tracking-wider">Purpose</th>
              <th scope="col" className="px-6 py-5 font-semibold tracking-wider text-right">Debit (-)</th>
              <th scope="col" className="px-6 py-5 font-semibold tracking-wider text-right">Credit (+)</th>
              <th scope="col" className="px-6 py-5 font-semibold tracking-wider text-right">Balance</th>
              <th scope="col" className="px-6 py-5 font-semibold tracking-wider text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[hsl(var(--border))]/50">
            {transactionsWithBalance.length > 0 ? (
              transactionsWithBalance.map((txn, index) => (
                <motion.tr 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                  key={txn.id} 
                  className="hover:bg-white/[0.02] transition-colors group"
                >
                  {/* Transaction ID */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-mono text-[hsl(var(--foreground))] group-hover:text-[hsl(var(--primary))] transition-colors">
                      {txn.txnRef}
                    </div>
                  </td>
                  
                  {/* Date & Time */}
                  <td className="px-6 py-4 whitespace-nowrap text-[hsl(var(--muted-foreground))]">
                    {formatDate(txn.createdAt)}
                  </td>
                  
                  {/* Type */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-[hsl(var(--background))] border border-[hsl(var(--border))]">
                        {getTxnIcon(txn.type)}
                      </div>
                      <span className="font-medium text-[hsl(var(--foreground))]">
                        {formatType(txn.type)}
                      </span>
                    </div>
                  </td>
                  
                  {/* Purpose (Note) */}
                  <td className="px-6 py-4">
                    <div className="max-w-[200px] truncate text-[hsl(var(--muted-foreground))]" title={txn.note || '-'}>
                      {txn.note || '-'}
                    </div>
                  </td>
                  
                  {/* Debit */}
                  <td className="px-6 py-4 whitespace-nowrap text-right font-mono font-medium">
                    {txn.isDebit ? (
                      <span className="text-rose-400">-₹{txn.absAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                    ) : (
                      <span className="text-[hsl(var(--muted-foreground))]/30">-</span>
                    )}
                  </td>
                  
                  {/* Credit */}
                  <td className="px-6 py-4 whitespace-nowrap text-right font-mono font-medium">
                    {txn.isCredit ? (
                      <span className="text-emerald-400">+₹{txn.absAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                    ) : (
                      <span className="text-[hsl(var(--muted-foreground))]/30">-</span>
                    )}
                  </td>
                  
                  {/* Balance */}
                  <td className="px-6 py-4 whitespace-nowrap text-right font-mono font-medium text-[hsl(var(--foreground))]">
                    ₹{txn.balanceAfterRow.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </td>
                  
                  {/* Status */}
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    {getStatusBadge(txn.status)}
                  </td>
                </motion.tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="px-6 py-12 text-center text-[hsl(var(--muted-foreground))]">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <Settings2 className="w-8 h-8 opacity-20" />
                    <p>No transactions found</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

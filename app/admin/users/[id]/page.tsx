// "use client";

// import { useEffect, useState } from "react";
// import { useParams } from "next/navigation";

// type User = {
//   name: string;
//   email: string;
//   phone: string;
// };

// type Wallet = {
//   balance: number;
//   bonusBalance: number;
// };

// type Transaction = {
//   id: string;
//   amount: number;
//   type: string;
//   status: string;
// };

// export default function UserDetailPage() {
//   const params = useParams();

//   const [user, setUser] = useState<User | null>(null);
//   const [wallet, setWallet] = useState<Wallet | null>(null);
//   const [transactions, setTransactions] = useState<Transaction[]>([]);

//   useEffect(() => {
//     fetch(
//       `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/${params.id}`
//     )
//       .then((res) => res.json())
//       .then((data) => {
//         setUser(data.data.user);
//         setWallet(data.data.wallet);
//         setTransactions(data.data.transactions);
//       });
//   }, []);

//   return (
//     <div className="p-6">

//       {/* Header */}
//       <div className="mb-6">
//         <h1 className="text-2xl font-semibold text-gray-800">
//           User Details
//         </h1>
//         <p className="text-sm text-gray-500">
//           View user profile and wallet information
//         </p>
//       </div>

//       {/* Top Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">

//         {/* User */}
//         <div className="bg-white rounded-2xl border border-gray-200 p-5">
//           <p className="text-sm text-gray-500">
//             User Name
//           </p>

//           <p className="text-lg font-semibold text-gray-800 mt-2">
//             {user?.name || "-"}
//           </p>
//         </div>

//         {/* Balance */}
//         <div className="bg-white rounded-2xl border border-gray-200 p-5">
//           <p className="text-sm text-gray-500">
//             Wallet Balance
//           </p>

//           <p className="text-xl font-semibold text-green-600 mt-2">
//             ₹{wallet?.balance ?? 0}
//           </p>
//         </div>

//         {/* Bonus */}
//         <div className="bg-white rounded-2xl border border-gray-200 p-5">
//           <p className="text-sm text-gray-500">
//             Bonus Balance
//           </p>

//           <p className="text-xl font-semibold text-yellow-600 mt-2">
//             ₹{wallet?.bonusBalance ?? 0}
//           </p>
//         </div>

//       </div>


//       {/* Personal Info */}
//       <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">

//         <h2 className="font-semibold text-gray-800 mb-4">
//           Personal Information
//         </h2>

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

//           <div>
//             <p className="text-sm text-gray-500">
//               Name
//             </p>
//             <p className="font-medium text-gray-800 mt-1">
//               {user?.name || "-"}
//             </p>
//           </div>

//           <div>
//             <p className="text-sm text-gray-500">
//               Email
//             </p>
//             <p className="font-medium text-gray-800 mt-1">
//               {user?.email || "-"}
//             </p>
//           </div>

//           <div>
//             <p className="text-sm text-gray-500">
//               Phone
//             </p>
//             <p className="font-medium text-gray-800 mt-1">
//               {user?.phone || "-"}
//             </p>
//           </div>

//         </div>

//       </div>


//       {/* Transactions */}
//       <div className="bg-white rounded-2xl border border-gray-200">

//         <div className="p-5 border-b bg-gray-50">
//           <h2 className="font-semibold text-gray-800">
//             Transactions
//           </h2>
//         </div>

//         <div className="overflow-x-auto">

//           <table className="w-full">

//             <thead>
//               <tr className="text-left text-gray-500 text-sm border-b bg-gray-50">
//                 <th className="px-6 py-4">Amount</th>
//                 <th className="px-6 py-4">Type</th>
//                 <th className="px-6 py-4">Status</th>
//               </tr>
//             </thead>

//             <tbody>

//               {transactions.length > 0 ? (
//                 transactions.map((txn) => (
//                   <tr
//                     key={txn.id}
//                     className="border-b hover:bg-gray-50 transition"
//                   >
//                     <td className="px-6 py-4 font-medium">
//                       ₹{txn.amount}
//                     </td>

//                     <td className="px-6 py-4 capitalize">
//                       {txn.type}
//                     </td>

//                     <td className="px-6 py-4">

//                       <span
//                         className={`px-3 py-1 rounded-xl text-xs font-medium
//                         ${
//                           txn.status === "success"
//                             ? "bg-green-100 text-green-700"
//                             : txn.status === "pending"
//                             ? "bg-yellow-100 text-yellow-700"
//                             : "bg-red-100 text-red-700"
//                         }`}
//                       >
//                         {txn.status}
//                       </span>

//                     </td>

//                   </tr>
//                 ))
//               ) : (

//                 <tr>
//                   <td
//                     colSpan={3}
//                     className="text-center py-10 text-gray-500"
//                   >
//                     No Transactions Found
//                   </td>
//                 </tr>

//               )}

//             </tbody>

//           </table>

//         </div>

//       </div>

//     </div>
//   );
// }

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { users } from '../../_components/mock-data';
import Avatar from '../../_components/Avatar';
import Badge from '../../_components/Badge';
import StatCard from '../../_components/StatCard';

interface UserDetailPageProps {
  params: { id: string };
}

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";


// Types
interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
}

interface Wallet {
  balance: number;
  bonusBalance: number;
}

interface Transaction {
  id: number;
  amount: number;
  type: string;
  status: string;
}

export default function UserDetailPage() {
  const params = useParams();

  const [user, setUser] = useState<User | null>(null);
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/${params.id}`)
      .then((res) => res.json())
      .then((data) => {
        setUser(data.data.user);
        setWallet(data.data.wallet);
        setTransactions(data.data.transactions);
      });
  }, [params.id]);

  return (
    <div className="space-y-8">

      {/* Header */}
      <div>
        <h1 className="text-[22px] font-semibold text-[#111827]">
          User Details
        </h1>
        <p className="text-[13px] text-[#6b7280]">
          View user profile and activity
        </p>
      </div>
    );
  }

  // Mock ticket history data
  const ticketHistory = [
    {
      id: '1',
      drawName: 'Mega Millions #4821',
      ticketNo: 'MG-4821-001',
      amount: 0,
      date: new Date('2026-02-25'),
      result: 'Pending',
    },
    {
      id: '2',
      drawName: 'Power Ball #88',
      ticketNo: 'PB-88-052',
      amount: 0,
      date: new Date('2026-02-24'),
      result: 'Won',
    },
    {
      id: '3',
      drawName: 'Daily Draw #485',
      ticketNo: 'DD-485-123',
      amount: 0,
      date: new Date('2026-02-23'),
      result: 'Lost',
    },
  ];

  // Mock wallet transactions
  const walletTransactions = [
    {
      id: 'TXN001',
      type: 'Deposit',
      amount: 0,
      method: 'UPI',
      date: new Date('2026-02-24'),
    },
    {
      id: 'TXN002',
      type: 'Withdrawal',
      amount: 0,
      method: 'Card',
      date: new Date('2026-02-23'),
    },
  ];

  // Mock referrals
  const referrals = [
    {
      id: '1',
      name: 'Rahul Verma',
      joinedDate: new Date('2026-02-15'),
      status: 'Active',
      reward: 0,
    },
    {
      id: '2',
      name: 'Meera Joshi',
      joinedDate: new Date('2026-02-10'),
      status: 'Active',
      reward: 0,
    },
    {
      id: '3',
      name: 'Amit Patel',
      joinedDate: new Date('2026-02-08'),
      status: 'Inactive',
      reward: 0,
    },
  ];

  // Mock KYC documents
  const kycDocs = [
    {
      id: 'DOC001',
      type: 'Aadhaar',
      submittedAt: new Date('2026-02-20'),
      status: 'Verified',
    },
    {
      id: 'DOC002',
      type: 'PAN Card',
      submittedAt: new Date('2026-02-21'),
      status: 'Verified',
    },
  ];

      {/* USER CARD */}
      <div className="bg-white border border-[#e5e7eb] rounded-2xl p-6">

        <div className="flex items-center gap-4 mb-6">

          <Avatar name={user?.name || ""} size="md" />

          <div>
            <h3 className="text-[16px] font-semibold text-[#111827]">
              {user?.name}
            </h3>
            <p className="text-[12px] text-[#6b7280]">
              ID #{user?.id}
            </p>
          </div>

        </div>

        <div className="grid grid-cols-3 gap-6">

          <div>
            <p className="text-[12px] text-[#6b7280]">
              Email
            </p>
            <p className="text-[14px] font-semibold text-[#111827]">
              {user?.email}
            </p>
          </div>
        </div>

          <div>
            <p className="text-[12px] text-[#6b7280]">
              Phone
            </p>
            <p className="text-[14px] font-semibold text-[#111827]">
              {user?.phone}
            </p>
            <div className="flex items-center gap-3">
              <div className="flex-1 h-2 bg-[rgba(255,255,255,0.07)] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#d97706] rounded-full"
                  style={{
                    width: `${(user.points / user.nextLevelPoints) * 100}%`,
                  }}
                ></div>
              </div>
              <span className="text-[12px] text-[#d97706] font-semibold">
                {formatINR(user.points)} /{' '}
                {formatINR(user.nextLevelPoints)}
              </span>
            </div>
          </div>

          <div>
            <p className="text-[12px] text-[#6b7280]">
              Status
            </p>
            <Badge label="Active" variant="green" />
          </div>
        </div>
      </div>

      {/* WALLET */}
      <div className="grid grid-cols-2 gap-6">

        <div className="bg-white border border-[#e5e7eb] rounded-2xl p-6">

          <p className="text-[12px] text-[#6b7280] mb-2">
            Wallet Balance
          </p>

          <h3 className="text-[24px] font-bold text-[#00d68f]">
            ₹{wallet?.balance || 0}
          </h3>

        </div>

        <div className="bg-white border border-[#e5e7eb] rounded-2xl p-6">

          <p className="text-[12px] text-[#6b7280] mb-2">
            Bonus Balance
          </p>

          <h3 className="text-[24px] font-bold text-[#3d9eff]">
            ₹{wallet?.bonusBalance || 0}
          </h3>

        </div>

      </div>

      {/* TRANSACTIONS */}
      <div className="bg-white border border-[#e5e7eb] rounded-2xl">

        <div className="p-6 border-b border-[#e5e7eb]">

          <h2 className="text-[16px] font-semibold text-[#111827]">
            Transactions
          </h2>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full text-[13px]">

            <thead>

              <tr className="border-b border-[#e5e7eb]">

                <th className="py-4 px-6 text-left text-[11px] font-semibold text-[#6b7280] uppercase">
                  Amount
                </th>

                <th className="py-4 px-6 text-left text-[11px] font-semibold text-[#6b7280] uppercase">
                  Type
                </th>

                <th className="py-4 px-6 text-left text-[11px] font-semibold text-[#6b7280] uppercase">
                  Status
                </th>

              </tr>

            </thead>

            <tbody>

              {transactions?.map((txn) => (

                <tr
                  key={txn.id}
                  className="border-b border-[#f3f4f6] hover:bg-[#f9fafb]"
                >

                  <td className="py-4 px-6 font-semibold text-[#111827]">
                    ₹{txn.amount}
                  </td>

                  <td className="py-4 px-6 text-[#4b5563]">
                    {txn.type}
                  </td>

                  <td className="py-4 px-6">

                    <span
                      className={`px-3 py-1 rounded-full text-[11px] font-medium
                      ${
                        txn.status === "success" || txn.status === "Success"
                          ? "bg-green-100 text-green-600"
                          : txn.status === "pending"
                          ? "bg-yellow-100 text-yellow-600"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {txn.status}
                    </span>

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
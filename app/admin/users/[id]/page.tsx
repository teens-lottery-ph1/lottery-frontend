"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Avatar from "../../_components/Avatar";
import Badge from "../../_components/Badge";

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

          <div>
            <p className="text-[12px] text-[#6b7280]">
              Phone
            </p>
            <p className="text-[14px] font-semibold text-[#111827]">
              {user?.phone}
            </p>
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

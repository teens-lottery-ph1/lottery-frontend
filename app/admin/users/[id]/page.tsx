"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type User = {
  name: string;
  email: string;
  phone: string;
};

type Wallet = {
  balance: number;
  bonusBalance: number;
};

type Transaction = {
  id: string;
  amount: number;
  type: string;
  status: string;
};

export default function UserDetailPage() {
  const params = useParams();

  const [user, setUser] = useState<User | null>(null);
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/${params.id}`
    )
      .then((res) => res.json())
      .then((data) => {
        setUser(data.data.user);
        setWallet(data.data.wallet);
        setTransactions(data.data.transactions);
      });
  }, []);

  return (
    <div className="p-6">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">
          User Details
        </h1>
        <p className="text-sm text-gray-500">
          View user profile and wallet information
        </p>
      </div>

      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">

        {/* User */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <p className="text-sm text-gray-500">
            User Name
          </p>

          <p className="text-lg font-semibold text-gray-800 mt-2">
            {user?.name || "-"}
          </p>
        </div>

        {/* Balance */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <p className="text-sm text-gray-500">
            Wallet Balance
          </p>

          <p className="text-xl font-semibold text-green-600 mt-2">
            ₹{wallet?.balance ?? 0}
          </p>
        </div>

        {/* Bonus */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <p className="text-sm text-gray-500">
            Bonus Balance
          </p>

          <p className="text-xl font-semibold text-yellow-600 mt-2">
            ₹{wallet?.bonusBalance ?? 0}
          </p>
        </div>

      </div>


      {/* Personal Info */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">

        <h2 className="font-semibold text-gray-800 mb-4">
          Personal Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <div>
            <p className="text-sm text-gray-500">
              Name
            </p>
            <p className="font-medium text-gray-800 mt-1">
              {user?.name || "-"}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Email
            </p>
            <p className="font-medium text-gray-800 mt-1">
              {user?.email || "-"}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Phone
            </p>
            <p className="font-medium text-gray-800 mt-1">
              {user?.phone || "-"}
            </p>
          </div>

        </div>

      </div>


      {/* Transactions */}
      <div className="bg-white rounded-2xl border border-gray-200">

        <div className="p-5 border-b bg-gray-50">
          <h2 className="font-semibold text-gray-800">
            Transactions
          </h2>
        </div>

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead>
              <tr className="text-left text-gray-500 text-sm border-b bg-gray-50">
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>

            <tbody>

              {transactions.length > 0 ? (
                transactions.map((txn) => (
                  <tr
                    key={txn.id}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="px-6 py-4 font-medium">
                      ₹{txn.amount}
                    </td>

                    <td className="px-6 py-4 capitalize">
                      {txn.type}
                    </td>

                    <td className="px-6 py-4">

                      <span
                        className={`px-3 py-1 rounded-xl text-xs font-medium
                        ${
                          txn.status === "success"
                            ? "bg-green-100 text-green-700"
                            : txn.status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {txn.status}
                      </span>

                    </td>

                  </tr>
                ))
              ) : (

                <tr>
                  <td
                    colSpan={3}
                    className="text-center py-10 text-gray-500"
                  >
                    No Transactions Found
                  </td>
                </tr>

              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}
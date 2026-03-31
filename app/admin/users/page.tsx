"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function UsersPage() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users`)
      .then((res) => res.json())
      .then((data) => {
        setUsers(data.data);
      });
  }, []);

  return (
    <div className="p-6">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">
          Users
        </h1>
        <p className="text-gray-500 text-sm">
          Manage platform users
        </p>
      </div>

      {/* Users Card */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">

        {/* Header */}
        <div className="p-5 border-b bg-gray-50 flex justify-between items-center">

          <div>
            <h2 className="font-semibold text-gray-800">
              All Users
            </h2>
            <p className="text-sm text-gray-500">
              {users.length} users found
            </p>
          </div>

        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">

            <thead>
              <tr className="text-left text-gray-500 text-sm border-b bg-gray-50">
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Phone</th>
                <th className="px-6 py-4">Action</th>
              </tr>
            </thead>

            <tbody>

              {users.length > 0 ? (
                users.map((user: any) => (
                  <tr
                    key={user.id}
                    className="border-b hover:bg-gray-50 transition"
                  >

                    {/* User */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">

                        <div className="w-10 h-10 rounded-xl bg-yellow-100 text-yellow-600 flex items-center justify-center font-semibold">
                          {user.name?.charAt(0)}
                        </div>

                        <div>
                          <p className="font-medium text-gray-800">
                            {user.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {user.id}
                          </p>
                        </div>

                      </div>
                    </td>

                    {/* Email */}
                    <td className="px-6 py-4 text-gray-600">
                      {user.email}
                    </td>

                    {/* Phone */}
                    <td className="px-6 py-4 text-gray-600">
                      {user.phone}
                    </td>

                    {/* Action */}
                    <td className="px-6 py-4">

                      <Link
                        href={`/admin/users/${user.id}`}
                        className="px-4 py-2 rounded-xl bg-yellow-100 text-yellow-700 text-sm font-medium hover:bg-yellow-200 transition"
                      >
                        View Details
                      </Link>

                    </td>

                  </tr>
                ))
              ) : (

                <tr>
                  <td
                    colSpan={4}
                    className="text-center py-10 text-gray-500"
                  >
                    No users found
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
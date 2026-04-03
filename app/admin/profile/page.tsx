"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function AdminProfile() {
  const router = useRouter();
  const [admin, setAdmin] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/me`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (!res.ok) {
          router.replace("/admin/login");
          return;
        }

        const data = await res.json();
        setAdmin(data.user);
      } catch (error) {
        console.error(error);
        router.replace("/admin/login");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading)
    return (
      <div className="p-6 space-y-4 animate-pulse">
        <div className="h-8 w-48 bg-gray-300 rounded"></div>
        <div className="h-40 w-full bg-gray-300 rounded"></div>
      </div>
    );
return (
  <div className="space-y-8">

    {/* Header */}
    <div>
      <h1 className="text-[26px] font-bold text-[#111827]">
        Admin Profile
      </h1>
      <p className="text-[14px] text-[#6b7280]">
        View admin account details
      </p>
    </div>

    {admin && (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT SIDE */}
        <div className="bg-white border border-[#e5e7eb] rounded-2xl p-6">
          <div className="flex flex-col items-center text-center">

            {/* Avatar */}
            <div className="h-16 w-16 rounded-full bg-[#6366f1] flex items-center justify-center text-white font-semibold text-lg">
              {admin.name?.charAt(0).toUpperCase()}
            </div>

            <h3 className="mt-4 text-[18px] font-bold text-[#111827]">
              {admin.name}
            </h3>

            <p className="text-[13px] text-[#6b7280]">
              {admin.email}
            </p>

            {/* Status Badge */}
            <span
              className={`mt-3 px-3 py-1 rounded-full text-[12px] font-medium ${
                admin.isActive
                  ? "bg-green-100 text-green-600"
                  : "bg-red-100 text-red-600"
              }`}
            >
              {admin.isActive ? "Active" : "Inactive"}
            </span>

          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="lg:col-span-2 space-y-6">

          {/* DETAILS */}
          <div className="bg-white border border-[#e5e7eb] rounded-2xl p-6">

            <div className="grid grid-cols-2 gap-6">

              <div>
                <p className="text-[13px] font-bold text-[#111827]">Role</p>
                <p className="text-[15px] text-[#374151]">
                  {admin.role}
                </p>
              </div>

              <div>
                <p className="text-[13px] font-bold text-[#111827]">Status</p>
                <p className="text-[15px] text-[#374151]">
                  {admin.isActive ? "Active" : "Inactive"}
                </p>
              </div>

              <div>
                <p className="text-[13px] font-bold text-[#111827]">Email</p>
                <p className="text-[15px] text-[#374151]">
                  {admin.email}
                </p>
              </div>

              <div>
                <p className="text-[13px] font-bold text-[#111827]">
                  Permissions
                </p>
                <p className="text-[15px] text-[#374151]">
                  {admin.permissions?.length || 0}
                </p>
              </div>

            </div>

          </div>

          {/* PERMISSIONS */}
          <div className="bg-white border border-[#e5e7eb] rounded-2xl">

            <div className="p-6 border-b border-[#e5e7eb] flex justify-between items-center">
              <h2 className="text-[14px] font-bold text-[#111827]">
                Permissions
              </h2>

              <span className="text-[13px] text-[#6b7280]">
                {admin.permissions?.length} total
              </span>
            </div>

            <div className="p-6 flex flex-wrap gap-2">
              {admin.permissions?.map((perm: string, i: number) => (
                <span
                  key={i}
                  className="px-3 py-1 text-[13px] rounded-md bg-[#f3f4f6] text-[#374151]"
                >
                  {perm}
                </span>
              ))}
            </div>

          </div>

        </div>

      </div>
    )}

  </div>
);
}
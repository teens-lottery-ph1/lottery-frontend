"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/admin-login`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await res.json();

      if (data.success) {
        localStorage.setItem("adminSession", "active");
        router.replace("/admin/dashboard");
      } else {
        if (data.errors) {
          const firstError = Object.values(data.errors)[0] as string[];
          setError(firstError[0] || "Validation failed");
        } else {
          setError(data.message || "Invalid credentials");
        }
      }

    } catch (error) {
      console.error(error);
      setError("Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-[340px] space-y-5 border border-gray-200">
        
        {/* Heading */}
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-bold text-gray-900">
            Admin Login
          </h2>
          <p className="text-sm text-gray-500">
            Sign in to access dashboard
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 text-red-600 text-sm px-3 py-2 rounded-lg">
            {error}
          </div>
        )}

        {/* Email */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full border border-gray-300 p-2.5 rounded-lg text-gray-900"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Password */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            placeholder="Enter your password"
            className="w-full border border-gray-300 p-2.5 rounded-lg text-gray-900"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* Button */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-black text-white py-2.5 rounded-lg font-medium hover:bg-gray-900 transition disabled:opacity-60"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

      </div>
    </div>
  );
}
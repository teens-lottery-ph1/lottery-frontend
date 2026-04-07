"use client";

import { useEffect, useState } from "react";

// ✅ TYPES
type Wallet = {
  name?: string;
  userId?: string;
  id?: string;
  balance: string;
  bonusBalance?: string;
  lockedAmount?: string;
};

type WalletResponse = {
  success?: boolean;
  totalBalance: number;
  averageBalance: number;
  transactionsToday: number;
  lockedPrizes: number;
  wallets: Wallet[];
};

export default function WalletPage() {
  const [data, setData] = useState<WalletResponse | null>(null);
  const [error, setError] = useState("");

  const BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:10000";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/admin/wallets`);

        if (!res.ok) {
          throw new Error("API not responding");
        }

        const json = await res.json();

        console.log("✅ API DATA:", json);

        // ✅ backend already correct format
        setData(json);
      } catch (err: any) {
        console.error("❌ FETCH ERROR:", err);
        setError("Failed to connect backend ❌");
      }
    };

    fetchData();
  }, [BASE_URL]);

  // ❌ ERROR
  if (error) {
    return <h2 style={{ color: "red", padding: "20px" }}>{error}</h2>;
  }

  // ⏳ LOADING
  if (!data) {
    return <h2 style={{ padding: "20px" }}>Loading...</h2>;
  }

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>Wallet Management</h1>

      {/* 🔷 SUMMARY */}
      <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
        <div style={cardStyle}>
          <h3>₹{data.totalBalance}</h3>
          <p>Total Wallet Balance</p>
        </div>

        <div style={cardStyle}>
          <h3>₹{data.averageBalance}</h3>
          <p>Average Balance</p>
        </div>

        <div style={cardStyle}>
          <h3>{data.transactionsToday}</h3>
          <p>Transactions Today</p>
        </div>

        <div style={cardStyle}>
          <h3>₹{data.lockedPrizes}</h3>
          <p>Locked Prizes</p>
        </div>
      </div>

      {/* 🔷 USERS */}
      {data.wallets.map((user, i) => (
        <div key={i} style={userCard}>
          <p>
            <strong>Name:</strong>{" "}
            {user.name || user.userId || user.id}
          </p>

          <p>
            <strong>Balance:</strong> ₹{Number(user.balance)}
          </p>

          <p>
            <strong>Bonus:</strong> ₹{Number(user.bonusBalance || 0)}
          </p>

          <p>
            <strong>Locked:</strong> ₹{Number(user.lockedAmount || 0)}
          </p>
        </div>
      ))}
    </div>
  );
}

// 🎨 Styles
const cardStyle = {
  border: "1px solid #ddd",
  padding: "15px",
  borderRadius: "10px",
  width: "200px",
  textAlign: "center" as const,
  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
};

const userCard = {
  border: "1px solid #ccc",
  padding: "10px",
  marginBottom: "10px",
  borderRadius: "8px",
};
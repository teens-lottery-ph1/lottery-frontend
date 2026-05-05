// 'use client';

// import { useEffect, useState } from 'react';
// import axios from 'axios';

// export default function WalletPage() {
//   const [users, setUsers] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);

//   const [stats, setStats] = useState({
//     total: 0,
//     avg: 0,
//     locked: 0,
//   });

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     try {
//       const res = await axios.get(
//         'http://localhost:10000/api/wallet/users-wallets'
//       );

//       console.log("API DATA:", res.data); // debug

//       const data = res.data.data || [];

//       setUsers(data);

//       let total = 0;
//       let locked = 0;

//       data.forEach((u: any) => {
//         total += Number(u.balance || 0);
//         locked += Number(u.locked || 0);
//       });

//       setStats({
//         total,
//         avg: data.length ? total / data.length : 0,
//         locked,
//       });

//     } catch (err) {
//       console.error("ERROR:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-6">Wallet Management</h1>

//       {/* 🔥 STATS */}
//       <div className="grid grid-cols-4 gap-4 mb-6">
//         <Card title="Total Wallet Balance" value={`₹${stats.total}`} />
//         <Card title="Average Balance" value={`₹${stats.avg.toFixed(2)}`} />
//         <Card title="Transactions Today" value="--" />
//         <Card title="Locked Prizes" value={`₹${stats.locked}`} />
//       </div>

//       {/* 🔥 TABLE */}
//       <div className="bg-white rounded-lg shadow p-4">
//         <h2 className="text-lg font-semibold mb-4">User Wallets</h2>

//         {loading ? (
//           <p>Loading...</p>
//         ) : (
//           <table className="w-full border text-center">
//             <thead className="bg-gray-100">
//               <tr>
//                 <th>Name</th>
//                 <th>Email</th>
//                 <th>Balance</th>
//                 <th>Locked</th>
//               </tr>
//             </thead>
//             <tbody>
//               {users.map((u: any) => (
//                 <tr key={u.id} className="border-t">
//                   <td>{u.name}</td>
//                   <td>{u.email}</td>
//                   <td>₹{u.balance}</td>
//                   <td>₹{u.locked}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}
//       </div>
//     </div>
//   );
// }

// // Card component
// function Card({ title, value }: any) {
//   return (
//     <div className="bg-white shadow rounded-lg p-4 text-center">
//       <h3 className="text-gray-500">{title}</h3>
//       <p className="text-xl font-bold mt-2">{value}</p>
//     </div>
//   );
// }

'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

export default function WalletPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    total: 0,
    avg: 0,
    locked: 0,
  });

  useEffect(() => {
    fetchData();

    // ✅ auto refresh every 3 sec (fix wallet delay issue)
    const interval = setInterval(fetchData, 3000);

    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get(
        'http://localhost:10000/api/wallet/users-wallets',
        {
          headers: {
            'Cache-Control': 'no-cache',
          },
        }
      );

      console.log("API RESPONSE:", res.data); // 🔍 debug

      const data = res.data?.data || [];

      setUsers(data);

      let total = 0;
      let locked = 0;

      data.forEach((u: any) => {
        total += Number(u.balance || 0);
        locked += Number(u.locked || 0);
      });

      setStats({
        total,
        avg: data.length ? total / data.length : 0,
        locked,
      });

    } catch (err) {
      console.error("FETCH ERROR:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      
      <h1 className="text-2xl font-semibold mb-6 text-gray-800">
        Wallet Management
      </h1>

      {/* 🔥 CARDS */}
      <div className="grid grid-cols-4 gap-6 mb-8">

        <Card
          title="Total Wallet Balance"
          value={`₹${stats.total}`}
          color="text-orange-500"
        />

        <Card
          title="Average Balance"
          value={`₹${stats.avg.toFixed(2)}`}
          color="text-blue-500"
        />

        <Card
          title="Transactions Today"
          value="0"
          color="text-green-500"
        />

        <Card
          title="Locked Prizes"
          value={`₹${stats.locked}`}
          color="text-red-500"
        />

      </div>

      {/* 🔥 TABLE */}
      <div className="bg-white rounded-xl shadow-md p-6">

        <h2 className="text-lg font-semibold text-gray-700 mb-4">
          User Wallets
        </h2>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr className="border-b text-gray-500">
                <th className="py-3">USER</th>
                <th className="py-3">EMAIL</th>
                <th className="py-3">BALANCE</th>
                <th className="py-3">LOCKED</th>
              </tr>
            </thead>

            <tbody>
              {users.map((u: any) => (
                <tr key={u.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 font-medium text-gray-800">
                    {u.name}
                  </td>
                  <td className="py-3 text-gray-600">
                    {u.email}
                  </td>
                  <td className="py-3 text-blue-600 font-semibold">
                    ₹{Number(u.balance).toFixed(2)}
                  </td>
                  <td className="py-3 text-red-500 font-semibold">
                    ₹{Number(u.locked).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}


// 🔹 CARD COMPONENT
function Card({ title, value, color }: any) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center justify-center">
      <p className="text-sm text-gray-500 mb-2">{title}</p>
      <h2 className={`text-2xl font-bold ${color}`}>
        {value}
      </h2>
    </div>
  );
}
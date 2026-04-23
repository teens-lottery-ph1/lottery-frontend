"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddUserPage() {

  const router = useRouter();

  const [username,setUsername] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [phone,setPhone] = useState("");
  const [referralCode,setReferralCode] = useState("");

  const [loading,setLoading] = useState(false);
  const [error,setError] = useState("");
  const [success,setSuccess] = useState("");

  const createUser = async (e:any) => {

    e.preventDefault();

    try {

      setLoading(true);
      setError("");
      setSuccess("");

      const API =
        process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:10000";

      const res = await fetch(`${API}/api/auth/register`,{
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify({
          name: username,
          email,
          password,
          phone,
          referralCode,
          level_id: 1,
          country_id: 1
        })
      });

      const data = await res.json();

      if(data.success){

        setSuccess("Account created successfully");

        setTimeout(()=>{
          router.push("/admin/users");
        },1500);

      }else{

        setError(data.message || "Signup failed");

      }

    } catch (error){

      setError("Something went wrong");

    } finally {

      setLoading(false);

    }
  };

  return (

    <div className="p-10">

      <h1 className="text-xl font-bold mb-6">
        Add New User
      </h1>

      <form
        onSubmit={createUser}
        className="space-y-4 max-w-md"
      >

 {success && (
          <div className="bg-green-500/20 text-green-400 px-3 py-2 rounded text-sm">
            {success}
          </div>
        )}

        {error && (
          <div className="bg-red-500/20 text-red-400 px-3 py-2 rounded text-sm">
            {error}
          </div>
        )}

         <input
          type="text"
          placeholder="Username"
          className="w-full border p-3 rounded"
          value={username}
          onChange={(e)=>setUsername(e.target.value)}
        />


        <input
          type="email"
          placeholder="Email"
          className="w-full border p-3 rounded"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
        />

         <input
          type="text"
          placeholder="Phone"
          className="w-full border p-3 rounded"
          value={phone}
          onChange={(e)=>setPhone(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-3 rounded"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
        />
   
        <input
          type="text"
          placeholder="Referral Code (Optional)"
          className="w-full border p-3 rounded"
          value={referralCode}
          onChange={(e)=>setReferralCode(e.target.value)}
        />


        <button
          type="submit"
          className="bg-yellow-400 px-6 py-3 rounded font-semibold"
        >
          Create User
        </button>

      </form>

    </div>

  );

}
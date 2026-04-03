"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {

  const router = useRouter();

  const [username,setUsername] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [phone,setPhone] = useState("");
  const [referralCode,setReferralCode] = useState("");

  const [loading,setLoading] = useState(false);
  const [error,setError] = useState("");
  const [success,setSuccess] = useState("");

  const signup = async (e:any) => {

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
          router.push("/login");
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

    <div className="flex items-center justify-center h-screen bg-black">

      <form
        onSubmit={signup}
        className="bg-zinc-900 p-10 rounded-xl w-[350px] space-y-4"
      >

        <h2 className="text-white text-xl font-bold text-center">
          Sign Up
        </h2>

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
          className="w-full p-2 rounded bg-zinc-800 text-white"
          value={username}
          onChange={(e)=>setUsername(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 rounded bg-zinc-800 text-white"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
        />

        <input
          type="text"
          placeholder="Phone"
          className="w-full p-2 rounded bg-zinc-800 text-white"
          value={phone}
          onChange={(e)=>setPhone(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 rounded bg-zinc-800 text-white"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
        />

        <input
          type="text"
          placeholder="Referral Code (Optional)"
          className="w-full p-2 rounded bg-zinc-800 text-white"
          value={referralCode}
          onChange={(e)=>setReferralCode(e.target.value)}
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-500 p-2 rounded font-semibold disabled:opacity-60"
        >
          {loading ? "Creating..." : "Create Account"}
        </button>

        <p className="text-center text-sm text-gray-400">
          Already have an account?{" "}
          <span
            onClick={()=>router.push("/login")}
            className="text-blue-400 cursor-pointer"
          >
            Login
          </span>
        </p>

      </form>

    </div>

  );

}
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {

  const router = useRouter();

  const [username,setUsername] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");

  const signup = async (e:any) => {

    e.preventDefault();

    const res = await fetch("http://localhost:5000/api/auth/register",{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({
        username,
        email,
        password
      })
    });

    const data = await res.json();

    if(data.success){

      alert("Account created successfully");
      router.push("/login");

    }else{

      alert(data.message);

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
          type="password"
          placeholder="Password"
          className="w-full p-2 rounded bg-zinc-800 text-white"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
        />

        <button
          type="submit"
          className="w-full bg-green-500 p-2 rounded font-semibold"
        >
          Create Account
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
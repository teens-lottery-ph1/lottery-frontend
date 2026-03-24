"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {

  const router = useRouter();

  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");

  const login = async (e:any) => {

    e.preventDefault();

    const res = await fetch("http://localhost:5000/api/auth/login",{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body: JSON.stringify({email,password})
    });

    const data = await res.json();

    if(data.success){

      localStorage.setItem("token",data.token);
      localStorage.setItem("user",JSON.stringify(data.user));

      router.push("/");

    }else{
      alert(data.message);
    }

  };

  return (

    <div className="flex items-center justify-center h-screen bg-black">

      <form
        onSubmit={login}
        className="bg-zinc-900 p-10 rounded-xl w-[350px] space-y-4"
      >

        <h2 className="text-white text-xl font-bold text-center">
          Login
        </h2>

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
          Login
        </button>

        <p className="text-center text-sm text-gray-400">
          Don't have an account?{" "}
          <span
            onClick={()=>router.push("/signup")}
            className="text-blue-400 cursor-pointer"
          >
            Sign up
          </span>
        </p>

      </form>

    </div>

  );

}
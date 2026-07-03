"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {

    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const login = async (e: any) => {

        e.preventDefault();

        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/login`,
            {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password })
            }
        );

        const data = await res.json();

        if (data.success) {

            const { id, name, email, role } = data.user;
            localStorage.setItem("user", JSON.stringify({ id, name, email, role }));
            window.dispatchEvent(new Event("authChanged"));

            router.replace("/");

        } else {
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
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="Password"
                    className="w-full p-2 rounded bg-zinc-800 text-white"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button
                    type="submit"
                    className="w-full bg-green-500 p-2 rounded font-semibold"
                >
                    Login
                </button>

                {/* Signup Link */}
                <p className="text-center text-sm text-gray-400">
                    Don't have an account?{" "}
                    <span
                        onClick={() => router.push("/signup")}
                        className="text-blue-400 cursor-pointer hover:underline"
                    >
                        Sign up
                    </span>
                </p>

            </form>

        </div>
   );
}
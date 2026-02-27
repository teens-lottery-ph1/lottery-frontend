'use client'; // important for client components

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Navigate to /home after component mounts
    router.push('/home');
  }, [router]);

  // Optionally render nothing or a loading state
  return <div>Redirecting...</div>;
}
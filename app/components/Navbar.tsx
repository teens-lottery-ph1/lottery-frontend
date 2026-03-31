"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Gamepad2,
  Trophy,
  HelpCircle,
  Menu,
  X,
  Wallet,
  Crown,
  Bell,
  LogIn,
  User,
  LogOut,
  UserPlus
} from "lucide-react";

const navItems = [
  { label: "Home", icon: Home, href: "/" },
  { label: "Games", icon: Gamepad2, href: "/games" },
  { label: "Results", icon: Trophy, href: "/results" },
  { label: "Levels", icon: Crown, href: "/levels" },
  { label: "Wallet", icon: Wallet, href: "/wallets" },
  { label: "How to Play", icon: HelpCircle, href: "/how-to-play" },
];

export default function Navbar() {

  const [mobileOpen,setMobileOpen] = useState(false);
  const [user,setUser] = useState<any>(null);

  const pathname = usePathname();

  const closeMenu = () => setMobileOpen(false);

  const loadUser = async () => {

    try {

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/profile`,
        {
          credentials:"include"
        }
      );

      const data = await res.json();

      if(data.success){
        setUser(data.user);
      }else{
        setUser(null);
      }

    } catch {
      setUser(null);
    }

  };

  /* load on mount */
  useEffect(()=>{
    loadUser();
  },[]);

  /* listen login/logout */
  useEffect(()=>{

    const handleAuth = () => {
      loadUser();
    };

    window.addEventListener("authChanged",handleAuth);

    return ()=>{
      window.removeEventListener("authChanged",handleAuth);
    };

  },[]);


  const logout = async () => {

    await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/logout`,
      {
        method:"POST",
        credentials:"include"
      }
    );

    setUser(null);

    window.dispatchEvent(new Event("authChanged"));

    window.location.href="/";

  };

  return (

<>
<nav className="fixed top-0 left-0 right-0 z-50 border-b border-[hsl(var(--border))] bg-[hsl(var(--background))]/80 backdrop-blur-xl">

<div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-8">

{/* Logo */}
<Link href="/" className="flex items-center gap-2" onClick={closeMenu}>
<span className="text-2xl">🎰</span>
<span className="text-lg md:text-xl font-bold text-gradient-gold">
Lottery Network
</span>
</Link>


{/* Desktop Navigation */}
<div className="hidden lg:flex items-center gap-2">

{navItems.map((item)=>{

const isActive = pathname === item.href;

return(

<Link
key={item.label}
href={item.href}
className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition ${
isActive
? "bg-[hsl(var(--primary))]/10 text-[hsl(var(--primary))]"
: "text-[hsl(var(--muted-foreground))] hover:text-white hover:bg-[hsl(var(--surface-hover))]"
}`}
>

<item.icon className="w-4 h-4"/>
{item.label}

</Link>

);

})}

</div>


{/* Desktop Right Section */}
<div className="hidden md:flex items-center gap-3">

{/* Notification */}
<button className="relative p-2 rounded-xl bg-[hsl(var(--surface))] hover:bg-[hsl(var(--surface-hover))]">
<Bell className="w-5 h-5" />
<span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-yellow-400" />
</button>

{/* Wallet */}
<Link
href="/wallets"
className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[hsl(var(--surface))]"
>
<Wallet className="w-4 h-4 text-green-400" />
$1,480
</Link>

{user ? (

<div className="flex items-center gap-3">

<Link
href="/profile"
className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[hsl(var(--surface))]"
>
<User className="w-4 h-4 text-blue-400"/>
<span className="text-sm">{user?.name}</span>
</Link>

<button
onClick={logout}
className="flex items-center gap-2 text-sm text-red-400"
>
<LogOut className="w-4 h-4"/>
Logout
</button>

</div>

) : (

<div className="flex items-center gap-3">

<Link
href="/login"
className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:text-white"
>
<LogIn className="w-4 h-4"/>
Login
</Link>

<Link
href="/signup"
className="flex items-center gap-2 px-4 py-2 text-sm bg-[hsl(var(--primary))] text-black rounded-xl font-semibold"
>
<UserPlus className="w-4 h-4"/>
Sign Up
</Link>

</div>

)}

</div>


{/* Mobile Toggle */}
<button
onClick={() => setMobileOpen(prev => !prev)}
className="lg:hidden p-2 rounded-lg hover:bg-[hsl(var(--surface-hover))]"
>

{mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}

</button>

</div>

</nav>


{/* Mobile Menu */}
<div
className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition ${
mobileOpen ? "opacity-100 visible" : "opacity-0 invisible"
}`}
onClick={closeMenu}
/>

<div
className={`fixed top-16 left-0 right-0 z-50 bg-[hsl(var(--background))] border-t border-[hsl(var(--border))] transition-all duration-300 ${
mobileOpen ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0 pointer-events-none"
}`}
>

<div className="flex flex-col p-4 gap-2">

{navItems.map((item)=>{

const isActive = pathname === item.href;

return(

<Link
key={item.label}
href={item.href}
onClick={closeMenu}
className={`flex items-center gap-3 px-4 py-3 rounded-xl transition ${
isActive
? "bg-[hsl(var(--primary))]/10 text-[hsl(var(--primary))]"
: "hover:bg-[hsl(var(--surface-hover))]"
}`}
>

<item.icon className="w-5 h-5"/>
{item.label}

</Link>

);

})}


{/* Mobile Auth */}
<div className="border-t border-[hsl(var(--border))] pt-4 mt-2">

{user ? (

<div className="flex flex-col gap-3">

<Link
href="/profile"
onClick={closeMenu}
className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[hsl(var(--surface))]"
>
<User className="w-4 h-4"/>
{user?.name}
</Link>

<button
onClick={logout}
className="flex items-center gap-2 px-4 py-3 text-red-400"
>
<LogOut className="w-4 h-4"/>
Logout
</button>

</div>

) : (

<div className="flex flex-col gap-3">

<Link
href="/login"
onClick={closeMenu}
className="flex items-center gap-2 px-4 py-3"
>
<LogIn className="w-4 h-4"/>
Login
</Link>

<Link
href="/signup"
onClick={closeMenu}
className="flex items-center gap-2 px-4 py-3 bg-[hsl(var(--primary))] text-black rounded-xl font-semibold"
>
<UserPlus className="w-4 h-4"/>
Sign Up
</Link>

</div>

)}

</div>

</div>

</div>

</>

);

}

// 1
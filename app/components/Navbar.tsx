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

  const loadUser = () => {
    const storedUser = localStorage.getItem("user");
    if(storedUser){
      setUser(JSON.parse(storedUser));
    }else{
      setUser(null);
    }
  };

  useEffect(()=>{
    loadUser();
    window.addEventListener("storage",loadUser);

    return ()=>{
      window.removeEventListener("storage",loadUser);
    };

  },[]);

  const logout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);

    window.location.href="/";

  };

  return (

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

<button className="relative p-2 rounded-xl bg-[hsl(var(--surface))] hover:bg-[hsl(var(--surface-hover))]">
<Bell className="w-5 h-5"/>
<span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-yellow-400"/>
</button>

<Link
href="/wallets"
className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[hsl(var(--surface))]"
>
<Wallet className="w-4 h-4 text-green-400"/>
$1,480
</Link>


{/* USER */}
{user ? (

<div className="flex items-center gap-3">

<Link
href="/profile"
className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[hsl(var(--surface))]"
>
<User className="w-4 h-4 text-blue-400"/>
<span className="text-sm">{user.username}</span>
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
onClick={()=>setMobileOpen(prev=>!prev)}
className="lg:hidden p-2 rounded-lg hover:bg-[hsl(var(--surface-hover))]"
>

{mobileOpen ? <X className="w-6 h-6"/> : <Menu className="w-6 h-6"/>}

</button>

</div>


{/* MOBILE MENU */}
{mobileOpen && (

<div className="lg:hidden border-t border-[hsl(var(--border))] bg-[hsl(var(--background))] px-4 pb-6 pt-4 space-y-3">

{navItems.map((item)=>{

const isActive = pathname === item.href;

return(

<Link
key={item.label}
href={item.href}
onClick={closeMenu}
className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm ${
isActive
? "bg-[hsl(var(--primary))]/10 text-[hsl(var(--primary))]"
: "text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--surface-hover))]"
}`}
>

<item.icon className="w-5 h-5"/>
{item.label}

</Link>

);

})}


<div className="pt-4 border-t border-[hsl(var(--border))] space-y-3">

{user ? (

<button
onClick={logout}
className="w-full flex items-center justify-center gap-2 px-4 py-3 text-red-400"
>

<LogOut className="w-4 h-4"/>
Logout

</button>

) : (

<div className="flex flex-col gap-2">

<Link
href="/login"
onClick={closeMenu}
className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm text-gray-300"
>
<LogIn className="w-4 h-4"/>
Login
</Link>

<Link
href="/signup"
onClick={closeMenu}
className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm bg-[hsl(var(--primary))] text-black rounded-lg"
>
<UserPlus className="w-4 h-4"/>
Sign Up
</Link>

</div>

)}

</div>

</div>

)}

</nav>

);

}

// 1
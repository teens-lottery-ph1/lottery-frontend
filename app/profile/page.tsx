"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User, Mail, Lock, Briefcase, CheckCircle, XCircle } from "lucide-react";

export default function ProfilePage() {

const router = useRouter();

const [isEditing,setIsEditing] = useState(false);

const [username,setUsername] = useState("");
const [email,setEmail] = useState("");
const [password,setPassword] = useState("");
const [role,setRole] = useState("");

const [success,setSuccess] = useState("");
const [error,setError] = useState("");

/* ================= LOAD PROFILE ================= */

    useEffect(() => {

        const loadProfile = () => {
            try {
                if (typeof window !== "undefined") {
                    const cached = localStorage.getItem("user");
                    if (!cached) {
                        router.push("/login");
                        return;
                    }

                    const user = JSON.parse(cached);
                    setUsername(user?.name || "");
                    setEmail(user?.email || "");
                    setRole(user?.role || "");
                }
            } catch (error) {
                router.push("/login");
            }
        };

        loadProfile();

    }, [router]);


/* ================= UPDATE PROFILE ================= */

const updateProfile = async () => {

setSuccess("");
setError("");

try {

const res = await fetch(
`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/update`,
{
method:"PUT",
credentials:"include",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
username,
email,
password,
role
})
}
);

const data = await res.json();

        if (data.success) {

            if (typeof window !== "undefined") {
                 const cached = localStorage.getItem("user");
                 if (cached) {
                    try {
                        const parsed = JSON.parse(cached);
                        localStorage.setItem("user", JSON.stringify({ ...parsed, name: username, email: email, role: role }));
                        window.dispatchEvent(new Event("authChanged"));
                    } catch(e) {}
                 }
            }

            setSuccess("Profile updated successfully");
setPassword("");
setIsEditing(false);

setTimeout(()=>{
setSuccess("");
},3000);

}else{

setError("Update failed");

setTimeout(()=>{
setError("");
},3000);

}

}catch{

setError("Something went wrong");

setTimeout(()=>{
setError("");
},3000);

}

};


/* ================= CANCEL PAGE ================= */

const cancelPage = ()=>{
router.push("/");
};


return(

<div className="min-h-screen px-4 md:px-10 py-10 space-y-6">

{/* Header */}

<div className="flex items-center justify-between flex-wrap gap-4">

<div>
<h1 className="text-2xl font-semibold">
Profile
</h1>
<p className="text-gray-400 text-sm">
Manage your account information
</p>
</div>

<div className="flex gap-3">

{!isEditing ? (

<button
onClick={()=>setIsEditing(true)}
className="px-5 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
>
Edit
</button>

) : (

<button
onClick={updateProfile}
className="px-5 py-2 bg-green-500 hover:bg-green-600 text-black rounded-lg"
>
Update
</button>

)}

<button
onClick={cancelPage}
className="px-5 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg"
>
Cancel
</button>

</div>

</div>


{/* Success Message */}

{success && (

<div className="flex items-center gap-2 bg-green-500/10 border border-green-500/30 text-green-400 px-4 py-3 rounded-lg">

<CheckCircle className="w-5 h-5"/>
<span>{success}</span>

</div>

)}

{/* Error Message */}

{error && (

<div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg">

<XCircle className="w-5 h-5"/>
<span>{error}</span>

</div>

)}


{/* Profile Fields */}

<div className="grid grid-cols-1 md:grid-cols-2 gap-8">

<InputField
icon={<User className="w-4 h-4 text-blue-400"/>}
label="Username"
value={username}
setValue={setUsername}
disabled={!isEditing}
/>

<InputField
icon={<Mail className="w-4 h-4 text-green-400"/>}
label="Email"
value={email}
setValue={setEmail}
disabled={!isEditing}
/>

<InputField
icon={<Briefcase className="w-4 h-4 text-purple-400"/>}
label="Role"
value={role}
setValue={setRole}
disabled={!isEditing}
/>

<div className="space-y-1">

<label className="text-sm text-gray-400">
Password
</label>

<div className="flex items-center gap-2 bg-[hsl(var(--surface-hover))] px-3 py-2 rounded-lg">

<Lock className="w-4 h-4 text-yellow-400"/>

<input
type="password"
placeholder="Enter new password"
value={password}
disabled={!isEditing}
onChange={(e)=>setPassword(e.target.value)}
className="bg-transparent w-full outline-none"
/>

</div>

</div>

</div>

</div>

);

}



function InputField({icon,label,value,setValue,disabled}:any){

return(

<div className="space-y-1">

<label className="text-sm text-gray-400">
{label}
</label>

<div className="flex items-center gap-2 bg-[hsl(var(--surface-hover))] px-3 py-2 rounded-lg">

{icon}

<input
value={value}
disabled={disabled}
onChange={(e)=>setValue(e.target.value)}
className="bg-transparent w-full outline-none"
/>

</div>

</div>

);

}
'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function CreateDrawPage() {

const [formData, setFormData] = useState({
  gameTypeId:'',
  name:'',
  prizePool:'',
  ticketPrice:'',
  maxEntries:'',
  minEntries:'',
  drawDate:'',
  drawstartDate:'',
  drawendDate:'',
  description:'',
  rngSeedHash:'',
  status:'draft',
  isGuaranteed:true
});

const [loading,setLoading] = useState(false);

// ✅ Message state
const [message, setMessage] = useState<{
  type: 'success' | 'error' | null;
  text: string;
}>({
  type: null,
  text: ''
});

const handleChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
) => {
  const target = e.target;
  const { name, type } = target;
  const value = type === 'checkbox'
    ? (target as HTMLInputElement).checked
    : target.value;

  setFormData(prev => ({
    ...prev,
    [name]: value
  }));
};

// ✅ show popup
const showMessage = (type: 'success' | 'error', text: string) => {
  setMessage({ type, text });

  setTimeout(() => {
    setMessage({ type: null, text: '' });
  }, 2500);
};

const handleSubmit = async () => {

if(
  formData.gameTypeId === '' ||
  formData.name === '' ||
  formData.prizePool === '' ||
  formData.ticketPrice === '' ||
  formData.maxEntries === '' ||
  formData.drawDate === '' ||
  formData.drawstartDate === '' ||
  formData.drawendDate === ''
) {
  showMessage('error', 'Please fill required fields ❌');
  return;
}

try{

setLoading(true);

const response = await fetch(
  "http://localhost:10000/api/create-draw",
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      game_type_id: Number(formData.gameTypeId),
      name: formData.name,
      prize_pool: Number(formData.prizePool),
      ticket_price: Number(formData.ticketPrice),
      max_entries: Number(formData.maxEntries),
      min_entries: Number(formData.minEntries),

      draw_date: new Date(formData.drawDate).toISOString(),
      draw_start_date: new Date(formData.drawstartDate).toISOString(),
      draw_end_date: new Date(formData.drawendDate).toISOString(),

      description: formData.description,
      rng_seed_hash: formData.rngSeedHash,
      status: formData.status,
      is_guaranteed: formData.isGuaranteed
    })
  }
);

if(!response.ok) throw new Error();

showMessage('success', 'Draw created successfully 🎉');

setFormData({
gameTypeId:'',
name:'',
prizePool:'',
ticketPrice:'',
maxEntries:'',
minEntries:'',
drawDate:'',
drawstartDate:'',
drawendDate:'',
description:'',
rngSeedHash:'',
status:'draft',
isGuaranteed:true
});

}catch{
showMessage('error', 'Error creating draw ❌');
}finally{
setLoading(false);
}

};

const inputClass =
"border border-gray-300 bg-white text-black p-3 w-full rounded focus:outline-none focus:ring-2 focus:ring-yellow-400";

return (

<div className="space-y-8">

<Link href="/admin/draws" className="text-blue-500 text-sm">
← Back
</Link>

{/* ✅ POPUP CARD */}
{message.type && (
  <div className="fixed inset-0 flex items-center justify-center z-50">

    {/* overlay */}
    <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>

    {/* popup */}
    <div
      className={`relative z-10 w-full max-w-md p-6 rounded-2xl shadow-2xl border text-center 
      ${message.type === 'success'
        ? 'bg-green-100 border-green-400 text-green-900'
        : 'bg-red-100 border-red-400 text-red-900'}`}
    >

      {/* ❌ Close button RIGHT */}
      <button
        onClick={() => setMessage({ type: null, text: '' })}
        className="absolute top-3 right-3 text-lg font-bold hover:scale-110"
      >
        ✕
      </button>

      {/* Icon */}
      <div className="text-3xl mb-2">
        {message.type === 'success' ? '✅' : '❌'}
      </div>

      {/* Message */}
      <div className="text-lg font-semibold">
        {message.text}
      </div>

    </div>

  </div>
)}

<div className="bg-white p-8 rounded-xl shadow max-w-4xl">

<h2 className="text-xl font-semibold text-black mb-6">
Create Draw
</h2>

{/* ✅ updated spacing */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-10">

<div>
<label className="text-sm text-black mb-1 block">Game Type ID</label>
<input type="number" name="gameTypeId" value={formData.gameTypeId} onChange={handleChange} className={inputClass} />
</div>

<div>
<label className="text-sm text-black mb-1 block">Draw Name</label>
<input type="text" name="name" value={formData.name} onChange={handleChange} className={inputClass} />
</div>

<div>
<label className="text-sm text-black mb-1 block">Prize Pool</label>
<input type="number" name="prizePool" value={formData.prizePool} onChange={handleChange} className={inputClass} />
</div>

<div>
<label className="text-sm text-black mb-1 block">Ticket Price</label>
<input type="number" name="ticketPrice" value={formData.ticketPrice} onChange={handleChange} className={inputClass} />
</div>

<div>
<label className="text-sm text-black mb-1 block">Max Entries</label>
<input type="number" name="maxEntries" value={formData.maxEntries} onChange={handleChange} className={inputClass} />
</div>

<div>
<label className="text-sm text-black mb-1 block">Min Entries</label>
<input type="number" name="minEntries" value={formData.minEntries} onChange={handleChange} className={inputClass} />
</div>

<div>
<label className="text-sm text-black mb-1 block">Draw Date</label>
<input type="datetime-local" name="drawDate" value={formData.drawDate} onChange={handleChange} className={inputClass} />
</div>

<div>
<label className="text-sm text-black mb-1 block">Draw Start Date</label>
<input type="datetime-local" name="drawstartDate" value={formData.drawstartDate} onChange={handleChange} className={inputClass} />
</div>

<div>
<label className="text-sm text-black mb-1 block">Draw End Date</label>
<input type="datetime-local" name="drawendDate" value={formData.drawendDate} onChange={handleChange} className={inputClass} />
</div>

<div>
<label className="text-sm text-black mb-1 block">RNG Seed Hash</label>
<input type="text" name="rngSeedHash" value={formData.rngSeedHash} onChange={handleChange} className={inputClass} />
</div>

<div>
<label className="text-sm text-black mb-1 block">Status</label>
<select name="status" value={formData.status} onChange={handleChange} className={inputClass}>
<option value="draft">Draft</option>
<option value="scheduled">Scheduled</option>
<option value="live">Live</option>
<option value="completed">Completed</option>
</select>
</div>

<div className="flex items-center mt-6">
<input type="checkbox" name="isGuaranteed" checked={formData.isGuaranteed} onChange={handleChange} className="mr-2" />
<span className="text-black text-sm">Guaranteed Draw</span>
</div>

</div>

<div className="mt-6">
<label className="text-sm text-black mb-1 block">Description</label>
<textarea name="description" value={formData.description} onChange={handleChange} className={inputClass} rows={4} />
</div>

<button
onClick={handleSubmit}
disabled={loading}
className="bg-yellow-500 mt-6 px-6 py-3 rounded font-semibold w-full disabled:opacity-50 text-black"
>
{loading ? "Creating..." : "Create Draw"}
</button>

</div>

</div>
);
}
'use client';

import { useState, useEffect } from 'react';

interface Category {
  id: number;
  name: string;
  description: string;
  icon: string | null;
  isActive: boolean;
  createdAt: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('🎮');

  // Fetch Categories
  const fetchCategories = async () => {
    try {
      // Assuming the backend endpoint is /api/categories or /api/game-types
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/categories`);
      if (res.ok) {
        const data = await res.json();
        // Handle varied formats: [] or { data: [] }
        setCategories(Array.isArray(data) ? data : data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description, icon }),
      });

      if (res.ok) {
        setName('');
        setDescription('');
        setIcon('🎮');
        fetchCategories(); // Refresh list
        alert('Category added successfully!');
      } else {
        const errorData = await res.json();
        alert(`Error: ${errorData.error || 'Failed to add category'}`);
      }
    } catch (error) {
      console.error('Submit Error:', error);
      alert('An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Area */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Game Categories</h1>
        <p className="text-sm text-gray-500 mt-1">Manage lottery game types and their metadata.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* CREATE CATEGORY FORM */}
        <div className="md:col-span-1 bg-white border border-[#e5e7eb] rounded-2xl p-6 shadow-sm self-start">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Create New Category</h2>
          
          <form onSubmit={handleCreateCategory} className="space-y-4">
            <div>
              <label className="block text-[13px] font-semibold text-gray-700 mb-1">Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Mega Millions"
                className="w-full bg-[#f9fafb] border border-[#e5e7eb] rounded-xl px-4 py-2.5 text-[13px] outline-none focus:border-[#d97706] transition-colors"
                required
              />
            </div>
            
            <div>
              <label className="block text-[13px] font-semibold text-gray-700 mb-1">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of the game type"
                rows={3}
                className="w-full bg-[#f9fafb] border border-[#e5e7eb] rounded-xl px-4 py-2.5 text-[13px] outline-none focus:border-[#d97706] transition-colors"
              />
            </div>

            <div>
              <label className="block text-[13px] font-semibold text-gray-700 mb-1">Icon (Emoji)</label>
              <input
                type="text"
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                maxLength={2}
                className="w-20 bg-[#f9fafb] border border-[#e5e7eb] rounded-xl px-4 py-2.5 text-[13px] lg:text-lg outline-none focus:border-[#d97706] transition-colors text-center"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full font-bold px-6 py-3 rounded-xl transition-colors text-[13px] mt-4 ${
                isLoading 
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                  : 'bg-[#d97706] text-white hover:bg-[#b45309]'
              }`}
            >
              {isLoading ? 'Creating...' : '+ Add Category'}
            </button>
          </form>
        </div>

        {/* CATEGORIES LIST TABLE */}
        <div className="md:col-span-2 bg-white border border-[#e5e7eb] rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
             <h2 className="text-lg font-bold text-gray-900">Existing Categories</h2>
             <span className="bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1 rounded-full">
               Total: {categories.length}
             </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="border-b border-[#e5e7eb]">
                  <th className="py-3 px-4 text-left text-[11px] font-semibold text-[#4b5563] uppercase tracking-wider">Icon</th>
                  <th className="py-3 px-4 text-left text-[11px] font-semibold text-[#4b5563] uppercase tracking-wider">Name</th>
                  <th className="py-3 px-4 text-left text-[11px] font-semibold text-[#4b5563] uppercase tracking-wider">Description</th>
                  <th className="py-3 px-4 text-left text-[11px] font-semibold text-[#4b5563] uppercase tracking-wider">Status</th>
                  <th className="py-3 px-4 text-left text-[11px] font-semibold text-[#4b5563] uppercase tracking-wider">Date Created</th>
                </tr>
              </thead>
              <tbody>
                {categories.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-gray-500">
                      No categories found. Start by adding one.
                    </td>
                  </tr>
                ) : (
                  categories.map((cat) => (
                    <tr key={cat.id} className="border-b border-[#f3f4f6] hover:bg-[#f9fafb]">
                      <td className="py-3 px-4 text-xl">{cat.icon || '🎲'}</td>
                      <td className="py-3 px-4 font-semibold text-[#111827]">{cat.name}</td>
                      <td className="py-3 px-4 text-[#6b7280] max-w-xs truncate">{cat.description || '-'}</td>
                      <td className="py-3 px-4">
                        {cat.isActive ? (
                          <span className="bg-green-100 text-green-800 text-[10px] font-bold px-2 py-1 rounded-full">ACTIVE</span>
                        ) : (
                          <span className="bg-red-100 text-red-800 text-[10px] font-bold px-2 py-1 rounded-full">INACTIVE</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-[#6b7280]">
                        {new Date(cat.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

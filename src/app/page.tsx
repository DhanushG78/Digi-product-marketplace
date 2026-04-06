"use client";

import { useItems, ItemForm } from "@/modules/items";
import { ItemCard } from "@/components/ui/ItemCard";
import { Hero } from "@/components/sections/Hero";
import { useAppConfig } from "@/hooks/useAppConfig";
import { useState, useMemo, useEffect } from "react";
import { useStore } from "@/store/useStore";
import { useSearchStore } from "@/store/searchStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { Filter, X } from "lucide-react";

export default function Home() {
  const { items, loading, fetchItems } = useItems();
  const { getTerminology } = useAppConfig();
  const [editingItem, setEditingItem] = useState<any>(null);
  const user = useStore((state) => state.user);
  const { wishlist, fetchWishlist } = useWishlistStore();
  
  useEffect(() => {
    if (user) {
      fetchWishlist();
    }
  }, [user, fetchWishlist]);
  
  const {
    searchQuery,
    categoryFilter,
    setCategoryFilter,
    priceFilter,
    setPriceFilter,
    fileTypeFilter,
    setFileTypeFilter,
    tagsFilter,
    setTagsFilter,
    clearFilters
  } = useSearchStore();

  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const categories = ['Template', 'Ebook', 'UI-Kit', 'Asset'];
  const fileTypes = ['pdf', 'figma', 'zip', 'png'];
  const commonTags = ['notion', 'dashboard', 'figma', 'productivity', 'saas', 'admin'];

  // Combine ALL filters and search
  const filteredItems = useMemo(() => {
    return items.filter((item: any) => {
      // 1. Search Query mapping
      const q = searchQuery.toLowerCase();
      const title = String(item.title || "").toLowerCase();
      const creator = String(item.creatorName || "").toLowerCase();
      const tags: string[] = Array.isArray(item.tags) ? item.tags : [];
      
      const matchesSearch = !q || title.includes(q) || creator.includes(q) || tags.some(t => String(t).toLowerCase().includes(q));

      // 2. Category mapping
      const matchesCategory = categoryFilter.length === 0 || categoryFilter.includes(String(item.category).toLowerCase());

      // 3. File Type mapping
      const matchesFileType = fileTypeFilter.length === 0 || fileTypeFilter.includes(String(item.fileType).toLowerCase());

      // 4. Tags mapping
      const matchesTags = tagsFilter.length === 0 || tagsFilter.every(tag => tags.map(t => String(t).toLowerCase()).includes(tag.toLowerCase()));

      // 5. Price mapping
      const priceVal = Number(item.price) || 0;
      let matchesPrice = true;
      if (priceFilter === 'free') matchesPrice = priceVal === 0;
      if (priceFilter === 'paid') matchesPrice = priceVal > 0;

      return matchesSearch && matchesCategory && matchesFileType && matchesTags && matchesPrice;
    });
  }, [items, searchQuery, categoryFilter, fileTypeFilter, tagsFilter, priceFilter]);

  const toggleArrayFilter = (arr: string[], val: string, setter: (val: string[]) => void) => {
    if (arr.includes(val)) {
      setter(arr.filter((v) => v !== val));
    } else {
      setter([...arr, val]);
    }
  };

  return (
    <>
      <Hero />
      
      <div id="browse" className="min-h-screen bg-gray-50 dark:bg-gray-950 p-4 md:p-12">
        <div className="max-w-[85rem] mx-auto space-y-12">
          
          {/* Admin Form */}
          {user?.role === "seller" && (
            <section className="bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 transition-all">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{editingItem ? 'Editing Product' : 'Create New Product'}</h2>
                {editingItem && (
                  <button 
                    onClick={() => setEditingItem(null)} 
                    className="text-sm font-semibold text-violet-600 hover:text-violet-500 hover:underline px-4 py-2 bg-violet-50 dark:bg-violet-900/20 rounded-full"
                  >
                    Cancel Edit
                  </button>
                )}
              </div>
              <ItemForm 
                key={editingItem ? editingItem.id : "new-post"} 
                initialData={editingItem || {}} 
                onSuccess={() => {
                  setEditingItem(null);
                  fetchItems();
                }} 
              />
            </section>
          )}

          {/* Browse Section */}
          <section className="flex flex-col lg:flex-row gap-8 relative">
            
            {/* Mobile Filters Toggle Button */}
            <div className="lg:hidden flex items-center justify-between w-full bg-white dark:bg-gray-900 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Products ({filteredItems.length})</h2>
              <button 
                onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
                className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-xl text-sm font-bold shadow-sm"
              >
                <Filter size={16} /> Filters
              </button>
            </div>

            {/* Sidebar / Filters Panel */}
            <aside className={`w-full lg:w-72 flex-shrink-0 transition-all duration-300 ${isMobileFiltersOpen ? 'block' : 'hidden lg:block'}`}>
              <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm sticky top-24">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-xl text-gray-900 dark:text-gray-100 flex items-center gap-2">
                    <Filter size={20} />
                    Filters
                  </h3>
                  <button onClick={() => setIsMobileFiltersOpen(false)} className="lg:hidden text-gray-400 hover:text-gray-600">
                    <X size={20} />
                  </button>
                </div>
                
                <div className="space-y-8">
                  {/* Price Filter */}
                  <div>
                    <label className="block text-sm font-bold text-gray-900 dark:text-gray-100 mb-3 uppercase tracking-wider">Pricing</label>
                    <div className="flex p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
                      {['all', 'free', 'paid'].map(type => (
                        <button 
                          key={type}
                          onClick={() => setPriceFilter(type)}
                          className={`flex-1 py-1.5 text-sm font-semibold capitalize rounded-lg transition-colors ${priceFilter === type ? 'bg-white dark:bg-gray-900 shadow-sm text-violet-600 dark:text-violet-400' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Category Filter */}
                  <div>
                    <label className="block text-sm font-bold text-gray-900 dark:text-gray-100 mb-3 uppercase tracking-wider">Category</label>
                    <div className="flex flex-wrap gap-2">
                       {categories.map((cat) => {
                         const val = cat.toLowerCase();
                         const isActive = categoryFilter.includes(val);
                         return (
                           <button 
                              key={cat}
                              onClick={() => toggleArrayFilter(categoryFilter, val, setCategoryFilter)}
                              className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all border ${isActive ? 'bg-black text-white border-black dark:bg-white dark:text-black dark:border-white shadow-md' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 dark:bg-gray-900 dark:text-gray-400 dark:border-gray-800 hover:dark:border-gray-600'}`}
                           >
                             {cat}
                           </button>
                         )
                       })}
                    </div>
                  </div>

                  {/* File Type Filter */}
                  <div>
                    <label className="block text-sm font-bold text-gray-900 dark:text-gray-100 mb-3 uppercase tracking-wider">File Type</label>
                    <div className="flex flex-wrap gap-2">
                       {fileTypes.map((type) => {
                         const isActive = fileTypeFilter.includes(type);
                         return (
                           <button 
                              key={type}
                              onClick={() => toggleArrayFilter(fileTypeFilter, type, setFileTypeFilter)}
                              className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all border ${isActive ? 'bg-black text-white border-black dark:bg-white dark:text-black dark:border-white shadow-md' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 dark:bg-gray-900 dark:text-gray-400 dark:border-gray-800 hover:dark:border-gray-600'}`}
                           >
                             {type.toUpperCase()}
                           </button>
                         )
                       })}
                    </div>
                  </div>

                  {/* Tags */}
                  <div>
                    <label className="block text-sm font-bold text-gray-900 dark:text-gray-100 mb-3 uppercase tracking-wider">Popular Tags</label>
                    <div className="flex flex-wrap gap-2">
                       {commonTags.map((tag) => {
                         const isActive = tagsFilter.includes(tag);
                         return (
                           <button 
                              key={tag}
                              onClick={() => toggleArrayFilter(tagsFilter, tag, setTagsFilter)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${isActive ? 'bg-violet-50 text-violet-600 border-violet-200 dark:bg-violet-900/30 dark:border-violet-800 dark:text-violet-400' : 'bg-gray-50 text-gray-500 border-transparent hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'}`}
                           >
                             #{tag}
                           </button>
                         )
                       })}
                    </div>
                  </div>

                </div>
                
                <button
                  onClick={clearFilters}
                  className="mt-8 w-full py-3 px-4 bg-gray-50 hover:bg-red-50 text-gray-600 hover:text-red-600 dark:bg-gray-800 dark:hover:bg-red-900/20 dark:text-gray-300 dark:hover:text-red-400 font-bold rounded-xl transition-colors text-sm"
                >
                  Clear All Filters
                </button>
              </div>
            </aside>

            {/* Grid Layout */}
            <div className="flex-1">
              <div className="hidden lg:flex flex-col sm:flex-row items-baseline justify-between mb-8 gap-4">
                <h2 className="text-3xl font-black tracking-tight text-gray-900 dark:text-gray-100">
                  Trending {getTerminology(2)} 
                </h2>
                <span className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 text-sm py-1.5 px-4 rounded-full font-bold border border-gray-100 dark:border-gray-800 shadow-sm">
                  {filteredItems.length} items
                </span>
              </div>
              
              {loading ? (
                 <div className="py-24 flex flex-col items-center justify-center w-full bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl shadow-sm">
                   <div className="w-10 h-10 border-4 border-gray-200 border-t-violet-600 rounded-full animate-spin mb-4"></div>
                   <p className="text-gray-500 dark:text-gray-400 font-medium text-lg">Loading {getTerminology(2).toLowerCase()}...</p>
                 </div>
              ) : filteredItems.length === 0 ? (
                 <div className="py-24 flex flex-col items-center justify-center w-full bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl shadow-sm text-center px-4">
                   <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4 text-gray-400">
                     <Filter size={32} />
                   </div>
                   <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No products found</h3>
                   <p className="text-gray-500 dark:text-gray-400 font-medium max-w-sm mx-auto">Try adjusting your filters or search terms to find what you're looking for.</p>
                   <button 
                     onClick={clearFilters}
                     className="mt-6 px-6 py-2 bg-gray-100 dark:bg-gray-800 rounded-xl text-gray-700 dark:text-gray-300 font-bold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                   >
                     Clear all filters
                   </button>
                 </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                  {filteredItems.map((item: any) => (
                      <ItemCard 
                        key={item.id} 
                        item={item} 
                        onEdit={user?.role === 'seller' ? (i) => setEditingItem(i) : undefined}
                        onDelete={user?.role === 'seller' ? fetchItems : undefined}
                      />
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}

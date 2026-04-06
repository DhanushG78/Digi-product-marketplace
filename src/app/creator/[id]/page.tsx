"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { itemService } from "@/modules/items/services/item.service";
import { BaseItem } from "@/modules/items";
import { ItemCard } from "@/components/ui/ItemCard";
import { User, Download } from "lucide-react";

export default function CreatorProfilePage() {
  const { id } = useParams();
  const [items, setItems] = useState<BaseItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    itemService.getItems().then((all) => {
      // Filter items by creatorId
      const creatorItems = all.filter(item => item.creatorId === id);
      setItems(creatorItems);
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><div className="w-10 h-10 border-4 border-violet-600 border-t-transparent rounded-full animate-spin"></div></div>;
  }

  const creatorName = items.length > 0 ? items[0].creatorName : "Unknown Creator";
  const dummyDownloads = items.length * 142 + 56; // dummy formula

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Cover / Header */}
      <div className="h-48 md:h-64 bg-gradient-to-r from-violet-600 to-indigo-700 w-full relative"></div>
      
      <div className="max-w-7xl mx-auto px-6 md:px-12 pb-12 relative -top-16">
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col md:flex-row items-center md:items-end gap-6 mb-12 relative overflow-hidden">
           <div className="w-32 h-32 bg-gray-200 dark:bg-gray-800 rounded-2xl flex items-center justify-center text-gray-500 shadow-md border-4 border-white dark:border-gray-900 z-10 shrink-0">
              <User className="w-16 h-16" />
           </div>
           <div className="flex-1 text-center md:text-left z-10">
              <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2">{creatorName}</h1>
              <p className="text-gray-500 dark:text-gray-400 max-w-lg mb-4">
                Digital creator building tools, templates, and assets for modern creators.
              </p>
           </div>
           <div className="flex items-center gap-6 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-2xl z-10 min-w-[200px] justify-center md:justify-start shadow-sm border border-gray-100 dark:border-gray-800">
             <div className="text-center">
               <div className="text-2xl font-black text-gray-900 dark:text-white">{items.length}</div>
               <div className="text-xs text-gray-500 uppercase tracking-wider font-bold">Products</div>
             </div>
             <div className="w-px h-10 bg-gray-200 dark:bg-gray-700"></div>
             <div className="text-center">
               <div className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-1 justify-center"><Download size={18} className="text-violet-500" /> {dummyDownloads.toLocaleString()}</div>
               <div className="text-xs text-gray-500 uppercase tracking-wider font-bold">Downloads</div>
             </div>
           </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 border-b border-gray-200 dark:border-gray-800 pb-4">
            Products by {creatorName}
          </h2>
          
          {items.length === 0 ? (
            <p className="text-gray-500">This creator has no products available right now.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {items.map((item) => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

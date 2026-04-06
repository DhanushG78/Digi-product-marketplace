"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { itemService } from "@/modules/items/services/item.service";
import { BaseItem } from "@/modules/items";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { ShoppingCart, Heart, Check, ShieldCheck, FileIcon, Lock } from "lucide-react";
import Link from "next/link";
import { useStore } from "@/store/useStore";
import toast from "react-hot-toast";

export default function ItemDetailPage() {
  const { id } = useParams();
  const [item, setItem] = useState<BaseItem | null>(null);
  const [loading, setLoading] = useState(true);

  const { cart, addToCart } = useCartStore();
  const { wishlist, toggleWishlist } = useWishlistStore();
  const user = useStore(s => s.user);

  useEffect(() => {
    if (id) {
      itemService.getItemById(id as string).then(data => {
        setItem(data);
        setLoading(false);
      }).catch(err => {
        console.error("Failed to load item:", err);
        setLoading(false);
      });
    }
  }, [id]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><div className="w-10 h-10 border-4 border-violet-600 border-t-transparent rounded-full animate-spin"></div></div>;
  }

  if (!item) {
    return <div className="min-h-screen flex items-center justify-center font-bold text-gray-500">Product not found.</div>;
  }

  const isWishlisted = wishlist.some(w => w.id === item.id);
  const isInCart = cart.some(c => c.id === item.id);
  const isFree = Number(item.price) === 0;

  const imageValue = item.previewImages;
  const imgSrc = Array.isArray(imageValue) ? imageValue[0] : imageValue;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 p-6 md:p-12">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left: Image Config */}
        <div className="relative rounded-3xl overflow-hidden bg-gray-100 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm">
          <img src={imgSrc || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80"} alt={item.title} className="w-full h-auto object-cover" />
          {user?.role === "buyer" && (
            <button 
               onClick={async () => {
                  if (!user) {
                     toast.error("Please sign in to wishlist");
                     return;
                  }
                  await toggleWishlist(item as any);
                  toast.success(isWishlisted ? "Removed from wishlist" : "Added to wishlist");
               }}
               className="absolute top-4 right-4 bg-white/80 dark:bg-black/80 backdrop-blur-md p-3 rounded-full hover:scale-110 transition-transform shadow-sm"
            >
               <Heart className={isWishlisted ? "fill-red-500 text-red-500" : "text-gray-600 dark:text-gray-400"} />
            </button>
          )}
        </div>

        {/* Right: Info Config */}
        <div className="flex flex-col">
          <div className="mb-6">
            <span className="inline-block px-3 py-1 bg-gray-100 dark:bg-gray-800 text-sm font-semibold rounded-full mb-4 uppercase text-gray-600 dark:text-gray-400">
              {item.category || "Digital Product"}
            </span>
            <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-2">{item.title}</h1>
            <Link href={`/creator/${item.creatorId}`} className="text-violet-600 hover:underline font-medium">By {item.creatorName || "Unknown Creator"}</Link>
          </div>

          <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-8 text-lg">
            {item.description || "No description provided."}
          </p>

          <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 mb-8 space-y-6">
            <div className="flex items-end gap-4">
              <span className="text-5xl font-black text-gray-900 dark:text-white">
                {isFree ? "Free" : `$${Number(item.price).toLocaleString()}`}
              </span>
              {!isFree && <span className="text-gray-500 font-medium mb-1 line-through">${(Number(item.price) * 1.2).toLocaleString()}</span>}
            </div>

            <div className="flex gap-4">
               <button 
                  onClick={() => {
                     addToCart(item as any);
                     if (!isInCart) toast.success("Added to cart!");
                  }}
                  disabled={isInCart}
                  className="flex-1 bg-violet-600 disabled:bg-violet-800 disabled:opacity-50 text-white py-4 rounded-xl font-bold shadow-md hover:bg-violet-700 transition-colors flex items-center justify-center gap-2 text-lg"
               >
                  {isInCart ? <><Check size={20} /> In Cart</> : <><ShoppingCart size={20} /> Add to Cart</>}
               </button>
            </div>
          </div>

          <div className="space-y-4">
             <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
               <ShieldCheck className="text-green-500" />
               <span>Secure payment and instant delivery.</span>
             </div>
             <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
               <FileIcon className="text-violet-500" />
               <span className="uppercase">Included format: {item.fileType || 'ZIP'}</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

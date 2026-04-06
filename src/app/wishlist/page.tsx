"use client";

import { useWishlistStore } from "@/store/wishlistStore";
import { ItemCard } from "@/components/ui/ItemCard";
import { Heart } from "lucide-react";
import Link from "next/link";

export default function WishlistPage() {
  const { wishlist } = useWishlistStore();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-8 flex items-center gap-3">
          <Heart className="w-8 h-8 text-red-500 fill-red-500" />
          Your Wishlist
        </h1>

        {wishlist.length === 0 ? (
          <div className="bg-white dark:bg-gray-900 rounded-3xl p-12 text-center shadow-sm border border-gray-100 dark:border-gray-800">
            <Heart className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-700 mb-4" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Your wishlist is empty</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-8">Save your favorite digital products here to purchase later.</p>
            <Link href="/" className="inline-flex items-center justify-center px-6 py-3 bg-black dark:bg-white text-white dark:text-black font-semibold rounded-xl hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors">
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlist.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

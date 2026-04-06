"use client";

import Link from "next/link";
import { useStore } from "@/store/useStore";
import { appConfig } from "@/config/appConfig";
import { Search, ShoppingCart, User, Menu, Bell, Heart, X } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { useSearchStore } from "@/store/searchStore";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import toast from "react-hot-toast";

export const Navbar = () => {
  const user = useStore((state) => state.user);
  const setUser = useStore((state) => state.setUser);
  const cart = useCartStore((state) => state.cart);
  const wishlist = useWishlistStore((state) => state.wishlist);
  const { searchQuery, setSearchQuery, categoryFilter, clearFilters, setCategoryFilter } = useSearchStore();
  const router = useRouter();
  const pathname = usePathname();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (pathname !== "/") {
      router.push("/");
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl backdrop-saturate-150 border-b border-gray-200/50 dark:border-gray-800/50 shadow-sm transition-all">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4 sm:gap-8">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-2 lg:gap-4 shrink-0">
            <button className="lg:hidden p-2 text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white transition">
              <Menu size={24} />
            </button>
            <Link href="/" className="flex items-center gap-2 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black dark:bg-white text-white dark:text-black shadow-md transition-transform group-hover:scale-105">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-2xl font-black tracking-tight text-gray-900 dark:text-white hidden sm:block">
                {appConfig.appName}
              </span>
            </Link>
          </div>

          {/* Search Bar (Center) */}
          <div className="flex-1 max-w-2xl hidden md:flex">
            <div className="relative w-full group">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 group-focus-within:text-violet-500 transition-colors">
                <Search size={20} />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search templates, ebooks, creators..."
                className="w-full rounded-full border border-gray-200/80 bg-gray-50/80 dark:bg-gray-900/80 py-2.5 pl-10 pr-10 text-sm text-gray-900 dark:text-gray-100 focus:bg-white dark:focus:bg-gray-950 focus:border-violet-500/50 focus:outline-none focus:ring-4 focus:ring-violet-500/10 shadow-inner transition-all"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery("")}
                  className="absolute inset-y-0 right-2 flex items-center text-gray-400 hover:text-gray-600"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            {(!user || user.role === "buyer") && (
              <Link href="/wishlist" className="relative flex p-2 text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white transition rounded-full hover:bg-gray-100 dark:hover:bg-gray-900">
                <Heart size={22} className={wishlist.length > 0 ? "text-red-500" : ""} />
                {wishlist.length > 0 && (
                  <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center -mr-1 -mt-1">
                    {wishlist.length}
                  </span>
                )}
              </Link>
            )}
            <Link href="/cart" className="relative flex p-2 text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white transition rounded-full hover:bg-gray-100 dark:hover:bg-gray-900">
              <ShoppingCart size={22} className={cart.length > 0 ? "text-violet-600" : ""} />
              {cart.length > 0 && (
                <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-violet-600 text-white text-[10px] font-bold flex items-center justify-center -mr-1 -mt-1">
                  {cart.length}
                </span>
              )}
            </Link>
            
            <div className="h-6 w-px bg-gray-200 dark:bg-gray-800 mx-1 hidden sm:block"></div>

            {user ? (
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex flex-col items-end">
                  <span className="text-sm font-bold text-gray-900 dark:text-white leading-none mb-1">{user.name || user.email?.split('@')[0]}</span>
                  <span className="text-[10px] py-0.5 px-2 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">{user.role}</span>
                </div>
                <button
                  onClick={async () => {
                    await signOut(auth);
                    toast.success("Signed out");
                  }}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700 transition"
                  title="Logout"
                >
                  <User size={20} />
                </button>
                {user.role === "seller" && (
                  <Link href="/dashboard" className="hidden lg:flex px-4 py-2 text-sm font-bold text-violet-600 bg-violet-50 hover:bg-violet-100 dark:bg-violet-900/20 dark:hover:bg-violet-900/40 rounded-full transition">
                    Dashboard
                  </Link>
                )}
              </div>
            ) : (
              <div className="flex gap-2">
                <Link
                  href="/login"
                  className="hidden sm:flex px-4 py-2 text-sm font-bold text-gray-700 hover:text-black dark:text-gray-300 dark:hover:text-white transition"
                >
                  Log in
                </Link>
                <Link
                  href="/login"
                  className="px-5 py-2 text-sm font-bold text-white bg-black dark:bg-white dark:text-black rounded-full hover:bg-gray-800 dark:hover:bg-gray-100 shadow-md transition transform hover:-translate-y-0.5"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Categories Bar */}
      <div className="border-t border-gray-100 dark:border-gray-800 bg-white/50 dark:bg-gray-950/50 hidden md:block">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ul className="flex items-center gap-8 py-2.5 overflow-x-auto no-scrollbar text-sm font-medium text-gray-600 dark:text-gray-400">
            {['All', 'Template', 'UI-Kit', 'Ebook', 'Asset', 'Plugin'].map((cat) => {
              const isActive = cat === 'All' 
                ? categoryFilter.length === 0
                : categoryFilter.includes(cat.toLowerCase());

              return (
                <li key={cat}>
                  <button 
                    onClick={() => {
                       if (cat === 'All') {
                          clearFilters();
                       } else {
                          setCategoryFilter([cat.toLowerCase()]);
                       }
                       if (pathname !== "/") {
                          router.push("/");
                       } else {
                          const browseSection = document.getElementById('browse');
                          if (browseSection) {
                             browseSection.scrollIntoView({ behavior: 'smooth' });
                          }
                       }
                    }}
                    className={`whitespace-nowrap transition-colors relative group ${isActive ? 'text-black dark:text-white font-bold' : 'hover:text-black dark:hover:text-white'}`}
                  >
                    {cat === 'UI-Kit' ? 'UI Kits' : cat + (cat !== 'All' ? 's' : '')}
                    <span className={`absolute -bottom-2.5 left-0 h-0.5 bg-black dark:bg-white transition-all ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </nav>
  );
};

"use client";

import { useCartStore } from "@/store/cartStore";
import Link from "next/link";
import { CheckCircle, Download, Lock } from "lucide-react";
import { useEffect, useState } from "react";
import { BaseItem } from "@/modules/items";
import { auth, db } from "@/lib/firebase";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import toast from "react-hot-toast";

export default function PaymentSuccessPage() {
  const { cart, clearCart } = useCartStore();
  const [purchasedItems, setPurchasedItems] = useState<BaseItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const processPurchase = async () => {
      const user = auth.currentUser;
      if (!user) {
        setLoading(false);
        return;
      }

      if (cart.length > 0) {
        try {
          // Prevent exact duplicate inserts in development (Strict Mode double-invoke)
          const newPurchases: BaseItem[] = [];
          for (const item of cart) {
            // Check if already processed in memory
            if (!purchasedItems.find(p => p.id === item.id)) {
               await addDoc(collection(db, "purchases"), {
                 userId: user.uid,
                 productId: item.id,
                 purchasedAt: new Date().toISOString(),
                 price: item.price,
                 title: item.title,
                 fileType: item.fileType || 'digital-asset'
               });
               newPurchases.push(item);
            }
          }
          
          setPurchasedItems(prev => {
             const merged = [...prev, ...newPurchases];
             // Ensure uniqueness by ID
             return merged.filter((obj, index, arr) => 
               arr.findIndex(o => o.id === obj.id) === index
             );
          });
          clearCart();
          toast.success("Purchases synced with account!");
        } catch (error) {
          console.error("Purchase sync error:", error);
          toast.error("Failed to sync purchases to account.");
        }
      } else {
        // If cart is empty, maybe they refreshed. Try to fetch from Firestore purchases
        try {
           const q = query(collection(db, "purchases"), where("userId", "==", user.uid));
           const snap = await getDocs(q);
           const historical = snap.docs.map(doc => ({ id: doc.data().productId, ...doc.data() } as any));
           
           // Deduplicate historical purchases
           const uniqueHistorical = historical.filter((obj, index, arr) => 
             arr.findIndex(o => o.id === obj.id) === index
           );
           setPurchasedItems(uniqueHistorical);
        } catch (e) {}
      }
      setLoading(false);
    };

    processPurchase();
  }, [cart, clearCart]);

  const handleDownload = (title: string) => {
    toast.success(`Downloading ${title}...`);
  }

  if (!auth.currentUser) {
     return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
           <div className="text-center bg-white dark:bg-gray-900 p-10 rounded-3xl shadow-xl max-w-md w-full border border-gray-100 dark:border-gray-800">
              <Lock className="mx-auto mb-4 text-red-500" size={48} />
              <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2">Access Denied</h2>
              <p className="text-gray-500 mb-6 font-medium">Please sign in to access your digital downloads.</p>
              <Link href="/login" className="inline-block w-full bg-black dark:bg-white text-white dark:text-black py-4 rounded-xl font-bold transition-transform hover:scale-105">
                 Go to Sign In
              </Link>
           </div>
        </div>
     );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6 md:p-12 flex items-center justify-center">
      <div className="max-w-2xl w-full bg-white dark:bg-gray-900 rounded-3xl p-8 md:p-12 shadow-xl border border-gray-100 dark:border-gray-800 text-center relative overflow-hidden">
        
        {/* Decorative Backgrounds */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-green-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-violet-400/20 rounded-full blur-3xl"></div>

        <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-green-200 dark:border-green-800/50">
          <CheckCircle className="w-12 h-12" />
        </div>
        
        <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-4">Payment Successful 🎉</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto leading-relaxed">
          The items have been added to your permanent account. Download them anytime below.
        </p>

        <div className="text-left bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-6 mb-8 shadow-inner border border-gray-100 dark:border-gray-800 relative z-10">
          <h3 className="font-bold text-gray-900 dark:text-white mb-4 uppercase tracking-wider text-sm flex items-center gap-2">
            <Download size={16} /> Your Secure Downloads
          </h3>
          
          {loading ? (
             <div className="py-10 flex flex-col items-center justify-center space-y-3">
                <div className="w-8 h-8 border-4 border-violet-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Securing access...</p>
             </div>
          ) : purchasedItems.length > 0 ? (
             <div className="space-y-3">
               {purchasedItems.map((item: any, idx) => (
                 <div key={`purchased-item-${item.id || item.productId}-${idx}`} className="flex items-center justify-between p-4 bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 group">
                    <div>
                      <p className="font-bold text-gray-900 dark:text-gray-100 mb-0.5">{item.title}</p>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">{item.fileType || 'digital-asset'}</p>
                    </div>
                    <button 
                      onClick={() => handleDownload(item.title)} 
                      className="flex items-center gap-2 px-5 py-2.5 bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 rounded-xl text-sm font-bold transition-all hover:scale-105 shadow-md"
                    >
                      <Download size={16} /> Download
                    </button>
                 </div>
               ))}
             </div>
          ) : (
             <div className="text-center py-10 bg-white dark:bg-gray-900 rounded-xl border-2 border-dashed border-gray-100 dark:border-gray-800">
                <p className="text-sm font-medium text-gray-500">No items found in your history.</p>
                <Link href="/" className="text-violet-600 text-xs font-bold uppercase mt-2 block hover:underline">Browse Market</Link>
             </div>
          )}
        </div>

        <Link href="/" className="inline-flex px-8 py-3.5 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-bold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors shadow-sm relative z-10">
          Back to Marketplace
        </Link>
      </div>
    </div>
  );
}

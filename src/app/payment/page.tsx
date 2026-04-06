"use client";

import { useCartStore } from "@/store/cartStore";
import { useStore } from "@/store/useStore";
import Link from "next/link";
import { CreditCard, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export default function PaymentPage() {
  const user = useStore((state) => state.user);
  const { cart } = useCartStore();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [enteredAmount, setEnteredAmount] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState("");

  const total = cart.reduce((sum, item) => sum + (Number(item.price) || 0), 0);

  const handlePayment = () => {
    if (user?.role !== "buyer") {
      toast.error("Only buyers can process payments.");
      return;
    }
    setErrorMsg("");

    if (!enteredAmount) {
      setErrorMsg("Please enter an amount.");
      return;
    }

    if (Number(enteredAmount) !== total) {
      setErrorMsg("Invalid price. Please enter the correct amount.");
      return;
    }

    setIsProcessing(true);
    toast.success("Payment successful! Redirecting...");
    
    setTimeout(() => {
      router.push("/payment-success");
    }, 1500); // simulate network delay
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50 dark:bg-gray-950">
        <p className="text-gray-600 dark:text-gray-400">
          Your cart is empty. <Link href="/" className="text-violet-600 hover:underline font-semibold">Go back</Link>
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6 md:p-12 flex items-center justify-center">
      <div className="max-w-md w-full bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-3 mb-8 justify-center text-violet-600 dark:text-violet-500">
          <CreditCard className="w-8 h-8" />
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">Checkout</h1>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-2xl mb-8 space-y-3 border border-gray-100 dark:border-gray-800 shadow-inner">
          <p className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
            <span>Items:</span>
            <span className="font-bold text-gray-900 dark:text-white">{cart.length}</span>
          </p>
          <div className="w-full h-px bg-gray-200 dark:bg-gray-700"></div>
          <p className="flex justify-between text-lg">
            <span className="font-semibold text-gray-900 dark:text-white">Total amount:</span>
            <span className="font-black text-violet-600 dark:text-violet-400">${total.toLocaleString()}</span>
          </p>
        </div>

        <div className="mb-6">
           <label className="block text-sm font-bold text-gray-900 dark:text-gray-100 mb-2">Confirm Payment Amount</label>
           <div className="relative">
             <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">$</span>
             <input
               type="number"
               value={enteredAmount}
               onChange={(e) => {
                 setEnteredAmount(e.target.value);
                 setErrorMsg("");
               }}
               placeholder={total.toString()}
               className="w-full pl-8 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-bold focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition-all shadow-sm"
             />
           </div>
           {errorMsg && (
             <p className="text-red-500 text-sm font-semibold mt-2 animate-pulse">{errorMsg}</p>
           )}
        </div>

        <button 
          onClick={handlePayment}
          disabled={isProcessing || !enteredAmount}
          className="w-full flex items-center justify-center gap-2 bg-black dark:bg-white text-white dark:text-black py-4 rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed"
        >
          {isProcessing ? (
            <span className="flex items-center gap-2">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white dark:border-black/30 dark:border-t-black rounded-full animate-spin"></div>
              Processing...
            </span>
          ) : (
            `Pay $${total.toLocaleString()}`
          )}
        </button>

        <p className="text-center text-xs text-gray-500 mt-6 flex items-center justify-center gap-1">
          <ShieldCheck size={14} /> Secured by Dummy Stripe
        </p>
      </div>
    </div>
  );
}

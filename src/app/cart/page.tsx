"use client";

import { useCartStore } from "@/store/cartStore";
import { appConfig } from "@/config/appConfig";
import Link from "next/link";
import { Trash2, ArrowRight, ShoppingCart } from "lucide-react";
import Image from "next/image";

export default function CartPage() {
  const { cart, removeFromCart, clearCart } = useCartStore();

  const total = cart.reduce((sum, item) => sum + (Number(item.price) || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-8 flex items-center gap-3">
          <ShoppingCart className="w-8 h-8" />
          Your Cart
        </h1>

        {cart.length === 0 ? (
          <div className="bg-white dark:bg-gray-900 rounded-3xl p-12 text-center shadow-sm border border-gray-100 dark:border-gray-800">
            <ShoppingCart className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-700 mb-4" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Your cart is empty</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-8">Looks like you haven't added any digital products to your cart yet.</p>
            <Link href="/" className="inline-flex items-center justify-center px-6 py-3 bg-black dark:bg-white text-white dark:text-black font-semibold rounded-xl hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors">
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => {
                const imageValue = item.previewImages ? item.previewImages : null;
                const imgSrc = Array.isArray(imageValue) ? imageValue[0] : imageValue;

                return (
                  <div key={item.id} className="flex gap-4 bg-white dark:bg-gray-900 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
                    <div className="w-24 h-24 flex-shrink-0 bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden relative">
                       <img src={imgSrc || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&q=80"} alt={item.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-bold text-gray-900 dark:text-gray-100 line-clamp-1">{item.title}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{item.creatorName || "Unknown Creator"}</p>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="font-black text-gray-900 dark:text-white">${Number(item.price).toLocaleString()}</span>
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded-lg transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
              <button 
                onClick={clearCart}
                className="text-sm font-semibold text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Clear Cart
              </button>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 sticky top-24">
                <h3 className="font-bold text-xl mb-6 text-gray-900 dark:text-white">Order Summary</h3>
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>Subtotal ({cart.length} items)</span>
                    <span>${total.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>Tax</span>
                    <span>$0.00</span>
                  </div>
                  <div className="border-t border-gray-100 dark:border-gray-800 pt-4 flex justify-between font-black text-xl text-gray-900 dark:text-white">
                    <span>Total</span>
                    <span>${total.toLocaleString()}</span>
                  </div>
                </div>
                
                <Link href="/payment" className="w-full flex items-center justify-center gap-2 bg-violet-600 text-white py-3.5 rounded-xl font-bold shadow-md hover:bg-violet-700 transition-colors">
                  Proceed to Payment <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

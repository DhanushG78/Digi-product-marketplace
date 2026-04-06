import { create } from "zustand";
import { persist } from "zustand/middleware";
import { BaseItem } from "@/modules/items";

interface CartStore {
  cart: BaseItem[];
  addToCart: (product: BaseItem) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cart: [],
      addToCart: (product) => {
        const { cart } = get();
        if (!cart.find((item) => item.id === product.id)) {
          set({ cart: [...cart, product] });
        }
      },
      removeFromCart: (id) =>
        set((state) => ({ cart: state.cart.filter((item) => item.id !== id) })),
      clearCart: () => set({ cart: [] }),
    }),
    {
      name: "cart-storage",
    }
  )
);

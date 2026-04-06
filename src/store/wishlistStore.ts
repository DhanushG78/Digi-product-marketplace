import { create } from "zustand";
import { 
  collection, 
  addDoc, 
  deleteDoc, 
  getDocs, 
  query, 
  where,
  onSnapshot,
  doc
} from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import { BaseItem } from "@/modules/items";

interface WishlistStore {
  wishlist: BaseItem[];
  fetchWishlist: () => void;
  toggleWishlist: (product: BaseItem) => Promise<void>;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistStore>((set, get) => ({
  wishlist: [],

  fetchWishlist: () => {
    const user = auth.currentUser;
    if (!user) {
      set({ wishlist: [] });
      return;
    }

    // Use onSnapshot for real-time updates as requested (Step 7)
    const q = query(collection(db, "wishlist"), where("userId", "==", user.uid));
    
    return onSnapshot(q, async (snapshot) => {
      // Get the product details from the products collection
      const wishlistItems = snapshot.docs.map(doc => doc.data());
      
      // In a real optimized app, we'd fetch product data concurrently
      const products: BaseItem[] = [];
      for (const item of wishlistItems) {
        const productRef = doc(db, "products", item.productId);
        const productSnap = await getDocs(query(collection(db, "products"), where("__name__", "==", item.productId))); // simplified fetch
        if (!productSnap.empty) {
            products.push({ id: productSnap.docs[0].id, ...productSnap.docs[0].data() } as BaseItem);
        }
      }
      set({ wishlist: products });
    });
  },

  toggleWishlist: async (product: BaseItem) => {
    const user = auth.currentUser;
    if (!user) return;

    const q = query(
      collection(db, "wishlist"), 
      where("userId", "==", user.uid),
      where("productId", "==", product.id)
    );
    
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      // Remove
      const docId = querySnapshot.docs[0].id;
      await deleteDoc(doc(db, "wishlist", docId));
    } else {
      // Add
      await addDoc(collection(db, "wishlist"), {
        userId: user.uid,
        productId: product.id,
        createdAt: new Date().toISOString()
      });
    }
  },

  clearWishlist: () => set({ wishlist: [] }),
}));

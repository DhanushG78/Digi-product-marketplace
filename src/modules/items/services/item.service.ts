import { 
  collection, 
  addDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDoc,
  query,
  where,
  orderBy,
  serverTimestamp 
} from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import { BaseItem, ItemFilters } from '../types';

export const itemService = {
  /**
   * Fetch all items from Firestore
   */
  async getItems(filters?: ItemFilters): Promise<BaseItem[]> {
    try {
      const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      
      let results: BaseItem[] = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as BaseItem[];

      if (filters?.searchTerm) {
        const term = filters.searchTerm.toLowerCase();
        results = results.filter((item) => 
          item.title?.toLowerCase().includes(term) || 
          item.description?.toLowerCase().includes(term) ||
          item.tags?.some(tag => tag.toLowerCase().includes(term))
        );
      }
      
      return results;
    } catch (error) {
      console.error("Firestore getItems error:", error);
      throw error;
    }
  },

  /**
   * Fetch a single item by ID
   */
  async getItemById(id: string): Promise<BaseItem | null> {
    try {
      const docRef = doc(db, "products", id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as BaseItem;
      }
      return null;
    } catch (error) {
      console.error("Firestore getItemById error:", error);
      return null;
    }
  },

  /**
   * Create a new item listing
   */
  async createItem(itemData: Omit<BaseItem, 'id' | 'createdAt'> | any): Promise<BaseItem> {
    const user = auth.currentUser;
    if (!user) throw new Error("No authenticated user");

    try {
      const docData = {
        ...itemData,
        creatorId: user.uid,
        creatorName: user.displayName || user.email?.split('@')[0] || "Creator",
        createdAt: new Date().toISOString(),
      };
      
      const docRef = await addDoc(collection(db, "products"), docData);
      return { id: docRef.id, ...docData } as BaseItem;
    } catch (error) {
      console.error("Firestore createItem error:", error);
      throw error;
    }
  },

  /**
   * Update an existing item
   */
  async updateItem(id: string, updates: Partial<BaseItem>): Promise<BaseItem> {
    try {
      const docRef = doc(db, "products", id);
      await updateDoc(docRef, updates);
      
      const updatedSnap = await getDoc(docRef);
      return { id: updatedSnap.id, ...updatedSnap.data() } as BaseItem;
    } catch (error) {
       console.error("Firestore updateItem error:", error);
       throw error;
    }
  },

  /**
   * Delete an item
   */
  async deleteItem(id: string): Promise<void> {
    try {
       const docRef = doc(db, "products", id);
       await deleteDoc(docRef);
    } catch (error) {
       console.error("Firestore deleteItem error:", error);
       throw error;
    }
  }
};

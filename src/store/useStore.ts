import { create } from "zustand";

export type User = {
  uid: string;
  email: string;
  role: "buyer" | "seller";
  name: string;
};

type Store = {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
};

export const useStore = create<Store>((set) => ({
  user: null,
  loading: true,
  setUser: (user) => set({ user, loading: false }),
  setLoading: (loading) => set({ loading }),
}));

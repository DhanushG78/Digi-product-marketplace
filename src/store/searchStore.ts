import { create } from "zustand";

interface SearchState {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  categoryFilter: string[];
  setCategoryFilter: (categories: string[]) => void;
  priceFilter: string; // 'all', 'free', 'paid'
  setPriceFilter: (filter: string) => void;
  fileTypeFilter: string[];
  setFileTypeFilter: (types: string[]) => void;
  tagsFilter: string[];
  setTagsFilter: (tags: string[]) => void;
  clearFilters: () => void;
}

export const useSearchStore = create<SearchState>((set) => ({
  searchQuery: "",
  setSearchQuery: (query) => set({ searchQuery: query }),
  categoryFilter: [],
  setCategoryFilter: (categories) => set({ categoryFilter: categories }),
  priceFilter: "all",
  setPriceFilter: (filter) => set({ priceFilter: filter }),
  fileTypeFilter: [],
  setFileTypeFilter: (types) => set({ fileTypeFilter: types }),
  tagsFilter: [],
  setTagsFilter: (tags) => set({ tagsFilter: tags }),
  clearFilters: () =>
    set({
      searchQuery: "",
      categoryFilter: [],
      priceFilter: "all",
      fileTypeFilter: [],
      tagsFilter: [],
    }),
}));

export interface BaseItem {
  id: string;
  creatorId: string;
  creatorName?: string;
  createdAt: string;
  title: string;
  price: number;
  description: string;
  category?: "template" | "ebook" | "ui-kit" | "asset" | string;
  fileType?: "pdf" | "figma" | "zip" | "png" | string;
  previewImages: string[];
  downloadUrl?: string;
  tags?: string[];
  [key: string]: any; 
}
// Filters that could be passed to the service/hook
export interface ItemFilters {
  searchTerm?: string;
  minPrice?: number;
  maxPrice?: number;
  sellerId?: string;
  attributes?: Record<string, string | number | boolean>;
}

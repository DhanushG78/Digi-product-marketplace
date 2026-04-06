import { AppConfig } from '../types/config';

export const appConfig: AppConfig = {
  appName: "Digital Resale Platform",

  entity: {
    name: "Product",
    route: "products",
  },

  fields: [
    { name: "title", label: "Title", type: "text" },
    { name: "description", label: "Description", type: "textarea" },
    { name: "price", label: "Price ($)", type: "number" },
    { name: "category", label: "Category", type: "select", options: ["template", "ebook", "ui-kit", "asset"] },
    { name: "fileType", label: "File Type", type: "select", options: ["pdf", "figma", "zip", "png"] },
    { name: "previewImages", label: "Preview Image", type: "file" },
    { name: "downloadUrl", label: "Download URL (Dummy)", type: "text" },
  ],

  features: {
    auth: true,
    admin: true,
  },
};
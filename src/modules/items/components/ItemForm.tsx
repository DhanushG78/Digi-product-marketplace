"use client";

import { useState, FormEvent } from "react";
import { appConfig } from "@/config/appConfig";
import { DynamicField } from "@/components/shared/DynamicField";
import { itemService } from "../services/item.service";
import toast from "react-hot-toast";

type Props = {
  initialData?: Record<string, any>;
  onSuccess?: () => void;
};

export const ItemForm = ({ initialData = {}, onSuccess }: Props) => {
  const [formData, setFormData] = useState<Record<string, any>>(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const handleChange = (name: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Basic Required Field Validation
      for (const field of appConfig.fields) {
        if (!formData[field.name] || formData[field.name] === "") {
           // Allow empty for category/filetype if defaults exist, but title/price/preview are usually required
           if (['title', 'price', 'previewImages'].includes(field.name)) {
              throw new Error(`Please provide a value for ${field.label}.`);
           }
        }
      }

      if (formData.id) {
        await itemService.updateItem(formData.id, formData);
        toast.success("Product updated!");
      } else {
        await itemService.createItem(formData);
        toast.success("Product created!");
        setFormData({}); 
      }
      
      onSuccess?.();
    } catch (err: any) {
      setError(err.message || "Failed to save item.");
      toast.error(err.message || "Save failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-8 border border-gray-100 dark:border-gray-800 rounded-3xl space-y-6 bg-white dark:bg-gray-900 shadow-sm">
      <div className="border-b border-gray-100 dark:border-gray-800 pb-4">
        <h2 className="text-2xl font-black tracking-tight text-gray-900 dark:text-gray-100 italic flex items-center gap-2">
          {formData.id ? "Edit Product" : "Launch New Product"}
        </h2>
        <p className="text-sm text-gray-500 mt-1">Fill in the details to list your digital asset.</p>
      </div>

      {error && (
        <div className="p-4 text-sm font-bold text-red-600 bg-red-50 dark:bg-red-900/10 dark:text-red-400 rounded-xl animate-pulse">
          ⚠️ {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {appConfig.fields.map((field) => (
          <div key={field.name} className={`flex flex-col gap-2 ${field.type === 'textarea' ? 'md:col-span-2' : ''}`}>
            <label className="text-xs font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 ml-1">
              {field.label}
            </label>
            <DynamicField
              field={field}
              value={formData[field.name]}
              onChange={handleChange}
            />
          </div>
        ))}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-black dark:bg-white text-white dark:text-black font-black px-4 py-4 rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl disabled:opacity-50 disabled:scale-100 uppercase tracking-widest text-sm"
      >
        {loading ? "Processing..." : (formData.id ? "Update Product" : "Finalize & Publish")}
      </button>
    </form>
  );
};

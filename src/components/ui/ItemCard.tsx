"use client";

import { appConfig } from "@/config/appConfig";
import { deleteItem } from "@/services/itemService";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { useStore } from "@/store/useStore";
import { Heart, ShoppingCart, Check, ExternalLink } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

type Props = {
  item: Record<string, any>;
  onEdit?: (item: any) => void;
  onDelete?: () => void;
};

export const ItemCard = ({ item, onEdit, onDelete }: Props) => {
  const { ui, fields } = appConfig;

  const { cart, addToCart } = useCartStore();
  const { wishlist, toggleWishlist } = useWishlistStore();
  const user = useStore((state) => state.user);

  const isWishlisted = wishlist.some((w) => w.id === item.id);
  const isInCart = cart.some((c) => c.id === item.id);

  // Find image and price dynamically based on config
  const imageField = fields.find(f => f.type === 'file' || f.name === 'image' || f.name === 'previewImages' || f.name === 'images');
  const priceField = fields.find(f => f.type === 'number' && f.name === 'price');
  const titleField = fields.find(f => f.name === 'title' || f.name === 'name' || f.name === 'brand');
  const categoryField = fields.find(f => f.name === 'category');

  const imageValue = imageField ? item[imageField.name] : null;
  const imgSrc = Array.isArray(imageValue) ? imageValue[0] : imageValue;
  const uiShowImage = ui?.showImage !== false;

  const priceValue = priceField ? item[priceField.name] : null;
  const uiShowPrice = ui?.showPrice !== false;
  const isFree = Number(priceValue) === 0;

  const categoryValue = categoryField ? item[categoryField.name] : null;

  let titleValue = item.title;
  if (!titleValue) {
    titleValue = titleField ? item[titleField.name] : "Untitled Item";
  }

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this item?")) {
      await deleteItem(item.id);
      onDelete?.();
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-800 flex flex-col h-full group relative">
      
      {/* Badges and Actions Array */}
      <div className="absolute top-4 left-4 right-4 flex justify-between z-10 pointer-events-none">
        <div className="flex gap-2">
          {isFree && (
            <span className="backdrop-blur-md bg-green-500/90 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm pointer-events-auto">
              Free
            </span>
          )}
          {categoryValue && (
            <span className="backdrop-blur-md bg-white/90 dark:bg-black/90 text-gray-800 dark:text-gray-200 text-xs font-bold px-3 py-1 rounded-full shadow-sm pointer-events-auto capitalize">
              {categoryValue}
            </span>
          )}
        </div>
        {user?.role === "buyer" && (
          <button 
            onClick={async (e) => { 
              e.preventDefault(); 
              if (!user) {
                 toast.error("Please sign in to wishlist items");
                 return;
              }
              await toggleWishlist(item as any); 
              toast.success(isWishlisted ? "Removed from wishlist" : "Added to wishlist");
            }}
            className="pointer-events-auto w-8 h-8 flex items-center justify-center rounded-full backdrop-blur-md bg-white/80 dark:bg-black/80 shadow-sm text-gray-600 dark:text-gray-400 hover:text-red-500 hover:scale-110 transition-all"
          >
            <Heart size={18} className={isWishlisted ? "fill-red-500 text-red-500" : ""} />
          </button>
        )}
      </div>

      {uiShowImage && (
        <Link href={`/items/${item.id}`} className="relative h-56 w-full overflow-hidden bg-gray-100 dark:bg-gray-800 border-b border-gray-100 dark:border-gray-800 block">
          <img 
            src={imgSrc || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80"} 
            alt={titleValue} 
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" 
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
             <span className="bg-white text-black px-4 py-2 rounded-full font-bold text-sm flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-xl">
               <ExternalLink size={16} /> View Details
             </span>
          </div>
        </Link>
      )}

      <div className="p-5 flex flex-col flex-grow">
        <h2 className="font-bold text-lg text-gray-900 dark:text-gray-100 line-clamp-1 mb-1" title={titleValue}>{titleValue}</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{item.creatorName || 'Unknown Creator'}</p>
        
        {uiShowPrice && priceValue !== undefined && priceValue !== null && (
          <p className="text-gray-900 dark:text-white font-black text-xl mb-4">
            {isFree ? "Free" : `$${Number(priceValue).toLocaleString()}`}
          </p>
        )}

        <div className="mt-auto pt-2 flex gap-2">
          {(!onEdit && !onDelete) ? (
            <div className="flex w-full mt-2">
              <button 
                onClick={(e) => { 
                  e.preventDefault(); 
                  addToCart(item as any); 
                  if (!isInCart) toast.success("Added to cart!");
                }}
                disabled={isInCart}
                className="w-full bg-violet-600 disabled:bg-gray-200 disabled:text-gray-500 disabled:dark:bg-gray-800 disabled:dark:text-gray-400 text-white py-3 rounded-xl font-bold hover:bg-violet-700 hover:shadow-lg transition-all duration-300 text-sm flex items-center justify-center gap-2"
              >
                {isInCart ? (
                  <><Check size={18} /> In Cart</>
                ) : (
                  <><ShoppingCart size={18} /> Add to Cart</>
                )}
              </button>
            </div>
          ) : (
            <div className="flex w-full gap-2 pt-2">
              {onEdit && (
                <button
                  onClick={() => onEdit(item)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 py-2.5 rounded-xl font-semibold text-sm transition-colors"
                >
                  Edit
                </button>
              )}
              {onDelete && (
                <button
                  onClick={handleDelete}
                  className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-900/20 dark:hover:bg-red-900/40 dark:text-red-400 py-2.5 rounded-xl font-semibold text-sm transition-colors"
                >
                  Delete
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

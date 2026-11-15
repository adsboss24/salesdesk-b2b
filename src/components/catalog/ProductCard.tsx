'use client';

import React, { useState } from 'react';
import { B2BProduct, CartItem } from '@/lib/types';
import { calculateTierPrice } from '@/lib/mock-data';
import { Plus, Check, ShoppingBag, ArrowUpRight } from 'lucide-react';

interface ProductCardProps {
  product: B2BProduct;
  onAddToCart: (item: CartItem) => void;
  onOpenDetail: (product: B2BProduct) => void;
}

export function ProductCard({ product, onAddToCart, onOpenDetail }: ProductCardProps) {
  const [isQuickAdded, setIsQuickAdded] = useState(false);

  // Lowest tier price
  const lowestPrice = product.tierPricing && product.tierPricing.length > 0
    ? Math.min(...product.tierPricing.map(t => t.unitPrice))
    : product.basePrice;

  const defaultVariant = product.variants[0];
  const defaultMoq = defaultVariant?.minQuantity || product.moq || 1;
  const { unitPrice, discountPercent } = calculateTierPrice(product, defaultMoq, defaultVariant?.pricePerUnit || product.basePrice);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    const item: CartItem = {
      id: `${product.id}-${defaultVariant?.id || 'std'}-${Date.now()}`,
      productId: product.id,
      productName: product.name,
      productCode: defaultVariant?.sku || product.code,
      unit: product.unit,
      variantId: defaultVariant?.id,
      variantName: defaultVariant?.name,
      quantity: defaultMoq,
      unitPrice,
      subtotal: unitPrice * defaultMoq,
      appliedDiscountPercent: discountPercent > 0 ? discountPercent : undefined
    };

    onAddToCart(item);
    setIsQuickAdded(true);
    setTimeout(() => setIsQuickAdded(false), 1200);
  };

  return (
    <div
      onClick={() => onOpenDetail(product)}
      className="group bg-white rounded-2xl border border-zinc-200/80 hover:border-zinc-300 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer"
    >
      <div>
        {/* Product Image */}
        <div className="relative aspect-[4/3] bg-zinc-50 overflow-hidden">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover object-center group-hover:scale-103 transition duration-500 ease-out"
          />
          <div className="absolute top-3 left-3 flex gap-1.5">
            {product.badge && (
              <span className="bg-zinc-900/85 backdrop-blur-md text-zinc-100 text-[10px] font-medium px-2 py-0.5 rounded-full">
                {product.badge}
              </span>
            )}
          </div>
          <div className="absolute bottom-2.5 right-2.5 bg-white/90 backdrop-blur-md text-zinc-600 text-[10px] px-2 py-0.5 rounded-full font-mono border border-zinc-100 shadow-xs">
            MOQ {product.moq} {product.unit}
          </div>
        </div>

        {/* Info */}
        <div className="p-4 sm:p-5">
          <div className="flex items-center justify-between text-[11px] text-zinc-400 mb-1 font-mono">
            <span>{product.code}</span>
            <span>{product.category}</span>
          </div>

          <h3 className="font-medium text-zinc-900 text-sm sm:text-base leading-snug line-clamp-2 group-hover:text-zinc-700 transition">
            {product.name}
          </h3>

          {/* Pricing Highlight */}
          <div className="mt-3 pt-3 border-t border-zinc-100 flex items-baseline justify-between">
            <div>
              <span className="text-base sm:text-lg font-bold font-mono text-zinc-900">
                ฿{product.basePrice.toLocaleString()}
              </span>
              <span className="text-xs text-zinc-400 ml-1">/{product.unit}</span>
            </div>

            {lowestPrice < product.basePrice && (
              <span className="text-[10px] font-medium text-amber-800 bg-amber-50/80 px-2 py-0.5 rounded-full">
                ส่งเริ่ม ฿{lowestPrice.toLocaleString()}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Action footer */}
      <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-0 flex gap-2">
        <button
          type="button"
          onClick={() => onOpenDetail(product)}
          className="flex-1 py-2 px-3 rounded-xl text-xs font-medium text-zinc-700 bg-zinc-50 hover:bg-zinc-100 transition border border-zinc-200/60 flex items-center justify-center gap-1"
        >
          <span>ดูสเปก & ตารางราคา</span>
          <ArrowUpRight className="w-3.5 h-3.5 text-zinc-400" />
        </button>

        <button
          type="button"
          onClick={handleQuickAdd}
          className={`py-2 px-3.5 rounded-xl text-xs font-medium transition flex items-center justify-center gap-1 shadow-xs ${
            isQuickAdded
              ? 'bg-emerald-600 text-white'
              : 'bg-zinc-900 hover:bg-zinc-800 text-white'
          }`}
          title="เพิ่มขั้นต่ำ (MOQ) ลงรายการทันที"
        >
          {isQuickAdded ? (
            <Check className="w-3.5 h-3.5" />
          ) : (
            <>
              <Plus className="w-3.5 h-3.5 text-zinc-300" />
              <span>ด่วน</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

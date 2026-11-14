'use client';

import React, { useState } from 'react';
import { B2BProduct, CartItem } from '@/lib/types';
import { calculateTierPrice } from '@/lib/mock-data';
import { Plus, Check, ShoppingBag, ShieldCheck, Clock, Layers } from 'lucide-react';

interface ProductCardProps {
  product: B2BProduct;
  onAddToCart: (item: CartItem) => void;
  onQuickQuote?: (item: CartItem) => void;
}

export function ProductCard({ product, onAddToCart, onQuickQuote }: ProductCardProps) {
  const [selectedVariantId, setSelectedVariantId] = useState(
    product.variants[0]?.id || ''
  );

  const activeVariant = product.variants.find(v => v.id === selectedVariantId) || product.variants[0];
  const initialQty = activeVariant?.minQuantity || product.moq || 1;
  const [quantity, setQuantity] = useState<number>(initialQty);
  const [isAdded, setIsAdded] = useState(false);

  const basePrice = activeVariant?.pricePerUnit || product.basePrice;
  const { unitPrice, discountPercent } = calculateTierPrice(product, quantity, basePrice);
  const subtotal = unitPrice * quantity;

  const handleQtyChange = (val: number) => {
    const min = activeVariant?.minQuantity || product.moq || 1;
    if (val < min) {
      setQuantity(min);
    } else {
      setQuantity(val);
    }
  };

  const handleAdd = () => {
    const item: CartItem = {
      id: `${product.id}-${selectedVariantId}-${Date.now()}`,
      productId: product.id,
      productName: product.name,
      productCode: activeVariant?.sku || product.code,
      unit: product.unit,
      variantId: activeVariant?.id,
      variantName: activeVariant?.name,
      quantity,
      unitPrice,
      subtotal,
      appliedDiscountPercent: discountPercent > 0 ? discountPercent : undefined
    };

    onAddToCart(item);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1600);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm hover:shadow-md transition duration-200 overflow-hidden flex flex-col justify-between">
      <div>
        {/* Image & Badges */}
        <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden group">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition duration-300"
          />
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
            {product.badge && (
              <span className="bg-slate-900/90 backdrop-blur-md text-amber-400 text-[11px] font-bold px-2.5 py-1 rounded-md border border-amber-500/30">
                {product.badge}
              </span>
            )}
            <span className="bg-white/95 backdrop-blur-md text-slate-700 text-[10px] font-mono font-semibold px-2 py-0.5 rounded shadow-sm">
              SKU: {activeVariant?.sku || product.code}
            </span>
          </div>

          <div className="absolute bottom-2 right-2 bg-slate-900/80 backdrop-blur-md text-white text-[10px] px-2 py-0.5 rounded font-medium">
            MOQ: {product.moq.toLocaleString()} {product.unit}
          </div>
        </div>

        {/* Product Details */}
        <div className="p-4 sm:p-5">
          <div className="text-[11px] font-semibold text-amber-700 uppercase tracking-wider mb-1">
            {product.category}
          </div>
          <h3 className="font-bold text-slate-900 text-base leading-snug line-clamp-2">
            {product.name}
          </h3>
          <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
            {product.description}
          </p>

          {/* Specifications Pills */}
          {product.specifications && Object.keys(product.specifications).length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {Object.entries(product.specifications).slice(0, 3).map(([k, v]) => (
                <span
                  key={k}
                  className="bg-slate-100 text-slate-700 text-[10px] px-2 py-0.5 rounded font-medium"
                >
                  <strong className="font-semibold text-slate-900">{k}:</strong> {v}
                </span>
              ))}
            </div>
          )}

          {/* Variant Selector */}
          {product.variants.length > 1 && (
            <div className="mt-4 pt-3 border-t border-slate-100">
              <label className="text-[11px] font-bold text-slate-700 block mb-1.5 flex items-center gap-1">
                <Layers className="w-3 h-3 text-amber-600" />
                เลือกรุ่น / สเปกสินค้า:
              </label>
              <div className="grid grid-cols-1 gap-1.5">
                {product.variants.map((v) => (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => {
                      setSelectedVariantId(v.id);
                      if (quantity < v.minQuantity) setQuantity(v.minQuantity);
                    }}
                    className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition flex items-center justify-between border ${
                      selectedVariantId === v.id
                        ? 'border-amber-600 bg-amber-50/50 text-slate-900 font-bold'
                        : 'border-slate-200 text-slate-600 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <span>{v.name}</span>
                    <span className="text-slate-500 font-mono">฿{v.pricePerUnit}/{product.unit}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* B2B Tier Pricing Table */}
          {product.tierPricing && product.tierPricing.length > 0 && (
            <div className="mt-4 bg-slate-50 border border-slate-200/80 rounded-lg p-2.5">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-600 mb-1.5 flex justify-between">
                <span>ตารางราคาส่ง B2B ตามจำนวน</span>
                <span className="text-amber-700 font-bold">ยิ่งสั่งเยอะ ยิ่งประหยัด</span>
              </div>
              <div className="grid grid-cols-3 gap-1.5 text-center">
                {product.tierPricing.slice(0, 3).map((tier, idx) => {
                  const isActive = quantity >= tier.minQty && (!tier.maxQty || quantity <= tier.maxQty);
                  return (
                    <div
                      key={idx}
                      className={`p-1.5 rounded text-[11px] transition ${
                        isActive
                          ? 'bg-amber-600 text-white font-bold shadow-sm'
                          : 'bg-white border border-slate-200 text-slate-700'
                      }`}
                    >
                      <div className="text-[10px] opacity-90">
                        {tier.minQty}{tier.maxQty ? `-${tier.maxQty}` : '+'} {product.unit}
                      </div>
                      <div className="font-mono text-xs mt-0.5">
                        ฿{tier.unitPrice.toLocaleString()}
                      </div>
                      {tier.discountPercent && tier.discountPercent > 0 ? (
                        <div className={`text-[9px] ${isActive ? 'text-amber-100' : 'text-emerald-600 font-semibold'}`}>
                          ลด {tier.discountPercent}%
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Action Area: Quantity & Price */}
      <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-100 flex flex-col gap-3">
        {/* Quantity Controls & Total Calculation */}
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-500">
              ราคาต่อหน่วย: <span className="font-bold text-slate-900 font-mono">฿{unitPrice.toLocaleString()}</span>
              {discountPercent > 0 && (
                <span className="ml-1 text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1 py-0.2 rounded">
                  (ลด {discountPercent}%)
                </span>
              )}
            </div>
            <div className="text-sm font-extrabold text-slate-900 mt-0.5">
              รวม: <span className="text-amber-600 font-mono text-base">฿{subtotal.toLocaleString()}</span>
            </div>
          </div>

          <div className="flex items-center border border-slate-300 rounded-lg bg-white overflow-hidden shadow-sm">
            <button
              type="button"
              onClick={() => handleQtyChange(quantity - (product.moq >= 10 ? 10 : 1))}
              className="px-2.5 py-1 text-slate-600 hover:bg-slate-100 transition text-sm font-bold"
            >
              -
            </button>
            <input
              type="number"
              value={quantity}
              onChange={(e) => handleQtyChange(parseInt(e.target.value, 10) || product.moq)}
              className="w-16 text-center text-xs font-bold font-mono py-1 focus:outline-none text-slate-800"
            />
            <button
              type="button"
              onClick={() => handleQtyChange(quantity + (product.moq >= 10 ? 10 : 1))}
              className="px-2.5 py-1 text-slate-600 hover:bg-slate-100 transition text-sm font-bold"
            >
              +
            </button>
          </div>
        </div>

        {/* Add to Cart Button */}
        <button
          type="button"
          onClick={handleAdd}
          className={`w-full py-2.5 px-4 rounded-lg font-bold text-xs flex items-center justify-center gap-2 transition shadow-sm ${
            isAdded
              ? 'bg-emerald-600 text-white'
              : 'bg-slate-900 hover:bg-slate-800 text-white'
          }`}
        >
          {isAdded ? (
            <>
              <Check className="w-4 h-4" />
              เพิ่มลงรายการแล้ว!
            </>
          ) : (
            <>
              <ShoppingBag className="w-4 h-4 text-amber-400" />
              เพิ่มเข้ารายการขอใบเสนอราคา / สั่งซื้อ
            </>
          )}
        </button>
      </div>
    </div>
  );
}

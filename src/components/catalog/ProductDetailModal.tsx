'use client';

import React, { useState } from 'react';
import { B2BProduct, CartItem } from '@/lib/types';
import { calculateTierPrice } from '@/lib/mock-data';
import { X, Layers, Check, ShoppingBag, ShieldCheck, ArrowRight } from 'lucide-react';

interface ProductDetailModalProps {
  product: B2BProduct | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (item: CartItem) => void;
}

export function ProductDetailModal({ product, isOpen, onClose, onAddToCart }: ProductDetailModalProps) {
  if (!isOpen || !product) return null;

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
    setQuantity(Math.max(min, val));
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
    setTimeout(() => {
      setIsAdded(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-zinc-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-medium uppercase tracking-wider text-zinc-400">
              {product.category} · SKU: {activeVariant?.sku || product.code}
            </span>
            <h3 className="font-semibold text-zinc-900 text-lg leading-snug">
              {product.name}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-zinc-100 rounded-full text-zinc-400 hover:text-zinc-900 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left: Image & Specs */}
          <div className="space-y-4">
            <div className="aspect-[4/3] rounded-xl overflow-hidden bg-zinc-50 border border-zinc-100">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            <p className="text-xs text-zinc-600 leading-relaxed">
              {product.description}
            </p>

            {/* Specifications */}
            {product.specifications && Object.keys(product.specifications).length > 0 && (
              <div className="border border-zinc-100 rounded-xl p-3.5 bg-zinc-50/50 space-y-2">
                <div className="text-[11px] font-semibold text-zinc-700 uppercase tracking-wider">
                  สเปกทางเทคนิค
                </div>
                <div className="space-y-1.5 text-xs">
                  {Object.entries(product.specifications).map(([k, v]) => (
                    <div key={k} className="flex justify-between py-0.5 border-b border-zinc-100/80 last:border-none">
                      <span className="text-zinc-500">{k}</span>
                      <span className="font-medium text-zinc-800 text-right">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: Variants, Tier Pricing, Quantity & Add */}
          <div className="flex flex-col justify-between space-y-5">
            <div className="space-y-4">
              {/* Variant Picker */}
              {product.variants.length > 1 && (
                <div>
                  <label className="text-xs font-semibold text-zinc-700 block mb-2">
                    เลือกรุ่น / สเปกสินค้า
                  </label>
                  <div className="space-y-1.5">
                    {product.variants.map((v) => (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => {
                          setSelectedVariantId(v.id);
                          if (quantity < v.minQuantity) setQuantity(v.minQuantity);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs transition flex items-center justify-between border ${
                          selectedVariantId === v.id
                            ? 'border-zinc-900 bg-zinc-900 text-white font-medium shadow-xs'
                            : 'border-zinc-200 text-zinc-700 hover:border-zinc-300 bg-white'
                        }`}
                      >
                        <span>{v.name}</span>
                        <span className={`font-mono ${selectedVariantId === v.id ? 'text-zinc-300' : 'text-zinc-500'}`}>
                          ฿{v.pricePerUnit}/{product.unit}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Tier Pricing */}
              {product.tierPricing && product.tierPricing.length > 0 && (
                <div className="border border-zinc-100 rounded-xl p-3.5 bg-zinc-50/50">
                  <div className="text-[11px] font-semibold text-zinc-700 uppercase tracking-wider mb-2 flex justify-between">
                    <span>ตารางราคาส่ง B2B</span>
                    <span className="text-amber-700 font-medium">สั่งจำนวนมากได้ราคาส่ง</span>
                  </div>
                  <div className="grid grid-cols-3 gap-1.5 text-center">
                    {product.tierPricing.map((tier, idx) => {
                      const isActive = quantity >= tier.minQty && (!tier.maxQty || quantity <= tier.maxQty);
                      return (
                        <div
                          key={idx}
                          className={`p-2 rounded-lg text-xs transition ${
                            isActive
                              ? 'bg-zinc-900 text-white font-semibold shadow-xs'
                              : 'bg-white border border-zinc-200 text-zinc-600'
                          }`}
                        >
                          <div className="text-[10px] opacity-80">
                            {tier.minQty}{tier.maxQty ? `-${tier.maxQty}` : '+'} {product.unit}
                          </div>
                          <div className="font-mono font-medium mt-0.5">
                            ฿{tier.unitPrice.toLocaleString()}
                          </div>
                          {tier.discountPercent && tier.discountPercent > 0 ? (
                            <div className={`text-[9px] ${isActive ? 'text-amber-300' : 'text-emerald-600 font-medium'}`}>
                              ลด {tier.discountPercent}%
                            </div>
                          ) : null}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Quantity Selector */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-semibold text-zinc-700">
                    ระบุจำนวนสั่งซื้อ ({product.unit})
                  </label>
                  <span className="text-[11px] text-zinc-400">
                    MOQ: {product.moq} {product.unit}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center border border-zinc-200 rounded-xl overflow-hidden bg-white shadow-xs">
                    <button
                      type="button"
                      onClick={() => handleQtyChange(quantity - (product.moq >= 10 ? 10 : 1))}
                      className="px-3 py-2 text-zinc-600 hover:bg-zinc-50 transition text-sm font-medium"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => handleQtyChange(parseInt(e.target.value, 10) || product.moq)}
                      className="w-20 text-center text-sm font-semibold font-mono py-2 focus:outline-none text-zinc-900"
                    />
                    <button
                      type="button"
                      onClick={() => handleQtyChange(quantity + (product.moq >= 10 ? 10 : 1))}
                      className="px-3 py-2 text-zinc-600 hover:bg-zinc-50 transition text-sm font-medium"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-xs text-zinc-500 font-medium">
                    {product.unit}
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Total & Add Button */}
            <div className="pt-4 border-t border-zinc-100 space-y-3">
              <div className="flex justify-between items-baseline">
                <div>
                  <span className="text-xs text-zinc-400">ราคาต่อหน่วย:</span>
                  <span className="ml-1 text-xs font-mono font-medium text-zinc-700">฿{unitPrice.toLocaleString()}</span>
                  {discountPercent > 0 && (
                    <span className="ml-1.5 text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded">
                      ลด {discountPercent}%
                    </span>
                  )}
                </div>
                <div className="text-right">
                  <span className="text-xs text-zinc-400 mr-2">ยอดรวม:</span>
                  <span className="text-xl font-bold font-mono text-zinc-900">
                    ฿{subtotal.toLocaleString()}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleAdd}
                className={`w-full py-3 px-4 rounded-xl font-medium text-xs flex items-center justify-center gap-2 transition shadow-xs ${
                  isAdded
                    ? 'bg-emerald-600 text-white'
                    : 'bg-zinc-900 hover:bg-zinc-800 text-white'
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
                    เพิ่มลงรายการคำนวณราคา & ใบเสนอราคา
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import { B2BProduct, ProductVariant, TierPrice } from '@/lib/types';
import { X, Plus, Trash2, Check, Image as ImageIcon, Sparkles, Layers, Sliders } from 'lucide-react';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: B2BProduct) => void;
  initialProduct?: B2BProduct | null;
  existingCategories?: string[];
}

const PRESET_IMAGES = [
  { label: 'กล่องกระดาษ/บรรจุภัณฑ์', url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=80' },
  { label: 'ฟิล์มยืด/เทปปิดกล่อง', url: 'https://images.unsplash.com/photo-1616401784845-180882ba9ba8?auto=format&fit=crop&w=600&q=80' },
  { label: 'พาเลทพลาสติก', url: 'https://images.unsplash.com/photo-1587293852726-70cdb56c2866?auto=format&fit=crop&w=600&q=80' },
  { label: 'ถังเคมีภัณฑ์/น้ำยา', url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80' },
  { label: 'ถุงฟอยล์/ซิปล็อค', url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80' },
  { label: 'สายรัด/เชือกมัดกล่อง', url: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=600&q=80' },
];

export function ProductFormModal({
  isOpen,
  onClose,
  onSave,
  initialProduct,
  existingCategories = []
}: ProductFormModalProps) {
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [category, setCategory] = useState('บรรจุภัณฑ์อุตสาหกรรม');
  const [description, setDescription] = useState('');
  const [unit, setUnit] = useState('ชิ้น');
  const [moq, setMoq] = useState<number>(100);
  const [basePrice, setBasePrice] = useState<number>(50);
  const [imageUrl, setImageUrl] = useState(PRESET_IMAGES[0].url);
  const [badge, setBadge] = useState('สินค้ายอดนิยม B2B');

  // Specs key-value pairs
  const [specs, setSpecs] = useState<{ key: string; value: string }[]>([
    { key: 'มาตรฐาน', value: 'ISO 9001:2015' }
  ]);

  // Tier pricing
  const [tiers, setTiers] = useState<TierPrice[]>([
    { minQty: 100, maxQty: 499, unitPrice: 50, discountPercent: 0 },
    { minQty: 500, maxQty: 999, unitPrice: 45, discountPercent: 10 },
    { minQty: 1000, unitPrice: 40, discountPercent: 20 },
  ]);

  // Variants
  const [variants, setVariants] = useState<ProductVariant[]>([
    {
      id: 'v-1',
      name: 'รุ่นมาตรฐานสเปกโรงงาน',
      sku: '',
      pricePerUnit: 50,
      minQuantity: 100,
      stockStatus: 'in_stock'
    }
  ]);

  useEffect(() => {
    if (initialProduct) {
      setCode(initialProduct.code);
      setName(initialProduct.name);
      setCategory(initialProduct.category);
      setDescription(initialProduct.description || '');
      setUnit(initialProduct.unit);
      setMoq(initialProduct.moq);
      setBasePrice(initialProduct.basePrice);
      setImageUrl(initialProduct.imageUrl);
      setBadge(initialProduct.badge || '');
      
      if (initialProduct.specifications) {
        setSpecs(Object.entries(initialProduct.specifications).map(([key, value]) => ({ key, value })));
      } else {
        setSpecs([]);
      }

      setTiers(initialProduct.tierPricing || []);
      setVariants(initialProduct.variants || []);
    } else {
      // Default new product values
      const rnd = Math.floor(Math.random() * 900) + 100;
      setCode(`PRD-B2B-${rnd}`);
      setName('');
      setCategory(existingCategories[0] || 'บรรจุภัณฑ์อุตสาหกรรม');
      setDescription('');
      setUnit('ชิ้น');
      setMoq(100);
      setBasePrice(50);
      setImageUrl(PRESET_IMAGES[0].url);
      setBadge('สินค้ายอดนิยม B2B');
      setSpecs([{ key: 'มาตรฐาน', value: 'ISO 9001:2015' }]);
      setTiers([
        { minQty: 100, maxQty: 499, unitPrice: 50, discountPercent: 0 },
        { minQty: 500, maxQty: 999, unitPrice: 45, discountPercent: 10 },
        { minQty: 1000, unitPrice: 40, discountPercent: 20 },
      ]);
      setVariants([
        {
          id: `v-${Date.now()}`,
          name: 'รุ่นมาตรฐานสเปกโรงงาน',
          sku: `PRD-B2B-${rnd}-STD`,
          pricePerUnit: 50,
          minQuantity: 100,
          stockStatus: 'in_stock'
        }
      ]);
    }
  }, [initialProduct, isOpen]);

  if (!isOpen) return null;

  const handleAddSpec = () => {
    setSpecs([...specs, { key: '', value: '' }]);
  };

  const handleRemoveSpec = (index: number) => {
    setSpecs(specs.filter((_, i) => i !== index));
  };

  const handleAddTier = () => {
    const lastTier = tiers[tiers.length - 1];
    const newMin = lastTier ? (lastTier.maxQty ? lastTier.maxQty + 1 : lastTier.minQty * 2) : moq;
    const newPrice = lastTier ? Math.max(1, Math.round(lastTier.unitPrice * 0.9)) : basePrice;
    const discount = basePrice > 0 ? Math.round(((basePrice - newPrice) / basePrice) * 100) : 0;
    
    setTiers([...tiers, { minQty: newMin, unitPrice: newPrice, discountPercent: discount }]);
  };

  const handleRemoveTier = (index: number) => {
    setTiers(tiers.filter((_, i) => i !== index));
  };

  const handleAddVariant = () => {
    const id = `v-${Date.now()}`;
    setVariants([
      ...variants,
      {
        id,
        name: `ขนาด/รุ่นที่ ${variants.length + 1}`,
        sku: `${code}-V${variants.length + 1}`,
        pricePerUnit: basePrice,
        minQuantity: moq,
        stockStatus: 'in_stock'
      }
    ]);
  };

  const handleRemoveVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('กรุณากรอกชื่อสินค้า');
      return;
    }
    if (!code.trim()) {
      alert('กรุณากรอกรหัสสินค้า');
      return;
    }

    // Convert specs array to object
    const specifications: Record<string, string> = {};
    specs.forEach(s => {
      if (s.key.trim() && s.value.trim()) {
        specifications[s.key.trim()] = s.value.trim();
      }
    });

    const finalProduct: B2BProduct = {
      id: initialProduct?.id || `prd-${Date.now()}`,
      code: code.trim(),
      name: name.trim(),
      category: category.trim(),
      description: description.trim(),
      unit: unit.trim() || 'ชิ้น',
      moq: Number(moq) || 1,
      basePrice: Number(basePrice) || 0,
      imageUrl: imageUrl.trim() || PRESET_IMAGES[0].url,
      badge: badge.trim() || undefined,
      specifications,
      variants: variants.length > 0 ? variants : [
        {
          id: `v-std-${Date.now()}`,
          name: 'รุ่นมาตรฐาน',
          sku: `${code}-STD`,
          pricePerUnit: Number(basePrice) || 0,
          minQuantity: Number(moq) || 1,
          stockStatus: 'in_stock'
        }
      ],
      tierPricing: tiers.length > 0 ? tiers : [
        { minQty: Number(moq) || 1, unitPrice: Number(basePrice) || 0, discountPercent: 0 }
      ],
      inStock: true
    };

    onSave(finalProduct);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-zinc-950/70 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-zinc-200 overflow-hidden flex flex-col max-h-[94vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-zinc-900 text-white flex items-center justify-between border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-600 flex items-center justify-center font-bold text-white shadow-xs">
              <Plus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base">
                {initialProduct ? 'แก้ไขข้อมูลสินค้า B2B' : 'เพิ่มสินค้า B2B ใหม่'}
              </h3>
              <p className="text-xs text-zinc-400">
                กรอกข้อมูลสเปก, จำนวนสั่งขั้นต่ำ (MOQ) และตารางราคาส่ง
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto flex-1 space-y-6 text-xs text-zinc-800">
          {/* 1. Basic Information */}
          <div className="space-y-4">
            <div className="font-semibold text-zinc-900 text-sm border-b border-zinc-100 pb-2">
              1. ข้อมูลพื้นฐานสินค้า
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="font-medium text-zinc-700 block mb-1">รหัสสินค้า (SKU) *</label>
                <input
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full p-2 border border-zinc-300 rounded-lg font-mono focus:border-zinc-900 focus:outline-none"
                  placeholder="เช่น PKG-BX-01"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="font-medium text-zinc-700 block mb-1">ชื่อสินค้า B2B *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2 border border-zinc-300 rounded-lg focus:border-zinc-900 focus:outline-none"
                  placeholder="เช่น กล่องลูกฟูก 5 ชั้น ลอน BC เกรดส่งออก"
                />
              </div>

              <div>
                <label className="font-medium text-zinc-700 block mb-1">หมวดหมู่สินค้า *</label>
                <input
                  type="text"
                  required
                  list="categories-list"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-2 border border-zinc-300 rounded-lg focus:border-zinc-900 focus:outline-none"
                  placeholder="พิมพ์หรือเลือกหมวดหมู่"
                />
                <datalist id="categories-list">
                  {existingCategories.map((c) => (
                    <option key={c} value={c} />
                  ))}
                  <option value="บรรจุภัณฑ์อุตสาหกรรม" />
                  <option value="วัสดุแพ็คเกจจิ้ง & คลังสินค้า" />
                  <option value="เคมีภัณฑ์โรงงาน & ซ่อมบำรุง" />
                  <option value="พาเลทและอุปกรณ์ยกขน" />
                </datalist>
              </div>

              <div>
                <label className="font-medium text-zinc-700 block mb-1">หน่วยนับ (Unit) *</label>
                <input
                  type="text"
                  required
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="w-full p-2 border border-zinc-300 rounded-lg focus:border-zinc-900 focus:outline-none"
                  placeholder="เช่น ใบ, ม้วน, ตัว, ถัง, ลัง"
                />
              </div>

              <div>
                <label className="font-medium text-zinc-700 block mb-1">ป้ายกำกับ (Badge)</label>
                <input
                  type="text"
                  value={badge}
                  onChange={(e) => setBadge(e.target.value)}
                  className="w-full p-2 border border-zinc-300 rounded-lg focus:border-zinc-900 focus:outline-none"
                  placeholder="เช่น สินค้ายอดนิยม B2B, ราคาโรงงาน"
                />
              </div>

              <div>
                <label className="font-medium text-zinc-700 block mb-1">จำนวนสั่งขั้นต่ำ (MOQ) *</label>
                <input
                  type="number"
                  required
                  min={1}
                  value={moq}
                  onChange={(e) => setMoq(parseInt(e.target.value, 10) || 1)}
                  className="w-full p-2 border border-zinc-300 rounded-lg font-mono focus:border-zinc-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-medium text-zinc-700 block mb-1">ราคาฐานต่อหน่วย (THB) *</label>
                <input
                  type="number"
                  required
                  min={0.1}
                  step={0.1}
                  value={basePrice}
                  onChange={(e) => setBasePrice(parseFloat(e.target.value) || 0)}
                  className="w-full p-2 border border-zinc-300 rounded-lg font-mono focus:border-zinc-900 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="font-medium text-zinc-700 block mb-1">รายละเอียดสินค้า</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2 border border-zinc-300 rounded-lg focus:border-zinc-900 focus:outline-none"
                  placeholder="ระบุคำอธิบาย การใช้งาน หรือจุดเด่นของสินค้า..."
                />
              </div>
            </div>
          </div>

          {/* 2. Image Selection */}
          <div className="space-y-3">
            <div className="font-semibold text-zinc-900 text-sm border-b border-zinc-100 pb-2 flex items-center justify-between">
              <span>2. รูปภาพสินค้า (Image URL)</span>
              <span className="text-zinc-400 font-normal text-xs">เลือกจากตัวอย่างหรือวางลิงก์เอง</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-xl overflow-hidden bg-zinc-100 border border-zinc-200 shrink-0">
                <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
              </div>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full p-2 border border-zinc-300 rounded-lg font-mono text-xs focus:border-zinc-900 focus:outline-none"
                placeholder="https://images.unsplash.com/..."
              />
            </div>

            {/* Presets */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {PRESET_IMAGES.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => setImageUrl(preset.url)}
                  className={`px-2.5 py-1 rounded-full text-[11px] transition border ${
                    imageUrl === preset.url
                      ? 'bg-zinc-900 text-white border-zinc-900 font-medium'
                      : 'bg-zinc-50 text-zinc-600 border-zinc-200 hover:bg-zinc-100'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Tier Pricing Matrix */}
          <div className="space-y-3">
            <div className="font-semibold text-zinc-900 text-sm border-b border-zinc-100 pb-2 flex items-center justify-between">
              <span>3. ตารางราคาส่ง B2B ตามจำนวน (Tier Pricing)</span>
              <button
                type="button"
                onClick={handleAddTier}
                className="px-2.5 py-1 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 rounded-md font-medium text-xs flex items-center gap-1 transition"
              >
                <Plus className="w-3.5 h-3.5" />
                เพิ่ม Tier ราคา
              </button>
            </div>

            <div className="space-y-2">
              {tiers.map((tier, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-zinc-50 p-2.5 rounded-xl border border-zinc-200/80">
                  <span className="font-semibold text-zinc-500 w-12 shrink-0">Tier {idx + 1}</span>
                  <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 gap-2">
                    <div>
                      <span className="text-[10px] text-zinc-400 block">จำนวนขั้นต่ำ ({unit})</span>
                      <input
                        type="number"
                        min={1}
                        value={tier.minQty}
                        onChange={(e) => {
                          const updated = [...tiers];
                          updated[idx].minQty = parseInt(e.target.value, 10) || 1;
                          setTiers(updated);
                        }}
                        className="w-full p-1.5 bg-white border border-zinc-300 rounded font-mono text-xs"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-zinc-400 block">ราคาต่อหน่วย (THB)</span>
                      <input
                        type="number"
                        step={0.1}
                        value={tier.unitPrice}
                        onChange={(e) => {
                          const updated = [...tiers];
                          const newPrice = parseFloat(e.target.value) || 0;
                          updated[idx].unitPrice = newPrice;
                          updated[idx].discountPercent = basePrice > 0 ? Math.round(((basePrice - newPrice) / basePrice) * 100) : 0;
                          setTiers(updated);
                        }}
                        className="w-full p-1.5 bg-white border border-zinc-300 rounded font-mono text-xs"
                      />
                    </div>
                    <div className="col-span-2 sm:col-span-1 flex items-center justify-between sm:justify-start gap-2 pt-3 sm:pt-4">
                      <span className="text-emerald-700 font-semibold text-xs">
                        {tier.discountPercent && tier.discountPercent > 0 ? `ลด ${tier.discountPercent}%` : 'ราคาปกติ'}
                      </span>
                    </div>
                  </div>
                  {tiers.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveTier(idx)}
                      className="p-1.5 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 4. Specifications */}
          <div className="space-y-3">
            <div className="font-semibold text-zinc-900 text-sm border-b border-zinc-100 pb-2 flex items-center justify-between">
              <span>4. สเปกทางเทคนิค (Specifications)</span>
              <button
                type="button"
                onClick={handleAddSpec}
                className="px-2.5 py-1 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 rounded-md font-medium text-xs flex items-center gap-1 transition"
              >
                <Plus className="w-3.5 h-3.5" />
                เพิ่มสเปก
              </button>
            </div>

            <div className="space-y-2">
              {specs.map((spec, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={spec.key}
                    onChange={(e) => {
                      const updated = [...specs];
                      updated[idx].key = e.target.value;
                      setSpecs(updated);
                    }}
                    placeholder="หัวข้อ เช่น ความหนา, วัสดุ"
                    className="w-1/3 p-2 border border-zinc-300 rounded-lg text-xs"
                  />
                  <input
                    type="text"
                    value={spec.value}
                    onChange={(e) => {
                      const updated = [...specs];
                      updated[idx].value = e.target.value;
                      setSpecs(updated);
                    }}
                    placeholder="รายละเอียด เช่น 5 มม. ลอน BC, มาตรฐาน RoHS"
                    className="flex-1 p-2 border border-zinc-300 rounded-lg text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveSpec(idx)}
                    className="p-1.5 text-zinc-400 hover:text-rose-600 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* 5. Variants (รุ่น/ขนาด) */}
          <div className="space-y-3">
            <div className="font-semibold text-zinc-900 text-sm border-b border-zinc-100 pb-2 flex items-center justify-between">
              <span>5. รุ่น / ขนาดสินค้า (Variants)</span>
              <button
                type="button"
                onClick={handleAddVariant}
                className="px-2.5 py-1 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 rounded-md font-medium text-xs flex items-center gap-1 transition"
              >
                <Plus className="w-3.5 h-3.5" />
                เพิ่มรุ่นย่อย
              </button>
            </div>

            <div className="space-y-2">
              {variants.map((v, idx) => (
                <div key={v.id} className="flex items-center gap-2 bg-zinc-50 p-2.5 rounded-xl border border-zinc-200/80">
                  <input
                    type="text"
                    value={v.name}
                    onChange={(e) => {
                      const updated = [...variants];
                      updated[idx].name = e.target.value;
                      setVariants(updated);
                    }}
                    placeholder="ชื่อรุ่น เช่น ไซส์ L (40x50 ซม.)"
                    className="flex-1 p-1.5 bg-white border border-zinc-300 rounded text-xs"
                  />
                  <input
                    type="number"
                    value={v.pricePerUnit}
                    onChange={(e) => {
                      const updated = [...variants];
                      updated[idx].pricePerUnit = parseFloat(e.target.value) || 0;
                      setVariants(updated);
                    }}
                    placeholder="ราคา (THB)"
                    className="w-24 p-1.5 bg-white border border-zinc-300 rounded font-mono text-xs"
                  />
                  {variants.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveVariant(idx)}
                      className="p-1.5 text-zinc-400 hover:text-rose-600 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Submit Footer */}
          <div className="pt-4 border-t border-zinc-200 flex justify-end gap-3 sticky bottom-0 bg-white py-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-zinc-300 text-zinc-700 rounded-xl hover:bg-zinc-50 font-medium"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl font-semibold shadow-md flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              {initialProduct ? 'บันทึกการแก้ไข' : 'บันทึกสินค้าใหม่'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

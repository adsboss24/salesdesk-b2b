'use client';

import React, { useState, useEffect } from 'react';
import { B2BProduct, SupplierCompanyInfo, Quotation, Order, CartItem } from '@/lib/types';
import {
  getInitialProducts,
  saveProducts,
  getInitialSupplier,
  saveSupplier,
  getInitialQuotations,
  saveQuotations,
  getInitialOrders,
  saveOrders,
  getInitialCart,
  saveCart
} from '@/lib/store';
import { Navbar } from '@/components/ui/Navbar';
import { ProductCard } from '@/components/catalog/ProductCard';
import { CartAndCheckoutModal } from '@/components/catalog/CartAndCheckoutModal';
import { QuotationDocument } from '@/components/quotation/QuotationDocument';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import {
  Search,
  FileText,
  ShieldCheck,
  TrendingDown,
  ShoppingBag,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const [products, setProducts] = useState<B2BProduct[]>([]);
  const [supplier, setSupplier] = useState<SupplierCompanyInfo | null>(null);
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);

  // Navigation & View state
  const [activeView, setActiveView] = useState<'store' | 'admin' | 'quotation'>('store');
  const [selectedQuotation, setSelectedQuotation] = useState<Quotation | null>(null);
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);

  // Search & Filter state
  const [selectedCategory, setSelectedCategory] = useState<string>('ทั้งหมด');
  const [searchQuery, setSearchQuery] = useState('');

  // Initial load from local storage
  useEffect(() => {
    setProducts(getInitialProducts());
    setSupplier(getInitialSupplier());
    setQuotations(getInitialQuotations());
    setOrders(getInitialOrders());
    setCart(getInitialCart());
    setMounted(true);
  }, []);

  // Save changes
  const handleUpdateProducts = (newProducts: B2BProduct[]) => {
    setProducts(newProducts);
    saveProducts(newProducts);
  };

  const handleUpdateSupplier = (newSupplier: SupplierCompanyInfo) => {
    setSupplier(newSupplier);
    saveSupplier(newSupplier);
  };

  const handleUpdateQuotations = (newQuotations: Quotation[]) => {
    setQuotations(newQuotations);
    saveQuotations(newQuotations);
  };

  const handleUpdateOrders = (newOrders: Order[]) => {
    setOrders(newOrders);
    saveOrders(newOrders);
  };

  const handleUpdateCart = (newCart: CartItem[]) => {
    setCart(newCart);
    saveCart(newCart);
  };

  // Cart operations
  const handleAddToCart = (item: CartItem) => {
    const existingIndex = cart.findIndex(
      (c) => c.productId === item.productId && c.variantId === item.variantId
    );

    let updatedCart: CartItem[];
    if (existingIndex > -1) {
      updatedCart = [...cart];
      const existing = updatedCart[existingIndex];
      const newQty = existing.quantity + item.quantity;
      
      updatedCart[existingIndex] = {
        ...existing,
        quantity: newQty,
        subtotal: item.unitPrice * newQty,
      };
    } else {
      updatedCart = [...cart, item];
    }

    handleUpdateCart(updatedCart);
  };

  const handleUpdateCartQuantity = (id: string, qty: number) => {
    const updated = cart.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          quantity: qty,
          subtotal: item.unitPrice * qty,
        };
      }
      return item;
    });
    handleUpdateCart(updated);
  };

  const handleRemoveCartItem = (id: string) => {
    const updated = cart.filter((item) => item.id !== id);
    handleUpdateCart(updated);
  };

  const handleClearCart = () => {
    handleUpdateCart([]);
  };

  const handleCreateQuotation = (quotation: Quotation) => {
    const updated = [quotation, ...quotations];
    handleUpdateQuotations(updated);
    setSelectedQuotation(quotation);
    setActiveView('quotation');
  };

  const handleCreateOrder = (order: Order) => {
    const updated = [order, ...orders];
    handleUpdateOrders(updated);
    alert(`สร้างคำสั่งซื้อเลขที่ ${order.orderNumber} เรียบร้อยแล้ว! ทีมงานกำลังตรวจสอบยอดเงินและจัดส่ง`);
  };

  const handleUpdateQuotationStatus = (id: string, status: Quotation['status']) => {
    const updated = quotations.map((q) => (q.id === id ? { ...q, status } : q));
    handleUpdateQuotations(updated);
    if (selectedQuotation && selectedQuotation.id === id) {
      setSelectedQuotation({ ...selectedQuotation, status });
    }
  };

  const handleUpdateOrderStatus = (id: string, status: Order['paymentStatus']) => {
    const updated = orders.map((o) => (o.id === id ? { ...o, paymentStatus: status } : o));
    handleUpdateOrders(updated);
  };

  if (!mounted || !supplier) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-sm font-semibold text-slate-700">กำลังโหลดระบบ SalesDesk B2B...</p>
        </div>
      </div>
    );
  }

  // Categories list
  const categories = ['ทั้งหมด', ...Array.from(new Set(products.map((p) => p.category)))];

  const filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategory === 'ทั้งหมด' || p.category === selectedCategory;
    const matchesSearch =
      !searchQuery ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const cartSubtotal = cart.reduce((acc, i) => acc + i.subtotal, 0);

  return (
    <div className="min-h-screen bg-slate-50/60 text-slate-900 flex flex-col font-sans">
      {/* Global Navbar */}
      <Navbar
        supplier={supplier}
        cart={cart}
        activeView={activeView}
        onViewChange={(view) => {
          setActiveView(view);
          if (view !== 'quotation') setSelectedQuotation(null);
        }}
        onOpenCart={() => setIsCartModalOpen(true)}
      />

      {/* View 1: Quotation PDF Document View */}
      {activeView === 'quotation' && selectedQuotation && (
        <main className="flex-1 pb-16">
          <QuotationDocument
            quotation={selectedQuotation}
            supplier={supplier}
            onStatusChange={(status) => handleUpdateQuotationStatus(selectedQuotation.id, status)}
            onBack={() => setActiveView('store')}
          />
        </main>
      )}

      {/* View 2: Admin Dashboard */}
      {activeView === 'admin' && (
        <main className="flex-1 pb-16">
          <AdminDashboard
            products={products}
            supplier={supplier}
            quotations={quotations}
            orders={orders}
            onUpdateProducts={handleUpdateProducts}
            onUpdateSupplier={handleUpdateSupplier}
            onUpdateQuotationStatus={handleUpdateQuotationStatus}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onViewQuotation={(q) => {
              setSelectedQuotation(q);
              setActiveView('quotation');
            }}
          />
        </main>
      )}

      {/* View 3: Storefront B2B Catalog */}
      {activeView === 'store' && (
        <main className="flex-1 pb-36 sm:pb-28">
          {/* Hero Banner */}
          <section className="bg-slate-900 text-white relative overflow-hidden py-8 sm:py-12 px-4 sm:px-6 border-b border-slate-800">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#d97706_1px,transparent_1px)] [background-size:16px_16px]"></div>
            
            <div className="max-w-7xl mx-auto relative z-10">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 sm:gap-8">
                <div className="max-w-2xl space-y-3">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[11px] sm:text-xs font-semibold">
                    <Sparkles className="w-3.5 h-3.5 shrink-0" />
                    B2B Fast-Commerce & Official Quotation Engine
                  </div>
                  <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
                    ระบบสั่งซื้อราคาส่งหน้าโรงงาน & ออกใบเสนอราคาใน <span className="text-amber-400 underline decoration-amber-500/50">30 วินาที</span>
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    หมดปัญหาแอดมินพิมพ์ Excel ข้ามวัน ลูกค้าฝ่ายจัดซื้อสามารถเลือกสเปกจริง คำนวณ Tier ส่วนลดอัตโนมัติ 
                    และดาวน์โหลดใบเสนอราคามาตรฐานไทย (PDF) พร้อมข้อมูลภาษีครบถ้วนได้ทันที
                  </p>

                  {/* Highlights Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 pt-2 text-[11px] sm:text-xs font-medium text-slate-200">
                    <div className="flex items-center gap-2">
                      <TrendingDown className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>ราคาส่ง Tier Pricing หน้าโรงงาน</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>ออกใบเสนอราคา PDF ทันที</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>ออกใบกำกับภาษีเต็มรูป 7%</span>
                    </div>
                  </div>
                </div>

                {/* Fast Action Card */}
                <div className="bg-white/10 backdrop-blur-md border border-white/15 p-4 sm:p-5 rounded-2xl w-full lg:w-96 text-xs space-y-2.5 shadow-xl">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white uppercase tracking-wider text-[10px] sm:text-[11px]">
                      สถานะระบบ B2B วันนี้
                    </span>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold text-[9px] sm:text-[10px]">
                      ออนไลน์ 24 ชม.
                    </span>
                  </div>
                  <div className="space-y-1 text-slate-300 text-[11px] sm:text-xs">
                    <div className="flex justify-between">
                      <span>สินค้าพร้อมส่งล็อตใหญ่:</span>
                      <span className="font-bold text-white font-mono">{products.length} รายการ</span>
                    </div>
                    <div className="flex justify-between">
                      <span>เงื่อนไขการจัดส่ง:</span>
                      <span className="font-bold text-amber-300">ส่งฟรีเมื่อยอดเกิน 50,000.-</span>
                    </div>
                    <div className="flex justify-between">
                      <span>ความเร็วออกเอกสาร:</span>
                      <span className="font-bold text-emerald-400">เฉลี่ย &lt; 30 วินาที</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsCartModalOpen(true)}
                    className="w-full mt-2 py-2 sm:py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-md transition"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    เปิดรายการคำนวณราคา ({cart.length} รายการ)
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Search & Category Filter Section */}
          <section className="max-w-7xl mx-auto px-3 sm:px-6 pt-5 sm:pt-8 pb-3">
            <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-3 bg-white p-3 sm:p-4 rounded-2xl border border-slate-200/80 shadow-xs">
              {/* Category Pills with smooth horizontal scrolling */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none [&::-webkit-scrollbar]:hidden -mx-1 px-1">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap shrink-0 ${
                      selectedCategory === cat
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Search Bar */}
              <div className="relative w-full md:w-80 shrink-0">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ค้นหาสินค้า สเปก หรือรหัส SKU..."
                  className="w-full pl-9 pr-3 py-1.5 sm:py-2 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-600/30 focus:border-amber-600 bg-white"
                />
              </div>
            </div>
          </section>

          {/* Product Catalog Grid */}
          <section className="max-w-7xl mx-auto px-3 sm:px-6 py-3 sm:py-4">
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400">
                <Search className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                <p className="text-sm font-bold text-slate-600">ไม่พบสินค้าที่ตรงกับการค้นหา</p>
                <p className="text-xs text-slate-400 mt-1">ลองเปลี่ยนคำค้นหา หรือเลือกหมวดหมู่อื่น</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={handleAddToCart}
                    onQuickQuote={() => setIsCartModalOpen(true)}
                  />
                ))}
              </div>
            )}
          </section>
        </main>
      )}

      {/* Floating Bottom Cart Bar (Sleek single-line mobile & desktop layout) */}
      {cart.length > 0 && activeView === 'store' && (
        <div className="fixed bottom-3 sm:bottom-4 left-3 right-3 sm:left-4 sm:right-4 max-w-3xl mx-auto z-30 animate-in slide-in-from-bottom duration-300">
          <div className="bg-slate-900/95 backdrop-blur-md text-white p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-2xl border border-slate-800 flex items-center justify-between gap-2 sm:gap-4">
            <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-amber-600 flex items-center justify-center font-bold text-white shadow shrink-0">
                <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-slate-400">เลือก:</span>
                  <span className="text-[10px] font-bold bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded">
                    {cart.length} รายการ
                  </span>
                </div>
                <div className="text-xs sm:text-sm font-extrabold text-white mt-0.5 font-mono truncate">
                  ฿<span className="text-amber-400 text-sm sm:text-base font-bold">{cartSubtotal.toLocaleString()}</span>
                  <span className="text-[9px] text-slate-400 font-normal ml-1 hidden xs:inline">(ก่อน VAT)</span>
                </div>
              </div>
            </div>

            <div className="flex items-center shrink-0">
              <button
                onClick={() => setIsCartModalOpen(true)}
                className="px-3.5 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white font-bold text-xs rounded-lg sm:rounded-xl shadow-lg transition flex items-center gap-1.5 whitespace-nowrap"
              >
                <FileText className="w-3.5 h-3.5 shrink-0" />
                <span>ออกใบเสนอราคา PDF</span>
                <ArrowRight className="w-3 h-3 shrink-0" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cart & Dual Checkout Modal */}
      <CartAndCheckoutModal
        isOpen={isCartModalOpen}
        onClose={() => setIsCartModalOpen(false)}
        cart={cart}
        supplier={supplier}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
        onCreateQuotation={handleCreateQuotation}
        onCreateOrder={handleCreateOrder}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 sm:py-8 px-4 sm:px-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
          <div>
            <span className="font-bold text-slate-800">SalesDesk B2B Platform</span> — Instant B2B Catalog & Quotation Engine
            <p className="text-[11px] text-slate-400 mt-0.5">
              {supplier.companyName} | เลขประจำตัวผู้เสียภาษี: {supplier.taxId}
            </p>
          </div>
          <div className="flex items-center gap-3 text-slate-600 font-medium text-[11px]">
            <span>มาตรฐานใบเสนอราคาไทย 100%</span>
            <span>•</span>
            <span>ความปลอดภัยระดับองค์กร</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

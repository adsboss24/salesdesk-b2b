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
import { ProductDetailModal } from '@/components/catalog/ProductDetailModal';
import { CartAndCheckoutModal } from '@/components/catalog/CartAndCheckoutModal';
import { QuotationDocument } from '@/components/quotation/QuotationDocument';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import {
  Search,
  FileText,
  ShoppingBag,
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
  const [detailProduct, setDetailProduct] = useState<B2BProduct | null>(null);

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
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-zinc-900 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-xs text-zinc-500 font-medium">กำลังโหลด...</p>
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
    <div className="min-h-screen bg-[#fafaf9] text-zinc-900 flex flex-col font-sans selection:bg-zinc-900 selection:text-white">
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
        <main className="flex-1 pb-32">
          {/* Minimalist Hero Section */}
          <section className="pt-10 sm:pt-16 pb-8 px-4 sm:px-6 max-w-4xl mx-auto text-center">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-zinc-900">
              แคตตาล็อกสินค้า & ออกใบเสนอราคา B2B
            </h1>
            <p className="text-xs sm:text-sm text-zinc-500 mt-2.5 max-w-md mx-auto leading-relaxed">
              สั่งซื้อราคาส่งหน้าโรงงาน พร้อมระบบคำนวณภาษีและออกใบเสนอราคาทางการใน 30 วินาที
            </p>

            {/* Clean Floating Search Bar */}
            <div className="mt-6 max-w-md mx-auto relative">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-zinc-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ค้นหารายการสินค้า, สเปก หรือรหัส SKU..."
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-zinc-200/80 rounded-full text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-zinc-400 shadow-xs transition"
              />
            </div>

            {/* Category Pills */}
            <div className="mt-5 flex items-center justify-center gap-1.5 overflow-x-auto pb-1 scrollbar-none [&::-webkit-scrollbar]:hidden">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition whitespace-nowrap shrink-0 ${
                    selectedCategory === cat
                      ? 'bg-zinc-900 text-white shadow-xs'
                      : 'bg-white text-zinc-600 hover:text-zinc-900 border border-zinc-200/60 hover:border-zinc-300'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </section>

          {/* Product Catalog Grid */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-2xl border border-zinc-200/80 p-12 text-center text-zinc-400">
                <Search className="w-8 h-8 mx-auto text-zinc-300 mb-2" />
                <p className="text-sm font-medium text-zinc-700">ไม่พบสินค้าที่ตรงกับการค้นหา</p>
                <p className="text-xs text-zinc-400 mt-1">ลองเปลี่ยนคำค้นหา หรือเลือกหมวดหมู่อื่น</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={handleAddToCart}
                    onOpenDetail={(p) => setDetailProduct(p)}
                  />
                ))}
              </div>
            )}
          </section>
        </main>
      )}

      {/* Floating Bottom Cart Capsule */}
      {cart.length > 0 && activeView === 'store' && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-30 w-full max-w-md px-4 animate-in slide-in-from-bottom duration-300">
          <div className="bg-zinc-900/95 backdrop-blur-md text-white px-4 py-2.5 rounded-full shadow-2xl border border-zinc-800 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-full bg-zinc-800 flex items-center justify-center font-bold text-amber-400 shrink-0">
                <ShoppingBag className="w-3.5 h-3.5" />
              </div>
              <div className="text-xs truncate">
                <span className="font-semibold text-white">{cart.length} รายการ</span>
                <span className="text-zinc-400 mx-1.5">·</span>
                <span className="font-mono font-bold text-zinc-200">฿{cartSubtotal.toLocaleString()}</span>
              </div>
            </div>

            <button
              onClick={() => setIsCartModalOpen(true)}
              className="px-4 py-1.5 bg-white hover:bg-zinc-100 text-zinc-900 font-medium text-xs rounded-full shadow transition flex items-center gap-1.5 whitespace-nowrap shrink-0"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>ออกใบเสนอราคา</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={detailProduct}
        isOpen={!!detailProduct}
        onClose={() => setDetailProduct(null)}
        onAddToCart={handleAddToCart}
      />

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

      {/* Minimal Footer */}
      <footer className="bg-white border-t border-zinc-200/60 py-6 px-4 sm:px-6 text-xs text-zinc-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2 text-center sm:text-left">
          <p className="font-medium text-zinc-600">
            {supplier.companyName}
          </p>
          <p className="text-[11px]">
            SalesDesk B2B Platform · มาตรฐานใบเสนอราคาและใบกำกับภาษีไทย
          </p>
        </div>
      </footer>
    </div>
  );
}

'use client';

import React from 'react';
import { SupplierCompanyInfo, CartItem } from '@/lib/types';
import {
  ShoppingBag,
  ShieldCheck,
  PhoneCall,
  LayoutGrid,
  Settings,
  Store,
  FileText
} from 'lucide-react';

interface NavbarProps {
  supplier: SupplierCompanyInfo;
  cart: CartItem[];
  activeView: 'store' | 'admin' | 'quotation';
  onViewChange: (view: 'store' | 'admin' | 'quotation') => void;
  onOpenCart: () => void;
}

export function Navbar({ supplier, cart, activeView, onViewChange, onOpenCart }: NavbarProps) {
  const totalCartQty = cart.reduce((acc, i) => acc + i.quantity, 0);
  const totalCartSubtotal = cart.reduce((acc, i) => acc + i.subtotal, 0);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all">
      {/* Top micro announcement bar */}
      <div className="bg-slate-900 text-slate-300 text-[11px] py-1.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-1">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-white font-medium">B2B Fast-Commerce & Instant Quotation Engine</span>
            <span className="hidden md:inline text-slate-400">| สั่งซื้อราคาส่งหน้าโรงงาน ออกใบเสนอราคาใน 30 วินาที</span>
          </div>
          <div className="flex items-center gap-3 text-slate-300">
            <span>ฝ่ายขายตรง: <strong className="text-white">{supplier.phone.split(',')[0]}</strong></span>
            <span className="hidden sm:inline">|</span>
            <span className="hidden sm:inline">จัดส่งด่วนทั่วประเทศ</span>
          </div>
        </div>
      </div>

      {/* Main Nav Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
        {/* Brand / Company Identity */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-amber-400 font-extrabold text-xl shadow-md border border-slate-800">
            SD
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black tracking-widest text-slate-900 uppercase">SALESDESK</span>
              <span className="bg-amber-100 text-amber-800 text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider">
                B2B Fast
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-semibold truncate max-w-[220px] sm:max-w-xs">
              {supplier.companyName}
            </p>
          </div>
        </div>

        {/* View Switcher: Storefront vs Admin */}
        <div className="bg-slate-100 p-1 rounded-xl flex items-center border border-slate-200 text-xs font-bold">
          <button
            onClick={() => onViewChange('store')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
              activeView === 'store'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Store className="w-3.5 h-3.5 text-amber-600" />
            หน้าร้านแคตตาล็อก
          </button>

          <button
            onClick={() => onViewChange('admin')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
              activeView === 'admin'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Settings className="w-3.5 h-3.5 text-indigo-600" />
            หลังบ้านโรงงาน (Admin)
          </button>
        </div>

        {/* Cart / Quotation Trigger Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenCart}
            className="flex items-center gap-2.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl shadow-md transition group"
          >
            <div className="relative">
              <ShoppingBag className="w-4 h-4 text-amber-400 group-hover:scale-110 transition" />
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-amber-500 text-slate-950 text-[10px] font-extrabold flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </div>
            <div className="text-left hidden sm:block">
              <div className="text-[10px] text-slate-400 leading-none">รายการขอราคา</div>
              <div className="text-xs font-mono font-bold text-amber-300 leading-tight">
                ฿{totalCartSubtotal.toLocaleString()}
              </div>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
}

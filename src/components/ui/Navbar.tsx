'use client';

import React from 'react';
import { SupplierCompanyInfo, CartItem } from '@/lib/types';
import {
  ShoppingBag,
  Settings,
  Store,
  PhoneCall
} from 'lucide-react';

interface NavbarProps {
  supplier: SupplierCompanyInfo;
  cart: CartItem[];
  activeView: 'store' | 'admin' | 'quotation';
  onViewChange: (view: 'store' | 'admin' | 'quotation') => void;
  onOpenCart: () => void;
}

export function Navbar({ supplier, cart, activeView, onViewChange, onOpenCart }: NavbarProps) {
  const totalCartSubtotal = cart.reduce((acc, i) => acc + i.subtotal, 0);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all shadow-xs">
      {/* Top micro announcement bar */}
      <div className="bg-slate-900 text-slate-300 text-[10px] sm:text-[11px] py-1 px-3 sm:px-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center gap-2">
          <div className="flex items-center gap-1.5 truncate">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
            <span className="text-white font-medium truncate">B2B Fast-Commerce & Instant Quotation</span>
            <span className="hidden md:inline text-slate-400">| สั่งซื้อราคาส่งหน้าโรงงาน ออกใบเสนอราคาใน 30 วินาที</span>
          </div>
          <div className="flex items-center gap-2 text-slate-300 shrink-0 text-[10px]">
            <span>โทร: <strong className="text-white">{supplier.phone.split(',')[0]}</strong></span>
          </div>
        </div>
      </div>

      {/* Main Nav Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 sm:py-3.5 flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand / Company Identity */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0 min-w-0">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-slate-900 flex items-center justify-center text-amber-400 font-extrabold text-sm sm:text-xl shadow-md border border-slate-800 shrink-0">
            SD
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1 sm:gap-2">
              <span className="text-[11px] sm:text-xs font-black tracking-wider text-slate-900 uppercase">
                SALESDESK
              </span>
              <span className="bg-amber-100 text-amber-800 text-[8px] sm:text-[9px] font-extrabold px-1 py-0.2 rounded uppercase">
                B2B
              </span>
            </div>
            <p className="text-[9px] sm:text-[11px] text-slate-500 font-medium truncate max-w-[110px] sm:max-w-xs">
              {supplier.companyName}
            </p>
          </div>
        </div>

        {/* View Switcher: Storefront vs Admin */}
        <div className="bg-slate-100 p-0.5 sm:p-1 rounded-lg sm:rounded-xl flex items-center border border-slate-200 text-[11px] sm:text-xs font-bold shrink-0">
          <button
            onClick={() => onViewChange('store')}
            className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-md sm:rounded-lg transition whitespace-nowrap ${
              activeView === 'store'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Store className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span className="hidden sm:inline">หน้าร้านแคตตาล็อก</span>
            <span className="sm:hidden">หน้าร้าน</span>
          </button>

          <button
            onClick={() => onViewChange('admin')}
            className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-md sm:rounded-lg transition whitespace-nowrap ${
              activeView === 'admin'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Settings className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
            <span className="hidden sm:inline">หลังบ้าน (Admin)</span>
            <span className="sm:hidden">หลังบ้าน</span>
          </button>
        </div>

        {/* Cart / Quotation Trigger Button */}
        <div className="flex items-center shrink-0">
          <button
            onClick={onOpenCart}
            className="flex items-center gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg sm:rounded-xl shadow-md transition group"
          >
            <div className="relative">
              <ShoppingBag className="w-4 h-4 text-amber-400 group-hover:scale-110 transition shrink-0" />
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2.5 w-4 h-4 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </div>
            <div className="text-left hidden md:block">
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

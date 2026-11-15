'use client';

import React from 'react';
import { SupplierCompanyInfo, CartItem } from '@/lib/types';
import {
  ShoppingBag,
  Settings,
  Store
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
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-zinc-200/60 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center text-white font-bold text-xs tracking-wider shadow-xs">
            SD
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold tracking-tight text-zinc-900">
                SALESDESK
              </span>
              <span className="text-[10px] font-mono font-medium text-zinc-400">
                B2B
              </span>
            </div>
            <p className="text-[11px] text-zinc-500 font-normal truncate max-w-[140px] sm:max-w-xs">
              {supplier.companyName}
            </p>
          </div>
        </div>

        {/* View Switcher: Storefront vs Admin */}
        <div className="bg-zinc-100/80 p-0.5 rounded-full flex items-center border border-zinc-200/50 text-xs font-medium">
          <button
            onClick={() => onViewChange('store')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full transition whitespace-nowrap ${
              activeView === 'store'
                ? 'bg-white text-zinc-900 shadow-xs font-semibold'
                : 'text-zinc-500 hover:text-zinc-900'
            }`}
          >
            <Store className="w-3.5 h-3.5 text-zinc-700" />
            <span>แคตตาล็อก</span>
          </button>

          <button
            onClick={() => onViewChange('admin')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full transition whitespace-nowrap ${
              activeView === 'admin'
                ? 'bg-white text-zinc-900 shadow-xs font-semibold'
                : 'text-zinc-500 hover:text-zinc-900'
            }`}
          >
            <Settings className="w-3.5 h-3.5 text-zinc-500" />
            <span>หลังบ้าน</span>
          </button>
        </div>

        {/* Cart / Quotation Trigger Button */}
        <div className="flex items-center">
          <button
            onClick={onOpenCart}
            className="flex items-center gap-2.5 px-3.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-full transition shadow-xs group"
          >
            <div className="relative">
              <ShoppingBag className="w-3.5 h-3.5 text-zinc-200 group-hover:scale-105 transition shrink-0" />
              {cart.length > 0 && (
                <span className="absolute -top-1.5 -right-2 w-3.5 h-3.5 rounded-full bg-amber-500 text-zinc-950 text-[9px] font-bold flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </div>
            <span className="text-xs font-medium font-mono text-zinc-200">
              {cart.length > 0 ? `฿${totalCartSubtotal.toLocaleString()}` : 'รายการขอราคา'}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}

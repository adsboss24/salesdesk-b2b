'use client';

import { useState, useEffect } from 'react';
import { B2BProduct, SupplierCompanyInfo, Quotation, Order, CartItem } from './types';
import { INITIAL_PRODUCTS, DEFAULT_SUPPLIER, SAMPLE_QUOTATIONS, SAMPLE_ORDERS } from './mock-data';

const STORAGE_KEYS = {
  PRODUCTS: 'salesdesk_b2b_products',
  SUPPLIER: 'salesdesk_b2b_supplier',
  QUOTATIONS: 'salesdesk_b2b_quotations',
  ORDERS: 'salesdesk_b2b_orders',
  CART: 'salesdesk_b2b_cart',
};

export function getInitialProducts(): B2BProduct[] {
  if (typeof window === 'undefined') return INITIAL_PRODUCTS;
  try {
    const item = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    return item ? JSON.parse(item) : INITIAL_PRODUCTS;
  } catch {
    return INITIAL_PRODUCTS;
  }
}

export function saveProducts(products: B2BProduct[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
}

export function getInitialSupplier(): SupplierCompanyInfo {
  if (typeof window === 'undefined') return DEFAULT_SUPPLIER;
  try {
    const item = localStorage.getItem(STORAGE_KEYS.SUPPLIER);
    return item ? JSON.parse(item) : DEFAULT_SUPPLIER;
  } catch {
    return DEFAULT_SUPPLIER;
  }
}

export function saveSupplier(supplier: SupplierCompanyInfo) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.SUPPLIER, JSON.stringify(supplier));
}

export function getInitialQuotations(): Quotation[] {
  if (typeof window === 'undefined') return SAMPLE_QUOTATIONS;
  try {
    const item = localStorage.getItem(STORAGE_KEYS.QUOTATIONS);
    return item ? JSON.parse(item) : SAMPLE_QUOTATIONS;
  } catch {
    return SAMPLE_QUOTATIONS;
  }
}

export function saveQuotations(quotations: Quotation[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.QUOTATIONS, JSON.stringify(quotations));
}

export function getInitialOrders(): Order[] {
  if (typeof window === 'undefined') return SAMPLE_ORDERS;
  try {
    const item = localStorage.getItem(STORAGE_KEYS.ORDERS);
    return item ? JSON.parse(item) : SAMPLE_ORDERS;
  } catch {
    return SAMPLE_ORDERS;
  }
}

export function saveOrders(orders: Order[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
}

export function getInitialCart(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const item = localStorage.getItem(STORAGE_KEYS.CART);
    return item ? JSON.parse(item) : [];
  } catch {
    return [];
  }
}

export function saveCart(cart: CartItem[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
}

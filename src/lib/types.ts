export interface ProductVariant {
  id: string;
  name: string; // e.g. "หนา 5 มม. (เกรดพรีเมียม)" หรือ "ขนาด 30x40 ซม."
  sku: string;
  pricePerUnit: number; // ราคาฐานต่อหน่วย (บาท)
  minQuantity: number;  // MOQ ของ variant นี้
  stockStatus: 'in_stock' | 'pre_order' | 'made_to_order';
  leadTimeDays?: number;
}

export interface TierPrice {
  minQty: number;
  maxQty?: number; // undefined = ขึ้นไป
  discountPercent?: number; // เช่น 5%
  unitPrice: number; // ราคาต่อหน่วยสุทธิใน Tier นี้
}

export interface B2BProduct {
  id: string;
  code: string; // เช่น PKG-BX-001
  name: string;
  category: string;
  description: string;
  specifications: Record<string, string>; // เช่น {"วัสดุ": "กระดาษคราฟท์ 3 ชั้น", "มาตรฐาน": "ISO 9001:2015"}
  unit: string; // เช่น ชิ้น, กล่อง, ลัง, ม้วน, พาเลท
  moq: number; // Minimum Order Quantity
  basePrice: number;
  imageUrl: string;
  badge?: string; // เช่น "สินค้ายอดนิยม", "พร้อมส่งล็อตใหญ่"
  variants: ProductVariant[];
  tierPricing: TierPrice[];
  inStock: boolean;
}

export interface CartItem {
  id: string;
  productId: string;
  productName: string;
  productCode: string;
  unit: string;
  variantId?: string;
  variantName?: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  appliedDiscountPercent?: number;
}

export interface CustomerCompanyInfo {
  companyName: string;
  taxId: string; // 13 หลัก
  branchType: 'headquarter' | 'branch';
  branchNumber?: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  postalCode: string;
  department?: string;
  paymentTerm: 'cash' | 'credit_7' | 'credit_15' | 'credit_30' | 'credit_60';
}

export interface SupplierCompanyInfo {
  companyName: string;
  taxId: string;
  branch: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  bankName: string;
  bankAccountName: string;
  bankAccountNumber: string;
  bankBranch: string;
  promptPayId?: string;
  authorizedSignerName: string;
  authorizedSignerTitle: string;
  logoUrl?: string;
}

export interface Quotation {
  id: string;
  quotationNumber: string; // e.g. QT-202611-0088
  createdAt: string;
  validUntil: string;
  customer: CustomerCompanyInfo;
  items: CartItem[];
  subtotal: number;
  discountTotal: number;
  shippingFee: number;
  vatRate: number; // 0.07
  vatAmount: number;
  withholdingTaxRate: number; // 0, 0.01, 0.03
  withholdingTaxAmount: number;
  grandTotal: number;
  netPayable: number;
  status: 'draft' | 'sent' | 'approved' | 'rejected' | 'ordered' | 'expired';
  notes?: string;
  deliveryTerms?: string;
}

export interface Order {
  id: string;
  orderNumber: string; // e.g. SO-202611-0023
  quotationId?: string;
  quotationNumber?: string;
  createdAt: string;
  customer: CustomerCompanyInfo;
  items: CartItem[];
  subtotal: number;
  vatAmount: number;
  shippingFee: number;
  grandTotal: number;
  paymentMethod: 'bank_transfer' | 'promptpay' | 'credit_term';
  paymentStatus: 'pending_proof' | 'reviewing_slip' | 'confirmed' | 'failed';
  slipUrl?: string;
  transferTime?: string;
  trackingNumber?: string;
  notes?: string;
}

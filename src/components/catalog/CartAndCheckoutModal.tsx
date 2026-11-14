'use client';

import React, { useState } from 'react';
import { CartItem, CustomerCompanyInfo, Quotation, Order, SupplierCompanyInfo } from '@/lib/types';
import { thaiBahtText } from '@/lib/mock-data';
import confetti from 'canvas-confetti';
import {
  X,
  Trash2,
  FileText,
  CreditCard,
  Building2,
  CheckCircle2,
  Upload,
  ArrowRight,
  ShieldCheck,
  Receipt,
  Phone,
  Mail,
  User,
  MapPin,
  Clock
} from 'lucide-react';

interface CartAndCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  supplier: SupplierCompanyInfo;
  onUpdateQuantity: (id: string, qty: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
  onCreateQuotation: (quotation: Quotation) => void;
  onCreateOrder: (order: Order) => void;
}

export function CartAndCheckoutModal({
  isOpen,
  onClose,
  cart,
  supplier,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onCreateQuotation,
  onCreateOrder
}: CartAndCheckoutModalProps) {
  const [activeTab, setActiveTab] = useState<'cart' | 'quote_form' | 'transfer_form'>('cart');

  // Customer form state
  const [customer, setCustomer] = useState<CustomerCompanyInfo>({
    companyName: 'บริษัท สยามแมนูแฟคเจอริ่ง แอนด์ เทรดดิ้ง จำกัด',
    taxId: '0105561088921',
    branchType: 'headquarter',
    branchNumber: '',
    contactPerson: 'คุณอรรถพล เจริญสุข (ผู้จัดการฝ่ายจัดซื้อ)',
    email: 'attapon@siammanufacturing.com',
    phone: '081-888-9999',
    address: 'เลขที่ 99/12 หมู่ 4 ถนนกิ่งแก้ว ต.ราชาเทวะ อ.บางพลี จ.สมุทรปราการ',
    postalCode: '10540',
    department: 'ฝ่ายจัดซื้อและห่วงโซ่อุปทาน',
    paymentTerm: 'credit_30'
  });

  const [withholdingTaxRate, setWithholdingTaxRate] = useState<number>(0);
  const [notes, setNotes] = useState<string>('ต้องการสินค้าเร่งด่วน พร้อมใบกำกับภาษีตัวจริงแนบมากับสินค้า');
  const [slipFile, setSlipFile] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  // Calculation
  const subtotal = cart.reduce((acc, item) => acc + item.subtotal, 0);
  const shippingFee = subtotal >= 50000 || subtotal === 0 ? 0 : 500;
  const vatRate = 0.07;
  const taxableAmount = subtotal + shippingFee;
  const vatAmount = taxableAmount * vatRate;
  const grandTotal = taxableAmount + vatAmount;
  const withholdingTaxAmount = taxableAmount * withholdingTaxRate;
  const netPayable = grandTotal - withholdingTaxAmount;

  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const handleGenerateQuotation = () => {
    if (!customer.companyName.trim() || !customer.phone.trim()) {
      alert('กรุณากรอกชื่อบริษัทและเบอร์โทรศัพท์ผู้ติดต่อ');
      return;
    }

    setIsSubmitting(true);
    triggerConfetti();

    const timestamp = Date.now();
    const date = new Date();
    const validDate = new Date();
    validDate.setDate(date.getDate() + 30); // 30 วัน

    const qNumber = `QT-${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 9000) + 1000)}`;

    const newQuotation: Quotation = {
      id: `qt-${timestamp}`,
      quotationNumber: qNumber,
      createdAt: date.toISOString(),
      validUntil: validDate.toISOString(),
      customer,
      items: [...cart],
      subtotal,
      discountTotal: 0,
      shippingFee,
      vatRate,
      vatAmount,
      withholdingTaxRate,
      withholdingTaxAmount,
      grandTotal,
      netPayable,
      status: 'sent',
      notes,
      deliveryTerms: 'จัดส่งฟรีในเขตกรุงเทพฯ และปริมณฑลเมื่อมียอดสั่งซื้อ 50,000 บาทขึ้นไป'
    };

    setTimeout(() => {
      onCreateQuotation(newQuotation);
      setIsSubmitting(false);
      onClose();
    }, 400);
  };

  const handleConfirmTransferOrder = () => {
    if (!customer.companyName.trim() || !customer.phone.trim()) {
      alert('กรุณากรอกชื่อบริษัทและเบอร์โทรศัพท์ผู้ติดต่อ');
      return;
    }

    setIsSubmitting(true);
    triggerConfetti();

    const timestamp = Date.now();
    const date = new Date();
    const orderNum = `SO-${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 9000) + 1000)}`;

    const newOrder: Order = {
      id: `so-${timestamp}`,
      orderNumber: orderNum,
      createdAt: date.toISOString(),
      customer,
      items: [...cart],
      subtotal,
      vatAmount,
      shippingFee,
      grandTotal,
      paymentMethod: 'bank_transfer',
      paymentStatus: slipFile ? 'reviewing_slip' : 'pending_proof',
      slipUrl: slipFile || undefined,
      transferTime: new Date().toLocaleString('th-TH'),
      notes
    };

    setTimeout(() => {
      onCreateOrder(newOrder);
      setIsSubmitting(false);
      onClearCart();
      onClose();
    }, 400);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSlipFile(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-slate-950/70 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-4xl rounded-xl sm:rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[96vh] sm:max-h-[92vh]">
        
        {/* Modal Top Header */}
        <div className="p-3.5 sm:p-5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-amber-600 flex items-center justify-center font-bold text-white shadow-sm shrink-0">
              <Receipt className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-sm sm:text-lg truncate">
                {activeTab === 'cart' && 'รายการสินค้า B2B ที่เลือก (B2B Cart)'}
                {activeTab === 'quote_form' && 'ออกใบเสนอราคาทางการ (Instant Quotation PDF)'}
                {activeTab === 'transfer_form' && 'ชำระเงินโอนธนาคารนิติบุคคล & แนบสลิป'}
              </h3>
              <p className="text-[10px] sm:text-xs text-slate-400 truncate">
                {cart.length} รายการ | {supplier.companyName}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition shrink-0 ml-2"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-slate-100 border-b border-slate-200 px-3 sm:px-5 flex gap-1.5 sm:gap-2 pt-2 overflow-x-auto scrollbar-none [&::-webkit-scrollbar]:hidden">
          <button
            onClick={() => setActiveTab('cart')}
            className={`px-3 sm:px-4 py-2 text-xs font-bold rounded-t-lg transition border-t border-x shrink-0 whitespace-nowrap ${
              activeTab === 'cart'
                ? 'bg-white border-slate-200 text-slate-900 shadow-xs'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            1. ตรวจสอบรายการ ({cart.length})
          </button>
          <button
            onClick={() => cart.length > 0 && setActiveTab('quote_form')}
            disabled={cart.length === 0}
            className={`px-3 sm:px-4 py-2 text-xs font-bold rounded-t-lg transition border-t border-x flex items-center gap-1.5 shrink-0 whitespace-nowrap ${
              activeTab === 'quote_form'
                ? 'bg-white border-slate-200 text-amber-700 shadow-xs'
                : 'border-transparent text-slate-500 hover:text-slate-900 disabled:opacity-40'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            2. ทางเลือก A: ออกใบเสนอราคา (PDF)
          </button>
          <button
            onClick={() => cart.length > 0 && setActiveTab('transfer_form')}
            disabled={cart.length === 0}
            className={`px-3 sm:px-4 py-2 text-xs font-bold rounded-t-lg transition border-t border-x flex items-center gap-1.5 shrink-0 whitespace-nowrap ${
              activeTab === 'transfer_form'
                ? 'bg-white border-slate-200 text-emerald-700 shadow-xs'
                : 'border-transparent text-slate-500 hover:text-slate-900 disabled:opacity-40'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            2. ทางเลือก B: โอนชำระเงินทันที
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4 sm:space-y-6">
          {activeTab === 'cart' && (
            <div>
              {cart.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <Receipt className="w-12 h-12 mx-auto stroke-1 mb-3 text-slate-300" />
                  <p className="text-sm font-semibold text-slate-600">ยังไม่มีสินค้าในรายการคำนวณราคา</p>
                  <p className="text-xs text-slate-400 mt-1">กรุณากดเลือกสินค้าจากแคตตาล็อกด้านล่างเพื่อคำนวณราคา Tier B2B</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="divide-y divide-slate-200 border border-slate-200 rounded-xl overflow-hidden">
                    {cart.map((item) => (
                      <div key={item.id} className="p-4 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-semibold px-2 py-0.5 bg-slate-100 text-slate-700 rounded">
                              {item.productCode}
                            </span>
                            <h4 className="font-bold text-slate-900 text-sm">{item.productName}</h4>
                          </div>
                          {item.variantName && (
                            <p className="text-xs text-slate-500 mt-1">สเปก: {item.variantName}</p>
                          )}
                          <div className="text-xs text-slate-600 mt-1">
                            ราคาต่อหน่วย: ฿{item.unitPrice.toLocaleString()}/{item.unit}
                            {item.appliedDiscountPercent && (
                              <span className="ml-1 text-emerald-600 font-bold">
                                (ส่วนลดสเกล B2B {item.appliedDiscountPercent}%)
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="flex items-center border border-slate-300 rounded-lg bg-slate-50 overflow-hidden">
                            <button
                              type="button"
                              onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 10))}
                              className="px-2.5 py-1 text-slate-600 hover:bg-slate-200 font-bold text-sm"
                            >
                              -
                            </button>
                            <span className="w-16 text-center text-xs font-bold font-mono py-1 bg-white text-slate-800">
                              {item.quantity.toLocaleString()}
                            </span>
                            <button
                              type="button"
                              onClick={() => onUpdateQuantity(item.id, item.quantity + 10)}
                              className="px-2.5 py-1 text-slate-600 hover:bg-slate-200 font-bold text-sm"
                            >
                              +
                            </button>
                          </div>

                          <div className="text-right min-w-[100px]">
                            <div className="text-sm font-extrabold text-slate-900 font-mono">
                              ฿{item.subtotal.toLocaleString()}
                            </div>
                            <div className="text-[10px] text-slate-400">ยังไม่รวม VAT</div>
                          </div>

                          <button
                            onClick={() => onRemoveItem(item.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition"
                            title="ลบรายการ"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Summary Box */}
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-2 text-xs">
                    <div className="flex justify-between text-slate-600">
                      <span>ยอดรวมสินค้า (Subtotal):</span>
                      <span className="font-bold text-slate-900 font-mono text-sm">฿{subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>ค่าจัดส่ง (Delivery Fee):</span>
                      <span className="font-semibold text-slate-800">
                        {shippingFee === 0 ? 'ฟรี (ส่งฟรีทั่วกรุงเทพฯ และปริมณฑล)' : `฿${shippingFee.toLocaleString()}`}
                      </span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>ภาษีมูลค่าเพิ่ม 7% (VAT 7%):</span>
                      <span className="font-semibold text-slate-800 font-mono">฿{vatAmount.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                    <div className="border-t border-slate-200 pt-3 flex justify-between items-baseline text-slate-900">
                      <span className="text-sm font-extrabold">ยอดรวมสุทธิทั้งสิ้น (Grand Total):</span>
                      <span className="text-xl font-extrabold text-amber-600 font-mono">
                        ฿{grandTotal.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>

                  {/* Dual Action Branching Choice */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <button
                      onClick={() => setActiveTab('quote_form')}
                      className="p-4 bg-gradient-to-br from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white rounded-xl shadow-md text-left transition group border border-amber-500"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded">
                          ทางเลือก A: แนะนำสำหรับจัดซื้อ
                        </span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                      </div>
                      <h4 className="font-bold text-base">ออกใบเสนอราคาทางการ (PDF)</h4>
                      <p className="text-xs text-amber-100 mt-1">
                        พิมพ์เอกสาร PDF ได้ทันที มีเลขที่และยอดคำนวณถูกต้องตามสรรพากร พร้อมส่งขออนุมัติ
                      </p>
                    </button>

                    <button
                      onClick={() => setActiveTab('transfer_form')}
                      className="p-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl shadow-md text-left transition group border border-slate-700"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold uppercase tracking-wider bg-slate-800 px-2 py-0.5 rounded text-emerald-400">
                          ทางเลือก B: สั่งซื้อและชำระเงินทันที
                        </span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                      </div>
                      <h4 className="font-bold text-base">โอนเงินธนาคารนิติบุคคล / แนบสลิป</h4>
                      <p className="text-xs text-slate-400 mt-1">
                        ชำระผ่าน SCB หรือ PromptPay พร้อมส่งหลักฐานเพื่อจัดส่งสินค้าทันที 24 ชม.
                      </p>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Quotation Form */}
          {activeTab === 'quote_form' && (
            <div className="space-y-6">
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-900 flex items-start gap-3">
                <FileText className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm">ระบบออกใบเสนอราคาอัตโนมัติ (Instant Quotation Engine)</h4>
                  <p className="mt-0.5 text-amber-800">
                    กรอกข้อมูลบริษัทของคุณ ระบบจะคำนวณราคาส่ง B2B, ภาษีมูลค่าเพิ่ม 7%, ภาษีหัก ณ ที่จ่าย และสร้างเอกสารมาตรฐาน A4 พร้อมตราประทับและลายเซ็นอิเล็กทรอนิกส์ใน 30 วินาที
                  </p>
                </div>
              </div>

              {/* Company Info Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1 md:col-span-2">
                  <label className="font-bold text-slate-700 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-amber-600" />
                    ชื่อบริษัท / นิติบุคคลผู้ซื้อ (Company Name) *
                  </label>
                  <input
                    type="text"
                    value={customer.companyName}
                    onChange={(e) => setCustomer({ ...customer, companyName: e.target.value })}
                    className="w-full p-2.5 border border-slate-300 rounded-lg text-slate-900 focus:border-amber-600 focus:ring-1 focus:ring-amber-600"
                    placeholder="บจก. / หจก. ..."
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">เลขประจำตัวผู้เสียภาษี 13 หลัก (Tax ID) *</label>
                  <input
                    type="text"
                    maxLength={13}
                    value={customer.taxId}
                    onChange={(e) => setCustomer({ ...customer, taxId: e.target.value })}
                    className="w-full p-2.5 border border-slate-300 rounded-lg text-slate-900 font-mono"
                    placeholder="01055xxxxxxxx"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">สาขา (Branch)</label>
                  <div className="flex gap-4 items-center pt-2">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="branch"
                        checked={customer.branchType === 'headquarter'}
                        onChange={() => setCustomer({ ...customer, branchType: 'headquarter', branchNumber: '' })}
                      />
                      <span>สำนักงานใหญ่ (Head Office)</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="branch"
                        checked={customer.branchType === 'branch'}
                        onChange={() => setCustomer({ ...customer, branchType: 'branch' })}
                      />
                      <span>สาขา</span>
                    </label>
                    {customer.branchType === 'branch' && (
                      <input
                        type="text"
                        value={customer.branchNumber || ''}
                        onChange={(e) => setCustomer({ ...customer, branchNumber: e.target.value })}
                        placeholder="เช่น 00001"
                        className="w-24 p-1.5 border border-slate-300 rounded text-xs"
                      />
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-slate-500" />
                    ชื่อผู้ติดต่อ / ตำแหน่ง (Contact Person) *
                  </label>
                  <input
                    type="text"
                    value={customer.contactPerson}
                    onChange={(e) => setCustomer({ ...customer, contactPerson: e.target.value })}
                    className="w-full p-2.5 border border-slate-300 rounded-lg text-slate-900"
                    placeholder="คุณ..."
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">ฝ่าย / แผนก (Department)</label>
                  <input
                    type="text"
                    value={customer.department || ''}
                    onChange={(e) => setCustomer({ ...customer, department: e.target.value })}
                    className="w-full p-2.5 border border-slate-300 rounded-lg text-slate-900"
                    placeholder="เช่น ฝ่ายจัดซื้อ / สโตร์"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-500" />
                    เบอร์โทรศัพท์ (Phone) *
                  </label>
                  <input
                    type="text"
                    value={customer.phone}
                    onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                    className="w-full p-2.5 border border-slate-300 rounded-lg text-slate-900"
                    placeholder="08x-xxx-xxxx"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-500" />
                    อีเมลสำหรับส่งใบเสนอราคา (Email) *
                  </label>
                  <input
                    type="email"
                    value={customer.email}
                    onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                    className="w-full p-2.5 border border-slate-300 rounded-lg text-slate-900"
                    placeholder="purchasing@company.com"
                  />
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label className="font-bold text-slate-700 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    ที่อยู่สำหรับจัดส่งและออกใบกำกับภาษี (Billing & Delivery Address) *
                  </label>
                  <textarea
                    rows={2}
                    value={customer.address}
                    onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                    className="w-full p-2.5 border border-slate-300 rounded-lg text-slate-900"
                    placeholder="เลขที่ อาคาร ซอย ถนน ตำบล อำเภอ จังหวัด..."
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">รหัสไปรษณีย์</label>
                  <input
                    type="text"
                    maxLength={5}
                    value={customer.postalCode}
                    onChange={(e) => setCustomer({ ...customer, postalCode: e.target.value })}
                    className="w-full p-2.5 border border-slate-300 rounded-lg text-slate-900 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    เงื่อนไขเครดิตเทอม (Payment Terms)
                  </label>
                  <select
                    value={customer.paymentTerm}
                    onChange={(e) => setCustomer({ ...customer, paymentTerm: e.target.value as any })}
                    className="w-full p-2.5 border border-slate-300 rounded-lg text-slate-900 bg-white"
                  >
                    <option value="cash">ชำระเงินสด / โอนก่อนจัดส่ง</option>
                    <option value="credit_7">เครดิต 7 วัน</option>
                    <option value="credit_15">เครดิต 15 วัน</option>
                    <option value="credit_30">เครดิต 30 วัน (มาตรฐานโรงงาน)</option>
                    <option value="credit_60">เครดิต 60 วัน (โครงการใหญ่)</option>
                  </select>
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label className="font-bold text-slate-700">ภาษีหัก ณ ที่จ่าย (Withholding Tax)</label>
                  <div className="flex gap-4 items-center pt-1">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="wht"
                        checked={withholdingTaxRate === 0}
                        onChange={() => setWithholdingTaxRate(0)}
                      />
                      <span>ไม่มีการหัก ณ ที่จ่าย (0%)</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="wht"
                        checked={withholdingTaxRate === 0.01}
                        onChange={() => setWithholdingTaxRate(0.01)}
                      />
                      <span>หัก 1% (ค่าขนส่ง/บริการ)</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="wht"
                        checked={withholdingTaxRate === 0.03}
                        onChange={() => setWithholdingTaxRate(0.03)}
                      />
                      <span>หัก 3% (งานบริการ/สั่งทำ)</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Total Calculation Preview */}
              <div className="bg-slate-900 text-white p-4 rounded-xl flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
                <div>
                  <div className="text-slate-400">ยอดรวมทั้งสิ้น (รวม VAT 7%):</div>
                  <div className="text-xl font-extrabold text-amber-400 font-mono">
                    ฿{grandTotal.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  {withholdingTaxRate > 0 && (
                    <div className="text-[11px] text-slate-300">
                      หักภาษี {withholdingTaxRate * 100}% = ฿{withholdingTaxAmount.toLocaleString()} | ยอดจ่ายสุทธิ ฿{netPayable.toLocaleString()}
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleGenerateQuotation}
                  className="w-full sm:w-auto px-6 py-3 bg-amber-600 hover:bg-amber-500 text-white font-bold text-sm rounded-lg shadow-lg transition flex items-center justify-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  {isSubmitting ? 'กำลังสร้างเอกสาร...' : 'สร้างใบเสนอราคา PDF ทันที (Instant Generate)'}
                </button>
              </div>
            </div>
          )}

          {/* Tab 3: Transfer & Attach Slip Form */}
          {activeTab === 'transfer_form' && (
            <div className="space-y-6 text-xs">
              {/* Bank Account Info Box */}
              <div className="bg-gradient-to-r from-purple-900 to-indigo-900 text-white p-5 rounded-2xl shadow-md space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-amber-400" />
                    <span className="font-bold text-sm tracking-wide">บัญชีธนาคารนิติบุคคลผู้รับเงิน</span>
                  </div>
                  <span className="bg-white/20 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                    บัญชีกระแสรายวัน
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="bg-white/10 p-3 rounded-xl backdrop-blur-sm">
                    <div className="text-slate-300 text-[11px]">ธนาคารไทยพาณิชย์ (SCB)</div>
                    <div className="text-lg font-mono font-bold tracking-wider text-amber-300 mt-0.5">
                      {supplier.bankAccountNumber}
                    </div>
                    <div className="text-slate-200 text-xs mt-1 font-semibold">{supplier.bankAccountName}</div>
                    <div className="text-[10px] text-slate-400">{supplier.bankBranch}</div>
                  </div>

                  <div className="bg-white/10 p-3 rounded-xl backdrop-blur-sm">
                    <div className="text-slate-300 text-[11px]">PromptPay นิติบุคคล (13 หลัก)</div>
                    <div className="text-lg font-mono font-bold tracking-wider text-white mt-0.5">
                      {supplier.promptPayId || supplier.taxId}
                    </div>
                    <div className="text-slate-200 text-xs mt-1">สแกนจ่ายได้ทุกแอปธนาคาร</div>
                    <div className="text-[10px] text-slate-400">ชื่อบัญชี: {supplier.bankAccountName}</div>
                  </div>
                </div>

                <div className="border-t border-white/10 pt-2 flex justify-between items-center">
                  <span className="text-slate-300">ยอดชำระสุทธิ:</span>
                  <span className="text-xl font-bold font-mono text-amber-400">
                    ฿{grandTotal.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              {/* Slip Upload Area */}
              <div className="border-2 border-dashed border-slate-300 hover:border-amber-600 rounded-xl p-6 text-center transition bg-slate-50">
                {slipFile ? (
                  <div className="space-y-3">
                    <div className="w-32 h-44 mx-auto rounded-lg overflow-hidden border border-slate-200 shadow-sm relative">
                      <img src={slipFile} alt="Slip" className="w-full h-full object-cover" />
                    </div>
                    <p className="text-xs text-emerald-600 font-bold flex items-center justify-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> แนบสลิปเรียบร้อยแล้ว
                    </p>
                    <button
                      type="button"
                      onClick={() => setSlipFile(null)}
                      className="text-xs text-rose-600 hover:underline"
                    >
                      เปลี่ยนรูปสลิป
                    </button>
                  </div>
                ) : (
                  <div>
                    <Upload className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                    <h5 className="font-bold text-slate-800 text-sm">อัปโหลดหลักฐานการโอนเงิน (สลิปธนาคาร)</h5>
                    <p className="text-xs text-slate-500 mt-1">รองรับไฟล์ JPG, PNG, PDF ขนาดไม่เกิน 10MB</p>
                    <label className="inline-block mt-3 px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold cursor-pointer hover:bg-slate-800 transition">
                      เลือกไฟล์สลิป
                      <input
                        type="file"
                        accept="image/*,application/pdf"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                )}
              </div>

              {/* Basic Customer Contact for Delivery */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">ชื่อบริษัท / ผู้รับสินค้า *</label>
                  <input
                    type="text"
                    value={customer.companyName}
                    onChange={(e) => setCustomer({ ...customer, companyName: e.target.value })}
                    className="w-full p-2.5 border border-slate-300 rounded-lg text-slate-900 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">เบอร์โทรศัพท์ผู้รับ *</label>
                  <input
                    type="text"
                    value={customer.phone}
                    onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                    className="w-full p-2.5 border border-slate-300 rounded-lg text-slate-900 text-xs"
                  />
                </div>
                <div className="space-y-1 sm:col-span-2">
                  <label className="font-bold text-slate-700">ที่อยู่จัดส่งและออกใบกำกับภาษี *</label>
                  <textarea
                    rows={2}
                    value={customer.address}
                    onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                    className="w-full p-2.5 border border-slate-300 rounded-lg text-slate-900 text-xs"
                  />
                </div>
              </div>

              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleConfirmTransferOrder}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-xl shadow-lg transition flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-5 h-5" />
                {isSubmitting ? 'กำลังบันทึกคำสั่งซื้อ...' : 'ยืนยันการแจ้งชำระเงิน & ออกใบกำกับภาษี'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

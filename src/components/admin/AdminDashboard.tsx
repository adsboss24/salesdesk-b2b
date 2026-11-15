'use client';

import React, { useState, useRef } from 'react';
import { B2BProduct, SupplierCompanyInfo, Quotation, Order } from '@/lib/types';
import { exportCatalogTemplate, parseExcelCatalog } from '@/lib/excel-helper';
import { INITIAL_PRODUCTS } from '@/lib/mock-data';
import { ProductFormModal } from './ProductFormModal';
import {
  FileSpreadsheet,
  Upload,
  Download,
  Plus,
  Trash2,
  Edit,
  Eye,
  CheckCircle2,
  Clock,
  Building,
  CreditCard,
  Send,
  AlertCircle,
  Package,
  FileText,
  Search,
  RefreshCw,
  Sliders,
  DollarSign
} from 'lucide-react';

interface AdminDashboardProps {
  products: B2BProduct[];
  supplier: SupplierCompanyInfo;
  quotations: Quotation[];
  orders: Order[];
  onUpdateProducts: (newProducts: B2BProduct[]) => void;
  onUpdateSupplier: (newSupplier: SupplierCompanyInfo) => void;
  onUpdateQuotationStatus: (id: string, status: Quotation['status']) => void;
  onUpdateOrderStatus: (id: string, status: Order['paymentStatus']) => void;
  onViewQuotation: (quotation: Quotation) => void;
}

export function AdminDashboard({
  products,
  supplier,
  quotations,
  orders,
  onUpdateProducts,
  onUpdateSupplier,
  onUpdateQuotationStatus,
  onUpdateOrderStatus,
  onViewQuotation
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'products' | 'excel' | 'quotations' | 'orders' | 'settings' | 'webhook'>('quotations');
  const [searchTerm, setSearchTerm] = useState('');
  const [importedPreview, setImportedPreview] = useState<B2BProduct[] | null>(null);
  const [companyForm, setCompanyForm] = useState<SupplierCompanyInfo>({ ...supplier });
  const [webhookMessage, setWebhookMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // New / Edit product modal state
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<B2BProduct | null>(null);

  const handleSaveProduct = (product: B2BProduct) => {
    if (editingProduct) {
      const updated = products.map((p) => (p.id === product.id ? product : p));
      onUpdateProducts(updated);
      alert(`บันทึกการแก้ไขสินค้า ${product.name} เรียบร้อยแล้ว`);
    } else {
      onUpdateProducts([product, ...products]);
      alert(`เพิ่มสินค้าใหม่ ${product.name} สำเร็จ!`);
    }
    setIsAddingProduct(false);
    setEditingProduct(null);
    setActiveTab('products');
  };

  const handleExcelUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        try {
          const buffer = evt.target?.result as ArrayBuffer;
          const parsed = parseExcelCatalog(buffer);
          setImportedPreview(parsed);
        } catch (err) {
          alert('เกิดข้อผิดพลาดในการอ่านไฟล์ Excel กรุณาตรวจสอบรูปแบบไฟล์ตาม Template');
        }
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const handleCommitImport = () => {
    if (importedPreview && importedPreview.length > 0) {
      const updated = [...importedPreview, ...products];
      onUpdateProducts(updated);
      setImportedPreview(null);
      alert(`นำเข้าสินค้า B2B สำเร็จ ${importedPreview.length} รายการ!`);
      setActiveTab('products');
    }
  };

  const handleSaveCompany = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSupplier(companyForm);
    alert('บันทึกข้อมูลบริษัทและบัญชีธนาคารเรียบร้อยแล้ว');
  };

  const handleResetCatalog = () => {
    if (confirm('คุณต้องการรีเซ็ตแคตตาล็อกกลับไปเป็นค่าเริ่มต้นจากโรงงานหรือไม่?')) {
      onUpdateProducts(INITIAL_PRODUCTS);
      alert('รีเซ็ตข้อมูลสินค้าเริ่มต้นเรียบร้อยแล้ว');
    }
  };

  const handleTestWebhook = () => {
    setWebhookMessage('กำลังส่งข้อความจำลองไปยัง LINE OA ฝ่ายขาย...');
    setTimeout(() => {
      setWebhookMessage('✅ ส่งการแจ้งเตือนสำเร็จ: [SalesDesk Bot] มีการขอใบเสนอราคาใหม่เลขที่ QT-202611-XXXX ยอดรวม ฿98,868 จาก บริษัท ไทยฟู้ดส์ฯ');
    }, 800);
  };

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6">
      {/* Top Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xl mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
              Admin & Factory Portal
            </span>
            <span className="text-xs text-slate-400">ระบบจัดการหลังบ้านซัพพลายเออร์</span>
          </div>
          <h1 className="text-2xl font-extrabold mt-1 text-white">SalesDesk B2B Control Center</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            จัดการแคตตาล็อกสินค้า, นำเข้าไฟล์ Excel, ติดตามใบเสนอราคา และตรวจสอบสลิปโอนเงิน
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTab('excel')}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg shadow transition"
          >
            <FileSpreadsheet className="w-4 h-4" />
            นำเข้า Excel
          </button>
          <button
            onClick={() => {
              setEditingProduct(null);
              setIsAddingProduct(true);
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold rounded-lg shadow transition"
          >
            <Plus className="w-4 h-4" />
            เพิ่มสินค้าใหม่
          </button>
          <button
            onClick={handleResetCatalog}
            className="flex items-center gap-1 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-lg transition"
            title="รีเซ็ตเป็นสินค้าตัวอย่าง"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            รีเซ็ต
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 border-b border-slate-200 mb-6 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('quotations')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-lg transition whitespace-nowrap ${
            activeTab === 'quotations'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FileText className="w-4 h-4 text-amber-400" />
          ใบเสนอราคา ({quotations.length})
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-lg transition whitespace-nowrap ${
            activeTab === 'orders'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <CreditCard className="w-4 h-4 text-emerald-400" />
          คำสั่งซื้อ & สลิปโอน ({orders.length})
        </button>

        <button
          onClick={() => setActiveTab('products')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-lg transition whitespace-nowrap ${
            activeTab === 'products'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Package className="w-4 h-4 text-blue-400" />
          จัดการสินค้า ({products.length})
        </button>

        <button
          onClick={() => setActiveTab('excel')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-lg transition whitespace-nowrap ${
            activeTab === 'excel'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
          Excel Importer
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-lg transition whitespace-nowrap ${
            activeTab === 'settings'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Building className="w-4 h-4 text-indigo-400" />
          ข้อมูลบริษัท & ธนาคาร
        </button>

        <button
          onClick={() => setActiveTab('webhook')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-lg transition whitespace-nowrap ${
            activeTab === 'webhook'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Send className="w-4 h-4 text-sky-400" />
          LINE OA & Webhook
        </button>
      </div>

      {/* Tab: Quotations List */}
      {activeTab === 'quotations' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
            <div>
              <h3 className="font-bold text-sm text-slate-800">ประวัติใบเสนอราคาทั้งหมด (Quotation Pipeline)</h3>
              <p className="text-xs text-slate-500">เอกสารที่ออกให้ลูกค้าทั้งหมด พร้อมสถานะการอนุมัติ</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-amber-100 text-amber-800 rounded-full">
              รวม {quotations.length} รายการ
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                  <th className="p-3">เลขที่ใบเสนอราคา</th>
                  <th className="p-3">วันที่ออก</th>
                  <th className="p-3">ชื่อบริษัทลูกค้า</th>
                  <th className="p-3">ผู้ติดต่อ</th>
                  <th className="p-3 text-right">ยอดสุทธิ (THB)</th>
                  <th className="p-3 text-center">สถานะ</th>
                  <th className="p-3 text-center">การจัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {quotations.map((q) => (
                  <tr key={q.id} className="hover:bg-slate-50 transition">
                    <td className="p-3 font-mono font-bold text-slate-900">{q.quotationNumber}</td>
                    <td className="p-3 text-slate-500">
                      {new Date(q.createdAt).toLocaleDateString('th-TH')}
                    </td>
                    <td className="p-3 font-semibold text-slate-800">{q.customer.companyName}</td>
                    <td className="p-3 text-slate-600">{q.customer.contactPerson}</td>
                    <td className="p-3 text-right font-mono font-bold text-slate-900">
                      ฿{q.grandTotal.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="p-3 text-center">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                        q.status === 'approved' ? 'bg-emerald-100 text-emerald-800' :
                        q.status === 'ordered' ? 'bg-blue-100 text-blue-800' :
                        q.status === 'sent' ? 'bg-amber-100 text-amber-800' :
                        'bg-slate-100 text-slate-600'
                      }`}>
                        {q.status === 'approved' ? 'อนุมัติแล้ว' :
                         q.status === 'ordered' ? 'สั่งซื้อแล้ว' :
                         q.status === 'sent' ? 'รอลูกค้าอนุมัติ' : 'ร่าง'}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => onViewQuotation(q)}
                          className="px-2.5 py-1 bg-amber-600 hover:bg-amber-500 text-white rounded font-semibold text-[11px] flex items-center gap-1 shadow-sm"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          ดูเอกสาร PDF
                        </button>

                        {q.status !== 'approved' && (
                          <button
                            onClick={() => onUpdateQuotationStatus(q.id, 'approved')}
                            className="p-1 hover:bg-emerald-50 text-emerald-600 rounded"
                            title="ทำเครื่องหมายว่าอนุมัติแล้ว"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Orders & Slips */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
            <div>
              <h3 className="font-bold text-sm text-slate-800">คำสั่งซื้อและการชำระเงิน (Orders & Payment Slips)</h3>
              <p className="text-xs text-slate-500">ตรวจสอบยอดเงินเข้าและสลิปหลักฐานการโอนเงิน</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full">
              {orders.length} คำสั่งซื้อ
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                  <th className="p-3">เลขที่คำสั่งซื้อ</th>
                  <th className="p-3">วันที่ / เวลา</th>
                  <th className="p-3">ชื่อบริษัทลูกค้า</th>
                  <th className="p-3 text-right">ยอดรวม (THB)</th>
                  <th className="p-3 text-center">สลิปธนาคาร</th>
                  <th className="p-3 text-center">สถานะการชำระ</th>
                  <th className="p-3 text-center">การจัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-50 transition">
                    <td className="p-3 font-mono font-bold text-slate-900">{o.orderNumber}</td>
                    <td className="p-3 text-slate-500">{new Date(o.createdAt).toLocaleDateString('th-TH')}</td>
                    <td className="p-3 font-semibold text-slate-800">{o.customer.companyName}</td>
                    <td className="p-3 text-right font-mono font-bold text-emerald-600">
                      ฿{o.grandTotal.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="p-3 text-center">
                      {o.slipUrl ? (
                        <a
                          href={o.slipUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:underline"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          ดูสลิป
                        </a>
                      ) : (
                        <span className="text-slate-400 text-[10px]">ไม่มีสลิป</span>
                      )}
                    </td>
                    <td className="p-3 text-center">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                        o.paymentStatus === 'confirmed' ? 'bg-emerald-100 text-emerald-800' :
                        o.paymentStatus === 'reviewing_slip' ? 'bg-amber-100 text-amber-800' :
                        'bg-slate-100 text-slate-600'
                      }`}>
                        {o.paymentStatus === 'confirmed' ? 'ตรวจสอบยอดแล้ว' :
                         o.paymentStatus === 'reviewing_slip' ? 'รอตรวจสลิป' : 'รอชำระ'}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      {o.paymentStatus !== 'confirmed' && (
                        <button
                          onClick={() => onUpdateOrderStatus(o.id, 'confirmed')}
                          className="px-2 py-1 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold rounded"
                        >
                          ยืนยันยอดเงิน
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Products Manager */}
      {activeTab === 'products' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 bg-white p-4 rounded-xl border border-slate-200">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="ค้นหารหัส หรือชื่อสินค้า..."
                className="w-full pl-9 pr-3 py-1.5 border border-slate-300 rounded-lg text-xs"
              />
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
              <div className="text-xs text-slate-500">
                สินค้าทั้งหมด <strong className="text-slate-900">{products.length}</strong> รายการ
              </div>
              <button
                onClick={() => {
                  setEditingProduct(null);
                  setIsAddingProduct(true);
                }}
                className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1 shadow-xs transition"
              >
                <Plus className="w-3.5 h-3.5" />
                เพิ่มสินค้าใหม่
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                  <th className="p-3 w-16">รูป</th>
                  <th className="p-3">รหัสสินค้า</th>
                  <th className="p-3">ชื่อสินค้า</th>
                  <th className="p-3">หมวดหมู่</th>
                  <th className="p-3 text-right">MOQ</th>
                  <th className="p-3 text-right">ราคาฐาน (THB)</th>
                  <th className="p-3 text-center">สเปก & Variants</th>
                  <th className="p-3 text-center">การจัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {products
                  .filter(p => !searchTerm || p.name.includes(searchTerm) || p.code.includes(searchTerm))
                  .map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50 transition">
                      <td className="p-3">
                        <img src={p.imageUrl} alt={p.name} className="w-10 h-10 object-cover rounded-lg border border-slate-200" />
                      </td>
                      <td className="p-3 font-mono font-bold text-slate-900">{p.code}</td>
                      <td className="p-3 font-semibold text-slate-800">{p.name}</td>
                      <td className="p-3 text-slate-600">{p.category}</td>
                      <td className="p-3 text-right font-mono font-bold text-slate-900">
                        {p.moq.toLocaleString()} {p.unit}
                      </td>
                      <td className="p-3 text-right font-mono font-bold text-amber-700">
                        ฿{p.basePrice.toLocaleString()}
                      </td>
                      <td className="p-3 text-center">
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[10px] font-medium">
                          {p.variants.length} รุ่นสเปก / {p.tierPricing.length} Tiers
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => {
                              setEditingProduct(p);
                              setIsAddingProduct(true);
                            }}
                            className="p-1 hover:bg-slate-100 text-slate-600 rounded transition"
                            title="แก้ไขสินค้า"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`คุณต้องการลบสินค้า ${p.name} หรือไม่?`)) {
                                onUpdateProducts(products.filter(item => item.id !== p.id));
                              }
                            }}
                            className="p-1 hover:bg-rose-50 text-rose-600 rounded transition"
                            title="ลบสินค้า"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Excel Importer */}
      {activeTab === 'excel' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-5">
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
                  ระบบนำเข้าสินค้าผ่านไฟล์ Excel (.xlsx / .csv)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  เปลี่ยนสเปรดชีตสินค้าของโรงงานเป็นระบบแคตตาล็อก B2B ออกใบเสนอราคาได้ทันที
                </p>
              </div>

              <button
                onClick={exportCatalogTemplate}
                className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition shadow"
              >
                <Download className="w-4 h-4 text-amber-400" />
                ดาวน์โหลด Template ตัวอย่าง (.xlsx)
              </button>
            </div>

            {/* Drag & Drop Upload Zone */}
            <div className="mt-6 border-2 border-dashed border-slate-300 hover:border-emerald-600 rounded-2xl p-8 text-center transition bg-slate-50/50">
              <Upload className="w-12 h-12 text-slate-400 mx-auto mb-3" />
              <h4 className="font-bold text-slate-800 text-sm">ลากไฟล์ Excel มาวางที่นี่ หรือคลิกเพื่อเลือกไฟล์</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                รองรับไฟล์นามสกุล .xlsx และ .csv ตามคอลัมน์มาตรฐานของ SalesDesk B2B
              </p>

              <label className="inline-block mt-4 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold cursor-pointer shadow-md transition">
                เลือกไฟล์จากเครื่อง
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx, .xls, .csv"
                  onChange={handleExcelUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Imported Preview Table */}
            {importedPreview && (
              <div className="mt-8 border-t border-slate-200 pt-6 space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">
                      ตัวอย่างข้อมูลที่อ่านได้จากไฟล์ ({importedPreview.length} รายการ)
                    </h4>
                    <p className="text-xs text-slate-500">ตรวจสอบความถูกต้องก่อนกดยืนยันบันทึกเข้าระบบ</p>
                  </div>
                  <button
                    onClick={handleCommitImport}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-lg transition flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    ยืนยันนำเข้าแคตตาล็อก
                  </button>
                </div>

                <div className="border border-slate-200 rounded-xl overflow-hidden max-h-80 overflow-y-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-slate-100 text-slate-700 sticky top-0">
                      <tr>
                        <th className="p-2.5">รหัสสินค้า</th>
                        <th className="p-2.5">ชื่อสินค้า</th>
                        <th className="p-2.5">หมวดหมู่</th>
                        <th className="p-2.5 text-right">MOQ</th>
                        <th className="p-2.5 text-right">ราคาฐาน</th>
                        <th className="p-2.5">สเปก</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {importedPreview.map((item, idx) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="p-2.5 font-mono font-bold">{item.code}</td>
                          <td className="p-2.5 font-semibold text-slate-900">{item.name}</td>
                          <td className="p-2.5 text-slate-600">{item.category}</td>
                          <td className="p-2.5 text-right font-mono">{item.moq} {item.unit}</td>
                          <td className="p-2.5 text-right font-mono font-bold text-emerald-600">฿{item.basePrice}</td>
                          <td className="p-2.5 text-[11px] text-slate-500">
                            {Object.entries(item.specifications).map(([k, v]) => `${k}:${v}`).join(', ') || '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab: Company Profile & Bank Settings */}
      {activeTab === 'settings' && (
        <form onSubmit={handleSaveCompany} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="border-b border-slate-200 pb-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Building className="w-5 h-5 text-indigo-600" />
              ตั้งค่าข้อมูลบริษัทผู้ขาย & ข้อมูลภาษี (Company Profile & Invoicing)
            </h3>
            <p className="text-xs text-slate-500">ข้อมูลนี้จะถูกพิมพ์ลงในหัวกระดาษของใบเสนอราคาและเอกสารทางการ</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1 md:col-span-2">
              <label className="font-bold text-slate-700">ชื่อบริษัท / นิติบุคคล (Company Name) *</label>
              <input
                type="text"
                value={companyForm.companyName}
                onChange={(e) => setCompanyForm({ ...companyForm, companyName: e.target.value })}
                className="w-full p-2.5 border border-slate-300 rounded-lg text-slate-900"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">เลขประจำตัวผู้เสียภาษี 13 หลัก (Tax ID) *</label>
              <input
                type="text"
                maxLength={13}
                value={companyForm.taxId}
                onChange={(e) => setCompanyForm({ ...companyForm, taxId: e.target.value })}
                className="w-full p-2.5 border border-slate-300 rounded-lg text-slate-900 font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">สาขา (Branch)</label>
              <input
                type="text"
                value={companyForm.branch}
                onChange={(e) => setCompanyForm({ ...companyForm, branch: e.target.value })}
                className="w-full p-2.5 border border-slate-300 rounded-lg text-slate-900"
              />
            </div>

            <div className="space-y-1 md:col-span-2">
              <label className="font-bold text-slate-700">ที่อยู่สำนักงาน / โรงงาน *</label>
              <textarea
                rows={2}
                value={companyForm.address}
                onChange={(e) => setCompanyForm({ ...companyForm, address: e.target.value })}
                className="w-full p-2.5 border border-slate-300 rounded-lg text-slate-900"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">เบอร์โทรศัพท์</label>
              <input
                type="text"
                value={companyForm.phone}
                onChange={(e) => setCompanyForm({ ...companyForm, phone: e.target.value })}
                className="w-full p-2.5 border border-slate-300 rounded-lg text-slate-900"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">อีเมลฝ่ายขาย</label>
              <input
                type="email"
                value={companyForm.email}
                onChange={(e) => setCompanyForm({ ...companyForm, email: e.target.value })}
                className="w-full p-2.5 border border-slate-300 rounded-lg text-slate-900"
              />
            </div>
          </div>

          <div className="border-t border-slate-200 pt-6">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-3">
              <CreditCard className="w-4 h-4 text-emerald-600" />
              บัญชีธนาคารสำหรับรับชำระเงิน B2B
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">ธนาคาร & สาขา</label>
                <input
                  type="text"
                  value={companyForm.bankName}
                  onChange={(e) => setCompanyForm({ ...companyForm, bankName: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 rounded-lg text-slate-900"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">เลขที่บัญชีธนาคาร *</label>
                <input
                  type="text"
                  value={companyForm.bankAccountNumber}
                  onChange={(e) => setCompanyForm({ ...companyForm, bankAccountNumber: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 rounded-lg text-slate-900 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">ชื่อบัญชีธนาคาร *</label>
                <input
                  type="text"
                  value={companyForm.bankAccountName}
                  onChange={(e) => setCompanyForm({ ...companyForm, bankAccountName: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 rounded-lg text-slate-900"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">PromptPay นิติบุคคล (13 หลัก)</label>
                <input
                  type="text"
                  value={companyForm.promptPayId || ''}
                  onChange={(e) => setCompanyForm({ ...companyForm, promptPayId: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 rounded-lg text-slate-900 font-mono"
                />
              </div>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-6">
            <h4 className="text-sm font-bold text-slate-900 mb-3">ผู้มีอำนาจลงนามในใบเสนอราคา</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">ชื่อ-นามสกุล ผู้อนุมัติเอกสาร</label>
                <input
                  type="text"
                  value={companyForm.authorizedSignerName}
                  onChange={(e) => setCompanyForm({ ...companyForm, authorizedSignerName: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 rounded-lg text-slate-900"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">ตำแหน่ง</label>
                <input
                  type="text"
                  value={companyForm.authorizedSignerTitle}
                  onChange={(e) => setCompanyForm({ ...companyForm, authorizedSignerTitle: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 rounded-lg text-slate-900"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-md transition"
            >
              บันทึกการเปลี่ยนแปลงทั้งหมด
            </button>
          </div>
        </form>
      )}

      {/* Tab: LINE OA & Webhook */}
      {activeTab === 'webhook' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="border-b border-slate-200 pb-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Send className="w-5 h-5 text-sky-600" />
              LINE OA & Instant Sales Webhook Integration
            </h3>
            <p className="text-xs text-slate-500">
              แจ้งเตือนทีมฝ่ายขายและแอดมินทันทีผ่าน LINE OA / Telegram / ERP เมื่อลูกค้าออกใบเสนอราคาหรือแจ้งโอนเงิน
            </p>
          </div>

          <div className="space-y-4 text-xs">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
              <div className="font-bold text-slate-800">ตัวอย่าง Payload แจ้งเตือนฝ่ายขาย:</div>
              <pre className="bg-slate-900 text-emerald-400 p-4 rounded-lg font-mono text-[11px] overflow-x-auto">
{`{
  "event": "quotation.generated",
  "quotation_number": "QT-202611-0089",
  "customer_name": "บริษัท ไทยฟู้ดส์ แพ็คเกจจิ้ง แมนูแฟคเจอริ่ง จำกัด",
  "contact_person": "คุณกิตติศักดิ์ พงษ์ศิริ (089-123-4567)",
  "grand_total": 98868.00,
  "items_count": 2,
  "download_pdf_url": "https://siambiz.salesdesk-ai.com/quotations/QT-202611-0089"
}`}
              </pre>
            </div>

            <button
              type="button"
              onClick={handleTestWebhook}
              className="px-5 py-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold shadow transition flex items-center gap-1.5"
            >
              <Send className="w-4 h-4" />
              ทดสอบยิง Webhook จำลอง (Test Trigger)
            </button>

            {webhookMessage && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 font-semibold text-xs">
                {webhookMessage}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add / Edit Product Modal */}
      <ProductFormModal
        isOpen={isAddingProduct}
        onClose={() => {
          setIsAddingProduct(false);
          setEditingProduct(null);
        }}
        onSave={handleSaveProduct}
        initialProduct={editingProduct}
        existingCategories={Array.from(new Set(products.map((p) => p.category)))}
      />
    </div>
  );
}

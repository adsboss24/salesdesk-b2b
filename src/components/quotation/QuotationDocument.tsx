'use client';

import React, { useRef } from 'react';
import { Quotation, SupplierCompanyInfo } from '@/lib/types';
import { thaiBahtText } from '@/lib/mock-data';
import { Printer, Download, Share2, CheckCircle2, ShieldCheck, FileText, ArrowLeft } from 'lucide-react';

interface QuotationDocumentProps {
  quotation: Quotation;
  supplier: SupplierCompanyInfo;
  onStatusChange?: (newStatus: Quotation['status']) => void;
  onBack?: () => void;
}

export function QuotationDocument({ quotation, supplier, onStatusChange, onBack }: QuotationDocumentProps) {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    alert('คัดลอกลิงก์ใบเสนอราคาเรียบร้อยแล้ว ส่งให้ลูกค้าหรือทีมจัดซื้อได้ทันที');
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  const paymentTermLabels: Record<string, string> = {
    cash: 'ชำระเงินสด / โอนก่อนส่งมอบ',
    credit_7: 'เครดิตการค้า 7 วัน',
    credit_15: 'เครดิตการค้า 15 วัน',
    credit_30: 'เครดิตการค้า 30 วัน',
    credit_60: 'เครดิตการค้า 60 วัน',
  };

  return (
    <div className="max-w-5xl mx-auto py-6 px-4 sm:px-6">
      {/* Top Action Bar (Hidden in Print) */}
      <div className="print:hidden flex flex-wrap items-center justify-between gap-4 bg-slate-900 text-white p-4 rounded-xl shadow-lg mb-8">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 hover:bg-slate-800 rounded-lg text-slate-300 hover:text-white transition"
              title="ย้อนกลับ"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Official B2B Document
              </span>
              <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                quotation.status === 'approved' ? 'bg-emerald-500/20 text-emerald-300' :
                quotation.status === 'ordered' ? 'bg-blue-500/20 text-blue-300' :
                'bg-slate-700 text-slate-300'
              }`}>
                สถานะ: {
                  quotation.status === 'approved' ? 'อนุมัติแล้ว' :
                  quotation.status === 'ordered' ? 'เปิดใบสั่งซื้อแล้ว' :
                  quotation.status === 'sent' ? 'รออนุมัติ' : 'ร่างเอกสาร'
                }
              </span>
            </div>
            <h2 className="text-lg font-bold mt-0.5">ใบเสนอราคาเลขที่ {quotation.quotationNumber}</h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {quotation.status !== 'approved' && onStatusChange && (
            <button
              onClick={() => onStatusChange('approved')}
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold rounded-lg shadow transition"
            >
              <CheckCircle2 className="w-4 h-4" />
              อนุมัติใบเสนอราคา (Customer Approve)
            </button>
          )}

          <button
            onClick={handleCopyLink}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium rounded-lg border border-slate-700 transition"
          >
            <Share2 className="w-4 h-4" />
            แชร์ลิงก์
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white text-sm font-semibold rounded-lg shadow-md transition"
          >
            <Printer className="w-4 h-4" />
            พิมพ์ / บันทึก PDF
          </button>
        </div>
      </div>

      {/* The Printable A4 Quotation Sheet */}
      <div 
        ref={printRef}
        className="bg-white text-slate-900 shadow-2xl rounded-xl print:rounded-none print:shadow-none p-8 md:p-12 border border-slate-200 print:border-none print:p-0 mx-auto"
        style={{ minHeight: '297mm' }}
      >
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-6 border-b border-slate-200 pb-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-amber-600 flex items-center justify-center text-white font-extrabold text-xl shadow-sm">
                SD
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-slate-900">{supplier.companyName}</h1>
                <p className="text-xs text-slate-500 font-medium">{supplier.branch}</p>
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed max-w-lg mt-2">
              {supplier.address}
            </p>
            <div className="mt-2 text-xs text-slate-600 space-y-0.5">
              <p><span className="font-semibold text-slate-800">เลขประจำตัวผู้เสียภาษี:</span> {supplier.taxId}</p>
              <p><span className="font-semibold text-slate-800">โทรศัพท์:</span> {supplier.phone} &nbsp;|&nbsp; <span className="font-semibold text-slate-800">อีเมล:</span> {supplier.email}</p>
              <p><span className="font-semibold text-slate-800">เว็บไซต์:</span> {supplier.website}</p>
            </div>
          </div>

          <div className="text-right md:w-72">
            <div className="inline-block bg-slate-900 text-white px-4 py-1.5 rounded text-center">
              <span className="text-sm font-extrabold tracking-widest uppercase">ใบเสนอราคา</span>
              <span className="block text-[10px] tracking-wider text-slate-400 font-medium">OFFICIAL QUOTATION</span>
            </div>

            <div className="mt-4 bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-left space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500">เลขที่เอกสาร:</span>
                <span className="font-bold text-slate-900">{quotation.quotationNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">วันที่ออก:</span>
                <span className="font-medium text-slate-800">{formatDate(quotation.createdAt)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">ยืนราคาถึงวันที่:</span>
                <span className="font-bold text-amber-700">{formatDate(quotation.validUntil)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">เงื่อนไขชำระเงิน:</span>
                <span className="font-medium text-slate-800">
                  {paymentTermLabels[quotation.customer.paymentTerm] || 'โอนชำระเงิน'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Information Section */}
        <div className="mt-6 bg-slate-50/70 border border-slate-200 rounded-lg p-4">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            <FileText className="w-3.5 h-3.5 text-amber-600" />
            ข้อมูลลูกค้า / ผู้สั่งซื้อ (Customer & Invoicing Details)
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <p className="text-sm font-bold text-slate-900">{quotation.customer.companyName}</p>
              <p className="text-slate-600 mt-1">
                <span className="font-semibold text-slate-700">เลขประจำตัวผู้เสียภาษี:</span> {quotation.customer.taxId || '-'}
                <span className="ml-2 text-slate-500">
                  ({quotation.customer.branchType === 'headquarter' ? 'สำนักงานใหญ่' : `สาขา ${quotation.customer.branchNumber || ''}`})
                </span>
              </p>
              <p className="text-slate-600 mt-1 leading-relaxed">
                <span className="font-semibold text-slate-700">ที่อยู่จัดส่งและออกใบกำกับภาษี:</span> {quotation.customer.address} {quotation.customer.postalCode}
              </p>
            </div>

            <div className="space-y-1 md:border-l md:border-slate-200 md:pl-4">
              <p><span className="font-semibold text-slate-700">ผู้ติดต่อ:</span> {quotation.customer.contactPerson}</p>
              {quotation.customer.department && (
                <p><span className="font-semibold text-slate-700">ฝ่าย/แผนก:</span> {quotation.customer.department}</p>
              )}
              <p><span className="font-semibold text-slate-700">เบอร์โทรศัพท์:</span> {quotation.customer.phone}</p>
              <p><span className="font-semibold text-slate-700">อีเมล:</span> {quotation.customer.email}</p>
            </div>
          </div>
        </div>

        {/* Itemized Table */}
        <div className="mt-6 overflow-hidden border border-slate-200 rounded-lg">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-900 text-white font-semibold">
                <th className="py-2.5 px-3 w-12 text-center">ลำดับ</th>
                <th className="py-2.5 px-3 w-28">รหัสสินค้า</th>
                <th className="py-2.5 px-3">รายการสินค้า & สเปก (Description)</th>
                <th className="py-2.5 px-3 w-20 text-right">จำนวน</th>
                <th className="py-2.5 px-3 w-16 text-center">หน่วย</th>
                <th className="py-2.5 px-3 w-24 text-right">ราคา/หน่วย</th>
                <th className="py-2.5 px-3 w-16 text-right">ส่วนลด</th>
                <th className="py-2.5 px-3 w-28 text-right">จำนวนเงิน (THB)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {quotation.items.map((item, index) => (
                <tr key={item.id} className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                  <td className="py-3 px-3 text-center text-slate-500 font-medium">{index + 1}</td>
                  <td className="py-3 px-3 font-mono font-medium text-slate-800">{item.productCode}</td>
                  <td className="py-3 px-3">
                    <p className="font-semibold text-slate-900">{item.productName}</p>
                    {item.variantName && (
                      <p className="text-slate-500 text-[11px] mt-0.5 font-medium">สเปก: {item.variantName}</p>
                    )}
                  </td>
                  <td className="py-3 px-3 text-right font-semibold text-slate-900">{item.quantity.toLocaleString()}</td>
                  <td className="py-3 px-3 text-center text-slate-600">{item.unit}</td>
                  <td className="py-3 px-3 text-right text-slate-800">{item.unitPrice.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  <td className="py-3 px-3 text-right text-emerald-600 font-medium">
                    {item.appliedDiscountPercent ? `${item.appliedDiscountPercent}%` : '-'}
                  </td>
                  <td className="py-3 px-3 text-right font-bold text-slate-900">
                    {item.subtotal.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Calculation & Summary Section */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          {/* Left: Baht Text and Bank Account */}
          <div className="md:col-span-7 space-y-3">
            <div className="bg-amber-50/80 border border-amber-200/80 rounded-lg p-3">
              <span className="text-[11px] font-semibold text-amber-800 block">จำนวนเงินรวมทั้งสิ้น (ตัวอักษร):</span>
              <p className="text-xs font-bold text-amber-950 mt-0.5">{thaiBahtText(quotation.netPayable || quotation.grandTotal)}</p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-slate-800">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                บัญชีสำหรับโอนชำระเงิน (Bank Account Transfer)
              </div>
              <p className="text-slate-700">
                <span className="font-semibold">{supplier.bankName}</span>: {supplier.bankBranch}
              </p>
              <p className="text-slate-700">
                ชื่อบัญชี: <span className="font-semibold">{supplier.bankAccountName}</span>
              </p>
              <p className="text-slate-900 font-mono font-bold text-sm tracking-wider">
                เลขที่บัญชี: {supplier.bankAccountNumber}
              </p>
              {supplier.promptPayId && (
                <p className="text-slate-600 text-[11px]">
                  PromptPay นิติบุคคล (13 หลัก): {supplier.promptPayId}
                </p>
              )}
            </div>

            {/* Terms and notes */}
            <div className="text-[11px] text-slate-500 space-y-1 border-t border-slate-200 pt-2">
              <p className="font-semibold text-slate-700">หมายเหตุและเงื่อนไขการสั่งซื้อ:</p>
              <p>1. {quotation.deliveryTerms || 'การส่งมอบ: Delivered Duty Paid (DDP) หน้าคลังสินค้าผู้ซื้อ'}</p>
              <p>2. สินค้าผลิตตามมาตรฐาน ISO และตรวจสอบคุณภาพก่อนจัดส่งทุกงวด</p>
              <p>3. {quotation.notes || 'กรุณาเซ็นชื่อและประทับตราบริษัทพร้อมส่งกลับทางอีเมลเพื่อยืนยันคำสั่งซื้อ'}</p>
            </div>
          </div>

          {/* Right: Subtotal, VAT, Grand Total */}
          <div className="md:col-span-5 bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-2 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>รวมเป็นเงิน (Subtotal):</span>
              <span className="font-medium text-slate-900">{quotation.subtotal.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} บาท</span>
            </div>

            {quotation.discountTotal > 0 && (
              <div className="flex justify-between text-emerald-600">
                <span>ส่วนลดพิเศษ:</span>
                <span className="font-medium">-{quotation.discountTotal.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} บาท</span>
              </div>
            )}

            <div className="flex justify-between text-slate-600">
              <span>ค่าจัดส่ง (Shipping):</span>
              <span className="font-medium text-slate-900">
                {quotation.shippingFee === 0 ? 'ฟรี (ยอดถึงเกณฑ์จัดส่งฟรี)' : `${quotation.shippingFee.toLocaleString()} บาท`}
              </span>
            </div>

            <div className="flex justify-between text-slate-600 border-t border-slate-200 pt-2">
              <span>ยอดก่อนภาษีมูลค่าเพิ่ม:</span>
              <span className="font-semibold text-slate-900">
                {(quotation.subtotal - quotation.discountTotal + quotation.shippingFee).toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} บาท
              </span>
            </div>

            <div className="flex justify-between text-slate-600">
              <span>ภาษีมูลค่าเพิ่ม (VAT 7%):</span>
              <span className="font-semibold text-slate-900">{quotation.vatAmount.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} บาท</span>
            </div>

            {quotation.withholdingTaxAmount > 0 && (
              <div className="flex justify-between text-amber-700">
                <span>หัก ณ ที่จ่าย ({quotation.withholdingTaxRate * 100}%):</span>
                <span className="font-medium">-{quotation.withholdingTaxAmount.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} บาท</span>
              </div>
            )}

            <div className="flex justify-between items-baseline border-t-2 border-slate-900 pt-2 text-slate-900">
              <span className="text-sm font-bold">ยอดสุทธิรวมภาษี (Grand Total):</span>
              <span className="text-base font-extrabold text-amber-600">
                {quotation.grandTotal.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} บาท
              </span>
            </div>

            {quotation.withholdingTaxAmount > 0 && (
              <div className="flex justify-between items-baseline border-t border-slate-200 pt-1 text-slate-900">
                <span className="text-xs font-semibold">ยอดจ่ายสุทธิหลังหักภาษี:</span>
                <span className="text-sm font-bold text-slate-900">
                  {quotation.netPayable.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} บาท
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Signature Box */}
        <div className="mt-12 pt-6 border-t border-slate-200 grid grid-cols-2 gap-8 text-xs">
          {/* Supplier Signature */}
          <div className="text-center p-4 border border-slate-200 rounded-lg bg-slate-50/50">
            <p className="text-slate-600 mb-10">ในนาม {supplier.companyName}</p>
            <div className="w-48 mx-auto border-b border-dashed border-slate-400 mb-2">
              <span className="font-serif italic text-slate-700 text-sm">{supplier.authorizedSignerName}</span>
            </div>
            <p className="font-bold text-slate-800">{supplier.authorizedSignerName}</p>
            <p className="text-[11px] text-slate-500">{supplier.authorizedSignerTitle}</p>
            <p className="text-[10px] text-slate-400 mt-1">ผู้อนุมัติเอกสาร / ผู้มีอำนาจลงนาม</p>
          </div>

          {/* Customer Signature */}
          <div className="text-center p-4 border border-slate-200 rounded-lg bg-slate-50/50">
            <p className="text-slate-600 mb-10">
              ในนาม {quotation.customer.companyName || 'ผู้สั่งซื้อ / Customer'}
            </p>
            <div className="w-48 mx-auto border-b border-dashed border-slate-400 mb-2 h-5"></div>
            <p className="font-bold text-slate-800">
              (...............................................................)
            </p>
            <p className="text-[11px] text-slate-500">ผู้มีอำนาจลงนาม / ประทับตราสำคัญ</p>
            <p className="text-[10px] text-slate-400 mt-1">วันที่: ...... / ...... / 2026</p>
          </div>
        </div>
      </div>
    </div>
  );
}

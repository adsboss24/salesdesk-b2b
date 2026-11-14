# SalesDesk B2B
### ระบบเซลเพจแคตตาล็อก & ออกใบเสนอราคา B2B อัตโนมัติ (Instant B2B Catalog & Quotation Engine)

> พัฒนาโดย **SalesDesk AI** | มาตรฐานการออกแบบ **Premium Minimal Architecture**

---

## 🎯 พันธกิจของระบบ (Product Mission)
เปลี่ยนกระบวนการขายส่งของโรงงาน ซัพพลายเออร์ และร้านค้าส่งในไทย จากระบบแอดมินตอบแชตนั่งพิมพ์ Excel ข้ามวัน ให้กลายเป็น **"B2B Fast-Commerce & Instant Quotation Engine"** ที่ลูกค้าสามารถกดเลือกสินค้าตามสเปกจริง และรับใบเสนอราคาทางการ (Official Quotation PDF) ได้ทันทีใน 30 วินาที พร้อมระบบแจ้งโอนเงิน 24 ชม.

---

## 🏛️ สถาปัตยกรรมระบบ (System Architecture)

```
[ SALESDESK B2B SAAS PLATFORM ]
  ├── 1. STOREFRONT (หน้าร้านแคตตาล็อกพรีเมียม สไตล์ Minimal)
  │     ├── Multi-Category Tabs & Fast Search (หมวดสินค้า & ตัวเลือกสเปก)
  │     ├── Variant & Tier Pricing (เลือกความหนา/ไซส์/เกรดผ้า ราคาคำนวณอัตโนมัติ)
  │     ├── Floating B2B Cart Summary (แถบสรุปยอดคำสั่งซื้อ)
  │     └── Dual Checkout:
  │           ├── Path A: ออกใบเสนอราคา PDF ทันที (Official Quotation Engine)
  │           └── Path B: ชำระเงินโอนธนาคาร (SCB / PromptPay นิติบุคคล + แนบสลิป)
  │
  ├── 2. ADMIN PORTAL (ระบบจัดการหลังบ้านเจ้าของโรงงาน)
  │     ├── Excel Importer (ลากไฟล์ .xlsx แปลงเป็นแคตตาล็อก B2B ทันที)
  │     ├── Quotation & Order Log (ประวัติใบเสนอราคาและสถานะคำสั่งซื้อ)
  │     ├── Company Profile & Bank Settings (ตั้งค่าข้อมูลบริษัท ภาษี บัญชีธนาคาร)
  │     └── LINE OA Webhook Integration (ยิงแจ้งเตือนฝ่ายขายทันที)
  │
  └── 3. MULTI-TENANCY ENGINE (ระบบรองรับหลายแบรนด์)
        ├── Dynamic Subdomain (เช่น tenant-name.salesdesk-ai.com)
        └── Custom Domain Routing (เช่น order.yourcompany.com)
```

---

## 🚀 เทคโนโลยีหลัก (Tech Stack)
- **Framework**: Next.js 16 (App Router + Turbopack)
- **Styling**: Tailwind CSS (Minimalist Slate & Gold Theme)
- **Database & Auth**: Supabase (PostgreSQL + Row-Level Security)
- **Vector Documents**: HTML5 Canvas / React-to-PDF Engine
- **Hosting & Edge**: Vercel Enterprise Infrastructure

---

## 📂 โครงสร้างโฟลเดอร์ (Directory Structure)
```
salesdesk-b2b/
├── src/
│   ├── app/
│   │   ├── (storefront)/       # หน้าแคตตาล็อกและการออกใบเสนอราคา
│   │   ├── (admin)/            # แดชบอร์ดจัดการสินค้าและเอกสาร
│   │   ├── api/                # API Endpoints (Quotation, Orders, Webhook)
│   ├── components/
│   │   ├── catalog/            # คอมโพเนนต์แสดงรายการสินค้า & สเปก
│   │   ├── quotation/          # ตัวสร้างใบเสนอราคา PDF
│   │   └── ui/                 # ดีไซน์ซิสเต็ม Premium Minimal
│   ├── lib/                    # ฟังก์ชันคำนวณและจัดการข้อมูล
└── public/
    └── templates/              # แม่แบบเอกสารและไอคอน
```

---
*Created for Boss & SalesDesk AI Engineering Team*

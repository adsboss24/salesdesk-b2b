import { B2BProduct, SupplierCompanyInfo, Quotation, Order } from './types';

export const DEFAULT_SUPPLIER: SupplierCompanyInfo = {
  companyName: 'บริษัท สยามบิซ โซลูชั่นส์ แอนด์ อินดัสทรี จำกัด (สำนักงานใหญ่)',
  taxId: '0105562098761',
  branch: 'สำนักงานใหญ่ (Head Office)',
  address: 'เลขที่ 888/45 หมู่ที่ 3 นิคมอุตสาหกรรมบางพลี ถนนเทพารักษ์ ต.บางเสาธง อ.บางเสาธง จ.สมุทรปราการ 10570',
  phone: '02-740-9889, 081-999-8877',
  email: 'sales@siambiz-industry.co.th',
  website: 'www.siambiz-industry.co.th',
  bankName: 'ธนาคารไทยพาณิชย์ (SCB)',
  bankAccountName: 'บจก. สยามบิซ โซลูชั่นส์ แอนด์ อินดัสทรี',
  bankAccountNumber: '142-3-09876-5',
  bankBranch: 'สาขา นิคมอุตสาหกรรมบางพลี',
  promptPayId: '0105562098761', // เลขนิติบุคคล 13 หลัก
  authorizedSignerName: 'นายวรพจน์ กิตติวานิชย์',
  authorizedSignerTitle: 'ผู้อำนวยการฝ่ายพัฒนาธุรกิจและการค้า (Business Director)',
  logoUrl: '',
};

export const INITIAL_PRODUCTS: B2BProduct[] = [
  {
    id: 'prod-1',
    code: 'PKG-BX-5L',
    name: 'กล่องลูกฟูกฝาชน 5 ชั้น เกรดส่งออก (Heavy-Duty Double Wall)',
    category: 'บรรจุภัณฑ์อุตสาหกรรม',
    description: 'ผลิตจากกระดาษคราฟท์นำเข้าคุณภาพสูง ลอน BC แข็งแรงพิเศษ รองรับแรงกดทับซ้อนได้เกิน 800 กก. เหมาะสำหรับโรงงานส่งออก สินค้าอิเล็กทรอนิกส์ และชิ้นส่วนยานยนต์',
    specifications: {
      'โครงสร้างลอน': 'ลอน BC (Double Wall หนา 6.5 มม.)',
      'เกรดกระดาษ': 'KS170/CA125*3/KS170 (Water Resistance)',
      'มาตรฐาน': 'RoHS, FSC Certified, ISO 9001:2015',
      'การรับน้ำหนัก': 'รับน้ำหนักบรรจุได้สูงสุด 45 กก./กล่อง'
    },
    unit: 'ใบ',
    moq: 100,
    basePrice: 42,
    imageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=80',
    badge: 'สินค้ายอดนิยม B2B',
    variants: [
      { id: 'v1-1', name: 'ไซส์ L (40 x 50 x 40 ซม.)', sku: 'PKG-BX-5L-L', pricePerUnit: 42, minQuantity: 100, stockStatus: 'in_stock' },
      { id: 'v1-2', name: 'ไซส์ XL (50 x 60 x 50 ซม.)', sku: 'PKG-BX-5L-XL', pricePerUnit: 58, minQuantity: 100, stockStatus: 'in_stock' },
      { id: 'v1-3', name: 'ไซส์ จัมโบ้ (60 x 80 x 60 ซม.)', sku: 'PKG-BX-5L-JB', pricePerUnit: 89, minQuantity: 50, stockStatus: 'pre_order', leadTimeDays: 5 },
    ],
    tierPricing: [
      { minQty: 100, maxQty: 499, unitPrice: 42, discountPercent: 0 },
      { minQty: 500, maxQty: 999, unitPrice: 38, discountPercent: 9.5 },
      { minQty: 1000, maxQty: 2999, unitPrice: 34, discountPercent: 19 },
      { minQty: 3000, unitPrice: 29.5, discountPercent: 29.8 },
    ],
    inStock: true,
  },
  {
    id: 'prod-2',
    code: 'PLT-ST-17U',
    name: 'ฟิล์มยืดพันพาเลท เกรดเครื่องจักร & มือดึง (Stretch Film 17 Microns)',
    category: 'วัสดุแพ็คเกจจิ้ง & คลังสินค้า',
    description: 'ฟิล์มยืด LLDPE บริสุทธิ์ 100% เหนียว นุ่ม ยืดหยุ่นได้ถึง 350% ไม่ขาดง่ายเวลาดึงมุมพาเลท ป้องกันฝุ่นและความชื้นเกาะสินค้าในการขนส่งทางเรือและตู้คอนเทนเนอร์',
    specifications: {
      'ความหนา': '17 ไมครอน (เต็มไมครอน)',
      'ขนาดหน้ากว้าง': '50 ซม. x ความยาว 300 เมตร/ม้วน',
      'น้ำหนักแกน': 'แกนกระดาษบาง 0.3 กก. (ได้เนื้อฟิล์มเต็ม)',
      'ความยืดตัว (Elongation)': '300% - 350%'
    },
    unit: 'ม้วน',
    moq: 24, // 1 ลังมี 6 ม้วน (สั่งขั้นต่ำ 4 ลัง)
    basePrice: 165,
    imageUrl: 'https://images.unsplash.com/photo-1616401784845-180882ba9ba8?auto=format&fit=crop&w=600&q=80',
    badge: 'ราคาหน้าโรงงาน',
    variants: [
      { id: 'v2-1', name: '17 ไมครอน (มาตรฐานคลังสินค้าทั่วไป)', sku: 'ST-17M-STD', pricePerUnit: 165, minQuantity: 24, stockStatus: 'in_stock' },
      { id: 'v2-2', name: '20 ไมครอน (เกรดเหนียวพิเศษ พันเครื่อง Auto)', sku: 'ST-20M-HEAVY', pricePerUnit: 195, minQuantity: 24, stockStatus: 'in_stock' },
    ],
    tierPricing: [
      { minQty: 24, maxQty: 59, unitPrice: 165, discountPercent: 0 },
      { minQty: 60, maxQty: 239, unitPrice: 148, discountPercent: 10.3 },
      { minQty: 240, maxQty: 599, unitPrice: 135, discountPercent: 18.2 },
      { minQty: 600, unitPrice: 122, discountPercent: 26.0 },
    ],
    inStock: true,
  },
  {
    id: 'prod-3',
    code: 'PLT-HD-1210',
    name: 'พาเลทพลาสติกอุตสาหกรรม Heavy Duty วางแร็ค 4 ทิศทาง (120x100 ซม.)',
    category: 'วัสดุแพ็คเกจจิ้ง & คลังสินค้า',
    description: 'ผลิตจากพลาสติก HDPE เม็ดใหม่ ทนแรงกระแทกสูง ทนอุณหภูมิติดลบห้องเย็นได้ถึง -30°C เสริมแกนเหล็กชุบกัลวาไนซ์ รับน้ำหนักบน Racking ได้ปลอดภัย ไม่แอ่นงอ',
    specifications: {
      'ขนาดมิติ (LxWxH)': '1,200 x 1,000 x 150 มม.',
      'การรับน้ำหนักสถิต (Static)': '4,500 กิโลกรัม',
      'การรับน้ำหนักเคลื่อนที่ (Dynamic)': '1,500 กิโลกรัม',
      'การรับน้ำหนักบนแร็ค (Racking)': '1,000 กิโลกรัม (มีคานเหล็ก)',
      'ชนิดช่องเข้าโฟล์คลิฟท์': '4 ทิศทาง (Forklift & Handlift)'
    },
    unit: 'ตัว',
    moq: 10,
    basePrice: 1450,
    imageUrl: 'https://images.unsplash.com/photo-1587293852726-70cdb56c2866?auto=format&fit=crop&w=600&q=80',
    badge: 'รับประกัน 3 ปี',
    variants: [
      { id: 'v3-1', name: 'หน้าเรียบ มีขอบกั้น (สำหรับสินค้ากล่อง)', sku: 'PLT-FLAT-1210', pricePerUnit: 1450, minQuantity: 10, stockStatus: 'in_stock' },
      { id: 'v3-2', name: 'หน้าตาข่าย ระบายอากาศ (สำหรับห้องเย็น)', sku: 'PLT-MESH-1210', pricePerUnit: 1380, minQuantity: 10, stockStatus: 'in_stock' },
    ],
    tierPricing: [
      { minQty: 10, maxQty: 29, unitPrice: 1450, discountPercent: 0 },
      { minQty: 30, maxQty: 99, unitPrice: 1320, discountPercent: 8.9 },
      { minQty: 100, maxQty: 299, unitPrice: 1210, discountPercent: 16.5 },
      { minQty: 300, unitPrice: 1090, discountPercent: 24.8 },
    ],
    inStock: true,
  },
  {
    id: 'prod-4',
    code: 'CHM-DEG-200',
    name: 'น้ำยาล้างคราบน้ำมันและจาระบีเครื่องจักรอุตสาหกรรม (สูตรน้ำ Bio-Degreaser)',
    category: 'เคมีภัณฑ์โรงงาน & ซ่อมบำรุง',
    description: 'สูตร Water-based ไร้สารระเหยอันตราย ไม่ติดไฟ ไม่กัดกร่อนโลหะ เหล็ก อลูมิเนียม สแตนเลส ย่อยสลายได้ตามธรรมชาติ 100% ผ่านมาตรฐานความปลอดภัยโรงงานสากล',
    specifications: {
      'บรรจุภัณฑ์': 'ถังเหล็ก / ถัง PE 200 ลิตร มาตรฐาน UN',
      'ค่า pH': '9.0 - 10.5 (ปลอดภัยต่อผิวสัมผัสเจือจาง)',
      'การเจือจาง': 'ผสมน้ำได้ 1:5 ถึง 1:20 เท่าตามระดับคราบ',
      'ใบรับรอง': 'MSDS / SDS, NSF Registration, Halal Certified'
    },
    unit: 'ถัง (200L)',
    moq: 2,
    basePrice: 8900,
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80',
    badge: 'Eco-Friendly ปลอดสารพิษ',
    variants: [
      { id: 'v4-1', name: 'ถัง 200 ลิตร (เกรดล้างชิ้นส่วนหนัก)', sku: 'CHM-DEG-200L', pricePerUnit: 8900, minQuantity: 2, stockStatus: 'in_stock' },
      { id: 'v4-2', name: 'แกลลอน 20 ลิตร (แพ็คคู่ 2 ถัง = 40L)', sku: 'CHM-DEG-20Lx2', pricePerUnit: 1950, minQuantity: 5, stockStatus: 'in_stock' },
    ],
    tierPricing: [
      { minQty: 2, maxQty: 4, unitPrice: 8900, discountPercent: 0 },
      { minQty: 5, maxQty: 9, unitPrice: 8200, discountPercent: 7.8 },
      { minQty: 10, unitPrice: 7500, discountPercent: 15.7 },
    ],
    inStock: true,
  },
  {
    id: 'prod-5',
    code: 'BAG-ALU-ZIP',
    name: 'ถุงฟอยล์อลูมิเนียมคอมโพสิต ซิปล็อค ก้นตั้ง (เกรดกันความชื้นและแสง 100%)',
    category: 'บรรจุภัณฑ์อุตสาหกรรม',
    description: 'โครงสร้าง PET/AL/PE หนา 140 ไมครอน ป้องกันการซึมผ่านของออกซิเจน ความชื้น และกลิ่นได้อย่างสมบูรณ์แบบ ใช้บรรจุอาหารเสริม เมล็ดกาแฟ เคมีภัณฑ์แห้ง และยาปฏิชีวนะ',
    specifications: {
      'โครงสร้างฟิล์ม': 'PET12 / AL7 / LLDPE120 (หนา 140 ไมครอน)',
      'อัตราการซึมผ่านไอน้ำ (WVTR)': '< 0.05 g/m²·24h',
      'อัตราการซึมผ่านก๊าซออกซิเจน (OTR)': '< 0.05 cc/m²·24h·atm',
      'การปิดผนึก': 'ซิปล็อคแน่นหนา + สามารถซีลความร้อนซ้ำด้านบน'
    },
    unit: 'แพ็ค (500 ใบ)',
    moq: 5,
    basePrice: 1250,
    imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80',
    badge: 'Food Grade สากล',
    variants: [
      { id: 'v5-1', name: 'ขนาด 18 x 26 + 4 ซม. (จุ 500g)', sku: 'BAG-ALU-500G', pricePerUnit: 1250, minQuantity: 5, stockStatus: 'in_stock' },
      { id: 'v5-2', name: 'ขนาด 22 x 32 + 5 ซม. (จุ 1,000g)', sku: 'BAG-ALU-1KG', pricePerUnit: 1680, minQuantity: 5, stockStatus: 'in_stock' },
    ],
    tierPricing: [
      { minQty: 5, maxQty: 19, unitPrice: 1250, discountPercent: 0 },
      { minQty: 20, maxQty: 49, unitPrice: 1120, discountPercent: 10.4 },
      { minQty: 50, maxQty: 99, unitPrice: 990, discountPercent: 20.8 },
      { minQty: 100, unitPrice: 870, discountPercent: 30.4 },
    ],
    inStock: true,
  },
  {
    id: 'prod-6',
    code: 'STR-PP-1206',
    name: 'สายรัดพลาสติก PP Band สำหรับเครื่องรัดกล่องอัตโนมัติ (High Tensile)',
    category: 'วัสดุแพ็คเกจจิ้ง & คลังสินค้า',
    description: 'ผลิตจากเม็ดพลาสติกโพลีโพรพีลีน (PP) บริสุทธิ์ เกรด A เนื้อเรียบสม่ำเสมอ ไม่ติดขัดในเครื่องรัดกล่องระบบอัตโนมัติ ทนแรงดึงได้สูงถึง 140 กก. สีเหลืองสดใส',
    specifications: {
      'หน้ากว้าง': '12 มิลลิเมตร (หนา 0.60 มม.)',
      'ความยาวต่อม้วน': '3,000 เมตร / ม้วน (แกนกระดาษ 200 มม.)',
      'แรงดึงขาด (Tensile Strength)': '> 140 kgf',
      'การเชื่อมต่อ': 'Heat Sealing & Friction Weld สมบูรณ์แบบ'
    },
    unit: 'ม้วน',
    moq: 10,
    basePrice: 590,
    imageUrl: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=600&q=80',
    badge: 'สำหรับเครื่องจักร Auto',
    variants: [
      { id: 'v6-1', name: 'สีเหลือง (มาตรฐานงานขนส่ง)', sku: 'STR-PP-12-YL', pricePerUnit: 590, minQuantity: 10, stockStatus: 'in_stock' },
      { id: 'v6-2', name: 'สีดำ (เกรดผสมสารกัน UV สำหรับตากแดด)', sku: 'STR-PP-12-BK', pricePerUnit: 640, minQuantity: 10, stockStatus: 'in_stock' },
    ],
    tierPricing: [
      { minQty: 10, maxQty: 29, unitPrice: 590, discountPercent: 0 },
      { minQty: 30, maxQty: 79, unitPrice: 530, discountPercent: 10.1 },
      { minQty: 80, maxQty: 199, unitPrice: 480, discountPercent: 18.6 },
      { minQty: 200, unitPrice: 430, discountPercent: 27.1 },
    ],
    inStock: true,
  }
];

export const SAMPLE_QUOTATIONS: Quotation[] = [
  {
    id: 'qt-001',
    quotationNumber: 'QT-202611-0089',
    createdAt: '2026-11-14T10:30:00.000Z',
    validUntil: '2026-12-14T23:59:59.000Z',
    customer: {
      companyName: 'บริษัท ไทยฟู้ดส์ แพ็คเกจจิ้ง แมนูแฟคเจอริ่ง จำกัด',
      taxId: '0105558012345',
      branchType: 'headquarter',
      contactPerson: 'คุณกิตติศักดิ์ พงษ์ศิริ (ผู้จัดการฝ่ายจัดซื้อ)',
      email: 'kittisak.p@thaifoodspack.com',
      phone: '089-123-4567',
      address: 'เลขที่ 123/45 หมู่ 6 ถนนเพชรเกษม ต.อ้อมน้อย อ.กระทุ่มแบน จ.สมุทรสาคร',
      postalCode: '74130',
      department: 'ฝ่ายจัดซื้อและพัสดุ (Procurement)',
      paymentTerm: 'credit_30'
    },
    items: [
      {
        id: 'item-1',
        productId: 'prod-1',
        productName: 'กล่องลูกฟูกฝาชน 5 ชั้น เกรดส่งออก (Heavy-Duty Double Wall)',
        productCode: 'PKG-BX-5L',
        unit: 'ใบ',
        variantId: 'v1-2',
        variantName: 'ไซส์ XL (50 x 60 x 50 ซม.)',
        quantity: 1200,
        unitPrice: 50.0,
        subtotal: 60000,
        appliedDiscountPercent: 15
      },
      {
        id: 'item-2',
        productId: 'prod-2',
        productName: 'ฟิล์มยืดพันพาเลท เกรดเครื่องจักร & มือดึง (Stretch Film 17 Microns)',
        productCode: 'PLT-ST-17U',
        unit: 'ม้วน',
        variantId: 'v2-1',
        variantName: '17 ไมครอน (มาตรฐานคลังสินค้าทั่วไป)',
        quantity: 240,
        unitPrice: 135,
        subtotal: 32400,
        appliedDiscountPercent: 18.2
      }
    ],
    subtotal: 92400,
    discountTotal: 0,
    shippingFee: 0, // จัดส่งฟรี ยอดเกิน 50,000 บาท
    vatRate: 0.07,
    vatAmount: 6468,
    withholdingTaxRate: 0,
    withholdingTaxAmount: 0,
    grandTotal: 98868,
    netPayable: 98868,
    status: 'sent',
    notes: 'จัดส่งโดยรถกระบะขนส่งของบริษัทฯ ภายใน 3 วันทำการหลังยืนยันใบสั่งซื้อ',
    deliveryTerms: 'เงื่อนไขการส่งมอบ: Delivered Duty Paid (DDP) หน้าคลังสินค้าผู้ซื้อ'
  }
];

export const SAMPLE_ORDERS: Order[] = [
  {
    id: 'so-001',
    orderNumber: 'SO-202611-0021',
    quotationId: 'qt-001',
    quotationNumber: 'QT-202611-0089',
    createdAt: '2026-11-14T14:15:00.000Z',
    customer: {
      companyName: 'บริษัท ไทยฟู้ดส์ แพ็คเกจจิ้ง แมนูแฟคเจอริ่ง จำกัด',
      taxId: '0105558012345',
      branchType: 'headquarter',
      contactPerson: 'คุณกิตติศักดิ์ พงษ์ศิริ',
      email: 'kittisak.p@thaifoodspack.com',
      phone: '089-123-4567',
      address: 'เลขที่ 123/45 หมู่ 6 ถนนเพชรเกษม ต.อ้อมน้อย อ.กระทุ่มแบน จ.สมุทรสาคร',
      postalCode: '74130',
      paymentTerm: 'credit_30'
    },
    items: [
      {
        id: 'item-1',
        productId: 'prod-1',
        productName: 'กล่องลูกฟูกฝาชน 5 ชั้น เกรดส่งออก (Heavy-Duty Double Wall)',
        productCode: 'PKG-BX-5L',
        unit: 'ใบ',
        variantId: 'v1-2',
        variantName: 'ไซส์ XL (50 x 60 x 50 ซม.)',
        quantity: 1200,
        unitPrice: 50.0,
        subtotal: 60000,
      }
    ],
    subtotal: 60000,
    vatAmount: 4200,
    shippingFee: 0,
    grandTotal: 64200,
    paymentMethod: 'bank_transfer',
    paymentStatus: 'confirmed',
    slipUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=400&q=80',
    transferTime: '2026-11-14 14:10:00',
    trackingNumber: 'TH-SD-202611-8891'
  }
];

// Helper to calculate tier price for a given product and quantity
export function calculateTierPrice(product: B2BProduct, quantity: number, basePrice: number): { unitPrice: number; discountPercent: number } {
  if (!product.tierPricing || product.tierPricing.length === 0) {
    return { unitPrice: basePrice, discountPercent: 0 };
  }

  // Sort descending by minQty
  const sortedTiers = [...product.tierPricing].sort((a, b) => b.minQty - a.minQty);
  
  for (const tier of sortedTiers) {
    if (quantity >= tier.minQty) {
      if (tier.maxQty && quantity > tier.maxQty) continue;
      
      const discount = tier.discountPercent || (basePrice > 0 ? Math.round(((basePrice - tier.unitPrice) / basePrice) * 100) : 0);
      return {
        unitPrice: tier.unitPrice,
        discountPercent: discount
      };
    }
  }

  return { unitPrice: basePrice, discountPercent: 0 };
}

// Convert number to Thai Baht Text (BahtText) for official Thai Quotations
export function thaiBahtText(num: number): string {
  if (isNaN(num)) return 'ศูนย์บาทถ้วน';
  if (num === 0) return 'ศูนย์บาทถ้วน';

  const numbers = ['', 'หนึ่ง', 'สอง', 'สาม', 'สี่', 'ห้า', 'หก', 'เจ็ด', 'แปด', 'เก้า'];
  const units = ['', 'สิบ', 'ร้อย', 'พัน', 'หมื่น', 'แสน', 'ล้าน'];

  const split = num.toFixed(2).split('.');
  const integerPart = split[0];
  const decimalPart = split[1];

  let text = '';

  function readGroup(str: string): string {
    let result = '';
    const len = str.length;
    for (let i = 0; i < len; i++) {
      const digit = parseInt(str.charAt(i), 10);
      const pos = len - i - 1;
      if (digit !== 0) {
        if (pos === 0 && digit === 1 && len > 1 && str.charAt(i - 1) !== '0') {
          result += 'เอ็ด';
        } else if (pos === 1 && digit === 2) {
          result += 'ยี่สิบ';
        } else if (pos === 1 && digit === 1) {
          result += 'สิบ';
        } else {
          result += numbers[digit] + units[pos];
        }
      }
    }
    return result;
  }

  // Handle millions
  if (integerPart.length > 6) {
    const millionPart = integerPart.substring(0, integerPart.length - 6);
    const lowerPart = integerPart.substring(integerPart.length - 6);
    text += readGroup(millionPart) + 'ล้าน' + readGroup(lowerPart);
  } else {
    text += readGroup(integerPart);
  }

  text += 'บาท';

  if (decimalPart === '00' || !decimalPart) {
    text += 'ถ้วน';
  } else {
    const satangTen = parseInt(decimalPart.charAt(0), 10);
    const satangOne = parseInt(decimalPart.charAt(1), 10);

    if (satangTen > 0) {
      if (satangTen === 1) text += 'สิบ';
      else if (satangTen === 2) text += 'ยี่สิบ';
      else text += numbers[satangTen] + 'สิบ';
    }

    if (satangOne > 0) {
      if (satangTen > 0 && satangOne === 1) text += 'เอ็ด';
      else text += numbers[satangOne];
    }
    text += 'สตางค์';
  }

  return text;
}

import * as XLSX from 'xlsx';
import { B2BProduct } from './types';

export function exportCatalogTemplate() {
  const templateRows = [
    {
      'รหัสสินค้า (Product Code)*': 'BOX-101',
      'ชื่อสินค้า (Product Name)*': 'กล่องลูกฟูก 3 ชั้น ลอน B ฝาชน',
      'หมวดหมู่ (Category)*': 'บรรจุภัณฑ์อุตสาหกรรม',
      'หน่วยนับ (Unit)*': 'ใบ',
      'จำนวนสั่งขั้นต่ำ (MOQ)*': 100,
      'ราคาฐานต่อหน่วย (THB)*': 25.0,
      'รายละเอียดสินค้า': 'ผลิตจากกระดาษคราฟท์สีน้ำตาลธรรมชาติ ทนทานต่อแรงกระแทก',
      'รูปภาพ URL': 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=80',
      'Tier 1 (จำนวนขั้นต่ำ:ราคา)': '100:25',
      'Tier 2 (จำนวนขั้นต่ำ:ราคา)': '500:22',
      'Tier 3 (จำนวนขั้นต่ำ:ราคา)': '1000:19.5',
      'สเปกสินค้า (Key:Value แยกด้วย ;)': 'ความหนา:3 มม.; รับน้ำหนัก:15 กก.; มาตรฐาน:ISO 9001'
    },
    {
      'รหัสสินค้า (Product Code)*': 'TAPE-OPP-48',
      'ชื่อสินค้า (Product Name)*': 'เทปใส OPP ปิดกล่อง เกรดอุตสาหกรรม หนา 45 ไมครอน',
      'หมวดหมู่ (Category)*': 'วัสดุแพ็คเกจจิ้ง & คลังสินค้า',
      'หน่วยนับ (Unit)*': 'ม้วน',
      'จำนวนสั่งขั้นต่ำ (MOQ)*': 72,
      'ราคาฐานต่อหน่วย (THB)*': 32.0,
      'รายละเอียดสินค้า': 'กาวอะคริลิคเหนียวพิเศษ ติดแน่น ทนต่อสภาพอากาศร้อนชื้น',
      'รูปภาพ URL': 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=600&q=80',
      'Tier 1 (จำนวนขั้นต่ำ:ราคา)': '72:32',
      'Tier 2 (จำนวนขั้นต่ำ:ราคา)': '144:28.5',
      'Tier 3 (จำนวนขั้นต่ำ:ราคา)': '360:25',
      'สเปกสินค้า (Key:Value แยกด้วย ;)': 'หน้ากว้าง:2 นิ้ว (48 มม.); ความยาว:100 หลา; กาว:Acrylic Water Base'
    }
  ];

  const worksheet = XLSX.utils.json_to_sheet(templateRows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'B2B_Catalog_Template');

  XLSX.writeFile(workbook, 'SalesDesk_B2B_Catalog_Template.xlsx');
}

export function parseExcelCatalog(fileData: ArrayBuffer): B2BProduct[] {
  const workbook = XLSX.read(fileData, { type: 'array' });
  const firstSheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[firstSheetName];
  const rawRows: any[] = XLSX.utils.sheet_to_json(worksheet);

  const importedProducts: B2BProduct[] = rawRows.map((row, index) => {
    const code = String(row['รหัสสินค้า (Product Code)*'] || row['Product Code'] || row['Code'] || `PRD-${index + 1}`).trim();
    const name = String(row['ชื่อสินค้า (Product Name)*'] || row['Product Name'] || row['Name'] || 'สินค้า B2B').trim();
    const category = String(row['หมวดหมู่ (Category)*'] || row['Category'] || 'สินค้าทั่วไป').trim();
    const unit = String(row['หน่วยนับ (Unit)*'] || row['Unit'] || 'ชิ้น').trim();
    const moq = parseInt(row['จำนวนสั่งขั้นต่ำ (MOQ)*'] || row['MOQ'] || '1', 10) || 1;
    const basePrice = parseFloat(row['ราคาฐานต่อหน่วย (THB)*'] || row['Base Price'] || row['Price'] || '0') || 0;
    const description = String(row['รายละเอียดสินค้า'] || row['Description'] || '').trim();
    const imageUrl = String(row['รูปภาพ URL'] || row['Image URL'] || 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=80').trim();

    // Parse specifications
    const specsRaw = String(row['สเปกสินค้า (Key:Value แยกด้วย ;)'] || row['Specifications'] || '');
    const specifications: Record<string, string> = {};
    if (specsRaw) {
      specsRaw.split(';').forEach(pair => {
        const [k, v] = pair.split(':');
        if (k && v) specifications[k.trim()] = v.trim();
      });
    }

    // Parse tier pricing
    const tierPricing = [];
    const tier1 = String(row['Tier 1 (จำนวนขั้นต่ำ:ราคา)'] || '');
    const tier2 = String(row['Tier 2 (จำนวนขั้นต่ำ:ราคา)'] || '');
    const tier3 = String(row['Tier 3 (จำนวนขั้นต่ำ:ราคา)'] || '');

    [tier1, tier2, tier3].forEach(tStr => {
      if (tStr && tStr.includes(':')) {
        const [qStr, pStr] = tStr.split(':');
        const minQty = parseInt(qStr, 10);
        const unitPrice = parseFloat(pStr);
        if (!isNaN(minQty) && !isNaN(unitPrice)) {
          tierPricing.push({
            minQty,
            unitPrice,
            discountPercent: basePrice > 0 ? Math.round(((basePrice - unitPrice) / basePrice) * 100) : 0
          });
        }
      }
    });

    if (tierPricing.length === 0) {
      tierPricing.push({ minQty: moq, unitPrice: basePrice, discountPercent: 0 });
    }

    return {
      id: `imported-${Date.now()}-${index}`,
      code,
      name,
      category,
      description,
      specifications,
      unit,
      moq,
      basePrice,
      imageUrl,
      variants: [
        {
          id: `var-std-${index}`,
          name: 'รุ่นมาตรฐานสเปกโรงงาน',
          sku: `${code}-STD`,
          pricePerUnit: basePrice,
          minQuantity: moq,
          stockStatus: 'in_stock'
        }
      ],
      tierPricing,
      inStock: true
    };
  });

  return importedProducts;
}

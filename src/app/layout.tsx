import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'SalesDesk B2B — ระบบเซลเพจแคตตาล็อก & ออกใบเสนอราคา B2B อัตโนมัติ',
  description: 'Instant B2B Fast-Commerce & Official Quotation Engine สำหรับโรงงาน ซัพพลายเออร์ และร้านค้าส่งในไทย ออกใบเสนอราคามาตรฐานใน 30 วินาที',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-amber-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}

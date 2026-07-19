"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { X, Printer, Download, Loader2, FileText } from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────
export interface InvoiceLineItem {
  billing_id: number;
  bill_no: string;
  product_name: string;
  amount: string | number;
  net_weight: string | number;
  carat?: string | number;
  factory_weight?: string | number;
  fig_weight?: string | number;
  category?: string;
  gross_weight?: string | number | null;
  gross_weight_after?: string | number;
  gross_weight_before?: string | number;
  purity?: string | number;
  quantity?: number;
  metalName?: string;
  product_type?: string;
}

export interface InvoiceData {
  bill_no: string;
  bill_date?: string;
  customer?: string;
  customer_gstin?: string;
  customer_address?: string;
  place_of_supply?: string;
  sale_type?: "intra" | "inter" | "export";
  total_amount?: string | number | null;
  gst?: string | number | null;
  sgst?: string | number | null;
  total_amt_with_gst?: string | number | null;
  items: InvoiceLineItem[];
}

interface InvoicePrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: InvoiceData | null;
  loading?: boolean;
}

const COMPANY = {
  name: "L K JEWEL MAKERS",
  address: "P.No. 60, Door No.184/1, NGGO Colony, KN Colony (Po), Salem, Tamilnadu - 636 014.",
  email: "kanagarathinam505@gmail.com",
  gstin: "33AAEFL0554A1Z1",
  cell: "94434-07638",
  bankName: "STATE BANK OF INDIA",
  branch: "AMMAPET, SALEM",
  accountNo: "31264979254",
  ifsc: "SBIN0012772",
  jurisdiction: "Subject to Salem Jurisdiction E. & OE.",
};

const MIN_ROWS = 8;

const numberToWords = (num: number): string => {
  if (num === 0) return "Zero";
  const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten",
    "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
  const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

  const twoDigits = (n: number): string => {
    if (n < 20) return ones[n];
    return `${tens[Math.floor(n / 10)]}${n % 10 ? " " + ones[n % 10] : ""}`;
  };
  const threeDigits = (n: number): string => {
    if (n < 100) return twoDigits(n);
    return `${ones[Math.floor(n / 100)]} Hundred${n % 100 ? " " + twoDigits(n % 100) : ""}`;
  };

  let n = Math.floor(num);
  const crore = Math.floor(n / 10000000); n %= 10000000;
  const lakh = Math.floor(n / 100000); n %= 100000;
  const thousand = Math.floor(n / 1000); n %= 1000;
  const hundred = n;

  const parts: string[] = [];
  if (crore) parts.push(`${threeDigits(crore)} Crore`);
  if (lakh) parts.push(`${threeDigits(lakh)} Lakh`);
  if (thousand) parts.push(`${threeDigits(thousand)} Thousand`);
  if (hundred) parts.push(threeDigits(hundred));

  return parts.join(" ") || "Zero";
};

const num = (v: unknown): number => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

const round2 = (n: number) => Math.round((n + Number.EPSILON) * 100) / 100;

const InvoicePrintModal = ({ isOpen, onClose, invoice, loading = false }: InvoicePrintModalProps) => {
  const invoiceRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);
  const [visible, setVisible] = useState(false);

  // mount animation
  useEffect(() => {
    if (isOpen) {
      const t = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(t);
    }
    setVisible(false);
  }, [isOpen]);

  // escape to close
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) onClose();
    },
    [onClose]
  );

  if (!isOpen) return null;

const handleDownloadPdf = async () => {
  if (!invoiceRef.current || !invoice) return;
  setDownloading(true);
  try {
    const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
      import("html2canvas-pro"),
      import("jspdf"),
    ]);

    const canvas = await html2canvas(invoiceRef.current, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
    });

    const imgData = canvas.toDataURL("image/jpeg", 0.98);

    const pdf = new jsPDF({
      unit: "mm",
      format: "a4",
      orientation: "portrait",
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const imgWidth = pageWidth - 10; // 5mm margin each side
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 5; // top margin

    pdf.addImage(imgData, "JPEG", 5, position, imgWidth, imgHeight);
    heightLeft -= pageHeight - 10;

    // paginate if the invoice overflows one A4 page
    while (heightLeft > 0) {
      position = heightLeft - imgHeight + 5;
      pdf.addPage();
      pdf.addImage(imgData, "JPEG", 5, position, imgWidth, imgHeight);
      heightLeft -= pageHeight - 10;
    }

    pdf.save(`${invoice.bill_no || "invoice"}.pdf`);
  } catch (err) {
    console.error("Failed to generate PDF:", err);
  } finally {
    setDownloading(false);
  }
};

  const items = invoice?.items ?? [];
  const isIntraState = (invoice?.sale_type ?? "intra") === "intra";
  const isInterState = invoice?.sale_type === "inter";
  const isExport = invoice?.sale_type === "export";

  const taxableValue =
    invoice?.total_amount !== undefined && invoice?.total_amount !== null
      ? round2(num(invoice.total_amount))
      : round2(items.reduce((sum, it) => sum + num(it.amount), 0));

  const cgstAmount = isIntraState ? round2(num(invoice?.gst)) : 0;
  const sgstAmount = isIntraState ? round2(num(invoice?.sgst)) : 0;
  const igstAmount = isInterState ? round2(num(invoice?.gst) + num(invoice?.sgst)) : 0;

  const finalTotal =
    invoice?.total_amt_with_gst !== undefined && invoice?.total_amt_with_gst !== null
      ? num(invoice.total_amt_with_gst)
      : taxableValue + cgstAmount + sgstAmount + igstAmount;
  const roundedTotal = Math.round(finalTotal);
  const roundOff = round2(roundedTotal - finalTotal);

  const blankRowCount = Math.max(0, MIN_ROWS - items.length);
  const formattedDate = invoice?.bill_date ?? "";

  return (
    <div
      onClick={handleBackdropClick}
      className={`fixed inset-0 z-[1000] flex items-center justify-center p-3 sm:p-6 no-print-overlay
        bg-black/50 backdrop-blur-sm transition-opacity duration-200
        ${visible ? "opacity-100" : "opacity-0"}`}
    >
      {/* Screen-only controls */}
      <div className="no-print fixed top-5 right-5 flex items-center gap-2 z-[1001]">
        <button
          type="button"
          title="Download as PDF"
          onClick={handleDownloadPdf}
          disabled={loading || !invoice || downloading}
          className="flex items-center gap-2 bg-white/95 backdrop-blur border border-gray-200 text-gray-700 font-medium text-[13px] px-4 py-2.5 rounded-full shadow-lg hover:bg-gray-50 hover:shadow-xl active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150"
        >
          {downloading ? <Loader2 size={15} className="animate-spin" /> : <Download size={15} />}
          {downloading ? "Preparing…" : "Download"}
        </button>
        <button
          type="button"
          title="Print invoice"
          onClick={() => window.print()}
          disabled={loading || !invoice}
          className="flex items-center gap-2 bg-gradient-to-r from-fuchsia-600 via-purple-600 to-indigo-600 text-white font-medium text-[13px] px-4 py-2.5 rounded-full shadow-lg hover:shadow-xl hover:opacity-95 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150"
        >
          <Printer size={15} /> Print
        </button>
        <button
          type="button"
          title="Close"
          onClick={onClose}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-white/95 backdrop-blur text-gray-500 hover:bg-gray-100 hover:text-gray-800 shadow-lg active:scale-95 transition-all duration-150"
        >
          <X size={17} />
        </button>
      </div>

      {/* Print area */}
      <div
        onClick={(e) => e.stopPropagation()}
        className={`invoice-print-area bg-white w-full max-w-[820px] max-h-[90vh] overflow-y-auto
          shadow-2xl rounded-2xl sm:rounded-2xl ring-1 ring-black/5
          transition-all duration-200 ${visible ? "translate-y-0 scale-100 opacity-100" : "translate-y-3 scale-[0.98] opacity-0"}`}
      >
        {loading || !invoice ? (
          <div className="min-h-[420px] flex flex-col items-center justify-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
              <FileText size={20} className="text-gray-400" />
            </div>
            <Loader2 size={18} className="animate-spin text-gray-300" />
            <p className="text-sm text-gray-400">Loading bill…</p>
          </div>
        ) : (
          <div ref={invoiceRef} className="p-4 sm:p-6 text-black text-[12px] leading-tight font-serif border-2 border-black m-2">
            {/* ── Letterhead ── */}
            <div className="text-center border-b-2 border-black pb-2 mb-1">
             <div className="text-[10px]">
                 <p >௨</p>
              <p >══</p>
             </div>
              <h1 className="text-[22px] font-bold tracking-wide -mt-1">{COMPANY.name}</h1>
              <p className="text-[11px]">{COMPANY.address}</p>
              <div className="flex items-center justify-between text-[11px] mt-1">
                <span>e-mail: {COMPANY.email}</span>
                <span className="font-semibold">GSTIN : {COMPANY.gstin}</span>
                <span>Cell: {COMPANY.cell}</span>
              </div>
            </div>

            {/* ── Sale type / Invoice meta ── */}
            <div className="grid grid-cols-[1fr_1.4fr_1fr] border border-black">
              <div className="border-r border-black">
                <div className="flex items-center justify-between px-2 py-1 border-b border-black">
                  <span>Intra State Sale</span>
                  <span className="w-3 h-3 border border-black inline-block">{isIntraState ? "✓" : ""}</span>
                </div>
                <div className="flex items-center justify-between px-2 py-1 border-b border-black">
                  <span>Inter State Sale</span>
                  <span className="w-3 h-3 border border-black inline-block">{isInterState ? "✓" : ""}</span>
                </div>
                <div className="flex items-center justify-between px-2 py-1">
                  <span>Export Sale</span>
                  <span className="w-3 h-3 border border-black inline-block">{isExport ? "✓" : ""}</span>
                </div>
              </div>
              <div className="flex items-center justify-center border-r border-black">
                <span className="font-bold text-[15px]">TAX INVOICE</span>
              </div>
              <div>
                <div className="flex items-center justify-between px-2 py-1 border-b border-black">
                  <span>Invoice No</span>
                  <span className="font-semibold">{invoice.bill_no}</span>
                </div>
                <div className="flex items-center justify-between px-2 py-1 border-b border-black">
                  <span>Date</span>
                  <span className="font-semibold">{formattedDate}</span>
                </div>
                <div className="flex items-center justify-between px-2 py-1">
                  <span>Place of Supply</span>
                  <span className="font-semibold">{invoice.place_of_supply ?? ""}</span>
                </div>
              </div>
            </div>

            {/* ── Billing / delivery address ── */}
            <div className="grid grid-cols-2 border border-t-0 border-black">
              <div className="border-r border-black p-2 min-h-[54px]">
                <p className="font-semibold">Billing Address</p>
                <p className="mt-1">{invoice.customer ?? ""}</p>
                <p>{invoice.customer_address ?? ""}</p>
              </div>
              <div className="p-2 min-h-[54px]">
                <p className="font-semibold">Delivery (Consignee) Address (or) Place of Delivery</p>
              </div>
            </div>
            <div className="grid grid-cols-2 border border-t-0 border-black">
              <div className="border-r border-black px-2 py-1">
                <span>GSTIN : {invoice.customer_gstin ?? ""}</span>
              </div>
              <div className="px-2 py-1">
                <span>GSTIN :</span>
              </div>
            </div>

            {/* ── Products table ── */}
            <table className="w-full border border-t-0 border-black border-collapse">
              <thead>
                <tr className="border-b border-black">
                  <th className="border-r border-black px-1 py-1 w-[6%]">Sl No</th>
                  <th className="border-r border-black px-1 py-1 text-left w-[38%]">Description of Goods / Services</th>
                  <th className="border-r border-black px-1 py-1 w-[12%]">HSN / SAC</th>
                  <th className="border-r border-black px-1 py-1 w-[14%]">Gms</th>
                  <th className="border-r border-black px-1 py-1 w-[14%]">Rate</th>
                  <th className="px-1 py-1 w-[16%]">Amount</th>
                </tr>
              </thead>
              <tbody>
                {items.map((it, idx) => {
                  const amount = num(it.amount);
                  const grams = num(it.net_weight);
                  const rate = grams ? round2(amount / grams) : amount;
                  return (
                    <tr key={it.billing_id ?? idx} className="border-b border-black/30">
                      <td className="border-r border-black text-center py-1">{idx + 1}</td>
                      <td className="border-r border-black px-1 py-1">
                        {it.product_name}
                        {it.metalName ? ` (${it.metalName})` : ""}
                      </td>
                      <td className="border-r border-black text-center py-1">{it.category || ""}</td>
                      <td className="border-r border-black text-center py-1">{grams ? grams.toFixed(2) : ""}</td>
                      <td className="border-r border-black text-center py-1">{amount ? rate.toFixed(2) : ""}</td>
                      <td className="text-center py-1">{amount ? amount.toFixed(2) : ""}</td>
                    </tr>
                  );
                })}
                {Array.from({ length: blankRowCount }).map((_, i) => (
                  <tr key={`blank-${i}`} className="border-b border-black/30">
                    <td className="border-r border-black py-2">&nbsp;</td>
                    <td className="border-r border-black">&nbsp;</td>
                    <td className="border-r border-black">&nbsp;</td>
                    <td className="border-r border-black">&nbsp;</td>
                    <td className="border-r border-black">&nbsp;</td>
                    <td>&nbsp;</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* ── Taxable value / GST / total ── */}
            <div className="grid grid-cols-[1fr_1fr] border border-t-0 border-black">
              <div className="border-r border-black flex items-center px-2 py-1 font-semibold">
                Taxable Value
              </div>
              <div className="flex items-center justify-end px-2 py-1 font-semibold">
                {taxableValue.toFixed(2)}
              </div>
            </div>

            <div className="grid grid-cols-[1fr_1fr] border border-t-0 border-black">
              <div className="border-r border-black p-2">
                <p className="font-semibold">Rupees:</p>
                <p className="mt-1">{numberToWords(roundedTotal)} Rupees Only</p>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center justify-between px-2 py-1 border-b border-black">
                  <span>CGST</span>
                  <span>{isIntraState ? cgstAmount.toFixed(2) : ""}</span>
                </div>
                <div className="flex items-center justify-between px-2 py-1 border-b border-black">
                  <span>SGST</span>
                  <span>{isIntraState ? sgstAmount.toFixed(2) : ""}</span>
                </div>
                {/* <div className="flex items-center justify-between px-2 py-1 border-b border-black">
                  <span>IGST</span>
                  <span>{isInterState ? igstAmount.toFixed(2) : ""}</span>
                </div>
                <div className="flex items-center justify-between px-2 py-1 border-b border-black">
                  <span>Round off</span>
                  <span>{roundOff.toFixed(2)}</span>
                </div> */}
                <div className="flex items-center justify-between px-2 py-1 font-bold">
                  <span>TOTAL</span>
                  <span>{roundedTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* ── Footer / bank details ── */}
            <div className="grid grid-cols-[1.4fr_1fr_1fr] border border-t-0 border-black">
              <div className="border-r border-black p-2">
                <p><span className="font-semibold">Bank</span> : {COMPANY.bankName}</p>
                <p><span className="font-semibold">Branch</span> : {COMPANY.branch}</p>
                <p><span className="font-semibold">A/C No.</span> : {COMPANY.accountNo}</p>
                <p><span className="font-semibold">IFSC CODE</span> : {COMPANY.ifsc}</p>
              </div>
              <div className="border-r border-black p-2 flex items-end">
                <p className="text-[10px]">{COMPANY.jurisdiction}</p>
              </div>
              <div className="p-2 flex flex-col items-center justify-between">
                <p className="font-semibold">For {COMPANY.name}</p>
                <p className="text-[10px] mt-8">Authorised Signatory</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
     @media print {
  body * {
    visibility: hidden;
  }
  .invoice-print-area,
  .invoice-print-area * {
    visibility: visible;
  }
  .invoice-print-area {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    max-height: none !important;
    overflow: visible !important;
    box-shadow: none !important;
    border-radius: 0 !important;
  }

  /* Key fix: collapse the fixed/flex backdrop so it can't
     repeat the invoice once per printed page in Chrome */
  .no-print-overlay {
    position: static !important;
    display: block !important;
    height: auto !important;
    width: auto !important;
    padding: 0 !important;
    margin: 0 !important;
    background: transparent !important;
    backdrop-filter: none !important;
  }

  .no-print {
    display: none !important;
  }

  @page {
    size: A4;
    margin: 10mm;
  }
}
      `}</style>
    </div>
  );
};

export default InvoicePrintModal;
"use client";

import { X, Package, Gem } from "lucide-react";

export interface ProductDetail {
  product_name: string;
  amount: number;
  netweight: number;
  carat: string | number;
  factory_weight: number;
  fig_weight?: number;
  gross_weight?: number | null;
  gross_weight_after?: number;
  gross_weight_before?: number;
  purity: string | number;
  quantity: number;
  metalName: string;
}

interface ProductDetailsModalProps {
  open: boolean;
  onClose: () => void;
  billRef: string;
  partyLabel: string;
  date: string;
  totalAmount: number;
  products: ProductDetail[];
}

const CARD_THEMES = [
  { header: "from-violet-500 to-purple-600", chip: "bg-violet-50 text-violet-700 border border-violet-100" },
  { header: "from-blue-500 to-indigo-600",   chip: "bg-blue-50 text-blue-700 border border-blue-100" },
  { header: "from-emerald-500 to-teal-600",  chip: "bg-emerald-50 text-emerald-700 border border-emerald-100" },
  { header: "from-amber-500 to-orange-500",  chip: "bg-amber-50 text-amber-700 border border-amber-100" },
  { header: "from-rose-500 to-pink-600",     chip: "bg-rose-50 text-rose-700 border border-rose-100" },
  { header: "from-cyan-500 to-blue-500",     chip: "bg-cyan-50 text-cyan-700 border border-cyan-100" },
  { header: "from-fuchsia-500 to-purple-500",chip: "bg-fuchsia-50 text-fuchsia-700 border border-fuchsia-100" },
];

function formatCash(value?: number) {
  return `₹${Number(value ?? 0).toLocaleString("en-IN")}`;
}

function formatWeight(value?: number | null) {
  return `${Number(value ?? 0).toFixed(3)} g`;
}

function StatChip({ label, value, chip }: { label: string; value: string | number; chip: string }) {
  return (
    <div className={`rounded-xl px-3 py-2 ${chip}`}>
      <p className="text-[9px] font-bold uppercase tracking-wider opacity-60 mb-0.5">{label}</p>
      <p className="text-xs font-bold tabular-nums">{value}</p>
    </div>
  );
}

export default function ProductDetailsModal({
  open,
  onClose,
  billRef,
  partyLabel,
  date,
  totalAmount,
  products,
}: ProductDetailsModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6"
      style={{
        background: "rgba(15, 12, 40, 0.55)",
        backdropFilter: "blur(4px)",
        WebkitBackdropFilter: "blur(4px)",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Modal shell — fixed max height, flex column so scroll only inside body */}
      <div
        className="w-full max-w-2xl bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col"
        style={{ maxHeight: "min(90vh, 800px)" }}
      >
        {/* ── Header ── fixed, never scrolls */}
        <div
          className="px-5 sm:px-6 py-5 flex items-start justify-between gap-3 flex-shrink-0"
          style={{ background: "linear-gradient(120deg, #ffe4d6 0%, #ffd9ec 45%, #e6ddff 100%)" }}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-fuchsia-500 to-violet-600 flex items-center justify-center shadow-sm flex-shrink-0">
              <Package className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0">
              <h3 className="text-base font-bold text-gray-800 truncate">{partyLabel || "—"}</h3>
              <p className="text-xs text-gray-500 mt-0.5 truncate">
                {billRef} · {date}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="w-8 h-8 rounded-full bg-white/70 hover:bg-white flex items-center justify-center text-gray-500 hover:text-gray-700 transition-colors flex-shrink-0 shadow-sm"
          >
            <X size={16} />
          </button>
        </div>

        {/* ── Summary strip ── fixed */}
        <div className="px-5 sm:px-6 py-3 border-b border-gray-100 flex items-center justify-between bg-violet-50/40 flex-shrink-0">
          <span className="text-xs font-bold text-violet-600 uppercase tracking-wide">
            {products.length} product{products.length === 1 ? "" : "s"}
          </span>
          <span className="text-sm font-bold text-gray-800">{formatCash(totalAmount)}</span>
        </div>

        {/* ── Scrollable product grid ── this is the ONLY part that scrolls */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-5 sm:p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {products.map((p, idx) => {
              const theme = CARD_THEMES[idx % CARD_THEMES.length];
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-gray-100 overflow-hidden shadow-sm"
                >
                  {/* Card header */}
                  <div
                    className={`bg-gradient-to-r ${theme.header} px-4 py-3 flex items-center justify-between gap-2`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <Gem className="w-3.5 h-3.5 text-white/90 flex-shrink-0" />
                      <p className="text-sm font-bold text-white truncate capitalize">
                        {p.product_name || "—"}
                      </p>
                    </div>
                    <span className="text-[10px] font-bold text-white bg-white/25 px-2 py-0.5 rounded-full flex-shrink-0 whitespace-nowrap">
                      {p.metalName}
                    </span>
                  </div>

                  {/* Card body */}
                  <div className="p-4 flex flex-col gap-3">
                    {/* Amount row */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">Amount</span>
                      <span className="text-base font-bold text-gray-900 tabular-nums">
                        {formatCash(p.amount)}
                      </span>
                    </div>

                    {/* Stats grid */}
                    <div className="grid grid-cols-2 gap-2">
                      <StatChip label="Qty"        value={p.quantity}                                    chip={theme.chip} />
                      <StatChip label="Purity"     value={`${p.purity}%`}                               chip={theme.chip} />
                      <StatChip label="Carat"      value={p.carat}                                       chip={theme.chip} />
                      <StatChip label="Net Wt"     value={formatWeight(p.netweight)}                     chip={theme.chip} />
                      <StatChip label="Factory Wt" value={formatWeight(p.factory_weight)}                chip={theme.chip} />
                      <StatChip label="Gross Wt"   value={formatWeight(p.gross_weight_after ?? p.gross_weight ?? 0)} chip={theme.chip} />
                    </div>
                  </div>
                </div>
              );
            })}

            {products.length === 0 && (
              <div className="col-span-full py-10 text-center text-sm text-gray-400">
                No product details available for this record.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
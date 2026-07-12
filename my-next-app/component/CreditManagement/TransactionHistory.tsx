"use client";

import { useState } from "react";
import { Search, Clock, AlertCircle, ChevronLeft, ChevronRight, ClipboardList, Inbox } from "lucide-react";

export interface Transaction {
  id: number | string;
  date: string;
  partyName: string;
  type: string;
  goldQty: string;
  amount: string;
  notes: string;
  recordedAt: string;
}

interface TransactionHistoryProps {
  transactions: Transaction[];
  loading: boolean;
  error: string | null;

  // Search (server-side)
  search: string;
  onSearchChange: (value: string) => void;

  // Pagination
  total: number;
  limit: number;
  offset: number;
  onPageChange: (newOffset: number) => void;
}

function SkeletonRow() {
  return (
    <tr className="border-b border-gray-50">
      {Array.from({ length: 7 }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-4 bg-gray-100 rounded animate-pulse" style={{ width: `${60 + (i % 3) * 20}%` }} />
        </td>
      ))}
    </tr>
  );
}

export default function TransactionHistory({
  transactions,
  loading,
  error,
  search,
  onSearchChange,
  total,
  limit,
  offset,
  onPageChange,
}: TransactionHistoryProps) {
  const [hoveredId, setHoveredId] = useState<number | string | null>(null);

  // Search is now handled server-side (see parent), so render rows as-is
  const filtered = transactions;

  const currentPage = Math.floor(offset / limit) + 1;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const startItem = total === 0 ? 0 : offset + 1;
  const endItem = Math.min(offset + limit, total);

  const goToPage = (page: number) => {
    const clamped = Math.min(Math.max(page, 1), totalPages);
    onPageChange((clamped - 1) * limit);
  };

  // Build a compact page-number list e.g. 1 ... 4 5 [6] 7 8 ... 12
  const getPageNumbers = () => {
    const pages: (number | "...")[] = [];
    const delta = 1;

    const left = Math.max(2, currentPage - delta);
    const right = Math.min(totalPages - 1, currentPage + delta);

    pages.push(1);
    if (left > 2) pages.push("...");
    for (let i = left; i <= right; i++) pages.push(i);
    if (right < totalPages - 1) pages.push("...");
    if (totalPages > 1) pages.push(totalPages);

    return pages;
  };

  return (
    <div className="border border-violet-100/70 rounded-2xl overflow-hidden bg-white shadow-sm">
      {/* Header */}
      <div
        className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-5 py-4"
        style={{ background: "linear-gradient(120deg, #ffe4d6 0%, #ffd9ec 45%, #e6ddff 100%)" }}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-fuchsia-500 to-violet-600 flex items-center justify-center shadow-sm flex-shrink-0">
            <ClipboardList size={15} className="text-white" />
          </div>
          <h2 className="text-base font-semibold text-gray-800">Transaction History</h2>
        </div>
        <div className="relative w-full sm:w-52">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-violet-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 border border-violet-100 rounded-full text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-violet-300 focus:ring-2 focus:ring-violet-50 bg-white shadow-sm transition-all"
          />
        </div>
      </div>

      {/* ── Desktop / Tablet table (md and above) ── */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-violet-50/40">
              <th className="text-left px-5 py-3 text-xs font-bold text-violet-600 uppercase tracking-wide">Date</th>
              <th className="text-left px-4 py-3 text-xs font-bold text-violet-600 uppercase tracking-wide">Party Name</th>
              <th className="text-left px-4 py-3 text-xs font-bold text-violet-600 uppercase tracking-wide">Type</th>
              <th className="text-left px-4 py-3 text-xs font-bold text-violet-600 uppercase tracking-wide">Gold Qty</th>
              <th className="text-left px-4 py-3 text-xs font-bold text-violet-600 uppercase tracking-wide">Amount</th>
              <th className="text-left px-4 py-3 text-xs font-bold text-violet-600 uppercase tracking-wide">Notes</th>
              <th className="text-left px-4 py-3 text-xs font-bold text-violet-600 uppercase tracking-wide">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  Recorded At
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <>
                <SkeletonRow />
                <SkeletonRow />
                <SkeletonRow />
                <SkeletonRow />
              </>
            )}

            {!loading && error && (
              <tr>
                <td colSpan={7} className="py-20 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <AlertCircle className="w-6 h-6 text-red-400" />
                    <p className="text-sm text-red-400">{error}</p>
                  </div>
                </td>
              </tr>
            )}

            {!loading && !error && filtered.length > 0 &&
              filtered.map((t) => (
                <tr
                  key={t.id}
                  onMouseEnter={() => setHoveredId(t.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  className="border-b border-gray-50 transition-colors duration-150"
                  style={{
                    backgroundColor:
                      hoveredId === t.id ? "rgba(124,58,237,0.06)" : "transparent",
                  }}
                >
                  <td className="px-5 py-3 text-gray-600">{t.date}</td>
                  <td className="px-4 py-3 text-gray-800 font-medium">{t.partyName}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                        t.type === "Factory"
                          ? "bg-violet-50 text-violet-600"
                          : "bg-red-50 text-red-500"
                      }`}
                    >
                      {t.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{t.goldQty}</td>
                  <td className="px-4 py-3 text-gray-600">{t.amount}</td>
                  <td className="px-4 py-3 text-gray-400 italic text-xs">{t.notes || "—"}</td>
                  <td className="px-4 py-3 text-gray-500">{t.recordedAt}</td>
                </tr>
              ))
            }

            {!loading && !error && filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="py-20 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-violet-50 to-fuchsia-50 flex items-center justify-center">
                      <div className="absolute top-2 left-3 w-2 h-2 rounded-full bg-violet-200" />
                      <div className="absolute bottom-3 right-2 w-1.5 h-1.5 rounded-full bg-fuchsia-200" />
                      <Inbox className="w-8 h-8 text-violet-300" />
                    </div>
                    <p className="text-sm font-bold text-gray-700 mt-1">No items added to this bill yet</p>
                    <p className="text-xs text-gray-400">Transactions will appear here once added</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ── Mobile card list (below md) ── */}
      <div className="block md:hidden divide-y divide-gray-50">
        {loading && (
          <div className="flex flex-col gap-3 p-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-gray-50 rounded-xl p-4 flex flex-col gap-2 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-2/3" />
                <div className="h-3 bg-gray-100 rounded w-1/2" />
                <div className="h-3 bg-gray-100 rounded w-1/3" />
              </div>
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="py-12 text-center flex flex-col items-center gap-2">
            <AlertCircle className="w-6 h-6 text-red-400" />
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="py-16 text-center flex flex-col items-center gap-3">
            <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-violet-50 to-fuchsia-50 flex items-center justify-center">
              <div className="absolute top-2 left-3 w-2 h-2 rounded-full bg-violet-200" />
              <div className="absolute bottom-3 right-2 w-1.5 h-1.5 rounded-full bg-fuchsia-200" />
              <Inbox className="w-7 h-7 text-violet-300" />
            </div>
            <p className="text-sm font-bold text-gray-700">No items added to this bill yet</p>
            <p className="text-xs text-gray-400">Transactions will appear here once added</p>
          </div>
        )}

        {!loading && !error && filtered.map((t) => (
          <div
            key={t.id}
            className="p-4 transition-colors duration-150 active:bg-violet-50/40"
            style={{ backgroundColor: "transparent" }}
            onTouchStart={(e) => (e.currentTarget.style.backgroundColor = "rgba(124,58,237,0.06)")}
            onTouchEnd={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
          >
            {/* Row 1 — party + type badge */}
            <div className="flex items-center justify-between mb-1.5">
              <p className="text-sm font-semibold text-gray-800">{t.partyName}</p>
              <span
                className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                  t.type === "Factory"
                    ? "bg-violet-50 text-violet-600"
                    : "bg-red-50 text-red-500"
                }`}
              >
                {t.type}
              </span>
            </div>
            {/* Row 2 — amount + gold */}
            <div className="flex items-center gap-3 mb-1">
              <p className="text-sm font-medium text-gray-700">{t.amount}</p>
              <span className="text-gray-300">·</span>
              <p className="text-sm text-gray-500">{t.goldQty}</p>
            </div>
            {/* Row 3 — date + recorded at */}
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <span>{t.date}</span>
              <span className="text-gray-200">|</span>
              <Clock className="w-3 h-3" />
              <span>{t.recordedAt}</span>
            </div>
            {/* Row 4 — notes */}
            {t.notes && (
              <p className="text-xs text-gray-400 italic mt-1">{t.notes}</p>
            )}
          </div>
        ))}
      </div>

      {/* ── Pagination footer ── */}
      {!loading && !error && total > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-5 py-3.5 border-t border-gray-50">
          <p className="text-xs text-gray-400">
            Showing <span className="font-medium text-gray-600">{startItem}</span>–
            <span className="font-medium text-gray-600">{endItem}</span> of{" "}
            <span className="font-medium text-gray-600">{total}</span>
          </p>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="w-7 h-7 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-50 hover:text-gray-600 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {getPageNumbers().map((p, i) =>
              p === "..." ? (
                <span key={`ellipsis-${i}`} className="w-7 h-7 flex items-center justify-center text-xs text-gray-300">
                  …
                </span>
              ) : (
                <button
                  key={p}
                  type="button"
                  onClick={() => goToPage(p)}
                  className={`w-7 h-7 flex items-center justify-center rounded-full text-xs font-medium transition-colors ${
                    p === currentPage
                      ? "bg-violet-600 text-white"
                      : "text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  {p}
                </button>
              )
            )}

            <button
              type="button"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="w-7 h-7 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-50 hover:text-gray-600 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
              aria-label="Next page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
"use client";

import { useState } from "react";
import { Search, Clock, ClipboardX, AlertCircle } from "lucide-react";

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

export default function TransactionHistory({ transactions, loading, error }: TransactionHistoryProps) {
  const [search, setSearch] = useState("");
  const [hoveredId, setHoveredId] = useState<number | string | null>(null);

  const filtered = transactions.filter(
    (t) =>
      t.partyName.toLowerCase().includes(search.toLowerCase()) ||
      t.type.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="border border-gray-100 rounded-2xl overflow-hidden bg-white">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-5 py-4 bg-red-50/50">
        <h2 className="text-base font-semibold text-gray-800">Transaction History</h2>
        <div className="relative w-full sm:w-52">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 border border-gray-200 rounded-full text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-gray-300 bg-white"
          />
        </div>
      </div>

      {/* ── Desktop / Tablet table (md and above) ── */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-red-50/30">
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Date</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Party Name</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Type</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Gold Qty</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Amount</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Notes</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
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
                      hoveredId === t.id ? "rgba(99,102,241,0.06)" : "transparent",
                  }}
                >
                  <td className="px-5 py-3 text-gray-600">{t.date}</td>
                  <td className="px-4 py-3 text-gray-800 font-medium">{t.partyName}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                        t.type === "Credit Given"
                          ? "bg-indigo-50 text-indigo-600"
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
                <td colSpan={7} className="py-24 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center">
                      <ClipboardX className="w-5 h-5 text-gray-300" />
                    </div>
                    <p className="text-sm text-gray-400">No items added to this bill yet</p>
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
            <div className="w-12 h-12 rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center">
              <ClipboardX className="w-5 h-5 text-gray-300" />
            </div>
            <p className="text-sm text-gray-400">No items added to this bill yet</p>
          </div>
        )}

        {!loading && !error && filtered.map((t) => (
          <div
            key={t.id}
            className="p-4 transition-colors duration-150 active:bg-indigo-50/40"
            style={{ backgroundColor: "transparent" }}
            onTouchStart={(e) => (e.currentTarget.style.backgroundColor = "rgba(99,102,241,0.06)")}
            onTouchEnd={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
          >
            {/* Row 1 — party + type badge */}
            <div className="flex items-center justify-between mb-1.5">
              <p className="text-sm font-semibold text-gray-800">{t.partyName}</p>
              <span
                className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                  t.type === "Credit Given"
                    ? "bg-indigo-50 text-indigo-600"
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
    </div>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { StickyNote, ChevronRight, Clock } from "lucide-react";

export interface RecentTransaction {
  id: number | string;
  billNo: string;
  billDate: string;
  partyName: string;
  amount: string;
}

interface RecentTransactionsProps {
  transactions: RecentTransaction[];
  loading: boolean;
}

const AVATAR_COLORS = [
  "bg-violet-100 text-violet-700",
  "bg-emerald-100 text-emerald-700",
  "bg-rose-100 text-rose-700",
  "bg-blue-100 text-blue-700",
  "bg-amber-100 text-amber-700",
];

export default function RecentTransactions({ transactions, loading }: RecentTransactionsProps) {
  const router = useRouter();

  return (
    <div className="border border-violet-100/70 rounded-2xl overflow-hidden h-full flex flex-col bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 px-5 py-4 bg-gradient-to-r from-rose-50 via-violet-50/60 to-white border-b border-gray-50">
        <h2 className="text-sm sm:text-base font-bold text-gray-800">Recent Transactions</h2>
        <button
          onClick={() => router.push("/sales")}
          className="flex items-center gap-0.5 text-sm font-semibold text-violet-600 hover:text-violet-700 transition-colors"
        >
          View All
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 flex flex-col min-h-[220px]">
        {loading && (
          <div className="flex flex-col gap-3 p-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between gap-3 animate-pulse">
                <div className="h-3.5 w-28 bg-violet-50 rounded" />
                <div className="h-3.5 w-16 bg-violet-50 rounded" />
              </div>
            ))}
          </div>
        )}

        {!loading && transactions.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-violet-50 flex items-center justify-center">
              <StickyNote className="w-5 h-5 text-violet-300" />
            </div>
            <p className="text-sm text-gray-400">No sales recorded yet</p>
          </div>
        )}

        {!loading && transactions.length > 0 && (
          <div className="divide-y divide-gray-50">
            {transactions.map((t, idx) => {
              const initials = t.partyName
                .split(" ")
                .map((w: string) => w[0])
                .slice(0, 2)
                .join("")
                .toUpperCase();
              const avatarColor = AVATAR_COLORS[idx % AVATAR_COLORS.length];

              return (
                <div
                  key={t.id}
                  className="flex items-center justify-between gap-3 px-5 py-3.5 hover:bg-violet-50/30 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${avatarColor}`}>
                      {initials || "—"}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-800 truncate">{t.partyName}</p>
                      <p className="text-xs text-gray-400">
                        {t.billNo} · {t.billDate}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm font-bold text-gray-800 shrink-0">{t.amount}</p>
                </div>
              );
            })}
          </div>
        )}

        {!loading && transactions.length > 0 && (
          <div className="flex items-center gap-1.5 px-5 py-3 border-t border-gray-50 text-xs text-gray-400">
            <Clock className="w-3.5 h-3.5 text-violet-400" />
            Showing latest {transactions.length} transaction{transactions.length === 1 ? "" : "s"}
          </div>
        )}
      </div>
    </div>
  );
}

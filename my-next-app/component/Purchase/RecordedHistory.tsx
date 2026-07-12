"use client";

import { Search, ChevronLeft, ChevronRight, History } from "lucide-react";

const columns = [
  "Bill ID",
  "Date",
  "Customer",
  "Net Weight",
  "Grand Total",
  "Payment",
  "Recorded At",
];

interface BillingRecord {
  bill_no: string;
  payment: string;
  customer: string;
  bill_date: string;
  total_amount: number;
  total_net_weight: number;
}

interface RecordedHistoryProps {
  data: BillingRecord[];
  loading: boolean;
  search: string;
  setSearch: (val: string) => void;
  page: number;
  setPage: (val: number) => void;
  limit: number;
  total: number;
}

const RecordedHistory = ({
  data,
  loading,
  search,
  setSearch,
  page,
  setPage,
  limit,
  total,
}: RecordedHistoryProps) => {
  const totalPages = Math.max(1, Math.ceil(total / limit));

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100">
      {/* Header */}
      <div
        className="px-5 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
        style={{ background: "linear-gradient(120deg, #ffe4d6 0%, #ffd9ec 45%, #e6ddff 100%)" }}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-fuchsia-500 to-violet-600 flex items-center justify-center shadow-sm flex-shrink-0">
            <History size={15} className="text-white" />
          </div>
          <h3 className="text-[15px] font-bold text-gray-800">
            Recorded History
          </h3>
        </div>

        <div className="flex items-center gap-2 bg-white border border-violet-100 rounded-full px-4 py-2 w-full sm:w-auto sm:min-w-[220px] shadow-sm">
          <Search size={14} className="text-violet-400 flex-shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search"
            className="flex-1 outline-none text-[13px] text-gray-600 placeholder:text-gray-300 bg-transparent min-w-0"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <div
          className="grid px-5 sm:px-6 py-3 border-b border-gray-100 min-w-[640px] bg-violet-50/40"
          style={{ gridTemplateColumns: "repeat(7, 1fr)" }}
        >
          {columns.map((col) => (
            <span key={col} className="text-[12px] font-bold text-violet-600 whitespace-nowrap pr-2 uppercase tracking-wide">
              {col}
            </span>
          ))}
        </div>

        {loading ? (
          <div className="min-h-[160px] sm:min-h-[180px] flex items-center justify-center min-w-[640px]">
            <p className="text-sm text-gray-300">Loading...</p>
          </div>
        ) : data?.length ? (
          data.map((row, idx) => (
            <div
              key={row.bill_no}
              className={`grid px-5 sm:px-6 py-3 border-b border-gray-50 min-w-[640px] items-center hover:bg-violet-50/30 transition-colors ${idx % 2 === 0 ? "" : "bg-gray-50/30"}`}
              style={{ gridTemplateColumns: "repeat(7, 1fr)" }}
            >
              <span className="text-[13px] font-semibold text-gray-800 pr-2">{row.bill_no}</span>
              <span className="text-[13px] text-gray-500 pr-2">{formatDate(row.bill_date)}</span>
              <span className="text-[13px] text-gray-700 pr-2">{row.customer}</span>
              <span className="text-[13px] text-amber-600 font-semibold pr-2">{row.total_net_weight}</span>
              <span className="text-[13px] text-emerald-600 font-bold pr-2">{row.total_amount}</span>
              <span className="text-[13px] text-gray-700 pr-2">{row.payment}</span>
              <span className="text-[13px] text-gray-400 pr-2">{formatDate(row.bill_date)}</span>
            </div>
          ))
        ) : (
          <div className="min-h-[160px] sm:min-h-[180px] flex items-center justify-center min-w-[640px]">
            <p className="text-sm text-gray-300">No records found</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {!loading && total > 0 && (
        <div className="flex items-center justify-between px-5 sm:px-6 py-3 border-t border-gray-100">
          <span className="text-[12px] text-gray-400">
            Page {page} of {totalPages} · {total} records
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page <= 1}
              className="w-7 h-7 flex items-center justify-center rounded-full border border-violet-200 text-violet-500 hover:bg-violet-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={14} />
            </button>
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page >= totalPages}
              className="w-7 h-7 flex items-center justify-center rounded-full border border-violet-200 text-violet-500 hover:bg-violet-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecordedHistory;

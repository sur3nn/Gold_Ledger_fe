"use client";

import { useEffect, useState } from "react";
import { Search, ChevronLeft, ChevronRight, History, Printer, Loader2 } from "lucide-react";

const baseColumns = [
  "Bill ID",
  "Date",
  "Customer",
  "Net Weight",
  "Grand Total",
  "Payment",
  "Recorded At",
];

// Box weight columns are always shown.
const boxWeightColumns = ["Box Wt. Before", "Box Wt. After"];

// GST-related columns are shown only when sessionStorage "isgst" is true.
const gstOnlyColumns = ["GST", "SGST", "Total (Incl. GST)"];

const printColumn = ["Print"];

interface BillingRecord {
  // Primary key of the billing record — this is what getBillDetailsAction
  // expects as its `billId` payload. Adjust the field name here if your
  // API returns it under a different key (e.g. billing_id).
  id: number;
  bill_no: string;
  payment: string;
  customer: string;
  bill_date: string;
  total_amount: number;
  total_net_weight: number;
  box_weight_before?: number | null;
  box_weight_after?: number | null;
  gst?: number | null;
  sgst?: number | null;
  total_amt_with_gst?: number | null;
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
  // Called with the bill's id when the print icon is clicked — the parent
  // fetches the bill's line items (via getBillDetailsAction({ billId })) and
  // opens the invoice print view.
  onPrint: (billId: number) => void;
  // id of the bill currently being fetched for printing (shows a spinner on that row).
  printingBillId?: number | null;
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
  onPrint,
  printingBillId = null,
}: RecordedHistoryProps) => {
  const totalPages = Math.max(1, Math.ceil(total / limit));

  // ── Whether GST-related columns should render — driven by
  // sessionStorage key "isgst" ("true" / "false"). Read once on mount. ────
  const [showGst, setShowGst] = useState(false);
  useEffect(() => {
    if (typeof window !== "undefined") {
      setShowGst(sessionStorage.getItem("isgst") === "true");
    }
  }, []);

  const columns = [
    ...baseColumns,
    ...boxWeightColumns,
    ...(showGst ? gstOnlyColumns : []),
    ...printColumn,
  ];

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

  const formatAmount = (v?: number | null) =>
    v === null || v === undefined ? "—" : `₹${Number(v).toLocaleString("en-IN")}`;

  const formatWeight = (v?: number | null) =>
    v === null || v === undefined ? "—" : `${Number(v)}g`;

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
          className="grid px-5 sm:px-6 py-3 border-b border-gray-100 bg-violet-50/40"
          style={{ gridTemplateColumns: `repeat(${columns.length}, minmax(90px, 1fr))`, minWidth: Math.max(640, columns.length * 120) }}
        >
          {columns.map((col) => (
            <span key={col} className="text-[12px] font-bold text-violet-600 whitespace-nowrap pr-2 uppercase tracking-wide">
              {col}
            </span>
          ))}
        </div>

        {loading ? (
          <div className="min-h-[160px] sm:min-h-[180px] flex items-center justify-center" style={{ minWidth: Math.max(640, columns.length * 120) }}>
            <p className="text-sm text-gray-300">Loading...</p>
          </div>
        ) : data?.length ? (
          data.map((row, idx) => (
            <div
              key={row.bill_no}
              className={`grid px-5 sm:px-6 py-3 border-b border-gray-50 items-center hover:bg-violet-50/30 transition-colors ${idx % 2 === 0 ? "" : "bg-gray-50/30"}`}
              style={{ gridTemplateColumns: `repeat(${columns.length}, minmax(90px, 1fr))`, minWidth: Math.max(640, columns.length * 120) }}
            >
              <span className="text-[13px] font-semibold text-gray-800 pr-2">{row.bill_no}</span>
              <span className="text-[13px] text-gray-500 pr-2">{formatDate(row.bill_date)}</span>
              <span className="text-[13px] text-gray-700 pr-2">{row.customer}</span>
              <span className="text-[13px] text-amber-600 font-semibold pr-2">{row.total_net_weight}</span>
              <span className="text-[13px] text-emerald-600 font-bold pr-2">{row.total_amount}</span>
              <span className="text-[13px] text-gray-700 pr-2">{row.payment}</span>
              <span className="text-[13px] text-gray-400 pr-2">{formatDate(row.bill_date)}</span>

              <span className="text-[13px] text-cyan-600 font-medium pr-2">{formatWeight(row.box_weight_before)}</span>
              <span className="text-[13px] text-cyan-600 font-medium pr-2">{formatWeight(row.box_weight_after)}</span>

              {showGst && (
                <>
                  <span className="text-[13px] text-gray-600 font-medium pr-2">{formatAmount(row.gst)}</span>
                  <span className="text-[13px] text-gray-600 font-medium pr-2">{formatAmount(row.sgst)}</span>
                  <span className="text-[13px] text-rose-500 font-bold pr-2">{formatAmount(row.total_amt_with_gst)}</span>
                </>
              )}

              <span className="pr-2">
                <button
                  type="button"
                  onClick={() => onPrint(row.id)}
                  disabled={printingBillId === row.id}
                  title="Print bill"
                  className="w-8 h-8 flex items-center justify-center rounded-xl border border-violet-200 text-violet-500 hover:bg-violet-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {printingBillId === row.id ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Printer size={14} />
                  )}
                </button>
              </span>
            </div>
          ))
        ) : (
          <div className="min-h-[160px] sm:min-h-[180px] flex items-center justify-center" style={{ minWidth: Math.max(640, columns.length * 120) }}>
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
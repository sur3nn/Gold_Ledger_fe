"use client";

import { Download, PackageOpen, Eye } from "lucide-react";
import { useState } from "react";
import { EmptyState, ErrorState, SkeletonRow, HEADER_COLORS } from "./shared";
import ProductDetailsModal from "./ProductDetailsModal";
import Pagination from "./Pagination";
import { usePagination } from "./usePagination";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getPurchaseReport } from "@/Redux/Action/action";

interface PurchaseReportTabProps {
  fromDate: string;
  toDate: string;
}

function formatCash(value: number) {
  return `₹${Number(value ?? 0).toLocaleString("en-IN")}`;
}

export default function PurchaseReportTab({ fromDate, toDate }: PurchaseReportTabProps) {
  const dispatch = useDispatch();
  const { purchaseReportData, purchaseReportLoad, purchaseReportError } = useSelector(
    (state: any) => state.purchase
  );

  const { page, setPage, limit, offset } = usePagination([fromDate, toDate]);

  useEffect(() => {
    dispatch(getPurchaseReport({ fromDate, toDate, limit, offset }) as any);
  }, [dispatch, fromDate, toDate, limit, offset]);

  const records = purchaseReportData?.records ?? [];
  const totalPurchaseAmount = purchaseReportData?.totalPurchaseAmount ?? 0;
  const totalRecords = purchaseReportData?.total ?? purchaseReportData?.totalCount;

  const [selectedRow, setSelectedRow] = useState<any | null>(null);

  const COLS = ["Date", "Factory", "Weight", "Rate", "Total", "Ref", "Product Details"];

  return (
    <div className="border border-violet-100/70 rounded-2xl overflow-hidden bg-white shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between px-4 sm:px-6 py-4 gap-3 bg-gradient-to-r from-blue-50/70 via-violet-50/40 to-white border-b border-gray-50">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center shadow-sm">
            <PackageOpen className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-gray-800">Purchase Report</h2>
            <p className="text-[10px] text-gray-400">
              {fromDate && toDate ? `${fromDate} to ${toDate}` : "Gold procurement records"}
            </p>
          </div>
        </div>
        <button className="flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-all w-full sm:w-auto shadow-sm shadow-purple-200">
          <Download className="w-3.5 h-3.5" />
          Export CSV
        </button>
      </div>

      {/* Stat Banner */}
      <div className="px-4 sm:px-6 py-4 border-b border-gray-50">
        <p className="text-[10px] font-bold text-blue-500 uppercase tracking-[0.15em] mb-1">
          Total Purchase Amount
        </p>
        {purchaseReportLoad ? (
          <div className="h-9 w-28 bg-violet-50 rounded-lg animate-pulse" />
        ) : (
          <p className="text-2xl sm:text-3xl font-bold text-violet-700 tracking-tight">
            {formatCash(totalPurchaseAmount)}
          </p>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs sm:text-sm min-w-[680px]">
          <thead>
            <tr className="border-b border-gray-50 bg-violet-50/30">
              {COLS.map((h, i) => (
                <th
                  key={h}
                  className={`text-left px-4 sm:px-5 py-3 text-[10px] font-bold uppercase tracking-[0.12em] ${HEADER_COLORS[i % HEADER_COLORS.length]}`}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {purchaseReportLoad && Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} cols={7} />)}
            {!purchaseReportLoad && purchaseReportError && <ErrorState message={purchaseReportError} colSpan={7} />}
            {!purchaseReportLoad && !purchaseReportError && records.length === 0 && (
              <EmptyState colSpan={7} label="Purchase records will appear here once transactions are created." />
            )}
            {!purchaseReportLoad && !purchaseReportError && records.map((r: any, idx: number) => (
              <tr key={r.id} className={`border-b border-gray-50 hover:bg-violet-50/30 transition-colors ${idx % 2 === 0 ? "" : "bg-gray-50/20"}`}>
                <td className="px-4 sm:px-5 py-3.5 text-gray-400 font-medium tabular-nums">{r.date}</td>
                <td className="px-4 sm:px-5 py-3.5 text-gray-800 font-semibold">{r.factorySource}</td>
                <td className="px-4 sm:px-5 py-3.5 text-gray-600 tabular-nums">{Number(r.weight).toFixed(3)} g</td>
                <td className="px-4 sm:px-5 py-3.5 text-gray-500 tabular-nums">
                  {r.rate ? `₹${Number(r.rate).toLocaleString("en-IN")}/g` : "—"}
                </td>
                <td className="px-4 sm:px-5 py-3.5 text-violet-700 font-bold tabular-nums">{formatCash(r.total)}</td>
                <td className="px-4 sm:px-5 py-3.5 text-gray-400 font-mono text-[10px] sm:text-xs">{r.historyLog}</td>
                <td className="px-4 sm:px-5 py-3.5">
                  <button
                    onClick={() => setSelectedRow(r)}
                    disabled={!r.products?.length}
                    className="flex items-center gap-1.5 text-[11px] font-semibold text-fuchsia-600 bg-fuchsia-50 hover:bg-fuchsia-100 disabled:opacity-40 disabled:cursor-not-allowed px-2.5 py-1.5 rounded-lg transition-colors"
                  >
                    <Eye size={12} />
                    View{r.products?.length ? ` (${r.products.length})` : ""}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {!purchaseReportLoad && !purchaseReportError && (
        <Pagination
          page={page}
          limit={limit}
          total={totalRecords}
          recordsOnPage={records.length}
          onPageChange={setPage}
          accent="blue"
        />
      )}

      <ProductDetailsModal
        open={!!selectedRow}
        onClose={() => setSelectedRow(null)}
        billRef={selectedRow?.historyLog ?? ""}
        partyLabel={selectedRow?.factorySource ?? ""}
        date={selectedRow?.date ?? ""}
        totalAmount={selectedRow?.total ?? 0}
        products={selectedRow?.products ?? []}
      />
    </div>
  );
}
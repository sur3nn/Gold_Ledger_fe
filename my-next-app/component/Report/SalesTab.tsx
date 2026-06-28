"use client";

import { Download, TrendingUp } from "lucide-react";
import { EmptyState, ErrorState, SkeletonRow } from "./shared";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSalesReport } from "@/Redux/Action/action";

export interface SaleRecord {
  id: number | string;
  date: string;
  customer: string;
  weight: string;
  amount: string;
  payment: string;
  historyLog: string;
}

export interface SalesData {
  totalSalesAmount: string;
  records: SaleRecord[];
}

const PAYMENT_COLORS: Record<string, string> = {
  Cash: "bg-green-50 text-green-600 border border-green-100",
  UPI: "bg-blue-50 text-blue-600 border border-blue-100",
  "Bank Transfer": "bg-purple-50 text-purple-600 border border-purple-100",
};

export default function SalesTab() {
  const mockSalesData = {
    totalSalesAmount: "₹2,38,500",
    records: [
      { id: 1, date: "01-06-2026", customer: "ABC Jewellers", weight: "10.500 g", amount: "₹52,500", payment: "Cash", historyLog: "Sale #S-1001" },
      { id: 2, date: "04-06-2026", customer: "XYZ Retail", weight: "8.250 g", amount: "₹41,250", payment: "UPI", historyLog: "Sale #S-1002" },
      { id: 3, date: "08-06-2026", customer: "ABC Jewellers", weight: "14.000 g", amount: "₹70,000", payment: "Bank Transfer", historyLog: "Sale #S-1003" },
      { id: 4, date: "13-06-2026", customer: "Prestige Ornaments", weight: "6.750 g", amount: "₹33,750", payment: "Cash", historyLog: "Sale #S-1004" },
      { id: 5, date: "20-06-2026", customer: "XYZ Retail", weight: "8.200 g", amount: "₹41,000", payment: "UPI", historyLog: "Sale #S-1005" },
    ],
  };

  const dispatch = useDispatch();
  const { salesReportData, salesReportLoad } = useSelector((state: any) => state.purchase);
  useEffect(() => { dispatch(getSalesReport()); }, [dispatch]);

  const records = mockSalesData.records ?? [];

  return (
    <div className="border border-gray-100 rounded-2xl overflow-hidden bg-white">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between px-4 sm:px-6 py-4 gap-3 bg-gradient-to-r from-green-50/60 to-white border-b border-gray-50">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-green-600" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-gray-800">Sales Register</h2>
            <p className="text-[10px] text-gray-400">Current period transactions</p>
          </div>
        </div>
        <button className="flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors w-full sm:w-auto">
          <Download className="w-3.5 h-3.5" />
          Export CSV
        </button>
      </div>

      {/* Stat Banner */}
      <div className="px-4 sm:px-6 py-4 border-b border-gray-50 flex flex-col sm:flex-row sm:items-end gap-1">
        <div>
          <p className="text-[10px] font-semibold text-green-600 uppercase tracking-[0.15em] mb-1">
            Total Sales Amount
          </p>
          {salesReportLoad ? (
            <div className="h-9 w-28 bg-gray-100 rounded-lg animate-pulse" />
          ) : (
            <p className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
              {salesReportData?.totalSalesAmount ?? "₹2,38,500"}
            </p>
          )}
        </div>
        <span className="sm:ml-3 mb-1 text-[10px] font-semibold text-green-500 bg-green-50 px-2 py-0.5 rounded-full border border-green-100 w-fit">
          ↑ 12.4% vs last period
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs sm:text-sm min-w-[560px]">
          <thead>
            <tr className="border-b border-gray-50 bg-gray-50/40">
              {["Date", "Customer", "Weight", "Amount", "Payment", "Ref"].map((h) => (
                <th key={h} className="text-left px-4 sm:px-5 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-[0.12em]">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {salesReportLoad && Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} cols={6} />)}
            {!salesReportLoad && records.length === 0 && <EmptyState />}
            {!salesReportLoad && records.map((r: any, idx: number) => (
              <tr key={r.id} className={`border-b border-gray-50 hover:bg-amber-50/30 transition-colors ${idx % 2 === 0 ? "" : "bg-gray-50/20"}`}>
                <td className="px-4 sm:px-5 py-3.5 text-gray-400 font-medium tabular-nums">{r.date}</td>
                <td className="px-4 sm:px-5 py-3.5 text-gray-800 font-semibold">{r.customer}</td>
                <td className="px-4 sm:px-5 py-3.5 text-gray-600 tabular-nums">{r.weight}</td>
                <td className="px-4 sm:px-5 py-3.5 text-gray-900 font-bold tabular-nums">{r.amount}</td>
                <td className="px-4 sm:px-5 py-3.5">
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${PAYMENT_COLORS[r.payment] ?? "bg-gray-100 text-gray-500"}`}>
                    {r.payment}
                  </span>
                </td>
                <td className="px-4 sm:px-5 py-3.5 text-gray-400 font-mono text-[10px] sm:text-xs">{r.historyLog}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

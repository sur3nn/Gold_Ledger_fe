"use client";

import { Download, PackageOpen } from "lucide-react";
import { EmptyState, ErrorState, SkeletonRow } from "./shared";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getSalesReport } from "@/Redux/Action/action";

export interface PurchaseRecord {
  id: number | string;
  date: string;
  factorySource: string;
  weight: string;
  rate: string;
  total: string;
  historyLog: string;
}

export interface PurchaseData {
  totalPurchaseAmount: string;
  records: PurchaseRecord[];
}

export default function PurchaseTab() {
  const mockPurchaseData = {
    totalPurchaseAmount: "₹3,15,000",
    records: [
      { id: 1, date: "02-06-2026", factorySource: "Primary Gold Factory", weight: "30.000 g", rate: "₹5,000/g", total: "₹1,50,000", historyLog: "PO #P-2001" },
      { id: 2, date: "06-06-2026", factorySource: "Modern Casting Unit", weight: "20.000 g", rate: "₹4,800/g", total: "₹96,000", historyLog: "PO #P-2002" },
      { id: 3, date: "11-06-2026", factorySource: "Royal Gold Works", weight: "5.000 g", rate: "₹5,200/g", total: "₹26,000", historyLog: "PO #P-2003" },
      { id: 4, date: "17-06-2026", factorySource: "Prestige Ornaments", weight: "7.500 g", rate: "₹5,100/g", total: "₹38,250", historyLog: "PO #P-2004" },
      { id: 5, date: "23-06-2026", factorySource: "Primary Gold Factory", weight: "1.000 g", rate: "₹4,750/g", total: "₹4,750", historyLog: "PO #P-2005" },
    ],
  };

  const dispatch = useDispatch();
  const { salesReportData, salesReportLoad } = useSelector((state: any) => state.purchase);
  useEffect(() => { dispatch(getSalesReport()); }, [dispatch]);

  const records = mockPurchaseData?.records ?? [];

  return (
    <div className="border border-gray-100 rounded-2xl overflow-hidden bg-white">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between px-4 sm:px-6 py-4 gap-3 bg-gradient-to-r from-indigo-50/60 to-white border-b border-gray-50">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
            <PackageOpen className="w-4 h-4 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-gray-800">Purchase Register</h2>
            <p className="text-[10px] text-gray-400">Gold procurement records</p>
          </div>
        </div>
        <button className="flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors w-full sm:w-auto">
          <Download className="w-3.5 h-3.5" />
          Export CSV
        </button>
      </div>

      {/* Stat Banner */}
      <div className="px-4 sm:px-6 py-4 border-b border-gray-50">
        <p className="text-[10px] font-semibold text-indigo-500 uppercase tracking-[0.15em] mb-1">
          Total Purchase Amount
        </p>
        {salesReportLoad ? (
          <div className="h-9 w-28 bg-gray-100 rounded-lg animate-pulse" />
        ) : (
          <p className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
            {salesReportData?.totalPurchaseAmount ?? "₹3,15,000"}
          </p>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs sm:text-sm min-w-[580px]">
          <thead>
            <tr className="border-b border-gray-50 bg-gray-50/40">
              {["Date", "Factory Source", "Weight", "Rate", "Total", "Ref"].map((h) => (
                <th key={h} className="text-left px-4 sm:px-5 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-[0.12em]">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {salesReportLoad && Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} cols={6} />)}
            {!salesReportLoad && records.map((r: any, idx: number) => (
              <tr key={r.id} className={`border-b border-gray-50 hover:bg-indigo-50/20 transition-colors ${idx % 2 === 0 ? "" : "bg-gray-50/20"}`}>
                <td className="px-4 sm:px-5 py-3.5 text-gray-400 font-medium tabular-nums">{r.date}</td>
                <td className="px-4 sm:px-5 py-3.5 text-gray-800 font-semibold">{r.factorySource}</td>
                <td className="px-4 sm:px-5 py-3.5 text-gray-600 tabular-nums">{r.weight}</td>
                <td className="px-4 sm:px-5 py-3.5 text-gray-500 tabular-nums">{r.rate}</td>
                <td className="px-4 sm:px-5 py-3.5 text-gray-900 font-bold tabular-nums">{r.total}</td>
                <td className="px-4 sm:px-5 py-3.5 text-gray-400 font-mono text-[10px] sm:text-xs">{r.historyLog}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

"use client";

import { getSalesReport } from "@/Redux/Action/action";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Wallet, Building2 } from "lucide-react";

export interface OutstandingShopOwner {
  id: number | string;
  name: string;
  cashBalance: string;
  metalBalance: string;
  lastUpdated: string;
}

export interface OutstandingFactory {
  id: number | string;
  factoryName: string;
  cashBalance: string;
  metalBalance: string;
  lastUpdated: string;
}

function SkeletonRow({ cols }: { cols: number }) {
  return (
    <tr className="border-b border-gray-50">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-3.5">
          <div className="h-3 bg-gray-100 rounded-full animate-pulse" style={{ width: `${50 + (i % 3) * 18}%` }} />
        </td>
      ))}
    </tr>
  );
}

function BalanceChip({ value, type }: { value: string; type: "cash" | "metal" }) {
  const isZero = value.includes("₹0") || value.includes("0.000");
  if (isZero) {
    return <span className="text-gray-300 font-semibold tabular-nums">{value}</span>;
  }
  if (type === "cash") {
    return <span className="text-red-500 font-bold tabular-nums">{value}</span>;
  }
  return <span className="text-amber-500 font-bold tabular-nums">{value}</span>;
}

export default function OutstandingTab() {
  const mockOutstandingData = {
    shopOwners: [
      { id: 1, name: "ABC Jewellers", cashBalance: "₹50,000", metalBalance: "25.000 g", lastUpdated: "17/03/2026" },
      { id: 2, name: "XYZ Retail", cashBalance: "₹0", metalBalance: "0.000 g", lastUpdated: "17/03/2026" },
    ],
    factories: [
      { id: 1, factoryName: "Primary Gold Factory", cashBalance: "₹1,00,000", metalBalance: "150.000g", lastUpdated: "17/03/2026" },
      { id: 2, factoryName: "Modern Casting Unit", cashBalance: "₹24,995", metalBalance: "49.989g", lastUpdated: "17/03/2026" },
      { id: 3, factoryName: "Prestige Ornaments", cashBalance: "₹0", metalBalance: "0.000g", lastUpdated: "17/03/2026" },
      { id: 4, factoryName: "Royal Gold Works", cashBalance: "₹0", metalBalance: "0.000 g", lastUpdated: "17/03/2026" },
    ],
  };

  const dispatch = useDispatch();
  const { salesReportData, salesReportLoad } = useSelector((state: any) => state.purchase);
  useEffect(() => { dispatch(getSalesReport()); }, [dispatch]);

  const shopOwners = mockOutstandingData?.shopOwners ?? [];
  const factories = mockOutstandingData?.factories ?? [];

  const COLS_OWNERS = ["Name", "Cash Outstanding", "Metal Outstanding", "As of"];
  const COLS_FACTORIES = ["Factory", "Cash Payable", "Metal Payable", "As of"];

  return (
    <div className="flex flex-col gap-4">
      {/* Shop Owners */}
      <div className="border border-gray-100 rounded-2xl overflow-hidden bg-white">
        <div className="flex items-center gap-2.5 px-5 py-4 bg-gradient-to-r from-rose-50/60 to-white border-b border-gray-50">
          <div className="w-7 h-7 rounded-lg bg-rose-100 flex items-center justify-center">
            <Wallet className="w-3.5 h-3.5 text-rose-500" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-gray-800">Metal Outstanding</h2>
            <p className="text-[10px] text-gray-400">Amounts receivable from shop owners</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs sm:text-sm min-w-[480px]">
            <thead>
              <tr className="border-b border-gray-50 bg-gray-50/40">
                {COLS_OWNERS.map((h) => (
                  <th key={h} className="text-left px-4 sm:px-5 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-[0.12em]">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {salesReportLoad && Array.from({ length: 2 }).map((_, i) => <SkeletonRow key={i} cols={4} />)}
              {!salesReportLoad && shopOwners.map((r: any, idx: number) => (
                <tr key={r.id} className={`border-b border-gray-50 hover:bg-rose-50/20 transition-colors ${idx % 2 === 0 ? "" : "bg-gray-50/20"}`}>
                  <td className="px-4 sm:px-5 py-3.5 text-gray-800 font-bold">{r.name}</td>
                  <td className="px-4 sm:px-5 py-3.5"><BalanceChip value={r.cashBalance} type="cash" /></td>
                  <td className="px-4 sm:px-5 py-3.5"><BalanceChip value={r.metalBalance} type="metal" /></td>
                  <td className="px-4 sm:px-5 py-3.5 text-gray-400 text-[10px] sm:text-xs tabular-nums">{r.lastUpdated}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Factories */}
      <div className="border border-gray-100 rounded-2xl overflow-hidden bg-white">
        <div className="flex items-center gap-2.5 px-5 py-4 bg-gradient-to-r from-green-50/60 to-white border-b border-gray-50">
          <div className="w-7 h-7 rounded-lg bg-green-100 flex items-center justify-center">
            <Building2 className="w-3.5 h-3.5 text-green-600" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-gray-800">Payable to Factories</h2>
            <p className="text-[10px] text-gray-400">Amounts owed to manufacturing partners</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs sm:text-sm min-w-[480px]">
            <thead>
              <tr className="border-b border-gray-50 bg-gray-50/40">
                {COLS_FACTORIES.map((h) => (
                  <th key={h} className="text-left px-4 sm:px-5 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-[0.12em]">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {salesReportLoad && Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} cols={4} />)}
              {!salesReportLoad && factories.map((r: any, idx: number) => (
                <tr key={r.id} className={`border-b border-gray-50 hover:bg-green-50/20 transition-colors ${idx % 2 === 0 ? "" : "bg-gray-50/20"}`}>
                  <td className="px-4 sm:px-5 py-3.5 text-gray-800 font-bold">{r.factoryName}</td>
                  <td className="px-4 sm:px-5 py-3.5"><BalanceChip value={r.cashBalance} type="cash" /></td>
                  <td className="px-4 sm:px-5 py-3.5"><BalanceChip value={r.metalBalance} type="metal" /></td>
                  <td className="px-4 sm:px-5 py-3.5 text-gray-400 text-[10px] sm:text-xs tabular-nums">{r.lastUpdated}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

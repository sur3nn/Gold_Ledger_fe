"use client";

import { getOutstandingReport } from "@/Redux/Action/action";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Wallet, Building2, AlertCircle } from "lucide-react";

function SkeletonRow({ cols }: { cols: number }) {
  return (
    <tr className="border-b border-gray-50">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-3.5">
          <div className="h-3 bg-violet-50 rounded-full animate-pulse" style={{ width: `${50 + (i % 3) * 18}%` }} />
        </td>
      ))}
    </tr>
  );
}

function formatCash(value: number) {
  return `₹${Number(value ?? 0).toLocaleString("en-IN")}`;
}

function formatMetal(value: number) {
  return `${Number(value ?? 0).toFixed(3)} g`;
}

function BalanceChip({ value, type }: { value: number; type: "cash" | "metal" }) {
  const isZero = !value || value === 0;
  const display = type === "cash" ? formatCash(value) : formatMetal(value);

  if (isZero) {
    return <span className="text-gray-300 font-semibold tabular-nums">{display}</span>;
  }
  if (type === "cash") {
    return <span className="text-rose-500 font-bold tabular-nums">{display}</span>;
  }
  return <span className="text-amber-500 font-bold tabular-nums">{display}</span>;
}

function EmptyState({ label }: { label: string }) {
  return (
    <tr>
      <td colSpan={4} className="py-10 text-center">
        <p className="text-sm text-gray-400">{label}</p>
      </td>
    </tr>
  );
}

function ErrorRow({ message }: { message: string }) {
  return (
    <tr>
      <td colSpan={4} className="py-10 text-center">
        <div className="flex flex-col items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-400" />
          <p className="text-sm text-red-400">{message}</p>
        </div>
      </td>
    </tr>
  );
}

export default function OutstandingTab({ fromDate, toDate }: { fromDate: string; toDate: string }) {
  const dispatch = useDispatch();
  const {
    outstandingShopOwners,
    outstandingFactories,
    outstandingLoad,
    outstandingError,
  } = useSelector((state: any) => state.purchase);

  useEffect(() => {
    dispatch(getOutstandingReport({ fromDate, toDate }) as any);
  }, [dispatch, fromDate, toDate]);

  const shopOwners = outstandingShopOwners ?? [];
  const factories = outstandingFactories ?? [];

  const totalOwnerCash = shopOwners.reduce((s: number, o: any) => s + Number(o.cash_balance ?? 0), 0);
  const totalOwnerMetal = shopOwners.reduce((s: number, o: any) => s + Number(o.metal_balance ?? 0), 0);
  const totalFactoryCash = factories.reduce((s: number, f: any) => s + Number(f.cash_balance ?? 0), 0);
  const totalFactoryMetal = factories.reduce((s: number, f: any) => s + Number(f.metal_balance ?? 0), 0);

  const COLS_OWNERS = ["Name", "Cash Outstanding", "Metal Outstanding", "As of"];
  const COLS_FACTORIES = ["Factory", "Cash Payable", "Metal Payable", "As of"];
  const OWNER_COLORS = ["text-blue-500", "text-rose-500", "text-amber-500", "text-gray-400"];
  const FACTORY_COLORS = ["text-green-600", "text-rose-500", "text-amber-500", "text-gray-400"];

  return (
    <div className="flex flex-col gap-4">
      {/* Shop Owners */}
      <div className="border border-violet-100/70 rounded-2xl overflow-hidden bg-white shadow-sm">
        <div className="flex items-center gap-2.5 px-5 py-4 bg-gradient-to-r from-rose-50/70 via-violet-50/30 to-white border-b border-gray-50">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center shadow-sm">
            <Wallet className="w-3.5 h-3.5 text-white" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-gray-800">Metal Outstanding</h2>
            <p className="text-[10px] text-gray-400">Amounts receivable from shop owners</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs sm:text-sm min-w-[480px]">
            <thead>
              <tr className="border-b border-gray-50 bg-violet-50/30">
                {COLS_OWNERS.map((h, i) => (
                  <th key={h} className={`text-left px-4 sm:px-5 py-3 text-[10px] font-bold uppercase tracking-[0.12em] ${OWNER_COLORS[i]}`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {outstandingLoad && Array.from({ length: 2 }).map((_, i) => <SkeletonRow key={i} cols={4} />)}

              {!outstandingLoad && outstandingError && <ErrorRow message={outstandingError} />}

              {!outstandingLoad && !outstandingError && shopOwners.length === 0 && (
                <EmptyState label="No shop owners recorded yet" />
              )}

              {!outstandingLoad && !outstandingError && shopOwners.map((r: any, idx: number) => (
                <tr key={r.id} className={`border-b border-gray-50 hover:bg-rose-50/20 transition-colors ${idx % 2 === 0 ? "" : "bg-gray-50/20"}`}>
                  <td className="px-4 sm:px-5 py-3.5 text-gray-800 font-bold">{r.name}</td>
                  <td className="px-4 sm:px-5 py-3.5"><BalanceChip value={Number(r.cash_balance)} type="cash" /></td>
                  <td className="px-4 sm:px-5 py-3.5"><BalanceChip value={Number(r.metal_balance)} type="metal" /></td>
                  <td className="px-4 sm:px-5 py-3.5 text-gray-400 text-[10px] sm:text-xs tabular-nums">
                    {r.last_updated ?? "—"}
                  </td>
                </tr>
              ))}
            </tbody>
            {!outstandingLoad && !outstandingError && shopOwners.length > 0 && (
              <tfoot>
                <tr className="bg-rose-50/40 border-t border-rose-100">
                  <td className="px-4 sm:px-5 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wide">Total</td>
                  <td className="px-4 sm:px-5 py-3 text-sm font-bold text-rose-500 tabular-nums">{formatCash(totalOwnerCash)}</td>
                  <td className="px-4 sm:px-5 py-3 text-sm font-bold text-amber-500 tabular-nums">{formatMetal(totalOwnerMetal)}</td>
                  <td className="px-4 sm:px-5 py-3" />
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>

      {/* Factories */}
      <div className="border border-violet-100/70 rounded-2xl overflow-hidden bg-white shadow-sm">
        <div className="flex items-center gap-2.5 px-5 py-4 bg-gradient-to-r from-green-50/70 via-violet-50/30 to-white border-b border-gray-50">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-sm">
            <Building2 className="w-3.5 h-3.5 text-white" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-gray-800">Payable to Factories</h2>
            <p className="text-[10px] text-gray-400">Amounts owed to manufacturing partners</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs sm:text-sm min-w-[480px]">
            <thead>
              <tr className="border-b border-gray-50 bg-violet-50/30">
                {COLS_FACTORIES.map((h, i) => (
                  <th key={h} className={`text-left px-4 sm:px-5 py-3 text-[10px] font-bold uppercase tracking-[0.12em] ${FACTORY_COLORS[i]}`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {outstandingLoad && Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} cols={4} />)}

              {!outstandingLoad && outstandingError && <ErrorRow message={outstandingError} />}

              {!outstandingLoad && !outstandingError && factories.length === 0 && (
                <EmptyState label="No factories recorded yet" />
              )}

              {!outstandingLoad && !outstandingError && factories.map((r: any, idx: number) => (
                <tr key={r.id} className={`border-b border-gray-50 hover:bg-green-50/20 transition-colors ${idx % 2 === 0 ? "" : "bg-gray-50/20"}`}>
                  <td className="px-4 sm:px-5 py-3.5 text-gray-800 font-bold">{r.factory_name}</td>
                  <td className="px-4 sm:px-5 py-3.5"><BalanceChip value={Number(r.cash_balance)} type="cash" /></td>
                  <td className="px-4 sm:px-5 py-3.5"><BalanceChip value={Number(r.metal_balance)} type="metal" /></td>
                  <td className="px-4 sm:px-5 py-3.5 text-gray-400 text-[10px] sm:text-xs tabular-nums">
                    {r.last_updated ?? "—"}
                  </td>
                </tr>
              ))}
            </tbody>
            {!outstandingLoad && !outstandingError && factories.length > 0 && (
              <tfoot>
                <tr className="bg-green-50/40 border-t border-green-100">
                  <td className="px-4 sm:px-5 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wide">Total</td>
                  <td className="px-4 sm:px-5 py-3 text-sm font-bold text-rose-500 tabular-nums">{formatCash(totalFactoryCash)}</td>
                  <td className="px-4 sm:px-5 py-3 text-sm font-bold text-amber-500 tabular-nums">{formatMetal(totalFactoryMetal)}</td>
                  <td className="px-4 sm:px-5 py-3" />
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { Scale, Coins, Wallet, Banknote } from "lucide-react";

interface StockOverviewProps {
  data: {
    total_net_weight?: string | number;
    total_gold_given?: string | number;
    total_amount?: string | number;
    total_amount_given?: string | number;
  } | null;
  loading: boolean;
}

type Tab = "weight" | "payments";

const StockOverview = ({ data, loading }: StockOverviewProps) => {
  const [tab, setTab] = useState<Tab>("weight");

const totalNetWeight = Number(data?.total_net_weight ?? 0);
const totalGoldGiven = Number(data?.total_gold_given ?? 0);
const totalAmount = Number(data?.total_amount ?? 0);
const totalAmountGiven = Number(data?.total_amount_given ?? 0);

const weightBalance =
  Math.round((totalGoldGiven - totalNetWeight) * 1000) / 1000;

const amountBalance =
  Math.round((totalAmountGiven - totalAmount) * 100) / 100;

const formatRupee = (val: number) => {
  const rounded = Math.round(val * 100) / 100;
  return `₹${rounded.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

  return (
    <div
      className="rounded-3xl p-5 sm:p-6 text-white h-full relative overflow-hidden shadow-lg flex flex-col"
      style={{
        background:
          "linear-gradient(135deg, #1e1b4b 0%, #5b21b6 40%, #86198f 70%, #065f46 100%)",
      }}
    >
      {/* decorative glows */}
      <div
        className="absolute -top-10 -right-10 w-40 h-40 rounded-full opacity-30 pointer-events-none"
        style={{ background: "radial-gradient(circle, #fbbf24, transparent 70%)" }}
      />
      <div
        className="absolute -bottom-14 -left-10 w-44 h-44 rounded-full opacity-20 pointer-events-none"
        style={{ background: "radial-gradient(circle, #34d399, transparent 70%)" }}
      />

      <h3 className="text-[16px] sm:text-[17px] font-bold mb-4 relative">
        Stock Overview
      </h3>

      {/* ── Horizontal tab switcher ── */}
      <div className="relative flex items-center gap-1 p-1 rounded-2xl bg-white/10 border border-white/10 mb-4">
        <button
          type="button"
          onClick={() => setTab("weight")}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-[12px] font-bold transition-all ${tab === "weight"
              ? "bg-white text-indigo-800 shadow-sm"
              : "text-white/60 hover:text-white/90"
            }`}
        >
          <Scale size={12} />
          Weight
        </button>
        <button
          type="button"
          onClick={() => setTab("payments")}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-[12px] font-bold transition-all ${tab === "payments"
              ? "bg-white text-indigo-800 shadow-sm"
              : "text-white/60 hover:text-white/90"
            }`}
        >
          <Banknote size={12} />
          Payments
        </button>
      </div>

      {/* ── Weight tab ── */}
      {tab === "weight" && (
        <div className="relative flex flex-col">
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div className="rounded-xl bg-white/10 px-3 py-2.5 min-w-0">
              <p className="text-[9.5px] text-white/60 leading-tight truncate">Net Weight</p>
              <p className="text-[14px] font-bold text-amber-300 truncate">
                {loading ? "..." : `${totalNetWeight.toFixed(3)}g`}
              </p>
            </div>
            <div className="rounded-xl bg-white/10 px-3 py-2.5 min-w-0">
              <p className="text-[9.5px] text-white/60 leading-tight truncate">Gold Given</p>
              <p className="text-[14px] font-bold text-white truncate">
                {loading ? "..." : `${totalGoldGiven >= 0 ? "+" : ""}${totalGoldGiven.toFixed(3)}g`}
              </p>
            </div>
          </div>

          <div className="rounded-2xl bg-white/10 backdrop-blur-sm px-3.5 py-3 flex items-center justify-between gap-2 border border-white/10">
  <div className="flex items-center gap-2 min-w-0">
    <span className="w-8 h-8 rounded-lg bg-emerald-400/20 flex items-center justify-center flex-shrink-0">
      <Coins size={13} className="text-emerald-300" />
    </span>
    <div className="min-w-0 flex flex-col gap-1">
      <span
        className={`inline-flex items-center w-fit gap-1 text-[9.5px] font-bold leading-none px-2 py-1 rounded-full ${
          weightBalance >= 0
            ? "bg-emerald-400/25 text-emerald-300"
            : "bg-rose-400/25 text-rose-300"
        }`}
      >
        {weightBalance >= 0 ? "CREDIT BALANCE" : "EXCESS WEIGHT"}
      </span>
      <p className="text-[9.5px] text-white/40 leading-tight truncate pl-0.5">
        {weightBalance >= 0 ? "Given to factory" : "Taken from factory"}
      </p>
    </div>
  </div>
  <p
    className={`text-[20px] font-bold leading-none tabular-nums flex-shrink-0 ${
      weightBalance >= 0 ? "text-emerald-300" : "text-rose-300"
    }`}
  >
    {loading ? "..." : `${weightBalance}g`}
  </p>
</div>
        </div>
      )}

      {/* ── Payments tab ── */}
      {tab === "payments" && (
        <div className="relative flex flex-col">
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div className="rounded-xl bg-white/10 px-3 py-2.5 min-w-0">
              <p className="text-[9.5px] text-white/60 leading-tight truncate">Product Amt.</p>
              <p className="text-[13px] font-bold text-pink-300 truncate">
                {loading ? "..." : formatRupee (totalAmount)}
              </p>
            </div>
            <div className="rounded-xl bg-white/10 px-3 py-2.5 min-w-0">
              <p className="text-[9.5px] text-white/60 leading-tight truncate">Amt. Given</p>
              <p className="text-[13px] font-bold text-white truncate">
                {loading ? "..." : formatRupee (totalAmountGiven)}
              </p>
            </div>
          </div>

          <div className="rounded-2xl bg-white/10 backdrop-blur-sm px-3.5 py-3 flex items-center justify-between gap-2 border border-white/10">
  <div className="flex items-center gap-2 min-w-0">
    <span className="w-8 h-8 rounded-lg bg-amber-400/20 flex items-center justify-center flex-shrink-0">
      <Wallet size={13} className="text-amber-300" />
    </span>
    <div className="min-w-0 flex flex-col gap-1">
      <span
        className={`inline-flex items-center w-fit gap-1 text-[9.5px] font-bold leading-none px-2 py-1 rounded-full ${
          amountBalance >= 0
            ? "bg-amber-400/25 text-amber-300"
            : "bg-rose-400/25 text-rose-300"
        }`}
      >
        {amountBalance >= 0 ? "PAYMENT BALANCE" : "EXCESS PAYMENT"}
      </span>
      <p className="text-[9.5px] text-white/40 leading-tight truncate pl-0.5">
        {amountBalance >= 0 ? "Advance to factory" : "Due to factory"}
      </p>
    </div>
  </div>
  <p
    className={`text-[18px] font-bold leading-none tabular-nums flex-shrink-0 ${
      amountBalance >= 0 ? "text-amber-300" : "text-rose-300"
    }`}
  >
    {loading ? "..." : formatRupee(amountBalance)}
  </p>
</div>
        </div>
      )}
    </div>
  );
};

export default StockOverview;
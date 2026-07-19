"use client";

import { useState } from "react";
import { Search, X, ArrowUpRight, Wallet, Download } from "lucide-react";

interface CreditSummaryProps {
  totalCreditGiven: string | number;
  totalCreditTaken: string | number;
  totalCashGiven: string | number;
  totalCashTaken: string | number;
  loading: boolean;
   selectedPartyName?: string | null; 
  onClearParty?: () => void;
}

function SkeletonBox({ className }: { className?: string }) {
  return <div className={`animate-pulse bg-white/20 rounded-lg ${className}`} />;
}

export default function CreditSummary({
  totalCreditGiven,
  totalCreditTaken,
  totalCashGiven,
  totalCashTaken,
  loading,
   selectedPartyName,
  onClearParty,
}: CreditSummaryProps) {
  // const [searchValue, setSearchValue] = useState("");
  // const [selectedParty, setSelectedParty] = useState<string | null>(null);

  // const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
  //   if (e.key === "Enter" && searchValue.trim()) {
  //     setSelectedParty(searchValue.trim());
  //     setSearchValue("");
  //   }
  // };

  // const handleClearParty = () => {
  //   setSelectedParty(null);
  // };

  return (
    <div>
      {/* Header Row */}
      <div className="flex items-start justify-between mb-4 gap-3">
        <div className="flex items-center gap-3">
          <div className="w-1 h-7 sm:h-8 rounded-full bg-gradient-to-b from-violet-500 via-fuchsia-500 to-orange-400" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Credit Management</h1>
            <p className="text-sm text-gray-500 mt-0.5">Track pending gold quantities and cash balances</p>
          </div>
        </div>
        {/* <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-violet-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            className="w-full pl-9 pr-4 py-2 border border-violet-100 rounded-full text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-violet-300 focus:ring-2 focus:ring-violet-50 bg-white shadow-sm transition-all"
          />
        </div> */}
      </div>

      {/* Selected Party Chip */}
      {selectedPartyName && (
  <div className="mb-4">
    <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-violet-200 rounded-lg text-sm text-gray-700 bg-white">
      <span>{selectedPartyName}</span>
      <button onClick={onClearParty} className="text-gray-400 hover:text-gray-600">
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  </div>
)}

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Total Credit Given */}
        <div
          className="rounded-2xl p-5 text-white relative overflow-hidden shadow-lg shadow-indigo-200/50"
          style={{ background: "linear-gradient(135deg, #4F46E5 0%, #7c3aed 55%, #3730A3 100%)" }}
        >
          {/* decorative glow */}
          <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/10 blur-2xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-6 w-28 h-28 rounded-full bg-fuchsia-400/10 blur-2xl pointer-events-none" />

          <div className="flex items-start justify-between relative">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-white/20 flex items-center justify-center flex-shrink-0 ring-1 ring-white/30">
                <Wallet className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-indigo-100 mb-1.5">
                  Total Credit Given
                </p>
                {loading ? (
                  <>
                    <SkeletonBox className="h-9 w-32 mb-2" />
                    <SkeletonBox className="h-4 w-16" />
                  </>
                ) : (
                  <>
                    <p className="text-3xl sm:text-4xl font-bold tracking-tight">
                      {totalCreditGiven}
                      <span className="text-xl sm:text-2xl font-bold ml-0.5">g</span>
                    </p>
                    <p className="text-sm mt-1 text-indigo-100">{totalCashGiven}</p>
                  </>
                )}
              </div>
            </div>
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
              <ArrowUpRight className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>

        {/* Total Credit Taken */}
        <div
          className="rounded-2xl p-5 text-white relative overflow-hidden shadow-lg shadow-rose-200/50"
          style={{ background: "linear-gradient(135deg, #f43f5e 0%, #e11d48 55%, #9f1239 100%)" }}
        >
          {/* decorative glow */}
          <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/10 blur-2xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-6 w-28 h-28 rounded-full bg-orange-300/10 blur-2xl pointer-events-none" />

          <div className="flex items-start justify-between relative">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-white/20 flex items-center justify-center flex-shrink-0 ring-1 ring-white/30">
                <Download className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-rose-100 mb-1.5">
                  Total Credit Taken
                </p>
                {loading ? (
                  <>
                    <SkeletonBox className="h-9 w-32 mb-2" />
                    <SkeletonBox className="h-4 w-16" />
                  </>
                ) : (
                  <>
                    <p className="text-3xl sm:text-4xl font-bold tracking-tight">
                      {totalCreditTaken}
                      <span className="text-xl sm:text-2xl font-bold ml-0.5">g</span>
                    </p>
                    <p className="text-sm mt-1 text-rose-100">{totalCashTaken}</p>
                  </>
                )}
              </div>
            </div>
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
              <ArrowUpRight className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

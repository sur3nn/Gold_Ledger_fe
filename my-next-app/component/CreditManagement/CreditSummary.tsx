"use client";

import { useState } from "react";
import { Search, X, ArrowUpRight } from "lucide-react";

interface CreditSummaryProps {
  totalCreditGiven: string | number;
  totalCreditTaken: string | number;
  totalCashGiven: string | number;
  totalCashTaken: string | number;
  loading: boolean;
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
}: CreditSummaryProps) {
  const [searchValue, setSearchValue] = useState("");
  const [selectedParty, setSelectedParty] = useState<string | null>(null);

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchValue.trim()) {
      setSelectedParty(searchValue.trim());
      setSearchValue("");
    }
  };

  const handleClearParty = () => {
    setSelectedParty(null);
  };

  return (
    <div>
      {/* Header Row */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Credit Management</h1>
          <p className="text-sm text-gray-500 mt-0.5">Track pending gold quantities and cash balances</p>
        </div>
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-full text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-gray-300 bg-white"
          />
        </div>
      </div>

      {/* Selected Party Chip */}
      {selectedParty && (
        <div className="mb-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white">
            <span>{selectedParty}</span>
            <button onClick={handleClearParty} className="text-gray-400 hover:text-gray-600">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Total Credit Given */}
        <div
          className="rounded-2xl p-5 text-white relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, #4F46E5 0%, #3730A3 100%)" }}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-xs font-semibold uppercase tracking-widest text-indigo-200 mb-3">
                Total Credit Given
              </p>
              {loading ? (
                <>
                  <SkeletonBox className="h-9 w-32 mb-2" />
                  <SkeletonBox className="h-4 w-16" />
                </>
              ) : (
                <>
                  <p className="text-4xl font-bold tracking-tight">
                    {totalCreditGiven}
                    <span className="text-2xl font-bold ml-0.5">g</span>
                  </p>
                  <p className="text-sm mt-1 text-indigo-200">{totalCashGiven}</p>
                </>
              )}
            </div>
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
              <ArrowUpRight className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>

        {/* Total Credit Taken */}
        <div
          className="rounded-2xl p-5 text-white relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, #DC2626 0%, #B91C1C 100%)" }}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-xs font-semibold uppercase tracking-widest text-red-200 mb-3">
                Total Credit Taken
              </p>
              {loading ? (
                <>
                  <SkeletonBox className="h-9 w-32 mb-2" />
                  <SkeletonBox className="h-4 w-16" />
                </>
              ) : (
                <>
                  <p className="text-4xl font-bold tracking-tight">
                    {totalCreditTaken}
                    <span className="text-2xl font-bold ml-0.5">g</span>
                  </p>
                  <p className="text-sm mt-1 text-red-200">{totalCashTaken}</p>
                </>
              )}
            </div>
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
              <ArrowUpRight className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

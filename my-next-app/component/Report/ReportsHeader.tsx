"use client";

import { Search, CalendarDays } from "lucide-react";

interface ReportsHeaderProps {
  fromDate: string;
  toDate: string;
  onFromDateChange: (v: string) => void;
  onToDateChange: (v: string) => void;
}

export default function ReportsHeader({
  fromDate,
  toDate,
  onFromDateChange,
  onToDateChange,
}: ReportsHeaderProps) {
  return (
    <div className="flex flex-col gap-4">
      {/* Title Row */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <div className="w-1 h-5 rounded-full bg-gradient-to-b from-amber-400 to-amber-600" />
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
              Business Analytics
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-gray-400 ml-3">
            Comprehensive reports and data insights
          </p>
        </div>
        <div className="relative w-full sm:w-60">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 w-3.5 h-3.5" />
          <input
            type="text"
            placeholder="Search records…"
            className="w-full pl-8 pr-4 py-2 border border-gray-100 rounded-full text-xs text-gray-600 placeholder-gray-300 outline-none focus:border-amber-200 focus:ring-2 focus:ring-amber-50 bg-white transition-all"
          />
        </div>
      </div>

      {/* Date Range Row */}
      <div className="bg-white border border-gray-100 rounded-2xl p-3 sm:p-4 flex flex-col sm:flex-row gap-3 sm:gap-0">
        <div className="flex items-center gap-3 flex-1">
          <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0">
            <CalendarDays className="w-3.5 h-3.5 text-amber-500" />
          </div>
          <div className="flex flex-col gap-0.5 flex-1">
            <label className="text-[10px] font-semibold text-gray-300 uppercase tracking-widest">
              From
            </label>
            <input
              type="text"
              placeholder="DD-MM-YYYY"
              value={fromDate}
              onChange={(e) => onFromDateChange(e.target.value)}
              className="text-xs sm:text-sm text-gray-600 outline-none bg-transparent placeholder-gray-300 font-medium"
            />
          </div>
        </div>

        <div className="hidden sm:block w-px bg-gray-100 mx-2" />
        <div className="block sm:hidden h-px bg-gray-100" />

        <div className="flex items-center gap-3 flex-1">
          <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0">
            <CalendarDays className="w-3.5 h-3.5 text-amber-500" />
          </div>
          <div className="flex flex-col gap-0.5 flex-1">
            <label className="text-[10px] font-semibold text-gray-300 uppercase tracking-widest">
              To
            </label>
            <input
              type="text"
              placeholder="DD-MM-YYYY"
              value={toDate}
              onChange={(e) => onToDateChange(e.target.value)}
              className="text-xs sm:text-sm text-gray-600 outline-none bg-transparent placeholder-gray-300 font-medium"
            />
          </div>
        </div>

        <div className="hidden sm:block w-px bg-gray-100 mx-2" />

        <button className="sm:self-center w-full sm:w-auto px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold rounded-xl transition-colors whitespace-nowrap">
          Apply Filter
        </button>
      </div>
    </div>
  );
}

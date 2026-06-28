"use client";

import { Search } from "lucide-react";

const columns = [
  "Bill ID",
  "Date",
  "Customer",
  "Net Weight",
  "Grand Total",
  "Payment",
  "Recorded At",
];

const RecordedHistory = () => {
  return (
    <div className="bg-white rounded-3xl overflow-hidden">
      {/* Header */}
      <div
        className="px-5 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
        style={{ background: "linear-gradient(90deg, #fff5f2, #f5f2ff)" }}
      >
        <h3 className="text-[15px] font-bold text-gray-800">
          Recorded History
        </h3>

        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-2 w-full sm:w-auto sm:min-w-[220px]">
          <Search size={14} className="text-gray-400 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search"
            className="flex-1 outline-none text-[13px] text-gray-600 placeholder:text-gray-300 bg-transparent min-w-0"
          />
        </div>
      </div>

      {/* Table — horizontally scrollable on small screens */}
      <div className="overflow-x-auto">
        {/* Column Header */}
        <div
          className="grid px-5 sm:px-6 py-3 border-b border-gray-100 min-w-[640px]"
          style={{ gridTemplateColumns: "repeat(7, 1fr)" }}
        >
          {columns.map((col) => (
            <span key={col} className="text-[12px] font-semibold text-gray-500 whitespace-nowrap pr-2">
              {col}
            </span>
          ))}
        </div>

        {/* Empty Body */}
        <div className="min-h-[160px] sm:min-h-[180px] flex items-center justify-center min-w-[640px]">
          <p className="text-sm text-gray-300">No records found</p>
        </div>
      </div>
    </div>
  );
};

export default RecordedHistory;

"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  page: number; // 1-indexed
  limit: number;
  /** Total record count if the API returns one — enables exact page count and "X–Y of Z". */
  total?: number;
  /** Records returned in the current page — used to infer whether a next page exists when `total` is unknown. */
  recordsOnPage: number;
  onPageChange: (page: number) => void;
  accent?: "violet" | "blue";
}

const ACCENT = {
  violet: {
    active: "bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-sm shadow-purple-200",
    idle: "text-violet-600 hover:bg-violet-50",
  },
  blue: {
    active: "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm shadow-blue-200",
    idle: "text-blue-600 hover:bg-blue-50",
  },
} as const;

export default function Pagination({
  page,
  limit,
  total,
  recordsOnPage,
  onPageChange,
  accent = "violet",
}: PaginationProps) {
  const a = ACCENT[accent];

  const rangeStart = recordsOnPage === 0 ? 0 : (page - 1) * limit + 1;
  const rangeEnd = (page - 1) * limit + recordsOnPage;

  const totalPages = total != null ? Math.max(1, Math.ceil(total / limit)) : null;
  const hasPrev = page > 1;
  const hasNext = total != null ? page < (totalPages ?? 1) : recordsOnPage === limit;

  if (recordsOnPage === 0 && page === 1) return null;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 sm:px-6 py-3.5 border-t border-gray-50 bg-gray-50/30">
      <p className="text-[11px] text-gray-400 font-medium">
        {total != null ? (
          <>
            Showing <span className="text-gray-600 font-semibold">{rangeStart}–{rangeEnd}</span> of{" "}
            <span className="text-gray-600 font-semibold">{total}</span>
          </>
        ) : (
          <>
            Showing <span className="text-gray-600 font-semibold">{rangeStart}–{rangeEnd}</span>
          </>
        )}
      </p>

      <div className="flex items-center gap-1.5">
        <button
          onClick={() => hasPrev && onPageChange(page - 1)}
          disabled={!hasPrev}
          className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          aria-label="Previous page"
        >
          <ChevronLeft size={14} />
        </button>

        <span className={`px-3 py-1 text-[11px] font-bold rounded-lg ${a.active}`}>
          {page}{totalPages ? ` / ${totalPages}` : ""}
        </span>

        <button
          onClick={() => hasNext && onPageChange(page + 1)}
          disabled={!hasNext}
          className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          aria-label="Next page"
        >
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}
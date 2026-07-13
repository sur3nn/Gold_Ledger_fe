"use client";

import { AlertCircle, FileSearch } from "lucide-react";

// Cycled accent colors for table header labels (matches the report theme)
export const HEADER_COLORS = [
  "text-blue-500",
  "text-green-500",
  "text-orange-500",
  "text-violet-500",
  "text-pink-500",
  "text-gray-400",
  "text-fuchsia-500",
];

export function SkeletonRow({ cols }: { cols: number }) {
  return (
    <tr className="border-b border-gray-50">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 sm:px-5 py-3.5">
          <div
            className="h-3 bg-violet-50 rounded-full animate-pulse"
            style={{ width: `${50 + (i % 3) * 18}%` }}
          />
        </td>
      ))}
    </tr>
  );
}

export function EmptyState({ colSpan = 6, label = "No records found" }: { colSpan?: number; label?: string }) {
  return (
    <tr>
      <td colSpan={colSpan} className="py-14 text-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-violet-50 flex items-center justify-center">
            <FileSearch className="w-6 h-6 text-violet-300" />
          </div>
          <p className="text-sm font-bold text-gray-700">No Records</p>
          <p className="text-xs text-gray-400">{label}</p>
        </div>
      </td>
    </tr>
  );
}

export function ErrorState({ colSpan = 6, message }: { colSpan?: number; message: string }) {
  return (
    <tr>
      <td colSpan={colSpan} className="py-12 text-center">
        <div className="flex flex-col items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-400" />
          <p className="text-sm text-red-400">{message}</p>
        </div>
      </td>
    </tr>
  );
}

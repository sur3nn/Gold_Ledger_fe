import { ClipboardX, AlertCircle } from "lucide-react";

export function EmptyState() {
  return (
    <tr>
      <td colSpan={10} className="py-16 text-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-xl border border-dashed border-amber-200 flex items-center justify-center bg-amber-50/50">
            <ClipboardX className="w-4 h-4 text-amber-300" />
          </div>
          <p className="text-xs text-gray-400 tracking-wide">No records found for this period</p>
        </div>
      </td>
    </tr>
  );
}

export function ErrorState({ message }: { message: string }) {
  return (
    <tr>
      <td colSpan={10} className="py-14 text-center">
        <div className="flex flex-col items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-300" />
          <p className="text-xs text-red-400">{message}</p>
        </div>
      </td>
    </tr>
  );
}

export function SkeletonRow({ cols }: { cols: number }) {
  return (
    <tr className="border-b border-gray-50/80">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-3.5">
          <div
            className="h-3 bg-gradient-to-r from-gray-100 to-gray-50 rounded-full animate-pulse"
            style={{ width: `${50 + (i % 3) * 18}%` }}
          />
        </td>
      ))}
    </tr>
  );
}

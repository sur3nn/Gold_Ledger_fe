"use client";

import { ReactNode } from "react";

interface StatCardProps {
  label: string;
  sublabel?: string;
  value: string | number;
  icon: ReactNode;
  iconBg: string;
  gradient: string;
  loading?: boolean;
  prefix?: string;
}

// Richer, more saturated background themes keyed off the icon square's color,
// so each card reads as a bold gradient instead of a pale, washed-out tint.
const CARD_THEMES: Record<string, { bg: string; border: string; value: string }> = {
  blue: {
    bg: "bg-gradient-to-br from-blue-400 via-blue-500 to-sky-600",
    border: "border-blue-300/40",
    value: "text-white",
  },
  emerald: {
    bg: "bg-gradient-to-br from-emerald-400 via-emerald-500 to-teal-600",
    border: "border-emerald-300/40",
    value: "text-white",
  },
  green: {
    bg: "bg-gradient-to-br from-green-400 via-emerald-500 to-teal-600",
    border: "border-green-300/40",
    value: "text-white",
  },
  orange: {
    bg: "bg-gradient-to-br from-amber-400 via-orange-500 to-orange-600",
    border: "border-orange-300/40",
    value: "text-white",
  },
  amber: {
    bg: "bg-gradient-to-br from-amber-400 via-orange-500 to-orange-600",
    border: "border-amber-300/40",
    value: "text-white",
  },
  violet: {
    bg: "bg-gradient-to-br from-violet-400 via-purple-500 to-fuchsia-600",
    border: "border-violet-300/40",
    value: "text-white",
  },
  purple: {
    bg: "bg-gradient-to-br from-violet-400 via-purple-500 to-fuchsia-600",
    border: "border-purple-300/40",
    value: "text-white",
  },
  rose: {
    bg: "bg-gradient-to-br from-rose-400 via-pink-500 to-fuchsia-600",
    border: "border-rose-300/40",
    value: "text-white",
  },
};

const DEFAULT_THEME = {
  bg: "bg-gradient-to-br from-slate-400 via-slate-500 to-slate-600",
  border: "border-slate-300/40",
  value: "text-white",
};

function getTheme(iconBg: string) {
  const key = iconBg.split("-")[1]; // "bg-blue-500" -> "blue"
  return CARD_THEMES[key] ?? DEFAULT_THEME;
}

export default function StatCard({
  label,
  sublabel,
  value,
  icon,
  iconBg,
  gradient,
  loading,
  prefix = "",
}: StatCardProps) {
  const theme = getTheme(iconBg);

  return (
    <div
      className={`relative ${theme.bg} border ${theme.border} rounded-2xl p-4 sm:p-5 flex flex-col justify-between min-h-[130px] sm:min-h-[150px] shadow-md`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/25 backdrop-blur-sm flex items-center justify-center shadow-sm shrink-0 ring-1 ring-white/40">
            {icon}
          </div>
          <div className="min-w-0">
            <p className="text-[10px] sm:text-xs font-bold text-white/90 uppercase tracking-wide leading-tight truncate">
              {label}
            </p>
            {sublabel && (
              <p className="text-[10px] sm:text-xs font-bold text-white/90 uppercase tracking-wide leading-tight truncate">
                {sublabel}
              </p>
            )}
          </div>
        </div>
        {/* <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/25 backdrop-blur-sm ring-1 ring-white/40 flex items-center justify-center shrink-0">
          {trendIcon}
        </div> */}
      </div>

      {loading ? (
        <div className="h-6 sm:h-7 w-20 bg-white/30 rounded-md animate-pulse mt-3" />
      ) : (
        <p className={`text-xl sm:text-2xl font-bold ${theme.value} mt-3 tracking-tight`}>
          {prefix}
          {value}
        </p>
      )}
    </div>
  );
}
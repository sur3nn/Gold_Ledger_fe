"use client";

import { useEffect, useRef, useState } from "react";
import {
  Search,
  CalendarDays,
  SlidersHorizontal,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface ReportsHeaderProps {
  fromDate: string;
  toDate: string;
  onFromDateChange: (v: string) => void;
  onToDateChange: (v: string) => void;
  onApply: () => void;
}

const toISO = (d: Date) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

const fromISO = (s: string) => {
  if (!s) return null;
  const [y, m, d] = s.split("-").map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
};

const sameDay = (a: Date | null, b: Date | null) =>
  !!a &&
  !!b &&
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

const isBefore = (a: Date, b: Date) => {
  const x = new Date(a.getFullYear(), a.getMonth(), a.getDate()).getTime();
  const y = new Date(b.getFullYear(), b.getMonth(), b.getDate()).getTime();
  return x < y;
};

const formatDisplay = (s: string) => {
  const d = fromISO(s);
  if (!d) return "";
  return d.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

type Theme = "amber" | "pink";

const THEME = {
  amber: {
    iconBg: "linear-gradient(135deg, #fbbf24, #f97316)",
    label: "text-amber-500",
    ring: "focus-within:ring-amber-100",
    headerBg: "linear-gradient(135deg, #fde68a 0%, #fbbf24 60%, #f97316 100%)",
    selectedBg: "linear-gradient(135deg, #fbbf24, #f97316)",
    hoverBg: "hover:bg-amber-50",
    todayRing: "ring-amber-400",
    chipText: "text-amber-600",
  },
  pink: {
    iconBg: "linear-gradient(135deg, #ec4899, #a855f7)",
    label: "text-pink-500",
    ring: "focus-within:ring-pink-100",
    headerBg: "linear-gradient(135deg, #f9a8d4 0%, #ec4899 60%, #a855f7 100%)",
    selectedBg: "linear-gradient(135deg, #ec4899, #a855f7)",
    hoverBg: "hover:bg-pink-50",
    todayRing: "ring-pink-400",
    chipText: "text-pink-600",
  },
} satisfies Record<Theme, Record<string, string>>;

function CalendarPanel({
  value,
  onSelect,
  onClear,
  minDate,
  theme,
  onClose,
}: {
  value: string;
  onSelect: (iso: string) => void;
  onClear: () => void;
  minDate?: Date | null;
  theme: Theme;
  onClose: () => void;
}) {
  const selected = fromISO(value);
  const today = new Date();
  const [cursor, setCursor] = useState(() => selected ?? new Date());

  const t = THEME[theme];

  const year = cursor.getFullYear();
  const month = cursor.getMonth();

  const cells: { date: Date; current: boolean }[] = [];
  const firstDay = new Date(year, month, 1);
  const startWeekday = firstDay.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  for (let i = startWeekday - 1; i >= 0; i--) {
    cells.push({
      date: new Date(year, month - 1, daysInPrevMonth - i),
      current: false,
    });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ date: new Date(year, month, d), current: true });
  }
  const trailing = 42 - cells.length;
  for (let d = 1; d <= trailing; d++) {
    cells.push({ date: new Date(year, month + 1, d), current: false });
  }

  const monthLabel = cursor.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="absolute top-[calc(100%+10px)] left-0 z-[80] w-[300px] rounded-2xl bg-white shadow-2xl ring-1 ring-black/5 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
      <div
        className="px-4 pt-4 pb-3 flex items-center justify-between"
        style={{ background: t.headerBg }}
      >
        <button
          type="button"
          onClick={() => setCursor(new Date(year, month - 1, 1))}
          className="w-7 h-7 rounded-lg flex items-center justify-center bg-white/30 hover:bg-white/50 text-white transition-colors"
          aria-label="Previous month"
        >
          <ChevronLeft size={15} />
        </button>

        <span className="text-sm font-bold text-white drop-shadow-sm">
          {monthLabel}
        </span>

        <button
          type="button"
          onClick={() => setCursor(new Date(year, month + 1, 1))}
          className="w-7 h-7 rounded-lg flex items-center justify-center bg-white/30 hover:bg-white/50 text-white transition-colors"
          aria-label="Next month"
        >
          <ChevronRight size={15} />
        </button>
      </div>

      <div className="grid grid-cols-7 px-3 pt-3 pb-1">
        {WEEKDAYS.map((w) => (
          <div
            key={w}
            className="text-center text-[10px] font-bold text-gray-400 uppercase"
          >
            {w}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-y-1 px-3 pb-3">
        {cells.map(({ date, current }, i) => {
          const disabled = !!minDate && isBefore(date, minDate);
          const isSelected = sameDay(date, selected);
          const isToday = sameDay(date, today);

          return (
            <button
              key={i}
              type="button"
              disabled={disabled}
              onClick={() => {
                onSelect(toISO(date));
                onClose();
              }}
              className={`
                relative
                mx-auto
                w-8
                h-8
                rounded-full
                text-xs
                font-semibold
                transition-all
                flex
                items-center
                justify-center
                ${disabled ? "text-gray-200 cursor-not-allowed" : ""}
                ${
                  !disabled && !current
                    ? "text-gray-300"
                    : !disabled
                    ? "text-gray-700"
                    : ""
                }
                ${!disabled && !isSelected ? t.hoverBg : ""}
                ${isToday && !isSelected ? `ring-1 ${t.todayRing}` : ""}
              `}
              style={
                isSelected
                  ? { background: t.selectedBg, color: "white" }
                  : undefined
              }
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-between px-4 py-2.5 border-t border-gray-100 bg-gray-50/60">
        <button
          type="button"
          onClick={() => {
            onClear();
            onClose();
          }}
          className="text-xs font-semibold text-gray-400 hover:text-gray-600 transition-colors"
        >
          Clear
        </button>
        <button
          type="button"
          onClick={() => {
            const now = new Date();
            setCursor(now);
            onSelect(toISO(now));
            onClose();
          }}
          className={`text-xs font-bold ${t.chipText} hover:opacity-70 transition-opacity`}
        >
          Today
        </button>
      </div>
    </div>
  );
}

function DateField({
  label,
  value,
  onChange,
  theme,
  minDate,
  isOpen,
  onOpen,
  onClose,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  theme: Theme;
  minDate?: Date | null;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const t = THEME[theme];

  useEffect(() => {
    if (!isOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isOpen, onClose]);

  return (
    <div ref={wrapperRef} className="relative flex items-center gap-3 flex-1 py-3 sm:py-3.5">
      <button
        type="button"
        onClick={() => (isOpen ? onClose() : onOpen())}
        className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 hover:scale-105 active:scale-95 transition-transform"
        style={{ background: t.iconBg }}
        aria-label={`Open ${label.toLowerCase()} date picker`}
      >
        <CalendarDays className="w-4 h-4 text-white" />
      </button>

      <button
        type="button"
        onClick={() => (isOpen ? onClose() : onOpen())}
        className="flex flex-col gap-0.5 flex-1 min-w-0 text-left"
      >
        <span className={`text-[10px] font-bold uppercase tracking-widest ${t.label}`}>
          {label}
        </span>
        <span
          className={`text-xs sm:text-sm font-semibold w-full truncate ${
            value ? "text-gray-800" : "text-gray-300"
          }`}
        >
          {value ? formatDisplay(value) : "mm/dd/yyyy"}
        </span>
      </button>

      {isOpen && (
        <CalendarPanel
          value={value}
          onSelect={onChange}
          onClear={() => onChange("")}
          minDate={minDate}
          theme={theme}
          onClose={onClose}
        />
      )}
    </div>
  );
}

export default function ReportsHeader({
  fromDate,
  toDate,
  onFromDateChange,
  onToDateChange,
  onApply,
}: ReportsHeaderProps) {
  const [activeField, setActiveField] = useState<"from" | "to" | null>(null);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <div className="w-1 h-6 rounded-full bg-gradient-to-b from-violet-500 to-purple-600" />
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
              Business Analytics
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-gray-400 ml-3">
            Comprehensive reports and data insights
          </p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-violet-400 w-3.5 h-3.5" />
            <input
              type="text"
              placeholder="Search records…"
              className="w-full pl-8 pr-4 py-2.5 border border-violet-200 rounded-full text-xs text-gray-600 placeholder-gray-300 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 bg-white transition-all shadow-sm"
            />
          </div>
          <button className="flex-shrink-0 w-9 h-9 rounded-xl bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center hover:from-rose-500 hover:to-pink-600 transition-all shadow-sm shadow-rose-200">
            <SlidersHorizontal className="w-3.5 h-3.5 text-white" />
          </button>
        </div>
      </div>

      <div
        className="rounded-2xl p-1 shadow-sm"
        style={{ background: "linear-gradient(135deg, #a78bfa 0%, #f472b6 50%, #fb923c 100%)" }}
      >
        <div className="bg-white rounded-xl px-3 sm:px-5 py-1 flex flex-col sm:flex-row gap-0 sm:gap-0 items-stretch sm:items-center">

          <DateField
            label="From"
            value={fromDate}
            onChange={onFromDateChange}
            theme="amber"
            isOpen={activeField === "from"}
            onOpen={() => setActiveField("from")}
            onClose={() => setActiveField((f) => (f === "from" ? null : f))}
          />

          <div className="hidden sm:flex items-center px-3">
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #a78bfa, #ec4899)" }}
            >
              <ArrowRight className="w-3 h-3 text-white" />
            </div>
          </div>
          <div
            className="block sm:hidden h-px mx-0 my-0"
            style={{ background: "linear-gradient(90deg, #a78bfa40, #f472b640, #fb923c40)" }}
          />

          <DateField
            label="To"
            value={toDate}
            onChange={onToDateChange}
            theme="pink"
            minDate={fromISO(fromDate)}
            isOpen={activeField === "to"}
            onOpen={() => setActiveField("to")}
            onClose={() => setActiveField((f) => (f === "to" ? null : f))}
          />

          <div
            className="hidden sm:block w-px mx-3 self-stretch"
            style={{ background: "linear-gradient(180deg, #a78bfa40, #f472b640)" }}
          />

          <div className="py-2 sm:py-0 sm:pl-0">
            <button
              onClick={onApply}
              className="w-full sm:w-auto px-5 py-2.5 text-white text-xs font-bold rounded-xl transition-all whitespace-nowrap shadow-md"
              style={{
                background: "linear-gradient(135deg, #7c3aed 0%, #a855f7 50%, #ec4899 100%)",
                boxShadow: "0 4px 14px rgba(124,58,237,0.35)",
              }}
            >
              Apply Filter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
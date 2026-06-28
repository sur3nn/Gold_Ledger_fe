"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import {
  Factory,
  CreditCard,
  Coins,
  ChevronDown,
  ChevronUp,
  Check,
  AlertCircle,
} from "lucide-react";

interface FactoryItem {
  id: number;
  name: string;
}

interface TransactionCardProps {
  factories: FactoryItem[];
  selectedFactory: FactoryItem | null;
  setSelectedFactory: React.Dispatch<React.SetStateAction<FactoryItem | null>>;
  factoryName: string;
  setFactoryName: React.Dispatch<React.SetStateAction<string>>;
  paymentMethod: string;
  setPaymentMethod: React.Dispatch<React.SetStateAction<string>>;
  solidGoldGiven: number;
  setSolidGoldGiven: React.Dispatch<React.SetStateAction<number>>;
  errors?: { factory?: string; payment?: string; solidGold?: string };
}

const PAYMENT_OPTIONS = [
  { label: "Metal Credit", value: "1" },
  { label: "Cash", value: "2" },
  { label: "Bank Transfer", value: "3" },
  { label: "UPI", value: "4" },
];

// ── Field wrapper with label + optional error ─────────────────────────────────
const Field = ({
  label,
  icon,
  error,
  children,
}: {
  label: string;
  icon: React.ReactNode;
  error?: string;
  children: React.ReactNode;
}) => (
  <div className="flex flex-col gap-1.5">
    <label className="flex items-center gap-1.5 text-[13px] font-semibold text-gray-700">
      <span className="text-gray-400">{icon}</span>
      {label}
    </label>
    {children}
    {error && (
      <p className="flex items-center gap-1 text-[11px] text-red-500 font-medium mt-0.5">
        <AlertCircle size={11} />
        {error}
      </p>
    )}
  </div>
);

const TransactionCard = ({
  factories,
  selectedFactory,
  setSelectedFactory,
  factoryName,
  setFactoryName,
  paymentMethod,
  setPaymentMethod,
  solidGoldGiven,
  setSolidGoldGiven,
  errors = {},
}: TransactionCardProps) => {
  // ── Factory dropdown ──────────────────────────────────────────────────────
  const [factoryOpen, setFactoryOpen] = useState(false);
  const [search, setSearch] = useState("");
  const factoryRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // ── Payment dropdown ──────────────────────────────────────────────────────
  const [payOpen, setPayOpen] = useState(false);
  const payRef = useRef<HTMLDivElement>(null);

  const selectedPayLabel =
    PAYMENT_OPTIONS.find((o) => o.value === paymentMethod)?.label ?? "Select";

  const filteredFactories = useMemo(() => {
    if (!search.trim()) return factories;
    return factories.filter((x) =>
      x.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [factories, search]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (factoryRef.current && !factoryRef.current.contains(e.target as Node))
        setFactoryOpen(false);
      if (payRef.current && !payRef.current.contains(e.target as Node))
        setPayOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const ringError = (hasError?: string) =>
    hasError
      ? "border-red-300 ring-2 ring-red-100"
      : "border-gray-200 focus-within:border-indigo-300 focus-within:ring-2 focus-within:ring-indigo-100/70";

  return (
    <div className="bg-white rounded-3xl overflow-visible flex-1 shadow-sm border border-gray-100">
      {/* Header */}
      <div
        className="px-5 sm:px-6 py-4 rounded-t-3xl"
        style={{ background: "linear-gradient(90deg, #fff5f2, #f5f2ff)" }}
      >
        <h3 className="text-[15px] font-bold text-gray-800">Transaction Details</h3>
      </div>

      <div className="p-4 sm:p-6 flex flex-col gap-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          {/* ── Factory Source ──────────────────────────────────────────── */}
          <Field label="Factory Source" icon={<Factory size={13} />} error={errors.factory}>
            <div ref={factoryRef} className="relative">
              <div
                className={`flex items-center h-12 border rounded-2xl px-4 gap-2 bg-white cursor-text transition-all ${ringError(errors.factory)}`}
                onClick={() => {
                  setFactoryOpen(true);
                  inputRef.current?.focus();
                }}
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={selectedFactory ? selectedFactory.name : search}
                  placeholder="Search or create factory…"
                  className="flex-1 outline-none text-[14px] text-gray-700 bg-transparent placeholder:text-gray-300 min-w-0"
                  onFocus={() => setFactoryOpen(true)}
                  onChange={(e) => {
                    const v = e.target.value;
                    setSelectedFactory(null);
                    setFactoryName(v);
                    setSearch(v);
                    setFactoryOpen(true);
                  }}
                />
                {selectedFactory && (
                  <Check size={14} className="text-emerald-500 flex-shrink-0" />
                )}
                <ChevronDown
                  size={14}
                  className={`text-gray-400 flex-shrink-0 transition-transform ${factoryOpen ? "rotate-180" : ""}`}
                />
              </div>

              {/* Dropdown panel */}
              {factoryOpen && (
                <div className="absolute top-[calc(100%+6px)] left-0 right-0 bg-white border border-gray-200 rounded-2xl shadow-xl z-[999] overflow-hidden"
                  style={{ maxHeight: 220, overflowY: "auto" }}
                >
                  {filteredFactories.length === 0 && !search.trim() && (
                    <p className="px-4 py-3 text-[13px] text-gray-300">No factories found</p>
                  )}
                  {filteredFactories.map((factory, i) => (
                    <button
                      key={factory.id}
                      type="button"
                      onClick={() => {
                        setSelectedFactory(factory);
                        setFactoryName("");
                        setSearch(factory.name);
                        setFactoryOpen(false);
                      }}
                      className={`w-full px-4 py-3 text-left text-[13px] font-medium flex items-center justify-between gap-2 transition-colors
                        ${selectedFactory?.id === factory.id
                          ? "bg-indigo-50 text-indigo-700"
                          : "text-gray-700 hover:bg-indigo-50/60 hover:text-indigo-600"}
                        ${i !== 0 ? "border-t border-gray-50" : ""}
                      `}
                    >
                      <span className="flex items-center gap-2">
                        <Factory size={12} className="text-gray-400" />
                        {factory.name}
                      </span>
                      {selectedFactory?.id === factory.id && (
                        <Check size={13} className="text-indigo-500" />
                      )}
                    </button>
                  ))}
                  {search.trim() && filteredFactories.length === 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedFactory(null);
                        setFactoryName(search);
                        setFactoryOpen(false);
                      }}
                      className="w-full px-4 py-3 text-left text-[13px] font-semibold text-indigo-600 hover:bg-indigo-50 flex items-center gap-2 transition-colors"
                    >
                      <span className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-[11px] font-bold flex-shrink-0">+</span>
                      Create "{search}"
                    </button>
                  )}
                  {search.trim() && filteredFactories.length > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedFactory(null);
                        setFactoryName(search);
                        setFactoryOpen(false);
                      }}
                      className="w-full px-4 py-3 text-left text-[13px] font-semibold text-indigo-600 hover:bg-indigo-50 flex items-center gap-2 border-t border-gray-100 transition-colors"
                    >
                      <span className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-[11px] font-bold flex-shrink-0">+</span>
                      Create "{search}"
                    </button>
                  )}
                </div>
              )}
            </div>
          </Field>

          {/* ── Payment Method ──────────────────────────────────────────── */}
          <Field label="Payment Method" icon={<CreditCard size={13} />} error={errors.payment}>
            <div ref={payRef} className="relative">
              <button
                type="button"
                onClick={() => setPayOpen((p) => !p)}
                className={`w-full h-12 border rounded-2xl px-4 text-[14px] text-gray-700 bg-white flex items-center justify-between gap-2 transition-all ${ringError(errors.payment)}`}
              >
                <span className={paymentMethod ? "text-gray-700" : "text-gray-300"}>
                  {selectedPayLabel}
                </span>
                <ChevronDown
                  size={14}
                  className={`text-gray-400 flex-shrink-0 transition-transform ${payOpen ? "rotate-180" : ""}`}
                />
              </button>

              {/* Dropdown panel */}
              {payOpen && (
                <div className="absolute top-[calc(100%+6px)] left-0 right-0 bg-white border border-gray-200 rounded-2xl shadow-xl z-[999] overflow-hidden">
                  {PAYMENT_OPTIONS.map((opt, i) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => {
                        setPaymentMethod(opt.value);
                        setPayOpen(false);
                      }}
                      className={`w-full px-4 py-3 text-left text-[13px] font-medium flex items-center justify-between gap-2 transition-colors
                        ${paymentMethod === opt.value
                          ? "bg-indigo-50 text-indigo-700"
                          : "text-gray-700 hover:bg-indigo-50/60 hover:text-indigo-600"}
                        ${i !== 0 ? "border-t border-gray-50" : ""}
                      `}
                    >
                      {opt.label}
                      {paymentMethod === opt.value && (
                        <Check size={13} className="text-indigo-500" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </Field>
        </div>

        {/* ── Solid Gold Given ────────────────────────────────────────────── */}
        <Field label="Solid Gold Given (g)" icon={<Coins size={13} />} error={errors.solidGold}>
          <div
            className={`flex items-center h-12 border rounded-2xl overflow-hidden bg-white transition-all ${ringError(errors.solidGold)}`}
          >
            <input
              type="number"
              value={solidGoldGiven || ""}
              onChange={(e) =>
                setSolidGoldGiven(e.target.value === "" ? 0 : Number(e.target.value))
              }
              placeholder="0.000"
              className="flex-1 h-full px-4 outline-none text-[14px] text-gray-700 bg-transparent appearance-none"
            />
            {/* Stylish stepper */}
            <div className="flex flex-col h-full border-l border-gray-100 w-10 flex-shrink-0">
              <button
                type="button"
                onClick={() => setSolidGoldGiven((v) => Number((v + 0.001).toFixed(3)))}
                className="flex-1 flex items-center justify-center hover:bg-indigo-50 hover:text-indigo-600 text-gray-400 transition-colors border-b border-gray-100"
              >
                <ChevronUp size={13} strokeWidth={2.5} />
              </button>
              <button
                type="button"
                onClick={() => setSolidGoldGiven((v) => Math.max(0, Number((v - 0.001).toFixed(3))))}
                className="flex-1 flex items-center justify-center hover:bg-indigo-50 hover:text-indigo-600 text-gray-400 transition-colors"
              >
                <ChevronDown size={13} strokeWidth={2.5} />
              </button>
            </div>
          </div>
        </Field>
      </div>
    </div>
  );
};

export default TransactionCard;
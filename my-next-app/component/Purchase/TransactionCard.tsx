"use client";

import { useRef, useState, useEffect } from "react";
import {
  Factory,
  Store,
  CreditCard,
  Coins,
  ChevronDown,
  ChevronUp,
  Check,
  AlertCircle,
  Loader2,
  ClipboardList,
  Wallet,
  Banknote,
  Scale,
  TrendingUp, 
  TrendingDown 
} from "lucide-react";


interface FactoryItem {
  id: number;
  factory_code?: string;
  retailer_code?: string;
  name: string;
  phone?: string;
  address?: string;
}

interface PaymentType {
  id: number;
  name: string;
}

interface TransactionCardProps {
  isSales?: boolean;
  factories: FactoryItem[];
  factoriesLoading?: boolean;
  factorySearch: string;
  setFactorySearch: React.Dispatch<React.SetStateAction<string>>;
  selectedFactory: FactoryItem | null;
  setSelectedFactory: React.Dispatch<React.SetStateAction<FactoryItem | null>>;
  factoryName: string;
  setFactoryName: React.Dispatch<React.SetStateAction<string>>;
  paymentTypes: PaymentType[];
  paymentTypesLoading?: boolean;
  paymentMethod: string;
  setPaymentMethod: React.Dispatch<React.SetStateAction<string>>;
  solidGoldGiven: number;
  setSolidGoldGiven: React.Dispatch<React.SetStateAction<number>>;
  errors?: { factory?: string; payment?: string; solidGold?: string; totalPayment?: string };
  totalPaymentGiven: number;
setTotalPaymentGiven: React.Dispatch<React.SetStateAction<number>>;
solidGoldBalance:number;
totalPaymentBalance:number;
}

// ── Field wrapper with label + optional error ─────────────────────────────────
const Field = ({
  label,
  icon,
  iconColor = "bg-gray-100 text-gray-400",
  error,
  children,
}: {
  label: string;
  icon: React.ReactNode;
  iconColor?: string;
  error?: string;
  children: React.ReactNode;
}) => (
  <div className="flex flex-col gap-1.5">
    <label className="flex items-center gap-2 text-[13px] font-semibold text-gray-700">
      <span className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${iconColor}`}>
        {icon}
      </span>
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
  isSales = false,
  factories,
  factoriesLoading = false,
  factorySearch,
  setFactorySearch,
  selectedFactory,
  setSelectedFactory,
  factoryName,
  setFactoryName,
  paymentTypes,
  paymentTypesLoading = false,
  paymentMethod,
  setPaymentMethod,
  solidGoldGiven,
  setSolidGoldGiven,
  errors = {},
  setTotalPaymentGiven,
  totalPaymentGiven,
  solidGoldBalance,
  totalPaymentBalance

  
}: TransactionCardProps) => {
  // ── Source labels (Factory vs Retailer) ──────────────────────────────────
  const sourceLabel = isSales ? "Retailer Source" : "Factory Source";
  const sourceNoun = isSales ? "retailer" : "factory";
  const SourceIcon = isSales ? Store : Factory;

  // ── Factory/Retailer dropdown ─────────────────────────────────────────────
  const [factoryOpen, setFactoryOpen] = useState(false);
  const factoryRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // ── Payment dropdown ──────────────────────────────────────────────────────
  const [payOpen, setPayOpen] = useState(false);
  const payRef = useRef<HTMLDivElement>(null);

  const selectedPayLabel =
    paymentTypes.find((o) => String(o.id) === paymentMethod)?.name ?? "Select";

  const filteredFactories = factories;

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
        className="px-5 sm:px-6 py-4 rounded-t-3xl flex items-center gap-3"
        style={{ background: "linear-gradient(120deg, #ffe4d6 0%, #ffd9ec 45%, #e6ddff 100%)" }}
      >
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-400 to-fuchsia-500 flex items-center justify-center shadow-sm flex-shrink-0">
          <ClipboardList size={15} className="text-white" />
        </div>
        <h3 className="text-[15px] font-bold text-gray-800">Transaction Details</h3>
      </div>

      <div className="p-4 sm:p-6 flex flex-col gap-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          {/* ── Factory / Retailer Source ──────────────────────────────────── */}
          <Field label={sourceLabel} icon={<SourceIcon size={11} />} iconColor="bg-blue-100 text-blue-600" error={errors.factory}>
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
                  value={selectedFactory ? selectedFactory.name : factorySearch}
                  placeholder={`Search or create ${sourceNoun}…`}
                  className="flex-1 outline-none text-[14px] text-gray-700 bg-transparent placeholder:text-gray-300 min-w-0"
                  onFocus={() => setFactoryOpen(true)}
                  onChange={(e) => {
                    const v = e.target.value;
                    setSelectedFactory(null);
                    setFactoryName(v);
                    setFactorySearch(v);
                    setFactoryOpen(true);
                  }}
                />
                {factoriesLoading && (
                  <Loader2 size={14} className="text-gray-300 animate-spin flex-shrink-0" />
                )}
                {!factoriesLoading && selectedFactory && (
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
                  style={{ maxHeight: 260, overflowY: "auto" }}
                >
                  {factoriesLoading && (
                    <p className="px-4 py-3 text-[13px] text-gray-300 flex items-center gap-2">
                      <Loader2 size={12} className="animate-spin" />
                      Searching…
                    </p>
                  )}

                  {!factoriesLoading && filteredFactories.length === 0 && !factorySearch.trim() && (
                    <p className="px-4 py-3 text-[13px] text-gray-300">No {sourceNoun}s found</p>
                  )}

                  {!factoriesLoading &&
                    filteredFactories.map((item, i) => {
                      const code = isSales ? item.retailer_code : item.factory_code;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => {
                            setSelectedFactory(item);
                            setFactoryName("");
                            setFactorySearch(item.name);
                            setFactoryOpen(false);
                          }}
                          className={`w-full px-4 py-3 text-left text-[13px] font-medium flex items-center justify-between gap-2 transition-colors
                            ${selectedFactory?.id === item.id
                              ? "bg-indigo-50 text-indigo-700"
                              : "text-gray-700 hover:bg-indigo-50/60 hover:text-indigo-600"}
                            ${i !== 0 ? "border-t border-gray-50" : ""}
                          `}
                        >
                          <span className="flex flex-col items-start gap-0.5 min-w-0">
                            <span className="flex items-center gap-2">
                              <SourceIcon size={12} className="text-gray-400 flex-shrink-0" />
                              {item.name}
                              {code && (
                                <span className="text-[10px] font-semibold text-gray-400 bg-gray-100 rounded-full px-1.5 py-0.5">
                                  {code}
                                </span>
                              )}
                            </span>
                            {item.address && (
                              <span className="text-[11px] text-gray-400 truncate pl-5">
                                {item.address}
                              </span>
                            )}
                          </span>
                          {selectedFactory?.id === item.id && (
                            <Check size={13} className="text-indigo-500 flex-shrink-0" />
                          )}
                        </button>
                      );
                    })}

                  {!factoriesLoading && factorySearch.trim() && filteredFactories.length === 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedFactory(null);
                        setFactoryName(factorySearch);
                        setFactoryOpen(false);
                      }}
                      className="w-full px-4 py-3 text-left text-[13px] font-semibold text-indigo-600 hover:bg-indigo-50 flex items-center gap-2 transition-colors"
                    >
                      <span className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-[11px] font-bold flex-shrink-0">+</span>
                      Create "{factorySearch}"
                    </button>
                  )}

                  {!factoriesLoading && factorySearch.trim() && filteredFactories.length > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedFactory(null);
                        setFactoryName(factorySearch);
                        setFactoryOpen(false);
                      }}
                      className="w-full px-4 py-3 text-left text-[13px] font-semibold text-indigo-600 hover:bg-indigo-50 flex items-center gap-2 border-t border-gray-100 transition-colors"
                    >
                      <span className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-[11px] font-bold flex-shrink-0">+</span>
                      Create "{factorySearch}"
                    </button>
                  )}
                </div>
              )}
            </div>
          </Field>

          {/* ── Payment Method ──────────────────────────────────────────── */}
          <Field label="Payment Method" icon={<CreditCard size={11} />} iconColor="bg-emerald-100 text-emerald-600" error={errors.payment}>
            <div ref={payRef} className="relative">
              <button
                type="button"
                onClick={() => setPayOpen((p) => !p)}
                disabled={paymentTypesLoading}
                className={`w-full h-12 border rounded-2xl px-4 text-[14px] text-gray-700 bg-white flex items-center justify-between gap-2 transition-all disabled:opacity-60 ${ringError(errors.payment)}`}
              >
                <span className={paymentMethod ? "text-gray-700" : "text-gray-300"}>
                  {paymentTypesLoading ? "Loading…" : selectedPayLabel}
                </span>
                {paymentTypesLoading ? (
                  <Loader2 size={14} className="text-gray-300 animate-spin flex-shrink-0" />
                ) : (
                  <ChevronDown
                    size={14}
                    className={`text-gray-400 flex-shrink-0 transition-transform ${payOpen ? "rotate-180" : ""}`}
                  />
                )}
              </button>

              {/* Dropdown panel */}
              {payOpen && !paymentTypesLoading && (
                <div className="absolute top-[calc(100%+6px)] left-0 right-0 bg-white border border-gray-200 rounded-2xl shadow-xl z-[999] overflow-hidden">
                  {paymentTypes.length === 0 && (
                    <p className="px-4 py-3 text-[13px] text-gray-300">No payment methods found</p>
                  )}
                  {paymentTypes.map((opt, i) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => {
                        setPaymentMethod(String(opt.id));
                        setPayOpen(false);
                      }}
                      className={`w-full px-4 py-3 text-left text-[13px] font-medium flex items-center justify-between gap-2 transition-colors
                        ${paymentMethod === String(opt.id)
                          ? "bg-indigo-50 text-indigo-700"
                          : "text-gray-700 hover:bg-indigo-50/60 hover:text-indigo-600"}
                        ${i !== 0 ? "border-t border-gray-50" : ""}
                      `}
                    >
                      {opt.name}
                      {paymentMethod === String(opt.id) && (
                        <Check size={13} className="text-indigo-500" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </Field>
        </div>

{paymentMethod === "2" ? (
  <div className="flex flex-col gap-4">
    {/* ── Account Payment Balance / Excess ── */}
    <div className="rounded-2xl bg-gradient-to-r from-violet-50 to-fuchsia-50/50 border border-violet-100 px-4 py-3 flex items-center justify-between gap-2">
      <div className="flex items-center gap-2.5 min-w-0">
        <span className="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center flex-shrink-0">
          <Wallet size={14} className="text-violet-600" />
        </span>
        <div className="min-w-0 flex flex-col gap-1">
          <span
            className={`inline-flex items-center w-fit gap-1 text-[9.5px] font-bold leading-none px-2 py-1 rounded-full ${
              totalPaymentBalance >= 0
                ? "bg-emerald-100 text-emerald-700"
                : "bg-rose-100 text-rose-700"
            }`}
          >
            {totalPaymentBalance >= 0 ? "PAYMENT BALANCE" : "EXCESS PAYMENT"}
          </span>
          <p className="text-[9.5px] text-gray-400 leading-tight truncate pl-0.5">
            {totalPaymentBalance >= 0 ? "Advance on account" : "Due on account"}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-1.5 flex-shrink-0">
        {totalPaymentBalance >= 0 ? (
          <TrendingUp size={15} className="text-emerald-500" />
        ) : (
          <TrendingDown size={15} className="text-rose-500" />
        )}
        <p className={`text-[18px] font-bold leading-none tabular-nums ${
          totalPaymentBalance >= 0 ? "text-emerald-600" : "text-rose-500"
        }`}>
          ₹{Math.abs(totalPaymentBalance || 0).toLocaleString("en-IN")}
        </p>
      </div>
    </div>

    {/* ── Total Payment Given — editable input ── */}
    <Field
      label="Total Payment Given"
      icon={<Banknote size={11} />}
      iconColor="bg-emerald-100 text-emerald-600"
      error={errors.totalPayment}
    >
      <div className={`flex items-center h-12 border rounded-2xl bg-white transition-all ${ringError(errors.totalPayment)}`}>
        <span className="pl-4 text-[14px] text-gray-400 font-medium">₹</span>
        <input
          type="number"
          value={totalPaymentGiven || ""}
          onChange={(e) =>
            setTotalPaymentGiven(e.target.value === "" ? 0 : Number(e.target.value))
          }
          placeholder="0.00"
          onWheel={(e) => e.currentTarget.blur()}
          className="flex-1 h-full px-2 outline-none text-[14px] text-gray-700 bg-transparent"
        />
      </div>
    </Field>
  </div>
) : (
  <div className="flex flex-col gap-4">
    {/* ── Account Solid Metal Balance / Excess ── */}
    <div className="rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50/50 border border-amber-100 px-4 py-3 flex items-center justify-between gap-2">
      <div className="flex items-center gap-2.5 min-w-0">
        <span className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
          <Scale size={14} className="text-amber-600" />
        </span>
        <div className="min-w-0 flex flex-col gap-1">
          <span
            className={`inline-flex items-center w-fit gap-1 text-[9.5px] font-bold leading-none px-2 py-1 rounded-full ${
              solidGoldBalance >= 0
                ? "bg-emerald-100 text-emerald-700"
                : "bg-rose-100 text-rose-700"
            }`}
          >
            {solidGoldBalance >= 0 ? "METAL BALANCE" : "EXCESS METAL"}
          </span>
          <p className="text-[9.5px] text-gray-400 leading-tight truncate pl-0.5">
            {solidGoldBalance >= 0 ? "Given on account" : "Owed on account"}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-1.5 flex-shrink-0">
        {solidGoldBalance >= 0 ? (
          <TrendingUp size={15} className="text-emerald-500" />
        ) : (
          <TrendingDown size={15} className="text-rose-500" />
        )}
        <p className={`text-[18px] font-bold leading-none tabular-nums ${
          solidGoldBalance >= 0 ? "text-emerald-600" : "text-rose-500"
        }`}>
          {Math.abs(Number(solidGoldBalance || 0)).toFixed(3)}g
        </p>
      </div>
    </div>

    {/* ── Solid Metal Given — editable input with stepper ── */}
    <Field
      label="Solid Metal Given (g)"
      icon={<Coins size={11} />}
      iconColor="bg-amber-100 text-amber-600"
      error={errors.solidGold}
    >
      <div className={`flex items-center h-12 border rounded-2xl overflow-hidden bg-white transition-all ${ringError(errors.solidGold)}`}>
        <input
          type="number"
          value={solidGoldGiven || ""}
          onChange={(e) =>
            setSolidGoldGiven(e.target.value === "" ? 0 : Number(e.target.value))
          }
          onWheel={(e) => e.currentTarget.blur()}
          placeholder="0.000"
          className="flex-1 h-full px-4 outline-none text-[14px] text-gray-700 bg-transparent appearance-none"
        />
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
)}   </div>
    </div>
  );
};

export default TransactionCard;
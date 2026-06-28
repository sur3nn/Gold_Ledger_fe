"use client";
import { useState } from "react";
import {
  Plus, Trash2, CheckCircle2, Package,
  ChevronDown, ChevronUp, AlertCircle,
} from "lucide-react";

// ── Gold Coin SVG ─────────────────────────────────────────────────────────────
const GoldCoinIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className="flex-shrink-0">
    <circle cx="12" cy="12" r="11" fill="url(#goldGradPB)" />
    <circle cx="12" cy="12" r="8.5" fill="none" stroke="#f59e0b" strokeWidth="0.8" opacity="0.5" />
    <text x="12" y="16" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#92400e" fontFamily="serif">₹</text>
    <defs>
      <radialGradient id="goldGradPB" cx="35%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#fde68a" />
        <stop offset="50%" stopColor="#f59e0b" />
        <stop offset="100%" stopColor="#b45309" />
      </radialGradient>
    </defs>
  </svg>
);

// ── Steppers ──────────────────────────────────────────────────────────────────
const StepperBadge = ({ value, onChange }: { value: number; onChange: (v: number) => void }) => (
  <div className="flex items-center border border-indigo-100 rounded-xl overflow-hidden h-10 w-full max-w-[82px] bg-indigo-50/40 shadow-sm">
    <span className="flex-1 text-center text-[13px] font-bold text-indigo-700">+{value}</span>
    <div className="flex flex-col border-l border-indigo-100 h-full">
      <button type="button" onClick={() => onChange(value + 1)} className="flex-1 flex items-center justify-center hover:bg-indigo-100/60 px-1.5 transition-colors">
        <svg width="7" height="5" viewBox="0 0 8 5" fill="#6366f1"><path d="M4 0L8 5H0L4 0Z" /></svg>
      </button>
      <button type="button" onClick={() => onChange(Math.max(0, value - 1))} className="flex-1 flex items-center justify-center hover:bg-indigo-100/60 px-1.5 border-t border-indigo-100 transition-colors">
        <svg width="7" height="5" viewBox="0 0 8 5" fill="#6366f1"><path d="M4 5L0 0H8L4 5Z" /></svg>
      </button>
    </div>
  </div>
);

const PurityStepper = ({ value, onChange }: { value: number; onChange: (v: number) => void }) => (
  <div className="flex items-center border border-amber-200 bg-amber-50 rounded-xl overflow-hidden h-10 w-full max-w-[100px] shadow-sm">
    <span className="flex-1 text-center text-[13px] font-bold text-amber-700 px-1">{value.toFixed(2)}%</span>
    <div className="flex flex-col border-l border-amber-200 h-full">
      <button type="button" onClick={() => onChange(parseFloat((value + 0.01).toFixed(2)))} className="flex-1 flex items-center justify-center hover:bg-amber-100 px-1.5 transition-colors">
        <svg width="7" height="5" viewBox="0 0 8 5" fill="#d97706"><path d="M4 0L8 5H0L4 0Z" /></svg>
      </button>
      <button type="button" onClick={() => onChange(parseFloat(Math.max(0, value - 0.01).toFixed(2)))} className="flex-1 flex items-center justify-center hover:bg-amber-100 px-1.5 border-t border-amber-200 transition-colors">
        <svg width="7" height="5" viewBox="0 0 8 5" fill="#d97706"><path d="M4 5L0 0H8L4 5Z" /></svg>
      </button>
    </div>
  </div>
);

// ── Types ─────────────────────────────────────────────────────────────────────
export interface Product {
  id: number;
  quantity: number;
  metalId: number;
  productName: string;
  itemCode: string | null;
  purity: number;
  carat: number;
  grossWeightBefore: number;
  grossWeightAfter: number;
  factoryWeight: number;
  netWeight: number;
  amount: number;
  done: boolean;
}

interface Metal { id: number; name: string; }

export interface ProductBreakdownProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  metals: Metal[];
  // keys of invalid product ids passed from parent on save attempt
  invalidProductIds?: Set<number>;
}

const inputClass = `h-10 w-full border border-gray-200 rounded-xl px-3 text-[13px] font-medium text-gray-700 bg-white outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100/80 transition-all placeholder:text-gray-300`;
const inputErrorClass = `h-10 w-full border border-red-300 rounded-xl px-3 text-[13px] font-medium text-gray-700 bg-red-50/30 outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100/80 transition-all placeholder:text-red-200 ring-2 ring-red-100`;
const amtInputClass = `h-10 w-full border border-gray-200 rounded-xl px-3 text-[13px] font-medium text-rose-700 bg-rose-100 outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100/80 transition-all placeholder:text-rose-300`;
const amtInputErrorClass = `h-10 w-full border border-red-400 rounded-xl px-3 text-[13px] font-medium text-red-700 bg-red-100 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-all placeholder:text-red-300 ring-2 ring-red-200`;

const FieldLabel = ({ children }: { children: React.ReactNode }) => (
  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">{children}</p>
);

// ── Component ─────────────────────────────────────────────────────────────────
const ProductBreakdown = ({
  products,
  setProducts,
  metals,
  invalidProductIds = new Set(),
}: ProductBreakdownProps) => {
  // Single expanded id — only one open at a time
  const [expandedId, setExpandedId] = useState<number | null>(
    products[0]?.id ?? null   // first product open by default
  );

  const toggleExpand = (id: number) =>
    setExpandedId((prev) => (prev === id ? null : id));

  const updateProduct = (id: number, field: keyof Product, value: unknown) =>
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, [field]: value } : p)));

  const removeProduct = (id: number) => {
    setProducts((prev) => {
      const next = prev.filter((p) => p.id !== id);
      // if removed was expanded, open the last remaining
      if (expandedId === id) {
        setExpandedId(next[next.length - 1]?.id ?? null);
      }
      return next;
    });
  };

  const addProduct = () => {
    const newId = Date.now();
    setProducts((prev) => [
      ...prev,
      {
        id: newId,
        quantity: 1,
        metalId: metals?.[0]?.id ?? 0,
        productName: "",
        itemCode: null,
        purity: 91,
        carat: 22,
        grossWeightBefore: 0,
        grossWeightAfter: 0,
        factoryWeight: 0,
        netWeight: 0,
        amount: 0,
        done: false,
      },
    ]);
    setExpandedId(newId); // always open the newly added one
  };

  const totalAmount = products.reduce((s, p) => s + p.amount, 0);

  return (
    <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm">

      {/* Header */}
      <div
        className="px-5 sm:px-8 py-5 sm:py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100"
        style={{ background: "linear-gradient(110deg, #fdf8f0 0%, #ffffff 50%, #f5f3ff 100%)" }}
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-orange-400 flex items-center justify-center shadow-sm shadow-orange-200 flex-shrink-0">
            <Package size={16} className="text-white" />
          </div>
          <div>
            <h3 className="text-[15px] font-bold text-gray-900 tracking-tight">Products Breakdown</h3>
            <p className="text-[11px] text-gray-400 mt-0.5 font-medium">
              {products.length === 0
                ? "No items added yet"
                : `${products.length} ${products.length === 1 ? "item" : "items"} · ₹${totalAmount.toLocaleString()} total`}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={addProduct}
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white text-[13px] font-semibold px-5 py-2.5 rounded-xl transition-all shadow-md shadow-indigo-200/60 active:scale-[0.98] w-full sm:w-auto"
        >
          <Plus size={14} />
          Add Product
        </button>
      </div>

      {/* Empty state */}
      {products.length === 0 && (
        <div className="flex flex-col items-center justify-center py-14 sm:py-16 gap-4">
          <div className="w-14 h-14 rounded-2xl border-2 border-dashed border-gray-200 flex items-center justify-center bg-gray-50">
            <Package size={22} className="text-gray-300" />
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-gray-400">No products yet</p>
            <p className="text-xs text-gray-300 mt-1">Click Add Product to get started</p>
          </div>
          <button type="button" onClick={addProduct} className="text-xs text-indigo-500 hover:text-indigo-600 font-bold underline underline-offset-2 transition-colors mt-1">
            Add your first product →
          </button>
        </div>
      )}

      {/* Product rows */}
      {products.length > 0 && (
        <div className="flex flex-col">
          {products.map((p, idx) => {
            const isExpanded = expandedId === p.id;
            const isInvalid = invalidProductIds.has(p.id);
            const hasNameError = isInvalid && !p.productName.trim();
            const hasAmountError = isInvalid && !p.amount;
            const hasWeightError = isInvalid && !p.factoryWeight;
            const hasNetWeightError = isInvalid && !p.netWeight;

            return (
              <div
                key={p.id}
                className={`border-b border-gray-50 last:border-b-0 transition-colors ${isInvalid ? "bg-red-50/20" : ""}`}
              >
                {/* Collapsed row */}
                <div
                  className={`px-4 sm:px-8 py-4 flex items-center gap-3 transition-colors ${
                    isExpanded ? "bg-indigo-50/30" : isInvalid ? "bg-red-50/30 hover:bg-red-50/50" : "hover:bg-gray-50/40"
                  }`}
                >
                  {/* Index */}
                  <span className={`w-6 h-6 rounded-full text-[10px] font-bold flex items-center justify-center border flex-shrink-0 ${
                    isInvalid ? "bg-red-50 text-red-500 border-red-200" : "bg-indigo-50 text-indigo-500 border-indigo-100"
                  }`}>
                    {isInvalid ? <AlertCircle size={11} /> : idx + 1}
                  </span>

                  {/* Done badge */}
                  {p.done && (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 border border-emerald-200 bg-emerald-50 rounded-full px-2.5 py-0.5 flex-shrink-0">
                      <CheckCircle2 size={11} /> Done
                    </span>
                  )}

                  {/* Gold coin */}
                  <GoldCoinIcon size={20} />

                  {/* Product name — read-only display */}
                  <div className="flex-1 min-w-0">
                    <p className={`text-[14px] font-semibold truncate ${
                      p.productName ? "text-gray-700" : hasNameError ? "text-red-400" : "text-gray-300"
                    }`}>
                      {p.productName || (hasNameError ? "⚠ Product name required" : "Product Name")}
                    </p>
                  </div>

                  {/* Amount display */}
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <span className="text-[12px] text-gray-400 font-medium">₹</span>
                    <span className={`text-[14px] font-bold tabular-nums ${
                      p.amount ? "text-rose-500" : hasAmountError ? "text-red-400" : "text-gray-300"
                    }`}>
                      {p.amount ? p.amount.toLocaleString() : "0.00"}
                    </span>
                  </div>

                  {/* Expand toggle */}
                  <button
                    type="button"
                    onClick={() => toggleExpand(p.id)}
                    className={`w-8 h-8 flex items-center justify-center rounded-xl transition-all border flex-shrink-0 ${
                      isExpanded
                        ? "bg-indigo-100 text-indigo-600 border-indigo-200"
                        : isInvalid
                        ? "bg-red-50 text-red-400 border-red-200 hover:bg-red-100"
                        : "hover:bg-indigo-50 text-gray-400 hover:text-indigo-500 border-transparent hover:border-indigo-100"
                    }`}
                    title={isExpanded ? "Collapse" : "Expand"}
                  >
                    {isExpanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                  </button>

                  {/* Delete */}
                  <button
                    type="button"
                    onClick={() => removeProduct(p.id)}
                    className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-red-50 text-gray-300 hover:text-red-400 transition-all border border-transparent hover:border-red-100 flex-shrink-0"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                {/* Expanded detail fields */}
                {isExpanded && (
                  <div className="px-4 sm:px-8 pb-6 pt-4 bg-indigo-50/20 border-t border-indigo-100/60">
                    {isInvalid && (
                      <div className="flex items-center gap-2 mb-4 px-3 py-2.5 bg-red-50 border border-red-200 rounded-xl">
                        <AlertCircle size={14} className="text-red-500 flex-shrink-0" />
                        <p className="text-[12px] font-semibold text-red-600">
                          Please fill all required fields before saving.
                        </p>
                      </div>
                    )}
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-x-4 sm:gap-x-5 gap-y-4 sm:gap-y-5">

                      {/* Qty */}
                      <div>
                        <FieldLabel>Qty</FieldLabel>
                        <StepperBadge value={p.quantity} onChange={(v) => updateProduct(p.id, "quantity", v)} />
                      </div>

                      {/* Metal */}
                      <div>
                        <FieldLabel>Metal</FieldLabel>
                        <select
                          value={p.metalId}
                          onChange={(e) => updateProduct(p.id, "metalId", Number(e.target.value))}
                          className={inputClass}
                        >
                          {metals.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
                        </select>
                      </div>

                      {/* Product Name — back inside, wider */}
                      <div className="col-span-2 sm:col-span-1 lg:col-span-2 xl:col-span-1">
                        <FieldLabel>Product Name {hasNameError && <span className="text-red-400 normal-case">*required</span>}</FieldLabel>
                        <input
                          type="text"
                          value={p.productName}
                          placeholder="e.g. Gold Ring"
                          onChange={(e) => updateProduct(p.id, "productName", e.target.value)}
                          className={hasNameError ? inputErrorClass : inputClass}
                        />
                      </div>

                      {/* Gross Weight */}
                      <div>
                        <FieldLabel>Gross Wt. {hasWeightError && <span className="text-red-400 normal-case">*</span>}</FieldLabel>
                        <input
                          type="number"
                          value={p.factoryWeight || ""}
                          placeholder="0.00"
                          onChange={(e) => updateProduct(p.id, "factoryWeight", Number(e.target.value))}
                          className={hasWeightError ? inputErrorClass : inputClass}
                        />
                      </div>

                      {/* Purity */}
                      <div>
                        <FieldLabel>Purity</FieldLabel>
                        <PurityStepper value={p.purity} onChange={(v) => updateProduct(p.id, "purity", v)} />
                      </div>

                      {/* Net Weight */}
                      <div>
                        <FieldLabel>Net Wt. {hasNetWeightError && <span className="text-red-400 normal-case">*</span>}</FieldLabel>
                        <input
                          type="number"
                          value={p.netWeight || ""}
                          placeholder="0.00"
                          onChange={(e) => updateProduct(p.id, "netWeight", Number(e.target.value))}
                          className={hasNetWeightError ? inputErrorClass : inputClass}
                        />
                      </div>

                      {/* Amount */}
                      <div>
                        <FieldLabel>Amount {hasAmountError && <span className="text-red-400 normal-case">*</span>}</FieldLabel>
                        <input
                          type="number"
                          value={p.amount || ""}
                          placeholder="0.00"
                          onChange={(e) => updateProduct(p.id, "amount", Number(e.target.value))}
                          className={hasAmountError ? amtInputErrorClass : amtInputClass}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Footer summary */}
      {products.length > 1 && (
        <div className="px-5 sm:px-8 py-4 border-t border-gray-100 bg-gradient-to-r from-gray-50/80 to-indigo-50/30 flex items-center justify-between gap-3 flex-wrap">
          <p className="text-[12px] text-gray-400 font-semibold">{products.length} products total</p>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-gray-400 font-medium">Grand Total</span>
            <span className="text-[14px] font-bold text-rose-500 tabular-nums bg-rose-50 border border-rose-100 px-3 py-1 rounded-lg">
              ₹{totalAmount.toLocaleString()}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductBreakdown;
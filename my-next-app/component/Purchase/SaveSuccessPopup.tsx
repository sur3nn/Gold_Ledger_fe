"use client";

import { useEffect, useState } from "react";
import { X, Printer, ArrowRight } from "lucide-react";

interface SaveSuccessPopupProps {
  isOpen: boolean;
  isLoading: boolean;
  billNumber: string | null;
  onClose: () => void;
  onNewPurchase: () => void;
}

// ── Animated tick SVG ────────────────────────────────────────────────────────
const AnimatedTick = () => (
  <svg viewBox="0 0 52 52" className="w-14 h-14" fill="none">
    <circle
      cx="26"
      cy="26"
      r="25"
      fill="none"
      stroke="#22c55e"
      strokeWidth="2.5"
      strokeDasharray="157"
      strokeDashoffset="0"
      style={{ animation: "circleIn 0.45s ease-out forwards" }}
    />
    <polyline
      points="14,26 22,34 38,18"
      fill="none"
      stroke="#22c55e"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray="40"
      strokeDashoffset="40"
      style={{ animation: "tickDraw 0.35s ease-out 0.4s forwards" }}
    />
    <style>{`
      @keyframes circleIn {
        from { stroke-dashoffset: 157; opacity: 0; }
        to   { stroke-dashoffset: 0;   opacity: 1; }
      }
      @keyframes tickDraw {
        from { stroke-dashoffset: 40; }
        to   { stroke-dashoffset: 0; }
      }
    `}</style>
  </svg>
);

// ── Spinner ───────────────────────────────────────────────────────────────────
const Spinner = () => (
  <div className="w-14 h-14 flex items-center justify-center">
    <div className="w-12 h-12 rounded-full border-4 border-indigo-100 border-t-indigo-500 animate-spin" />
  </div>
);

// ── Gold coin decorative dots ─────────────────────────────────────────────────
const GoldDot = ({ className }: { className: string }) => (
  <div
    className={`absolute rounded-full opacity-20 ${className}`}
    style={{ background: "radial-gradient(circle, #fbbf24, #f59e0b)" }}
  />
);

// ─── Main Component ───────────────────────────────────────────────────────────
const SaveSuccessPopup = ({
  isOpen,
  isLoading,
  billNumber,
  onClose,
  onNewPurchase,
}: SaveSuccessPopupProps) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // tiny delay so CSS transition fires
      requestAnimationFrame(() => setVisible(true));
    } else {
      setVisible(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    // ── Backdrop ────────────────────────────────────────────────────────────
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{
        background: "rgba(10, 12, 30, 0.55)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        transition: "opacity 0.25s ease",
        opacity: visible ? 1 : 0,
      }}
      onClick={(e) => {
        // close on backdrop click only when not loading
        if (!isLoading && e.target === e.currentTarget) onClose();
      }}
    >
      {/* ── Card ──────────────────────────────────────────────────────────── */}
      <div
        className="relative w-full max-w-sm bg-white rounded-3xl overflow-hidden shadow-2xl"
        style={{
          transform: visible ? "scale(1) translateY(0)" : "scale(0.92) translateY(24px)",
          transition: "transform 0.3s cubic-bezier(0.34,1.56,0.64,1), opacity 0.25s ease",
          opacity: visible ? 1 : 0,
        }}
      >
        {/* decorative gold dots */}
        <GoldDot className="w-28 h-28 -top-10 -right-10" />
        <GoldDot className="w-16 h-16 -bottom-6 -left-6" />

        {/* rainbow top strip */}
        <div
          className="h-1.5 w-full"
          style={{
            background: "linear-gradient(90deg, #6c3ff5, #a855f7, #ec4899, #f97316, #fbbf24)",
          }}
        />

        {/* ── Loading state ──────────────────────────────────────────────── */}
        {isLoading && (
          <div className="flex flex-col items-center px-8 py-12 gap-5">
            <Spinner />
            <div className="text-center">
              <p className="text-[16px] font-bold text-gray-800">Saving Purchase…</p>
              <p className="text-[13px] text-gray-400 mt-1">Please wait while we record your entry</p>
            </div>
            {/* animated progress bar */}
            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{
                  background: "linear-gradient(90deg, #6c3ff5, #a855f7)",
                  animation: "loadBar 1.6s ease-in-out infinite",
                  width: "60%",
                }}
              />
            </div>
            <style>{`
              @keyframes loadBar {
                0%   { transform: translateX(-100%); }
                100% { transform: translateX(280%); }
              }
            `}</style>
          </div>
        )}

        {/* ── Success state ──────────────────────────────────────────────── */}
        {!isLoading && billNumber && (
          <>
            {/* Close button */}
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-700 transition-all z-10"
            >
              <X size={14} />
            </button>

            <div className="flex flex-col items-center px-8 pt-10 pb-8 gap-0">
              {/* Tick animation */}
              <AnimatedTick />

              {/* Title */}
              <p className="text-[18px] font-bold text-gray-900 mt-5 tracking-tight">
                Purchase Saved!
              </p>
              <p className="text-[13px] text-gray-400 mt-1 text-center">
                Your purchase has been recorded successfully
              </p>

              {/* Bill number card */}
              <div
                className="mt-6 w-full rounded-2xl px-5 py-4 flex flex-col items-center gap-1"
                style={{
                  background: "linear-gradient(135deg, #f5f3ff 0%, #fdf8f0 100%)",
                  border: "1.5px dashed #c4b5fd",
                }}
              >
                <p className="text-[11px] font-bold text-indigo-400 uppercase tracking-widest">
                  Bill Number
                </p>
                <p className="text-[28px] font-black text-indigo-700 tracking-tight mt-0.5">
                  {billNumber}
                </p>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  Keep this for your records
                </p>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col gap-2.5 w-full mt-6">
                <button
                  type="button"
                  onClick={onNewPurchase}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-white text-[14px] font-bold transition-opacity hover:opacity-90"
                  style={{
                    background: "linear-gradient(90deg, #6c3ff5 0%, #4f46e5 100%)",
                    boxShadow: "0 4px 16px rgba(108,63,245,0.3)",
                  }}
                >
                  New Purchase
                  <ArrowRight size={15} />
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-gray-600 text-[14px] font-semibold bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  <Printer size={15} />
                  Print Bill
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SaveSuccessPopup;

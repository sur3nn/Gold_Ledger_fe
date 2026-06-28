"use client";

import { useState } from "react";
import ReportsHeader from "./ReportsHeader";
import SalesTab from "./SalesTab";
import PurchaseTab from "./PurchaseTab";
import EntityWiseTab from "./EntityWiseTab";
import OutstandingTab from "./OutstandingTab";

export type TabKey = "sales" | "purchase" | "entitywise" | "outstanding";

const TAB_META: Record<TabKey, { emoji: string; label: string; shortLabel: string }> = {
  sales:       { emoji: "📈", label: "Sales",       shortLabel: "Sales" },
  purchase:    { emoji: "📦", label: "Purchase",    shortLabel: "Buy" },
  entitywise:  { emoji: "🏢", label: "Entity Wise", shortLabel: "Entities" },
  outstanding: { emoji: "⚖️", label: "Outstanding", shortLabel: "Due" },
};

export default function Reports() {
  const [activeTab, setActiveTab] = useState<TabKey>("sales");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const tabs = (Object.keys(TAB_META) as TabKey[]).map((key) => ({
    key,
    ...TAB_META[key],
  }));

  return (
    <div className="min-h-screen">
      <div className="max-w-8xl mx-auto p-3 sm:p-5 lg:p-6 flex flex-col gap-4 sm:gap-5">
        <ReportsHeader
          fromDate={fromDate}
          toDate={toDate}
          onFromDateChange={setFromDate}
          onToDateChange={setToDate}
        />

        {/* Tab Bar */}
        <div className="bg-white border border-gray-100 rounded-2xl p-1 flex gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 sm:py-2.5 text-xs sm:text-sm font-medium rounded-xl transition-all ${
                activeTab === tab.key
                  ? "bg-gray-900 text-white shadow-sm font-semibold"
                  : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
              }`}
            >
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="inline sm:hidden">{tab.shortLabel}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="animate-in fade-in duration-200">
          {activeTab === "sales"       && <SalesTab />}
          {activeTab === "purchase"    && <PurchaseTab />}
          {activeTab === "entitywise"  && <EntityWiseTab />}
          {activeTab === "outstanding" && <OutstandingTab />}
        </div>
      </div>
    </div>
  );
}

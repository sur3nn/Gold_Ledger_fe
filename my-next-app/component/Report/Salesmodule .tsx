"use client";
import { useState } from "react";
import SecondaryTabBar, { SecondaryTabKey } from "./Secondarytabbar";
import SalesReportTab from "./Salesreporttab";
import EntitySummary from "./Entitysummary";
import OutstandingSummary from "./Outstandingsummary";


interface SalesModuleProps {
  fromDate: string;
  toDate: string;
}

/**
 * Sales workspace. Everything rendered here is retailer-facing —
 * factory data is never imported or shown in this module.
 */
export default function SalesModule({ fromDate, toDate }: SalesModuleProps) {
  const [tab, setTab] = useState<SecondaryTabKey>("report");

  return (
    <div className="flex flex-col gap-4">
      <SecondaryTabBar
        active={tab}
        onChange={setTab}
        accent="sales"
        entityLabel="Entity"
      />

      {tab === "report" && <SalesReportTab fromDate={fromDate} toDate={toDate} />}
      {tab === "entity" && (
        <EntitySummary type="retailer" fromDate={fromDate} toDate={toDate} />
      )}
      {/* {tab === "outstanding" && (
        <OutstandingSummary type="retailer" fromDate={fromDate} toDate={toDate} />
      )} */}
    </div>
  );
}
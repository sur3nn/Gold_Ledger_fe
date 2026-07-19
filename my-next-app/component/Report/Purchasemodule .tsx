"use client";
import { useState } from "react";
import SecondaryTabBar, { SecondaryTabKey } from "./Secondarytabbar";
import PurchaseReportTab from "./Purchasereporttab";
import EntitySummary from "./Entitysummary";
import OutstandingSummary from "./Outstandingsummary";


interface PurchaseModuleProps {
  fromDate: string;
  toDate: string;
}

/**
 * Purchase workspace. Everything rendered here is factory-facing —
 * retailer data is never imported or shown in this module.
 */
export default function PurchaseModule({ fromDate, toDate }: PurchaseModuleProps) {
  const [tab, setTab] = useState<SecondaryTabKey>("report");

  return (
    <div className="flex flex-col gap-4">
      <SecondaryTabBar
        active={tab}
        onChange={setTab}
        accent="purchase"
        entityLabel="Entity"
      />

      {tab === "report" && <PurchaseReportTab fromDate={fromDate} toDate={toDate} />}
      {tab === "entity" && (
        <EntitySummary type="factory" fromDate={fromDate} toDate={toDate} />
      )}
      {/* {tab === "outstanding" && (
        <OutstandingSummary type="factory" fromDate={fromDate} toDate={toDate} />
      )} */}
    </div>
  );
}
"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import TransactionHistory, { Transaction } from "./TransactionHistory";
import CreditSummary from "./CreditSummary";
import { AppDispatch, RootState } from "@/Redux/Store/store";
import { getCreditManagementHistory, getStockOverviewAction, transcationCreditManagementHistory } from "@/Redux/Action/action";
import { useDebounce } from "./utils/UseDbounce";

const LIMIT = 10;

export default function CreditManagement() {
  const dispatch = useDispatch<AppDispatch>();

  const [search, setSearch] = useState("");
  const [offset, setOffset] = useState(0);

  // ← added: which party's bill (if any) is currently drilled into
  const [selectedParty, setSelectedParty] = useState<{
    id: number | string;
    name: string;
  } | null>(null);

  const debouncedSearch = useDebounce(search, 400);

  const {
    totalCreditGiven,
    totalCreditTaken,
    totalCashGiven,
    totalCashTaken,

    creditManagementData,
    creditManagementLoad,
    creditManagementError,
    creditManagementTotal,

    // ← added: adjust these field names to match your actual reducer
    transcationData,
    transcationLoad,
  } = useSelector((state: RootState) => state.purchase);

  useEffect(() => {
    setOffset(0);
  }, [debouncedSearch]);

  useEffect(() => {
    dispatch(
      getCreditManagementHistory({
        search: debouncedSearch,
        limit: LIMIT,
        offset,
      })
    );
  }, [dispatch, debouncedSearch, offset]);

  const transactions: Transaction[] = creditManagementData.map((item: any) => ({
    id: item.id,
    partyId: item.party_Id, // ← adjust to your actual party id field
    date: item.bill_date,
    partyName: item.party_name,
    type: item.type,
    goldQty: item.gold_qty,
    amount: item.amount,
    notes: item.remarks,
    recordedAt: item.recorded_date,
  }));

  // ← added: click a row -> fetch that party's stock overview
  const handleRowClick = (t: Transaction) => {
    console.log("data",t);
    
    const isRetailer = t.type !== "Factory"; // Factory -> 1, Retailer/other -> 2
    dispatch(
      transcationCreditManagementHistory({
        typeId: isRetailer ? 2 : 1,
        factory_retailer_id: t.partyId,
      })
    );
    setSelectedParty({ id: t.partyId ?? t.id, name: t.partyName });
  };

  const handleClearParty = () => {
    setSelectedParty(null);
  };
  console.log("stockOverviewData",transcationData);
  
  // ← added: switch which totals feed the summary cards
  const summaryTotals = selectedParty
    ? {
        totalCreditGiven: transcationData?.total_credit_given ?? 0,
        totalCreditTaken: transcationData?.total_credit_taken ?? 0,
        totalCashGiven: transcationData?.totalCashGiven ?? 0,
        totalCashTaken: transcationData?.totalCashTaken ?? 0,
        loading: transcationLoad,
      }
    : {
        totalCreditGiven,
        totalCreditTaken,
        totalCashGiven,
        totalCashTaken,
        loading: creditManagementLoad,
      };

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50/30 via-white to-white">
      <div className="p-6 flex flex-col gap-5">
        <CreditSummary
          totalCreditGiven={summaryTotals.totalCreditGiven}
          totalCreditTaken={summaryTotals.totalCreditTaken}
          totalCashGiven={summaryTotals.totalCashGiven}
          totalCashTaken={summaryTotals.totalCashTaken}
          loading={summaryTotals.loading}
          selectedPartyName={selectedParty?.name ?? null}
          onClearParty={handleClearParty}
        />
        <TransactionHistory
          transactions={transactions}
          loading={creditManagementLoad}
          error={creditManagementError}
          search={search}
          onSearchChange={setSearch}
          total={creditManagementTotal ?? 0}
          limit={LIMIT}
          offset={offset}
          onPageChange={setOffset}
          onRowClick={handleRowClick}
          selectedId={selectedParty?.id ?? null}
        />
      </div>
    </div>
  );
}
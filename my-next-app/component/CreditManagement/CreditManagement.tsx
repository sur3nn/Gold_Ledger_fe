"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import TransactionHistory from "./TransactionHistory";
import CreditSummary from "./CreditSummary";
import { AppDispatch, RootState } from "@/Redux/Store/store";
import { getCreditManagementHistory } from "@/Redux/Action/action";
import { useDebounce } from "./utils/UseDbounce";


const LIMIT = 10;

export default function CreditManagement() {
  const dispatch = useDispatch<AppDispatch>();

  const [search, setSearch] = useState("");
  const [offset, setOffset] = useState(0);

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
  } = useSelector((state: RootState) => state.purchase);

  // Reset to page 1 whenever the debounced search term changes
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

 

  const transactions = creditManagementData.map((item: any) => ({
    id: item.id,
    date: item.bill_date,
    partyName: item.party_name,
    type: item.type,
    goldQty: item.gold_qty,
    amount: item.amount,
    notes: item.remarks,
    recordedAt: item.recorded_date,
  }));

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50/30 via-white to-white">
      <div className="p-6 flex flex-col gap-5">
        <CreditSummary
          totalCreditGiven={totalCreditGiven}
          totalCreditTaken={totalCreditTaken}
          totalCashGiven={totalCashGiven}
          totalCashTaken={totalCashTaken}
          loading={creditManagementLoad}
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
        />
      </div>
    </div>
  );
}
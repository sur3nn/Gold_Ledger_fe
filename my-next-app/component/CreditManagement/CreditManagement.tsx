"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import TransactionHistory from "./TransactionHistory";
import CreditSummary from "./CreditSummary";
import { AppDispatch, RootState } from "@/Redux/Store/store";
import { getCreditManagementHistory } from "@/Redux/Action/action";

export default function CreditManagement() {
  const dispatch = useDispatch<AppDispatch>();
  const { totalCreditGiven, totalCreditTaken, totalCashGiven, totalCashTaken, transactions, loading, error } =useSelector((state: RootState) => state.purchase);
 const mockTransactions = [
  {
    id: 1,
    date: "01-06-2026",
    partyName: "ABC Jewelry Works",
    type: "Credit Given",
    goldQty: "10.500 g",
    amount: "₹52,500",
    notes: "Advance for June order",
    recordedAt: "01-06-2026 09:15 AM",
  },
  {
    id: 2,
    date: "03-06-2026",
    partyName: "XYZ Retail",
    type: "Credit Taken",
    goldQty: "5.250 g",
    amount: "₹26,250",
    notes: "Raw material purchase",
    recordedAt: "03-06-2026 11:40 AM",
  },
  {
    id: 3,
    date: "07-06-2026",
    partyName: "Primary Gold Factory",
    type: "Credit Given",
    goldQty: "22.000 g",
    amount: "₹1,10,000",
    notes: "Bulk supply – Ref #PGF-204",
    recordedAt: "07-06-2026 02:10 PM",
  },
  {
    id: 4,
    date: "10-06-2026",
    partyName: "Modern Casting Unit",
    type: "Credit Taken",
    goldQty: "8.750 g",
    amount: "₹43,750",
    notes: "",
    recordedAt: "10-06-2026 10:05 AM",
  },
  {
    id: 5,
    date: "14-06-2026",
    partyName: "Prestige Ornaments",
    type: "Credit Given",
    goldQty: "15.000 g",
    amount: "₹75,000",
    notes: "Festival stock advance",
    recordedAt: "14-06-2026 03:30 PM",
  },
  {
    id: 6,
    date: "18-06-2026",
    partyName: "Royal Gold Works",
    type: "Credit Taken",
    goldQty: "3.500 g",
    amount: "₹17,500",
    notes: "Partial payment pending",
    recordedAt: "18-06-2026 09:55 AM",
  },
  {
    id: 7,
    date: "21-06-2026",
    partyName: "ABC Jewelry Works",
    type: "Credit Taken",
    goldQty: "6.000 g",
    amount: "₹30,000",
    notes: "Returned excess stock",
    recordedAt: "21-06-2026 04:20 PM",
  },
  {
    id: 8,
    date: "25-06-2026",
    partyName: "XYZ Retail",
    type: "Credit Given",
    goldQty: "12.250 g",
    amount: "₹61,250",
    notes: "",
    recordedAt: "25-06-2026 01:00 PM",
  },
];
  useEffect(() => {
    dispatch(getCreditManagementHistory());
  }, [dispatch]);

  return (
    <div className="p-6 flex flex-col gap-0">
      <CreditSummary
        totalCreditGiven={totalCreditGiven}
        totalCreditTaken={totalCreditTaken}
        totalCashGiven={totalCashGiven}
        totalCashTaken={totalCashTaken}
        loading={loading}
      />
      <TransactionHistory
        transactions={mockTransactions}
        loading={loading}
        error={error}
      />
    </div>
  );
}



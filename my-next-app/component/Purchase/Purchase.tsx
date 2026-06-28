"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";


import PurchaseHeader from "./PurchaseHeader";
import TransactionCard from "./TransactionCard";
import StockOverview from "./StockOverview";
import ProductBreakdown from "./ProductBreakdown";
import RecordedHistory from "./RecordedHistory";
import FooterAction from "./FooterAction";
import SaveSuccessPopup from "./SaveSuccessPopup";
import { savePurchaseAction } from "@/Redux/Action/action";

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

const Purchase = ({ isSales }: { isSales: boolean }) => {
  const dispatch = useDispatch<any>();

  // ── Redux — pull loading + saved bill number ──────────────────────────────
  const { savePurchaseLoad, savePurchaseData } = useSelector(
    (state: any) => state.purchase   // adjust slice key to yours
  );
  const billNumber: string | null = savePurchaseData?.bill_no ?? savePurchaseData?.billNumber ?? null;
  console.log("bill",savePurchaseData);
  

  // ── Popup visibility ──────────────────────────────────────────────────────
  const [popupOpen, setPopupOpen] = useState(false);

  // ── Form state ────────────────────────────────────────────────────────────
  const [selectedFactory, setSelectedFactory] = useState<{ id: number; name: string } | null>(null);
  const [factoryName, setFactoryName] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("1");
  const [solidGoldGiven, setSolidGoldGiven] = useState<number>(0);

  const factoryList = [
    { id: 1, name: "Factory A" },
    { id: 2, name: "Factory B" },
    { id: 3, name: "Factory C" },
  ];
  const metalList = [{ id: 1, name: "Gold" }];

  const [products, setProducts] = useState<Product[]>([
    {
      id: 1,
      quantity: 1,
      metalId: metalList?.[0]?.id ?? 0,
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

  // ── Save handler ──────────────────────────────────────────────────────────
  const handleSave = async () => {
    const payload = {
      factory_id: selectedFactory?.id ?? 0,
      factory_name: selectedFactory ? null : factoryName || null,
      payment_method_id: Number(paymentMethod),
      solid_gold_given: Number(solidGoldGiven),
      retailer_id: null,
      product_type_id: 1,
      products: products.map((p) => ({
        quantity: p.quantity,
        metal_id: p.metalId,
        product_name: p.productName,
        item_code: null,
        purity: p.purity,
        carat: p.carat,
        gross_weight_before: p.grossWeightBefore,
        gross_weight_after: p.grossWeightAfter,
        factory_weight: p.factoryWeight,
        net_weight: p.netWeight,
        amount: p.amount,
      })),
    };

    setPopupOpen(true);               // open popup immediately — shows loader
    await dispatch(savePurchaseAction(payload));
    // popup stays open; Redux state update re-renders with billNumber
  };

  // ── New purchase — reset everything ───────────────────────────────────────
  const handleNewPurchase = () => {
    setPopupOpen(false);
    setSelectedFactory(null);
    setFactoryName("");
    setPaymentMethod("1");
    setSolidGoldGiven(0);
    setProducts([
      {
        id: Date.now(),
        quantity: 1,
        metalId: metalList?.[0]?.id ?? 0,
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
  };

  return (
    <>
      {/* ── Success / Loading Popup ─────────────────────────────────────── */}
      <SaveSuccessPopup
        isOpen={popupOpen}
        isLoading={savePurchaseLoad}
        billNumber={billNumber}
        onClose={() => setPopupOpen(false)}
        onNewPurchase={handleNewPurchase}
      />

      {/* ── Page ────────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-3 px-3 sm:px-4 lg:px-6 max-w-screen-8xl mx-auto w-full">
        <PurchaseHeader isSales={isSales} />

        <div className="bg-[#f7f7f8] rounded-3xl py-4 sm:py-6 px-3 sm:px-6 flex flex-col gap-4 sm:gap-5">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] xl:grid-cols-[1fr_320px] gap-4 sm:gap-5">
            <TransactionCard
              factories={factoryList}
              selectedFactory={selectedFactory}
              setSelectedFactory={setSelectedFactory}
              factoryName={factoryName}
              setFactoryName={setFactoryName}
              paymentMethod={paymentMethod}
              setPaymentMethod={setPaymentMethod}
              solidGoldGiven={solidGoldGiven}
              setSolidGoldGiven={setSolidGoldGiven}
            />
            <StockOverview />
          </div>

          <ProductBreakdown
            products={products}
            setProducts={setProducts}
            metals={metalList}
          />

          <FooterAction onSave={handleSave} loading={savePurchaseLoad} />
        </div>

        <div className="bg-[#f7f7f8] rounded-3xl p-3 sm:p-6">
          <RecordedHistory />
        </div>
      </div>
    </>
  );
};

export default Purchase;

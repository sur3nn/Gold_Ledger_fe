"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import PurchaseHeader from "./PurchaseHeader";
import TransactionCard from "./TransactionCard";
import StockOverview from "./StockOverview";
import ProductBreakdown from "./ProductBreakdown";
import RecordedHistory from "./RecordedHistory";
import FooterAction from "./FooterAction";
import SaveSuccessPopup from "./SaveSuccessPopup";
import { savePurchaseAction, getFactoryListAction, getPaymentTypesAction, getMetalListAction, getBillingHistoryAction, getStockOverviewAction, getRetailerListAction } from "@/Redux/Action/action";
import toast from "react-hot-toast";

export interface Product {
  id: number;
  quantity: number;
  metalId: number;
  productName: string;
   category: string; 
  itemCode: string | null;
  purity: number;
  carat: number;
  grossWeightBefore: number;
  grossWeightAfter: number;
  factoryWeight: number;
  figureWeight: number;
  netWeight: number;
  amount: number;
  done: boolean;
}

const Purchase = ({ isSales }: { isSales: boolean }) => {
  const dispatch = useDispatch<any>();

  // ── Redux — purchase save ───────────────────────────────────────────────
  const { savePurchaseLoad, savePurchaseData, factoryListLoad, factoryListData, paymentTypesData, paymentTypesLoad, metalListLoad, metalListData,billingHistoryLoad,billingHistoryData,billingHistoryTotal ,stockOverviewData,stockOverviewLoad ,retailerListLoad, retailerListData} = useSelector(
    (state: any) => state.purchase   // adjust slice key to yours
  );
  const billNumber: string | null = savePurchaseData?.bill_no ?? savePurchaseData?.billNumber ?? null;


  const factoryList = factoryListData ?? [];
const [totalPaymentGiven, setTotalPaymentGiven] = useState<number>(0);
  const [factorySearch, setFactorySearch] = useState("");
  const [metalSearch, setMetalSearch] = useState("");

  // initial load
 useEffect(() => {
  if (isSales) {
    dispatch(getRetailerListAction({ search: "" }));
  } else {
    dispatch(getFactoryListAction({ search: "" }));
  }
  dispatch(getPaymentTypesAction());
  dispatch(getMetalListAction({ search: "" }));
}, [isSales, dispatch]);
  const paymentTypes = paymentTypesData ?? [];
  // debounced search-as-you-type
  const [sourceSearch, setSourceSearch] = useState(""); // renamed from factorySearch conceptually; keep factorySearch if you don't want to rename

useEffect(() => {
  const timer = setTimeout(() => {
    if (isSales) {
      dispatch(getRetailerListAction({ search: factorySearch }));
    } else {
      dispatch(getFactoryListAction({ search: factorySearch }));
    }
  }, 300);
  return () => clearTimeout(timer);
}, [factorySearch, isSales, dispatch]);
  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(getMetalListAction({ search: metalSearch }));
    }, 300);
    return () => clearTimeout(timer);
  }, [metalSearch, dispatch]);
  // ── Popup visibility ──────────────────────────────────────────────────────
  const [popupOpen, setPopupOpen] = useState(false);

  // ── Validation state ─────────────────────────────────────────────────────
  const [formErrors, setFormErrors] = useState<{
    factory?: string;
    payment?: string;
    solidGold?: string;
    totalPayment?: string;
  }>({});
  const [invalidProductIds, setInvalidProductIds] = useState<Set<number>>(new Set());
const [historySearch, setHistorySearch] = useState("");
const [historyPage, setHistoryPage] = useState(1);
const historyLimit = 5;
const billingHistory = billingHistoryData ?? [];

useEffect(() => {
  const timer = setTimeout(() => {
    dispatch(getBillingHistoryAction({
      typeId: isSales ? 2 : 1,
      search: historySearch,
      limit: historyLimit,
      offset: (historyPage - 1) * historyLimit,
    }));
  }, 300);
  return () => clearTimeout(timer);
}, [historySearch, historyPage, isSales, dispatch]);

// reset to page 1 on new search
useEffect(() => {
  setHistoryPage(1);
}, [historySearch]);
const sourceList = isSales ? (retailerListData ?? []) : (factoryListData ?? []);
const sourceLoading = isSales ? retailerListLoad : factoryListLoad;
  // ── Form state ────────────────────────────────────────────────────────────
  const [selectedFactory, setSelectedFactory] = useState<{ id: number; name: string } | null>(null);
  const [factoryName, setFactoryName] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("1");
  const [solidGoldGiven, setSolidGoldGiven] = useState<number>(0);
   const [solidGoldBalance, setSolidGoldBalance] = useState<number>(0);
   const [totalPaymentBalance,setTotalPaymentBalance] = useState<number>(0);

  const metalList = metalListData?.length ? metalListData : [];

useEffect(() => {
  if(!selectedFactory?.id) return;
  dispatch(
    getStockOverviewAction({
      typeId: isSales ? 2 : 1,
      factory_retailer_id: selectedFactory?.id,
    })
  );
}, [isSales, selectedFactory, dispatch]);
useEffect(() => {
  if (!stockOverviewData) return;
   const weightBalance =
  stockOverviewData?.total_gold_given - stockOverviewData?.total_net_weight;

const amountBalance =
  stockOverviewData?.total_amount_given - stockOverviewData?.total_amount;

const roundedWeightBalance = Math.round(weightBalance * 1000) / 1000; // 3 decimals
const roundedAmountBalance = Math.round(amountBalance * 100) / 100;   // 2 decimals

setSolidGoldBalance(roundedWeightBalance);
setTotalPaymentBalance(roundedAmountBalance);
}, [stockOverviewData]);

  const [products, setProducts] = useState<Product[]>([
    {
      id: 1,
      quantity: 1,
      metalId: metalList?.[0]?.id ?? 0,
      productName: "",
       category: "", 
      itemCode: null,
      purity: 91,
      carat: 22,
      grossWeightBefore: 0,
      grossWeightAfter: 0,
      factoryWeight: 0,
      figureWeight: 0,
      netWeight: 0,
      amount: 0,
      done: false,
    },
  ]);

  // ── Validation ────────────────────────────────────────────────────────────
  const isCashPayment = paymentMethod === "2";

  const validateForm = () => {
    const errors: {
      factory?: string;
      payment?: string;
      solidGold?: string;
      totalPayment?: string;
    } = {};
    let valid = true;

    if (!selectedFactory && !factoryName.trim()) {
      errors.factory = `Please select or enter a ${isSales ? "retailer" : "factory"}`;
      valid = false;
    }

    if (!paymentMethod) {
      errors.payment = "Please select a payment method";
      valid = false;
    }

    if (isCashPayment) {
      if ( totalPaymentGiven < 0) {
        errors.totalPayment = "Total payment given should not be Negative(-)";
        valid = false;
      }
    } else {
      if (solidGoldGiven < 0) {
        errors.solidGold = "Solid gold given should not be Negative(-)";
        valid = false;
      }
    }

    const badProductIds = new Set<number>();
    if (products.length === 0) {
      valid = false;
    }
    products.forEach((p) => {
      let bad = false;
      if (!p.productName.trim()) bad = true;
      if (!p.factoryWeight) bad = true;
      if (!p.netWeight) bad = true;
      if (isCashPayment && !p.amount) bad = true;
      if (bad) {
        badProductIds.add(p.id);
        valid = false;
      }
    });

    return { valid, errors, badProductIds };
  };

  // ── Save handler ──────────────────────────────────────────────────────────
const handleSave = async () => {
  const { valid, errors, badProductIds } = validateForm();
  setFormErrors(errors);
  setInvalidProductIds(badProductIds);

  if (!valid) {
    toast.error("Required fields are incomplete. Please fill all required fields before saving.");
    return;
  }

  const payload = {
    factory_id: isSales ? null : (selectedFactory?.id ?? 0),
    factory_name: isSales ? null : (selectedFactory ? null : factoryName || null),
    retailer_id: isSales ? (selectedFactory?.id ?? 0) : null,
    retailer_name: isSales ? (selectedFactory ? null : factoryName || null) : null,
    payment_method_id: Number(paymentMethod),
     solid_gold_given:
    Number(paymentMethod) === 2 ? 0 : Number(solidGoldGiven),
  total_amount_given:
    Number(paymentMethod) === 2 ? Number(totalPaymentGiven) : 0,
    product_type_id:  isSales ? 2 : 1,
    status_id: 1,
    products: products.map((p) => ({
      quantity: p.quantity,
      metal_id: p.metalId,
      product_name: p.productName,
      category: p.category, 
      item_code: p.itemCode ?? null,
      purity: p.purity,
      carat: p.carat,
      gross_weight_before: p.grossWeightBefore,
      gross_weight_after: p.grossWeightAfter,
      factory_weight: p.factoryWeight,
      net_weight: p.netWeight,
      amount: p.amount,
      fig_weight: p.figureWeight,
    })),
  };

  
  const res = await dispatch(savePurchaseAction(payload));
  if (savePurchaseAction.fulfilled.match(res)) {
    setPopupOpen(true);
    setHistoryPage(1);
    await dispatch(getBillingHistoryAction({
      typeId: isSales ? 2 : 1,
      search: "",
      limit: historyLimit,
      offset: 0,
    }));
   await dispatch(
  getStockOverviewAction({
    typeId: isSales ? 2 : 1,
    factory_retailer_id: selectedFactory?.id,
  })
);
  }else {
  toast.error(
    res.payload?.message || "Billing creation failed."
  );
}
};

  // ── New purchase — reset everything ───────────────────────────────────────
  const handleNewPurchase = () => {
    setPopupOpen(false);
    setSelectedFactory(null);
    setFactoryName("");
    setPaymentMethod("1");
    setSolidGoldGiven(0);
    setTotalPaymentGiven(0);
    setFormErrors({});
    setInvalidProductIds(new Set());
    setProducts([
      {
        id: Date.now(),
        quantity: 1,
        metalId: metalList?.[0]?.id ?? 0,
        productName: "",
         category: "", 
        itemCode: null,
        purity: 91,
        carat: 22,
        grossWeightBefore: 0,
        grossWeightAfter: 0,
        factoryWeight: 0,
        figureWeight: 0,
        netWeight: 0,
        amount: 0,
        done: false,
      },
    ]);
  };

  return (
    <>
      <SaveSuccessPopup
        isOpen={popupOpen}
        isLoading={savePurchaseLoad}
        billNumber={billNumber}
        onClose={() => setPopupOpen(false)}
        onNewPurchase={handleNewPurchase}
      />

      <div className="min-h-screen bg-gradient-to-b from-violet-50/30 via-white to-white">
      <div className="flex flex-col gap-3 px-3 sm:px-4 lg:px-6 max-w-screen-8xl mx-auto w-full py-4 sm:py-6">
        <PurchaseHeader isSales={isSales} />

        <div className="bg-gradient-to-br from-violet-50/40 via-white to-orange-50/30 rounded-3xl py-4 sm:py-6 px-3 sm:px-6 flex flex-col gap-4 sm:gap-5 border border-violet-100/50">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] xl:grid-cols-[1fr_400px] gap-4 sm:gap-5">
            <TransactionCard
  isSales={isSales}
  factories={sourceList}
  factoriesLoading={sourceLoading}
  factorySearch={factorySearch}
  setFactorySearch={setFactorySearch}
  selectedFactory={selectedFactory}
  setSelectedFactory={setSelectedFactory}
  factoryName={factoryName}
  setFactoryName={setFactoryName}
  paymentTypes={paymentTypes}
  paymentTypesLoading={paymentTypesLoad}
  paymentMethod={paymentMethod}
  setPaymentMethod={setPaymentMethod}
  solidGoldGiven={solidGoldGiven}
  setSolidGoldGiven={setSolidGoldGiven}
   totalPaymentGiven={totalPaymentGiven}
  setTotalPaymentGiven={setTotalPaymentGiven}
  solidGoldBalance={solidGoldBalance}
  totalPaymentBalance={totalPaymentBalance}
  errors={formErrors}
/>
          <StockOverview data={stockOverviewData} loading={stockOverviewLoad} />
          </div>

          <ProductBreakdown
            products={products}
            setProducts={setProducts}
            metals={metalList}
            metalsLoading={metalListLoad}
            metalSearch={metalSearch}
            setMetalSearch={setMetalSearch}
            paymentMethod={paymentMethod}
            invalidProductIds={invalidProductIds}

          />

          <FooterAction onSave={handleSave} loading={savePurchaseLoad} />
        </div>

        <div className="bg-gradient-to-br from-violet-50/40 via-white to-orange-50/30 rounded-3xl p-3 sm:p-6 border border-violet-100/50">
<RecordedHistory
  data={billingHistory}
  loading={billingHistoryLoad}
  search={historySearch}
  setSearch={setHistorySearch}
  page={historyPage}
  setPage={setHistoryPage}
  limit={historyLimit}
  total={billingHistoryTotal}
/>
        </div>
      </div>
      </div>
    </>
  );
};

export default Purchase;
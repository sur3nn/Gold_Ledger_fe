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
import InvoicePrintModal, { InvoiceData } from "./Invoiceprintmodal";
import {
  savePurchaseAction,
  getFactoryListAction,
  getPaymentTypesAction,
  getMetalListAction,
  getBillingHistoryAction,
  getStockOverviewAction,
  getRetailerListAction,
  // NOTE: assumed action — wire this up to whatever endpoint returns the
  // line items for a single bill (the shape you shared: billing_id,
  // bill_no, product_name, amount, net_weight, ... per row). Rename/adjust
  // to match your actual action file.
  getBillDetailsAction,
} from "@/Redux/Action/action";
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

// ── GST configuration ─────────────────────────────────────────────────────
// Default rates used to seed the (now user-editable) GST / SGST fields.
// GST + SGST are calculated independently on the products' total amount,
// but the user can override either value directly in the UI.
const GST_RATE_PERCENT = 1.5;
const SGST_RATE_PERCENT = 1.5;

const round2 = (n: number) => Math.round((n + Number.EPSILON) * 100) / 100;

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

  // ── Box weight fields (Sales Transaction Details) ───────────────────────
  const [beforeBoxWeight, setBeforeBoxWeight] = useState<number>(0);
  const [afterBoxWeight, setAfterBoxWeight] = useState<number>(0);

  // ── Whether GST / SGST fields should be shown at all — driven by
  // sessionStorage key "isgst" ("true" / "false"). Read once on mount. ────
  const [showGst, setShowGst] = useState(false);
  useEffect(() => {
    if (typeof window !== "undefined") {
      setShowGst(sessionStorage.getItem("isgst") === "true");
    }
  }, []);

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

// ── Print / invoice modal ────────────────────────────────────────────────
const [printingBillId, setPrintingBillId] = useState<number | null>(null);
const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);
const [invoiceLoading, setInvoiceLoading] = useState(false);
const [invoiceData, setInvoiceData] = useState<InvoiceData | null>(null);

const handlePrintBill = async (billId: number) => {
  setPrintingBillId(billId);
  setInvoiceModalOpen(true);
  setInvoiceLoading(true);
  try {
    const res = await dispatch(getBillDetailsAction({ billId }));
    if (getBillDetailsAction.fulfilled.match(res)) {
      // API shape: { success: true, data: { bill_no, bill_date, party_name,
      // gst, sgst, total_amt_with_gst, products: [...], ... } }
      const data = res.payload?.data ?? res.payload;
      const items = data?.products ?? [];
      setInvoiceData({
        bill_no: data?.bill_no ?? String(billId),
        bill_date: data?.bill_date,
        customer: data?.party_name,
        sale_type: "intra",
        total_amount: data?.total_amount,
        gst: data?.gst,
        sgst: data?.sgst,
        total_amt_with_gst: data?.total_amt_with_gst,
        items,
      });
    } else {
      toast.error("Failed to load bill details for printing.");
      setInvoiceModalOpen(false);
    }
  } catch {
    toast.error("Failed to load bill details for printing.");
    setInvoiceModalOpen(false);
  } finally {
    setPrintingBillId(null);
    setInvoiceLoading(false);
  }
};

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
   // Balance is unknown (null) until a factory/retailer is selected — it is
   // NOT zero by default, since zero would misleadingly read as "no balance".
   const [solidGoldBalance, setSolidGoldBalance] = useState<number | null>(null);
   const [totalPaymentBalance,setTotalPaymentBalance] = useState<number | null>(null);

  const metalList = metalListData?.length ? metalListData : [];

useEffect(() => {
  if (!selectedFactory?.id) {
    // No factory/retailer selected — balance is unknown, not zero.
    setSolidGoldBalance(null);
    setTotalPaymentBalance(null);
    return;
  }
  dispatch(
    getStockOverviewAction({
      typeId: isSales ? 2 : 1,
      factory_retailer_id: selectedFactory?.id,
    })
  );
}, [isSales, selectedFactory, dispatch]);
useEffect(() => {
  if (!stockOverviewData || !selectedFactory?.id) return;
   const weightBalance =
  stockOverviewData?.total_gold_given - stockOverviewData?.total_net_weight;

const amountBalance =
  stockOverviewData?.total_amount_given - stockOverviewData?.total_amount;

const roundedWeightBalance = Math.round(weightBalance * 1000) / 1000; // 3 decimals
const roundedAmountBalance = Math.round(amountBalance * 100) / 100;   // 2 decimals

setSolidGoldBalance(roundedWeightBalance);
setTotalPaymentBalance(roundedAmountBalance);
}, [stockOverviewData, selectedFactory]);

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

  // ── GST calculations — GST / SGST are now user-editable *percentage
  // rates* (defaulting to GST_RATE_PERCENT / SGST_RATE_PERCENT). The user
  // types the % in the Transaction Details panel (see TransactionCard),
  // and the amounts below are derived from that rate × the products total.
  const totalAmount = products.reduce((sum, p) => sum + (p.amount || 0), 0);

  const [gstPercent, setGstPercent] = useState<number>(GST_RATE_PERCENT);
  const [sgstPercent, setSgstPercent] = useState<number>(SGST_RATE_PERCENT);

  const gstAmount = round2((totalAmount * gstPercent) / 100);
  const sgstAmount = round2((totalAmount * sgstPercent) / 100);

  // When GST is turned off (sessionStorage "isgst" !== "true") it's excluded
  // from the grand total as well as from display.
  const totalAmountWithGST = round2(
    totalAmount + (showGst ? gstAmount + sgstAmount : 0)
  );

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
    box_weight_before: Number(beforeBoxWeight) || 0,
    box_weight_after: Number(afterBoxWeight) || 0,
    gst: showGst ? Number(gstAmount.toFixed(2)) : 0,
    sgst: showGst ? Number(sgstAmount.toFixed(2)) : 0,
    gst_percent: showGst ? gstPercent : 0,
    sgst_percent: showGst ? sgstPercent : 0,
    total_amt_with_gst: Number(totalAmountWithGST.toFixed(2)),
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

     // Reset factory/retailer selection back to nothing selected
  setSelectedFactory(null);
  setFactoryName("");
  setFactorySearch("");

  // Reset balances — unknown/null again until a new factory/retailer is
  // picked, not zero (zero would misleadingly imply a known nil balance).
  setSolidGoldBalance(null);
  setTotalPaymentBalance(null);

    setPopupOpen(true);
    setHistoryPage(1);
    await dispatch(getBillingHistoryAction({
      typeId: isSales ? 2 : 1,
      search: "",
      limit: historyLimit,
      offset: 0,
    }));
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
    setFactorySearch("");
    setPaymentMethod("1");
    setSolidGoldGiven(0);
    setTotalPaymentGiven(0);
    setSolidGoldBalance(null);
    setTotalPaymentBalance(null);
    setBeforeBoxWeight(0);
    setAfterBoxWeight(0);
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
  beforeBoxWeight={beforeBoxWeight}
  setBeforeBoxWeight={setBeforeBoxWeight}
  afterBoxWeight={afterBoxWeight}
  setAfterBoxWeight={setAfterBoxWeight}
  gstPercent={gstPercent}
  setGstPercent={setGstPercent}
  sgstPercent={sgstPercent}
  setSgstPercent={setSgstPercent}
  showGst={showGst}
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
            totalAmount={totalAmount}
            gstAmount={gstAmount}
            sgstAmount={sgstAmount}
            gstPercent={gstPercent}
            sgstPercent={sgstPercent}
            totalAmountWithGST={totalAmountWithGST}
            showGst={showGst}
            isSales={isSales}
          />

          <FooterAction onSave={handleSave} loading={savePurchaseLoad} isSales={isSales} />
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
  onPrint={handlePrintBill}
  printingBillId={printingBillId}
/>
        </div>
      </div>
      </div>

      <InvoicePrintModal
        isOpen={invoiceModalOpen}
        onClose={() => setInvoiceModalOpen(false)}
        invoice={invoiceData}
        loading={invoiceLoading}
      />
    </>
  );
};

export default Purchase;
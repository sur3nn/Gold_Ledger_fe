import { createSlice, PayloadAction } from "@reduxjs/toolkit";


import { getBillingHistoryAction, getCreditManagementHistory, getDashboardSummary, getEntityWiseReport, getFactoryListAction, getMetalListAction, getOutstandingReport, getPaymentTypesAction, getPurchaseReport, getRetailerListAction, getSalesReport, getSalesReportTab, getStockOverviewAction, loginAction, savePurchaseAction } from "../Action/action";

// ─── Initial State ────────────────────────────────────────────────────────────
const initialState: any = {

  // API status flags
  savePurchaseLoad: false,
  savePurchaseData: null,
  creditManagementLoad: false,
  creditManagementData: [],
  reportLoad: false,
  reportData: null,
  factoryListLoad: false,
  factoryListData: null,
  paymentTypesLoad: false,
  paymentTypesData: null,
  metalListData: null,
  metalListLoad: false,
  billingHistoryLoad: false,
  billingHistoryData: null,
  billingHistoryTotal: 0,
  stockOverviewLoad: false,
  stockOverviewData: null,
  retailerListLoad: false,
  retailerListData: null,
  creditManagementTotal: 0,

  totalCreditGiven: 0,
  totalCreditTaken: 0,
  totalCashGiven: 0,
  totalCashTaken: 0,

  creditManagementError: null,
  dashboardTotals: null,
  dashboardHighestProduct: null,
  dashboardRecentTransactions: [],
  dashboardLoad: false,
  dashboardError: null,

  outstandingShopOwners: [],
  outstandingFactories: [],
  outstandingLoad: false,
  outstandingError: null,

  entityWiseShopOwners: [],
  entityWiseFactories: [],
  entityWiseLoad: false,
  entityWiseError: null,

   salesReportData: null,
  salesReportLoad: false,
  salesReportError: null,
 
  // Reports: Purchase
  purchaseReportData: null,
  purchaseReportLoad: false,
  purchaseReportError: null,
 
  //
  loginLoad : false,
  loginData : null

};

// ─── Slice ────────────────────────────────────────────────────────────────────
const purchaseSlice = createSlice({
  name: "purchase",
  initialState,
  reducers: {
    // sync reducer for DummyDataClear-style pattern from example
    clearPurchaseData: (state: any) => {
      state.savePurchaseData = null;
      state.purchaseDetail = null;
    },
  },
  extraReducers: (builder) => {
    builder



      // ── Save Purchase ───────────────────────────────────────────────────
      .addCase(savePurchaseAction.pending, (state: any) => {
        state.savePurchaseLoad = true;
      })
      .addCase(
        savePurchaseAction.fulfilled,
        (state: any, action: PayloadAction<any>) => {
          state.savePurchaseLoad = false;
          console.log("bill2", action.payload);

          state.savePurchaseData = action.payload;

        }
      )
      .addCase(
        savePurchaseAction.rejected,
        (state: any, action: PayloadAction<any>) => {
          state.savePurchaseLoad = false;
        }
      )


      //credit management
      .addCase(getCreditManagementHistory.pending, (state) => {
        state.creditManagementLoad = true;
      })

      .addCase(getCreditManagementHistory.fulfilled, (state, action) => {
        state.creditManagementLoad = false;

        state.creditManagementData = action.payload.data;
        state.creditManagementTotal = action.payload.total;

        state.totalCreditGiven =
          action.payload.summary.total_credit_given;

        state.totalCreditTaken =
          action.payload.summary.total_credit_taken;

        state.totalCashGiven =
          action.payload.summary.total_credit_given_amount;

        state.totalCashTaken =
          action.payload.summary.total_credit_taken_amount;
      })

      .addCase(getCreditManagementHistory.rejected, (state) => {
        state.creditManagementLoad = false;
      })

      //Report
      .addCase(getSalesReport.pending, (state: any) => {
        state.reportLoad = true;
      })
      .addCase(
        getSalesReport.fulfilled,
        (state: any, action: PayloadAction<any>) => {
          state.reportLoad = false;
          state.reportData = action.payload?.data;

        }
      )
      .addCase(
        getSalesReport.rejected,
        (state: any, action: PayloadAction<any>) => {
          state.reportLoad = false;
        }
      )
      //factory List
      .addCase(getFactoryListAction.pending, (state: any) => {
        state.factoryListLoad = true;
      })
      .addCase(
        getFactoryListAction.fulfilled,
        (state: any, action: PayloadAction<any>) => {
          state.factoryListLoad = false;
          state.factoryListData = action.payload?.data;

        }
      )
      .addCase(
        getFactoryListAction.rejected,
        (state: any, action: PayloadAction<any>) => {
          state.factoryListLoad = false;
        }
      )
      //payment type
      .addCase(getPaymentTypesAction.pending, (state: any) => {
        state.paymentTypesLoad = true;
      })
      .addCase(
        getPaymentTypesAction.fulfilled,
        (state: any, action: PayloadAction<any>) => {
          state.paymentTypesLoad = false;
          state.paymentTypesData = action.payload?.data;
        }
      )
      .addCase(
        getPaymentTypesAction.rejected,
        (state: any, action: PayloadAction<any>) => {
          state.paymentTypesLoad = false;
        }
      )

      //metal product breakdown
      .addCase(getMetalListAction.pending, (state: any) => {
        state.metalListLoad = true;
      })
      .addCase(
        getMetalListAction.fulfilled,
        (state: any, action: PayloadAction<any>) => {
          state.metalListLoad = false;
          state.metalListData = action.payload?.data;
        }
      )
      .addCase(
        getMetalListAction.rejected,
        (state: any, action: PayloadAction<any>) => {
          state.metalListLoad = false;
        }
      )
      //billing recorded history
      .addCase(getBillingHistoryAction.pending, (state: any) => {
        state.billingHistoryLoad = true;
      })
      .addCase(
        getBillingHistoryAction.fulfilled,
        (state: any, action: PayloadAction<any>) => {
          state.billingHistoryLoad = false;
          state.billingHistoryData = action.payload?.data;
          state.billingHistoryTotal = action.payload?.total ?? 0;
        }
      )
      .addCase(getBillingHistoryAction.rejected, (state: any) => {
        state.billingHistoryLoad = false;
      })
      //stack over view dashboard
      .addCase(getStockOverviewAction.pending, (state: any) => {
        state.stockOverviewLoad = true;
      })
      .addCase(
        getStockOverviewAction.fulfilled,
        (state: any, action: PayloadAction<any>) => {
          state.stockOverviewLoad = false;
          state.stockOverviewData = action.payload?.data;
        }
      )
      .addCase(getStockOverviewAction.rejected, (state: any) => {
        state.stockOverviewLoad = false;
      })

      //retailer list
      .addCase(getRetailerListAction.pending, (state: any) => {
        state.retailerListLoad = true;
      })
      .addCase(
        getRetailerListAction.fulfilled,
        (state: any, action: PayloadAction<any>) => {
          state.retailerListLoad = false;
          state.retailerListData = action.payload?.data;
        }
      )
      .addCase(getRetailerListAction.rejected, (state: any) => {
        state.retailerListLoad = false;
      })
      //dashboard
      .addCase(getDashboardSummary.pending, (state: any) => {
        state.dashboardLoad = true;
        state.dashboardError = null;
      })
      .addCase(getDashboardSummary.fulfilled, (state: any, action: PayloadAction<any>) => {
        state.dashboardLoad = false;
        state.dashboardTotals = action.payload.totals;
        state.dashboardHighestProduct = action.payload.highestProduct;
        state.dashboardRecentTransactions = action.payload.recentTransactions;
      })
      .addCase(getDashboardSummary.rejected, (state: any, action: PayloadAction<any>) => {
        state.dashboardLoad = false;
        state.dashboardError = action.payload as string;
      })
      // report
      builder
      .addCase(getSalesReportTab.pending, (state) => {
        state.salesReportLoad = true;
        state.salesReportError = null;
      })
      .addCase(getSalesReportTab.fulfilled, (state, action: any) => {
        state.salesReportLoad = false;
        state.salesReportData = action.payload;
      })
      .addCase(getSalesReportTab.rejected, (state, action: any) => {
        state.salesReportLoad = false;
        state.salesReportError = action.payload as string;
      });
 
    // ── Reports: Purchase ──
    builder
      .addCase(getPurchaseReport.pending, (state) => {
        state.purchaseReportLoad = true;
        state.purchaseReportError = null;
      })
      .addCase(getPurchaseReport.fulfilled, (state, action: any) => {
        state.purchaseReportLoad = false;
        state.purchaseReportData = action.payload;
      })
      .addCase(getPurchaseReport.rejected, (state, action: any) => {
        state.purchaseReportLoad = false;
        state.purchaseReportError = action.payload as string;
      });
 
    // ── Reports: Outstanding ──
    builder
      .addCase(getOutstandingReport.pending, (state) => {
        state.outstandingLoad = true;
        state.outstandingError = null;
      })
      .addCase(getOutstandingReport.fulfilled, (state, action: any) => {
        state.outstandingLoad = false;
        state.outstandingShopOwners = action.payload.shopOwners;
        state.outstandingFactories = action.payload.factories;
      })
      .addCase(getOutstandingReport.rejected, (state, action: any) => {
        state.outstandingLoad = false;
        state.outstandingError = action.payload as string;
      });
 
    // ── Reports: Entity Wise ──
    builder
      .addCase(getEntityWiseReport.pending, (state) => {
        state.entityWiseLoad = true;
        state.entityWiseError = null;
      })
      .addCase(getEntityWiseReport.fulfilled, (state, action: any) => {
        state.entityWiseLoad = false;
        state.entityWiseShopOwners = action.payload.shopOwners;
        state.entityWiseFactories = action.payload.factories;
      })
      .addCase(getEntityWiseReport.rejected, (state, action: any) => {
        state.entityWiseLoad = false;
        state.entityWiseError = action.payload as string;
      });
      builder.addCase(loginAction.pending, (state) => {
    state.loginLoad = true;
    
  })

  .addCase(loginAction.fulfilled, (state, action: any) => {
    state.loginLoad = false;
    state.loginData = action.payload;
  })

  .addCase(loginAction.rejected, (state, action: any) => {
    state.loginLoad = false;
  });

  },
});

export const { clearPurchaseData } = purchaseSlice.actions;
export default purchaseSlice.reducer;
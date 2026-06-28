import { createSlice, PayloadAction } from "@reduxjs/toolkit";


import { getCreditManagementHistory, getSalesReport, savePurchaseAction } from "../Action/action";

// ─── Initial State ────────────────────────────────────────────────────────────
const initialState: any = {

  // API status flags
  savePurchaseLoad: false,
  savePurchaseData: null,
  creditManagementLoad: false,
creditManagementData: null,
reportLoad: false,
reportData: null
//   updatePurchaseLoad: false,
//   getPurchaseHistoryLoad: false,
//   getPurchaseByIdLoad: false,
//   deletePurchaseLoad: false,
//   getFactoryListLoad: false,

//   // API response data
//   savePurchaseData: null,
//   purchaseHistory: null,
//   purchaseDetail: null,
//   factoryList: null,

//   // UI state
//   status: "idle",
//   error: null,
//   successMessage: null,
 // lastSavedBillId: null,
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
          console.log("bill2",action.payload);
          
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
    .addCase(getCreditManagementHistory.pending, (state: any) => {
        state.creditManagementLoad = true;
      })
      .addCase(
        getCreditManagementHistory.fulfilled,
        (state: any, action: PayloadAction<any>) => {
          state.creditManagementLoad = false;
          state.creditManagementData = action.payload?.data;
          
        }
      )
      .addCase(
        getCreditManagementHistory.rejected,
        (state: any, action: PayloadAction<any>) => {
          state.creditManagementLoad = false;
        }
      )

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

    //   // ── Update Purchase ─────────────────────────────────────────────────
    //   .addCase(updatePurchaseAction.pending, (state: any) => {
    //     state.updatePurchaseLoad = true;
    //     state.status = "loading";
    //     state.error = null;
    //     state.successMessage = null;
    //   })
    //   .addCase(
    //     updatePurchaseAction.fulfilled,
    //     (state: any, action: PayloadAction<any>) => {
    //       state.updatePurchaseLoad = false;
    //       state.status = "succeeded";
    //       state.successMessage =
    //         action.payload?.message ?? "Purchase updated successfully!";
    //     }
    //   )
    //   .addCase(
    //     updatePurchaseAction.rejected,
    //     (state: any, action: PayloadAction<any>) => {
    //       state.updatePurchaseLoad = false;
    //       state.status = "failed";
    //       state.error = action.payload ?? "Failed to update purchase";
    //     }
    //   )

    //   // ── Get Purchase History ────────────────────────────────────────────
    //   .addCase(getPurchaseHistoryAction.pending, (state: any) => {
    //     state.getPurchaseHistoryLoad = true;
    //   })
    //   .addCase(
    //     getPurchaseHistoryAction.fulfilled,
    //     (state: any, action: PayloadAction<any>) => {
    //       state.getPurchaseHistoryLoad = false;
    //       state.purchaseHistory = action.payload?.dataResponse?.data;
    //     }
    //   )
    //   .addCase(getPurchaseHistoryAction.rejected, (state: any) => {
    //     state.getPurchaseHistoryLoad = false;
    //   })

    //   // ── Get Purchase By ID ──────────────────────────────────────────────
    //   .addCase(getPurchaseByIdAction.pending, (state: any) => {
    //     state.getPurchaseByIdLoad = true;
    //   })
    //   .addCase(
    //     getPurchaseByIdAction.fulfilled,
    //     (state: any, action: PayloadAction<any>) => {
    //       state.getPurchaseByIdLoad = false;
    //       state.purchaseDetail = action.payload?.dataResponse?.data;
    //     }
    //   )
    //   .addCase(getPurchaseByIdAction.rejected, (state: any) => {
    //     state.getPurchaseByIdLoad = false;
    //   })

    //   // ── Delete Purchase ─────────────────────────────────────────────────
    //   .addCase(deletePurchaseAction.pending, (state: any) => {
    //     state.deletePurchaseLoad = true;
    //   })
    //   .addCase(deletePurchaseAction.fulfilled, (state: any) => {
    //     state.deletePurchaseLoad = false;
    //   })
    //   .addCase(deletePurchaseAction.rejected, (state: any) => {
    //     state.deletePurchaseLoad = false;
    //   })

    //   // ── Get Factory List ────────────────────────────────────────────────
    //   .addCase(getFactoryListAction.pending, (state: any) => {
    //     state.getFactoryListLoad = true;
    //   })
    //   .addCase(
    //     getFactoryListAction.fulfilled,
    //     (state: any, action: PayloadAction<any>) => {
    //       state.getFactoryListLoad = false;
    //       state.factoryList = action.payload?.dataResponse?.data;
    //     }
    //   )
    //   .addCase(getFactoryListAction.rejected, (state: any) => {
    //     state.getFactoryListLoad = false;
    //   });
  },
});

export const { clearPurchaseData } = purchaseSlice.actions;
export default purchaseSlice.reducer;
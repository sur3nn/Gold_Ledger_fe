import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosFile } from "../http/Axios/axios";

// ─── Save Purchase ─────────────────────────────────────────────────────────────
export const savePurchaseAction: any = createAsyncThunk(
  "savePurchaseAction",
  async (payload: any) => {
    console.log("payload",payload);
    
    const response: any = await axiosFile.savePurchase(payload);
    console.log("response",response);
    return response;
  }
);

//
export const getCreditManagementHistory: any = createAsyncThunk(
  "getCreditManagementHistory",
  async (payload: any) => {
    console.log("payload",payload);
    
    const response: any = await axiosFile.creditManagement(payload);
    return response;
  }
);

export const getSalesReport: any = createAsyncThunk(
  "getSalesReport",
  async (payload: any) => {
    console.log("payload",payload);
    
    const response: any = await axiosFile.report(payload);
    return response;
  }
);

export const getFactoryListAction: any = createAsyncThunk(
  "getFactoryListAction",
  async (payload: any) => {
    console.log("payload",payload);
    
    const response: any = await axiosFile.factorlyList(payload);
    return response;
  }
);

export const getPaymentTypesAction: any = createAsyncThunk(
  "getPaymentTypesAction",
  async () => {
    const response: any = await axiosFile.paymentTypesList();
    return response;
  }
);
export const getMetalListAction: any = createAsyncThunk(
  "getMetalListAction",
  async (payload: any) => {
    const response: any = await axiosFile.metalList(payload);
    return response;
  }
);
export const getBillingHistoryAction: any = createAsyncThunk(
  "getBillingHistoryAction",
  async (payload: any) => {
    const response: any = await axiosFile.billingHistoryList(payload);
    return response;
  }
);
export const getStockOverviewAction: any = createAsyncThunk(
  "getStockOverviewAction",
  async (payload: any) => {
    const response: any = await axiosFile.stockOverview(payload);
    return response;
  }
);
export const getRetailerListAction: any = createAsyncThunk(
  "getRetailerListAction",
  async (payload: any) => {
    const response: any = await axiosFile.retailerList(payload);
    return response;
  }
);

//dashboard
export const getDashboardSummary = createAsyncThunk(
  "purchase/getDashboardSummary",
  async (_: void, thunkAPI) => {
    try {
      const data = await axiosFile.dashboardSummary();
      return data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err?.response?.data?.error || "Failed to fetch dashboard summary"
      );
    }
  }
);

//report
export const getSalesReportTab = createAsyncThunk(
  "purchase/getSalesReportTab",
  async (payload: { fromDate?: string; toDate?: string } = {}, thunkAPI) => {
    try {
      return await axiosFile.salesReport(payload);
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err?.response?.data?.error || "Failed to fetch sales report");
    }
  }
);
 
export const getPurchaseReport = createAsyncThunk(
  "purchase/getPurchaseReport",
  async (payload: { fromDate?: string; toDate?: string } = {}, thunkAPI) => {
    try {
      return await axiosFile.purchaseReport(payload);
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err?.response?.data?.error || "Failed to fetch purchase report");
    }
  }
);
 
// export const getOutstandingReport = createAsyncThunk(
//   "purchase/getOutstandingReport",
//   async (payload: { fromDate?: string; toDate?: string } = {}, thunkAPI) => {
//     try {
//       return await axiosFile.outstandingReport(payload);
//     } catch (err: any) {
//       return thunkAPI.rejectWithValue(err?.response?.data?.error || "Failed to fetch outstanding report");
//     }
//   }
// );

export const getOutstandingReport = createAsyncThunk(
  "purchase/getOutstandingReport",
  async (payload: { fromDate?: string; toDate?: string; typeId?: number } = {}, thunkAPI) => {
    try {
      return await axiosFile.outstandingReport(payload);
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err?.response?.data?.error || "Failed to fetch outstanding report");
    }
  }
);
 
// export const getEntityWiseReport = createAsyncThunk(
//   "purchase/getEntityWiseReport",
//   async (payload: { fromDate?: string; toDate?: string } = {}, thunkAPI) => {
//     try {
//       return await axiosFile.entityWiseReport(payload);
//     } catch (err: any) {
//       return thunkAPI.rejectWithValue(err?.response?.data?.error || "Failed to fetch entity-wise report");
//     }
//   }
// );

export const getEntityWiseReport = createAsyncThunk(
  "purchase/getEntityWiseReport",
  async (payload: { fromDate?: string; toDate?: string; typeId?: number } = {}, thunkAPI) => {
    try {
      return await axiosFile.entityWiseReport(payload);
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err?.response?.data?.error || "Failed to fetch entity-wise report");
    }
  }
);


export const loginAction = createAsyncThunk(
  "loginAction",
  async (payload: any, thunkAPI) => {
    try {
      const response = await axiosFile.login(payload);
      return response; // Important
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err?.response?.data?.error || "Login Failed"
      );
    }
  }
);


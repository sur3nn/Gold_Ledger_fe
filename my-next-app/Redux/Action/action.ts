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


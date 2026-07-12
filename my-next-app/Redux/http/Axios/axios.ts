import { log } from "node:console";
import { http } from "../Http/http";

// ─── All Purchase API calls live here ────────────────────────────────────────
// Pattern mirrors the example: axiosFile object with async methods

const axiosFile = {

//login
async login(payload: {
  user_name: string;
  password: string;
}) {
  const response = await http.post("/api/login", payload);
  return response;
},
  // POST /api/purchase/save
  async savePurchase(payload: any) {
    const response = await http.post("/api/home/create-billing", payload);
    console.log("response2",response);
    
    return response?.data;
  },
//getCreditManagementHistory
  async creditManagement(payload: { search?: string; limit?: number; offset?: number }) {
  const response = await http.get("/api/credit", {
    params: {
      search: payload?.search ?? "",
      limit: payload?.limit ?? 10,
      offset: payload?.offset ?? 0,
    },
  });
  return response?.data;
},
    async report(payload: any) {
    const response = await http.post("/api/report", payload);
    return response?.data;
  },
  async factorlyList(payload: { search?: string }) {
  const response = await http.get("/api/factory", {
    params: { search: payload?.search ?? "" },
  });
  return response?.data;
},
async paymentTypesList() {
  const response = await http.get("/api/home/paymentTypes");
  return response?.data;
},
async metalList(payload: { search?: string }) {
  const response = await http.get("/api/home/metal", {
    params: { search: payload?.search ?? "" },
  });
  return response?.data;
},

  // PUT /api/purchase/:billId
  async updatePurchase(payload: any) {
    const response = await http.put(
      `/api/purchase/${payload.billId}`,
      payload.data
    );
    return response?.data;
  },

  // GET /api/purchase/history
  async getPurchaseHistory(payload?: { search?: any; page?: any }) {
    const response = await http.get("/api/purchase/history", {
      params: {
        search: payload?.search ?? "",
        page: payload?.page ?? 1,
      },
    });
    return response?.data;
  },

  // GET /api/purchase/:billId
  async getPurchaseById(billId: any) {
    const response = await http.get(`/api/purchase/${billId}`);
    return response?.data;
  },

  // DELETE /api/purchase/:billId
  async deletePurchase(billId: any) {
    const response = await http.delete(`/api/purchase/${billId}`);
    return response?.data;
  },

  // GET /api/factory/list
  async getFactoryList() {
    const response = await http.get("/api/factory/list");
    return response?.data;
  },
 async billingHistoryList(payload: any) {
  const response = await http.get("/api/home/billing-history", {
    params: {
      typeId: payload?.typeId,
      search: payload?.search,
      limit: payload?.limit,
      offset: payload?.offset,
    },
  });
  return response?.data;
},
async stockOverview(payload: any) {
  const response = await http.get("/api/home/stock-overview", {
    params: { typeId: payload?.typeId },
  });
  return response?.data;
},
async retailerList(payload: any) {
  const response = await http.get("/api/retailer", {
    params: { search: payload?.search },
  });
  return response?.data;
},
//dashboard
async dashboardSummary() {
  const response = await http.get("/api/dashboard");
  return response?.data;
},
//report

async salesReport(payload: { fromDate?: string; toDate?: string }) {
  const response = await http.get("/api/reports/sales", {
    params: { from: payload?.fromDate || undefined, to: payload?.toDate || undefined },
  });
  return response?.data;
},
 
async purchaseReport(payload: { fromDate?: string; toDate?: string }) {
  const response = await http.get("/api/reports/purchase", {
    params: { from: payload?.fromDate || undefined, to: payload?.toDate || undefined },
  });
  return response?.data;
},
 
async outstandingReport(payload: { fromDate?: string; toDate?: string }) {
  const response = await http.get("/api/reports/outstanding", {
    params: { from: payload?.fromDate || undefined, to: payload?.toDate || undefined },
  });
  return response?.data;
},
 
async entityWiseReport(payload: { fromDate?: string; toDate?: string }) {
  const response = await http.get("/api/reports/entity-wise", {
    params: { from: payload?.fromDate || undefined, to: payload?.toDate || undefined },
  });
  return response?.data;
},
};


export { axiosFile };
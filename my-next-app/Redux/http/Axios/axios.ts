import { log } from "node:console";
import { http } from "../Http/http";

// ─── All Purchase API calls live here ────────────────────────────────────────
// Pattern mirrors the example: axiosFile object with async methods

const axiosFile = {

  // POST /api/purchase/save
  async savePurchase(payload: any) {
    const response = await http.post("/api/home/create-billing", payload);
    console.log("response2",response);
    
    return response?.data;
  },
//getCreditManagementHistory
    async creditManagement(payload: any) {
    const response = await http.post("/api/credit", payload);
    return response?.data;
  },
    async report(payload: any) {
    const response = await http.post("/api/report", payload);
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
};

export { axiosFile };
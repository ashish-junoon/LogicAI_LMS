import api from "./api.js";

// ========================================
// *KYC Related API's
// ========================================


// cibil check
export const CreditReport = async (req) => {
    try {
        const response = await api.post("/CreditReport/CrifCreditReport_pdf", req);
        return response.data;
    } catch (error) {
        console.error("CreditReport:", error.response?.data || error.message);
        throw error;
    }
}

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

export const CrifAuthQuestionnaireReport = async (req) => {
    try {
        const response = await api.post("/CreditReport/CrifAuthQuestionnaireReport_pdf", req);
        return response.data;
    } catch (error) {
        console.error("CrifAuthQuestionnaireReport:", error.response?.data || error.message);
        throw error;
    }
}




export const BSA_FlowRun = async (req) => {
    try {
        const response = await api.post("/AccountAggrator/BSA_FlowRun", req);
        return response.data;
    } catch (error) {
        console.error("BSA_FlowRun:", error.response?.data || error.message);
        throw error;
    }
}

export const BSA_FlowGet = async (req) => {
    try {
        const response = await api.post("/AccountAggrator/BSA_FlowGet", req);
        return response.data;
    } catch (error) {
        console.error("BSA_FlowGet:", error.response?.data || error.message);
        throw error;
    }
}

export const BSA_FlowStatus = async (req) => {
    try {
        const response = await api.post("/AccountAggrator/BSA_FlowStatus", req);
        return response.data;
    } catch (error) {
        console.error("BSA_FlowStatus:", error.response?.data || error.message);
        throw error;
    }
}

export const BSA_FlowResult = async (req) => {
    try {
        const response = await api.post("/AccountAggrator/BSA_FlowResult", req);
        return response.data;
    } catch (error) {
        console.error("BSA_FlowResult:", error.response?.data || error.message);
        throw error;
    }
}

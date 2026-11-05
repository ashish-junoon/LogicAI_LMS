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

export const GetAadhaarDetailById = async (req) => {
    try {
        const response = await api.post("/KycVerification/GetAadhaarDetailById", req);
        return response.data;
    } catch (error) {
        console.error("GetAadhaarDetailById:", error.response?.data || error.message);
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



// GET AccountAggregatorUnderwriting
export const AccountAggregatorUnderwriting = async (req) => {
    try {
        const response = await api.post("/AccountAggrator/AccountAggregatorUnderwriting", req);
        return response.data;
    } catch (error) {
        console.error("AccountAggregatorUnderwriting:", error.response?.data || error.message);
        throw error;
    }
}


export const AccountAggregatorGet = async (req) => {
    try {
        const response = await api.post("/AccountAggrator/AccountAggregatorGet", req);
        return response.data;
    } catch (error) {
        console.error("AccountAggregatorGet:", error.response?.data || error.message);
        throw error;
    }
}

export const RecurringRun = async (req) => {
    try {
        const response = await api.post("/AccountAggrator/RecurringRun", req);
        return response.data;
    } catch (error) {
        console.error("RecurringRun:", error.response?.data || error.message);
        throw error;
    }
}

export const RecurringStatus = async (req) => {
    try {
        const response = await api.post("/AccountAggrator/RecurringStatus", req);
        return response.data;
    } catch (error) {
        console.error("RecurringStatus:", error.response?.data || error.message);
        throw error;
    }
}

export const RecurringResult = async (req) => {
    try {
        const response = await api.post("/AccountAggrator/RecurringResult", req);
        return response.data;
    } catch (error) {
        console.error("RecurringResult:", error.response?.data || error.message);
        throw error;
    }
}

export const AccountAggregatorResult = async (req) => {
    try {
        const response = await api.post("/AccountAggrator/AccountAggregatorResult", req);
        return response.data;
    } catch (error) {
        console.error("AccountAggregatorResult:", error.response?.data || error.message);
        throw error;
    }
}
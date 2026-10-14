import api from "./api.js";

// ========================================
// *Application Related API's
// ========================================

//? Listing API's
//* =====================================

export const GetAllApplications = async (req) => {
    try {
        const response = await api.post("/CommonLoan/GetAllCustomerDetails", req);

        return response.data;
    } catch (error) {
        console.error("GetAllApplications:", error.response?.data || error.message);
        throw error;
    }
};

export const CustomerDetails = async (req) => {
    try {
        const response = await api.post(
            "/CommonLoan/CustomerDetails",
            req
        );

        return response.data;
    } catch (error) {
        console.error("CustomerDetails:", error.response?.data || error.message);
        throw error;
    }
};


// save form edits/ user details api
export const SaveMarketSurvey = async (req) => {
    try {
        const response = await api.post("/LOS/SaveMarketSurvey", req);
        return response.data;
    } catch (error) {
        console.error("SaveMarketSurvey:", error.response?.data || error.message);
        throw error;
    }
}

export const SaveApplicantDetails = async (req) => {
    try {
        const response = await api.post("/LOS/SaveKycAddress", req);
        return response.data;
    } catch (error) {
        console.error("SaveApplicantDetails:", error.response?.data || error.message);
        throw error;
    }
}

export const SaveBankDetails = async (req) => {
    try {
        const response = await api.post("/LOS/SaveBankDetails", req);
        return response.data;
    } catch (error) {
        console.error("SaveBankDetails:", error.response?.data || error.message);
        throw error;
    }
}

export const SaveCoBorrower = async (req) => {
    try {
        const response = await api.post("/LOS/SaveCoBorrower", req);
        return response.data;
    } catch (error) {
        console.error("SaveCoBorrower:", error.response?.data || error.message);
        throw error;
    }
}

export const SaveCashflow = async (req) => {
    try {
        const response = await api.post("/LOS/SaveCashflow", req);
        return response.data;
    } catch (error) {
        console.error("SaveCashflow:", error.response?.data || error.message);
        throw error;
    }
}

export const SaveLoanInfo = async (req) => {
    try {
        const response = await api.post("/LOS/SaveLoanDetails", req);
        return response.data;
    } catch (error) {
        console.error("SaveCashflow:", error.response?.data || error.message);
        throw error;
    }
}

export const SaveOtherDocuments = async (req) => {
    try {
        const response = await api.post("/LOS/SaveDocumentDetails", req);
        return response.data;
    } catch (error) {
        console.error("SaveBankDetails:", error.response?.data || error.message);
        throw error;
    }
}
export const SaveAdditionalRemark = async (req) => {
    try {
        const response = await api.post("/LOS/SaveAdditionalRemark", req);
        return response.data;
    } catch (error) {
        console.error("SaveAdditionalRemark:", error.response?.data || error.message);
        throw error;
    }
};

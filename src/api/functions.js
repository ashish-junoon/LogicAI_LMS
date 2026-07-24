import axios from "axios";

const api = axios.create({
    baseURL: 'http://10.0.0.20:8088/api',
    headers: {
        "Content-Type": 'application/json'
    }
})

// api functions here


// ========================================
// *Dashboard4 API's
// ========================================

//? Portofolio Health Section API's
//* =====================================

export const PortfolioHealthAnalysisAPI = async (req) => {
    try {
        const response = await api.post("/Dashboard/PortfolioHealthAnalysis", req);
        return response.data;
    } catch (error) {
        console.error("PortfolioHealthAnalysis:", error.response?.data || error.message);
        throw error;
    }
}

export const PortfolioHealth_NPAbySectorAPI = async (req) => {
    try {
        const response = await api.post("/Dashboard/PortfolioHealth_NPAbySector", req);
        return response.data;
    } catch (error) {
        console.error("PortfolioHealthAnalysis:", error.response?.data || error.message);
        throw error;
    }
}


export const PortfolioHealth_CreditScoreDistributionAPI = async (req) => {
    try {
        const response = await api.post("/Dashboard/PortfolioHealth_CreditScoreDistribution", req);
        return response.data;
    } catch (error) {
        console.error("PortfolioHealthAnalysis:", error.response?.data || error.message);
        throw error;
    }
}



//? Sector Geographic Section API's
//* =====================================

export const SectorGeographic_DisbursementsbyStateAPI = async (req) => {
    try {
        const response = await api.post("/Dashboard/SectorGeographic_DisbursementsbyState", req);
        return response.data;
    } catch (error) {
        console.error("PortfolioHealthAnalysis:", error.response?.data || error.message);
        throw error;
    }
}

export const SectorGeographic_MonthlyLoanCountAPI = async (req) => {
    try {
        const response = await api.post("/Dashboard/SectorGeographic_MonthlyLoanCount", req);
        return response.data;
    } catch (error) {
        console.error("PortfolioHealthAnalysis:", error.response?.data || error.message);
        throw error;
    }
}

export const SectorGeographic_HouseTypeSplitAPI = async (req) => {
    try {
        const response = await api.post("/Dashboard/SectorGeographic_HouseTypeSplit", req);
        return response.data;
    } catch (error) {
        console.error("PortfolioHealthAnalysis:", error.response?.data || error.message);
        throw error;
    }
}

//? Customer Profile Section API's
//* =====================================

export const CustomerProfileAnalysisAPI = async (req) => {
    try {
        const response = await api.post("/Dashboard/CustomerProfileAnalysis", req);
        return response.data;
    } catch (error) {
        console.error("PortfolioHealthAnalysis:", error.response?.data || error.message);
        throw error;
    }
}

export const CustomerProfile_LoanSizeDistributionAPI = async (req) => {
    try {
        const response = await api.post("/Dashboard/CustomerProfile_LoanSizeDistribution", req);
        return response.data;
    } catch (error) {
        console.error("PortfolioHealthAnalysis:", error.response?.data || error.message);
        throw error;
    }
}

export const CustomerProfile_DescriptionAPI = async (req) => {
    try {
        const response = await api.post("/Dashboard/CustomerProfile_Description", req);
        return response.data;
    } catch (error) {
        console.error("PortfolioHealthAnalysis:", error.response?.data || error.message);
        throw error;
    }
}


//? Team Performance Section API's
//* =====================================

export const TeamPerformance_TeamPerformanceSummaryAPI = async (req) => {
    try {
        const response = await api.post("/Dashboard/TeamPerformance_TeamPerformanceSummary", req);
        return response.data;
    } catch (error) {
        console.error("PortfolioHealthAnalysis:", error.response?.data || error.message);
        throw error;
    }
}


//? Overview Section API's
//* =====================================

export const Overview_MainAPI = async (req) => {
    try {
        const response = await api.post("/Dashboard/Overview_Main", req);
        return response.data;
    } catch (error) {
        console.error("PortfolioHealthAnalysis:", error.response?.data || error.message);
        throw error;
    }
}

export const Overview_DescriptionAPI = async (req) => {
    try {
        const response = await api.post("/Dashboard/Overview_Description", req);
        return response.data;
    } catch (error) {
        console.error("PortfolioHealthAnalysis:", error.response?.data || error.message);
        throw error;
    }
}

export const Overview_LoanStatusDistributionAPI = async (req) => {
    try {
        const response = await api.post("/Dashboard/Overview_LoanStatusDistribution", req);
        return response.data;
    } catch (error) {
        console.error("PortfolioHealthAnalysis:", error.response?.data || error.message);
        throw error;
    }
}

export const Overview_MonthlyDisbursementsAPI = async (req) => {
    try {
        const response = await api.post("/Dashboard/Overview_MonthlyDisbursements", req);
        return response.data;
    } catch (error) {
        console.error("PortfolioHealthAnalysis:", error.response?.data || error.message);
        throw error;
    }
}
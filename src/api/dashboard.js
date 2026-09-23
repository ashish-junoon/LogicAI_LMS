import api from './api.js'

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



//? Financial Performance Section API's
//* =====================================

export const Financial_PerformanceAPI = async (req) => {
    try {
        const response = await api.post("/Dashboard/Financial_Performance", req);
        return response.data;
    } catch (error) {
        console.error("Financial_Performance:", error.response?.data || error.message);
        throw error;
    }
}


export const Financials_CollectionEfficiencySummaryAPI = async (req) => {
    try {
        const response = await api.post("/Dashboard/Financials_CollectionEfficiencySummary", req);
        return response.data;
    } catch (error) {
        console.error("Financials_CollectionEfficiencySummary:", error.response?.data || error.message);
        throw error;
    }
}


export const Financials_LoanTenureDistributionAPI = async (req) => {
    try {
        const response = await api.post("/Dashboard/Financials_LoanTenureDistribution", req);
        return response.data;
    } catch (error) {
        console.error("loanTenureDistributionDetailData:", error.response?.data || error.message);
        throw error;
    }
}

export const Financials_MonthlyRevenueTrendAPI = async (req) => {
    try {
        const response = await api.post("/Dashboard/Financials_MonthlyRevenueTrend", req);
        return response.data;
    } catch (error) {
        console.error("Financials_MonthlyRevenueTrend:", error.response?.data || error.message);
        throw error;
    }
}

export const Financials_ROIDistributionAPI = async (req) => {
    try {
        const response = await api.post("/Dashboard/Financials_ROIDistribution", req);
        return response.data;
    } catch (error) {
        console.error("Financials_ROIDistribution:", error.response?.data || error.message);
        throw error;
    }
}
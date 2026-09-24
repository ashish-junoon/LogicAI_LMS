import api from './api.js'

// ========================================
// *Master's API's
// ========================================

//? GetAllBranches API's
//* =====================================

export const GetAllBranches = async (req) => {
    try {
        const response = await api.get("/Master/GetAllBranches", req);
        return response.data;
    } catch (error) {
        console.error("GetAllBranches:", error.response?.data || error.message);
        throw error;
    }
}


export const CreateBranch = async (req) => {
    try {
        const response = await api.post("/Master/CreateBranch", req);
        return response.data;
    } catch (error) {
        console.error("CreateBranch:", error.response?.data || error.message);
        throw error;
    }
}


export const UpdateBranch = async (req) => {
    try {
        const response = await api.put("/Master/UpdateBranch", req);
        return response.data;
    } catch (error) {
        console.error("UpdateBranch:", error.response?.data || error.message);
        throw error;
    }
}


export const GetAllBusinessTrades = async (req) => {
    try {
        const response = await api.get("/Master/GetAllBusinessTrades", req);
        return response.data;
    } catch (error) {
        console.error("GetAllBusinessTrades:", error.response?.data || error.message);
        throw error;
    }
}

export const CreateBusinessTrade = async (req) => {
    try {
        const response = await api.post("/Master/CreateBusinessTrade", req);
        return response.data;
    } catch (error) {
        console.error("CreateBusinessTrade:", error.response?.data || error.message);
        throw error;
    }
}

export const UpdateBusinessTrade = async (req) => {
    try {
        const response = await api.post("/Master/UpdateBusinessTrade", req);
        return response.data;
    } catch (error) {
        console.error("UpdateBusinessTrade:", error.response?.data || error.message);
        throw error;
    }
}



export const GetAllBanks = async (req) => {
    try {
        const response = await api.get("/Master/GetAllBanks", req);
        return response.data;
    } catch (error) {
        console.error("GetAllBanks:", error.response?.data || error.message);
        throw error;
    }
}

export const CreateBank = async (req) => {
    try {
        const response = await api.post("/Master/CreateBank", req);
        return response.data;
    } catch (error) {
        console.error("CreateBank:", error.response?.data || error.message);
        throw error;
    }
}

export const UpdateBank = async (req) => {
    try {
        const response = await api.put("/Master/UpdateBank", req);
        return response.data;
    } catch (error) {
        console.error("UpdateBank:", error.response?.data || error.message);
        throw error;
    }
}
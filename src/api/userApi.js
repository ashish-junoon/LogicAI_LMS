

// ?===========================
// * USER MANAGEMENT API'S
// ?===========================

import api from "./api";

export const GetAllUsers = async (req) => {
    try {
        const response = await api.get("/Admin/GetAllUsers", req);
        return response.data;
    } catch (error) {
        console.error("GetAllUsers:", error.response?.data || error.message);
        throw error;
    }
}

export const CreateUsers = async (req) => {
    try {
        const response = await api.post("/Admin/CreateUsers", req);
        return response.data;
    } catch (error) {
        console.error("CreateUsers:", error.response?.data || error.message);
        throw error;
    }
}

export const UpdateUsers = async (req) => {
    try {
        const response = await api.put("/Admin/UpdateUsers", req);
        return response.data;
    } catch (error) {
        console.error("UpdateUsers:", error.response?.data || error.message);
        throw error;
    }
}



// ?===========================
// * GROUP MANAGEMENT API'S
// ?===========================

export const GetAllPageGroups = async (req) => {
    try {
        const response = await api.get("/Admin/GetAllPageGroups", req);
        return response.data;
    } catch (error) {
        console.error("GetAllPageGroups:", error.response?.data || error.message);
        throw error;
    }
}

export const UpdatePageGroup = async (req) => {
    try {
        const response = await api.put("/Admin/UpdatePageGroup", req);
        return response.data;
    } catch (error) {
        console.error("UpdatePageGroup:", error.response?.data || error.message);
        throw error;
    }
}

export const CreatePageGroup = async (req) => {
    try {
        const response = await api.post("/Admin/CreatePageGroup", req);
        return response.data;
    } catch (error) {
        console.error("CreatePageGroup:", error.response?.data || error.message);
        throw error;
    }
}



// ?===========================
// * PAGE MANAGEMENT API'S
// ?===========================

export const GetAllPageNames = async (req) => {
    try {
        const response = await api.get("/Admin/GetAllPageNames", req);
        return response.data;
    } catch (error) {
        console.error("GetAllPageNames:", error.response?.data || error.message);
        throw error;
    }
}

export const UpdatePageName = async (req) => {
    try {
        const response = await api.put("/Admin/UpdatePageName", req);
        return response.data;
    } catch (error) {
        console.error("UpdatePageName:", error.response?.data || error.message);
        throw error;
    }
}

export const CreatePageName = async (req) => {
    try {
        const response = await api.post("/Admin/CreatePageName", req);
        return response.data;
    } catch (error) {
        console.error("CreatePageName:", error.response?.data || error.message);
        throw error;
    }
}
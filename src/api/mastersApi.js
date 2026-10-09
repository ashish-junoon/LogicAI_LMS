import api from './api.js'

// ========================================
// *Master's API's
// ========================================

// ?===========================
// * BRANCH MASTER API'S
// ?===========================

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


// ?===========================
// * BUSINESS TRADE MASTER API'S
// ?===========================

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
        const response = await api.put("/Master/UpdateBusinessTrade", req);
        return response.data;
    } catch (error) {
        console.error("UpdateBusinessTrade:", error.response?.data || error.message);
        throw error;
    }
}

// ?===========================
// * BANK MASTER API'S
// ?===========================

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

// ?===========================
// * DOCUMENT MASTER API'S
// ?===========================


export const GetAllDocumentTypes = async (req) => {
    try {
        const response = await api.get("/Master/GetAllDocumentTypes", req);
        return response.data;
    } catch (error) {
        console.error("GetAllDocumentTypes:", error.response?.data || error.message);
        throw error;
    }
}

export const CreateDocumentType = async (req) => {
    try {
        const response = await api.post("/Master/CreateDocumentType", req);
        return response.data;
    } catch (error) {
        console.error("CreateDocumentType:", error.response?.data || error.message);
        throw error;
    }
}

export const UpdateDocumentType = async (req) => {
    try {
        const response = await api.put("/Master/UpdateDocumentType", req);
        return response.data;
    } catch (error) {
        console.error("UpdateDocumentType:", error.response?.data || error.message);
        throw error;
    }
}


// ?===========================
// * BUSINESS TYPE MASTER API'S
// ?===========================


export const GetAllBusinessTypes = async (req) => {
    try {
        const response = await api.get("/Master/GetAllBusinessTypes", req);
        return response.data;
    } catch (error) {
        console.error("GetAllBusinessTypes:", error.response?.data || error.message);
        throw error;
    }
}

export const CreateBusinessType = async (req) => {
    try {
        const response = await api.post("/Master/CreateBusinessType", req);
        return response.data;
    } catch (error) {
        console.error("CreateBusinessType:", error.response?.data || error.message);
        throw error;
    }
}

export const UpdateBusinessType = async (req) => {
    try {
        const response = await api.put("/Master/UpdateBusinessType", req);
        return response.data;
    } catch (error) {
        console.error("UpdateBusinessType:", error.response?.data || error.message);
        throw error;
    }
}


// ?===========================
// * DEPARTMENT MASTER API'S
// ?===========================


export const GetAllDepartments = async (req) => {
    try {
        const response = await api.get("/Master/GetAllDepartments", req);
        return response.data;
    } catch (error) {
        console.error("GetAllDepartments:", error.response?.data || error.message);
        throw error;
    }
}

export const CreateDepartment = async (req) => {
    try {
        const response = await api.post("/Master/CreateDepartment", req);
        return response.data;
    } catch (error) {
        console.error("CreateDepartment:", error.response?.data || error.message);
        throw error;
    }
}

export const UpdateDepartment = async (req) => {
    try {
        const response = await api.put("/Master/UpdateDepartment", req);
        return response.data;
    } catch (error) {
        console.error("UpdateDepartment:", error.response?.data || error.message);
        throw error;
    }
}


// ?===========================
// * DESIGNATION MASTER API'S
// ?===========================


export const GetAllDesignations = async (req) => {
    try {
        const response = await api.get("/Master/GetAllDesignations", req);
        return response.data;
    } catch (error) {
        console.error("GetAllDesignations:", error.response?.data || error.message);
        throw error;
    }
}

export const CreateDesignation = async (req) => {
    try {
        const response = await api.post("/Master/CreateDesignation", req);
        return response.data;
    } catch (error) {
        console.error("CreateDesignation:", error.response?.data || error.message);
        throw error;
    }
}

export const UpdateDesignation = async (req) => {
    try {
        const response = await api.put("/Master/UpdateDesignation", req);
        return response.data;
    } catch (error) {
        console.error("UpdateDesignation:", error.response?.data || error.message);
        throw error;
    }
}


// ?===========================
// * EMPLOYEMENT TYPE MASTER API'S
// ?===========================


export const GetAllEmploymentTypes = async (req) => {
    try {
        const response = await api.get("/Master/GetAllEmploymentTypes", req);
        return response.data;
    } catch (error) {
        console.error("GetAllEmploymentTypes:", error.response?.data || error.message);
        throw error;
    }
}

export const CreateEmploymentType = async (req) => {
    try {
        const response = await api.post("/Master/CreateEmploymentType", req);
        return response.data;
    } catch (error) {
        console.error("CreateEmploymentType:", error.response?.data || error.message);
        throw error;
    }
}

export const UpdateEmploymentType = async (req) => {
    try {
        const response = await api.put("/Master/UpdateEmploymentType", req);
        return response.data;
    } catch (error) {
        console.error("UpdateEmploymentType:", error.response?.data || error.message);
        throw error;
    }
}


// ?===========================
// * RELATIONSHIP MASTER API'S
// ?===========================


export const GetAllRelations = async (req) => {
    try {
        const response = await api.get("/Master/GetAllRelations", req);
        return response.data;
    } catch (error) {
        console.error("GetAllRelations:", error.response?.data || error.message);
        throw error;
    }
}

export const CreateRelation = async (req) => {
    try {
        const response = await api.post("/Master/CreateRelation", req);
        return response.data;
    } catch (error) {
        console.error("CreateRelation:", error.response?.data || error.message);
        throw error;
    }
}

export const UpdateRelation = async (req) => {
    try {
        const response = await api.put("/Master/UpdateRelation", req);
        return response.data;
    } catch (error) {
        console.error("UpdateRelation:", error.response?.data || error.message);
        throw error;
    }
}


// ?===========================
// * SECTOR MASTER API'S
// ?===========================

export const GetAllSectors = async (req) => {
    try {
        const response = await api.get("/Master/GetAllSectors", req);
        return response.data;
    } catch (error) {
        console.error("GetAllSectors:", error.response?.data || error.message);
        throw error;
    }
}

export const CreateSector = async (req) => {
    try {
        const response = await api.post("/Master/CreateSector", req);
        return response.data;
    } catch (error) {
        console.error("CreateSector:", error.response?.data || error.message);
        throw error;
    }
}

export const UpdateSector = async (req) => {
    try {
        const response = await api.put("/Master/UpdateSector", req);
        return response.data;
    } catch (error) {
        console.error("UpdateSector:", error.response?.data || error.message);
        throw error;
    }
}


// ?===========================
// * RELIGION MASTER API'S
// ?===========================

export const GetAllReligions = async (req) => {
    try {
        const response = await api.get("/Master/GetAllReligions", req);
        return response.data;
    } catch (error) {
        console.error("GetAllReligions:", error.response?.data || error.message);
        throw error;
    }
}

export const CreateReligion = async (req) => {
    try {
        const response = await api.post("/Master/CreateReligion", req);
        return response.data;
    } catch (error) {
        console.error("CreateReligion:", error.response?.data || error.message);
        throw error;
    }
}

export const UpdateReligion = async (req) => {
    try {
        const response = await api.put("/Master/UpdateReligion", req);
        return response.data;
    } catch (error) {
        console.error("UpdateReligion:", error.response?.data || error.message);
        throw error;
    }
}


// ?===========================
// * GENDER MASTER API'S
// ?===========================

export const GetAllGenders = async (req) => {
    try {
        const response = await api.get("/Master/GetAllGenders", req);
        return response.data;
    } catch (error) {
        console.error("GetAllGenders:", error.response?.data || error.message);
        throw error;
    }
}

export const CreateGender = async (req) => {
    try {
        const response = await api.post("/Master/CreateGender", req);
        return response.data;
    } catch (error) {
        console.error("CreateGender:", error.response?.data || error.message);
        throw error;
    }
}

export const UpdateGender = async (req) => {
    try {
        const response = await api.put("/Master/UpdateGender", req);
        return response.data;
    } catch (error) {
        console.error("UpdateGender:", error.response?.data || error.message);
        throw error;
    }
}



// ?===========================
// * RESIDENCE TYPE MASTER API'S
// ?===========================

export const GetAllResidenceTypes = async (req) => {
    try {
        const response = await api.get("/Master/GetAllResidenceTypes", req);
        return response.data;
    } catch (error) {
        console.error("GetAllResidenceTypes:", error.response?.data || error.message);
        throw error;
    }
}

export const CreateResidenceType = async (req) => {
    try {
        const response = await api.post("/Master/CreateResidenceType", req);
        return response.data;
    } catch (error) {
        console.error("CreateResidenceType:", error.response?.data || error.message);
        throw error;
    }
}

export const UpdateResidenceType = async (req) => {
    try {
        const response = await api.put("/Master/UpdateResidenceType", req);
        return response.data;
    } catch (error) {
        console.error("UpdateResidenceType:", error.response?.data || error.message);
        throw error;
    }
}

// ?===========================
// * Loan Purpose MASTER API'S
// ?===========================

export const GetAllLoanPurposes = async (req) => {
    try {
        const response = await api.get("/Master/GetAllLoanPurposes", req);
        return response.data;
    } catch (error) {
        console.error("GetAllResidenceTypes:", error.response?.data || error.message);
        throw error;
    }
}

export const CreateLoanPurpose = async (req) => {
    try {
        const response = await api.post("/Master/CreateLoanPurpose", req);
        return response.data;
    } catch (error) {
        console.error("CreateResidenceType:", error.response?.data || error.message);
        throw error;
    }
}

export const UpdateLoanPurpose = async (req) => {
    try {
        const response = await api.put("/Master/UpdateLoanPurpose", req);
        return response.data;
    } catch (error) {
        console.error("UpdateResidenceType:", error.response?.data || error.message);
        throw error;
    }
}



// ?===========================
// * PD Questions MASTER API'S
// ?===========================

export const GetAllPDQuestions = async (req) => {
    try {
        const response = await api.get("/Master/GetAllQuestionnaires", req);
        return response.data;
    } catch (error) {
        console.error("GetAllResidenceTypes:", error.response?.data || error.message);
        throw error;
    }
}

export const CreatePDQuestion = async (req) => {
    try {
        const response = await api.post("/Master/CreateQuestionnaire", req);
        return response.data;
    } catch (error) {
        console.error("CreateResidenceType:", error.response?.data || error.message);
        throw error;
    }
}

export const UpdatePDQuestion = async (req) => {
    try {
        const response = await api.put("/Master/UpdateQuestionnaire", req);
        return response.data;
    } catch (error) {
        console.error("UpdateResidenceType:", error.response?.data || error.message);
        throw error;
    }
}



// ?===========================
// * VENDOR MASTER API'S
// ?===========================

export const GetAllVendors = async (req) => {
    try {
        const response = await api.get("/Master/GetAllVendors", req);
        return response.data;
    } catch (error) {
        console.error("GetAllVendors:", error.response?.data || error.message);
        throw error;
    }
}

export const UpdateVendor = async (req) => {
    try {
        const response = await api.put("/Master/UpdateVendor", req);
        return response.data;
    } catch (error) {
        console.error("UpdateVendor:", error.response?.data || error.message);
        throw error;
    }
}

export const CreateVendor = async (req) => {
    try {
        const response = await api.post("/Master/CreateVendor", req);
        return response.data;
    } catch (error) {
        console.error("CreateVendor:", error.response?.data || error.message);
        throw error;
    }
}

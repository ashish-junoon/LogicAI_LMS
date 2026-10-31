import api from "./api";

export const Userlogin = async (req) => {
    try {
        const response = await api.post("/Admin/login", req);
        return response.data;
    } catch (error) {
        console.error("login:", error.response?.data || error.message);
        throw error;
    }
}
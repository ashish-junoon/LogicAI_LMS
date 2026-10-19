import axios from "axios";

const api = axios.create({
    // baseURL: 'http://10.0.0.20:8090/api',
    baseURL: 'http://10.0.0.82:88/api',
    headers: {
        "Content-Type": 'application/json'
    }
})

export default api;
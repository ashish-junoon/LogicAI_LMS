import axios from "axios";

const api = axios.create({
    baseURL: 'https://lmsapi.junooncapital.com/api',
    // baseURL: 'http://10.0.0.20:8091/api',
    headers: {
        "Content-Type": 'application/json'
    }
})

export default api;
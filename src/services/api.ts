import axios from "axios";

export const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api"

const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true
});

let isRefreshing = false;

api.interceptors.response.use((reponse) => reponse, async (error) => {
    const ogRequest = error.config;
    if(error.response?.status === 401 && !ogRequest._retry){
        ogRequest._retry = true;
        try{
            if(!isRefreshing){
                isRefreshing = true;
                await axios.post(`${BASE_URL}/auth/refreshAccessToken`, {}, {withCredentials: true})
                .finally(() => {
                    isRefreshing = false;
                })
            }
            return api(ogRequest);
        }catch{
            window.location.href = "/signin";
            return Promise.reject(error);
        }
    }
    return Promise.reject(error);
});

export default api;
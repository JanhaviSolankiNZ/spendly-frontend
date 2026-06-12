import axios from "axios";

export const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api"

const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true
});

let isRefreshing = false;
let refreshPromise: Promise<string> | null = null;

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken");
    if(token){
        config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use((reponse) => reponse, async (error) => {
    const ogRequest = error.config;
    if(error.response?.status === 401 && !ogRequest._retry){
        ogRequest._retry = true;
        try{
            if(!isRefreshing){
                isRefreshing = true;
                refreshPromise = axios.post(`${BASE_URL}/auth/refreshAccessToken`, {}, {withCredentials: true})
                .then((response) => {
                    const newToken = response.data.data.accessToken;
                    localStorage.setItem("accessToken", newToken);
                    return newToken;
                })
                .finally(() => {
                    isRefreshing = false;
                })
            }
            const newToken = await refreshPromise;

            ogRequest.headers["Authorization"] = `Bearer ${newToken}`;
            return api(ogRequest);
        }catch{
            localStorage.removeItem("accessToken");
            localStorage.removeItem("user");
            window.location.href = "/signin";
            return Promise.reject(error);
        }
    }
    return Promise.reject(error);
});

export default api;
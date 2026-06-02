import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api"

const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
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
            const { data } = await axios.post(`${BASE_URL}/auth/refresh`, {}, {withCredentials: true});
            const newToken = data.data.actionToken;
            localStorage.set("actionToken", newToken);
            ogRequest.headers["Authorization"] = `Bearer ${newToken}`;
            return api(ogRequest)
        }catch{
            localStorage.removeItem("actionToken");
            localStorage.removeItem("user");
            window.location.href = "/signin"
        }
    }
    return Promise.reject(error);
});

export default api;
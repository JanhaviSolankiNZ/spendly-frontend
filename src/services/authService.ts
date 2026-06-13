import api from "./api";

interface LoginPayload {
    email: string;
    password: string;
}

interface RegisterPayload{
    email: string;
    password: string;
    username: string;
}

export const authService = {
    login: (payload: LoginPayload) => api.post("/auth/login", payload),
    register: (payload: RegisterPayload) => api.post("/auth/register", payload),
    logout: () => api.post("/auth/logout"),
    refresh: () => api.post("/auth/refresh"),
    me: () => api.get("/auth/me"),
}
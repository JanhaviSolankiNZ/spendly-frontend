import api from "./api";
export const incomeService = {
    getAll: (params?: {month: string; page?: number; limit?: number}) => api.get("/income", {params}),
    summary: (month: string) => api.get("/income/summary", {params: {month}}),
    create: (data: object) => api.post("/income", data),
    delete: (id: string) => api.delete(`/income/${id}`)
}
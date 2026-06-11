import api from "./api";

export const expenseService = {
    getAll: (params?: {month?:string; category?: string; search?: string; page?: number; limit?: number}) => api.get("/expenses", {params}),
    summary: (month: string) => api.get("/expenses/analytics/summary", { params: {month}}),
    delete: (id: string) => api.delete(`/expense/${id}`),
    getById: (id: string) => api.get(`/expenses/${id}`),
    create: (data:object) => api.post("/expenses", data),
    update: (id: string, data: object) => api.patch(`/expenses/${id}`, data),
    aiClassifyCategory: (data: object) => api.post('/expenses/categorise', data),
    exportCSV: (params: {month: string}) => api.get(`/expenses/csv`, {params})
}
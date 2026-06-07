import api from "./api";

export const expenseService = {
    getAll: (params?: {month?:string; category?: string; search?: string; page?: number; limit?: number}) => api.get("/expenses", {params}),
    summary: (month: string) => api.get("/expenses/analytics/summary", { params: {month}})

}
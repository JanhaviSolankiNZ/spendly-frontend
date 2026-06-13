import api from "./api";
export const budgetService = {
  getAll:  () => api.get("/budgets"),
  upsert:  (data: { category: string; limit: number }) =>
    api.post("/budgets", data),
  delete:  (id: string) => api.delete(`/budgets/${id}`),
};
import api from "./api";

export const analyticsService = {
  summary: (month: string) =>
    api.get("/analytics/summary", { params: { month } }),
  trend:   (month: string) =>
    api.get("/analytics/trend",   { params: { month } }),
  budget: (month: string) =>
    api.get("/analytics/budget",   { params: { month } })
};
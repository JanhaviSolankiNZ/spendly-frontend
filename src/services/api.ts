import axios from "axios";
import toast from "react-hot-toast";

export const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

let isRefreshing = false;
let refreshFailed = false;

api.interceptors.response.use(
  (reponse) => reponse,
  async (error) => {
    if (error.response?.status === 403 &&
        error.response?.data?.message?.includes("Pro")) {
      toast.error("This feature requires a Pro subscription");
    }
    const ogRequest = error.config;
    if (error.response?.status === 401 && !ogRequest._retry) {
      if (refreshFailed) {
        window.location.replace("/signin");
        return Promise.reject(error);
      }
      ogRequest._retry = true;
      try {
        if (!isRefreshing) {
          isRefreshing = true;
          await axios
            .post(
              `${BASE_URL}/auth/refreshAccessToken`,
              {},
              { withCredentials: true },
            )
            .finally(() => {
              isRefreshing = false;
            });
        }
        return api(ogRequest);
      } catch {
        refreshFailed = true;
        isRefreshing = false;
        await axios.post(
          `${BASE_URL}/auth/logout`,
          {},
          { withCredentials: true },
        );
        window.location.replace("/signin");
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  },
);

export default api;

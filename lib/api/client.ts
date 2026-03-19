const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api";

import axios from "axios";

export const api = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true
});

function shouldAttemptRefresh(error: any) {
  const status = error?.response?.status;
  const url = String(error?.config?.url || "");
  const alreadyRetried = Boolean(error?.config?._retry);
  const isAuthEndpoint = url.includes("/auth/login") || url.includes("/auth/register") || url.includes("/auth/refresh");

  return status === 401 && !alreadyRetried && !isAuthEndpoint;
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (shouldAttemptRefresh(error)) {
      error.config._retry = true;
      try {
        await axios.post(`${apiBaseUrl}/auth/refresh`, {}, { withCredentials: true });
        return api(error.config);
      } catch {
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

import secureLocalStorage from "react-secure-storage";
import axios from "axios";
axios.defaults.baseURL = import.meta.env.VITE_API_URL;
axios.defaults.timeout = import.meta.env.VITE_API_TIMEOUT;
axios.defaults.headers.common["Content-Type"] = "application/json";

const api = axios.create();

api.interceptors.request.use((request) => {
  const token = secureLocalStorage.getItem("acessToken");
  if (token) {
    // request.headers["Content-Type"] = "application/json";
    request.headers["Authorization"] = `Bearer ${token}`;
  }
  return request;
});

// Refresh token logic
const refreshAuthLogic = async (failedRequest) => {
  try {
    let headersList = {
      Authorization: "Bearer " + secureLocalStorage.getItem("refreshToken"),
      "Content-Type": "application/json",
    };

    let reqOptions = {
      url: `/api/users/refresh`,
      method: "GET",
      headers: headersList,
    };
    const response = await axios.request(reqOptions);
    secureLocalStorage.setItem("acessToken", response.data.acessToken);
    secureLocalStorage.setItem("refreshToken", response.data.refreshToken);
    secureLocalStorage.setItem("user", response.data.result);
    console.log("Simpan token baru berhasil ...");
    failedRequest.headers["Authorization"] =
      "Bearer " + response.data.acessToken;
    return Promise.resolve();
  } catch (error) {
    // Handle refresh token expiration, e.g., redirect to login page
    secureLocalStorage.clear();
    console.log(error.message);
    window.location.href = "/";
    return Promise.reject(error);
  }
};

// Interceptor untuk refresh token ketika access token expired
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      await refreshAuthLogic(originalRequest);
      return api(originalRequest);
    }
    return Promise.reject(error);
  }
);

export const axiosInstance = api;
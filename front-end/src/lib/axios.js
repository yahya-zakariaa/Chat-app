import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "http://localhost:3001/api",
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response.data.status === 401 ||
      error.response.data.status === 403 ||
      error.response.status === 401 ||
      error.response.status === 403
    ) {
      return (window.location.href = "/login");
    }
    return Promise.reject(error);
  }
);

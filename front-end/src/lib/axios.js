import axios from "axios";
const unProtected = ["/login", "/signup", "forgot-password"];
export const axiosInstance = axios.create({
  baseURL: "https://hexagonal-neat-poinsettia.glitch.me/api", //"http://localhost:3001/api"
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => {
    console.log(response);
    return response;
  },
  (error) => {
    console.log(error);
    if (
      (error?.response?.data.status === 401 ||
        error?.response?.data.status === 403 ||
        error?.response?.status === 401 ||
        error?.response?.status === 403) &&
      !unProtected.includes(window.location.pathname)
    ) {
      return (window.location.href = "/login");
    }
    return Promise.reject(error);
  }
);

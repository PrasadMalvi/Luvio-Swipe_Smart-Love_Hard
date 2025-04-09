import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://192.168.156.228:5050",
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Token Injection - Avoid Circular Import
export const setAuthToken = (token) => {
  if (token) {
    axiosInstance.defaults.headers["Authorization"] = `Bearer ${token}`;
  } else {
    delete axiosInstance.defaults.headers["Authorization"];
  }
};

export default axiosInstance;

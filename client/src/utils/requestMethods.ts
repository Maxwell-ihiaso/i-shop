import axios from "axios";
const BASE_URL = 'http://localhost:5000'

export const requestWithAuth = axios.create({
  baseURL: `${BASE_URL}/api/`,
  timeout: 10000,
  withCredentials: true
});

requestWithAuth.interceptors.request.use(
  (config) => {
    console.log("Intercepting the request before sending it", config);
    /* ---- 'Authorization': Bearer *Token ---- */

    config.headers = {
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    };

    return config;
  },
  (error) => {
    console.log("Request error: ", error);
    return Promise.reject(error);
  }
);

export const requestWithoutAuth = axios.create({
  baseURL: `${BASE_URL}/api/`,
  timeout: 10000,
});

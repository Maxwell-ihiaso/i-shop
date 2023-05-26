import axios from "axios";

export const requestWithAuth = axios.create({
  baseURL: `http://localhost:5000/api`,
  timeout: 10000,
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
  baseURL: `http://localhost:5000/api`,
  timeout: 10000,
});

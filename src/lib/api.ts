import axios, { isAxiosError } from "axios";

// const API_BASE_URL = import.meta.env.VITE_API_LOCAL_URL;
const API_PRODUCTION_URL = import.meta.env.VITE_API_PRODUCTION_URL;

export const api = axios.create({
  baseURL: API_PRODUCTION_URL,
  // baseURL: API_BASE_URL,
  headers: {
    accept: "application/json",
    "content-type": "application/json",
  },
  withCredentials: true,
  withXSRFToken: true,
});

export { isAxiosError };

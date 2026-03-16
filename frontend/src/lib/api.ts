// ─────────────────────────────────────────────
// HelpDesk Pro — API Client
// Centralized Axios instance with interceptors
// ─────────────────────────────────────────────

import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

// Create Axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 15000,
});

// ── Request Interceptor ──────────────────────
// Attach auth token from localStorage to every request
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("helpdesk_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response Interceptor ─────────────────────
// Handle 401 (redirect to login) and 422 (validation) globally
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("helpdesk_token");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;

// ─────────────────────────────────────────────
// Auth API
// ─────────────────────────────────────────────

export const authApi = {
  login: (email: string, password: string) =>
    api.post("/auth/login", { email, password }),

  register: (data: {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
  }) => api.post("/auth/register", data),

  logout: () => api.post("/auth/logout"),

  me: () => api.get("/auth/me"),
};

// ─────────────────────────────────────────────
// Tickets API
// ─────────────────────────────────────────────

export const ticketsApi = {
  list: (params?: Record<string, unknown>) =>
    api.get("/tickets", { params }),

  get: (id: string) => api.get(`/tickets/${id}`),

  create: (data: Record<string, unknown>) => api.post("/tickets", data),

  update: (id: string, data: Record<string, unknown>) =>
    api.put(`/tickets/${id}`, data),

  delete: (id: string) => api.delete(`/tickets/${id}`),

  addComment: (id: string, data: { body: string; is_internal?: boolean }) =>
    api.post(`/tickets/${id}/comments`, data),

  getComments: (id: string) => api.get(`/tickets/${id}/comments`),
};

// ─────────────────────────────────────────────
// Dashboard API
// ─────────────────────────────────────────────

export const dashboardApi = {
  getStats: () => api.get("/dashboard/stats"),
  getCharts: () => api.get("/dashboard/charts"),
};

// ─────────────────────────────────────────────
// Users API
// ─────────────────────────────────────────────

export const usersApi = {
  list: (params?: Record<string, unknown>) => api.get("/users", { params }),
  get: (id: string) => api.get(`/users/${id}`),
  update: (id: string, data: Record<string, unknown>) =>
    api.put(`/users/${id}`, data),
  updateAvatar: (id: string, formData: FormData) =>
    api.post(`/users/${id}/avatar`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
};

// ─────────────────────────────────────────────
// Categories API
// ─────────────────────────────────────────────

export const categoriesApi = {
  list: () => api.get("/categories"),
};

import axios from "axios";

// Create axios instance with credentials
const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Authentication API endpoints
export const authApi = {
  // Register new user
  register: async (username: string, password: string) => {
    try {
      const response = await api.post("/auth/register", { username, password });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data;
      }
      throw error;
    }
  },

  // Login user
  login: async (username: string, password: string) => {
    try {
      const response = await api.post("/auth/login", { username, password });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data;
      }
      throw error;
    }
  },

  // Logout user
  logout: async () => {
    try {
      const response = await api.post("/auth/logout");
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data;
      }
      throw error;
    }
  },

  // Check if user is authenticated
  checkAuth: async () => {
    try {
      const response = await api.get("/auth/me");
      return response.data;
    } catch (error) {
      console.error("Auth check error:", error);
      if (axios.isAxiosError(error) && error.response) {
        // Return the error response
        return error.response.data;
      }
      // Return a default error response
      return { statusCode: 401, message: "Not authenticated", data: null };
    }
  },
};

import axios from "axios";

// Create axios instance with base configuration
const api = axios.create({
  baseURL:
    process.env.REACT_APP_API_URL ||
    "https://manilapayrollbackend-production.up.railway.app/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(
      `Making ${config.method?.toUpperCase()} request to ${config.url}`
    );
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Employee API functions
export const employeeAPI = {
  // Get all employees with optional filters
  getAll: (params = {}) => {
    return api.get("/employees", { params });
  },

  // Get single employee by ID
  getById: (id) => {
    return api.get(`/employees/${id}`);
  },

  // Create new employee
  create: (employeeData) => {
    return api.post("/employees", employeeData);
  },

  // Update employee
  update: (id, employeeData) => {
    return api.put(`/employees/${id}`, employeeData);
  },

  // Delete single employee
  delete: (id) => {
    return api.delete(`/employees/${id}`);
  },

  // Delete multiple employees
  deleteMultiple: (ids) => {
    return api.delete("/employees", { data: { ids } });
  },
};

// Department API functions
export const departmentAPI = {
  // Get all departments
  getAll: () => {
    return api.get("/departments");
  },

  // Get single department by ID
  getById: (id) => {
    return api.get(`/departments/${id}`);
  },

  // Create new department
  create: (departmentData) => {
    return api.post("/departments", departmentData);
  },

  // Update department
  update: (id, departmentData) => {
    return api.put(`/departments/${id}`, departmentData);
  },

  // Delete department
  delete: (id) => {
    return api.delete(`/departments/${id}`);
  },
};

// Statistics API functions
export const statsAPI = {
  // Get dashboard statistics
  getStats: () => {
    return api.get("/stats");
  },
};

// Health check
export const healthAPI = {
  check: () => {
    return axios.get(
      process.env.REACT_APP_API_URL?.replace("/api", "") ||
        "https://manilapayrollbackend-production.up.railway.app/api"
    );
  },
};

export default api;

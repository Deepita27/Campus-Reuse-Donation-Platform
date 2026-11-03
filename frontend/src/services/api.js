import axios from 'axios';

// Create base Axios instance
const api = axios.create({
  baseURL: '/api',
  timeout: 15000
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for unified error parsing & 401 handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If token expired or invalid, clear localStorage
      if (localStorage.getItem('token') && !window.location.pathname.includes('/login')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login?session=expired';
      }
    }
    return Promise.reject(error);
  }
);

// ----------------- Auth Services -----------------
export const authService = {
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
  updateProfile: async (data) => {
    const response = await api.put('/auth/profile', data);
    return response.data;
  },
  changePassword: async (data) => {
    const response = await api.put('/auth/change-password', data);
    return response.data;
  }
};

// ----------------- Item Services -----------------
export const itemService = {
  getItems: async (params = {}) => {
    const response = await api.get('/items', { params });
    return response.data;
  },
  getFeaturedItems: async () => {
    const response = await api.get('/items/featured');
    return response.data;
  },
  getCategoryStats: async () => {
    const response = await api.get('/items/categories');
    return response.data;
  },
  getItemById: async (id) => {
    const response = await api.get(`/items/${id}`);
    return response.data;
  },
  createItem: async (formData) => {
    // If formData is FormData instance, send with multipart/form-data
    const isFormData = formData instanceof FormData;
    const response = await api.post('/items', formData, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {}
    });
    return response.data;
  },
  updateItem: async (id, formData) => {
    const isFormData = formData instanceof FormData;
    const response = await api.put(`/items/${id}`, formData, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {}
    });
    return response.data;
  },
  deleteItem: async (id) => {
    const response = await api.delete(`/items/${id}`);
    return response.data;
  },
  getMyDonations: async () => {
    const response = await api.get('/items/user/my-donations');
    return response.data;
  }
};

// ----------------- Request Services -----------------
export const requestService = {
  createRequest: async (data) => {
    const response = await api.post('/requests', data);
    return response.data;
  },
  getMyRequests: async () => {
    const response = await api.get('/requests/my-requests');
    return response.data;
  },
  getReceivedRequests: async () => {
    const response = await api.get('/requests/received');
    return response.data;
  },
  updateRequestStatus: async (id, data) => {
    const response = await api.put(`/requests/${id}/status`, data);
    return response.data;
  }
};

// ----------------- Admin Services -----------------
export const adminService = {
  getDashboardStats: async () => {
    const response = await api.get('/admin/dashboard');
    return response.data;
  },
  getUsers: async (params = {}) => {
    const response = await api.get('/admin/users', { params });
    return response.data;
  },
  toggleBlockUser: async (id) => {
    const response = await api.put(`/admin/users/${id}/toggle-block`);
    return response.data;
  },
  getAdminItems: async (params = {}) => {
    const response = await api.get('/admin/items', { params });
    return response.data;
  },
  approveItem: async (id) => {
    const response = await api.put(`/admin/items/${id}/approve`);
    return response.data;
  },
  rejectItem: async (id, reason) => {
    const response = await api.put(`/admin/items/${id}/reject`, { reason });
    return response.data;
  },
  deleteItem: async (id) => {
    const response = await api.delete(`/admin/items/${id}`);
    return response.data;
  },
  getAdminRequests: async (params = {}) => {
    const response = await api.get('/admin/requests', { params });
    return response.data;
  },
  getAnalytics: async () => {
    const response = await api.get('/admin/analytics');
    return response.data;
  }
};

// ----------------- Notification Services -----------------
export const notificationService = {
  getNotifications: async () => {
    const response = await api.get('/notifications');
    return response.data;
  },
  markAsRead: async (id) => {
    const response = await api.put(`/notifications/${id}/read`);
    return response.data;
  },
  markAllAsRead: async () => {
    const response = await api.put('/notifications/read-all');
    return response.data;
  }
};

export default api;

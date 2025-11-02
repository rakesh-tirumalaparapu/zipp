# Frontend Integration Notes

## Backend Status ✅

**Maven:** ✅ Already configured
- Backend uses Maven (pom.xml exists)
- All dependencies managed via Maven
- Project builds with Maven

## Frontend Integration (For Later)

### ⚠️ IMPORTANT: Use Axios for Backend Integration

When integrating frontend with backend, **axios should be used** for all HTTP requests.

#### Steps for Frontend Integration:

1. **Install Axios:**
   ```bash
   cd proj-master
   npm install axios
   ```

2. **Create Axios Instance:**
   Create a file `src/api/axiosConfig.js` or similar:
   ```javascript
   import axios from 'axios';

   const api = axios.create({
     baseURL: 'http://localhost:8080',
     timeout: 10000,
     headers: {
       'Content-Type': 'application/json'
     }
   });

   // Add JWT token to all requests
   api.interceptors.request.use(
     (config) => {
       const token = localStorage.getItem('token'); // or wherever you store token
       if (token) {
         config.headers.Authorization = `Bearer ${token}`;
       }
       return config;
     },
     (error) => {
       return Promise.reject(error);
     }
   );

   export default api;
   ```

3. **Use Axios for All API Calls:**
   ```javascript
   import api from './api/axiosConfig';

   // Login
   const login = async (email, password, role) => {
     const response = await api.post('/api/auth/login', {
       email,
       password,
       role
     });
     return response.data;
   };

   // Get Profile
   const getProfile = async () => {
     const response = await api.get('/api/customer/profile');
     return response.data;
   };

   // Submit Application
   const submitApplication = async (applicationData) => {
     const response = await api.post('/api/customer/applications', applicationData);
     return response.data;
   };
   ```

### Backend Endpoints Ready for Integration

All backend endpoints are ready and documented in `API_DOCUMENTATION.md`.

- Base URL: `http://localhost:8080`
- Authentication: JWT Bearer token
- All endpoints return JSON (except document download)

---

**Note:** Frontend integration will be done later. Axios is the preferred HTTP client for React integration with this Spring Boot backend.


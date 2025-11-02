# Swagger/OpenAPI Access Guide

## ✅ Swagger Dependency Added

I've added SpringDoc OpenAPI (Swagger for Spring Boot 3.x) to your project.

## 📦 Dependencies Added

**pom.xml:**
```xml
<dependency>
    <groupId>org.springdoc</groupId>
    <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
    <version>2.3.0</version>
</dependency>
```

## 🔧 Configuration

1. **OpenApiConfig.java** - Created with JWT authentication support
2. **SecurityConfig.java** - Updated to allow Swagger endpoints without authentication
3. **application.properties** - Added Swagger UI configuration

## 🌐 How to Access Swagger UI

After starting your Spring Boot application:

### **Swagger UI URLs:**

1. **Primary URL:**
   ```
   http://localhost:8080/swagger-ui.html
   ```

2. **Alternative URLs:**
   ```
   http://localhost:8080/swagger-ui/index.html
   http://localhost:8080/swagger-ui/
   ```

### **API Docs (JSON):**
```
http://localhost:8080/v3/api-docs
```

### **API Docs (YAML):**
```
http://localhost:8080/v3/api-docs.yaml
```

## 🔐 Using JWT Authentication in Swagger

1. Open Swagger UI: `http://localhost:8080/swagger-ui.html`

2. Click on the **"Authorize"** button (lock icon) at the top right

3. In the "Bearer Authentication" section, enter your JWT token:
   ```
   Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
   Or just the token without "Bearer " prefix (Swagger adds it automatically)

4. Click **"Authorize"** then **"Close"**

5. Now all protected endpoints will use this token automatically

## 📝 Workflow in Swagger UI

1. **First, login to get token:**
   - Use `/api/auth/login` endpoint
   - Copy the `token` from response

2. **Authorize with token:**
   - Click "Authorize" button
   - Paste token
   - Click "Authorize"

3. **Test endpoints:**
   - All endpoints will now include the JWT token in headers
   - You can test all customer, maker, and checker endpoints

## 🎯 Swagger Features

- **Interactive API Testing:** Test all endpoints directly from browser
- **Request/Response Examples:** See all DTO structures
- **Authentication:** Easy JWT token management
- **Grouped by Controllers:** Endpoints organized by role
- **Try It Out:** Test endpoints with real data

## 📋 Endpoint Groups in Swagger

Swagger UI will show endpoints grouped by:
- **auth-controller** - Authentication endpoints
- **customer-controller** - Customer endpoints
- **maker-controller** - Maker endpoints
- **checker-controller** - Checker endpoints
- **document-controller** - Document endpoints
- **notification-controller** - Notification endpoints

## ⚠️ Notes

- **Public Endpoints:** `/api/auth/**` can be tested without authentication
- **Protected Endpoints:** All other endpoints require JWT token
- **Swagger Endpoints:** Swagger UI itself is accessible without authentication
- **Document Upload:** Use multipart/form-data in Swagger UI for document uploads

## 🚀 Quick Start

1. Start your Spring Boot application
2. Open browser: `http://localhost:8080/swagger-ui.html`
3. Expand `/api/auth/login`
4. Test login to get token
5. Click "Authorize" and paste token
6. Start testing all endpoints!

---

**Happy Testing! 🎉**


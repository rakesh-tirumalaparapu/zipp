# Loan Origination System - API Documentation

## Base URL
```
http://localhost:8080
```

---

## Architecture Flow

### **Layer Architecture:**
```
Frontend (React) 
    ↓ HTTP Requests
REST Controllers (API Layer)
    ↓
Services (Business Logic Layer)
    ↓
Repositories (Data Access Layer)
    ↓
JPA Entities (Database Layer)
    ↓
PostgreSQL Database
```

### **Security Flow:**
1. User makes login/signup request → No authentication required
2. User receives JWT token
3. User includes token in header: `Authorization: Bearer <token>`
4. JWT Filter validates token on every request
5. Controller extracts userId from token for authorization

### **Application Status Flow:**
```
CUSTOMER SUBMITS
    ↓
WITH_MAKER (Status)
    ↓
MAKER REVIEWS
    ├── APPROVE → WITH_CHECKER
    └── REJECT → REJECTED
        ↓
CHECKER REVIEWS (if approved)
    ├── APPROVE → APPROVED
    └── REJECT → REJECTED
```

---

## All Endpoints

### **1. Authentication Endpoints**

#### **1.1 Customer Signup**
```
POST /api/auth/signup
```
**Description:** Register a new customer account (only customers can sign up)

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "phoneNumber": "9876543210",
  "address": "123 Main Street, City",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Customer registered successfully"
}
```

**Authentication:** Not required

---

#### **1.2 Login**
```
POST /api/auth/login
```
**Description:** Login for Customer, Maker, or Checker

**Request Body:**
```json
{
  "email": "john.doe@example.com",
  "password": "password123",
  "role": "CUSTOMER"  // Options: "CUSTOMER", "MAKER", "CHECKER"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "userId": 1,
  "name": "John Doe",
  "email": "john.doe@example.com",
  "role": "CUSTOMER"
}
```

**Authentication:** Not required

**Pre-seeded Users:**
- **Maker:** 
  - Email: `sameer.maker@example.com`
  - Password: `maker123`
- **Checker:**
  - Email: `rakesh.checker@example.com`
  - Password: `checker123`

---

### **2. Customer Endpoints**

All customer endpoints require authentication header: `Authorization: Bearer <token>`

#### **2.1 Get Customer Profile**
```
GET /api/customer/profile
```

**Response:**
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john.doe@example.com",
  "phoneNumber": "9876543210",
  "address": "123 Main Street, City"
}
```

---

#### **2.2 Update Customer Profile**
```
PUT /api/customer/profile
```

**Request Body:**
```json
{
  "name": "John Updated",
  "phoneNumber": "9876543211",
  "email": "john.updated@example.com",
  "address": "456 New Street, City"
}
```

**Response:** Same as Get Profile

---

#### **2.3 Submit Loan Application**
```
POST /api/customer/applications
```

**Request Body:**
```json
{
  "personalDetails": {
    "firstName": "John",
    "middleName": "Michael",
    "lastName": "Doe",
    "phoneNumber": "9876543210",
    "emailAddress": "john@example.com",
    "currentAddress": "123 Main St",
    "permanentAddress": "123 Main St",
    "maritalStatus": "MARRIED",  // SINGLE, MARRIED, DIVORCED
    "gender": "MALE",             // MALE, FEMALE, OTHER
    "dateOfBirth": "1990-01-15",
    "aadhaarNumber": "123456789012",
    "panNumber": "ABCDE1234F",
    "passportNumber": "A1234567",
    "fatherName": "Father Name",
    "educationDetails": "B.Tech"
  },
  "employmentDetails": {
    "occupationType": "SALARIED",  // SALARIED, SELF_EMPLOYED
    "employerOrBusinessName": "ABC Corp",
    "designation": "Software Engineer",
    "totalWorkExperienceYears": 5,
    "officeAddress": "456 Office St"
  },
  "loanDetails": {
    "loanType": "HOME_LOAN",        // PERSONAL_LOAN, HOME_LOAN, VEHICLE_LOAN
    "loanAmount": 5000000,
    "loanDurationMonths": 240,
    "purposeOfLoan": "Home purchase"
  },
  "existingLoanDetails": {
    "hasExistingLoans": true,
    "existingLoanType": "PERSONAL_LOAN",
    "lenderName": "HDFC Bank",
    "outstandingAmount": 200000,
    "monthlyEmi": 15000,
    "tenureRemainingMonths": 24
  },
  "references": [
    {
      "referenceNumber": 1,
      "name": "Reference 1 Name",
      "relationship": "Friend",
      "contactNumber": "9876543211",
      "address": "789 Ref St"
    },
    {
      "referenceNumber": 2,
      "name": "Reference 2 Name",
      "relationship": "Relative",
      "contactNumber": "9876543212",
      "address": "790 Ref St"
    }
  ]
}
```

**Note:** Age is automatically calculated from dateOfBirth

**Response:** Full ApplicationResponse with generated applicationId (format: LA20250001)

---

#### **2.4 Get My Applications**
```
GET /api/customer/applications
```

**Response:**
```json
[
  {
    "id": 1,
    "applicationId": "LA20250001",
    "customerName": "John Doe",
    "loanType": "HOME_LOAN",
    "loanAmount": 5000000,
    "status": "WITH_MAKER",
    "submittedDate": "2025-01-15"
  }
]
```

---

#### **2.5 Get Application Details**
```
GET /api/customer/applications/{applicationId}
```

**Path Variable:** `applicationId` (String) - e.g., "LA20250001"

**Response:** Complete ApplicationResponse with all details, documents list, and comments

---

### **3. Maker Endpoints**

All maker endpoints require authentication header: `Authorization: Bearer <token>`

#### **3.1 Get Dashboard Stats**
```
GET /api/maker/dashboard/stats
```

**Response:**
```json
{
  "totalApplications": 10,
  "pendingApplications": 3,
  "withCheckerApplications": 2,
  "approvedApplications": 4,
  "rejectedApplications": 1
}
```

---

#### **3.2 Get All Applications**
```
GET /api/maker/applications?status=PENDING
```

**Query Parameters:**
- `status` (optional): Filter by status (WITH_MAKER, PENDING, WITH_CHECKER, APPROVED, REJECTED)

**Response:**
```json
[
  {
    "id": 1,
    "applicationId": "LA20250001",
    "customerName": "John Doe",
    "loanType": "HOME_LOAN",
    "loanAmount": 5000000,
    "status": "PENDING",
    "submittedDate": "2025-01-15"
  }
]
```

---

#### **3.3 Get Application Details**
```
GET /api/maker/applications/{applicationId}
```

**Path Variable:** `applicationId` (String) - e.g., "LA20250001"

**Response:** Complete ApplicationResponse

---

#### **3.4 Review Application (Approve/Reject)**
```
POST /api/maker/applications/{applicationId}/review
```

**Path Variable:** `applicationId` (Integer) - Use the application `id`, not `applicationId` string

**Request Body:**
```json
{
  "action": "APPROVE",  // or "REJECT"
  "comment": "All documents verified. Application approved for checker review."
}
```

**Response:** Updated ApplicationResponse

**Note:** Comment is mandatory. If action is APPROVE, status changes to WITH_CHECKER. If REJECT, status changes to REJECTED.

---

#### **3.5 Get Maker Profile**
```
GET /api/maker/profile
```

**Response:** Same as Customer Profile

---

### **4. Checker Endpoints**

All checker endpoints require authentication header: `Authorization: Bearer <token>`

#### **4.1 Get Dashboard Stats**
```
GET /api/checker/dashboard/stats
```

**Response:** Same as Maker Dashboard Stats

---

#### **4.2 Get All Applications**
```
GET /api/checker/applications?status=WITH_CHECKER
```

**Query Parameters:**
- `status` (optional): Filter by status

**Response:** Same as Maker Get Applications

---

#### **4.3 Get Application Details**
```
GET /api/checker/applications/{applicationId}
```

**Path Variable:** `applicationId` (String) - e.g., "LA20250001"

**Response:** Complete ApplicationResponse

---

#### **4.4 Review Application (Approve/Reject)**
```
POST /api/checker/applications/{applicationId}/review
```

**Path Variable:** `applicationId` (Integer) - Use the application `id`

**Request Body:**
```json
{
  "action": "APPROVE",  // or "REJECT"
  "comment": "Final approval. All checks completed."
}
```

**Response:** Updated ApplicationResponse

**Note:** Comment is mandatory. If action is APPROVE, status changes to APPROVED (final). If REJECT, status changes to REJECTED.

---

#### **4.5 Get Checker Profile**
```
GET /api/checker/profile
```

**Response:** Same as Customer Profile

---

### **5. Document Endpoints**

#### **5.1 Upload Document**
```
POST /api/documents/upload
```

**Content-Type:** `multipart/form-data`

**Form Data:**
- `applicationId`: String (e.g., "LA20250001")
- `documentType`: String (see DocumentType enum below)
- `file`: File (multipart file)

**Document Types (Enum Values):**
```
Personal Details:
- PHOTOGRAPH
- IDENTITY_PROOF
- ADDRESS_PROOF

Employment - Salaried:
- SALARY_SLIPS
- ITR_SALARIED
- BANK_STATEMENTS_SALARIED
- EMPLOYMENT_PROOF

Employment - Self-Employed:
- BUSINESS_PROOF_GST
- ITR_SELF_EMPLOYED
- BANK_STATEMENTS_SELF_EMPLOYED

Loan - Home Loan:
- SALE_AGREEMENT
- EC_CERTIFICATE

Loan - Vehicle Loan:
- INVOICE_FROM_DEALER
- QUOTATION

Loan - Personal Loan:
- INCOME_PROOF

Existing Loans:
- CIBIL_REPORT
```

**Response:**
```json
{
  "message": "Document uploaded successfully"
}
```

**Authentication:** Required (can be called by any authenticated user)

---

#### **5.2 Download Document**
```
GET /api/documents/{documentId}
```

**Path Variable:** `documentId` (Integer)

**Response:** File download (binary)

**Authentication:** Required

---

#### **5.3 Get Document Types by Application**
```
GET /api/documents/application/{applicationId}
```

**Path Variable:** `applicationId` (String)

**Response:**
```json
[
  "PHOTOGRAPH",
  "IDENTITY_PROOF",
  "ADDRESS_PROOF",
  "CIBIL_REPORT"
]
```

**Authentication:** Required

---

### **6. Notification Endpoints**

All notification endpoints require authentication header: `Authorization: Bearer <token>`

#### **6.1 Get User Notifications**
```
GET /api/notifications
```

**Response:**
```json
[
  {
    "id": 1,
    "message": "New loan application LA20250001 submitted by John Doe",
    "isRead": false,
    "createdAt": "2025-01-15T10:30:00",
    "applicationId": "LA20250001"
  }
]
```

---

#### **6.2 Mark Notification as Read**
```
POST /api/notifications/{notificationId}/read
```

**Path Variable:** `notificationId` (Integer)

**Response:**
```json
{
  "message": "Notification marked as read"
}
```

---

#### **6.3 Get Unread Notification Count**
```
GET /api/notifications/unread-count
```

**Response:**
```json
5
```

---

## Swagger/Postman Testing Sequence

### **Phase 1: Authentication Setup**

#### Step 1: Customer Signup
```
POST http://localhost:8080/api/auth/signup
Body: {
  "name": "Test Customer",
  "email": "test@example.com",
  "phoneNumber": "9876543210",
  "address": "Test Address",
  "password": "test123"
}
```
Save the response or note the email for login.

---

#### Step 2: Customer Login
```
POST http://localhost:8080/api/auth/login
Body: {
  "email": "test@example.com",
  "password": "test123",
  "role": "CUSTOMER"
}
```
**IMPORTANT:** Save the `token` from response. Set it as environment variable: `customerToken`

---

#### Step 3: Maker Login
```
POST http://localhost:8080/api/auth/login
Body: {
  "email": "sameer.maker@example.com",
  "password": "maker123",
  "role": "MAKER"
}
```
Save token as: `makerToken`

---

#### Step 4: Checker Login
```
POST http://localhost:8080/api/auth/login
Body: {
  "email": "rakesh.checker@example.com",
  "password": "checker123",
  "role": "CHECKER"
}
```
Save token as: `checkerToken`

---

### **Phase 2: Customer Flow**

#### Step 5: Get Customer Profile
```
GET http://localhost:8080/api/customer/profile
Headers: Authorization: Bearer {customerToken}
```

---

#### Step 6: Update Customer Profile (Optional)
```
PUT http://localhost:8080/api/customer/profile
Headers: Authorization: Bearer {customerToken}
Body: {
  "name": "Updated Name",
  "phoneNumber": "9876543211",
  "email": "updated@example.com",
  "address": "Updated Address"
}
```

---

#### Step 7: Submit Loan Application
```
POST http://localhost:8080/api/customer/applications
Headers: Authorization: Bearer {customerToken}
Body: {
  "personalDetails": {
    "firstName": "John",
    "middleName": "Michael",
    "lastName": "Doe",
    "phoneNumber": "9876543210",
    "emailAddress": "john@example.com",
    "currentAddress": "123 Main St, City",
    "permanentAddress": "123 Main St, City",
    "maritalStatus": "MARRIED",
    "gender": "MALE",
    "dateOfBirth": "1990-01-15",
    "aadhaarNumber": "123456789012",
    "panNumber": "ABCDE1234F",
    "passportNumber": "A1234567",
    "fatherName": "Father Name",
    "educationDetails": "B.Tech"
  },
  "employmentDetails": {
    "occupationType": "SALARIED",
    "employerOrBusinessName": "ABC Corporation",
    "designation": "Software Engineer",
    "totalWorkExperienceYears": 5,
    "officeAddress": "456 Office Street, City"
  },
  "loanDetails": {
    "loanType": "HOME_LOAN",
    "loanAmount": 5000000,
    "loanDurationMonths": 240,
    "purposeOfLoan": "Home purchase"
  },
  "existingLoanDetails": {
    "hasExistingLoans": true,
    "existingLoanType": "PERSONAL_LOAN",
    "lenderName": "HDFC Bank",
    "outstandingAmount": 200000,
    "monthlyEmi": 15000,
    "tenureRemainingMonths": 24
  },
  "references": [
    {
      "referenceNumber": 1,
      "name": "Reference One",
      "relationship": "Friend",
      "contactNumber": "9876543211",
      "address": "789 Reference Street"
    },
    {
      "referenceNumber": 2,
      "name": "Reference Two",
      "relationship": "Relative",
      "contactNumber": "9876543212",
      "address": "790 Reference Street"
    }
  ]
}
```
**IMPORTANT:** Save the `applicationId` from response (e.g., "LA20250001")

---

#### Step 8: Upload Documents (Multiple calls)
```
POST http://localhost:8080/api/documents/upload
Headers: Authorization: Bearer {customerToken}
Content-Type: multipart/form-data

Form Data:
- applicationId: LA20250001
- documentType: PHOTOGRAPH
- file: [select file]

Repeat for each document type:
- documentType: IDENTITY_PROOF
- documentType: ADDRESS_PROOF
- documentType: SALARY_SLIPS (if salaried)
- documentType: ITR_SALARIED (if salaried)
- documentType: BANK_STATEMENTS_SALARIED (if salaried)
- documentType: EMPLOYMENT_PROOF (if salaried)
- documentType: SALE_AGREEMENT (if home loan)
- documentType: EC_CERTIFICATE (if home loan)
- documentType: CIBIL_REPORT
```

---

#### Step 9: Check Notifications (Customer)
```
GET http://localhost:8080/api/notifications
Headers: Authorization: Bearer {customerToken}
```

---

#### Step 10: Get My Applications
```
GET http://localhost:8080/api/customer/applications
Headers: Authorization: Bearer {customerToken}
```

---

#### Step 11: Get Application Details
```
GET http://localhost:8080/api/customer/applications/LA20250001
Headers: Authorization: Bearer {customerToken}
```

---

### **Phase 3: Maker Flow**

#### Step 12: Check Maker Notifications
```
GET http://localhost:8080/api/notifications
Headers: Authorization: Bearer {makerToken}
```
You should see notification about new application submitted.

---

#### Step 13: Get Maker Dashboard Stats
```
GET http://localhost:8080/api/maker/dashboard/stats
Headers: Authorization: Bearer {makerToken}
```

---

#### Step 14: Get All Applications (Maker)
```
GET http://localhost:8080/api/maker/applications
Headers: Authorization: Bearer {makerToken}
```

Get applications with PENDING or WITH_MAKER status:
```
GET http://localhost:8080/api/maker/applications?status=WITH_MAKER
Headers: Authorization: Bearer {makerToken}
```

---

#### Step 15: Get Application Details (Maker)
```
GET http://localhost:8080/api/maker/applications/LA20250001
Headers: Authorization: Bearer {makerToken}
```

---

#### Step 16: Review Application - Approve
```
POST http://localhost:8080/api/maker/applications/{applicationId}/review
Headers: Authorization: Bearer {makerToken}
Body: {
  "action": "APPROVE",
  "comment": "All documents verified. Application looks good. Approved for checker review."
}
```
**Note:** Use the application `id` (Integer) from the application details, NOT the applicationId string.

---

#### Step 17: Review Application - Reject (Alternative)
```
POST http://localhost:8080/api/maker/applications/{applicationId}/review
Headers: Authorization: Bearer {makerToken}
Body: {
  "action": "REJECT",
  "comment": "Incomplete documentation. Application rejected."
}
```

---

### **Phase 4: Checker Flow**

#### Step 18: Check Checker Notifications
```
GET http://localhost:8080/api/notifications
Headers: Authorization: Bearer {checkerToken}
```
You should see notification about application sent by maker.

---

#### Step 19: Get Checker Dashboard Stats
```
GET http://localhost:8080/api/checker/dashboard/stats
Headers: Authorization: Bearer {checkerToken}
```

---

#### Step 20: Get Applications (Checker)
```
GET http://localhost:8080/api/checker/applications?status=WITH_CHECKER
Headers: Authorization: Bearer {checkerToken}
```

---

#### Step 21: Get Application Details (Checker)
```
GET http://localhost:8080/api/checker/applications/LA20250001
Headers: Authorization: Bearer {checkerToken}
```

---

#### Step 22: Review Application - Approve (Final)
```
POST http://localhost:8080/api/checker/applications/{applicationId}/review
Headers: Authorization: Bearer {checkerToken}
Body: {
  "action": "APPROVE",
  "comment": "Final approval. All verifications completed successfully."
}
```
**Note:** Use the application `id` (Integer).

---

#### Step 23: Review Application - Reject (Alternative)
```
POST http://localhost:8080/api/checker/applications/{applicationId}/review
Headers: Authorization: Bearer {checkerToken}
Body: {
  "action": "REJECT",
  "comment": "CIBIL score below threshold. Application rejected."
}
```

---

### **Phase 5: Verification**

#### Step 24: Check Notifications (All Users)
- Check customer notifications (should see approval/rejection)
- Check maker notifications (should see final status)
- Check checker notifications

---

#### Step 25: Verify Application Status
```
GET http://localhost:8080/api/customer/applications/LA20250001
Headers: Authorization: Bearer {customerToken}
```
Status should be APPROVED or REJECTED.

---

## Important Notes

### **Authentication:**
- All endpoints except `/api/auth/**` require JWT token
- Include header: `Authorization: Bearer <token>`
- Token expires after 24 hours (configurable in `application.properties`)

### **Status Values:**
- `WITH_MAKER` - Customer submitted, with maker
- `PENDING` - Pending review
- `WITH_CHECKER` - Approved by maker, with checker
- `APPROVED` - Approved by checker (final)
- `REJECTED` - Rejected by maker or checker

### **Data Types:**
- Documents stored as BYTEA (binary) in database
- Age calculated automatically from dateOfBirth
- ApplicationId format: `LA` + Year + 5-digit number
- All numeric fields are Integer except loan amounts (BigDecimal stored, Integer in DTOs for React)

### **Enums for Frontend:**
When creating dropdowns in frontend, use these exact values:

**Marital Status:** SINGLE, MARRIED, DIVORCED
**Gender:** MALE, FEMALE, OTHER
**Occupation Type:** SALARIED, SELF_EMPLOYED
**Loan Type:** PERSONAL_LOAN, HOME_LOAN, VEHICLE_LOAN
**Document Types:** As listed in Document Upload section

### **Error Handling:**
- 401 Unauthorized: Invalid or missing token
- 404 Not Found: Resource not found
- 400 Bad Request: Validation error or invalid input
- 500 Internal Server Error: Server error

### **Response Format for Errors:**
```json
{
  "message": "Error message",
  "timestamp": "2025-01-15T10:30:00",
  "status": 400
}
```

---

## Complete Workflow Summary

```
1. Customer Signs Up → /api/auth/signup
2. Customer Logs In → /api/auth/login (Gets token)
3. Customer Submits Application → /api/customer/applications
4. Customer Uploads Documents → /api/documents/upload (Multiple times)
5. Maker Gets Notified (Automatic)
6. Maker Views Dashboard → /api/maker/dashboard/stats
7. Maker Views Applications → /api/maker/applications
8. Maker Reviews Application → /api/maker/applications/{id}/review
   - If APPROVE → Status: WITH_CHECKER
   - If REJECT → Status: REJECTED
9. Checker Gets Notified (if approved)
10. Checker Views Dashboard → /api/checker/dashboard/stats
11. Checker Views Applications → /api/checker/applications?status=WITH_CHECKER
12. Checker Reviews Application → /api/checker/applications/{id}/review
    - If APPROVE → Status: APPROVED (Final)
    - If REJECT → Status: REJECTED
13. Customer and Maker Get Notified (if checker decides)
14. All parties can view final status via respective endpoints
```

---

## Testing Tips

1. **Use Postman Collections:** Create separate folders for Customer, Maker, Checker
2. **Environment Variables:** Set tokens as variables for easy switching
3. **Test Error Cases:** Try invalid tokens, missing fields, etc.
4. **Validate Status Changes:** Check application status after each review action
5. **Document Upload:** Test with different file types and sizes (max 10MB)
6. **Notification Flow:** Verify notifications are created at each step
7. **Comments:** Ensure comments are saved and visible in application details

---

## Database Schema Notes

- Tables created automatically by JPA (`spring.jpa.hibernate.ddl-auto=update`)
- All relationships properly mapped with JPA annotations
- Documents stored as BYTEA (byte array) not file paths
- Unique constraints on: email (users), applicationId (applications)
- Foreign keys maintained for referential integrity

---

This documentation covers all endpoints in your Loan Origination System backend. Use it to test the complete workflow in Swagger/Postman.


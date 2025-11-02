# API Endpoints Quick Reference

## Public Endpoints (No Auth Required)

### Authentication
- `POST /api/auth/signup` - Customer registration
- `POST /api/auth/login` - Login for all roles

---

## Protected Endpoints (Require JWT Token)
Header: `Authorization: Bearer <token>`

### Customer Routes (`/api/customer`)
- `GET /api/customer/profile` - Get profile
- `PUT /api/customer/profile` - Update profile
- `POST /api/customer/applications` - Submit loan application
- `GET /api/customer/applications` - Get my applications list
- `GET /api/customer/applications/{applicationId}` - Get application details (use string like "LA20250001")

### Maker Routes (`/api/maker`)
- `GET /api/maker/dashboard/stats` - Dashboard statistics
- `GET /api/maker/applications` - Get all applications (optional ?status=PENDING)
- `GET /api/maker/applications/{applicationId}` - Get application details (use string like "LA20250001")
- `POST /api/maker/applications/{applicationId}/review` - Review application (use Integer `id`, not `applicationId`)
- `GET /api/maker/profile` - Get profile

### Checker Routes (`/api/checker`)
- `GET /api/checker/dashboard/stats` - Dashboard statistics
- `GET /api/checker/applications` - Get all applications (optional ?status=WITH_CHECKER)
- `GET /api/checker/applications/{applicationId}` - Get application details (use string like "LA20250001")
- `POST /api/checker/applications/{applicationId}/review` - Review application (use Integer `id`, not `applicationId`)
- `GET /api/checker/profile` - Get profile

### Documents (`/api/documents`)
- `POST /api/documents/upload` - Upload document (multipart/form-data)
- `GET /api/documents/{documentId}` - Download document (use Integer `id`)
- `GET /api/documents/application/{applicationId}` - Get document types by application (use string like "LA20250001")

### Notifications (`/api/notifications`)
- `GET /api/notifications` - Get user notifications
- `POST /api/notifications/{notificationId}/read` - Mark as read
- `GET /api/notifications/unread-count` - Get unread count

---

## Important Path Variable Notes

⚠️ **CRITICAL:** The review endpoints use **Integer `id`** from the database, not the `applicationId` string!

Example:
1. Get application details to find the `id`:
   ```
   GET /api/maker/applications/LA20250001
   Response includes: { "id": 123, "applicationId": "LA20250001", ... }
   ```

2. Use the `id` (123) for review:
   ```
   POST /api/maker/applications/123/review
   ```

This inconsistency should be noted in your testing!

---

## Status Flow

```
WITH_MAKER → (Maker Approves) → WITH_CHECKER → (Checker Approves) → APPROVED
WITH_MAKER → (Maker Rejects) → REJECTED
WITH_CHECKER → (Checker Rejects) → REJECTED
```

---

## Pre-seeded Users

**Maker:**
- Email: `sameer.maker@example.com`
- Password: `maker123`

**Checker:**
- Email: `rakesh.checker@example.com`
- Password: `checker123`

---

## Enum Values for Dropdowns

**Marital Status:** `SINGLE`, `MARRIED`, `DIVORCED`
**Gender:** `MALE`, `FEMALE`, `OTHER`
**Occupation:** `SALARIED`, `SELF_EMPLOYED`
**Loan Type:** `PERSONAL_LOAN`, `HOME_LOAN`, `VEHICLE_LOAN`

Frontend should send these exact uppercase values.


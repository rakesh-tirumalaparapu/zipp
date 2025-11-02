-- Script to clear all data from PostgreSQL database
-- Run this in your PostgreSQL client (pgAdmin, DBeaver, or psql)

-- Disable foreign key checks temporarily (if needed)
SET session_replication_role = 'replica';

-- Delete in order to respect foreign key constraints
-- Start with dependent tables first

-- 1. Delete documents (references applications)
DELETE FROM documents;

-- 2. Delete comments (references applications)
DELETE FROM comments;

-- 3. Delete notifications (references applications/users)
DELETE FROM notifications;

-- 4. Delete references (references applications)
DELETE FROM application_references;

-- 5. Delete existing loan details (references applications)
DELETE FROM existing_loan_details;

-- 6. Delete loan details (references applications)
DELETE FROM loan_details;

-- 7. Delete employment details (references applications)
DELETE FROM employment_details;

-- 8. Delete personal details (references applications)
DELETE FROM personal_details;

-- 9. Delete applications (references users)
DELETE FROM applications;

-- 10. Delete users (except if you want to keep admin users)
DELETE FROM users WHERE role != 'ADMIN';

-- Or to delete ALL users including admin:
-- DELETE FROM users;

-- Re-enable foreign key checks
SET session_replication_role = 'origin';

-- Reset sequences (if using auto-increment IDs)
-- Note: Adjust sequence names based on your actual table structure
-- ALTER SEQUENCE users_id_seq RESTART WITH 1;
-- ALTER SEQUENCE applications_id_seq RESTART WITH 1;
-- ALTER SEQUENCE documents_id_seq RESTART WITH 1;
-- ALTER SEQUENCE comments_id_seq RESTART WITH 1;
-- ALTER SEQUENCE notifications_id_seq RESTART WITH 1;

-- Verify deletion
SELECT 'Users: ' || COUNT(*) FROM users;
SELECT 'Applications: ' || COUNT(*) FROM applications;
SELECT 'Documents: ' || COUNT(*) FROM documents;
SELECT 'Comments: ' || COUNT(*) FROM comments;
SELECT 'Notifications: ' || COUNT(*) FROM notifications;


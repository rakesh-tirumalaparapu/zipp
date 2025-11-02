-- Quick method using TRUNCATE CASCADE (faster and resets sequences automatically)
-- This will delete ALL data from all tables in the correct order

TRUNCATE TABLE 
    documents,
    comments,
    notifications,
    application_references,
    existing_loan_details,
    loan_details,
    employment_details,
    personal_details,
    applications,
    users
CASCADE;

-- Verify deletion
SELECT 'Users: ' || COUNT(*) FROM users;
SELECT 'Applications: ' || COUNT(*) FROM applications;
SELECT 'Documents: ' || COUNT(*) FROM documents;
SELECT 'Comments: ' || COUNT(*) FROM comments;
SELECT 'Notifications: ' || COUNT(*) FROM notifications;



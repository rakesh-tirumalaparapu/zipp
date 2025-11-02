-- Add security questions for pre-seeded Maker and Checker users
-- This enables password reset functionality for these users

-- Update Maker user security questions
UPDATE users 
SET 
    favorite_city = 'mumbai',
    favorite_food = 'pizza',
    favorite_color = 'blue'
WHERE email = 'sameer.maker@example.com'
  AND (favorite_city IS NULL OR favorite_city = '');

-- Update Checker user security questions
UPDATE users 
SET 
    favorite_city = 'bangalore',
    favorite_food = 'burger',
    favorite_color = 'green'
WHERE email = 'rakesh.checker@example.com'
  AND (favorite_city IS NULL OR favorite_city = '');



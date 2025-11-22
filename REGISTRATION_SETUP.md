# Registration System Setup Guide

## What I've Created

### 1. **Sign Up Form Page** (`app/signupformpage.tsx`)
A complete registration form with:
- Full Name input
- Email input (with validation)
- Phone Number input (with validation)
- Password input (minimum 6 characters)
- Confirm Password input (must match)
- Form validation with error messages
- Loading state during submission
- Success/error alerts

### 2. **Updated Backend** (`Backend/server.js`)
Added `/register` endpoint that:
- Validates all required fields
- Checks if email already exists
- Inserts new user into MySQL database
- Returns appropriate success/error messages

### 3. **Updated Sign Up Page** (`app/signup.tsx`)
- Added router navigation
- "Sign Up Free" button now navigates to the form page

## Database Setup

Make sure your MySQL database has a `users` table with these columns:

```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## How to Test

### 1. Start the Backend Server
```powershell
cd Backend
node server.js
```

You should see:
- "Connected to MySQL database"
- "Server running on port 3000"

### 2. Update the API URL (for physical device testing)

If testing on a physical device, update the fetch URL in `signupformpage.tsx`:

Find your computer's IP address:
```powershell
ipconfig
```

Look for "IPv4 Address" (e.g., 192.168.1.100)

Then in `signupformpage.tsx`, change:
```typescript
const response = await fetch('http://localhost:3000/register', {
```

To:
```typescript
const response = await fetch('http://YOUR_IP_ADDRESS:3000/register', {
```

### 3. Start the Expo App
```powershell
cd spotify_app_clone
npx expo start
```

### 4. Test the Flow

1. Open the app
2. Navigate to Sign Up page
3. Click "Sign Up Free"
4. Fill in the registration form:
   - Full Name: John Doe
   - Email: john@example.com
   - Phone: 1234567890
   - Password: password123
   - Confirm Password: password123
5. Click "CREATE ACCOUNT"
6. On success, you'll be redirected to login

## Features Implemented

✅ Form validation (all fields required)
✅ Email format validation
✅ Phone number validation
✅ Password minimum length (6 characters)
✅ Password confirmation matching
✅ Duplicate email detection
✅ Error handling and user feedback
✅ Loading states
✅ Database storage (MySQL)
✅ Navigation back to login after success

## Testing Different Scenarios

1. **Empty form**: Try to submit without filling fields
2. **Invalid email**: Enter "notanemail" 
3. **Short password**: Enter password with less than 6 characters
4. **Password mismatch**: Enter different passwords
5. **Duplicate email**: Register twice with same email
6. **Successful registration**: Fill all fields correctly

## Security Notes (TODO for Production)

⚠️ Current implementation stores passwords in plain text. Before production:
- Install bcrypt: `npm install bcrypt`
- Hash passwords before storing
- Add password strength requirements
- Implement JWT tokens for authentication
- Add rate limiting
- Use HTTPS in production

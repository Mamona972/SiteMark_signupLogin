 React.js, Node.js, Express.js, MongoDB, JWT, Cookies, Passport.js (Google OAuth)

Description:
I developed a secure, full-featured authentication system for a modern web application using a React frontend and a Node.js + Express.js backend, implementing multiple login methods and security best practices.

Features:
User Registration & Login (Local):
Form-based sign-up with username, email, password
Passwords are securely hashed using bcrypt
Input validation and error handling on both client and server sides

Token-Based Authentication:
Uses JWT (JSON Web Tokens) for access control
On successful login, the server issues a JWT token and stores user ID in a secure HTTP-only cookie
Protected routes verify token validity before granting access

Session Management:
Persistent sessions with cookies (HTTP-only & secure)
Users remain logged in across browser refreshes
Logout clears the token and cookie

Google OAuth Login:
Integrated Google Sign-In using Passport.js Google OAuth strategy
New users are automatically registered with their Google profile
Existing Google users are seamlessly logged in

Security:
Implements best practices:
Hashed passwords
Token expiration
Secure cookie flags (HttpOnly)

Frontend (React):
Clean UI for sign-up, login, and OAuth login buttons
User-friendly form validation
Conditional rendering based on authentication state (e.g., show/hide logout)

Project Goals Achieved:
Ensured scalability and maintainability with a clear MVC structure on the backend
Achieved multi-authentication support (email/password + Google login)
Enhanced user experience with seamless session persistence

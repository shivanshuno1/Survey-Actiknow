# Backend - MongoDB Users DB

This backend folder contains a minimal Express server and a Mongoose-based connection helper to talk to a Users collection.

Quick start

1. Copy `.env.example` to `.env` and set `MONGODB_URI`.
2. Install dependencies:

   npm install express mongoose dotenv

3. Start the server:

   node ./backend/server.js

Endpoints (for testing)

- GET /users — list users (password not returned)
- POST /users — create user (body: { email, password })

Notes

- Passwords are stored in plain text in this example. For any real app, hash passwords (bcrypt/scrypt) and add validation and rate limiting.
- You can import the `connectDB` and `User` model from `backend/database.js` in other server modules.

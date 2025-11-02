"""
# MERN Blog — Fullstack Example

This repository is a MERN (MongoDB, Express, React, Node) blog example used for a Week 4 assignment. It contains a simple Express API server with Mongoose models and a React front-end built with Vite.

This README explains how to install dependencies, configure environment variables, run the app (server + client), and how to exercise the API (including authentication).

## Contents

- `server/` — Express API, Mongoose models, routes, middleware.
- `client/` — React application (Vite) with pages, components, and an API service.
- `Week4-Assignment.md` — assignment description and tasks.

---

## Prerequisites

- Node.js (v18+ recommended)
- npm (comes with Node) or yarn
- MongoDB (either a local mongod or a hosted Atlas cluster)
- Recommended: a REST client like Postman or HTTPie for manual API testing

## Quick start — server + client

1. Open two terminals (PowerShell recommended on Windows).

2. Server: create `.env` from the example and update values.

```powershell
cd server
Copy-Item .env.example .env
# Edit server\.env and set a valid MONGODB_URI and JWT_SECRET
```

Edit `server/.env` and set at minimum:

```
MONGODB_URI=mongodb://localhost:27017/mern_blog
JWT_SECRET=replace_with_a_secure_random_value
PORT=5000
NODE_ENV=development
```

3. Install server dependencies and start server:

```powershell
cd server
npm install
npm run dev
```

If the server fails with a Mongoose error about `uri` being undefined, ensure `MONGODB_URI` is set in `server/.env` (see `.env.example`).

4. Client: configure API base URL (optional) and start client:

```powershell
cd client
# Optional: create .env with VITE_API_URL if your server runs on a non-default address
# Example client\.env content:
# VITE_API_URL=http://localhost:5000/api

npm install
npm run dev
```

Vite will print a local URL (commonly `http://localhost:5173`) — open it in your browser.

---

## Environment variables

- Server (`server/.env`):
  - `MONGODB_URI` — MongoDB connection string (required)
  - `JWT_SECRET` — secret to sign JWT tokens (required for auth)
  - `PORT` — server port (default 5000)
  - `NODE_ENV` — e.g. `development`

- Client (`client/.env`, optional):
  - `VITE_API_URL` — base API URL (default: `http://localhost:5000/api`)

---

## API reference (server)

All API routes are prefixed with `/api`.

Authentication:
- POST /api/auth/register — register a user
  - Body: { name, email, password }
  - Response: { success: true, data: { user, token } }

- POST /api/auth/login — login
  - Body: { email, password }
  - Response: { success: true, data: { user, token } }

Posts:
- GET /api/posts — list posts
  - Query params supported: `page`, `limit`, `category` (server implements basic listing)
  - Response: { success: true, data: [ ...posts ] }

- GET /api/posts/:id — get a post by id

- POST /api/posts — create a post (protected)
  - Header: Authorization: Bearer <token>
  - Body: { title, content, category, excerpt?, isPublished? }

- PUT /api/posts/:id — update a post (protected, owner-only)

- DELETE /api/posts/:id — delete a post (protected, owner-only)

Categories:
- GET /api/categories — list categories
- POST /api/categories — create a category

Notes: responses follow the pattern { success: boolean, data: ... } or { success: false, error: 'message' } for errors.

---

## How authentication works (overview)

- The server uses JWT tokens. After successful login/register the server returns a `token` and `user` object.
- The client stores the token and user in `localStorage` and sends the token in `Authorization: Bearer <token>` for protected requests (axios interceptor).
- Protected post endpoints require a valid token. The server sets `req.user.id` from the token and uses that as the `author` of posts.

## Creating a new post from the client

1. Register or login via the front-end (`/register` or `/login`).
2. After a successful login the client will store the token and show your username in the navigation.
3. Go to `Create Post` (`/posts/new`) and submit the form. The client sends a POST to `/api/posts` with the token attached; the server will save the post to MongoDB and set the `author` automatically.

Example curl (register):

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","password":"secret"}'
```

Example curl (create post — replace <TOKEN> and <CATEGORY_ID>):

```bash
curl -X POST http://localhost:5000/api/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{"title":"My post","content":"Hello","category":"<CATEGORY_ID>"}'
```

---

## Troubleshooting

- Mongoose connection errors: check `server/.env` for `MONGODB_URI`. If using a local MongoDB, ensure `mongod` is running. For Atlas, use the provided connection string and whitelist your IP.
- `JWT_SECRET` missing: server will fail to sign/verify tokens. Set `JWT_SECRET` in `server/.env`.
- CORS errors: the server enables CORS for common dev use. If your front-end runs on a different host/port, ensure the server allows it or set `VITE_API_URL` accordingly.
- If you see `401 Unauthorized` when calling protected endpoints, ensure the client attaches the token in the `Authorization` header as `Bearer <token>`.

---

## Development notes and next steps

- Authentication is implemented (JWT). The server enforces ownership on update/delete for posts.
- Next improvements you might implement:
  - Image upload for featured images (multer on server, form file input on client)
  - Pagination and search on server-side (query handling and indexes)
  - Comments API and UI
  - Unit/integration tests (Jest + Supertest)

## Contributing

1. Fork the repository
2. Create a topic branch
3. Make changes and open a PR

---

If anything here is unclear or you'd like me to wire up a seed user script or add client-side protections (e.g., hiding edit/delete for non-owners), tell me and I will implement it.

"""
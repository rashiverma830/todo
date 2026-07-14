# Deployment Guide

This project is configured to be deployed with the Frontend on **Vercel** and the Backend on **Render**.

## 1. Backend Deployment (Render)
1. Push this repository to GitHub.
2. Go to [Render Dashboard](https://dashboard.render.com/) and create a new **Web Service**.
3. Connect your GitHub repository and select the `backend` folder as the Root Directory.
4. Set the Environment to `Node`.
5. The **Build Command** should be: `npm install`
6. The **Start Command** should be: `npm start`
7. Add the following **Environment Variables**:
   - `PORT`: `5000` (or let Render assign one)
   - `MONGODB_URI`: Your MongoDB Atlas connection string.
8. Click **Create Web Service**. Once deployed, copy the backend URL (e.g., `https://your-backend.onrender.com`).

## 2. Frontend Deployment (Vercel)
1. Go to [Vercel Dashboard](https://vercel.com/dashboard) and create a **New Project**.
2. Import this GitHub repository.
3. Set the **Root Directory** to `frontend`.
4. In the **Environment Variables** section, add:
   - `VITE_API_URL`: `https://your-backend.onrender.com/api` (Replace with your actual Render backend URL followed by `/api`)
5. Click **Deploy**.

## Features Included for Deployment
- `vercel.json` added in the frontend to handle React Router client-side routing (prevents 404s on reload).
- Backend `package.json` includes the required `npm start` script.
- Frontend API calls use `import.meta.env.VITE_API_URL` to dynamically connect to the backend.
- `.env.example` files provided for both frontend and backend.

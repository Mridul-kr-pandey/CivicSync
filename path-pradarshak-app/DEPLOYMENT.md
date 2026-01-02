# Deployment Guide for CivicSync

This guide walks you through deploying the CivicSync application (Frontend + Backend + Database).

## 1. Prerequisites
- [GitHub Account](https://github.com/)
- [MongoDB Atlas Account](https://www.mongodb.com/cloud/atlas) (Free tier)
- [Cloudinary Account](https://cloudinary.com/) (Free tier)
- [Vercel Account](https://vercel.com/) (For Frontend)
- [Railway Account](https://railway.app/) or [Render Account](https://render.com/) (For Backend)

---

## 2. Push Code to GitHub
Ensure your code is pushed to a GitHub repository.
```bash
git init
git add .
git commit -m "Ready for deployment"
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

---

## 3. Database Setup (MongoDB Atlas)
1. Log in to MongoDB Atlas and create a new **Cluster** (Free/Shared).
2. Create a **Database User** (username/password) in "Database Access".
3. Allow access from **Anywhere (0.0.0.0/0)** in "Network Access".
4. Go to **Database** > **Connect** > **Drivers** and copy the Connection String.
   - Replace `<password>` with your database user password.
   - Example: `mongodb+srv://user:pass@cluster0.mongodb.net/?retryWrites=true&w=majority`

---

## 4. Backend Deployment (Railway/Render)
We recommend **Railway** or **Render** for Node.js backends.

### Option A: Railway
1. Log in to [Railway](https://railway.app/) and create a **New Project** > **Deploy from GitHub repo**.
2. Select your repository.
3. Configure the **Root Directory** settings:
   - Railway might auto-detect `package.json` in root. **You need to point it to `backend` folder.**
   - Go to Settings > **Root Directory**: Set to `backend` (or `path-pradarshak-app/backend` if your repo root is higher).
4. Go to **Variables** and add these env vars:
   - `NODE_ENV`: `production`
   - `PORT`: `5000` (or leave default provided by platform)
   - `MONGODB_URI`: (Paste your Atlas connection string from Step 3)
   - `JWT_SECRET`: (Generate a random secure string)
   - `FRONTEND_URL`: (You will add your Vercel URL here later. For now use `*`)
   - `CLOUDINARY_CLOUD_NAME`: (Your Cloudinary Cloud Name)
   - `CLOUDINARY_API_KEY`: (Your Cloudinary API Key)
   - `CLOUDINARY_API_SECRET`: (Your Cloudinary API Secret)
   - `GOOGLE_CLIENT_ID` / `GITHUB_CLIENT_ID`: (Your OAuth keys, optional for start)
5. Deploy. Wait for it to succeed. Copy the **Public Domain** (e.g., `https://civicsync-backend.up.railway.app`).

---

## 5. Frontend Deployment (Vercel)
1. Log in to [Vercel](https://vercel.com/) and click **Add New** > **Project**.
2. Import your GitHub repository.
3. Configure **Project Settings**:
   - **Framework Preset**: Next.js
   - **Root Directory**: Click "Edit" and select `path-pradarshak-app` (the frontend folder).
4. **Environment Variables**:
   - `NEXT_PUBLIC_API_URL`: (Paste your Backend URL from Step 4 + `/api`)
     - Example: `https://civicsync-backend.up.railway.app/api`
   - `NEXT_PUBLIC_SOCKET_URL`: (Paste your Backend URL from Step 4)
     - Example: `https://civicsync-backend.up.railway.app`
5. Click **Deploy**.

---

## 6. Final Configuration
1. Once Frontend is deployed, copy the Vercel Domain (e.g., `https://civicsync.vercel.app`).
2. Go back to your Backend (Railway/Render) settings.
3. Update `FRONTEND_URL` variable to your actual Vercel domain.
4. Redeploy Backend.

🎉 **Deployment Complete!**

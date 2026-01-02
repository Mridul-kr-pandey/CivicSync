# 🚀 CivicSync

A modern civic engagement platform built with Next.js and Node.js, designed to connect citizens with their local government and community initiatives.

## 📌 Tech Stack

- **Frontend**: Next.js 15.5.2 + Tailwind CSS 4 + React 19
- **Backend**: Node.js + Express.js + MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Email Service**: Gmail SMTP
- **Development**: ESLint + Turbopack

## 🏗️ Project Structure

```
CivicSync/
├── path-pradarshak-app/   # Next.js Frontend
│   ├── app/               # App router pages
│   ├── components/        # UI Components
│   ├── backend/           # Express.js Backend
│   │   ├── controllers/   # Route controllers
│   │   ├── models/        # Database models
│   │   ├── routes/        # API routes
│   │   └── server.js      # Server entry point
│   └── package.json
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (running locally on port 27017)
- Google/GitHub OAuth credentials (optional, for social login)

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/Mridul-kr-pandey/CivicSync.git
cd CivicSync
```

### 2️⃣ Backend Setup

```bash
cd path-pradarshak-app/backend
npm install
```

**Configuration**: Create a `.env` file in `path-pradarshak-app/backend/` with:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/accountability_partner
FRONTEND_URL=http://localhost:3000
JWT_SECRET=your_jwt_secret_key

# Optional: Social Login Credentials
GOOGLE_CLIENT_ID=your_id
GOOGLE_CLIENT_SECRET=your_secret
GITHUB_CLIENT_ID=your_id
GITHUB_CLIENT_SECRET=your_secret
```

**Run Server**:
```bash
npm run dev
# Server runs on http://localhost:5000
```

### 3️⃣ Frontend Setup

Open a new terminal:

```bash
cd path-pradarshak-app
npm install
npm run dev
```

👉 **Application will be available at**: http://localhost:3000



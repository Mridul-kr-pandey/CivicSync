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
├── frontend/          # Next.js application
│   ├── src/
│   │   └── app/       # App router pages
│   ├── public/        # Static assets
│   └── package.json
├── backend/           # Express.js API server
│   ├── controllers/   # Route controllers
│   ├── models/        # Database models
│   ├── routes/        # API routes
│   ├── src/           # Source code
│   └── package.json
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- MongoDB (local or cloud instance)
- Gmail account for SMTP

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/Mridul-kr-pandey/CivicSync.git
cd CivicSync
```

### 2️⃣ Frontend Setup (Next.js + Tailwind)

```bash
cd frontend
npm install
npm run dev
```

👉 **Frontend will be available at**: http://localhost:3000

### 3️⃣ Backend Setup (Node.js + Express + MongoDB)

```bash
cd backend
npm install
npm run dev
```

👉 **Backend API will run on**: http://localhost:5000

## ⚙️ Environment Configuration

### Backend Environment Variables

Create a `.env` file in the `backend/` directory:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/civicsync
JWT_SECRET=your-super-secret-jwt-key-here
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-gmail-app-password
```

### Frontend Environment Variables (Optional)

Create a `.env.local` file in the `frontend/` directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## 🔧 Development Scripts

### Frontend Commands

```bash
cd frontend

# Development server with Turbopack
npm run dev

# Production build
npm run build

# Start production server
npm start

# Run ESLint
npm run lint
```

### Backend Commands

```bash
cd backend

# Start development server
npm run dev

# Run tests (when implemented)
npm test
```

## 📧 Gmail SMTP Setup

To use Gmail SMTP for email functionality:

1. Enable 2-Factor Authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a new app password for "Mail"
3. Use the generated app password in your `SMTP_PASS` environment variable

## 🗄️ Database Setup

### MongoDB Local Installation

1. Install MongoDB Community Edition
2. Start MongoDB service
3. Create a database named `civicsync`
4. Update `MONGO_URI` in your `.env` file

### MongoDB Atlas (Cloud)

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get your connection string
4. Update `MONGO_URI` in your `.env` file

## 🚀 Deployment

### Frontend (Vercel)

1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com)
3. Deploy automatically

### Backend (Railway/Heroku)

1. Create a new project on [Railway](https://railway.app) or [Heroku](https://heroku.com)
2. Connect your GitHub repository
3. Add environment variables
4. Deploy

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Mridul Kumar Pandey** - [GitHub](https://github.com/Mridul-kr-pandey)

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/Mridul-kr-pandey/CivicSync/issues) page
2. Create a new issue with detailed information
3. Contact the maintainers

## 🔮 Roadmap

- [ ] User authentication and authorization
- [ ] Civic issue reporting system
- [ ] Government response tracking
- [ ] Community discussion forums
- [ ] Mobile app development
- [ ] Real-time notifications
- [ ] Analytics dashboard

---

**Happy Coding! 🎉**

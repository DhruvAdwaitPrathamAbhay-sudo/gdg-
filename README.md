# Smart Finance Advisor (Student Capital) 🚀

A modern, dynamic, and beautifully animated financial dashboard designed to help users track their cash flow, manage strict monthly budgets, and obtain automated, AI-driven investment strategies based on their unique savings rate. 

![Project Overview](https://img.shields.io/badge/Status-Active-success) ![Tech Stack](https://img.shields.io/badge/Stack-React_|_Node.js_|_MongoDB-blue)

## ✨ Key Features

- 💳 **Micro-Expense Tracking**: Add, categorize, and inline-edit your daily expenses instantly. Support for dynamic categories including Shopping, Healthcare, Tuition, and Utilities.
- 📊 **Real-time Financial Analysis**: Instant calculations of your monthly burn rate, budget buffers, and dynamic visual charts mapping your net savings.
- 🤖 **Predictive AI Investment Strategies**: The app calculates your exact available capital and suggests a custom-tailored Systematic Investment Plan (SIP). Whether you only have $50 (recommending ultra-safe Cash-Equivalents) or $500+ (recommending high-growth Blue Chips).
- ☁️ **Cloud Persistence architecture**: Persisted in MongoDB for continuous cross-device synchronization and zero local data loss.
- 🎨 **Glassmorphic Cyber-Aesthetics**: Built with React, TailwindCSS, and Framer Motion to deliver a premium, highly responsive dark-mode styling with stunning micro-animations.

## 🛠️ Technology Stack

- **Frontend:** React, Vite, Tailwind CSS, Framer Motion, Lucide-React
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Deployment:** Vercel

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18+)
- A MongoDB instance (MongoDB Atlas or local MongoDB)

### 2. Environment Setup
Create a `.env` file in the root directory and configure your backend port and MongoDB URI:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret
```

Optional: set `JWT_SECRET` in your `.env` for real authentication (required outside local dev).

### 3. Installation
Install dependencies for both the frontend and backend:
```bash
# Install frontend deps
npm install

# Install backend deps
cd server
npm install
cd ..
```

### 4. Running the App
Spin up the frontend and backend simultaneously:
```bash
# Run the Vite React Frontend
npm run dev

# Run the Express server (in a separate terminal)
node server/index.cjs
```

The application will be running locally at `http://localhost:5173`.

---
*Built with ❤️ for Google Prompt Wars / GDG Ecosystem.*

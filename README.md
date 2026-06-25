# Splitwiser (SplitSmart) 💸

![Splitwiser Web Mockup](https://res.cloudinary.com/dhjkbcdfm/image/upload/v1782228409/portfolio_assets/mockup-splitwiser-desktop.png)

> **AI-Powered Group Expense Manager & Debt Simplification Platform**  
> Built by [Mohit Lakhara](https://github.com/mohitlakhara-ind) | React Native (Expo) • React (Vite) • Node.js/Express • Mongoose (MongoDB)

Splitwiser is a modern, cross-platform expense sharing application designed for roommates, travelers, and groups. It features glassmorphism dark UIs, automatic receipt scanning, a custom debt minimization graph algorithm, and one-tap payment nudge sheets.

---

## ✨ Features

### 🧠 Core Engineering
* **Graph-Based Debt Simplification** – Custom algorithm analyzing group transactions to compute the minimal set of transfer payments required to settle all debts.
* **Dual-Client Client Monorepo** – Seamlessly syncs data across a **React Native mobile client** and a **Vite React web app** connecting to a unified backend.
* **JWT Authentication** – Secure sessions with access and refresh token rotation.

### 🤖 AI & FinTech
* **AI Bill Scanner** – Utilizes OCR (OCR.space API) to scan printed receipts, parse merchants, totals, and line items, and auto-populate the expense forms.
* **Interactive Spending Analytics** – Dark-theme charts visualizing spending trends, category distributions, and individual contributions.
* **One-Tap Settlement Nudges** – Generates formatted UPI payment reminders with settlement data, launching the native share sheet for WhatsApp/SMS.

---

## 🎨 Preview

<div align="center">
  <img src="https://res.cloudinary.com/dhjkbcdfm/image/upload/v1782228409/portfolio_assets/mockup-splitwiser-app.png" width="320" alt="Splitwiser Mobile Client" />
</div>

---

## 🛠️ Tech Stack

| Component | Technology |
| :--- | :--- |
| **Mobile App** | React Native, Expo SDK 52, Expo Router (File-based) |
| **Web Client** | React 18, Vite, TypeScript, Tailwind CSS |
| **Backend API** | Node.js, Express, Mongoose |
| **Database** | MongoDB (supports MongoDB Memory Server for testing) |
| **Services** | OCR.space API, Firebase Admin SDK |

---

## 📂 Monorepo Structure

```
splitsmart/
├── mobile/            # Expo React Native App
│   ├── app/           # Expo Router file-based views
│   ├── components/    # Glassmorphic UI & Balance cards
│   ├── context/       # Authentication & groups state management
│   └── api/           # Mobile API client layer
├── web/               # React + Vite Web Client
│   ├── src/           # Component layouts and pages
│   └── services/      # Web API client layer
└── backend-node/      # Express Node.js & TypeScript Backend
    ├── src/           # API routes, middlewares, controllers
    └── tsconfig.json  # TypeScript configuration
```

---

## 🚀 Getting Started

### 1. Backend Setup (`backend-node`)
```bash
cd backend-node
npm install

# Setup environment variables
cp .env.example .env
# Fill in PORT, MONGODB_URI, JWT_SECRET, etc.

# Run in development
npm run dev
```

### 2. Mobile App Setup (`mobile`)
```bash
cd mobile
npm install

# Start development packager
npx expo start
```
*Scan the QR code with Expo Go on your mobile device.*

### 3. Web Client Setup (`web`)
```bash
cd web
npm install

# Run Vite dev server
npm run dev
```

---

## 📄 License
MIT — © 2026 Mohit Lakhara

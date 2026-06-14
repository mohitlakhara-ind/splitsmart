# SplitSmart — Smart Group Expense Manager

> Built by [Mohit Lakhara](https://github.com/mohitlakhara-ind) | React Native / Expo · TypeScript · FastAPI

A modern, dark-themed expense splitting app with AI-powered bill scanning, expense analytics, and one-tap settlement reminders. Built for friend groups, roommates, and travel squads.

---

## ✨ Features

### Core
- **Group Expense Tracking** — Create groups, add members, log expenses with equal/percentage/custom splits
- **Debt Simplification** — Graph algorithm minimizes transactions to settle group debts
- **Multi-Currency Support** — Handle expenses in INR, USD, EUR and more
- **Receipt Management** — Attach images to expenses for reference

### 🆕 Unique Features (Added by Mohit)
1. **🤖 AI Bill Scanner** — Point your camera at any receipt. OCR extracts the merchant name, date, line items, and total amount — auto-fills the expense form in seconds.
2. **📊 Expense Insights** — Monthly/weekly analytics dashboard showing category-wise spending with animated bar charts and member contribution breakdown.
3. **📤 WhatsApp Settlement Reminder** — One tap generates a formatted payment reminder (with expense breakdown + UPI details) and opens the native share sheet for WhatsApp/SMS.

---

## 🎨 Design System

| Token | Value |
|-------|-------|
| Primary | `#7C3AED` (Violet 600) |
| Accent | `#06B6D4` (Cyan 500) |
| Background | `#0D0A1E` (Deep space dark) |
| Style | Glassmorphism dark mode |
| Typography | Poppins (400/500/600/700) |

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|------------|
| Mobile | Expo SDK 52 + React Native |
| Language | TypeScript |
| Navigation | Expo Router (file-based) |
| Styling | StyleSheet + custom theme system |
| Backend | FastAPI (Python) |
| Database | MongoDB |
| Auth | JWT with refresh token rotation |
| OCR | OCR.space API (free tier) |
| State | React Context |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Expo CLI (`npm install -g expo-cli`)
- Expo Go app on your device

### Frontend (Mobile App)
```bash
cd mobile
npm install
npx expo start
```

Scan the QR code with Expo Go (Android) or Camera app (iOS).

### Backend (FastAPI)
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
cp .env.example .env   # Fill in MongoDB URI
uvicorn main:app --reload
```

---

## 📱 Screens

- **Onboarding** — Animated gradient splash with Google OAuth
- **Home** — Balance overview with animated bar + recent expenses
- **Groups** — Group cards with member avatars and quick settle CTA
- **Add Expense** — Smart form with split calculator and receipt attachment
- **Bill Scanner** *(new)* — OCR-powered receipt parser
- **Insights** *(new)* — Animated spending charts and member breakdown
- **Settlement Reminder** *(new)* — Pre-formatted WhatsApp/SMS messages

---

## 📂 Project Structure

```
splitsmart/
├── mobile/
│   ├── app/              # Expo Router screens
│   ├── components/       # Reusable UI (GlassCard, AnimatedBalanceBar)
│   ├── screens/          # Feature screens
│   ├── theme/            # Design system tokens
│   ├── context/          # Auth + Groups state
│   └── api/              # API client layer
└── backend/
    ├── routers/          # FastAPI route handlers
    ├── models/           # MongoDB document models
    └── services/         # Business logic
```

---

## 📄 License

MIT — © 2026 Mohit Lakhara

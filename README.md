# 💰 Muneh Thracker - Expense Tracker

A comprehensive web application for tracking personal finances, visualizing spending patterns, and generating financial reports.

![Muneh Thracker Preview](https://github.com/user-attachments/assets/d4c1ce0c-4a4b-455c-84d2-e56b27851dfd)


## ✨ Features

- **Transaction Management**: Easily record, categorize and track both income and expenses
- **Visual Analytics**: View your financial data through intuitive charts and graphs to identify spending patterns
- **Detailed Reports**: Generate custom reports filtered by date, category, or transaction type
- **Category Management**: Organize transactions with customizable categories
- **Responsive Design**: Access your financial data on any device - desktop, tablet, or mobile
- **Secure Authentication**: Keep your financial data private with Firebase authentication
- **Real-time Updates**: See your financial data update in real-time thanks to Firebase integration

## 🚀 Live Demo

Try it out: [https://wolfptl-expense-tracker.vercel.app/](https://wolfptl-expense-tracker.vercel.app/)

## 🛠️ Technologies Used

- **Frontend Framework**: Vue.js
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Backend & Database**: Firebase
- **Authentication**: Firebase Authentication
- **Deployment**: Vercel

## 📋 Prerequisites

- Node.js
- npm or yarn
- Firebase account for backend services

## ⚙️ Installation

1. Clone the repository:
```sh
git clone https://github.com/wolfparktaerim/expense.git
cd expense
```

2. Install dependencies:
```sh
npm install
# or
yarn install
```

3. Create a `.env` file in the root directory and add your Firebase configuration:
```
VITE_FIREBASE_API_KEY = your_own_firebase_api_key
VITE_FIREBASE_APP_ID = your_own_firebase_app_id
VITE_FIREBASE_MEASUREMENT_ID = your_own_firebase_measurement_id
```

4. Locate frontend/src/main.js and edit Firebase configuration:
```
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: your_own_auth_domain,
  projectId: your_own_project_id,
  storageBucket: your_own_storage_bucket,
  messagingSenderId: your_own_measuring_sender_id,
  databaseURL:
    your_own_database_url,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};
```

5. Start the development server:
```sh
npm run dev
# or
yarn dev
```

6. Open your browser and visit:
```
http://localhost:5173
```

## 🏗️ Firebase Setup

1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Firestore Database
3. Set up Authentication (Email/Password at minimum)
4. Set up appropriate Firestore security rules
5. Add your web app to the Firebase project to get configuration values for your `.env` file and main.js file 

## 🏗️ Building for Production

```sh
npm run build
# or
yarn build
```

The build artifacts will be stored in the `dist/` directory.

## 📱 Mobile View

The application is fully responsive and provides an optimized experience on mobile devices.


# MediCare Patna 🏥

MediCare is Patna's premier digital health ecosystem, designed to provide seamless access to medical services including doctor appointments, emergency ward availability, diagnostic lab testing, and pharmaceutical services.

## 🚀 Features

* **Digital OPD Booking:** Book appointments with verified doctors across top hospitals in Patna (AIIMS, IGIMS, PMCH, Paras HMRI, etc.).
* **Real-time Synchronization:** Powered by Firebase Realtime Database for live updates on ward availability and hospital statuses.
* **Secure Authentication:** Integrated with Firebase Phone Authentication for secure, OTP-based login.
* **Diagnostic Labs:** Locate nearby testing centers and book health checkups.
* **Emergency & SOS:** Quick access to emergency wards, ambulances, and SOS contacts.
* **Offline Ready:** Built as a Progressive Web App (PWA) with local caching strategies to ensure functionality even on spotty networks.
* **Cross-Platform:** Available as a responsive web app and a native Android APK using Capacitor.

## 🛠️ Technology Stack

* **Frontend:** Vanilla JavaScript, HTML5, Modern CSS (Design System with Variables)
* **Backend / Database:** Firebase Realtime Database
* **Authentication:** Firebase Phone Auth (OTP)
* **Mobile Wrap:** Capacitor (Android)
* **Hosting:** Firebase Hosting

## 📦 Project Structure

```text
├── public/                 # Web root directory
│   ├── css/                # Stylesheets (base, components, variables)
│   ├── js/                 # Application logic
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # View logic for each route
│   │   ├── services/       # Core services (Auth, Firebase, Hospital data)
│   │   └── app.js          # App bootstrapping & routing
│   ├── index.html          # Main HTML shell
│   ├── sw.js               # Service Worker for PWA
│   └── manifest.json       # PWA manifest
├── android/                # Capacitor Android project files
├── seed-database.js        # Script to initialize Firebase with demo data
└── firebase.json           # Firebase Hosting configuration
```

## ⚙️ Setup & Installation

### Prerequisites
* Node.js & npm installed
* Firebase CLI installed (`npm install -g firebase-tools`)
* Android Studio (if building the Android APK)

### Local Development
1. Clone the repository:
   ```bash
   git clone https://github.com/sujayraj42/medicare-patna.git
   cd medicare-patna
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the local server:
   ```bash
   npm start
   ```

### Firebase Configuration
The application relies on Firebase. If setting up your own Firebase environment:
1. Create a Firebase project in the [Firebase Console](https://console.firebase.google.com/).
2. Enable **Realtime Database** and **Phone Authentication**.
3. Update `public/js/services/firebase.service.js` with your Firebase config.
4. Run `node seed-database.js` to populate the initial medical data.

## 📱 Building the Android App

1. Sync web assets with Capacitor:
   ```bash
   npx cap sync android
   ```
2. Open the project in Android Studio:
   ```bash
   npx cap open android
   ```
3. Build the APK from Android Studio.

## 📄 License

This project is licensed under the MIT License.

# MediMate – AI Healthcare Assistant

MediMate is an AI-powered healthcare screening assistant designed to analyze user symptoms in real-time, determine severity ratings, generate clinical health risk scores, and deliver instant emergency alerts. Utilizing the Google Gemini 3.5 Flash API on the backend and React on the frontend, it emulates a clinical triage helper with conversation history persistence, an analytics dashboard, and printable PDF reports.

Developed as a Master of Computer Applications (MCA) Mini Project.

---

## 👥 Authors & Academic Details

*   **Team Members:** 
    *   Neha Tripathi
    *   Aditya Dubey
    *   Preitika Nayak
*   **Course:** Master of Computer Applications (MCA)
*   **Academic Year:** 2025–2027
*   **College:** Aditya Institute of Management Studies and Research (AIMSR)
*   **Affiliation:** Mumbai University

---

## 📌 Project Overview

In resource-constrained or high-traffic medical environments, quick symptom triage is critical. **MediMate** acts as an intelligent, pre-clinical screening portal. By parsing free-text symptom descriptions, the system provides users with clinical insights, recommendations, and warning indicators before they visit a physical clinic. 

*Disclaimer: MediMate is designed for educational triage screening only. It does not replace professional clinical diagnosis or emergency medical care.*

---

## ⚡ Core Features

1.  **AI Symptom Analysis**: Resolves complex symptom patterns using Google Gemini AI structured prompts.
2.  **Health Risk Score**: Generates a numeric triage warning index from `1/10` to `10/10` based on symptom severity.
3.  **Severity Classification**: Color-coded badges categorizing patient conditions into `Mild` (Green), `Moderate` (Yellow), and `High` (Red).
4.  **Emergency Alert Detection**: Actively monitors inputs for high-risk symptoms (e.g. chest pain, breathing difficulties) and triggers high-visibility pulsing emergency warning banners.
5.  **Patient Health Analytics Dashboard**: Aggregates local consultation history to display patient trends, average health scores, and records tables.
6.  **PDF Report Download**: Instantly exports diagnostic cards as formatted, clinical summary PDFs (`jsPDF`) for patients to share with physicians.
7.  **Chat History Persistence**: Retains multiple session history lists locally via standard browser `localStorage`.
8.  **Pastel Glassmorphic UI**: Includes suggest chips, custom print setups, and responsiveness transitions.

---

## 🛠️ Technology Stack

### **Frontend**
*   **Framework:** React (Vite-powered SPA)
*   **Styles:** Vanilla CSS with backdrop-filter glassmorphism
*   **Dependencies:** `axios` (API requests), `jspdf` (PDF generation), `react-router-dom` (routing)

### **Backend**
*   **Framework:** Python Flask
*   **Middleware:** Flask-CORS (Cross-Origin Resource Sharing)
*   **Dependencies:** `google-generativeai` (Gemini API SDK), `python-dotenv` (secure credentials)

### **AI Engine**
*   **Model:** Google Gemini 3.5 Flash

### **Deployment Platform**
*   **Frontend/API Hosting:** Vercel

---

## 📐 System Architecture

MediMate follows a decoupled Client-Server architecture:

```text
[ React Frontend ]  --- (JSON POST /query) --->  [ Flask Backend API ]
        ^                                               |
        |                                       (Secure API call)
  (Loads Logs)                                          v
        |                                      [ Google Gemini AI ]
        v                                               |
 [ LocalStorage ]  <--- (Structured JSON response) <----+
```

1.  **Client Layer:** The React SPA takes user symptoms, appends suggest chips, and stores active conversations.
2.  **Controller Layer:** The Flask server validates request payloads, injects system prompt instructions, and handles communication keys.
3.  **Model Layer:** Google Gemini analyzes inputs in strict JSON Schema mode to return structured clinical objects.

---

## 📂 Folder Structure

```text
MediMate-AI-Healthcare-Assistant/
├── .gitignore                  # Version control ignore rules
├── README.md                   # Project documentation
├── vercel.json                 # Vercel deployment routes
├── backend/                    # Flask Python Server
│   ├── .env                    # Local environment secrets
│   ├── main.py                 # Flask app entrypoint
│   └── requirements.txt        # Server dependencies manifest
└── frontend/                   # React Client
    ├── index.html              # HTML DOM anchor
    ├── package.json            # Node project configuration
    ├── vite.config.js          # Vite server and local proxy
    ├── public/                 # Static assets folder
    └── src/
        ├── App.jsx             # React router configuration
        ├── App.css             
        ├── main.jsx            # React mounting hook
        ├── assets/             
        │   ├── style.css       # Global stylesheet & resets
        │   └── ...             # Graphic vectors and avatars
        └── components/         
            ├── RootPage.jsx    # Layout template wrapper
            ├── Navbar/         # Premium glassmorphic header
            ├── Footer/         # Copyright footer
            ├── Hero/           # Landing page hero panel
            ├── Dashboard/      # Patient analytics console
            └── chat/           # Chat assistant module
```

---

## ⚙️ Installation & Setup

### **Prerequisites**
*   [Node.js](https://nodejs.org/) (v16.0.0 or higher)
*   [Python 3.10+](https://www.python.org/)
*   Google Gemini API Key

---

### **1. Backend API Configuration**

Navigate to the `backend` directory:
```bash
cd backend
```

Install python packages:
```bash
pip install -r requirements.txt
```

Create a `.env` file inside the `backend/` directory:
```env
GEMINI_API_KEY=YOUR_GEMINI_API_KEY_HERE
```

Launch the Flask development server:
```bash
python3 main.py
```
*The server will start listening on `http://localhost:8081`.*

---

### **2. Frontend Client Configuration**

Open a new terminal session and navigate to the `frontend` directory:
```bash
cd frontend
```

Install node packages:
```bash
npm install
```

Start the Vite development web server:
```bash
npm run dev
```
*The React app will boot up on `http://localhost:5173`.*

---

## 🔮 Future Scope

*   **Nearby Hospital Locator:** Google Maps API integration to display local clinics on critical emergency detections.
*   **Voice Symptom Input:** Web Speech API parsing to record spoken patient symptom timelines.
*   **Medical Record History:** Cloud database syncing (Firebase / SQLite) for persistent clinical logs.
*   **Multi-language Support:** Localization modules (English, Hindi, Marathi) for regional language triaging.
*   **Doctor Appointment Integration:** Integrated calendars allowing users with high-risk scores to schedule online clinical appointments immediately.

---

## 🖼️ Screenshots

*   **Homepage Landing Panel**  
    *Place image at:* `/screenshots/homepage.png`
*   **Triage Chat Assistant**  
    *Place image at:* `/screenshots/chat_assistant.png`
*   **Patient Analytics Dashboard**  
    *Place image at:* `/screenshots/dashboard.png`

---

## 🏷️ License & Academic Usage

This project is developed as an educational coursework submission for the Master of Computer Applications program. Standard academic copyright rules apply under Mumbai University guidelines.

Project Code Repository:  
[https://github.com/Tripathineha1/MediMate-AI-Healthcare-Assistant](https://github.com/Tripathineha1/MediMate-AI-Healthcare-Assistant)

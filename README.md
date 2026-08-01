# 🎧 AudAI — AI Audiometry Diagnosis & Disability Predictor

[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?style=flat-square&logo=fastapi)](file:///home/mayank/AudAI/backend/main.py)
[![React 19](https://img.shields.io/badge/Frontend-React%2029-61DAFB?style=flat-square&logo=react)](file:///home/mayank/AudAI/frontend/package.json)
[![Tailwind CSS v4](https://img.shields.io/badge/Styling-Tailwind%20CSS%20v4-38BDF8?style=flat-square&logo=tailwindcss)](file:///home/mayank/AudAI/frontend/src/index.css)
[![Scikit-Learn](https://img.shields.io/badge/AI-Scikit--Learn-F7931E?style=flat-square&logo=scikit-learn)](file:///home/mayank/AudAI/ai/predict.py)

**AudAI** is an AI-driven clinical tool for **Pure Tone Audiometry (PTA)** data. It automates hearing loss diagnosis, calculates official WHO & Govt. disability percentages, generates clinical intervention strategies, and exports medical PDF reports.

---

## ⚡ Key Features

- **🤖 AI Diagnosis**: Classifies hearing loss profiles using a Random Forest model trained on PTA threshold data ($250\text{ Hz} - 8000\text{ Hz}$).
- **📐 WHO Disability Calculator**: Automatically calculates monoaural and bilateral hearing impairment percentages using official WHO/Govt guidelines.
- **⚡ Dual Input**: Batch CSV upload or manual threshold input form.
- **📊 Interactive Visualizer**: Dynamic audiogram graphs with ear-by-ear threshold curves.
- **📄 Medical PDF Export**: Generates publication-ready PDF diagnostic sheets complete with physician sign-off sections.
- **🎨 Glassmorphic UI**: Modern dark-mode UI built with React 19, Tailwind CSS v4, and Framer Motion.

---

## 🛠 Tech Stack

- **Backend**: FastAPI, SQLAlchemy, SQLite, Scikit-Learn, ReportLab
- **Frontend**: React 19, Vite, Tailwind CSS v4, Recharts, Framer Motion, Axios

---

## 📂 Project Structure

```
AudAI/
├── ai/          # ML Training, Feature Extraction & Predictor Engine
├── backend/     # FastAPI REST Server, Database Models & PDF Generator
├── frontend/    # React 19 Web App (Dashboard, Results, Upload, History)
└── reports/     # Generated PDF Diagnostic Reports
```

---

## 🚀 Quick Start

### 1. Backend Setup
```bash
# Navigate & setup environment
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# Run server
python -m uvicorn backend.main:app --reload
```
*Backend runs at `http://localhost:8000` (Docs: `http://localhost:8000/docs`).*

### 2. Frontend Setup
```bash
# Navigate & install dependencies
cd frontend
npm install

# Run dev server
npm run dev
```
*Frontend runs at `http://localhost:5173`.*

---

## 🔌 API Endpoints Summary

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/analysis/predict` | Upload CSV for AI analysis |
| `POST` | `/analysis/predict-json` | Submit manual audiogram form data |
| `GET` | `/analysis/history` | Get all patient audiogram records |
| `GET` | `/analysis/{id}` | Get specific analysis record |
| `GET` | `/analysis/report/{id}/pdf` | Stream downloadable PDF diagnostic report |

---

## 📄 License

Distributed under the **MIT License**. See [`LICENSE`](file:///home/mayank/AudAI/LICENSE) for details.


---

## ⭐ Overview

**Resume Keyword Analyzer** is a full-stack web application that extracts keywords from:

* 📝 Resume (PDF / DOCX / TXT)
* 💼 Job Description

…and highlights:

* ✔️ **Matched Keywords** (present in both)
* ❌ **Missing Keywords** (required but not in resume)
* 🧩 **All Extracted Resume Keywords**

Includes:

* 📊 **History tracking** (per device)
* 🌙 **Dark/Light mode**
* 🔄 **CSV export**
* 🗄️ **Auto-created SQLite DB**

---

## 📂 Project Structure

```
project/
│
├── backend/
│   ├── server.js
│   ├── package.json
│   └── db.sqlite   ← auto-generated
│
└── frontend/
    ├── index.html
    ├── history.html
    ├── assets/
    │   ├── images.jfif
    │   └── hero.png
```

---

## 🚀 Features

### 🔍 Keyword Extraction

* Extracts keywords from resume & job text
* Multi-word phrase support (e.g., *machine learning*, *react native*, *sql server*)
* Custom stopword removal
* Built-in stemming (`ing`, `ment`, `ies`, etc.)

### 📊 Analysis Dashboard

* Counts keywords
* Displays results as chips
* Modern UI with glassmorphism

### 📚 History Tracking

* Saves every analysis
* Per-user (via browser `localStorage`)
* Shows:

  * resume name
  * job title
  * thumbnail
  * timestamp
* View full keyword breakdown in modal

### 🌗 Theming

* Light / Dark mode
* Automatic persistence

### 🧾 Export Options

* Export matched + missing keywords to CSV

---

## 🛠️ Installation

### **1. Navigate to backend**

```bash
cd backend
```

### **2. Install dependencies**

```bash
npm install
```

### **3. Start the server**

```bash
node server.js
```

### **4. Open in browser**

```
http://localhost:3000
```

---

## 🗄️ Database Schema

### **Table: analyses**

| Column      | Type     | Description                     |
| ----------- | -------- | ------------------------------- |
| id          | INTEGER  | Primary key                     |
| user_id     | TEXT     | Local device ID                 |
| resume_name | TEXT     | Resume file name                |
| job_title   | TEXT     | First line from job description |
| thumbnail   | TEXT     | Thumbnail path                  |
| created_at  | DATETIME | Timestamp                       |

### **Table: keywords**

| Column            | Description      |
| ----------------- | ---------------- |
| keyword           | Extracted word   |
| resume_id         | FK → analyses.id |
| job_id            | Same FK          |
| present_in_resume | 1/0              |
| present_in_job    | 1/0              |

🧹 **Delete db.sqlite to reset** — it will auto-generate again.

---

## 🌐 API Endpoints

### **POST /api/saveAnalysis**

Stores analysis and keyword data.

### **GET /api/history/:userId**

Fetches all analyses saved by a device.

### **GET /api/analysis/:id**

Returns matched / missing / resume keywords.

---

## 🧠 Keyword Logic Summary

* Lowercase normalization
* Stopword removal
* Remove punctuation
* Extract multi-word skill phrases
* Apply word stemming
* Sort by keyword length
* Return unique keywords

---

## 📸 Screenshots (optional — add your own)

```
/frontend/assets/
```

You can add:

* dashboard screenshot
* history screenshot
* modal screenshot

---

## 🤝 Technologies Used

### Frontend:

* HTML5
* CSS (Glassmorphism + dark/light theme)
* Vanilla JavaScript
* pdf.js (PDF extraction)
* mammoth.js (DOCX extraction)

### Backend:

* Node.js
* Express.js
* SQLite3

---

## 🧑‍💻 Development Notes

This project uses a per-device user ID stored in:

```
localStorage.rka_userId
```

This ensures history stays separate for each user/browser.

---

## 📜 License

This project is released under the **MIT License**.

---

## ❤️ Contributing

PRs and feature suggestions are welcome!
If you'd like, I can also generate:

✔ GitHub Issues Template
✔ Pull Request Template
✔ MIT License file
✔ `.gitignore` (Node.js)
✔ Contribution Guide

---

If you'd like **README with screenshots**, **animated GIF demo**, or **deployment guide (Render / Vercel / Railway)** — just tell me!

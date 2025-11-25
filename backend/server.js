// backend/server.js
const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
const FRONTEND_DIR = path.join(__dirname, "../frontend");
app.use(express.static(FRONTEND_DIR));

const DB_PATH = path.join(__dirname, "db.sqlite");
const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error("❌ SQLite Connection Error:", err.message);
  } else {
    console.log("✅ Connected to SQLite at:", DB_PATH);
  }
});

db.serialize(() => {
  console.log("📌 Ensuring tables exist...");

  db.run(`
    CREATE TABLE IF NOT EXISTS analyses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT,
      resume_name TEXT,
      job_title TEXT,
      thumbnail TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS keywords (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      keyword TEXT,
      resume_id INTEGER,
      job_id INTEGER,
      present_in_resume INTEGER DEFAULT 0,
      present_in_job INTEGER DEFAULT 0
    )
  `);
});

// Save Analysis + Keywords
app.post("/api/saveAnalysis", (req, res) => {
  const {
    userId,
    resumeName,
    jobTitle,
    thumbnail,
    matched = [],
    missing = [],
    resumeKeywords = [],
  } = req.body;

  if (!resumeName) return res.status(400).json({ error: "resumeName is required" });

  db.run(
    `INSERT INTO analyses (user_id, resume_name, job_title, thumbnail)
     VALUES (?, ?, ?, ?)`,
    [userId || null, resumeName, jobTitle || null, thumbnail || null],
    function (err) {
      if (err) {
        console.error("❌ Error saving analysis:", err.message);
        return res.status(500).json({ error: err.message });
      }

      const analysisId = this.lastID;

      db.serialize(() => {
        const stmt = db.prepare(
          `INSERT INTO keywords 
            (keyword, resume_id, job_id, present_in_resume, present_in_job)
            VALUES (?, ?, ?, ?, ?)`
        );

        resumeKeywords.forEach((k) => {
          stmt.run(k, analysisId, analysisId, 1, 0);
        });
        matched.forEach((k) => {
          stmt.run(k, analysisId, analysisId, 1, 1);
        });
        missing.forEach((k) => {
          stmt.run(k, analysisId, analysisId, 0, 1);
        });

        stmt.finalize((err) => {
          if (err) {
            console.error("❌ Error inserting keywords:", err.message);
            return res.status(500).json({ error: err.message });
          }
          console.log("💾 Analysis saved:", analysisId);
          res.json({ status: "ok", analysisId });
        });
      });
    }
  );
});

// Per-user history
app.get("/api/history/:userId", (req, res) => {
  const userId = req.params.userId;
  db.all(
    `SELECT id, resume_name, job_title, thumbnail, created_at
     FROM analyses
     WHERE user_id = ?
     ORDER BY created_at DESC`,
    [userId],
    (err, rows) => {
      if (err) {
        console.error("❌ Error fetching history:", err.message);
        return res.status(500).json({ error: err.message });
      }
      res.json(rows);
    }
  );
});

// Fetch analysis keywords
app.get("/api/analysis/:id", (req, res) => {
  const id = req.params.id;
  db.all(
    `
    SELECT id, keyword, present_in_resume, present_in_job
    FROM keywords
    WHERE resume_id = ? OR job_id = ?
    ORDER BY id ASC
  `,
    [id, id],
    (err, rows) => {
      if (err) {
        console.error("❌ Error loading analysis details:", err.message);
        return res.status(500).json({ error: err.message });
      }
      res.json(rows);
    }
  );
});

app.get("/", (req, res) => {
  res.sendFile(path.join(FRONTEND_DIR, "index.html"));
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at: http://localhost:${PORT}`);
});

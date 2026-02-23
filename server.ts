import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("affiliate.db");

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS links (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    url TEXT NOT NULL,
    platform TEXT NOT NULL,
    clicks INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/links", (req, res) => {
    const links = db.prepare("SELECT * FROM links ORDER BY created_at DESC").all();
    res.json(links);
  });

  app.post("/api/links", (req, res) => {
    const { title, url, platform } = req.body;
    const info = db.prepare("INSERT INTO links (title, url, platform) VALUES (?, ?, ?)").run(title, url, platform);
    res.json({ id: info.lastInsertRowid });
  });

  app.post("/api/links/:id/click", (req, res) => {
    db.prepare("UPDATE links SET clicks = clicks + 1 WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

  app.delete("/api/links/:id", (req, res) => {
    db.prepare("DELETE FROM links WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();

const app = express();
app.use(cors());
app.use(express.json());

// Simple SQLite DB file in backend folder
const db = new sqlite3.Database("./app.db");

// Create a table for a prototype use case (tasks)
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      done INTEGER NOT NULL DEFAULT 0
    )
  `);
});

// List tasks
app.get("/api/tasks", (req, res) => {
  db.all("SELECT * FROM tasks ORDER BY id DESC", (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Create task
app.post("/api/tasks", (req, res) => {
  const { title } = req.body;
  if (!title) return res.status(400).json({ error: "title required" });

  db.run("INSERT INTO tasks(title) VALUES(?)", [title], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: this.lastID, title, done: 0 });
  });
});

// Toggle done
app.patch("/api/tasks/:id/toggle", (req, res) => {
  const id = req.params.id;
  db.run(
    "UPDATE tasks SET done = CASE done WHEN 0 THEN 1 ELSE 0 END WHERE id = ?",
    [id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ updated: this.changes });
    }
  );
});

// Edit task title
app.put("/api/tasks/:id", (req, res) => {
  const id = req.params.id;
  const { title } = req.body;
  if (!title || !title.trim()) return res.status(400).json({ error: "title required" });
  db.run("UPDATE tasks SET title = ? WHERE id = ?", [title.trim(), id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ updated: this.changes });
  });
});

// Clear all completed tasks
app.delete("/api/tasks/completed", (req, res) => {
  db.run("DELETE FROM tasks WHERE done = 1", function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ deleted: this.changes });
  });
});

// Delete one task
app.delete("/api/tasks/:id", (req, res) => {
  const id = req.params.id;
  db.run("DELETE FROM tasks WHERE id = ?", [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ deleted: this.changes });
  });
});

// Get task statistics
app.get("/api/tasks/stats", (req, res) => {
  db.get(`
    SELECT 
      COUNT(*) as total,
      SUM(CASE WHEN done = 0 THEN 1 ELSE 0 END) as pending,
      SUM(CASE WHEN done = 1 THEN 1 ELSE 0 END) as completed
    FROM tasks
  `, (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({
      total: row.total || 0,
      pending: row.pending || 0,
      completed: row.completed || 0
    });
  });
});

// Search tasks
app.get("/api/tasks/search/:query", (req, res) => {
  const query = `%${req.params.query}%`;
  db.all(
    "SELECT * FROM tasks WHERE title LIKE ? ORDER BY id DESC",
    [query],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    }
  );
});

// Mark all as completed
app.patch("/api/tasks/complete-all", (req, res) => {
  db.run("UPDATE tasks SET done = 1 WHERE done = 0", function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ updated: this.changes });
  });
});


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));


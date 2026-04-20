const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const http = require("http");

const app = express();
app.use(cors());
app.use(express.json());

const db = new sqlite3.Database("./task.db");

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      done INTEGER NOT NULL DEFAULT 0
    )
  `);
});


function broadcast(event, payload) {
  const data = JSON.stringify({ event, payload });
  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) }
  };

  const services = [
    new URL(process.env.SEARCH_SERVICE_URL || 'http://localhost:3002'),
    new URL(process.env.STATS_SERVICE_URL || 'http://localhost:3003')
  ];

  services.forEach(url => {
    const req = http.request({...options, hostname: url.hostname, port: url.port, path: '/api/events'}, (res) => {

        res.on('data', () => {});
    });
    req.on('error', (e) => console.error(`Error sending webhook to ${url}: ${e.message}`));
    req.write(data);
    req.end();
  });
}


app.get("/api/tasks", (req, res) => {
  db.all("SELECT * FROM tasks ORDER BY id DESC", (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows || []);
  });
});


app.post("/api/tasks", (req, res) => {
  const { title } = req.body;
  if (!title || !title.trim()) return res.status(400).json({ message: "title required" });
  
  db.run("INSERT INTO tasks(title) VALUES(?)", [title.trim()], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    const task = { id: this.lastID, title: title.trim(), done: 0 };
    broadcast('TASK_CREATED', task);
    res.status(201).json(task);
  });
});


app.patch("/api/tasks/:id/toggle", (req, res) => {
  const id = req.params.id;
  db.run("UPDATE tasks SET done = CASE done WHEN 0 THEN 1 ELSE 0 END WHERE id = ?", [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    db.get("SELECT * FROM tasks WHERE id = ?", [id], (err, row) => {
        if (!err && row) broadcast('TASK_TOGGLED', row);
    });
    res.json({ updated: this.changes });
  });
});


app.put("/api/tasks/:id", (req, res) => {
  const id = req.params.id;
  const { title } = req.body;
  if (!title || !title.trim()) return res.status(400).json({ message: "title required" });

  db.run("UPDATE tasks SET title = ? WHERE id = ?", [title.trim(), id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    broadcast('TASK_UPDATED', { id: Number(id), title: title.trim() });
    res.json({ updated: this.changes });
  });
});


app.delete("/api/tasks/completed", (req, res) => {
  db.run("DELETE FROM tasks WHERE done = 1", function (err) {
    if (err) return res.status(500).json({ error: err.message });
    broadcast('COMPLETED_CLEARED', {});
    res.json({ deleted: this.changes });
  });
});


app.patch("/api/tasks/complete-all", (req, res) => {
  db.run("UPDATE tasks SET done = 1 WHERE done = 0", function (err) {
    if (err) return res.status(500).json({ error: err.message });
    broadcast('ALL_COMPLETED', {});
    res.json({ updated: this.changes });
  });
});


app.delete("/api/tasks/:id", (req, res) => {
  const id = req.params.id;
  db.run("DELETE FROM tasks WHERE id = ?", [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes > 0) broadcast('TASK_DELETED', { id: Number(id) });
    res.json({ deleted: this.changes });
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Task Service running on port ${PORT}`);
});

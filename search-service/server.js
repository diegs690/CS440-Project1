const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();

const app = express();
app.use(cors());
app.use(express.json());

const db = new sqlite3.Database("./search.db");


db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY,
      title TEXT NOT NULL,
      done INTEGER NOT NULL DEFAULT 0
    )
  `);
});


app.get("/api/tasks/search/:query", (req, res) => {
  const query = req.params.query;
  db.all(
    "SELECT * FROM tasks WHERE title LIKE ? ORDER BY id DESC",
    [`%${query}%`],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows || []);
    }
  );
});


app.post("/api/events", (req, res) => {
  const { event, payload } = req.body;
  if (!event) return res.status(400).send();

  switch (event) {
    case 'TASK_CREATED':
      db.run("INSERT OR REPLACE INTO tasks(id, title, done) VALUES(?, ?, ?)", [payload.id, payload.title, payload.done]);
      break;
    case 'TASK_UPDATED':
      db.run("UPDATE tasks SET title = ? WHERE id = ?", [payload.title, payload.id]);
      break;
    case 'TASK_DELETED':
      db.run("DELETE FROM tasks WHERE id = ?", [payload.id]);
      break;
    case 'TASK_TOGGLED':
      db.run("UPDATE tasks SET done = ? WHERE id = ?", [payload.done, payload.id]);
      break;
    case 'COMPLETED_CLEARED':
      db.run("DELETE FROM tasks WHERE done = 1");
      break;
    case 'ALL_COMPLETED':
      db.run("UPDATE tasks SET done = 1");
      break;
  }
  res.status(200).send();
});

const PORT = 3002;
app.listen(PORT, () => {
  console.log(`Search Service running on port ${PORT}`);
});

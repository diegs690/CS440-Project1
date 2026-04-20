const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();

const app = express();
app.use(cors());
app.use(express.json());

const db = new sqlite3.Database("./stats.db");


db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY,
      done INTEGER NOT NULL DEFAULT 0
    )
  `);
});


app.get("/api/tasks/stats", (req, res) => {
  db.get(
    `
    SELECT 
      COUNT(*) as total,
      SUM(CASE WHEN done = 0 THEN 1 ELSE 0 END) as pending,
      SUM(CASE WHEN done = 1 THEN 1 ELSE 0 END) as completed
    FROM tasks
    `,
    (err, row) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({
        total: row?.total || 0,
        pending: row?.pending || 0,
        completed: row?.completed || 0,
      });
    }
  );
});


app.post("/api/events", (req, res) => {
  const { event, payload } = req.body;
  if (!event) return res.status(400).send();

  switch (event) {
    case 'TASK_CREATED':
      db.run("INSERT OR REPLACE INTO tasks(id, done) VALUES(?, ?)", [payload.id, payload.done]);
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

const PORT = 3003;
app.listen(PORT, () => {
  console.log(`Stats Service running on port ${PORT}`);
});

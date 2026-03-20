const sqlite3 = require("sqlite3").verbose();
const path = require("path");

// DB file connects to the SQLite file in the backend folder
const dbPath = path.resolve(__dirname, "../app.db");
const db = new sqlite3.Database(dbPath);

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

module.exports = db;

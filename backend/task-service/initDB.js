const db = require('./config/db');

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL
  )`, (err) => {
      if (err) console.error(err.message);
      else console.log('Tasks table created successfully.');
  });
});

db.close();
const db = require("../config/db");

class Task {
  static getAll() {
    return new Promise((resolve, reject) => {
      db.all("SELECT * FROM tasks ORDER BY id DESC", (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  static create(title) {
    return new Promise((resolve, reject) => {
      db.run("INSERT INTO tasks(title) VALUES(?)", [title], function (err) {
        if (err) reject(err);
        else resolve({ id: this.lastID, title, done: 0 });
      });
    });
  }

  static toggleDone(id) {
    return new Promise((resolve, reject) => {
      db.run(
        "UPDATE tasks SET done = CASE done WHEN 0 THEN 1 ELSE 0 END WHERE id = ?",
        [id],
        function (err) {
          if (err) reject(err);
          else resolve({ updated: this.changes });
        }
      );
    });
  }

  static updateTitle(id, title) {
    return new Promise((resolve, reject) => {
      db.run("UPDATE tasks SET title = ? WHERE id = ?", [title.trim(), id], function (err) {
        if (err) reject(err);
        else resolve({ updated: this.changes });
      });
    });
  }

  static deleteCompleted() {
    return new Promise((resolve, reject) => {
      db.run("DELETE FROM tasks WHERE done = 1", function (err) {
        if (err) reject(err);
        else resolve({ deleted: this.changes });
      });
    });
  }

  static deleteById(id) {
    return new Promise((resolve, reject) => {
      db.run("DELETE FROM tasks WHERE id = ?", [id], function (err) {
        if (err) reject(err);
        else resolve({ deleted: this.changes });
      });
    });
  }

  static getStats() {
    return new Promise((resolve, reject) => {
      db.get(`
        SELECT 
          COUNT(*) as total,
          SUM(CASE WHEN done = 0 THEN 1 ELSE 0 END) as pending,
          SUM(CASE WHEN done = 1 THEN 1 ELSE 0 END) as completed
        FROM tasks
      `, (err, row) => {
        if (err) reject(err);
        else resolve({
          total: row.total || 0,
          pending: row.pending || 0,
          completed: row.completed || 0
        });
      });
    });
  }

  static searchTitle(query) {
    return new Promise((resolve, reject) => {
      const dbQuery = `%${query}%`;
      db.all(
        "SELECT * FROM tasks WHERE title LIKE ? ORDER BY id DESC",
        [dbQuery],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });
  }

  static completeAll() {
    return new Promise((resolve, reject) => {
      db.run("UPDATE tasks SET done = 1 WHERE done = 0", function (err) {
        if (err) reject(err);
        else resolve({ updated: this.changes });
      });
    });
  }
}

module.exports = Task;

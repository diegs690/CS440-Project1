const db = require("../db/database");

function getAllTasks(callback) {
  db.all("SELECT * FROM tasks ORDER BY id DESC", callback);
}

function createTask(title, callback) {
  db.run("INSERT INTO tasks(title) VALUES(?)", [title], function (err) {
    callback(err, { id: this?.lastID, title, done: 0 });
  });
}

function toggleTask(id, callback) {
  db.run(
    "UPDATE tasks SET done = CASE done WHEN 0 THEN 1 ELSE 0 END WHERE id = ?",
    [id],
    function (err) {
      callback(err, { updated: this?.changes });
    }
  );
}

function updateTask(id, title, callback) {
  db.run(
    "UPDATE tasks SET title = ? WHERE id = ?",
    [title, id],
    function (err) {
      callback(err, { updated: this?.changes });
    }
  );
}

function deleteTask(id, callback) {
  db.run("DELETE FROM tasks WHERE id = ?", [id], function (err) {
    callback(err, { deleted: this?.changes });
  });
}

function clearCompleted(callback) {
  db.run("DELETE FROM tasks WHERE done = 1", function (err) {
    callback(err, { deleted: this?.changes });
  });
}

function getStats(callback) {
  db.get(
    `
    SELECT 
      COUNT(*) as total,
      SUM(CASE WHEN done = 0 THEN 1 ELSE 0 END) as pending,
      SUM(CASE WHEN done = 1 THEN 1 ELSE 0 END) as completed
    FROM tasks
    `,
    callback
  );
}

function searchTasks(query, callback) {
  db.all(
    "SELECT * FROM tasks WHERE title LIKE ? ORDER BY id DESC",
    [`%${query}%`],
    callback
  );
}

function completeAll(callback) {
  db.run("UPDATE tasks SET done = 1 WHERE done = 0", function (err) {
    callback(err, { updated: this?.changes });
  });
}

module.exports = {
  getAllTasks,
  createTask,
  toggleTask,
  updateTask,
  deleteTask,
  clearCompleted,
  getStats,
  searchTasks,
  completeAll,
};
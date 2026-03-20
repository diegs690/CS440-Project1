const taskService = require("../services/taskService");

function getAllTasks(req, res) {
  taskService.getAllTasks((err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
}

function createTask(req, res) {
  taskService.createTask(req.body.title, (err, task) => {
    if (err) {
      return res.status(err.status || 500).json({ error: err.message || "Server error" });
    }
    res.status(201).json(task);
  });
}

function toggleTask(req, res) {
  taskService.toggleTask(req.params.id, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
}

function updateTask(req, res) {
  taskService.updateTask(req.params.id, req.body.title, (err, result) => {
    if (err) {
      return res.status(err.status || 500).json({ error: err.message || "Server error" });
    }
    res.json(result);
  });
}

function deleteTask(req, res) {
  taskService.deleteTask(req.params.id, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
}

function clearCompleted(req, res) {
  taskService.clearCompleted((err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
}

function getStats(req, res) {
  taskService.getStats((err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({
      total: row.total || 0,
      pending: row.pending || 0,
      completed: row.completed || 0,
    });
  });
}

function searchTasks(req, res) {
  taskService.searchTasks(req.params.query, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
}

function completeAll(req, res) {
  taskService.completeAll((err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
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
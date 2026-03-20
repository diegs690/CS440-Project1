const taskRepository = require("../repositories/taskRepository");

function getAllTasks(callback) {
  taskRepository.getAllTasks(callback);
}

function createTask(title, callback) {
  if (!title || !title.trim()) {
    return callback({ status: 400, message: "title required" });
  }

  taskRepository.createTask(title.trim(), callback);
}

function toggleTask(id, callback) {
  taskRepository.toggleTask(id, callback);
}

function updateTask(id, title, callback) {
  if (!title || !title.trim()) {
    return callback({ status: 400, message: "title required" });
  }

  taskRepository.updateTask(id, title.trim(), callback);
}

function deleteTask(id, callback) {
  taskRepository.deleteTask(id, callback);
}

function clearCompleted(callback) {
  taskRepository.clearCompleted(callback);
}

function getStats(callback) {
  taskRepository.getStats(callback);
}

function searchTasks(query, callback) {
  taskRepository.searchTasks(query, callback);
}

function completeAll(callback) {
  taskRepository.completeAll(callback);
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
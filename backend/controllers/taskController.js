const Task = require("../models/Task");

exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.getAll();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createTask = async (req, res) => {
  const { title } = req.body;
  if (!title) return res.status(400).json({ error: "title required" });

  try {
    const newTask = await Task.create(title);
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.toggleTaskDone = async (req, res) => {
  const id = req.params.id;
  try {
    const result = await Task.toggleDone(id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateTaskTitle = async (req, res) => {
  const id = req.params.id;
  const { title } = req.body;
  if (!title || !title.trim()) return res.status(400).json({ error: "title required" });

  try {
    const result = await Task.updateTitle(id, title);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteCompletedTasks = async (req, res) => {
  try {
    const result = await Task.deleteCompleted();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteTaskById = async (req, res) => {
  const id = req.params.id;
  try {
    const result = await Task.deleteById(id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getTaskStats = async (req, res) => {
  try {
    const stats = await Task.getStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.searchTasks = async (req, res) => {
  const query = req.params.query;
  try {
    const tasks = await Task.searchTitle(query);
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.completeAllTasks = async (req, res) => {
  try {
    const result = await Task.completeAll();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

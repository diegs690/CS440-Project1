const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");

// List tasks
router.get("/", taskController.getAllTasks);

// Create task
router.post("/", taskController.createTask);

// Delete all completed tasks
router.delete("/completed", taskController.deleteCompletedTasks);

// Complete all tasks
router.patch("/complete-all", taskController.completeAllTasks);

// Get task statistics
router.get("/stats", taskController.getTaskStats);

// Search tasks
router.get("/search/:query", taskController.searchTasks);

// Toggle done
router.patch("/:id/toggle", taskController.toggleTaskDone);

// Edit task title
router.put("/:id", taskController.updateTaskTitle);

// Delete one task
router.delete("/:id", taskController.deleteTaskById);

module.exports = router;

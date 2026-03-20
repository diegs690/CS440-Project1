const express = require("express");
const controller = require("../controllers/taskController");

const router = express.Router();

router.get("/tasks", controller.getAllTasks);
router.post("/tasks", controller.createTask);
router.patch("/tasks/:id/toggle", controller.toggleTask);
router.put("/tasks/:id", controller.updateTask);
router.delete("/tasks/completed", controller.clearCompleted);
router.delete("/tasks/:id", controller.deleteTask);
router.get("/tasks/stats", controller.getStats);
router.get("/tasks/search/:query", controller.searchTasks);
router.patch("/tasks/complete-all", controller.completeAll);

module.exports = router;
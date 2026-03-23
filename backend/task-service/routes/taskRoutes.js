const express = require('express');
const router = express.Router();
const taskService = require('../services/taskService');

// GET all tasks
router.get('/', async (req, res) => {
    try {
        const tasks = await taskService.getAllTasks();
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST create task
router.post('/', async (req, res) => {
    try {
        const newTask = await taskService.createTask(req.body.title);
        res.status(201).json(newTask);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// PUT update task
router.put('/:id', async (req, res) => {
    try {
        const updated = await taskService.updateTask(req.params.id, req.body.title);
        res.json(updated);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// DELETE task
router.delete('/:id', async (req, res) => {
    try {
        await taskService.deleteTask(req.params.id);
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
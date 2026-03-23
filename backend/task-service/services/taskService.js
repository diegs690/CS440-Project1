const taskRepo = require('../data/taskRepository');

exports.getAllTasks = async () => {
    return await taskRepo.getAll();
};

exports.createTask = async (title) => {
    if (!title) {
        throw new Error('Task title is required');
    }
    return await taskRepo.create(title);
};

exports.updateTask = async (id, title) => {
    if (!title) {
        throw new Error('Task title is required');
    }
    return await taskRepo.update(id, title);
};

exports.deleteTask = async (id) => {
    return await taskRepo.remove(id);
};
const db = require('../config/db');

exports.getAll = () => {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM tasks', [], (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
};

exports.create = (title) => {
    return new Promise((resolve, reject) => {
        db.run('INSERT INTO tasks (title) VALUES (?)', [title], function (err) {
            if (err) reject(err);
            else resolve({ id: this.lastID, title });
        });
    });
};

exports.update = (id, title) => {
    return new Promise((resolve, reject) => {
        db.run('UPDATE tasks SET title = ? WHERE id = ?', [title, id], function (err) {
            if (err) reject(err);
            else resolve({ id, title });
        });
    });
};

exports.remove = (id) => {
    return new Promise((resolve, reject) => {
        db.run('DELETE FROM tasks WHERE id = ?', [id], function (err) {
            if (err) reject(err);
            else resolve();
        });
    });
};
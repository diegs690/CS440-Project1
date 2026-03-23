const express = require('express');
const app = express();

const taskRoutes = require('./routes/taskRoutes');

app.use(express.json());

// SOA-style service endpoint
app.use('/api/tasks', taskRoutes);

const PORT = 3001;

app.listen(PORT, () => {
    console.log(`Task Service running on http://localhost:${PORT}`);
});
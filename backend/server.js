const express = require("express");
const cors = require("cors");
const taskRoutes = require("./routes/taskRoutes");

// Initialize Database connection
require("./config/db");

const app = express();
app.use(cors());
app.use(express.json());

// API Routes
app.use("/api/tasks", taskRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));

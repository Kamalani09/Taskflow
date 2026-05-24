require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

// ======================
// Middleware
// ======================
app.use(express.json());
app.use(
  cors({
    origin: [
      "https://taskflow-one-kohl.vercel.app",
      "https://taskflow-kamalanis-projects.vercel.app"
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  })
);
// ======================
// Database Connection
// ======================
connectDB();

// ======================
// Import Routes (DEBUG SAFE)
// ======================
const todoRoutes = require('./routes/todoRoutes');
const authRoutes = require('./routes/authRoutes');

// 🔍 Debug (helps find your current error)
console.log("todoRoutes type:", typeof todoRoutes);
console.log("authRoutes type:", typeof authRoutes);

// ======================
// Use Routes
// ======================
app.use('/api/todos', todoRoutes);
app.use('/api/auth', authRoutes);

// ======================
// Default Route
// ======================
app.get('/', (req, res) => {
  res.send("API is running 🚀");
});

// ======================
// Error Handling (basic)
// ======================
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong" });
});

// ======================
// Start Server
// ======================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
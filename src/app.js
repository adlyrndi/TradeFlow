require("dotenv").config(); 
const express = require("express");

// Routes
const authRoutes = require("./routes/auth.route");
const app = express();
app.use(express.json());

app.use("/auth", authRoutes);   // register, login, logout, refresh


app.get("/", (req, res) => {
  res.send("Server is running!");
});

// --- Global Error Handler (Optional, tapi recommended) ---
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || "Internal server error",
  });
});

module.exports = app;

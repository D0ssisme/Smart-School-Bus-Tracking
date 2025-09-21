const express = require("express");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Route demo
app.get("/", (req, res) => {
    res.send("🚀 Smart School Bus Tracking API is running!");
});

module.exports = app;

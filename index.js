const express = require("express");
const cors = require("cors");
//Env requirment
const dotenv = require("dotenv");
dotenv.config();
//DB Connection
const connectDB = require("./config/mongoose");
connectDB();

// import routes
const authRoutes = require("./routes/authRoutes");
const normalRoutes = require("./routes/allNormalRoutes");

//Declaire app
const app = express();

app.use(
  cors({
    origin: "http://localhost:5173", // wherever your React app runs
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json()); // ← body parsing
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes); // Auth-specific routes
app.use("/", normalRoutes); // Public-facing routes

const PORT = process.env.PORT;
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);

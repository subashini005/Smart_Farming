require("dotenv").config();
const express = require("express");
const cors = require("cors");
// Ensure DBs initialize before scheduling cron tasks
const db = require("./db");
const otpDB = require("./otpDB");
require("./otpExpiry");
const { signup, verifyOtp, login, forgotPassword, resetPassword } = require("./controllers/controls");

const app = express();
app.use(express.json());
app.use(cors());
app.post("/signup", signup);
app.post("/verify-otp", verifyOtp);
app.post("/login", login);
app.post("/forgot-password", forgotPassword);
app.post("/reset-password", resetPassword);

const PORT = process.env.PORT || 5000;

(async function start() {
  try {
    // wait for both DBs to be ready
    if (db && typeof db.ensureInitialized === "function") await db.ensureInitialized();
    if (otpDB && typeof otpDB.ensureInitialized === "function") await otpDB.ensureInitialized();

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
})();
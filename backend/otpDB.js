const Loki = require("lokijs");
const path = require("path");

const dbPath = path.join(__dirname, "Database", "otp.db.json");

const db = new Loki(dbPath, {
  autoload: true,
  autosave: true,
  autosaveInterval: 3000,
  autoloadCallback: initDB,
});

let otps;
let _readyResolve;
const _readyPromise = new Promise((resolve) => { _readyResolve = resolve; });

function initDB() {
  otps = db.getCollection("otps");

  if (!otps) {
    otps = db.addCollection("otps", {
      unique: ["userId"],
    });
  }

  db.saveDatabase();
  if (typeof _readyResolve === "function") _readyResolve();
}

function insertOtp({ userId, otp }) {
  otps.findAndRemove({ userId });
  return otps.insert({
    userId,
    otp,
    validatedAt: 0,
    createdAt: new Date(),
  });
}

function getOtpByUserId(userId) {
  return otps.findOne({ userId });
}

function markOtpVerified(userId) {
  const record = otps.findOne({ userId });
  if (!record) return null;

  record.validatedAt = 1;
  otps.update(record);
  return record;
}

module.exports = {
  getOtpByUserId,
  insertOtp,
  markOtpVerified,
  getOtpCollection: () => otps,
  ensureInitialized: () => _readyPromise,
};
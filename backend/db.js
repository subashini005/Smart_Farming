const Loki = require("lokijs");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const dbPath = path.join(__dirname, "Database", "users.json");

const db = new Loki(dbPath, {
  autoload: true,
  autosave: true,
  autosaveInterval: 4000,
  autoloadCallback: initDB,
});

let users;
let _readyResolve;
const _readyPromise = new Promise((resolve) => { _readyResolve = resolve; });

function initDB() {
  users = db.getCollection("users");

  if (!users) {
    users = db.addCollection("users", {
      unique: ["userId", "email"],
    });
  }

  db.saveDatabase();
  if (typeof _readyResolve === "function") _readyResolve();
}

function insertUser({ username, email, password }) {
  return users.insert({
    userId: uuidv4(),
    username,
    email,
    password,
    validatedAt: 0,
    createdAt: new Date(),
  });
}

function markUserVerified(userId) {
  const user = users.findOne({ userId });
  if (!user) return null;

  user.validatedAt = 1;
  users.update(user);
  return user;
}

module.exports = { getUsers: () => users, insertUser, markUserVerified, ensureInitialized: () => _readyPromise };
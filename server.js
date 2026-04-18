const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// ======================
// 🔗 MySQL CONNECTION
// ======================
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",   // 👈 change if needed
  database: "studentDB"
});

db.connect((err) => {
  if (err) {
    console.log("❌ DB Connection Error:", err);
  } else {
    console.log("✅ MySQL Connected");
  }
});

// ======================
// 🏠 TEST ROUTE
// ======================
app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});

// ======================
// 🔐 REGISTER API
// ======================
app.post("/register", (req, res) => {
  const { username, password } = req.body;

  // Check if user exists
  const checkUser = "SELECT * FROM users WHERE username=?";

  db.query(checkUser, [username], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).send("Server Error");
    }

    if (result.length > 0) {
      return res.send("User already exists ❌");
    }

    // Insert new user
    const insertUser = "INSERT INTO users (username, password) VALUES (?, ?)";

    db.query(insertUser, [username, password], (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).send("Error in registration");
      }

      res.send("Registered Successfully ✅");
    });
  });
});

// ======================
// 🔑 LOGIN API
// ======================
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  const sql = "SELECT * FROM users WHERE username=? AND password=?";

  db.query(sql, [username, password], (err, result) => {
    if (err) {
      console.log(err);
      return res.json({ success: false });
    }

    if (result.length > 0) {
      res.json({ success: true });
    } else {
      res.json({ success: false });
    }
  });
});

// ======================
// ➕ ADD TASK API
// ======================
app.post("/addTask", (req, res) => {
  const { username, task, priority } = req.body;

  const sql = "INSERT INTO tasks (username, task, priority) VALUES (?, ?, ?)";

  db.query(sql, [username, task, priority], (err, result) => {
    if (err) {
      console.log(err);
      return res.send("Error adding task ❌");
    }

    res.send("Task Added ✅");
  });
});

// ======================
// 📋 GET TASKS API
// ======================
app.get("/getTasks/:username", (req, res) => {
  const username = req.params.username;

  const sql = "SELECT * FROM tasks WHERE username=? ORDER BY id DESC";

  db.query(sql, [username], (err, result) => {
    if (err) {
      console.log(err);
      return res.json([]);
    }

    res.json(result);
  });
});

// ======================
// ❌ DELETE TASK API
// ======================
app.delete("/deleteTask/:id", (req, res) => {
  const id = req.params.id;

  const sql = "DELETE FROM tasks WHERE id=?";

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.log(err);
      return res.send("Error deleting ❌");
    }

    res.send("Task Deleted ✅");
  });
});
// ======================
// ✏️ UPDATE TASK API
// ======================
app.put("/updateTask/:id", (req, res) => {
  const id = req.params.id;
  const { task, done } = req.body;

  const sql = "UPDATE tasks SET task=?, done=? WHERE id=?";

  db.query(sql, [task, done, id], (err, result) => {
    if (err) {
      console.log(err);
      return res.send("Error updating ❌");
    }

    res.json({ message: "Task Updated", success: true });
  });
});

// ======================
// 🚀 START SERVER
// ======================
app.listen(3000, () => {
  console.log("🚀 Server running on port 3000");
});
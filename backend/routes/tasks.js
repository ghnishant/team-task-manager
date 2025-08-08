const express = require('express');
const jwt = require('jsonwebtoken');
const Task = require('../models/Task');
const router = express.Router();

// Middleware for authentication
const auth = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) return res.status(403).send({ message: "Token missing" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // ✅ contains { id: user._id }
    next();
  } catch {
    res.status(401).send({ message: "Invalid token" });
  }
};


// Create Task
router.post('/', auth, async (req, res) => {
  const task = new Task({
    ...req.body,
    userId: req.user.id // ✅ attach user ID from JWT
  });
  await task.save();
  res.send(task);
});


// Get All Tasks
router.get('/', auth, async (req, res) => {
  const tasks = await Task.find({ userId: req.user.id }); // ✅ filter by user
  res.send(tasks);
});


// Update Status
router.put('/:id', auth, async (req, res) => {
  const { status } = req.body;
  await Task.findByIdAndUpdate(req.params.id, { status });
  res.send({ message: "Task updated" });
});

module.exports = router;

const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: String,
  description: String,
  assignee: String,
  deadline: Date,
  status: { type: String, default: "pending" },
  createdAt: { type: Date, default: Date.now },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" } // ✅ added
});

module.exports = mongoose.model('Task', taskSchema);

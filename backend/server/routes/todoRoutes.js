const express = require('express');
const router = express.Router();

const Todo = require('../models/Todo');
const auth = require('../middleware/authMiddleware');

// CREATE
router.post('/', auth, async (req, res) => {
  try {
    const { task, priority, category, dueDate } = req.body;

    const todo = await Todo.create({
      task,
      priority:  priority  || 'low',
      category:  category  || 'General',
      dueDate:   dueDate   || null,
      user: req.user.userId
    });

    res.json(todo);
  } catch (err) {
    console.error('Create error:', err);
    res.status(500).json({ message: "Error creating todo" });
  }
});

// READ
router.get('/', auth, async (req, res) => {
  try {
    const todos = await Todo.find({ user: req.user.userId }).sort({ createdAt: -1 });
    res.json(todos);
  } catch (err) {
    console.error('Fetch error:', err);
    res.status(500).json({ message: "Error fetching todos" });
  }
});

// UPDATE — ✅ FIXED: now saves ALL fields, not just task
router.put('/:id', auth, async (req, res) => {
  try {
    const { task, priority, category, dueDate } = req.body;

    const updated = await Todo.findByIdAndUpdate(
      req.params.id,
      {
        task,
        priority:  priority  || 'low',
        category:  category  || 'General',
        dueDate:   dueDate   || null,
      },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Todo not found" });
    res.json(updated);
  } catch (err) {
    console.error('Update error:', err);
    res.status(500).json({ message: "Error updating todo" });
  }
});

// DELETE
router.delete('/:id', auth, async (req, res) => {
  try {
    await Todo.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting todo" });
  }
});

// TOGGLE COMPLETE
router.patch('/:id', auth, async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) return res.status(404).json({ message: "Todo not found" });
    todo.completed = !todo.completed;
    await todo.save();
    res.json(todo);
  } catch (err) {
    res.status(500).json({ message: "Error toggling todo" });
  }
});

module.exports = router;
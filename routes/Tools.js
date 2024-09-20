const express = require('express');
const router = express.Router();
const Tools = require('../models/Tools');

// Get all tools
router.get('/', async (req, res) => {
  try {
    const tools = await Tools.find();
    res.json(tools);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a single tool
router.get('/:id', getTool, (req, res) => {
  res.json(res.tools);
});

// Create a new tool
router.post('/', async (req, res) => {
  const tools = new Tools({
    tools: req.body.tools
  });

  try {
    const newTool = await tools.save();
    res.status(201).json(newTool);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a tool (PATCH - partial update)
router.patch('/:id', getTool, async (req, res) => {
  if (req.body.tools != null) {
    res.tools.tools = req.body.tools;
  }

  try {
    const updatedTool = await res.tools.save();
    res.json(updatedTool);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Replace a tool (PUT - full update)
router.put('/:id', getTool, async (req, res) => {
  res.tools.tools = req.body.tools;

  try {
    const updatedTool = await res.tools.save();
    res.json(updatedTool);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a tool
router.delete('/:id', getTool, async (req, res) => {
  try {
    await res.tools.deleteOne();  // Correct method for deleting
    res.json({ message: 'Deleted Tool' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Middleware to get tool by ID
async function getTool(req, res, next) {
  let tools;
  try {
    tools = await Tools.findById(req.params.id);
    if (tools == null) {
      return res.status(404).json({ message: 'Cannot find tool' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.tools = tools;
  next();
}

module.exports = router;

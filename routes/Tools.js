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

// Get a single tools
router.get('/:id', getHazard, (req, res) => {
  res.json(res.tools);
});

// Create a new tools
router.post('/', async (req, res) => {
  const tools = new Tools({
    tools: req.body.tools
  });

  try {
    const newHazard = await tools.save();
    res.status(201).json(newHazard);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a tools
router.patch('/:id', getHazard, async (req, res) => {
  if (req.body.tools != null) {
    res.tools.tools = req.body.tools;
  }

  try {
    const updatedHazard = await res.tools.save();
    res.json(updatedHazard);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a tools
router.delete('/:id', getHazard, async (req, res) => {
  try {
    await res.tools.remove();
    res.json({ message: 'Deleted Hazard' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

async function getHazard(req, res, next) {
  let tools;
  try {
    tools = await Tools.findById(req.params.id);
    if (tools == null) {
      return res.status(404).json({ message: 'Cannot find tools' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.tools = tools;
  next();
}

module.exports = router;
const express = require('express');
const router = express.Router();
const PermitsType = require('../models/PermitsTypes.js');

// Get all permitsType
router.get('/', async (req, res) => {
  try {
    const permitsType = await PermitsType.find();
    res.json(permitsType);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a single permitsType
router.get('/:id', getHazard, (req, res) => {
  res.json(res.permitsType);
});

// Create a new permitsType
router.post('/', async (req, res) => {
  const permitsType = new PermitsType({
    permitsType: req.body.permitsType,
    SafetyChecks: req.body.SafetyChecks  // Add SafetyChecks here
  });

  try {
    const newPermitsType = await permitsType.save();
    res.status(201).json(newPermitsType);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a permitsType
router.patch('/:id', getHazard, async (req, res) => {
  if (req.body.permitsType != null) {
    res.permitsType.permitsType = req.body.permitsType;
  }

  try {
    const updatedHazard = await res.permitsType.save();
    res.json(updatedHazard);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a permitsType
router.delete('/:id', getHazard, async (req, res) => {
  try {
    await res.permitsType.deleteOne();  // Use deleteOne() method
    res.json({ message: 'Deleted permitsType' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Middleware to get permitsType by ID
async function getHazard(req, res, next) {
  let permitsType;
  try {
    permitsType = await PermitsType.findById(req.params.id);
    if (permitsType == null) {
      return res.status(404).json({ message: 'Cannot find permitsType' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.permitsType = permitsType;
  next();
}


module.exports = router;

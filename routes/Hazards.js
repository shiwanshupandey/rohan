const express = require('express');
const router = express.Router();
const Hazards = require('../models/Hazards');

// Get all hazards
router.get('/', async (req, res) => {
  try {
    const hazards = await Hazards.find();
    res.json(hazards);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a single hazard
router.get('/:id', getHazard, (req, res) => {
  res.json(res.hazard);
});

// Create a new hazard
router.post('/', async (req, res) => {
  const hazard = new Hazards({
    hazards: req.body.hazards
  });

  try {
    const newHazard = await hazard.save();
    res.status(201).json(newHazard);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a hazard
router.patch('/:id', getHazard, async (req, res) => {
  if (req.body.hazards != null) {
    res.hazard.hazards = req.body.hazards;
  }

  try {
    const updatedHazard = await res.hazard.save();
    res.json(updatedHazard);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a hazard
router.delete('/:id', getHazard, async (req, res) => {
  try {
    await res.hazard.remove();
    res.json({ message: 'Deleted Hazard' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

async function getHazard(req, res, next) {
  let hazard;
  try {
    hazard = await Hazards.findById(req.params.id);
    if (hazard == null) {
      return res.status(404).json({ message: 'Cannot find hazard' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.hazard = hazard;
  next();
}

module.exports = router;
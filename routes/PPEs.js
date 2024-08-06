const express = require('express');
const router = express.Router();
const PPEs = require('../models/PPEs');

// Get all ppes
router.get('/', async (req, res) => {
  try {
    const ppes = await PPEs.find();
    res.json(ppes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a single ppes
router.get('/:id', getHazard, (req, res) => {
  res.json(res.ppes);
});

// Create a new ppes
router.post('/', async (req, res) => {
  const ppes = new PPEs({
    ppes: req.body.ppes
  });

  try {
    const newHazard = await ppes.save();
    res.status(201).json(newHazard);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a ppes
router.patch('/:id', getHazard, async (req, res) => {
  if (req.body.ppes != null) {
    res.ppes.ppes = req.body.ppes;
  }

  try {
    const updatedHazard = await res.ppes.save();
    res.json(updatedHazard);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a ppes
router.delete('/:id', getHazard, async (req, res) => {
  try {
    await res.ppes.remove();
    res.json({ message: 'Deleted Hazard' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

async function getHazard(req, res, next) {
  let ppes;
  try {
    ppes = await PPEs.findById(req.params.id);
    if (ppes == null) {
      return res.status(404).json({ message: 'Cannot find ppes' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.ppes = ppes;
  next();
}

module.exports = router;
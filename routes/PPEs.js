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
router.get('/:id', getPPE, (req, res) => {
  res.json(res.ppes);
});

// Create a new ppes
router.post('/', async (req, res) => {
  const ppes = new PPEs({
    ppes: req.body.ppes
  });

  try {
    const newPPE = await ppes.save();
    res.status(201).json(newPPE);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a ppes (PATCH - partial update)
router.patch('/:id', getPPE, async (req, res) => {
  if (req.body.ppes != null) {
    res.ppes.ppes = req.body.ppes;
  }

  try {
    const updatedPPE = await res.ppes.save();
    res.json(updatedPPE);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Replace a ppes (PUT - full update)
router.put('/:id', getPPE, async (req, res) => {
  res.ppes.ppes = req.body.ppes;

  try {
    const updatedPPE = await res.ppes.save();
    res.json(updatedPPE);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a ppes
router.delete('/:id', getPPE, async (req, res) => {
  try {
    await res.ppes.deleteOne();  // Corrected deleteOne instead of remove
    res.json({ message: 'Deleted PPE' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Middleware to get ppes by ID
async function getPPE(req, res, next) {
  let ppes;
  try {
    ppes = await PPEs.findById(req.params.id);
    if (ppes == null) {
      return res.status(404).json({ message: 'Cannot find PPE' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.ppes = ppes;
  next();
}

module.exports = router;

const express = require('express');
const Inspection = require('../models/Inspection');
const router = express.Router();

// Create a new inspection
router.post('/', async (req, res) => {
  const inspectionData = req.body;
  try {
    const newInspection = new Inspection(inspectionData);
    await newInspection.save();
    res.status(201).json(newInspection);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all inspections
router.get('/', async (req, res) => {
  try {
    const inspections = await Inspection.find();
    res.json(inspections);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a single inspection by ID
router.get('/:id', async (req, res) => {
  try {
    const inspection = await Inspection.findById(req.params.id);
    if (inspection == null) {
      return res.status(404).json({ message: 'Inspection not found' });
    }
    res.json(inspection);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update an inspection by ID
router.put('/:id', async (req, res) => {
  try {
    const inspection = await Inspection.findById(req.params.id);
    if (inspection == null) {
      return res.status(404).json({ message: 'Inspection not found' });
    }

    Object.assign(inspection, req.body);
    await inspection.save();
    res.json(inspection);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete an inspection by ID
router.delete('/:id', async (req, res) => {
  try {
    const inspection = await Inspection.findByIdAndDelete(req.params.id);
    if (inspection == null) {
      return res.status(404).json({ message: 'Inspection not found' });
    }
    res.json({ message: 'Inspection deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

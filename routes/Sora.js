const express = require('express');
const Observation = require('../models/Sora');
const router = express.Router();

// Create a new observation
router.post('/', async (req, res) => {
  const observationData = req.body;
  try {
    const newObservation = new Observation(observationData);
    await newObservation.save();
    res.status(201).json(newObservation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all observations
router.get('/', async (req, res) => {
  try {
    const observations = await Observation.find();
    res.json(observations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a single observation by ID
router.get('/:id', async (req, res) => {
  try {
    const observation = await Observation.findById(req.params.id);
    if (observation == null) {
      return res.status(404).json({ message: 'Observation not found' });
    }
    res.json(observation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update an observation by ID
router.put('/:id', async (req, res) => {
  try {
    const observation = await Observation.findById(req.params.id);
    if (observation == null) {
      return res.status(404).json({ message: 'Observation not found' });
    }

    Object.assign(observation, req.body);
    await observation.save();
    res.json(observation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete an observation by ID
router.delete('/:id', async (req, res) => {
  try {
    const observation = await Observation.findByIdAndDelete(req.params.id);
    if (observation == null) {
      return res.status(404).json({ message: 'Observation not found' });
    }
    res.json({ message: 'Observation deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

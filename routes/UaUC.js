const express = require('express');
const Observation = require('../models/UaUC');
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

router.get('/', async (req, res) => {
  try {
    const observations = await Observation.find()
      .populate('projectName')  // Populate the Project reference
      .populate('observer')      // Populate the User reference for observer
      .populate('hazards')       // Populate the Hazards reference
      .populate('riskValue')     // Populate the RiskRating reference
      .populate('assignedTo')    // Populate the User reference for assignedTo
      .populate('actionTakenBy'); // Populate the User reference for actionTakenBy
    res.json(observations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.get('/:id', async (req, res) => {
  try {
    const observation = await Observation.findById(req.params.id)
      .populate('projectName')  // Populate the Project reference
      .populate('observer')      // Populate the User reference for observer
      .populate('hazards')       // Populate the Hazards reference
      .populate('riskValue')     // Populate the RiskRating reference
      .populate('assignedTo')    // Populate the User reference for assignedTo
      .populate('actionTakenBy'); // Populate the User reference for actionTakenBy

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

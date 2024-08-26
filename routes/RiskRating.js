const express = require('express');
const router = express.Router();
const RiskRating = require('../models/RiskRating'); // Adjust the path to your RiskRating model

// Get all RiskRatings
router.get('/', async (req, res) => {
    try {
        const riskRatings = await RiskRating.find();
        res.json(riskRatings);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get a single RiskRating by ID
router.get('/:id', async (req, res) => {
    try {
        const riskRating = await RiskRating.findById(req.params.id);
        if (!riskRating) return res.status(404).json({ message: 'RiskRating not found' });
        res.json(riskRating);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create a new RiskRating
router.post('/', async (req, res) => {
    const riskRating = new RiskRating({
        value: req.body.value,
        severity: req.body.severity,
        alertTimeline: req.body.alertTimeline,
        escalationAlert: req.body.escalationAlert,
        repeatWarning: req.body.repeatWarning
    });

    try {
        const newRiskRating = await riskRating.save();
        res.status(201).json(newRiskRating);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update a RiskRating by ID
router.put('/:id', async (req, res) => {
    try {
        const riskRating = await RiskRating.findById(req.params.id);
        if (!riskRating) return res.status(404).json({ message: 'RiskRating not found' });

        if (req.body.value != null) riskRating.value = req.body.value;
        if (req.body.severity != null) riskRating.severity = req.body.severity;
        if (req.body.alertTimeline != null) riskRating.alertTimeline = req.body.alertTimeline;
        if (req.body.escalationAlert != null) riskRating.escalationAlert = req.body.escalationAlert;
        if (req.body.repeatWarning != null) riskRating.repeatWarning = req.body.repeatWarning;

        const updatedRiskRating = await riskRating.save();
        res.json(updatedRiskRating);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete a RiskRating by ID
router.delete('/:id', async (req, res) => {
    try {
        const riskRating = await RiskRating.findById(req.params.id);
        if (!riskRating) return res.status(404).json({ message: 'RiskRating not found' });

        await riskRating.remove();
        res.json({ message: 'RiskRating deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;

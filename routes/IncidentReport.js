const express = require('express');
const IncidentReport = require('../models/IncidentReport');
const router = express.Router();

// Create a new incident report
router.post('/', async (req, res) => {
  const incidentReportData = req.body;
  try {
    const newIncidentReport = new IncidentReport(incidentReportData);
    await newIncidentReport.save();
    res.status(201).json(newIncidentReport);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all incident reports
router.get('/', async (req, res) => {
  try {
    const incidentReports = await IncidentReport.find();
    res.json(incidentReports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a single incident report by ID
router.get('/:id', async (req, res) => {
  try {
    const incidentReport = await IncidentReport.findById(req.params.id);
    if (incidentReport == null) {
      return res.status(404).json({ message: 'Incident report not found' });
    }
    res.json(incidentReport);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update an incident report by ID
router.put('/:id', async (req, res) => {
  try {
    const incidentReport = await IncidentReport.findById(req.params.id);
    if (incidentReport == null) {
      return res.status(404).json({ message: 'Incident report not found' });
    }

    Object.assign(incidentReport, req.body);
    await incidentReport.save();
    res.json(incidentReport);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete an incident report by ID
router.delete('/:id', async (req, res) => {
  try {
    const incidentReport = await IncidentReport.findByIdAndDelete(req.params.id);
    if (incidentReport == null) {
      return res.status(404).json({ message: 'Incident report not found' });
    }
    res.json({ message: 'Incident report deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

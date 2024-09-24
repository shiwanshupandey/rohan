const express = require('express');
const Meeting = require('../models/TbtMeeting');
const router = express.Router();

// Create a new meeting (Supports posting multiple meetings)
router.post('/', async (req, res) => {
  try {
    // For multiple meetings, req.body should be an array
    const meetingsData = Array.isArray(req.body) ? req.body : [req.body];
    
    // Create multiple meetings
    const createdMeetings = await Meeting.insertMany(meetingsData);

    res.status(201).json(createdMeetings);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all meetings
router.get('/', async (req, res) => {
  try {
    const meetings = await Meeting.find().populate(['projectName', 'typeOfTopic']);
    res.json(meetings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a single meeting by ID
router.get('/:id', async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id).populate(['projectName', 'typeOfTopic']);
    if (!meeting) {
      return res.status(404).json({ message: 'Meeting not found' });
    }
    res.json(meeting);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a meeting by ID
router.put('/:id', async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id);
    if (!meeting) {
      return res.status(404).json({ message: 'Meeting not found' });
    }

    // Update the meeting with new data
    Object.assign(meeting, req.body);
    await meeting.save();
    res.json(meeting);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a meeting by ID
router.delete('/:id', async (req, res) => {
  try {
    const meeting = await Meeting.findByIdAndDelete(req.params.id);
    if (!meeting) {
      return res.status(404).json({ message: 'Meeting not found' });
    }
    res.json({ message: 'Meeting deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


module.exports = router;

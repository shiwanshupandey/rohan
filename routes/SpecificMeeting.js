const express = require('express');
const SpecificMeeting = require('../models/SpecificMeeting'); // Assuming the model is in models folder
const router = express.Router();

// Create new meeting(s) - Supports posting multiple records
router.post('/', async (req, res) => {
  try {
    const meetingData = Array.isArray(req.body) ? req.body : [req.body]; // Support single or multiple entries

    // Create multiple meetings
    const newMeetings = await SpecificMeeting.insertMany(meetingData);

    res.status(201).json(newMeetings);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all meetings
router.get('/', async (req, res) => {
  try {
    const meetings = await SpecificMeeting.find().populate(['projectName', 'typeOfTopic', 'instructionBy']);
    res.json(meetings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a single meeting by ID
router.get('/:id', async (req, res) => {
  try {
    const meeting = await SpecificMeeting.findById(req.params.id).populate(['projectName', 'typeOfTopic', 'instructionBy']);
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
    const meeting = await SpecificMeeting.findById(req.params.id);
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
    const meeting = await SpecificMeeting.findByIdAndDelete(req.params.id);
    if (!meeting) {
      return res.status(404).json({ message: 'Meeting not found' });
    }
    res.json({ message: 'Meeting deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

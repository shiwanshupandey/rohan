const express = require('express');
const Meeting = require('../models/TbtMeeting');
const router = express.Router();

// Create a new meeting (Supports posting multiple meetings)
router.post('/', async (req, res) => {
  try {
    const meetingData = req.body;

    // Check if it's an array of data or a single object
    if (Array.isArray(meetingData)) {
      // Handle multiple meetings
      const newMeetings = await Meeting.insertMany(meetingData);
      res.status(201).json(newMeetings);
    } else {
      // Handle a single meeting
      const newMeeting = new Meeting(meetingData);
      await newMeeting.save();
      res.status(201).json(newMeeting);
    }
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

    Object.assign(meeting, req.body); // Update fields
    await meeting.save(); // Save the updated meeting
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

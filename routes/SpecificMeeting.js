const express = require('express');
const Meeting = require('../models/TbtMeeting');
const router = express.Router();

// Create a new meeting
router.post('/', async (req, res) => {
  try {
    const meetingData = req.body;

    // Create a new Meeting instance
    const newMeeting = new Meeting(meetingData);

    // Save the meeting
    await newMeeting.save();

    // Calculate attendeesNos and attendeesHours automatically
    newMeeting.attendeesNos = newMeeting.formFilled.length;
    newMeeting.attendeesHours = (newMeeting.attendeesNos * 10) / 60;

    await newMeeting.save();
    
    res.status(201).json(newMeeting);
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
    const meeting = await Meeting.findById(req.params.id);
    if (meeting == null) {
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
    if (meeting == null) {
      return res.status(404).json({ message: 'Meeting not found' });
    }

    // Update the meeting data
    Object.assign(meeting, req.body);

    // Recalculate attendeesNos and attendeesHours
    meeting.attendeesNos = meeting.formFilled.length;
    meeting.attendeesHours = (meeting.attendeesNos * 10) / 60;

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
    if (meeting == null) {
      return res.status(404).json({ message: 'Meeting not found' });
    }
    res.json({ message: 'Meeting deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

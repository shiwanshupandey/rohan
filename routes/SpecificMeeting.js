const express = require('express');
const SpecificMeeting = require('../models/SpecificMeeting');
const router = express.Router();

// Create a new SpecificMeeting
router.post('/', async (req, res) => {
  try {
    const { 
      projectName, 
      date, 
      time, 
      typeOfTopic, 
      attendees, 
      attendeesName, 
      instructionBy, 
      documentaryEvidencePhoto, 
      geotagging, 
      commentsBox 
    } = req.body;

    // Validate the URL for the photo
    if (!validateImageUrl(documentaryEvidencePhoto)) {
      return res.status(400).json({ message: 'Invalid documentary evidence photo URL.' });
    }

    const newSpecificMeeting = new SpecificMeeting({
      projectName,
      date,
      time,
      typeOfTopic,
      attendees,
      attendeesName,
      instructionBy,
      documentaryEvidencePhoto,
      geotagging,
      commentsBox
    });

    await newSpecificMeeting.save();
    res.status(201).json(newSpecificMeeting);
  } catch (error) {
    console.error('Error:', error);
    res.status(400).json({ message: error.message });
  }
});

// Update a SpecificMeeting by ID
router.put('/:id', async (req, res) => {
  try {
    const meeting = await SpecificMeeting.findById(req.params.id);
    if (!meeting) {
      return res.status(404).json({ message: 'SpecificMeeting not found' });
    }

    const { projectName, date, time, typeOfTopic, attendees, attendeesName, instructionBy, documentaryEvidencePhoto, geotagging, commentsBox } = req.body;

    // Update the fields only if they are provided
    if (projectName) meeting.projectName = projectName;
    if (date) meeting.date = date;
    if (time) meeting.time = time;
    if (typeOfTopic) meeting.typeOfTopic = typeOfTopic;
    if (attendees) meeting.attendees = attendees;
    if (attendeesName) meeting.attendeesName = attendeesName;
    if (instructionBy) meeting.instructionBy = instructionBy;
    if (geotagging) meeting.geotagging = geotagging;
    if (commentsBox) meeting.commentsBox = commentsBox;

    // Validate the URL for the photo
    if (documentaryEvidencePhoto && validateImageUrl(documentaryEvidencePhoto)) {
      meeting.documentaryEvidencePhoto = documentaryEvidencePhoto;
    } else {
      return res.status(400).json({ message: 'Invalid documentary evidence photo URL.' });
    }

    await meeting.save();
    res.json(meeting);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all SpecificMeetings
router.get('/', async (req, res) => {
  try {
    const meetings = await SpecificMeeting.find()
      .populate(['projectName', 'typeOfTopic', 'instructionBy'])
      .lean()
      .exec();

    res.json(meetings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a single SpecificMeeting by ID
router.get('/:id', async (req, res) => {
  try {
    const meeting = await SpecificMeeting.findById(req.params.id)
      .populate(['projectName', 'typeOfTopic', 'instructionBy'])
      .lean()
      .exec();

    if (!meeting) {
      return res.status(404).json({ message: 'SpecificMeeting not found' });
    }

    res.json(meeting);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a SpecificMeeting by ID
router.delete('/:id', async (req, res) => {
  try {
    const meeting = await SpecificMeeting.findByIdAndDelete(req.params.id);
    if (!meeting) {
      return res.status(404).json({ message: 'SpecificMeeting not found' });
    }
    res.json({ message: 'SpecificMeeting deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Function to validate image URLs
const validateImageUrl = url => {
  const regex = /\.(jpeg|jpg|gif|png|svg|webp)$/;
  return regex.test(url);
};

module.exports = router;

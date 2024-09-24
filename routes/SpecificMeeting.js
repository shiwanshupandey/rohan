const express = require('express');
const SpecificMeeting = require('../models/SpecificMeeting');
const router = express.Router();
const multer = require('multer');
const path = require('path');

// Set up Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}${path.extname(file.originalname)}`);
  }
});

// Initialize Multer with the storage configuration
const upload = multer({ storage });

// Create a new SpecificMeeting
router.post('/', upload.single('documentaryEvidencePhoto'), async (req, res) => {
  try {
    const { 
      projectName, 
      date, 
      time, 
      typeOfTopic, 
      attendees, 
      attendeesName, 
      instructionBy, 
      geotagging, 
      commentsBox 
    } = req.body;

    // Check if a file is uploaded
    if (!req.file) {
      return res.status(400).json({ message: 'Documentary evidence photo is required.' });
    }

    const documentaryEvidencePhoto = req.file.path;

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
router.put('/:id', upload.single('documentaryEvidencePhoto'), async (req, res) => {
  try {
    const meeting = await SpecificMeeting.findById(req.params.id);
    if (!meeting) {
      return res.status(404).json({ message: 'SpecificMeeting not found' });
    }

    const { projectName, date, time, typeOfTopic, attendees, attendeesName, instructionBy, geotagging, commentsBox } = req.body;

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

    // Check if a file is uploaded
    if (req.file) {
      meeting.documentaryEvidencePhoto = req.file.path;
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
      .lean() // .lean() ensures that virtuals are included properly in the response
      .exec();

    res.json(meetings); // Automatically includes attendance and attendanceHours
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a single SpecificMeeting by ID
router.get('/:id', async (req, res) => {
  try {
    const meeting = await SpecificMeeting.findById(req.params.id)
      .populate(['projectName', 'typeOfTopic', 'instructionBy'])
      .lean() // Ensure virtual fields are included
      .exec();

    if (!meeting) {
      return res.status(404).json({ message: 'SpecificMeeting not found' });
    }

    res.json(meeting);  // Automatically includes attendance and attendanceHours
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

module.exports = router;

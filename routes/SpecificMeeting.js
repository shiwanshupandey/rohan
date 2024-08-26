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
router.post('/', async (req, res) => {
  try {
    const { projectName, date, time, topicName, typeOfTopic, attendees, inducteesName, tradeTypes, instructionBy, documentaryEvidencePhoto, traineeSignBy, trainingSignBy, geotagging, commentsBox } = req.body;
    const newSpecificMeeting = new SpecificMeeting({
      projectName,
      date,
      time,
      topicName,
      typeOfTopic,
      attendees,
      inducteesName,
      tradeTypes,
      instructionBy,
      documentaryEvidencePhoto,
      traineeSignBy,
      trainingSignBy,
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

// Get all SpecificMeetings
router.get('/', async (req, res) => {
  try {
    const meetings = await SpecificMeeting.find().populate(['projectName', 'typeOfTopic', 'tradeTypes', 'instructionBy']);
    res.json(meetings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a single SpecificMeeting by ID
router.get('/:id', async (req, res) => {
  try {
    const meeting = await SpecificMeeting.findById(req.params.id).populate(['projectName', 'typeOfTopic', 'tradeTypes', 'instructionBy']);
    if (meeting == null) {
      return res.status(404).json({ message: 'SpecificMeeting not found' });
    }
    res.json(meeting);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a SpecificMeeting by ID
router.put('/:id', upload.single('documentaryEvidencePhoto'), async (req, res) => {
  try {
    const meeting = await SpecificMeeting.findById(req.params.id);
    if (meeting == null) {
      return res.status(404).json({ message: 'SpecificMeeting not found' });
    }

    const { projectName, date, time, topicName, typeOfTopic, attendees, inducteesName, tradeTypes, instructionBy, traineeSignBy, trainingSignBy, geotagging, commentsBox } = req.body;
    if (req.file) {
      meeting.documentaryEvidencePhoto = req.file.filename;
    }
    meeting.projectName = projectName;
    meeting.date = date;
    meeting.time = time;
    meeting.topicName = topicName;
    meeting.typeOfTopic = typeOfTopic;
    meeting.attendees = attendees;
    meeting.inducteesName = inducteesName;
    meeting.tradeTypes = tradeTypes;
    meeting.instructionBy = instructionBy;
    meeting.traineeSignBy = traineeSignBy;
    meeting.trainingSignBy = trainingSignBy;
    meeting.geotagging = geotagging;
    meeting.commentsBox = commentsBox;

    await meeting.save();
    res.json(meeting);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a SpecificMeeting by ID
router.delete('/:id', async (req, res) => {
  try {
    const meeting = await SpecificMeeting.findByIdAndDelete(req.params.id);
    if (meeting == null) {
      return res.status(404).json({ message: 'SpecificMeeting not found' });
    }
    res.json({ message: 'SpecificMeeting deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

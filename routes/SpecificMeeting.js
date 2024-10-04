const express = require('express');
const SpecificMeeting = require('../models/SpecificMeeting'); // Assuming the model is in models folder
const router = express.Router();
const multer = require('multer');

const { uploadToDrive } = require('../api/driveUtils');


// Multer middleware using memory storage
const upload = multer({ storage: multer.memoryStorage() });

// Folder ID for the new Google Drive folder
const FOLDER_ID = '1FNQfihtVUKUfN650pP8PRoaz8075vMs-';

// Create a new API endpoint to upload an image to Google Drive for Work Permits
router.post('/image', upload.single('image'), async (req, res) => {
  try {
    // Check if the file is present
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Get the file from the request
    const file = req.file;

    // Upload the image to Google Drive
    const fileUrl = await uploadToDrive(file.buffer, file.originalname, file.mimetype, FOLDER_ID);

    // Return the file URL
    res.status(201).json({ fileUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

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

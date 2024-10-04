const express = require('express');
const multer = require('multer');
const { uploadToDrive } = require('../api/driveUtils.js');  // Import the utility function
const Meeting = require('../models/TbtMeeting');
const router = express.Router();

// Multer middleware using memory storage
const upload = multer({ storage: multer.memoryStorage() });

// Create a new API endpoint to upload an image to Google Drive
router.post('/image', upload.single('image'), async (req, res) => {
  try {
    // Check if file is present
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const file = req.file;

    // Upload the image to Google Drive using a dynamic folder ID
    const folderId = 'your-folder-id-here';  // Change folder ID as per route's requirement
    const fileUrl = await uploadToDrive(file.buffer, file.originalname, file.mimetype, folderId);

    // Return the file URL
    res.status(201).json({ fileUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

// Use the same uploadToDrive logic in other routes
router.post('/meeting', upload.fields([
  { name: 'documentaryEvidencePhoto', maxCount: 1 },
  { name: 'formFilledSignature', maxCount: 100 },
]), async (req, res) => {
  try {
    const { projectName, date, time, typeOfTopic, geotagging, commentsBox } = req.body;

    // Upload documentary evidence photo
    let documentaryEvidencePhotoUrl = null;
    if (req.files['documentaryEvidencePhoto']) {
      const photo = req.files['documentaryEvidencePhoto'][0];
      const folderId = 'meeting-folder-id';  // Change folder ID based on requirement
      documentaryEvidencePhotoUrl = await uploadToDrive(photo.buffer, photo.originalname, photo.mimetype, folderId);
    }

    // Process formFilled data
    const formFilledData = [];
    if (req.body.formFilled) {
      JSON.parse(req.body.formFilled).forEach((attendee, index) => {
        formFilledData.push({
          name: attendee.name,
          signature: req.files.formFilledSignature && req.files.formFilledSignature[index]
            ? req.files.formFilledSignature[index].filename
            : attendee.signature,  // Keep existing signature if not replaced
        });
      });
    }

    // Create new Meeting document
    const newMeeting = new Meeting({
      projectName,
      date,
      time,
      typeOfTopic,
      formFilled: formFilledData,
      documentaryEvidencePhoto: documentaryEvidencePhotoUrl,
      geotagging,
      commentsBox,
    });

    await newMeeting.save();
    res.status(201).json(newMeeting);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});


// Get all Meetings - GET
router.get('/', async (req, res) => {
  try {
    const meetings = await Meeting.find().populate('projectName').populate('typeOfTopic');
    res.json(meetings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a single Meeting by ID - GET
router.get('/:id', async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id).populate('projectName').populate('typeOfTopic');
    if (!meeting) return res.status(404).json({ error: 'Meeting not found' });
    res.json(meeting);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a Meeting by ID - PUT
router.put('/:id', upload.fields([
  { name: 'documentaryEvidencePhoto', maxCount: 1 },
  { name: 'formFilledSignature', maxCount: 100 },
]), async (req, res) => {
  try {
    const { projectName, date, time, typeOfTopic, formFilled, geotagging, commentsBox } = req.body;

    const meeting = await Meeting.findById(req.params.id);
    if (!meeting) return res.status(404).json({ error: 'Meeting not found' });

    // Update meeting fields
    meeting.projectName = projectName || meeting.projectName;
    meeting.date = date || meeting.date;
    meeting.time = time || meeting.time;
    meeting.typeOfTopic = typeOfTopic || meeting.typeOfTopic;
    meeting.geotagging = geotagging || meeting.geotagging;
    meeting.commentsBox = commentsBox || meeting.commentsBox;

    // Handle file uploads for signatures and documentary evidence
    if (req.files['documentaryEvidencePhoto']) {
      const photo = req.files['documentaryEvidencePhoto'][0];
      meeting.documentaryEvidencePhoto = await uploadToDrive(photo.buffer, photo.originalname, photo.mimetype);
    }

    const updatedFormFilledData = JSON.parse(formFilled).map((entry, index) => ({
      name: entry.name,
      signature: req.files.formFilledSignature && req.files.formFilledSignature[index]
        ? req.files.formFilledSignature[index].filename
        : entry.signature,  // Keep existing signature if not replaced
    }));
    meeting.formFilled = updatedFormFilledData;

    await meeting.save();
    res.json(meeting);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a Meeting by ID - DELETE
router.delete('/:id', async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id);
    if (!meeting) return res.status(404).json({ error: 'Meeting not found' });

    await meeting.deleteOne();  // Updated to use deleteOne
    res.json({ message: 'Meeting deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;

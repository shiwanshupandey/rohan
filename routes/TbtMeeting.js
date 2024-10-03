const express = require('express');
const { google } = require('googleapis');
const multer = require('multer');
const Meeting = require('../models/TbtMeeting');
const { Readable } = require('stream');
const { private_key, client_email } = require('./credentials.json');

const router = express.Router();

const oauth2Client = new google.auth.JWT(
  client_email, 
  null, 
  private_key, 
  ['https://www.googleapis.com/auth/drive']
);

const drive = google.drive({ version: 'v3', auth: oauth2Client });

// Multer middleware using memory storage
const upload = multer({ storage: multer.memoryStorage() });

// Helper function to convert buffer to stream
const bufferToStream = (buffer) => {
  const stream = new Readable();
  stream.push(buffer);
  stream.push(null);
  return stream;
};

// Upload file to Google Drive without retry logic
const uploadToDrive = async (fileBuffer, fileName, mimeType, folderId = '1A7Xs3swAMfH32vzhxd5IazGaL_fZqN1s') => {
  const fileMetadata = {
    name: fileName,
    parents: [folderId],
  };
  const media = {
    mimeType,
    body: bufferToStream(fileBuffer),
  };

  const driveResponse = await drive.files.create({
    resource: fileMetadata,
    media: media,
    fields: 'id',
  });

  // Set file as publicly accessible
  await drive.permissions.create({
    fileId: driveResponse.data.id,
    requestBody: { role: 'reader', type: 'anyone' },
  });

  return `https://drive.google.com/uc?id=${driveResponse.data.id}&export=download`;
};

// Create a new Meeting - POST
router.post('/', upload.fields([
  { name: 'documentaryEvidencePhoto', maxCount: 1 },
  { name: 'formFilledSignature', maxCount: 100 },
]), async (req, res) => {
  try {
    console.log('Files:', req.files);
    console.log('Body:', req.body);

    const { projectName, date, time, typeOfTopic, geotagging, commentsBox } = req.body;

    // Upload documentary evidence photo
    let documentaryEvidencePhotoUrl = null;
    if (req.files['documentaryEvidencePhoto']) {
      const photo = req.files['documentaryEvidencePhoto'][0];
      documentaryEvidencePhotoUrl = await uploadToDrive(photo.buffer, photo.originalname, photo.mimetype);
    }

    // Process formFilled data
    const formFilledData = [];
    for (let i = 0; i < Object.keys(req.body).length; i++) {
      const nameKey = `formFilled[${i}].name`;
      const name = req.body[nameKey];

      if (name && req.files.formFilledSignature && req.files.formFilledSignature[i]) {
        const signature = req.files.formFilledSignature[i];
        const signatureUrl = await uploadToDrive(signature.buffer, `${name}_signature_${i}.jpg`, signature.mimetype);
        formFilledData.push({ name, signature: signatureUrl });
      }
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


// Create a new API endpoint to upload an image to Google Drive
router.post('/uploadImage', upload.single('image'), async (req, res) => {
  try {
    // Check if file is present
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Get file from request
    const file = req.file;

    // Upload the image to Google Drive
    const fileUrl = await uploadToDrive(file.buffer, file.originalname, file.mimetype);

    // Return the file URL
    res.status(201).json({ fileUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to upload image' });
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

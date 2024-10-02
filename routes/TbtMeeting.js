const express = require('express');
const { google } = require('googleapis');
const multer = require('multer');
const Meeting = require('../models/TbtMeeting');  // Assuming you have a Meeting model
const fs = require('fs');
const path = require('path');

const { private_key, client_email } = require('../helper/credentials.json');

// Initialize the router
const router = express.Router();

const oauth2Client = new google.auth.JWT(
  client_email, 
  null, 
  private_key, 
  ['https://www.googleapis.com/auth/drive']
);

const drive = google.drive({ version: 'v3', auth: oauth2Client });

// Multer middleware for handling file uploads
const upload = multer({ dest: 'uploads/' });

// Helper function to upload file to Google Drive within a specific folder
const uploadToDrive = async (filePath, fileName, folderId = '1A7Xs3swAMfH32vzhxd5IazGaL_fZqN1s') => {
  const fileMetadata = {
    name: fileName,
    parents: [folderId]  // Specify the folder to upload the file to
  };
  const media = {
    mimeType: 'image/jpeg',  // Adjust MIME type if different
    body: fs.createReadStream(filePath),
  };

  const driveResponse = await drive.files.create({
    resource: fileMetadata,
    media: media,
    fields: 'id',
  });

  // Set the file as publicly accessible
  await drive.permissions.create({
    fileId: driveResponse.data.id,
    requestBody: {
      role: 'reader',
      type: 'anyone',
    },
  });

  // Get the file's public URL
  const fileUrl = `https://drive.google.com/uc?id=${driveResponse.data.id}&export=download`;
  return fileUrl;
};

// Create a new Meeting - POST
router.post('/', upload.fields([
  { name: 'documentaryEvidencePhoto', maxCount: 1 },
  { name: 'formFilledSignature', maxCount: 100 }  // Multiple signatures can be uploaded
]), async (req, res) => {
  try {
    console.log('Files:', req.files);
    console.log('Body:', req.body);

    const { projectName, date, time, typeOfTopic, geotagging, commentsBox } = req.body;

    // Handle file uploads for documentary evidence
    let documentaryEvidencePhotoUrl = null;
    if (req.files.documentaryEvidencePhoto) {
      const photoPath = req.files.documentaryEvidencePhoto[0].path;
      const photoName = req.files.documentaryEvidencePhoto[0].originalname;
      documentaryEvidencePhotoUrl = await uploadToDrive(photoPath, photoName);

      // Remove file from server after upload to Drive
      fs.unlinkSync(photoPath);
    }

    // Process the formFilled array
    const formFilledData = [];

    for (let i = 0; i < Object.keys(req.body).length; i++) {
      const nameKey = `formFilled[${i}].name`;
      const name = req.body[nameKey];

      if (name && req.files.formFilledSignature && req.files.formFilledSignature[i]) {
        const signaturePath = req.files.formFilledSignature[i].path;
        
        // Use the formFilled name as part of the file name to help with sorting
        const signatureName = `${name}_signature_${i}.jpg`;  // You can adjust the file extension as needed
        
        // Upload the signature image to Google Drive
        const signatureUrl = await uploadToDrive(signaturePath, signatureName);

        // Remove file from server after upload to Drive
        fs.unlinkSync(signaturePath);

        // Push name and signature URL into formFilledData
        formFilledData.push({ name, signature: signatureUrl });
      }
    }

    // Create a new Meeting document
    const newMeeting = new Meeting({
      projectName,
      date,
      time,
      typeOfTopic,
      formFilled: formFilledData,  // Store names and signature URLs
      documentaryEvidencePhoto: documentaryEvidencePhotoUrl,
      geotagging,
      commentsBox
    });

    // Save the new Meeting document to MongoDB
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
  { name: 'formFilledSignature', maxCount: 100 }
]), async (req, res) => {
  try {
    const { projectName, date, time, typeOfTopic, formFilled, geotagging, commentsBox } = req.body;

    const meeting = await Meeting.findById(req.params.id);
    if (!meeting) return res.status(404).json({ error: 'Meeting not found' });

    meeting.projectName = projectName;
    meeting.date = date;
    meeting.time = time;
    meeting.typeOfTopic = typeOfTopic;
    meeting.geotagging = geotagging;
    meeting.commentsBox = commentsBox;

    // Handle file uploads for signature and documentary evidence
    meeting.documentaryEvidencePhoto = req.files.documentaryEvidencePhoto 
      ? req.files.documentaryEvidencePhoto[0].filename 
      : meeting.documentaryEvidencePhoto;

    const formFilledData = JSON.parse(formFilled).map((entry, index) => ({
      name: entry.name,
      signature: req.files.formFilledSignature && req.files.formFilledSignature[index] 
        ? req.files.formFilledSignature[index].filename 
        : entry.signature  // Keep existing signature if not replaced
    }));

    meeting.formFilled = formFilledData;

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

    await meeting.remove();
    res.json({ message: 'Meeting deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

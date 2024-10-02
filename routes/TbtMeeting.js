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

// Helper function for exponential backoff
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const makeApiRequestWithBackoff = async (apiRequest, retries = 5) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await apiRequest();
    } catch (error) {
      if (error.response && error.response.status === 429 && i < retries - 1) {
        const backoffTime = Math.pow(3, i) * 1000; // More aggressive backoff
        console.log(`Rate-limited. Retrying after ${backoffTime} ms.`);
        await sleep(backoffTime);
      } else {
        throw error;
      }
    }
  }
};



// Upload file to Google Drive with retry logic
const uploadToDrive = async (fileBuffer, fileName, mimeType, folderId = '1A7Xs3swAMfH32vzhxd5IazGaL_fZqN1s') => {
  const fileMetadata = {
    name: fileName,
    parents: [folderId],
  };
  const media = {
    mimeType,
    body: bufferToStream(fileBuffer),
  };

  return makeApiRequestWithBackoff(async () => {
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
  });
};

// Respond immediately and handle uploads in the background
router.post('/', upload.fields([...]), async (req, res) => {
  try {
    // Respond quickly to the client
    res.status(202).json({ message: 'Upload in progress' });

    // Handle file uploads in the background
    processUpload(req.files, req.body);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Background processing function
const processUpload = async (files, body) => {
  try {
    const { projectName, date, time, typeOfTopic, geotagging, commentsBox } = body;

    // Perform your uploads here (similar to your original logic)
    let documentaryEvidencePhotoUrl = null;
    if (files['documentaryEvidencePhoto']) {
      const photo = files['documentaryEvidencePhoto'][0];
      documentaryEvidencePhotoUrl = await uploadToDrive(photo.buffer, photo.originalname, photo.mimetype);
    }

    // Process formFilled data and create a new meeting document
    const formFilledData = [];
    for (let i = 0; i < Object.keys(body).length; i++) {
      const nameKey = `formFilled[${i}].name`;
      const name = body[nameKey];
      if (name && files.formFilledSignature && files.formFilledSignature[i]) {
        const signature = files.formFilledSignature[i];
        const signatureUrl = await uploadToDrive(signature.buffer, `${name}_signature_${i}.jpg`, signature.mimetype);
        formFilledData.push({ name, signature: signatureUrl });
      }
    }

    // Save to MongoDB
    const newMeeting = new Meeting({
      projectName, date, time, typeOfTopic, formFilled: formFilledData, documentaryEvidencePhoto: documentaryEvidencePhotoUrl, geotagging, commentsBox,
    });
    await newMeeting.save();
  } catch (err) {
    console.error('Background upload failed:', err);
  }
};


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

    await meeting.remove();
    res.json({ message: 'Meeting deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

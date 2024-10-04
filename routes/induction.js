const express = require('express');
const Induction = require('../models/Induction');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const { uploadToDrive } = require('../api/driveUtils');


// Multer middleware using memory storage
const upload = multer({ storage: multer.memoryStorage() });

// Folder ID for the new Google Drive folder
const FOLDER_ID = '1QbpGOfRfZSfFQBon8lPRb5l9yU1no-Ca';

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

router.post('/', async (req, res) => {
  try {
    const {
      projectName,
      date,
      time,
      inductees,
      inducteesName,
      tradeTypes,
      subContractorName,
      typeOfTopic,
      documentaryEvidencePhoto,  // This is now treated as a URL string
      AnyOthers,
      instructionBy,
      inducteeSignBy,
      geotagging
    } = req.body;

    // Create a new induction record
    const newInduction = new Induction({
      projectName,
      date,
      time,
      inductees,
      inducteesName,
      tradeTypes,
      subContractorName,
      typeOfTopic,
      documentaryEvidencePhoto,
      AnyOthers,
      instructionBy,
      inducteeSignBy,
      geotagging
    });

    await newInduction.save();
    res.status(201).json(newInduction);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});



// Get all inductions
router.get('/', async (req, res) => {
  try {
    const inductions = await Induction.find().populate(['projectName', 'typeOfTopic', 'tradeTypes', 'instructionBy']);
    res.json(inductions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a single induction by ID
router.get('/:id', async (req, res) => {
  try {
    const induction = await Induction.findById(req.params.id).populate(['projectName', 'typeOfTopic', 'tradeTypes', 'instructionBy']);
    if (induction == null) {
      return res.status(404).json({ message: 'Induction not found' });
    }
    res.json(induction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.put('/:id', async (req, res) => {
  try {
    const updateData = req.body;

    // Find the document by ID and update it
    const updatedInduction = await Induction.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true } // Options to return the updated document and run validation
    );

    if (!updatedInduction) {
      return res.status(404).json({ message: 'Induction not found' });
    }

    res.status(200).json(updatedInduction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete an induction by ID
router.delete('/:id', async (req, res) => {
  try {
    const induction = await Induction.findByIdAndDelete(req.params.id);
    if (induction == null) {
      return res.status(404).json({ message: 'Induction not found' });
    }
    res.json({ message: 'Induction deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

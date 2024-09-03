const express = require('express');
const Induction = require('../models/Induction');
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

router.post('/', async (req, res) => {
  try {
    const {
      projectName,
      date,
      time,
      inductees,
      inducteesName,
      subContractorName,
      typeOfTopic,
      tradeTypes,
      instructionBy,
      documentaryEvidencePhoto,
      inductedSignBy,
      inducteeSignBy,
      geotagging,
      commentsBox
    } = req.body;

    // Validate the required fields
    if (!documentaryEvidencePhoto) {
      return res.status(400).json({ error: "documentaryEvidencePhoto is required" });
    }

    // Create a new induction record
    const newInduction = new Induction({
      projectName,
      date,
      time,
      inductees,
      inducteesName,
      subContractorName,
      typeOfTopic,
      tradeTypes,
      instructionBy,
      documentaryEvidencePhoto,
      inductedSignBy,
      inducteeSignBy,
      geotagging,
      commentsBox
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

// Update an induction by ID
// Update an induction by ID
// router.put('/:id', upload.fields([
//   { name: 'documentaryEvidencePhoto' },
//   { name: 'inductedSignBy' },
//   { name: 'inducteeSignBy' }
// ]), async (req, res) => {
//   try {
//     const induction = await Induction.findById(req.params.id);
//     if (!induction) {
//       return res.status(404).json({ message: 'Induction not found' });
//     }

//     // Log files and request body to debug
//     console.log('Files:', req.files);
//     console.log('Body:', req.body);

//     const {
//       projectName,
//       date,
//       time,
//       inductees,
//       inducteesName,
//       subContractorName,
//       typeOfTopic,
//       tradeTypes,
//       instructionBy,
//       geotagging,
//       commentsBox
//     } = req.body;

//     // Check and update file fields
//     if (req.files && req.files.documentaryEvidencePhoto) {
//       induction.documentaryEvidencePhoto = req.files.documentaryEvidencePhoto.map(file => file.filename);
//     }
//     if (req.files && req.files.inductedSignBy) {
//       induction.inductedSignBy = req.files.inductedSignBy.map(file => file.filename);
//     }
//     if (req.files && req.files.inducteeSignBy) {
//       induction.inducteeSignBy = req.files.inducteeSignBy.map(file => file.filename);
//     }

//     // Update other fields
//     induction.projectName = projectName;
//     induction.date = date;
//     induction.time = time;
//     induction.inductees = inductees;
//     induction.inducteesName = inducteesName;
//     induction.subContractorName = subContractorName;
//     induction.typeOfTopic = typeOfTopic;
//     induction.tradeTypes = tradeTypes;
//     induction.instructionBy = instructionBy;
//     induction.geotagging = geotagging;
//     induction.commentsBox = commentsBox;

//     await induction.save();
//     res.json(induction);
//   } catch (error) {
//     console.error('Error:', error);
//     res.status(400).json({ message: error.message });
//   }
// });


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

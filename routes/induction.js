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

// Create a new induction
// Create a new induction
// Create a new induction
router.post('/', async (req, res) => {
  try {
    console.log('Request body:', req.body);
    const { projectName, inductees, date, time, tradeTypes, instructionBy, documentaryEvidencePhoto, inductedSignBy, inducteeSignBy, geotagging, commentsBox } = req.body;
    const newInduction = new Induction({
      projectName,
      date,
      time,
      inductees,
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
    console.error('Error:', error);
    res.status(400).json({ message: error.message });
  }
});



// Get all inductions
router.get('/', async (req, res) => {
  try {
    const inductions = await Induction.find().populate(['projectName', 'tradeTypes', 'instructionBy']);
    res.json(inductions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a single induction by ID
router.get('/:id', async (req, res) => {
  try {
    const induction = await Induction.findById(req.params.id).populate(['projectName', 'tradeTypes', 'instructionBy']);
    if (induction == null) {
      return res.status(404).json({ message: 'Induction not found' });
    }
    res.json(induction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update an induction by ID
router.put('/:id', upload.single('documentaryEvidencePhoto'), async (req, res) => {
  try {
    const induction = await Induction.findById(req.params.id);
    if (induction == null) {
      return res.status(404).json({ message: 'Induction not found' });
    }

    const { projectName, inductees, tradeTypes, instructionBy, inductedSignBy, inducteeSignBy, geotagging, commentsBox } = req.body;
    if (req.file) {
      induction.documentaryEvidencePhoto = req.file.filename;
    }
    induction.projectName = projectName;
    induction.inductees = inductees;
    induction.tradeTypes = tradeTypes;
    induction.instructionBy = instructionBy;
    induction.inductedSignBy = inductedSignBy;
    induction.inducteeSignBy = inducteeSignBy;
    induction.geotagging = geotagging;
    induction.commentsBox = commentsBox;

    await induction.save();
    res.json(induction);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

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

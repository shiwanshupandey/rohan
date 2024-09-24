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

const express = require('express');
const Permit = require('../models/WorkPermit');
const router = express.Router();

// Create a new permit
router.post('/', async (req, res) => {
  const permitData = req.body;
  try {
    const newPermit = new Permit(permitData);
    await newPermit.save();
    res.status(201).json(newPermit);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all permits
router.get('/', async (req, res) => {
  try {
    const permits = await Permit.find()
      .populate('projectName')
      .populate('area')
      .populate('permitTypes')
      .populate('toolsAndEquipment')
      .populate('typeOfHazard')
      .populate('applicablePPEs')
      .populate('createdBy')
      .populate('verifiedBy')
      .populate('approvalBy');
    res.json(permits);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a single permit
router.get('/:id', getPermit, (req, res) => {
  res.json(res.permit);
});

async function getPermit(req, res, next) {
  let permit;
  try {
    permit = await Permit.findById(req.params.id)
      .populate('projectName')
      .populate('area')
      .populate('permitTypes')
      .populate('toolsAndEquipment')
      .populate('typeOfHazard')
      .populate('applicablePPEs')
      .populate('createdBy')
      .populate('verifiedBy')
      .populate('approvalBy');
    if (permit == null) {
      return res.status(404).json({ message: 'Cannot find permit' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.permit = permit;
  next();
}


// Update a permit by ID
router.put('/:id', async (req, res) => {
  try {
    const permit = await Permit.findById(req.params.id);
    if (permit == null) {
      return res.status(404).json({ message: 'Permit not found' });
    }

    Object.assign(permit, req.body);
    await permit.save();
    res.json(permit);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a permit by ID
router.delete('/:id', async (req, res) => {
  try {
    const permit = await Permit.findByIdAndDelete(req.params.id);
    
    if (permit == null) {
      return res.status(404).json({ message: 'Permit not found' });
    }

    res.json({ message: 'Permit deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



module.exports = router;

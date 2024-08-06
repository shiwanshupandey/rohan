const express = require('express');
const Trade = require('../models/Trade');
const router = express.Router();

// Create a new trade
router.post('/', async (req, res) => {
  const { tradeTypes } = req.body;
  try {
    const newTrade = new Trade({ tradeTypes });
    await newTrade.save();
    res.status(201).json(newTrade);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all trades
router.get('/', async (req, res) => {
  try {
    const trades = await Trade.find();
    res.json(trades);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a single trade by ID
router.get('/:id', async (req, res) => {
  try {
    const trade = await Trade.findById(req.params.id);
    if (trade == null) {
      return res.status(404).json({ message: 'Trade not found' });
    }
    res.json(trade);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a trade by ID
router.put('/:id', async (req, res) => {
  try {
    const trade = await Trade.findById(req.params.id);
    if (trade == null) {
      return res.status(404).json({ message: 'Trade not found' });
    }

    trade.tradeTypes = req.body.tradeTypes;
    await trade.save();
    res.json(trade);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a trade by ID
router.delete('/:id', async (req, res) => {
  try {
    const trade = await Trade.findByIdAndDelete(req.params.id);
    if (trade == null) {
      return res.status(404).json({ message: 'Trade not found' });
    }
    res.json({ message: 'Trade deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

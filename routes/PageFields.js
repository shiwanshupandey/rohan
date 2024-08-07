const express = require('express');
const router = express.Router();
const PageFields = require('../models/PageFields');

// Create a new PageField
router.post('/', async (req, res) => {
    const { Page, PageFields: pageFieldsArray } = req.body;

    try {
        const newPageField = new PageFields({ Page, PageFields: pageFieldsArray });
        const savedPageField = await newPageField.save();
        res.status(201).json(savedPageField);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get all PageFields
router.get('/', async (req, res) => {
    try {
        const pageFields = await PageFields.find();
        res.status(200).json(pageFields);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get a specific PageField by ID
router.get('/:id', async (req, res) => {
    try {
        const pageField = await PageFields.findById(req.params.id);
        if (!pageField) return res.status(404).json({ message: 'PageField not found' });
        res.status(200).json(pageField);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update a PageField by ID
router.put('/:id', async (req, res) => {
    const { Page, PageFields: pageFieldsArray } = req.body;

    try {
        const updatedPageField = await PageFields.findByIdAndUpdate(
            req.params.id,
            { Page, PageFields: pageFieldsArray },
            { new: true }
        );
        if (!updatedPageField) return res.status(404).json({ message: 'PageField not found' });
        res.status(200).json(updatedPageField);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete a PageField by ID
router.delete('/:id', async (req, res) => {
    try {
        const deletedPageField = await PageFields.findByIdAndDelete(req.params.id);
        if (!deletedPageField) return res.status(404).json({ message: 'PageField not found' });
        res.status(200).json({ message: 'PageField deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;

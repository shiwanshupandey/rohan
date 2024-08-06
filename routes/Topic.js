const express = require('express');
const Topic = require('../models/Topic');
const router = express.Router();

// Create a new topic
router.post('/', async (req, res) => {
  const { topicTypes } = req.body;
  try {
    const newTopic = new Topic({ topicTypes });
    await newTopic.save();
    res.status(201).json(newTopic);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all topics
router.get('/', async (req, res) => {
  try {
    const topics = await Topic.find();
    res.json(topics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a single topic by ID
router.get('/:id', async (req, res) => {
  try {
    const topic = await Topic.findById(req.params.id);
    if (topic == null) {
      return res.status(404).json({ message: 'Topic not found' });
    }
    res.json(topic);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a topic by ID
router.put('/:id', async (req, res) => {
  try {
    const topic = await Topic.findById(req.params.id);
    if (topic == null) {
      return res.status(404).json({ message: 'Topic not found' });
    }

    topic.topicTypes = req.body.topicTypes;
    await topic.save();
    res.json(topic);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a topic by ID
router.delete('/:id', async (req, res) => {
  try {
    const topic = await Topic.findByIdAndDelete(req.params.id);
    if (topic == null) {
      return res.status(404).json({ message: 'Topic not found' });
    }
    res.json({ message: 'Topic deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

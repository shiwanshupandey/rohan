// routes/roleRoutes.js
const express = require('express');
const router = express.Router();
const Role = require('../models/Role'); // Adjust the path as needed

// Create a new role
router.post('/', async (req, res) => {
    try {
        const newRole = new Role(req.body);
        await newRole.save();
        res.status(201).json(newRole);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get all roles
router.get('/', async (req, res) => {
    try {
        const roles = await Role.find();
        res.status(200).json(roles);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get a single role by ID
router.get('/:id', async (req, res) => {
    try {
        const role = await Role.findById(req.params.id);
        if (role) {
            res.status(200).json(role);
        } else {
            res.status(404).json({ message: 'Role not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update a role by ID
router.put('/:id', async (req, res) => {
    try {
        const updatedRole = await Role.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (updatedRole) {
            res.status(200).json(updatedRole);
        } else {
            res.status(404).json({ message: 'Role not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete a role by ID
router.delete('/:id', async (req, res) => {
    try {
        const deletedRole = await Role.findByIdAndDelete(req.params.id);
        if (deletedRole) {
            res.status(200).json({ message: 'Role deleted successfully' });
        } else {
            res.status(404).json({ message: 'Role not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;

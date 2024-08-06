const mongoose = require('mongoose');

const HazardsSchema = new mongoose.Schema({
    hazards: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Hazards', HazardsSchema);
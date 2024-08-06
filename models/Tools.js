const mongoose = require('mongoose');

const ToolsSchema = new mongoose.Schema({
    tools: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Tools', ToolsSchema);
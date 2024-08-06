const mongoose = require('mongoose');

const PPEsSchema = new mongoose.Schema({
    ppes: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('PPEs', PPEsSchema);
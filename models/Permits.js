const mongoose = require('mongoose');

const PermitsTypeSchema = new mongoose.Schema({
    permitsType: {
        type: String,
        required: true
    },
    SafetyChecks:[{
        type: String,
        required: true
    }]
});

module.exports = mongoose.model('PermitsType', PermitsTypeSchema);
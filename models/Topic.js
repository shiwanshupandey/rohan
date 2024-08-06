const mongoose = require('mongoose');

const TopicSchema = new mongoose.Schema({
    topicTypes: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Topic', TopicSchema);

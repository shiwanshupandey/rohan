const mongoose = require('mongoose');

const TradeSchema = new mongoose.Schema({
    tradeTypes: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Trade', TradeSchema);

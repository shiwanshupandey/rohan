const mongoose = require('mongoose');

const RiskRatingSchema = new mongoose.Schema({
  value: { type: Number, required: true },
  severity: { type: String, required: true },
  alertTimeline: { type: String, required: true },
  escalationAlert: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Role', required: true }],  // Corrected 'ref'
  repeatWarning: { type: String, required: true }
});

module.exports = mongoose.model('RiskRating', RiskRatingSchema);

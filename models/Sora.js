const mongoose = require('mongoose');

const ObservationSchema = new mongoose.Schema({
    projectName: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true},
  area: { type: String },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  observer: { type: String, required: true },
  observation: { type: String },
  photo: { type: String },
  hazards: [{ type: String }],
  causes: [{ type: String }],
  riskValue: { type: Number },
  assignedTo: { type: String },
  correctivePreventiveAction: { type: String },
  actionTakenBy: { type: String },
  status: { type: String, enum: ['Open', 'Closed'] },
  geotagging: { type: String },
  comment: { type: String },
  riskRating: {
    value: { type: Number },
    severity: { type: String },
    alertTimeline: { type: String },
    escalationAlert: { type: String },
    repeatWarning: { type: String }
  }
});

module.exports = mongoose.model('Sora', ObservationSchema);

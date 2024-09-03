const mongoose = require('mongoose');

const UaUCSchema = new mongoose.Schema({
    projectName: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true},
  area: { type: String },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  observer: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  observation: { type: String },
  photo: { type: String },
  hazards: [{ 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hazards',
    required: true
   }],
  causes: [{ type: String }],
  riskValue: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'RiskRating',
    required: true 
  },
  assignedTo: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
   },
  correctivePreventiveAction: { type: String },
  actionTakenBy: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
   },
    status: {
    type: String,
    enum: ['Open', 'Closed'],
    default: 'Closed'
  }
  geotagging: { type: String },
  comment: { type: String }
});

module.exports = mongoose.model('UaUC', UaUCSchema);

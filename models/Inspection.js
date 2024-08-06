const mongoose = require('mongoose');

const InspectionSchema = new mongoose.Schema({
  projectName: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true},
  date: { type: Date, required: true },
  time: { type: String, required: true },
  types: {
    constructionVehicles: { type: Number, default: 0 },
    powerTools: { type: Number, default: 0 },
    electricalAssets: { type: Number, default: 0 },
    liftingToolsAndTackles: { type: Number, default: 0 },
    workmanCamp: { type: Number, default: 0 },
    plantAndMachinery: { type: Number, default: 0 },
    scaffolding: { type: Number, default: 0 },
    ladder: { type: Number, default: 0 },
    fireExtinguishers: { type: String, default: '' },
    fullBodyHarness: { type: Number, default: 0 },
  },
  createdBy: { type: String, required: true },
  assignedTo: { type: String, required: true },
  inspectionId: { type: String, required: true },
  taggingId: { type: String, required: true },
  inspectedBySign: { type: String, required: true },
  verifiedBySign: { type: String, required: true },
  approvedBySign: { type: String, required: true },
});

module.exports = mongoose.model('Inspection', InspectionSchema);
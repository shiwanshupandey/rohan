const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  projectId: { type: String, required: true, unique: true },
  projectName: { type: String, required: true },
  siteLocation: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date },
  status: { type: String, required: true, enum: ['Planned', 'In Progress', 'Completed'] },
  description: { type: String },
  company: { type: String, required: true }
});

module.exports = mongoose.model('Project', ProjectSchema);

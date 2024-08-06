const mongoose = require('mongoose');

const IncidentReportSchema = new mongoose.Schema({
  projectName: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true},
  area: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  typeOfIncident: {
    firstAid: { type: Boolean, default: false },
    nearMiss: { type: Boolean, default: false },
    propertyDamage: { type: Boolean, default: false },
    snakeBite: { type: Boolean, default: false },
    anyOthers: { type: Boolean, default: false },
  },
  nameOfProjectManager: { type: Boolean, default: false },
  nameOfWorkAreaStaff: { type: Boolean, default: false },
  detailsOfInjuryPerson: {
    name: { type: String },
    trade: { type: String },
    age: { type: Number },
    natureOfInjury: { type: String },
    witnessedBy: { type: String },
    briefDescriptionOfIncident: { type: String },
    photo: { type: String },
    immediateActionTaken: { type: String },
    rca: { type: String },
    correctiveAndPreventiveAction: { type: String },
    anyOthers: { type: String },
  },
  undersignedBy: {
    siteSupEngineer: { type: String, required: true },
    safetyOfficer: { type: String, required: true },
    projectManager: { type: String, required: true },
  }
});

module.exports = mongoose.model('IncidentReport', IncidentReportSchema);

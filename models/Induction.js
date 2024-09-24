const mongoose = require('mongoose');

const validateImageUrl = url => {
  const regex = /\.(jpeg|jpg|gif|png|svg|webp)$/;
  return regex.test(url);
};

const InductionSchema = new mongoose.Schema({
  projectName: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  inductees: {
    type: String,
    required: true
  },
  inducteesName: {
    type: String,
    required: true
  },
  tradeTypes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trade',
    required: true
  }],
  subContractorName: {
    type: String,
    required: true
  },
  typeOfTopic:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Topic',
    required: true
  },
  documentaryEvidencePhoto: {
    type: String,
    validate: {
      validator: validateImageUrl,
      message: props => `${props.value} is not a valid image URL!`
    },
    required: true
  },
  AnyOthers: {
    type: String,
    required: true
  },
  instructionBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  inducteeSignBy: [{
    type: String,
    validate: {
      validator: validateImageUrl,
      message: props => `${props.value} is not a valid image URL!`
    },
    required: true
  }],
  geotagging: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Induction', InductionSchema);

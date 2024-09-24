const mongoose = require('mongoose');

// Function to validate image URLs
const validateImageUrl = url => {
  const regex = /\.(jpeg|jpg|gif|png|svg|webp)$/;
  return regex.test(url);
};

const SpecificMeetingSchema = new mongoose.Schema({
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
  typeOfTopic: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Topic',
    required: true
  },
  attendees: [{ 
    type: String,
    required: true
  }],
  attendeesName: [{
    name: { 
      type: String, 
      required: true 
    },
    subcontractorName: { 
      type: String, 
      required: true 
    },
    signature: {
      type: String,
      validate: {
        validator: validateImageUrl,
        message: props => `${props.value} is not a valid image URL!`
      },
      required: true
    },
    sign: {
      type: String,
      validate: {
        validator: validateImageUrl,
        message: props => `${props.value} is not a valid image URL!`
      },
      required: true
    }
  }],
  tradeTypes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trade',
    required: true
  }],
  instructionBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
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
  traineeSignBy: {
    type: String,
    validate: {
      validator: validateImageUrl,
      message: props => `${props.value} is not a valid image URL!`
    },
    required: true
  },
  trainingSignBy: [{
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
  commentsBox: { 
    type: String, 
    required: true 
  },
});

// Export the schema
module.exports = mongoose.model('SpecificMeeting', SpecificMeetingSchema);

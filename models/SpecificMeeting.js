const mongoose = require('mongoose');


const validateImageUrl = url => {
  const regex = /\.(jpeg|jpg|gif|png|svg|webp)$/;
  return regex.test(url);
};


const SpecificMeeting = new mongoose.Schema({
  projectName: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true},
  date: { type: Date, required: true },
  time: { type: String, required: true },
  topicName: { type: String, required: true },
  typeOfTopic:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Topic',
    required: true
  },
  attendees: [{ 
    type: String,
    required: true
}],
   inducteesName: { type: String, required: true },
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
  geotagging: { type: String, required: true },
  commentsBox: { type: String, required: true },
});

module.exports = mongoose.model('SpecificMeeting', SpecificMeeting);

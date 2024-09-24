const mongoose = require('mongoose');


const validateImageUrl = url => {
  const regex = /\.(jpeg|jpg|gif|png|svg|webp)$/;
  return regex.test(url);
};


const MeetingSchema = new mongoose.Schema({
  projectName: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true},
  date: { type: Date, required: true },
  time: { type: String, required: true },
  typeOfTopic:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Topic',
    required: true
  },
  attendees: [{ 
    type: String,
    required: true
}],
   attendeesNos: { type: String, required: true },
  documentaryEvidencePhoto: { 
    type: String,
    validate: {
      validator: validateImageUrl,
      message: props => `${props.value} is not a valid image URL!`
    },
    required: true
  },
  formFilledSignBy: [{ 
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

module.exports = mongoose.model('Meeting', MeetingSchema);

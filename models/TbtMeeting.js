const mongoose = require('mongoose');

// Function to validate image URLs
const validateImageUrl = url => {
  const regex = /\.(jpeg|jpg|gif|png|svg|webp)$/;
  return regex.test(url);
};

const MeetingSchema = new mongoose.Schema({
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
  formFilled: [{
    name: { type: String, required: true },  // New name field
    signature: { 
      type: String, 
      validate: {
        validator: validateImageUrl,  // Validate the signature URL
        message: props => `${props.value} is not a valid image URL!`
      },
      required: true 
    }
  }],
  attendeesNos: { 
    type: Number, 
    required: true,
    default: 0  // Automatically calculated based on formFilled length
  },
  attendeesHours: { 
    type: Number, 
    default: 0  // Automatically calculated field based on attendeesNos
  },
  documentaryEvidencePhoto: { 
    type: String,
    validate: {
      validator: validateImageUrl,
      message: props => `${props.value} is not a valid image URL!`
    },
    required: true
  },
  geotagging: { 
    type: String, 
    required: true 
  },
  commentsBox: { 
    type: String, 
    required: true 
  },
}, {
  toJSON: { virtuals: true },  // Include virtual fields when converting to JSON
  toObject: { virtuals: true }  // Include virtual fields when converting to Object
});

// Virtual field to automatically calculate the total attendees number
MeetingSchema.virtual('attendeesNos').get(function() {
  return this.formFilled.length;  // Count the number of formFilled entries
});

// Virtual field to calculate attendees hours based on the formula: attendeesNos * 10 / 60
MeetingSchema.virtual('attendeesHours').get(function() {
  const attendeesNos = this.formFilled.length;
  return (attendeesNos * 10) / 60;  // Formula to calculate hours
});

module.exports = mongoose.model('Meeting', MeetingSchema);

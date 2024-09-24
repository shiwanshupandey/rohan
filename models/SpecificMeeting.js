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
    designation: { 
      type: String, 
      required: true 
    },
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

// Virtual field to calculate the total attendance
SpecificMeetingSchema.virtual('attendance').get(function() {
  // attendance is calculated as the number of attendeesName entries
  return this.attendeesName.length;
});

// Virtual field to calculate attendanceHours based on the formula: attendance x 10 / 60
SpecificMeetingSchema.virtual('attendanceHours').get(function() {
  const attendance = this.attendeesName.length;
  // Assuming 10 hours per attendee, divided by 60 to convert to hours
  return (attendance * 10) / 60;
});

// Export the schema
module.exports = mongoose.model('SpecificMeeting', SpecificMeetingSchema);

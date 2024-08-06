const mongoose = require('mongoose');


const validateImageUrl = url => {
  const regex = /\.(jpeg|jpg|gif|png|svg|webp)$/;
  return regex.test(url);
};

const PermitSchema = new mongoose.Schema({
    projectName: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Project', 
      required: true
    },
  area: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
   },
  permitTypes: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PermitsType',
    required: true
  } ,
  date: { 
    type: Date, 
    required: true 
  },
  time: { 
    type: String, 
    required: true 
  },
  toolsAndEquipment: [{ 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tools',
    required: true
   }],
  workDescription: { 
    type: String 
  },
  typeOfHazard: [{ 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hazards',
    required: true
   }],
  applicablePPEs: [{ 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PPEs',
    required: true
  }],
  safetyMeasuresTaken:{ type: String },
  undersignDraft: { 
    type: String,
    validate: {
      validator: validateImageUrl,
      message: props => `${props.value} is not a valid image URL!`
    },
    required: true
   },
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
   },
  verifiedBy: [{ 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
   }],
  approvalBy: [{ 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
   }],
   verifiedDone:{
     type: Boolean,
     default: false
   },
   approvalDone:{
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('Permit', PermitSchema);

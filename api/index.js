const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');  // Import cors middleware

const inductionRoutes = require('../routes/induction');
const TbtMeetingRoutes = require('../routes/TbtMeeting');
const IncidentReportRoutes = require('../routes/IncidentReport');
const InspectionRoutes = require('../routes/Inspection');
const UaUCRoutes = require('../routes/UaUC');
const WorkPermitRoutes = require('../routes/WorkPermit');
const PermitsTypesRoutes = require('../routes/PermitsTypes');
const UserRoutes = require('../routes/user');
const ProjectRoutes = require('../routes/Projects');
const TradeRoutes = require('../routes/Trade');
const TopicRoutes = require('../routes/Topic');
const HazardRoutes = require('../routes/Hazards');
const ToolsRoutes = require('../routes/Tools');
const PPEsRoutes = require('../routes/PPEs');
const PageFields = require('../routes/PageFields');
const SpecificMeeting = require('../routes/SpecificMeeting');
const riskRatingRoutes = require('../routes/RiskRating');
const RoleRoutes  = require('../routes/Role');

const app = express();

// Middleware
app.use(bodyParser.json());

// CORS configuration for a specific site
const corsOptions = {
    origin: [
    'http://localhost:8089', 
    'https://rohan.innotechconsultant.co.in/#/loginPage',
    'https://rohan.innotechconsultant.co.in'
  ],  // Replace with the site you want to allow access from
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));  // Use CORS middleware with options




const mongoUri = process.env.MONGO_URI || 'mongodb+srv://shiwanshuanooppandey:7Hlv1DPRnhpe1zw1@cluster0.fsdpzg2.mongodb.net/Rohan';
mongoose.connect(mongoUri, {
  useNewUrlParser: true,    // Ensure proper parsing of the connection string
  useUnifiedTopology: true
});


const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Routes
app.use('/induction', inductionRoutes);
app.use('/meeting', TbtMeetingRoutes);
app.use('/incident', IncidentReportRoutes);
app.use('/inspection', InspectionRoutes);
app.use('/specific', SpecificMeeting);
app.use('/uauc', UaUCRoutes);
app.use('/workpermit', WorkPermitRoutes);
app.use('/user', UserRoutes);
app.use('/projects', ProjectRoutes);
app.use('/trade', TradeRoutes);
app.use('/topic', TopicRoutes);
app.use('/hazards', HazardRoutes);
app.use('/tools', ToolsRoutes);
app.use('/ppe', PPEsRoutes);
app.use('/permitstype', PermitsTypesRoutes);
app.use('/fields', PageFields);
app.use('/riskrating', riskRatingRoutes);
app.use('/role', RoleRoutes);





module.exports = app;

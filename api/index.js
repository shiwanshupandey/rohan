const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const inductionRoutes = require('../routes/induction');
const TbtMeetingRoutes = require('../routes/TbtMeeting');
const IncidentReportRoutes = require('../routes/IncidentReport');
const InspectionRoutes = require('../routes/Inspection');
const SORARoutes = require('../routes/Sora');
const PermitRoutes = require('../routes/WorkPermit');
const UserRoutes = require('../routes/user');
const ProjectRoutes = require('../routes/Projects');
const TradeRoutes = require('../routes/Trade');
const TopicRoutes = require('../routes/Topic');
const HazardRoutes = require('../routes/Hazards');
const ToolsRoutes = require('../routes/Tools');
const PPEsRoutes = require('../routes/PPEs');
const PermitsRoutes = require('../routes/Permits');
const PageFields = require('../routes/PageFields');

const app = express();

// Middleware
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect('mongodb+srv://shiwanshuanooppandey:7Hlv1DPRnhpe1zw1@cluster0.fsdpzg2.mongodb.net/Rohan', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
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
app.use('/sora', SORARoutes);
app.use('/permit', PermitRoutes);
app.use('/user', UserRoutes);
app.use('/projects', ProjectRoutes);
app.use('/trade', TradeRoutes);
app.use('/topic', TopicRoutes);
app.use('/hazards', HazardRoutes);
app.use('/tools', ToolsRoutes);
app.use('/ppe', PPEsRoutes);
app.use('/permitstype', PermitsRoutes);
app.use('/fields', PageFields);

module.exports = app;

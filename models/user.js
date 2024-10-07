const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    photo: { type: String, required: true },
    role: { type: mongoose.Schema.Types.ObjectId, ref: 'roleName', required: true },
    emailId: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    address: {
        type: String, required: true
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: true },
    ProjectName:[{ type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true }] 
});

UserSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('User', UserSchema);

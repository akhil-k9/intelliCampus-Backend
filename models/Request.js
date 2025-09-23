const mongoose = require('mongoose');

const Request = new mongoose.Schema({
  Student: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student'
    }],
  request:{
    type: String,
    required: true
  },
  to:{
    type: String,
    enum: ['incharge', 'hod'],
    default: 'incharge'
  },
  inchargeApproval:{
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  hodApproval:{
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  }
}, { timestamps: true });

module.exports = mongoose.model('Request', Request);
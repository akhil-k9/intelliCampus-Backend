const mongoose = require('mongoose');

const Student = new mongoose.Schema({
  

  // Optional: name and phone
  name: {
    type: String
  },
  rollno:{
    type: String,
    required: true,
    unique: true
  },
  year:{
    type: String
  },
  branch:{
    type: String
  },
  section:{
    type: String
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phoneno: {
    type: String,
    required: true,
    unique: true
  },
  password:{
    type: String
  }

}, { timestamps: true });

module.exports = mongoose.model('Student', Student);

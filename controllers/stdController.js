const Student = require('../models/Student');
const dotEnv = require('dotenv');

dotEnv.config();

// Signup
const signup = async (req, res) => {
  const { name, rollno, year, branch, section, email, phoneno, password } = req.body;
  try {
    // Check existing rollno or email
    const stdRollno = await Student.findOne({ rollno });
    if (stdRollno) return res.status(400).json({ error: "Rollno already taken" });

    const newStd = new Student({
      name, rollno, year, branch, section, email, phoneno,
      password, // plain text
    });

    const savedStudent = await newStd.save();

    res.status(201).json({
      message: "Signup successful",
      student: {
        id: savedStudent._id,
        name: savedStudent.name,
        rollno: savedStudent.rollno,
        email: savedStudent.email,
      }
    });

    console.log('Student registered:', rollno);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Signin
const signin = async (req, res) => {
  const { rollno, password } = req.body;

  if (!rollno || !password) {
    return res.status(400).json({ error: "Rollno and password are required" });
  }

  try {
    const std = await Student.findOne({ rollno });
    if (!std || std.password !== password) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    res.status(200).json({
      success: true,
      message: "Login successful",
      student: {
        id: std._id,
        name: std.name,
        rollno: std.rollno,
        email: std.email,
      }
    });

    console.log(`${rollno} logged in successfully.`);
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get all students
const getAllStd = async (req, res) => {
  try {
    const stds = await Student.find().select("-password"); // hide passwords
    res.json({ stds });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { signup, signin, getAllStd };

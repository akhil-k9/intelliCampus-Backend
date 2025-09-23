const Student = require('../models/Student');
const bcrypt = require('bcryptjs');
const dotEnv = require('dotenv');

dotEnv.config();

// Signup
const signup = async (req, res) => {
  const { name, rollno, year, branch, section, email, phoneno, password } = req.body;
  try {
    const stdRollno = await Student.findOne({ rollno });
    if (stdRollno) {
      return res.status(400).json({ error: "User already taken" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newStd = new Student({
      name, rollno, year, branch, section, email, phoneno,
      password: hashedPassword,
    });

    await newStd.save();
    res.status(201).json({ message: "Signup successful" });
    console.log('Student registered');
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
    if (!std) {
      return res.status(401).json({ error: "Invalid rollno" });
    }

    const isMatch = await bcrypt.compare(password, std.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid password" });
    }

    res.status(200).json({
      success: true,
      message: "Login successful",
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
    const stds = await Student.find();
    res.json({ stds });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { signup, signin, getAllStd };

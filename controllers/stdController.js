const Student = require('../models/Student');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotEnv = require('dotenv');

dotEnv.config();

// Signup
const signup = async (req, res) => {
  const { name, rollno, year, branch, section, email, phoneno, password } = req.body;
  try {
    // Check existing rollno or email
    const stdRollno = await Student.findOne({ rollno });
    if (stdRollno) return res.status(400).json({ error: "Rollno already taken" });

    

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newStd = new Student({
      name, rollno, year, branch, section, email, phoneno,
      password: hashedPassword,
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
    if (!std) return res.status(401).json({ error: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, std.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

    // Generate JWT
    const token = jwt.sign(
      { id: std._id, rollno: std.rollno },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
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
    const stds = await Student.find().select("-password"); // don’t return passwords
    res.json({ stds });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { signup, signin, getAllStd };

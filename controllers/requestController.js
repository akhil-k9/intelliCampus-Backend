
require('dotenv').config();
const nodemailer = require('nodemailer');
const Student = require('../models/Student');
const Request = require('../models/Request');

const requestSend = async (req, res) => {
  const { rollno, reason, to } = req.body;

  if (!rollno || !reason || !to) {
    return res.status(400).json({ error: 'Rollno, reason, and recipient (to) are required' });
  }

  try {
    const std = await Student.findOne({ rollno });
    if (!std) return res.status(401).json({ error: "Invalid rollno" });

    // Save request in DB first so we can get its ID
    const newRequest = new Request({
      Student: std._id,
      request: reason,
      to,
      status: 'pending' // optional: track status
    });
    await newRequest.save();

    // HTML message with Accept and Reject buttons
    const htmlMessage = `
  <h2>Permission Request</h2>
  <p><strong>Name:</strong> ${std.name}</p>
  <p><strong>Roll No:</strong> ${std.rollno}</p>
  <p><strong>Year:</strong> ${std.year}</p>
  <p><strong>Branch:</strong> ${std.branch}</p>
  <p><strong>Section:</strong> ${std.section}</p>
  <p><strong>Phone:</strong> ${std.phoneno}</p>
  <p><strong>Email:</strong> ${std.email}</p>
  <p><strong>Reason:</strong> ${reason}</p>
  <br/>
  <a href="http://localhost:5173/approve?requestId=${newRequest._id}&role=incharge" 
     style="display:inline-block; padding:10px 20px; background:green; color:white; text-decoration:none; border-radius:5px; margin-right:10px;">
    Accept
  </a>
  <a href="http://localhost:5173/reject?requestId=${newRequest._id}&role=incharge" 
     style="display:inline-block; padding:10px 20px; background:red; color:white; text-decoration:none; border-radius:5px;">
    Reject
  </a>
`;


    // Setup Gmail SMTP
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: "saikumarkudurupaka1610@gmail.com", // receiver email
      subject: 'Permission Request',
      html: htmlMessage
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: ", info.response);

    res.status(200).json({ message: 'Request sent successfully' });

  } catch (err) {
    console.error("Email error: ", err);
    res.status(500).json({ error: 'Failed to send request' });
  }
};



const getRequestsByStudentId = async (req, res) => {
  try {
    const { studentId } = req.params;

    // ✅ Check student
    const student = await Student.findOne({ rollno: studentId });
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    // ✅ Fetch requests linked to this student
    const requests = await Request.find({ Student: student._id })
      .populate("Student") // in case you want student details inside each request
      .sort({ createdAt: -1 }); // latest first

    res.status(200).json({
      student,
      totalRequests: requests.length,
      requests,
    });
  } catch (err) {
    console.error("Error fetching student requests:", err);
    res.status(500).json({ error: "Failed to fetch student requests" });
  }
};


const getAllRequests = async (req, res) => {
  try {
    const requests = await Request.find();
    res.status(200).json(requests);
  } catch (err) {
    console.error("Error fetching all requests: ", err);
    res.status(500).json({ error: 'Failed to fetch all requests' });
  }
};

const getInchargeRequests = async (req, res) => {
  try {
    const requests = await Request.find({ to: "incharge" })
      .populate("Student"); // fetch full student details

    res.status(200).json(requests);
  } catch (err) {
    console.error("Error fetching incharge requests: ", err);
    res.status(500).json({ error: "Failed to fetch incharge requests" });
  }
};


const getHodRequests = async (req, res) => {
  try {
    const requests = await Request.find({ to: 'hod' })
      .populate('Student'); // fetch full student details
    res.status(200).json(requests);
  } catch (err) {
    console.error("Error fetching hod requests: ", err);
    res.status(500).json({ error: 'Failed to fetch hod requests' });
  }
};


// ✅ Approve Request
const approveRequest = async (req, res) => {
  const { requestId, role } = req.query;

  if (!['incharge', 'hod'].includes(role)) {
    return res.status(400).json({ error: "Invalid role" });
  }

  try {
    const request = await Request.findById(requestId).populate("Student"); // also fetch student details
    if (!request) return res.status(404).json({ error: "Request not found" });

    if (role === "incharge") request.inchargeApproval = "approved";
    if (role === "hod") request.hodApproval = "approved";

    await request.save();

    res.status(200).json({
      message: `${role.toUpperCase()} Approved ✅`,
      request,
    });
  } catch (err) {
    console.error("Approve error:", err);
    res.status(500).json({ error: "Failed to approve request" });
  }
};

// ❌ Reject Request
const rejectRequest = async (req, res) => {
  const { requestId, role } = req.query;
  const { reason } = req.body; // optional reason for rejection

  if (!['incharge', 'hod'].includes(role)) {
    return res.status(400).json({ error: "Invalid role" });
  }

  try {
    const request = await Request.findById(requestId).populate("Student");
    if (!request) return res.status(404).json({ error: "Request not found" });

    if (role === "incharge") {
      request.inchargeApproval = "rejected";
      request.inchargeRejectionReason = reason || "No reason provided";
    }
    if (role === "hod") {
      request.hodApproval = "rejected";
      request.hodRejectionReason = reason || "No reason provided";
    }

    await request.save();

    res.status(200).json({
      message: `${role.toUpperCase()} Rejected ❌`,
      reason: reason || null,
      request,
    });
  } catch (err) {
    console.error("Reject error:", err);
    res.status(500).json({ error: "Failed to reject request" });
  }
};



module.exports = { requestSend, getRequestsByStudentId, getAllRequests, getInchargeRequests, getHodRequests, approveRequest, rejectRequest };
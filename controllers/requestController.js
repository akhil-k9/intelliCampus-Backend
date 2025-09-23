
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
  const { studentId } = req.params;
  const student = await Student.findById(studentId);
  if (!student) {
    return res.status(404).json({ error: 'Student not found' });
  }
  try {
    const requests = await Request.find({ Student: student._id });
    res.status(200).json({requests,student});
  } catch (err) {
    console.error("Error fetching requests: ", err);
    res.status(500).json({ error: 'Failed to fetch requests' });
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
    const requests = await Request.find({ to: 'incharge' });
    res.status(200).json(requests);
  } catch (err) {
    console.error("Error fetching incharge requests: ", err);
    res.status(500).json({ error: 'Failed to fetch incharge requests' });
  }
};

const getHodRequests = async (req, res) => {
  try {
    const requests = await Request.find({ to: 'hod' });
    res.status(200).json(requests);
  } catch (err) {
    console.error("Error fetching hod requests: ", err);
    res.status(500).json({ error: 'Failed to fetch hod requests' });
  }
};


const approveRequest = async (req, res) => {
  const { requestId, role } = req.query; // role can be 'incharge' or 'hod'

  if (!['incharge', 'hod'].includes(role)) {
    return res.status(400).send("Invalid role");
  }

  try {
    const request = await Request.findById(requestId);
    if (!request) return res.status(404).send("Request not found");

    if (role === 'incharge') request.inchargeApproval = 'approved';
    if (role === 'hod') request.hodApproval = 'approved';

    await request.save();
    res.send(`<h2>${role.toUpperCase()} Approved ✅</h2><p>The request has been approved by ${role}.</p>`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to approve request");
  }
};

const rejectRequest = async (req, res) => {
  const { requestId, role } = req.query;

  if (!['incharge', 'hod'].includes(role)) {
    return res.status(400).send("Invalid role");
  }

  try {
    const request = await Request.findById(requestId);
    if (!request) return res.status(404).send("Request not found");

    if (role === 'incharge') request.inchargeApproval = 'rejected';
    if (role === 'hod') request.hodApproval = 'rejected';

    await request.save();
    res.send(`<h2>${role.toUpperCase()} Rejected ❌</h2><p>The request has been rejected by ${role}.</p>`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to reject request");
  }
};



module.exports = { requestSend, getRequestsByStudentId, getAllRequests, getInchargeRequests, getHodRequests, approveRequest, rejectRequest };
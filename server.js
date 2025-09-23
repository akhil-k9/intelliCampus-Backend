const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const stdRoutes = require('./routes/stdRoutes');
const requestRoutes = require('./routes/requestRoutes');

dotenv.config();

const app = express();
const PORT = 5000;

// Enable CORS
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET','POST','PUT','DELETE'],
  credentials: true
}));

// Parse JSON
app.use(express.json());

// Routes
app.use('/std', stdRoutes);
app.use('/request', requestRoutes);

// Default route
app.get("/", (req, res) => {
  res.send("IntelliCampus Approvals Server is running!");
});

// Gemini API key route
app.get('/geminiKey', (req, res) => {
  res.json({ apiKey: process.env.GEMINI_API_KEY });
});

// Connect MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB connected successfully!"))
  .catch((error) => console.error("❌ MongoDB connection error:", error));

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});

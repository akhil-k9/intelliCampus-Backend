// const express = require("express");
// const dotenv = require("dotenv");
// const mongoose = require("mongoose");
// const cors = require("cors");
// const stdRoutes = require('./routes/stdRoutes');
// const requestRoutes = require('./routes/requestRoutes');

// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 5000;

// // Enable CORS
// app.use(cors({
//   origin: 'http://localhost:5173',
//   methods: ['GET','POST','PUT','DELETE'],
//   credentials: true
// }));

// // Parse JSON
// app.use(express.json());

// // Routes
// app.use('/std', stdRoutes);
// app.use('/request', requestRoutes);

// // Default route
// app.get("/", (req, res) => {
//   res.send("IntelliCampus Approvals Server is running!");
// });

// // Gemini API key route
// app.get('/geminiKey', (req, res) => {
//   res.json({ apiKey: process.env.GEMINI_API_KEY });
// });

// // Connect MongoDB
// mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => console.log("✅ MongoDB connected successfully!"))
//   .catch((error) => console.error("❌ MongoDB connection error:", error));

// app.listen(PORT, () => {
//   console.log(`✅ Server running at http://localhost:${PORT}`);
// });




const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const stdRoutes = require('./routes/stdRoutes');
const requestRoutes = require('./routes/requestRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for multiple origins
const allowedOrigins = [
  'http://localhost:5173',                 // local dev
  'https://intellicampus-pi.vercel.app'   // production frontend
];

app.use(cors({
  origin: function(origin, callback) {
    // allow requests with no origin (like Postman or server-to-server)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = `The CORS policy for this site does not allow access from the specified Origin: ${origin}`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
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

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});

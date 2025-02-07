const express = require("express");
const cors = require("cors");
const axios = require("axios");
const multer = require("multer");
const extractText = require("./helpers/extractText");
const {callGemini} = require("./helpers/callGemini");

require("dotenv").config();

const app = express();
const PORT = process.env.PORT_BACKEND || 5000;

app.use(cors());
app.use(express.json({ limit: "200mb" }));
app.use(express.urlencoded({ limit: "200mb", extended: true }));

app.get("/", (req, res) => {
  res.send("Server is Live!");
});

app.get("/api/v1/data", async (req, res) => {
  try {
    const response = await axios.get("https://jsonplaceholder.typicode.com/posts");
    res.json(response.data);
  } catch (error) {
    res.status(500).send("Error fetching data");
  }
});

//Multer setup for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { fileSize: 200 * 1024 * 1024 } }); // 200MB limit


app.post("/api/v1/upload", upload.single("compressedPdf"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const question = req.body.question; // Get the question from the request

    if (!question) {
      return res.status(400).json({ error: "No question provided" });
    }

    console.log(`Received compressed file: ${req.file.originalname}`);
    console.log(`Question: ${question}`);

    // Extract text from PDF
    const extractedText = await extractText(req.file.buffer);
    console.log("Extracted Text Preview:", extractedText.substring(0, 200));

    // Send extracted text and question to Gemini AI
    const response = await callGemini(extractedText, question);
    
    // Send response
    res.json(response);
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
});





app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

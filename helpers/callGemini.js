const axios = require("axios");
require("dotenv").config();


const callGemini = async (extractedText, question) => {
  try {
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.API_KEY}`;

    
    const payload = {
      contents: [
        {
          parts: [
            { text: `Extracted text from PDF:\n${extractedText}\n\nQuestion:\n${question}` }
          ]
        }
      ]
    };

    const response = await axios.post(API_URL, payload, {
      headers: { "Content-Type": "application/json" },
    });

    // Extract relevant data from the response
    const textResponse = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response received.";
    const modelVersion = response.data?.modelVersion || "Unknown";

    return { text: textResponse, modelVersion };
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to fetch response from Gemini AI");
  }
};

module.exports = { callGemini };

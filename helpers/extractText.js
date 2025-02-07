const pako = require("pako");
const pdfParse = require("pdf-parse");

const extractText = async (compressedBuffer) => {
  try {
    // Decompress file
    const decompressedData = pako.inflate(new Uint8Array(compressedBuffer));

    // Convert decompressed data to Buffer
    const pdfBuffer = Buffer.from(decompressedData);

    // Extract text from PDF
    const pdfData = await pdfParse(pdfBuffer);
    return pdfData.text.trim();
  } catch (error) {
    console.error("Error extracting text:", error);
    throw new Error("Failed to extract text from PDF.");
  }
};

module.exports = extractText;

import React, { useState, useEffect } from "react";
import { Box, Button, Paper, Typography, Divider, Accordion, AccordionSummary, AccordionDetails, Tooltip, TextField, List, ListItem, Modal, Backdrop, Fade } from "@mui/material";
import axios from "axios";
import pako from "pako";
import IndiaGlobal from "./IndiaGlobal";
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DownloadIcon from "@mui/icons-material/Download";
import jsPDF from "jspdf";
import ReactMarkdown from "react-markdown";
import { v4 as uuidv4 } from "uuid";
import * as pdfjsLib from "pdfjs-dist/webpack";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "80%",
  maxWidth: "900px",
  bgcolor: "#00B8D4",
  borderRadius: 2,
  boxShadow: 24,
  p: 3,
};





const PdfUploader = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [compressedFile, setCompressedFile] = useState(null);
  const [responseText, setResponseText] = useState("");
  const [modelVersion, setModelVersion] = useState("");
  const [fileSize, setFileSize] = useState(""); // For memory size
  const [compressedSize, setCompressedSize] = useState(""); // For compressed size
  const [question, setQuestion] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  

  //Modal
  const [open, setOpen] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    if (selectedFile) {
      const url = URL.createObjectURL(selectedFile);
      setPdfUrl(url);

      return () => URL.revokeObjectURL(url); // Clean up URL when component unmounts
    }
  }, [selectedFile]);

  //About PDF State
  const [numPages, setNumPages] = useState(null);
  const [textPreview, setTextPreview] = useState("");
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [detectedLanguage, setDetectedLanguage] = useState("");
  const [uploadTime, setUploadTime] = useState("");
  const [metadata, setMetadata] = useState({
    title: "",
    author: "",
    keywords: "",
  });

  const API_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api/v1";


  // reset general values
  const resetStates = () => {
    setSelectedFile(null);
    setCompressedFile(null);
    setFileSize("");
    setCompressedSize("");
    setError(null);
    setIsLoading(false);
  };

  //reset everything
  const power_resetStates = () => {
    setOpen(false);
    setPdfUrl("");
    setResponseText("");
    setModelVersion("");
    setNumPages(null);
    setTextPreview("");
    setWordCount(0);
    setCharCount(0);
    setDetectedLanguage("");
    setUploadTime("");
    setMetadata({
      title: "",
      author: "",
      keywords: "",
    });
  };

  const resetAll = () => {
    resetStates();
    power_resetStates();
  };
  

  // Handle PDF file selection and compression
  const handleFileUpload = (event) => {
    resetAll();
    setIsLoading(true);
  
    const file = event.target.files[0];
  
    if (file && file.type === "application/pdf") {
      setFileSize(`${(file.size / 1024 / 1024).toFixed(2)} MB`);
      setSelectedFile(file);
      setIsLoading(true);
      setUploadTime(new Date().toLocaleString()); // Store upload time
  
      // Read PDF
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);
      reader.onload = async () => {
        try {
          const arrayBuffer = reader.result;
          const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
          setNumPages(pdf.numPages);
  
          // Extract Metadata
          const metadata = await pdf.getMetadata();
          setMetadata({
            title: metadata.info?.Title || "Not Available",
            author: metadata.info?.Author || "Not Available",
            keywords: metadata.info?.Keywords || "Not Available",
          });

          // Extract first 1000 characters of text while preserving paragraph breaks
          let extractedText = "";
          for (let i = 1; i <= Math.min(2, pdf.numPages); i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            
            // Convert text items into paragraphs with line breaks
            const pageText = textContent.items.map((item) => item.str).join(" ").replace(/\.\s+/g, ".\n\n");

            extractedText += pageText + "\n\n"; // Add extra space for better readability

            if (extractedText.length >= 1000) break; // Stop if limit reached
          }

          // Trim excess whitespace and slice to the 1000-character limit
          const cleanedText = extractedText.trim().slice(0, 1000);

          setTextPreview(cleanedText);
          setWordCount(cleanedText.split(/\s+/).length);
          setCharCount(cleanedText.length);

  
          // Simple language detection (can replace with an advanced library)
          detectLanguage(extractedText);
        } catch (error) {
          console.error("Error processing PDF:", error);
          setError(error);
          setIsLoading(false);

        }
      };
  
      // Compress PDF
      const compressionReader = new FileReader();
      compressionReader.readAsArrayBuffer(file);
  
      compressionReader.onload = () => {
        try {
          const arrayBuffer = compressionReader.result;
          const compressedData = pako.deflate(new Uint8Array(arrayBuffer), { level: 9 }); // Max compression
          const compressedBlob = new Blob([compressedData], { type: "application/gzip" });
  
          setCompressedFile(compressedBlob);
          setCompressedSize(`${(compressedBlob.size / 1024 / 1024).toFixed(2)} MB`);
          setIsLoading(false);
        } catch (error) {
          console.error("Error compressing file:", error);
          setError(error);
          setIsLoading(false);
          setCompressedFile(null);
        }
      };
  
      compressionReader.onerror = (error) => {
        console.error("Error reading file:", error);
        setError(error);
        setIsLoading(false);
        setCompressedFile(null);
      };
    } else {
      setCompressedFile(null);
      setError("Please select a valid PDF file.");
      setIsLoading(false);
    }
  };
  

  function detectLanguage(extractedText) {
    if (extractedText.match(/[\u0900-\u097F]/)) setDetectedLanguage("Hindi");
    else if (extractedText.match(/[\u0980-\u09FF]/)) setDetectedLanguage("Bengali");
    else if (extractedText.match(/[\u0C00-\u0C7F]/)) setDetectedLanguage("Telugu");
    else if (extractedText.match(/[\u0A80-\u0AFF]/)) setDetectedLanguage("Gujarati");
    else if (extractedText.match(/[\u0D00-\u0D7F]/)) setDetectedLanguage("Malayalam");
    else if (extractedText.match(/[\u0B80-\u0BFF]/)) setDetectedLanguage("Tamil");
    else if (extractedText.match(/[\u0D80-\u0DFF]/)) setDetectedLanguage("Sinhala");
    else if (extractedText.match(/[\u0C80-\u0CFF]/)) setDetectedLanguage("Kannada");
    else if (extractedText.match(/[\u0B00-\u0B7F]/)) setDetectedLanguage("Odia");
    else if (extractedText.match(/[\u0A00-\u0A7F]/)) setDetectedLanguage("Punjabi");
    else if (extractedText.match(/[\u0980-\u09FF]/)) setDetectedLanguage("Assamese");
    else if (extractedText.match(/[\u1C00-\u1C4F]/)) setDetectedLanguage("Santali");
    else if (extractedText.match(/[\u0620-\u06FF]/)) setDetectedLanguage("Urdu");
    else if (extractedText.match(/[\u0A80-\u0AFF]/)) setDetectedLanguage("Maithili");
    else if (extractedText.match(/[\uFB50-\uFDFF]/)) setDetectedLanguage("Kashmiri");
    else if (extractedText.match(/[\u0900-\u097F]/)) setDetectedLanguage("Nepali");
    else if (extractedText.match(/[\u0C00-\u0C7F]/)) setDetectedLanguage("Konkani");
    else if (extractedText.match(/[\u0620-\u06FF]/)) setDetectedLanguage("Sindhi");
    else if (extractedText.match(/[\u0900-\u097F]/)) setDetectedLanguage("Bodo");
    else if (extractedText.match(/[\uABC0-\uABFF]/)) setDetectedLanguage("Manipuri");
    else if (extractedText.match(/[a-zA-Z]/)) setDetectedLanguage("English");
    else if (extractedText.match(/[\u4E00-\u9FFF]/)) setDetectedLanguage("Mandarin Chinese");
    else if (extractedText.match(/[\u00C0-\u017F]/)) setDetectedLanguage("French");
    else if (extractedText.match(/[\u0400-\u04FF]/)) setDetectedLanguage("Russian");
    else if (extractedText.match(/[\u0600-\u06FF]/)) setDetectedLanguage("Arabic");
    else if (extractedText.match(/[\u3040-\u30FF]/)) setDetectedLanguage("Japanese");
    else if (extractedText.match(/[\uAC00-\uD7AF]/)) setDetectedLanguage("Korean");
    else if (extractedText.match(/[\u0100-\u024F]/)) setDetectedLanguage("Italian");
    else if (extractedText.match(/[\u1E00-\u1EFF]/)) setDetectedLanguage("Vietnamese");
    else if (extractedText.match(/[\u0400-\u04FF]/)) setDetectedLanguage("Turkish");
    else setDetectedLanguage("Unknown");
  }

  

  // Handle file submission to backend
  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);
    setResponseText("");
    if (!compressedFile) {
      if(!selectedFile){
        setError("Choose a .pdf file.");
      } else{
        setError("Something went wrong.");
      }
      setIsLoading(false);
      return;
    }
  
    if (!question.trim()) {
      setError("Please enter a question. For eg: Summarize the pdf."); 
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    const formData = new FormData();
    formData.append("compressedPdf", compressedFile, selectedFile.name + ".gz");
    formData.append("question", question); // Append question to formData
  
    try {
      const response = await axios.post(`${API_URL}/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
  
      // Handle response from backend (Gemini AI)
      const { text, modelVersion } = response.data;
      setResponseText(text);
      setModelVersion(modelVersion);
      setIsLoading(false);
  
    } catch (error) {
      console.error("Error uploading PDF:", error);
      setError("Failed to upload PDF.");
      setIsLoading(false);
    }
  };


  // Function to download the AI response as a PDF  
  const downloadPDFUUID = (fileContent, fileNamePrefix) => {
    const uuid = uuidv4(); // Generate a random UUID
    const doc = new jsPDF();
    const margin = 10; // Left and right margin
    const pageHeight = doc.internal.pageSize.height; // Page height
    const lineHeight = 10; // Line height
    let yPosition = margin; // Starting y position
  
    // Split content into paragraphs based on natural line breaks
    const paragraphs = fileContent.split("\n");
  
    paragraphs.forEach((paragraph) => {
      if (paragraph.trim() === "") {
        yPosition += lineHeight; // Add space for empty lines (paragraph breaks)
        return;
      }
  
      // Add UUID before every name (assuming names are in a specific format)
      const modifiedParagraph = paragraph.replace(/\b([A-Z][a-z]+(?:\s[A-Z][a-z]+)*)\b/g, `${uuid}_$1`);
  
      // Split paragraph into lines that fit within the page width
      const lines = doc.splitTextToSize(modifiedParagraph, doc.internal.pageSize.width - 2 * margin);
  
      lines.forEach((line) => {
        // Check if the line fits on the current page, or add a new page
        if (yPosition + lineHeight > pageHeight - margin) {
          doc.addPage();
          yPosition = margin; // Reset yPosition for the new page
        }
  
        // Add the line to the PDF
        doc.text(line, margin, yPosition);
        yPosition += lineHeight; // Move to the next line
      });
  
      // Add extra space between paragraphs
      yPosition += lineHeight;
    });
  
    // Generate the file name with UUID
    const fileName = `${fileNamePrefix}_${uuid}.pdf`;
  
    // Save the PDF
    doc.save(fileName);
  };

  const handleDownloadSamplePDF = () => {
    const pdfUrl = "/UDOHR - United Nations.pdf"; // File should be placed in `public/`
    const link = document.createElement("a");
    link.href = pdfUrl;
    link.download = "UDOHR - United Nations.pdf"; // Name of the file when downloaded
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
    
  
  

  

  

  return (
    <Box sx={{backgroundColor: (theme) =>
      theme.palette.mode === "dark"
        ? "#03132fe8"
        : theme.palette.grey[100],
        color: (theme) => theme.palette.text.primary, padding: "20px", textAlign: "start"}}>
    <div>
    <Box>
      <Box>
        <IndiaGlobal />
      </Box>
      <Typography variant="h5" fontWeight="bold">
        Upload a PDF and get answers to your questions.
      </Typography>
      <Typography variant="body4" sx={{ my: 2 }} gutterBottom>
        <List>
          <ListItem sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
            • Click "Choose File" to upload a PDF.
          </ListItem>
          <ListItem> • Enter your question related to the document.</ListItem>
          <ListItem> • Get instant responses powered by the Gemini API.</ListItem>
        </List>
      </Typography>
    </Box>

    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'start', flexDirection: 'column' }}>
    <Typography variant="body1" sx={{ mb: 1, mt: 3, fontWeight: 'bold' }}>
        Upload any PDF and ask questions
      </Typography>
    <Typography variant="body6" sx={{ mb: 1, fontStyle: 'italic', color: 'secondary' }}>
        Maximum PDF size: 200MB
      </Typography>
      <Tooltip title="Upload any PDF and ask questions" placement="right">
        <TextField
          type="file"
          inputProps={{ accept: ".pdf" }}
          onChange={handleFileUpload}
          variant="outlined"
          style={{ marginBottom: "20px" }}
        />
      </Tooltip>

      <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
      <div>
      {/* Button to Open Modal */}
      {selectedFile && 
      <Tooltip title="View PDF" placement="bottom">
        <Button
          variant="outlined"
          color="success"
          startIcon={<i class="fa-regular fa-file-pdf"></i>}
          onClick={handleOpen}
          sx={{mr: 3}}
        >
          View PDF
        </Button>
      </Tooltip>
}

      {/* Modal */}
      {selectedFile && 
      <Modal
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{ timeout: 500 }}
      >
        <Fade in={open}>
          <Box sx={style}>
            {/* PDF Title */}
            <Typography variant="h6" fontWeight="bold" mb={2} color="#4A148C">
              {selectedFile.name || "PDF Document"}
            </Typography>

            {/* Embedded PDF */}
            <object
              data={pdfUrl}
              type="application/pdf"
              width="100%"
              height="500px"
            >
              <p>Your browser does not support PDFs. <a href={pdfUrl}>Download PDF</a> instead.</p>
            </object>
          </Box>
        </Fade>
      </Modal>
}
    </div>
        <Tooltip title="Remove PDF" placement="bottom">
          <Button variant="contained" color="error" startIcon={<DeleteIcon />} onClick={resetAll}>
          Remove PDF
          </Button>
        </Tooltip>
      </Box>

      {!selectedFile &&
        <Tooltip title="Download Sample PDF" placement="right">
          <Button
          variant="outlined"
          color="secondary"
          startIcon={<DownloadIcon />}
          onClick={handleDownloadSamplePDF}
          sx={{mt: 2}}
        >
          Download Sample PDF
        </Button>
        </Tooltip>
      }
      </Box>
      <br />


      <Tooltip title="Ask Questions">
      <TextField
          label="Ask Questions"
          multiline
          rows={8}
          placeholder='Ask any questions from the uploaded pdf'
          variant="standard"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          sx={{
            width: { xs: "90%", sm: "90%", md: "90%" },
            minWidth: "300px",
            marginBottom: 2,
            mt: 2
          }}
        />
        </Tooltip>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', m: 2}}>
      {!isLoading ? (
        <Tooltip title="Start Analyzing">
          <Button
            variant="contained"
            color="primary"
            startIcon={<i className="fa-solid fa-brain"></i>}
            onClick={handleSubmit}
          >
            Analyze
          </Button>
        </Tooltip>
      ) : (
        <Button variant="contained" color="primary" disabled>
          <img src="data:image/gif;base64,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" alt="Loading" width="24" height="24" />
        </Button>
      )}

      <Tooltip title="Clear question">
        <Button variant="text" color="success" sx={{marginRight: {xs : '5px',sm : '25px', md:'50px', lg :'150px', xl : '170px',}}} onClick={() => {setQuestion("")}}>
              Clear
        </Button>
        </Tooltip>
      </Box>
      {error && (
      <Typography color="error" variant="body1">
          {error}
      </Typography>
    )}


      {selectedFile && (
  <Box
    sx={{
      mt: 3,
      p: 3,
      borderRadius: 3,
      boxShadow: 4,
      border: "1px solid",
      borderColor: (theme) => theme.palette.divider,
    }}
  >
  <Typography
    variant="h5"
    fontWeight="bold"
    sx={{ mb: 2, textAlign: "start", color: "primary.main" }}
    >
      PDF File Details
  </Typography>
    <Accordion sx={{ backgroundColor: "background.default", borderRadius: "8px 8px 0 0", p: 2}}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography fontWeight="bold">📄 {selectedFile.name || "Uploaded File"}</Typography>
      </AccordionSummary>
      <AccordionDetails>

        {/* File Information */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="body1">
            <strong>File Name:</strong> {selectedFile.name}
          </Typography>
          <Typography variant="body1">
            <strong>Original Size:</strong> {fileSize}
          </Typography>
          <Typography variant="body1">
            <strong>Compressed Size:</strong> {compressedSize || "Not Compressed"}
          </Typography>
          <Typography variant="body1">
            <strong>Number of Pages:</strong> {numPages || "Loading..."}
          </Typography>
          <Typography variant="body1">
            <strong>Upload Time:</strong> {uploadTime}
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Metadata */}
        <Typography variant="h6" fontWeight="bold" sx={{ color: "primary.main" }}>
          Metadata
        </Typography>
        <Box
          sx={{
            p: 2,
            borderRadius: 2,
            border: "1px solid",
            borderColor: (theme) => theme.palette.divider,
            mt: 1,
          }}
        >
          <Typography variant="body2">
            <strong>Title:</strong> {metadata.title}
          </Typography>
          <Typography variant="body2">
            <strong>Author:</strong> {metadata.author}
          </Typography>
          <Typography variant="body2">
            <strong>Keywords:</strong> {metadata.keywords}
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Extracted Content Summary */}
        <Typography variant="h6" fontWeight="bold" sx={{ color: "primary.main" }}>
          Extracted Content Summary
        </Typography>
        <Box
          sx={{
            p: 2,
            borderRadius: 2,
            border: "1px solid",
            borderColor: (theme) => theme.palette.divider,
            mt: 1,
          }}
        >
          <Typography variant="body2">
            <strong>Preview:</strong> {textPreview || "Loading"}...
          </Typography>
          <Box sx={{mt: 2}}>
            <Typography variant="body2">
              <strong>Word Count:</strong> {wordCount}
            </Typography>
            <Typography variant="body2">
              <strong>Character Count:</strong> {charCount}
            </Typography>
            <Typography variant="body2">
              <strong>Detected Language:</strong> {detectedLanguage}
            </Typography>
          </Box>
        </Box>
      </AccordionDetails>
    </Accordion>
  </Box>
)}



{responseText && (
  <Paper
    elevation={4}
    sx={{
      p: 3,
      mt: 4,
      backgroundColor: "background.default",
      borderRadius: 3,
      boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
    }}
  >
    
    <Typography variant="h5" gutterBottom fontWeight="bold">
      Gemini AI Response
    </Typography>

    <Divider sx={{ my: 2 }} />

    {modelVersion && (
  <Box sx={{ mt: 2 }}>
    <Typography variant="body2">
      <strong>Model Version:</strong> {modelVersion}
    </Typography>
  </Box>
)}

    <Accordion sx={{ mt: 2, backgroundColor: "#002366", color: "white", borderRadius: 2 }}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
        aria-controls="response-content"
        id="response-header"
        sx={{
          backgroundColor: "#002366",
          borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
          borderRadius: "8px 8px 0 0",
        }}
      >
        <Typography variant="h6" fontWeight="bold">
          AI-Generated Response
        </Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ backgroundColor: "#001b44", borderRadius: "0 0 8px 8px", p: 3 }}>
        {/* Download Button */}
        <Box sx={{ display: "flex", justifyContent: "end", mb: 2 }}>
          <Tooltip title="Download Response">
            <Button
              variant="outlined"
              onClick={() => downloadPDFUUID(responseText, "Response")}
              sx={{
                color: "white",
                fontWeight: "bold",
                borderColor: "white",
                "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" },
              }}
            >
              Download response <i className="fa-solid fa-file-pdf" style={{ marginLeft: "5px" }}></i>
            </Button>
          </Tooltip>
        </Box>

        {/* AI Response Text */}
        <Box
          sx={{
            p: 3,
            backgroundColor: "rgba(255,255,255,0.1)",
            borderRadius: 2,
            color: "white",
            boxShadow: "inset 0 0 10px rgba(255,255,255,0.2)",
          }}
        >
          <ReactMarkdown>{responseText}</ReactMarkdown>
        </Box>
      </AccordionDetails>
    </Accordion>
  </Paper>
)}


    </div>
    {error && (
      <Typography color="error" variant="body1" sx={{mt: 2}}>
          {error}
      </Typography>
    )}
    </Box>
    
  );
};

export default PdfUploader;

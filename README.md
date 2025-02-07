# AskMyPDF

This app allows users to upload PDF documents, extract key insights, and analyze content efficiently using AI-powered processing. Users can upload PDFs, receive structured summaries, detect key metadata, and perform intelligent document searches. The backend processes PDFs by extracting text, analyzing content, and generating insights, making it an ideal tool for research, business, and personal document management.  

## Live Link  
[Live Link](https://ask-my-pdf-brown.vercel.app/)  

## Backend Service for PDF Processing  

This backend service provides functionality to:  

1. Process uploaded PDF files efficiently.  
2. Extract metadata and text content from PDFs.  
3. Perform intelligent text analysis using AI models.  
4. Expose API endpoints for interacting with extracted content.  
5. Ask any questions related to pdf.  

---

## Features  

- **PDF Upload and Processing**: Upload PDF files for structured analysis.  
- **Metadata Extraction**: Retrieve document title, author, and keywords.  
- **Text Processing**: Extract and format text while preserving paragraphs.  
- **AI-Powered Analysis**: Generate summaries and insights using AI.  
- **File Compression**: Optimize and store PDFs efficiently.  
- **Dark Mode**: Seamless darkmode for best user experience.  

---

## Prerequisites  

- Node.js (>=16.x)  
- npm (>=7.x)  
- A `.env` file with the following variables:  
  ```  
  PORT=5000  
  API_KEY_GEMINI=<Your API Key Here>  
  ```  

---

## Installation  

1. Clone the repository:  
   ```bash  
   git clone <repository-url>  
   ```  

2. Navigate to the project directory:  
   ```bash  
   cd <repository-name>  
   ```  

3. Install dependencies:  
   ```bash  
   npm install  
   ```  

4. Create a `.env` file in the root directory and add the required variables:  
   ```bash  
   PORT=5000  
   API_KEY_GEMINI=<Your API Key Here>  
   ```  

---

## Usage  

### Starting the Server  

Run the server with:  
```bash  
npm start  
```  
The server will be available at: `http://localhost:5000`  

---

## API Endpoints  

### **Base URL**  
`http://localhost:5000`  

### **GET /**  
**Description**: Server health check.  

**Response**:  
```plaintext  
Server is live! 
```  

### **POST /api/v1/upload**  
**Description**: Upload a PDF file for processing.  

**Headers**:  
- `Content-Type`: `application/pdf`  

**Request Body**: PDF file data.  
   

---

## Helper Functions  

### `extractMetadata`  
Retrieves metadata such as title, author, keywords, and etc from a PDF.  

### `splitTextIntoParagraphs`  
Processes and structures extracted text while maintaining paragraph breaks.  

### `compressPDF`  
Compresses and optimizes PDFs for storage efficiency.  

---

## Development  

### Running the Server in Development Mode  
Use `nodemon` for automatic server restarts:  
```bash  
npm install -g nodemon  
nodemon server.js  
```  

### Logging  
The server logs processing steps and errors for debugging purposes.  

---

## Deployment  

- Ensure the `.env` file is configured on the server.  

---

## Dependencies  

- [express](https://www.npmjs.com/package/express) - Web framework for Node.js.  
- [cors](https://www.npmjs.com/package/cors) - Middleware for handling Cross-Origin Resource Sharing.  
- [pdf-parse](https://www.npmjs.com/package/pdf-parse) - Library for extracting text from PDFs.  
- [axios](https://www.npmjs.com/package/axios) - Promise-based HTTP client.  
- [dotenv](https://www.npmjs.com/package/dotenv) - Loads environment variables from `.env` file.  

---

## Acknowledgments  
Special thanks to the developers of the open-source tools used in this project.  

## Author  
Made by [Sanskar](https://sanskarjaiswal2904.github.io/Sanskar-Website/) with ❤️.
# PDF Analyzer  

This app allows users to upload PDF documents, extract key insights, and analyze content efficiently using AI-powered processing. Users can upload PDFs, receive structured summaries, detect key metadata, and perform intelligent document searches. The backend processes PDFs by extracting text, analyzing content, and generating insights, making it an ideal tool for research, business, and personal document management.  

## Live Link  
[Live Link](https://pdf-analyzer.vercel.app/)  

## Backend Service for PDF Processing  

This backend service provides functionality to:  

1. Process uploaded PDF files efficiently.  
2. Extract metadata and text content from PDFs.  
3. Perform intelligent text analysis using AI models.  
4. Expose API endpoints for interacting with extracted content.  

---

## Features  

- **PDF Upload and Processing**: Upload PDF files for structured analysis.  
- **Metadata Extraction**: Retrieve document title, author, and keywords.  
- **Text Processing**: Extract and format text while preserving paragraphs.  
- **AI-Powered Analysis**: Generate summaries and insights using AI.  
- **File Compression**: Optimize and store PDFs efficiently.  

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
Server is live.  
Hello from the server!  
```  

### **POST /api/v1/upload**  
**Description**: Upload a PDF file for processing.  

**Headers**:  
- `Content-Type`: `application/pdf`  

**Request Body**: PDF file data.  

**Response**:  
```json  
{  
  "message": "PDF processed",  
  "metadata": {  
    "title": "<document_title>",  
    "author": "<document_author>",  
    "keywords": "<document_keywords>"  
  },  
  "textPreview": "<extracted_text>",  
  "wordCount": <word_count>,  
  "charCount": <character_count>,  
  "detectedLanguage": "<language>"  
}  
```  

**Error Response**:  
```json  
{  
  "error": "Failed to process PDF",  
  "details": "<error_message>"  
}  
```  

---

## Helper Functions  

### `extractMetadata`  
Retrieves metadata such as title, author, and keywords from a PDF.  

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
- Use a process manager like `pm2` for production:  
  ```bash  
  npm install -g pm2  
  pm2 start server.js --name "pdf-analyzer-backend"  
  ```  

---

## Dependencies  

- [express](https://www.npmjs.com/package/express) - Web framework for Node.js.  
- [cors](https://www.npmjs.com/package/cors) - Middleware for handling Cross-Origin Resource Sharing.  
- [pdf-parse](https://www.npmjs.com/package/pdf-parse) - Library for extracting text from PDFs.  
- [axios](https://www.npmjs.com/package/axios) - Promise-based HTTP client.  
- [dotenv](https://www.npmjs.com/package/dotenv) - Loads environment variables from `.env` file.  

---

## License  
This project is licensed under the MIT License. See the LICENSE file for details.  

---

## Acknowledgments  
Special thanks to the developers of the open-source tools used in this project.  

## Author  
Made by [Sanskar](https://sanskarjaiswal2904.github.io/Sanskar-Website/) with ❤️.
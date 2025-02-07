// src/Hello.js
import React from 'react';
import Navbar from './Navbar';
import PdfUploader from './PdfUploader';
import Footer from "./Footer";

function Hello() {
  return <div>
    <Navbar/>
    <PdfUploader/>
    <Footer/>
  </div>
}

export default Hello;
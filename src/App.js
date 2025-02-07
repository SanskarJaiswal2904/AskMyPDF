// Usage in src/App.js
import React from 'react';
import Hello from './components/Hello';
import { ThemeContextProvider } from "./context/ThemeContext"; // Import context


function AppContent() {

  return (
    <div>
      <Hello/>
    </div>
  );
}

function App() {
  return (
    <ThemeContextProvider>
      <AppContent />
    </ThemeContextProvider>
  );
}

export default App;

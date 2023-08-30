import React, { useState, useEffect } from 'react';
import { ThemeProvider, CssBaseline, createTheme } from '@mui/material';
import Header from './layout/Header';

function App() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode === 'true') {
      setDarkMode(true);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('darkMode', darkMode.toString());
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <div>
        <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        <main>
          {/* Your main content goes here */}
        </main>
      </div>
    </ThemeProvider>
  );
}

const lightTheme = createTheme({
  palette: {
    mode: 'light',
  },
})

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
})

export default App;

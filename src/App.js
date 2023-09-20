import React, { useState, useEffect } from 'react';
import { ThemeProvider, CssBaseline, createTheme } from '@mui/material';
import Header from './layout/Header';
import Container from './pages/Container';
import { createAlchemyWeb3 } from "@alch/alchemy-web3";


function App() {
  const [darkMode, setDarkMode] = useState(false);
  const alchemyKey = process.env.REACT_APP_ALCHEMY_KEY;
  const web3 = createAlchemyWeb3(alchemyKey);

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
        <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} web3={web3} />
        <main>
          <div className="container mt-3">
            <Container web3={web3} />
          </div>
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

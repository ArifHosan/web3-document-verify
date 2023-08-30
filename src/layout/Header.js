import React, { useState, useEffect } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

const Header = ({ darkMode, toggleDarkMode }) => {
    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6">My App Header</Typography>
                <div style={{ marginLeft: 'auto' }}>
                    <IconButton onClick={toggleDarkMode} color="inherit">
                        {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
                    </IconButton>
                </div>
            </Toolbar>
        </AppBar>
    );
};

export default Header
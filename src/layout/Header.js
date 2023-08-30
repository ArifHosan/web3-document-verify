import React, { useEffect } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import Button from '@mui/material/Button';

const Header = ({ darkMode, toggleDarkMode }) => {
    const [hasAccount, setHasAccount] = React.useState(false);
    const { ethereum } = window;

    const handleWalletConnect = () => {
        if (ethereum) {
            ethereum.request({ method: 'eth_requestAccounts' })
                .then((accounts) => {
                    console.log(accounts)
                    setHasAccount(true)
                })
                .catch((error) => {
                    console.log(error)
                })
        }
    }


    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6">My App Header</Typography>
                <div style={{ marginLeft: 'auto' }}>
                    <IconButton onClick={toggleDarkMode} color="inherit">
                        {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
                    </IconButton>
                    <Button onClick={handleWalletConnect} sx={{ marginLeft: "20px" }} color="success" variant="contained">Connect Wallet</Button>
                    {/* <ConnectWallet theme={darkMode? "dark": "light"} style={{marginLeft: "20px"}} /> */}
                </div>
            </Toolbar>
        </AppBar>
    );
};

export default Header
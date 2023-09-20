import React, { useEffect } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import Button from '@mui/material/Button';
import EthereumService from '../services/etherService';
import { useAccountStore } from '../store';

const Header = ({ darkMode, toggleDarkMode, web3 }) => {
    const [account, setAccount] = React.useState(null);
    const [balance, setBalance] = React.useState(null);

    const setAccountState = useAccountStore((state) => state.setAccount);
    const setHasWalletState = useAccountStore((state) => state.setHasWallet);

    const getBalance = (_account) => {
        EthereumService.getBalance(web3, _account).then((balance) => {
            setBalance(balance)
        })
    }

    useEffect(() => {
        EthereumService.getPrimaryAccount(web3).then((_account) => {
            setAccount(_account)
            getBalance(_account)

            setAccountState(_account)

        }).catch((error) => {
            console.log(error)
            setAccountState(null)
        })
    })

    const handleWalletConnect = () => {
        EthereumService.authenticateMetamask(web3).then((account) => {
            setAccount(account)
            getBalance(account)

            setAccountState(account)

        }).catch((error) => {
            console.log(error)
        })
    }

    const disconnectWallet = () => {
        setAccount(null)
        setBalance(null)
    }


    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6">Document Verification using BlockChain</Typography>
                <div style={{ marginLeft: 'auto' }} className='d-flex'>
                    <div>
                        <IconButton onClick={toggleDarkMode} color="inherit">
                            {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
                        </IconButton>
                    </div>
                    <div>
                        {
                            !account &&
                            <Button onClick={handleWalletConnect} sx={{ marginLeft: "20px" }} color="success" variant="contained">Connect Wallet</Button>
                        }
                        {
                            account &&
                            <Button onClick={disconnectWallet} sx={{ marginLeft: "20px" }} color="success" variant="contained">{balance} ETH</Button>
                        }
                    </div>
                </div>
            </Toolbar>
        </AppBar>
    );
};

export default Header
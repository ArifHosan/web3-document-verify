import Grid from '@mui/material/Unstable_Grid2';
import Button from '@mui/material/Button';
import React, { useEffect, useState } from 'react'
import ContractService from '../services/contractService';
import EthereumService from '../services/etherService';
import { Snackbar, Alert } from "@mui/material";

const Container = ({ web3 }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [inputValue, setInputValue] = useState('');
    const [hash, setHash] = useState('');
    const [contract, setContract] = useState(null);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snack, setSnack] = useState({ status: "success", message: "Success" });

    const handleSnackbarClose = (event, reason) => { setOpenSnackbar(false); };

    useEffect(() => {
        getContract();
    })

    const getContract = async () => {
        if (!web3 || contract) return;
        ContractService.getContract(web3).then((_contract) => {
            setContract(_contract)
            ContractService.setupListeners(web3, _contract, onContractEvent, onContractError)
        }).catch((error) => {
            console.log(error)
        })
    }

    const onContractEvent = (event) => {
        console.log(event.event)
        if (event.event === "DocumentUploaded") {
            const docId = event.returnValues.docId;
            console.log(docId)
            setSnack({ status: "success", message: `Document uploaded with id ${docId}` })
            setOpenSnackbar(true)
        }
        if (event.event === "DocumentVerified") {
            console.log(event.returnValues)
            setSnack({ status: "success", message: `Document verified!` })
        }
    }
    const onContractError = (error) => {
        console.log(error)
    }


    const readFileAsArrayBuffer = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (event) => {
                resolve(event.target.result);
            };
            reader.onerror = reject;
            reader.readAsArrayBuffer(file);
        });
    };
    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        // setSelectedFile(file);

        if (file) {
            try {
                console.log(file)
                const fileArrayBuffer = await readFileAsArrayBuffer(file)
                console.log(fileArrayBuffer)
                const hashBuffer = await crypto.subtle.digest('SHA-256', fileArrayBuffer);
                console.log(hashBuffer)

                const hashArray = Array.from(new Uint8Array(hashBuffer));
                const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
                console.log(hashHex)

                setHash(hashHex);
            } catch (error) {
                console.error('Error generating hash:', error);
            }
        }
    };
    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };

    const onUpload = async () => {
        if (!contract) {
            await getContract();
        }
        snack.message = "Uploading the file... Transaction will be confirmed in a few seconds..."
        setSnack(snack)

        const transactionParams = {
            from: await EthereumService.getPrimaryAccount(web3),
            to: contract.options.address,
            data: contract.methods.uploadDocument(hash).encodeABI(),
        }

        const gas = await ContractService.estimateGas(web3, transactionParams)
        transactionParams.gas = String(gas)

        ContractService.sendTransation(transactionParams).then((result) => {
            console.log(result)
        }).catch((error) => {
            console.log(error)
        })
    }

    const onVerify = async () => {
        if (!contract) {
            await getContract();
        }
        snack.message = "Verifying the file... Transaction will be confirmed in a few seconds..."
        setSnack(snack)

        const transactionParams = {
            from: await EthereumService.getPrimaryAccount(web3),
            to: contract.options.address,
            data: contract.methods.verifyDocument(hash, inputValue).encodeABI(),
        }

        ContractService.estimateGas(web3, transactionParams).then((gas) => {
            transactionParams.gas = String(gas)
            ContractService.sendTransation(transactionParams).then((result) => {
                console.log(result)
            }).catch((error) => {
                console.log(error)
            })
        }).catch((error) => {
            const err = error;
            console.log(err.message?.split(":")[2].trim())
            setSnack({ status: "error", message: err.message?.split(":")[2].trim() })
        })        
    }




    return (
        <>
            <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} severity={snack.status} sx={{ width: '100%' }}>
                    {snack.message}
                </Alert>
            </Snackbar>
            <Grid container spacing={2} sx={{ margin: "10px 10px 10px 10px" }}>
                <Grid item xs={12}>
                    <label for="file">Choose a file</label>
                    <input onChange={handleFileChange} type="file" id="file" name="file" />
                    <label for="hash">Enter Hash</label>
                    <input value={inputValue} onChange={handleInputChange} name="hash" type='text'></input>
                    <Button onClick={onUpload} variant="contained">Upload</Button>
                    <Button onClick={onVerify} variant="contained">Verify</Button>
                </Grid>
                <Grid item xs={3}>
                </Grid>
                <Grid item xs={12}>
                    <h3>{snack.message}</h3>
                </Grid>
            </Grid>
        </>


    )
}

export default Container
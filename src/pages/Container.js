import Button from '@mui/material/Button';
import React, { useEffect, useState } from 'react'
import ContractService from '../services/contractService';
import EthereumService from '../services/etherService';
import FileDrop from '../fragments/drop'
import { SlCloudUpload } from 'react-icons/sl';
import { FaEthereum } from 'react-icons/fa';
import { PiMagnifyingGlass } from 'react-icons/pi';
import TextTransition, { presets } from 'react-text-transition';
import IdentifierInputDialog from '../dialog/identifierDialog';
import { useAccountStore } from '../store';
import InforamtionDialog from '../dialog/infoDialog';


const Container = ({ web3 }) => {
    const [file, setFile] = useState(null);
    const [hash, setHash] = useState('');
    const [processText, setProcessText] = useState("");

    const [identifierDialogState, setIdentifierDialogState] = useState(false);
    const [infoDialogState, setInfoDialogState] = useState({ show: false, data: {} });

    const closeInfoDialog = () => {
        setInfoDialogState({ show: false, data: {} });
    }

    const account = useAccountStore((state) => state.account);

    const [contract, setContract] = useState(null);

    useEffect(() => {
        getContract();
    })

    const getContract = async () => {
        if (!web3 || contract) return;
        ContractService.getContract(web3).then((_contract) => {
            setContract(_contract)
            ContractService.setupListeners(web3, _contract, onContractEvent, onContractError)
        }).catch((error) => {
        })
    }

    const onContractEvent = (event) => {
        console.log(event.event)
        if (event.event === "DocumentUploaded") {
            const docId = event.returnValues.docId;
            setInfoDialogState({ show: true, data: { header: "Document Identifier", content: docId, copy: true } })
        }
        if (event.event === "DocumentVerified") {
            console.log(event.returnValues)
            setInfoDialogState({ show: true, data: { header: "Document Verification", content: "Document Verified!" } })
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

    const onUpload = async () => {
        if (!contract) {
            await getContract();
        }
        if (!account) {
            console.log("Account not found")
            return
        }

        setProcessText("Initiating Transaction... Please confirm!");


        const transactionParams = {
            from: await EthereumService.getPrimaryAccount(web3),
            to: contract.options.address,
            data: contract.methods.uploadDocument(hash).encodeABI(),
        }

        const gas = await ContractService.estimateGas(web3, transactionParams)
        transactionParams.gas = String(gas)

        ContractService.sendTransation(transactionParams).then((result) => {
            console.log(result)
            setProcessText("Transaction Confirmed! Creating Unique Identifier...");

        }).catch((error) => {
            console.log(error)
            setProcessText("Error Occured! Please try again!");
        })
    }

    const onVerify = async (value) => {
        if (!contract) {
            await getContract();
        }
        if (!account) {
            console.log("Account not found")
            return
        }
        setProcessText("Initiating Transaction... Please confirm!");

        const transactionParams = {
            from: await EthereumService.getPrimaryAccount(web3),
            to: contract.options.address,
            data: contract.methods.verifyDocument(hash, value).encodeABI(),
        }

        ContractService.estimateGas(web3, transactionParams).then((gas) => {
            transactionParams.gas = String(gas)
            ContractService.sendTransation(transactionParams).then((result) => {
                console.log(result)
                setProcessText("Transaction Confirmed! Verifying Document...");
            }).catch((error) => {
                console.log(error)
            })
        }).catch((error) => {
            const err = error;
            console.log(err.message?.split(":")[2].trim())
            setProcessText(err.message?.split(":")[2].trim())
        })
    }
    const handleChange = (file) => {
        setFile(file);
    };
    const calculateHashFromFile = async (file) => {
        if (!file) return;
        try {
            const fileArrayBuffer = await readFileAsArrayBuffer(file)
            const hashBuffer = await crypto.subtle.digest('SHA-256', fileArrayBuffer);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
            setHash(hashHex);
            return "File Hash Generated!"
        } catch (error) {
            console.error('Error generating hash:', error);
            return "Error generating hash!";
        }
    }
    const onStartProcess = async () => {
        if(!account) {
            setInfoDialogState({ show: true, data: { header: "Wallet Required", content: "Please connect your wallet to continue!" } })
            return;
        }

        const allTexts = ["Uploading File ...", "Processing File ...", "Calculating Hash ..."];
        let i = 0;
        const interval = setInterval(() => {
            if (i < allTexts.length) {
                setProcessText(allTexts[i]);
                i++;
            }
            if (i === 4) {
                clearInterval(interval);
            }
        }, 1000);
        const result = await calculateHashFromFile(file);
        allTexts.push(result);
    }
    const handleIdentifierDialogClose = (value) => {
        setIdentifierDialogState(false);
        console.log(value);
        if(value){
            onVerify(value);
        }
    }

    return (
        <>
            <div className='row'>
                <div className='offset-3 col-6'>
                    <FileDrop onDrop={handleChange} />
                </div>
            </div>
            {
                file &&
                <>
                    <div className='mt-2 row'>
                        <div className='d-flex justify-content-center'>
                            <Button variant="contained" color="primary" size='large' startIcon={<SlCloudUpload />} onClick={onStartProcess} >
                                Start Processing File
                            </Button>
                        </div>
                    </div>
                    <div className='mt-2 row'>
                        <div className='d-flex justify-content-center'>
                            <h3>
                                <TextTransition springConfig={presets.gentle}>{processText}</TextTransition>
                            </h3>
                        </div>
                    </div>
                </>
            }
            {
                hash &&
                <>
                    <div className='mt6rem row'>
                        <div className='d-flex justify-content-center'>
                            <div className='d-flex flex-column'>
                                <Button variant="contained" color="primary" size='large' startIcon={<FaEthereum />}
                                    onClick={onUpload}>
                                    Generate Unique Identifier for the File using Blockchain
                                </Button>
                                <Button className='mt-3' variant="contained" color="primary" size='large' startIcon={<PiMagnifyingGlass />}
                                    onClick={() => setIdentifierDialogState(true)}>
                                    Verify the File using a Unique Identifier
                                </Button>
                            </div>
                        </div>
                    </div>
                </>
            }
            <IdentifierInputDialog show={identifierDialogState} onClose={handleIdentifierDialogClose} />
            <InforamtionDialog show={infoDialogState.show} data={infoDialogState.data} onClose={closeInfoDialog} />
        </>
    )
}
export default Container
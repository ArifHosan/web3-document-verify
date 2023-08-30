import Grid from '@mui/material/Unstable_Grid2';
import Button from '@mui/material/Button';
import React, { useState } from 'react'
import { useContract } from "@thirdweb-dev/react";

const Container = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [inputValue, setInputValue] = useState('');
    const [hash, setHash] = useState('');

    // const { contract, isLoading, error } = useContract("0xF3331df54B71BFD855C0b0ce31Fe3E353Cc385EA");

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        setSelectedFile(file);

        if (file) {
            try {
                const fileArrayBuffer = await file.arrayBuffer();
                const hashBuffer = await crypto.subtle.digest('SHA-256', fileArrayBuffer);

                const hashArray = Array.from(new Uint8Array(hashBuffer));
                const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');

                setHash(hashHex);
            } catch (error) {
                console.error('Error generating hash:', error);
            }
        }
    };
    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };

    // const onUpload = async () => {
    //     console.log(hash, inputValue)
    //     console.log(contract)
    //     if(!contract)   return;
    //     const tx = await contract.call("uploadDocument", [hash], { gasLimit: 1000000 });
    //     console.log(tx.receipt)
    //     console.log(tx.receipt.logs[0].data)
    //     // contract.call("uploadDocument", [hash], { gasLimit: 1000000 }).then((result) => {
    //     //     console.log(result)
    //     // }).catch((error) => {
    //     //     console.log(error)
    //     // })
    // }

    // const onVerify = () => {
    //     console.log(hash, inputValue)
    //     console.log(contract)
    //     if(!contract)   return;
    //     contract.call("verifyDocument", [hash, inputValue], { gasLimit: 1000000 }).then((result,a) => {
    //         console.log(result, a)
    //     }).catch((error) => {
    //         console.log(error)
    //     })
    // }




    return (
        <Grid container spacing={2} sx={{ margin: "10px 10px 10px 10px" }}>
            <Grid item xs={3}>
            </Grid>
            <Grid item xs={6}>
                <label for="file">Choose a file</label>
                <input onChange={handleFileChange} type="file" id="file" name="file" />
                <label for="hash">Enter Hash</label>
                <input value={inputValue} onChange={handleInputChange} name="hash" type='text'></input>
                {/* <Button onClick={onUpload} variant="contained">Upload</Button> */}
                {/* <Button onClick={onVerify} variant="contained">Verify</Button> */}
            </Grid>
            <Grid item xs={3}>
            </Grid>
        </Grid>

    )
}

export default Container
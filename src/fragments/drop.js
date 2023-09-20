import React, { useEffect, useState, useCallback } from 'react'
import Dropzone from 'react-dropzone'
import { BsPlusLg } from 'react-icons/bs';
import ThemeService from '../services/themeService';
import { useTheme } from '@mui/material/styles';

const FileDrop = ({ onDrop }) => {
    const theme = useTheme();
    const [fileInfo, setFileInfo] = useState(null);

    const formatBytes = (bytes, decimals = 2) => {
        if (!+bytes) return '0 Bytes'
        const k = 1024
        const dm = decimals < 0 ? 0 : decimals
        const sizes = ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB']
    
        const i = Math.floor(Math.log(bytes) / Math.log(k))
    
        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
    }

    const handleDrop = (files) => {
        if (!files || files.length === 0) return;
        const file = files[0];
        const fileName = file.name;
        setFileInfo({ fileName, size: formatBytes(file.size, 2) });

        onDrop(file);
    }


    return (
        <>
            <div className="dropzone" >
                <Dropzone maxFiles={1} onDrop={handleDrop} className="d-flex flex-column justify-content-center">
                    {({ getRootProps, getInputProps }) => (
                        <section>
                            <div {...getRootProps()} style={{background: ThemeService.getPrimaryColor(theme, 0.2)}}>
                                <input {...getInputProps()} />
                                {
                                    fileInfo ?
                                        <>
                                            <p className='text-center'>{fileInfo.fileName} ({fileInfo.size})</p>
                                        </> :
                                        <>
                                            <div className='text-center'>
                                                <BsPlusLg size={100} />
                                            </div>
                                            <p className='text-center'>Drag 'n' drop a file here, or click to select file</p>
                                        </>
                                }
                            </div>
                        </section>
                    )}
                </Dropzone>
            </div>
        </>
    )
}

export default FileDrop
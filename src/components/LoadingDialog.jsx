import React from 'react'

import {Box, CircularProgress, Dialog } from '@mui/material';

const LoadingDialog = ({ openFl }) => {

    const backdropClick = (e) => { e.preventDefault();  }

    return (
        <Dialog
            open={openFl}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            onBackdropClick={backdropClick}
            className="myabcdata-loading"
        >  
            <Box style={{padding: '30px', background: 'initial', display: 'flex' }}>
                <CircularProgress size={80}/>
            </Box>    
        </Dialog>
    );
}

export default LoadingDialog;
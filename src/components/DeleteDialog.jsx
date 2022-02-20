import React from 'react'

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

function DeleteDialog({title, text, openFl, handleClose, deleteLabel}) {
    
    function deleteIncident() {
        handleClose(true);
    }
        
    function closeDialog() {
        handleClose(false);
    }

    const label = deleteLabel ? deleteLabel : 'Delete';

    return (
        <Dialog
            open={openFl}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {text}<br/>Otherwise, click Cancel.
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={closeDialog} color="primary">
                    Cancel
                </Button>
                <Button onClick={deleteIncident} color="primary">
                    {label}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default DeleteDialog;
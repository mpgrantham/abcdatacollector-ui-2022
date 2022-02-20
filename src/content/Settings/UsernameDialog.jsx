import React, { useState } from 'react'

import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';


import UserService from '../../services/UserService';

function UsernameDialog(props) {

    const {openFl} = props;

    const [username, setUsername ] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const [message, setMessage] = useState('');
    
    const handleChange = (e) => {
        const target = e.target;
        setUsername(target.value);
    }

    function changeUsername() {
        if ( username.trim().length === 0 ) {
            setMessage('Must provide New Username');
            setShowAlert(true);
            return;
        }

        UserService.changeUsername(props.sessionKey, username).then(result => {
            props.handleClose(true, result);
        });
    }
        
    function handleClose() {
        props.handleClose(false);
    }

    return (
        
        <Dialog
            open={openFl}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">Update Username</DialogTitle>
            <DialogContent style={{overflowY: 'hidden'}}>
                <Grid  
                    container
                    spacing={3}
                >
                    {showAlert &&
                    <Grid item xs={12}>
                        <Alert severity="error">{message}</Alert>
                    </Grid>
                    }

                    <Grid item xs={12}>
                        <TextField
                            margin="dense"
                            name="currentUsername"
                            label="Current Username"
                            fullWidth
                            value={props.username} 
                            InputProps={{
                                readOnly: true,
                            }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            autoFocus
                            margin="dense"
                            name="username"
                            label="New Username"
                            fullWidth
                            value={username} 
                            onChange={handleChange}
                        />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    Cancel
                </Button>
                <Button onClick={changeUsername} color="primary">
                    Update
                </Button>
            </DialogActions>
        </Dialog>
    );

}

export default UsernameDialog;
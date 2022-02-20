import React, {useState} from 'react'

import UserService from '../../services/UserService';

import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';

function PasswordDialog(props) {

    const {openFl} = props;

    const [currentPassword, setCurrentPassword ] = useState('');
    const [newPassword, setNewPassword ] = useState('');
    const [confirmPassword, setConfirmPassword ] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        const target = e.target;
        if ( target.name === 'currentPassword' ) {
            setCurrentPassword(target.value);
        }
        else if ( target.name === 'newPassword' ) {
            setNewPassword(target.value);
        }
        else {
            setConfirmPassword(target.value);
        }
    }

    function changePassword() {
        // confirm they are populated and match
        if ( currentPassword.trim().length === 0 ) {
            setMessage('Must provide Current Password');
            setShowAlert(true);
            return;
        }

        if ( newPassword.trim().length === 0 ) {
            setMessage('Must provide New Password');
            setShowAlert(true);
            return;
        }

        if ( newPassword !== confirmPassword ) {
            setMessage('Passwords must match');
            setShowAlert(true);
            return;
        }

        UserService.changePassword(props.sessionKey, currentPassword, confirmPassword).then(result => {
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
            <DialogTitle id="alert-dialog-title">Update Password</DialogTitle>
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
                            autoFocus
                            margin="dense"
                            name="currentPassword"
                            label="Current Password"
                            type="password"
                            fullWidth
                            value={currentPassword} 
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            margin="dense"
                            name="newPassword"
                            label="New Password"
                            type="password"
                            fullWidth
                            value={newPassword} 
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            margin="dense"
                            name="confirmPassword"
                            label="Confirm Password"
                            type="password"
                            fullWidth
                            value={confirmPassword} 
                            onChange={handleChange}
                        />
                    </Grid>
                </Grid>

              
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    Cancel
                </Button>
                <Button onClick={changePassword} color="primary">
                    Update
                </Button>
            </DialogActions>
        </Dialog>
    );

}

export default PasswordDialog;
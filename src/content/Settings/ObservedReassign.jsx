import React, { useState } from 'react';

import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';

import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import UserService from '../../services/UserService';

const ObservedReassign = (props) => {
     
    const sessionKey = props.sessionKey;
    const currentObserved = props.currentObserved;
   
    const [email, setEmail] = useState('');
       
  
    const requestReassign = () => {
        props.showLoading(true);
        UserService.sendReassign(sessionKey, currentObserved.id, email).then(saveResult => {
            props.showLoading(false);
            props.displaySnackbar(saveResult.severity, saveResult.message);
            props.closeReassignSection();
        });
    }

    const closeReassignSection = () => {
        props.closeReassignSection();
    }

    const disableSubmit = email.trim() === '';


    return (
                    
        <Grid
            container
            direction="row"
            spacing={3}
            style={{width: '800px'}}
        >
            <Grid item xs={12}>
                <Typography variant="h6">
                    Reassign Observed  
                </Typography>
            </Grid>

            <Grid item xs={12}>
                <TextField 
                    fullWidth={true}
                    value={currentObserved.observedNm} 
                    label="Observed Name" 
                    readOnly={true}
                />
            </Grid>

            <Grid item xs={12}>
                <TextField 
                    fullWidth={true}
                    name="email" 
                    value={email} 
                    label="Observer's Email" 
                    onChange={(e) => setEmail(e.target.value)}
                />
            </Grid>

            <Grid item xs={12}>
                <Grid container item xs={12}>
                    <Grid item xs={6}>
                        <Button 
                            variant="contained" 
                            color="success" 
                            onClick={requestReassign} 
                            disabled={disableSubmit}
                        >
                            Reassign
                        </Button>
                    </Grid>
                    
                    <Grid item xs={6}  style={{textAlign: 'right'}}>
                        <Button 
                            variant="contained" 
                            color="primary" 
                            onClick={closeReassignSection}
                        >
                            Close
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
}

export default ObservedReassign;
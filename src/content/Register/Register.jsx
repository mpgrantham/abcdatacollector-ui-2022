import React, { useState } from 'react';

import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import UserService from '../../services/UserService';

import { PAGE_DASHBOARD, STATUS_SUCCESS } from '../../utils/constants';

const Register = ({showLoading}) => {

    const [alertMessage, setAlertMessage ] = useState('');
    const [alertSeverity, setAlertSeverity] = useState('error');

    const [username, setUsername ] = useState('');
    const [password, setPassword ] = useState('');
    const [confirmPassword, setConfirmPassword ] = useState('');
    const [email, setEmail ] = useState('');
       
    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    }

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    }

    const handleConfirmPasswordChange = (event) => {
        setConfirmPassword(event.target.value);
    }

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    }

    const register = () => {
        if ( password !== confirmPassword ) {
            setAlertMessage('Passwords must match');
            setAlertSeverity('error');
            return;
        }
     
        const data = {
            username: username,
            password: password,
            email: email,
            startPage: PAGE_DASHBOARD
        }

        showLoading(true);

        UserService.register(data).then(result => {
            setAlertMessage(result.message);
            setAlertSeverity(result.status);
            showLoading(false);
        });
    }

    const submitDisabled = username.trim() === '' 
            || password.trim() === '' 
            || confirmPassword.trim() === ''
            || email.trim() === '';

    if ( alertSeverity === STATUS_SUCCESS ) {
        return (
            <Container maxWidth="sm" style={{marginTop: '100px'}}>
                <Card variant="outlined">
                    <CardContent >
                        <Typography gutterBottom variant="h5" component="h2" style={{marginBottom: '24px'}}>
                            Register
                        </Typography>

                        <Grid
                            container
                            direction="column"
                            justify="center"
                            alignItems="stretch"
                            spacing={3}
                        >
                            <Grid item>
                                <Alert severity={alertSeverity}>{alertMessage}</Alert>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </Container>
        );
    }

    return (
        <Container maxWidth="sm" style={{marginTop: '100px'}}>
            <Card variant="outlined" >

                <CardContent >
                    <Typography gutterBottom variant="h5" component="h2" style={{marginBottom: '24px'}}>
                        Register
                    </Typography>

                    <form noValidate autoComplete="off">

                        <Grid
                            container
                            direction="column"
                            justify="center"
                            alignItems="stretch"
                            spacing={3}
                        >
                            {alertMessage !== '' &&
                            <Grid item>
                                <Alert severity="error">{alertMessage}</Alert>
                            </Grid>
                            }

                            <Grid item>
                                <TextField 
                                    autoFocus
                                    fullWidth={true}
                                    name="username" 
                                    value={username} 
                                    label="Username" 
                                    onChange={handleUsernameChange}
                                />
                            </Grid>

                            <Grid item>
                                <TextField 
                                    fullWidth={true}
                                    name="password" 
                                    value={password} 
                                    label="Password" 
                                    type="password" 
                                    onChange={handlePasswordChange}
                                />
                            </Grid>

                            <Grid item>
                                <TextField 
                                    fullWidth={true}
                                    name="confirmPassword" 
                                    value={confirmPassword} 
                                    label="Confirm Password" 
                                    type="password" 
                                    onChange={handleConfirmPasswordChange}
                                />
                            </Grid>

                            <Grid item>
                                <TextField 
                                    fullWidth={true}
                                    name="email" 
                                    value={email} 
                                    label="Email" 
                                    onChange={handleEmailChange}
                                />
                            </Grid>
                           
                            <Grid item xs={3} md={3} style={{textAlign: 'center'}}>
                                <Button 
                                    variant="contained" 
                                    color="primary" 
                                    onClick={register}
                                    disabled={submitDisabled}
                                >
                                    Register
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </CardContent>
            </Card>
        </Container>
    );
}

export default Register;
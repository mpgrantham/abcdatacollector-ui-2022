import React, {useState, useEffect} from 'react';
import { Link, useParams } from 'react-router-dom';

import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import UserService from '../../services/UserService';
import { useFormFields  } from '../../hooks/useFormFields';

function Reset() {

    const [alertMessage, setAlertMessage ] = useState('');
    const [alertSeverity, setAlertSeverity] = useState('error');
    
    const [fields, setFormField] = useFormFields({confirmPassword: '', password: ''});
   
    const { key } = useParams();

    useEffect(() => {
        UserService.checkResetKey(key).then(result => {
            setAlertMessage(result.message);
            setAlertSeverity(result.severity);
        });
    }, [key]);

    const submitDisabled =  alertSeverity === 'error' 
                || fields.confirmPassword.trim() === '' 
                || fields.password.trim() === '' 
                || fields.confirmPassword.trim() !== fields.password.trim();

    const resetPassword = () => {

        if ( submitDisabled ) {
            return;
        }
        
        UserService.resetPassword(key, fields.password).then(result => {
            setAlertMessage(result.message);
            setAlertSeverity(result.severity);
        });
    }
     
    return (

        <Container maxWidth="sm" style={{marginTop: '100px'}}>

        <Card variant="outlined">

            <CardContent >
                <Typography gutterBottom variant="h5" component="h2" style={{marginBottom: '24px'}}>
                    Reset Password
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
                            <Alert severity={alertSeverity}>{alertMessage}</Alert>
                        </Grid>
                        }

                        {alertSeverity !== 'success' &&
                        <React.Fragment>
                            <Grid item>
                                <TextField 
                                    fullWidth={true}
                                    name="password" 
                                    value={fields.password} 
                                    label="Password" 
                                    type="password" 
                                    onChange={setFormField}
                                    disabled={alertSeverity === 'error'}
                                />
                            </Grid>

                            <Grid item>
                                <TextField 
                                    fullWidth={true}
                                    name="confirmPassword" 
                                    value={fields.confirmPassword} 
                                    label="Confirm Password" 
                                    type="password" 
                                    onChange={setFormField}
                                    disabled={alertSeverity === 'error'}
                                />
                            </Grid>

                            <Grid item>
                                <Button 
                                    variant="contained" 
                                    color="primary" 
                                    fullWidth={true} 
                                    onClick={resetPassword}
                                    disabled={submitDisabled}
                                >
                                    Reset
                                </Button>
                            </Grid>
                        </React.Fragment>
                        }

                        {alertSeverity === 'success' &&
                        <Grid item>
                            <Button color="primary" component={Link} to={"/signin"}>
                                Proceed to Sign In
                            </Button>
                        </Grid>
                        }
 
                    </Grid>
                </form>

            </CardContent>
           
        </Card>

        </Container>
    )

}

export default Reset;
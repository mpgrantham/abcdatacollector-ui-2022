import React, {useState, useEffect} from 'react';
import { Link, useParams } from 'react-router-dom';

import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import UserService from '../../services/UserService';

function ConfirmRegister() {

    const [alertMessage, setAlertMessage ] = useState('');
    const [alertSeverity, setAlertSeverity] = useState('error');
         
    const { key } = useParams();

    useEffect(() => {
        UserService.checkRegisterKey(key).then(result => {
            setAlertMessage(result.message);
            setAlertSeverity(result.severity);
        });
    }, [key]);


    const confirm = () => {
        UserService.confirmRegistration(key).then(result => {
            setAlertMessage(result.message);
            setAlertSeverity(result.severity);
        });
    }
     
    return (

        <Container maxWidth="sm" style={{marginTop: '100px'}}>

        <Card variant="outlined">

            <CardContent >
                <Typography gutterBottom variant="h5" style={{marginBottom: '24px'}}>
                    Confirm Registration
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
                                <Button 
                                    variant="contained" 
                                    color="primary" 
                                    fullWidth={true} 
                                    onClick={confirm}
                                >
                                    Confirm
                                </Button>
                            </Grid>
                        </React.Fragment>
                        }

                        {alertSeverity === 'success' &&
                        <React.Fragment>
                            <Grid item>
                                <Typography variant="subtitle1">
                                    After signing in, you can add an Observed by navigating to the Settings page and clicking 'Add' in the Observed section.
                                </Typography>
                            </Grid>
                            <Grid item>
                                <Button color="primary" component={Link} to={"/signin"}>
                                    Proceed to Sign In
                                </Button>
                            </Grid>
                        </React.Fragment>
                        }
 
                    </Grid>
                </form>

            </CardContent>
           
        </Card>

        </Container>
    )

}

export default ConfirmRegister;
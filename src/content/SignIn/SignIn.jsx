import React, {useState, useEffect} from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';

import { Alert, Button, 
    Card, CardActions, CardContent, 
    Checkbox, Container, FormControlLabel, Grid, 
    TextField, Typography 
} from '@mui/material';

import UserService from '../../services/UserService';
import { setSession } from '../../actions/userActions';
import { setDisabledObserved } from '../../actions/observedActions';
import { useFormFields  } from '../../hooks/useFormFields';

import { COOKIE_SIGNED_IN_KEY, SESSION_TOKEN } from '../../utils/constants';

function SignIn({showLoading}) {

    const [alertMessage, setAlertMessage ] = useState('');
    const [alertSeverity, setAlertSeverity] = useState('error');
    
    const [fields, setFormField] = useFormFields({username: '', password: ''});
    const [displayForgotSection, setDisplayForgotSection] = useState(false);
    const [forgotType, setForgotType] = useState('');
    const [forgotEmail, setForgotEmail] = useState('');
    const [staySignedIn, setStaySignedIn] = useState(false);

    const [forgotMessage, setForgotMessage] = useState('');

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { state } = useLocation();
   
    useEffect(() => {
        // Reset session in case secured route directed here.
        // This ensures header is reset
        dispatch(setSession({
            username: '',
            sessionKey:  '',
            id: 0,
            email: '',
            startPage: ''
        }));
        sessionStorage.removeItem(SESSION_TOKEN);
    }, [dispatch]);

    const showForgotSection = (type) => {

        const message = 'Provide the Email associated with the User. The ' + (type === 'PASSWORD' ? 'Password Reset Link' : 'Username') + ' will be sent to you.';

        setForgotMessage(message);
        setForgotType(type);
        setForgotEmail('');
        setDisplayForgotSection(true);
    }

    const submitDisabled = fields.username.trim() === '' || fields.password.trim() === '';

    const signIn = () => {

        if ( submitDisabled ) {
            return;
        }
        
        UserService.signIn(fields.username, fields.password, staySignedIn).then(result => {

            if ( result.status === 'SUCCESS' ) {
                dispatch(setSession(result));
                dispatch(setDisabledObserved(false));
                 
                const expireMillis = Number(process.env.REACT_APP_EXPIRE_MILLIS);
                
                // Use the browser's time so it is not affected by time zone
                let sessionToken = result.sessionKey + ':' + (new Date().getTime() + expireMillis);

                sessionStorage.setItem(SESSION_TOKEN, sessionToken);

                if ( result.staySignedInKey ) {
                    const expires = new Date(Date.now() + 60 * 864e5).toUTCString();
                    document.cookie =
                        COOKIE_SIGNED_IN_KEY +
                        "=" +
                        encodeURIComponent(result.staySignedInKey) +
                        "; expires=" +
                        expires +
                        "; sameSite=Lax; path=/";
                }
                else {
                    document.cookie = COOKIE_SIGNED_IN_KEY + "=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
                }               

                // If signin forced from expiration, redirect to page user was attempting to navigate to
                if ( state?.from ) {
                    navigate(state?.from.pathname);
                }
                else if ( result.startPage === 'ENTRY' ) {
                    navigate("/entry");
                }
                else {
                    navigate("/dashboard");
                }
            }
            else {
                setAlertMessage(result.message);
                setAlertSeverity('error');
            }
   
        });
    }

    const sendForgot = () => {
        showLoading(true);

        UserService.sendForgot(forgotEmail, forgotType).then(result => {
            setAlertMessage(result.message);
            setAlertSeverity(result.severity);
            showLoading(false);
        });
    }

    const handleStaySignedInChange = (event) => {
        setStaySignedIn(event.target.checked);
    }
    
    return (

        <Container maxWidth="sm" style={{marginTop: '100px'}}>

        <Card variant="outlined">

            <CardContent >
                <Typography gutterBottom variant="h5" component="h2" style={{marginBottom: '24px'}}>
                    Sign In
                </Typography>

                <form noValidate autoComplete="off">

                    <Grid
                        container
                        direction="column"
                        justifyContent="center"
                        spacing={3}
                    >
                        {alertMessage !== '' &&
                        <Grid item>
                            <Alert severity={alertSeverity}>{alertMessage}</Alert>
                        </Grid>
                        }

                        <Grid item xs={12} md={12}>
                            <TextField 
                                autoFocus
                                fullWidth={true}
                                name="username" 
                                value={fields.username} 
                                label="Username" 
                                onChange={setFormField}
                            />
                        </Grid>

                        <Grid item xs={12} md={12}>
                            <TextField 
                                fullWidth={true}
                                name="password" 
                                value={fields.password} 
                                label="Password" 
                                type="password" 
                                onChange={setFormField}
                            />
                        </Grid>

                        <Grid item xs={12} md={12}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={staySignedIn}
                                        onChange={handleStaySignedInChange}
                                        name="staySignedIn"
                                        color="primary"
                                    />
                                }
                                label="Stay signed in"
                            />
                        </Grid>

                        <Grid item xs={3} md={3} style={{textAlign: 'center'}}>
                            <Button 
                                variant="contained" 
                                color="primary" 
                                disabled={submitDisabled}
                                onClick={signIn}
                            >
                                Sign In
                            </Button>
                        </Grid>
 
                    </Grid>
                </form>

            </CardContent>
           
            <CardActions>
                <Grid
                    container
                    spacing={3}
                >
                    <Grid item  xs={6}>
                        <Button color="primary" onClick={(e) => showForgotSection('PASSWORD')}>
                            Forgot Password
                        </Button>
                        <Button color="primary" onClick={(e) => showForgotSection('USERNAME')}>
                            Forgot Username
                        </Button>
                    </Grid>
                    <Grid item xs={6} style={{textAlign: 'right'}}>
                        <Button color="primary" component={Link} to={"/register"}>
                            Register
                        </Button>
                    </Grid>
                </Grid>
            </CardActions>

        </Card>

        {displayForgotSection &&
        <Card variant="outlined" style={{marginTop: '25px'}}>
            <CardContent >
                <Typography gutterBottom variant="subtitle1" style={{marginBottom: '24px'}}>
                    {forgotMessage}
                </Typography>

                <Grid
                    container
                    direction="column"
                    justify="center"
                    alignItems="stretch"
                    spacing={3}
                >
                    <Grid item>
                        <TextField 
                            autoFocus
                            fullWidth={true}
                            name="forgotEmail" 
                            value={forgotEmail} 
                            label="Email" 
                            onChange={(e) => setForgotEmail(e.target.value)}
                        />
                    </Grid>

                    <Grid item>
                        <Grid container xs={12}>
                            <Grid item xs={6} >
                                <Button 
                                    variant="contained" 
                                    color="primary"
                                    onClick={sendForgot} 
                                    disabled={forgotEmail.trim() === ''}
                                >
                                    Send
                                </Button>
                            </Grid>

                            <Grid item xs={6} style={{textAlign: 'right'}}>
                                <Button 
                                    variant="contained" 
                                    color="secondary" 
                                    onClick={(e) => setDisplayForgotSection(false)}
                                >
                                    Cancel
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
        }

        </Container>
    )

}

export default SignIn;
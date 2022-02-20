import React, {useEffect, useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import EditIcon from '@mui/icons-material/Edit';

import { PageBreadcrumbs } from '../../components/breadcrumbs';
import { SaveButton } from '../../components/button';

import SnackbarAlert from '../../components/SnackbarAlert';

import DeleteDialog from '../../components/DeleteDialog';
import PasswordDialog from './PasswordDialog';
import UsernameDialog from './UsernameDialog';

import UserService from '../../services/UserService';

import { useMessage  } from '../../hooks/useMessage';

import ObservedSettings from './ObservedSettings';

import { setSession } from '../../actions/userActions';
import { setDisabledObserved, setObserved, setObservedList } from '../../actions/observedActions';

import { SESSION_TOKEN } from '../../utils/constants';

function Settings({showLoading}) {

    const navigate = useNavigate();

    const globalState = useSelector(state => state);
    const dispatch = useDispatch();

    const sessionKey = globalState.userReducer.sessionKey;
    const observedList = globalState.observedReducer.observedList;

    const startPages = ['DASHBOARD', 'ENTRY'];

    const [email, setEmail ] = useState(globalState.userReducer.email);
    const [startPage, setStartPage] = useState(globalState.userReducer.startPage);
    const [openPassword, setOpenPassword] = useState(false);
    const [openUsername, setOpenUsername] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);

    const [snackbar, setSnackbar] = useMessage();
    const [alert, setAlert] = useMessage();

    useEffect(() => {
        dispatch({
            type: 'SET_DISABLE_OBSERVED',
            disableObserved: true
        });
    }, [dispatch]);

    const displayStartPages = () => {
        return startPages.map((r) => {
            const key = 'page_' + r;
            return (
                <FormControlLabel key={key} value={r} control={<Radio />} label={r} />
            );
        });
    }

    const handleChange = (e) => {
        const target = e.target;
        if ( target.name === 'email' ) {
            setEmail(target.value);
        }
    }

    const handleStartPageChange = (event) => {
        setStartPage(event.target.value);
    }

    const handleSave = () => {
        if ( email.trim().length === 0 ) {
            setAlert(true, 'Must provide Email');
            return;
        }

        UserService.saveSettings(sessionKey, email, startPage).then(result => {
            
            setSnackbar(true, result.message, result.severity);
            
            if ( result.severity === 'success' ) {
                dispatch({
                    type: 'SET_SETTINGS',
                    email: email,
                    startPage: startPage
                });
            }
        });
    }

    const openChangePassword = () => {
        setOpenPassword(true);
    }

    const closeChangePassword = (changed, result) => {

        setOpenPassword(false);

        if ( result ) {
            setSnackbar(true, result.message, result.severity);
        }
    }

    const openChangeUsername = () => {
        setOpenUsername(true);
    }

    const closeChangeUsername = (changed, result) => {

        setOpenUsername(false);

        if ( result ) {
            displaySnackbar(result.severity, result.message);
           
            if ( result.severity === 'success' ) {
                dispatch({
                    type: 'SET_USER_NAME',
                    user: result.username
                });
            }
        }
    }

    const showRemoveMe = () => {
        setOpenDelete(true);
    }

    const closeDelete = (deleteFl) => {

        setOpenDelete(false);

        if ( deleteFl ) {
            UserService.removeMe(sessionKey).then(saveResult => {
                displaySnackbar(saveResult.severity, saveResult.message);

                if ( saveResult.severity === 'success' ) {

                    dispatch(setSession({
                        username: '',
                        sessionKey:  '',
                        id: 0,
                        email: '',
                        startPage: ''
                    }));
        
                    dispatch(setDisabledObserved(false));
                    dispatch(setObserved({id: 0}));
                    dispatch(setObservedList([]));
        
                    sessionStorage.removeItem(SESSION_TOKEN);
        
                    navigate("/");
                }
            });
        }
    }

    const displaySnackbar = (severity, snackbarMessage) => {
        setSnackbar(true, snackbarMessage, severity);
    }

    const closeSnackbar = () => {
        setSnackbar(false, '', 'success');
    }

    const adminList = observedList.filter(o => { return o.role === 'ADMIN' });
   
    return (
        <div className="content-container">

            <Grid
                container
                direction="row"
            >
                <Grid item xs={9} md={10}>
                    <PageBreadcrumbs page="Settings" displayName={globalState.userReducer.userName}/>
                </Grid>
            </Grid>

            {alert.displayFlag &&
                <Alert severity="error" style={{marginTop: '15px'}}>{alert.message}</Alert>
            }

            <Card style={{marginTop: '15px'}} variant="outlined">
                <CardHeader title="Profile"></CardHeader>
                <CardContent style={{paddingTop: '0'}}>
                    <Grid  
                        container
                        spacing={3}
                    >
                        <Grid item xs={12}>
                            <FormControl className="settings-control">
                                <FormLabel>Email</FormLabel>
                                <TextField 
                                    fullWidth={true}
                                    name="email" 
                                    value={email} 
                                    onChange={handleChange}
                                />
                            </FormControl>
                        </Grid>

                        <Grid item xs={12}>
                            <FormControl fullWidth={true}>
                                <FormLabel>Start Page</FormLabel>
                                
                                <RadioGroup aria-label="start" row name="start" value={startPage} onChange={handleStartPageChange}>
                                    {displayStartPages()}
                                </RadioGroup>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12}>
                            <SaveButton 
                                onClick={handleSave} 
                            />
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            <Card style={{marginTop: '15px'}} variant="outlined">
                <CardHeader title="Security"></CardHeader>
                <CardContent style={{paddingTop: '0'}}>
                    <Grid  
                        container
                        spacing={3}
                    >
                        <Grid item xs={12}>
                            <Button 
                                variant="contained" 
                                color="primary" 
                                startIcon={<EditIcon/>}
                                onClick={openChangeUsername}
                            >
                                Change Username
                            </Button>
                        </Grid>

                        <Grid item xs={12}>
                            <Button 
                                variant="contained" 
                                color="primary" 
                                startIcon={<EditIcon/>}
                                onClick={openChangePassword}
                            >
                                Change Password
                            </Button>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            <Card style={{marginTop: '15px'}} variant="outlined">
                <CardHeader title="Observed"></CardHeader>
                <CardContent style={{paddingTop: '0'}}>
                    <ObservedSettings
                        sessionKey={sessionKey}
                        displaySnackbar={displaySnackbar}
                        showLoading={showLoading}
                    />
                </CardContent>
            </Card>

            <Card style={{marginTop: '15px'}} variant="outlined">
                <CardHeader title="Remove Me"></CardHeader>
                <CardContent style={{paddingTop: '0'}}>
                    <Grid  
                        container
                        spacing={3}
                    >
                        <Grid item xs={12}>
                            <Typography variant="subtitle1">
                                Click the 'Remove Me' button to remove yourself from ABC Data Collector.  If you are an ADMIN for any Observed, you must first Reassign or Remove them (see the Observed section above).
                            </Typography>

                            <Typography variant="subtitle1">
                                <b>Note:</b> Removing an Observed wipes out all data collected for that Observed. If you want to save the data collected for an Observed, you should first export that data.  
                                To export, navigate to Dashboard, then click 'SEE ALL INCIDENTS' in the Recent Incidents section. You can export the data from there.
                            </Typography>

                        </Grid>

                        <Grid item xs={12}>
                            <Button 
                                variant="contained" 
                                color="primary" 
                                onClick={showRemoveMe}
                                disabled={adminList.length > 0}
                            >
                                Remove Me
                            </Button>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
            
            {openUsername && 
                <UsernameDialog
                    openFl={openUsername}
                    username={globalState.userReducer.userName}
                    sessionKey={sessionKey}
                    handleClose={closeChangeUsername}
                />
            }

            {openPassword && 
                <PasswordDialog
                    openFl={openPassword}
                    sessionKey={sessionKey}
                    handleClose={closeChangePassword}
                />
            }

            {openDelete && 
                <DeleteDialog
                    title="Remove Me"
                    text="Click 'Remove' to remove yourself from ABC Data Collector."
                    openFl={openDelete}
                    handleClose={closeDelete}
                    deleteLabel="Remove"
                />
            }

            <SnackbarAlert 
                openFlag={snackbar.displayFlag}
                onClose={closeSnackbar} 
                severity={snackbar.severity}
                message={snackbar.message}
            />

        </div>
    )

}

export default Settings;
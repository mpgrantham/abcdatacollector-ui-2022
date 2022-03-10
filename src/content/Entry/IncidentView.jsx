import React, { useEffect, useState, useReducer }  from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link as RouterLink } from "react-router-dom";

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormLabel from '@mui/material/FormLabel';
import Grid from '@mui/material/Grid';

import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

import { PageBreadcrumbs } from '../../components/breadcrumbs';

import IncidentService from '../../services/IncidentService';
import ObservedService from '../../services/ObservedService';
import DeleteDialog from '../../components/DeleteDialog';
import SnackbarAlert from '../../components/SnackbarAlert';
import { setDisabledObserved } from '../../actions/observedActions';

import { setIncident, setEditDisabled, setSnackbar } from '../../actions/viewActions';
import { viewReducer, INITIAL_VIEW_STATE } from '../../reducers/viewReducer';

const LabelValue = ({label, value}) => {
    return (
        <React.Fragment>
            <Grid item xs={12}>
                <FormLabel>{label}</FormLabel>
            </Grid>
            <Grid item xs={12} style={{paddingTop: '0'}}>
                {value}
            </Grid>
        </React.Fragment>
    );
}

function IncidentView({showLoading}) {
  
    const globalState = useSelector(state => state);
    const dispatch = useDispatch();
    
    const sessionKey = globalState.userReducer.sessionKey;
    const observedId = globalState.observedReducer.observedId;
    const observed =  globalState.observedReducer.observedList.find(o => { return o.id === observedId})

    const { id } = useParams();
    
    const [openDelete, setOpenDelete] = useState(false);

    const [viewState, viewDispatch] = useReducer(viewReducer, INITIAL_VIEW_STATE);
    
    useEffect(() => {
        showLoading(true);
        dispatch(setDisabledObserved(true));
       
        if ( sessionKey !== '' && observedId > 0 ) {

            ObservedService.getIncident(sessionKey, observedId, id).then(result => {
                viewDispatch(setIncident(result));
                showLoading(false);
            });
        }

    }, [sessionKey, observedId, id, dispatch, showLoading]);

    const confirmDelete = () => {
        setOpenDelete(true);
    }

    const closeDelete = (deleteFl) => {
        setOpenDelete(false);

        if ( deleteFl ) {
            IncidentService.deleteIncident(sessionKey, observedId, id).then(result => {
                viewDispatch(setSnackbar(true, result.severity, result.message));
                
                if ( result.severity === 'success') {
                    viewDispatch(setEditDisabled(true));
                }

            });
        }
    }

    const closeSnackbar = () => {
        viewDispatch(setSnackbar(false, 'success', ''));
    }

    const editLink = "/entry/" + id;
     
    return (
        
        <div className="content-container incident-entry-div">

            <Box sx={{ mb: 1, pt: 1, display: 'flex', flexDirection: { xs: 'column' }, flexGrow: 1, borderBottom: 1, borderColor: '#dddddd' }}>
                <Box sx={{ flexGrow: 1, pb: 1 }}>
                    <PageBreadcrumbs page="Incident View"/>
                </Box>

                <Box sx={{ mb: 1, pt: 1, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, flexGrow: 1, justifyContent: 'space-between' }}>
                    <Box sx={{ flexGrow: 1, pb: 1 }}>
                        <Button 
                            variant="contained" 
                            color="primary" 
                            startIcon={<EditIcon/>}
                            component={RouterLink} 
                            to={editLink}
                            style={{marginRight: '25px'}}
                            disabled={viewState.editDisabled}
                        >
                            Edit
                        </Button>

                        {observed.adminRole &&
                            <Button 
                                            variant="contained" 
                                            color="primary" 
                                            startIcon={<DeleteIcon/>}
                                            onClick={confirmDelete}
                                            style={{marginRight: '25px'}}
                                            disabled={viewState.editDisabled}
                            >
                                Delete
                            </Button>
                        }
                    </Box>
                </Box>
            </Box>
         
            {viewState.incident.id &&
            <Grid  
                container
                spacing={3}
                sx={{ pt: 1 }}
            >
                <LabelValue label="Incident Date/Time" value={viewState.incident.incidentDtStr}/>

                <LabelValue label="Antecedents" value={viewState.incident.antecedentStr}/>

                <LabelValue label="Behaviors" value={viewState.incident.behaviorStr}/>

                <LabelValue label="Consequences" value={viewState.incident.consequenceStr}/>

                <LabelValue label="Location" value={viewState.incident.location}/>

                <LabelValue label="Intensity" value={viewState.incident.intensity}/>

                <LabelValue label="Duration" value={viewState.incident.durationStr}/>

                <LabelValue label="Description" value={viewState.incident.description}/>
            </Grid>
            }

            {openDelete && 
                <DeleteDialog
                    title="Delete Incident"
                    text="Click 'Delete' to delete the Incident."
                    openFl={openDelete}
                    handleClose={closeDelete}
                />
            }

            <SnackbarAlert 
                openFlag={viewState.snackbarFl}
                onClose={closeSnackbar} 
                severity={viewState.snackbarMessageSeverity}
                message={viewState.snackbarMessage}
            />
         
        </div>
    );
}

export default IncidentView;
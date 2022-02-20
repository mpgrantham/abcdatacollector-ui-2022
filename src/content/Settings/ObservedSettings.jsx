import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';

import ObservedService from '../../services/ObservedService';
import UserService from '../../services/UserService';

import GrantAccess from './GrantAccess';
import ObservedAttributes from './ObservedAttributes';
import ObservedReassign from './ObservedReassign';
import RemoveAccess from './RemoveAccess';
import DeleteDialog from '../../components/DeleteDialog';

import { getObserved, setObserved, setObservedList } from '../../actions/observedActions';

const ROLE_ADMIN = 'ADMIN';

const EMPTY_OBSERVED = {
    id: 0,
    observedNm: '',
    relationshipId: 0,
    role: ROLE_ADMIN
}

function ObservedSettings(props) {
   
    const globalState = useSelector(state => state);
    const observedList = globalState.observedReducer.observedList;
    const userId = globalState.userReducer.id;

    const dispatch = useDispatch();
   
    const sessionKey = props.sessionKey;

    const [displayObservedSection, setDisplayObservedSection] = useState(false);
    const [displayAccessSection, setDisplayAccessSection] = useState(false);
    const [displayReassignSection, setDisplayReassignSection] = useState(false);
    const [removeAccessFlag, setRemoveAccessFlag] = useState(false);
    
    const [relationships, setRelationships] = useState([]);
    
    const [disableEdit, setDisableEdit] = useState(true);
    const [selectedObservedId, setSelectedObservedId] = useState(0);
    const [currentObserved, setCurrentObserved] = useState(EMPTY_OBSERVED); 
    const [backupObserved, setBackupObserved] = useState(EMPTY_OBSERVED); 
    const [enableAdmin, setEnableAdmin] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [openAccessDelete, setOpenAccessDelete] = useState(false);

    useEffect(() => {
        UserService.getRelationships().then(result => {
            setRelationships(result);
        });
    }, []);

    const addObserved = () => {
        setBackupObserved(currentObserved);
        
        setDisableEdit(true);
        setCurrentObserved(EMPTY_OBSERVED);

        setDisplayObservedSection(true);
    }

    const editObserved = () => {
        setDisplayObservedSection(true);
    }

    const closeObservedSection = () => {
        let selectedObserved  = observedList.find(o => { return o.id === selectedObservedId });

        setDisableEdit(selectedObserved ? selectedObserved.role !== ROLE_ADMIN : true);
        setDisplayObservedSection(false);

        if ( selectedObservedId > 0 && backupObserved.id > 0 ) {
            setCurrentObserved(backupObserved);
        }
    }

    const observedSelected = (event) => {
        const id = parseInt(event.target.value, 10);
        setSelectedObservedId(id);
        
        let selectedObserved  = observedList.find(o => { return o.id === id });
        setDisableEdit(selectedObserved.role !== ROLE_ADMIN);
        setEnableAdmin(selectedObserved.role === ROLE_ADMIN);
      
        ObservedService.getObserved(sessionKey, id).then(observedResult => {
            setCurrentObserved(observedResult);
        });
    }

    const resetObserved = () => {
        ObservedService.getObserved(sessionKey, selectedObservedId).then(observedResult => {
            setCurrentObserved(observedResult);

            if ( globalState.observedReducer.observedId === selectedObservedId ) {
                dispatch(setObserved(observedResult));
            }
        });
    }

    const grantAccess = () => {
        setRemoveAccessFlag(false);
        setDisplayAccessSection(true);
    }
 
    const removeAccess = () => {
        // if current role is ADMIN can take another users access away
        // if not ADMIN then removing own access to this observed

        let selectedObserved  = observedList.find(o => { return o.id === selectedObservedId });
        
        if ( selectedObserved.role === ROLE_ADMIN ) {
            setRemoveAccessFlag(true);
            setDisplayAccessSection(true);
        }
        else {
            setOpenAccessDelete(true);
        }
    }

    const closeAccessSection = () => {
        setDisplayAccessSection(false);
    }
    
    const reassignObserved = () => {
        setDisplayReassignSection(true);
    }

    const closeReassignSection = () => {
        setDisplayReassignSection(false);
    }

    const confirmDelete = () => {
        setOpenDelete(true);
    }

    const updateObservedList = (observedResult) => {
        props.displaySnackbar(observedResult.severity, observedResult.message);

        UserService.getUserObserved(sessionKey).then(userResult => {

            dispatch(setObservedList(userResult));

            const globalObservedId = globalState.observedReducer.observedId;
           
            const globalObserved = userResult.find(r => { return r.id === globalObservedId });

            if ( ! globalObserved ) {
                let observedId = 0;
               
                if( userResult.length > 0 ) {
                    observedId = userResult[0].id;
                } 

                getObserved(dispatch, sessionKey, observedId);
            }
        });
    }

    const closeDelete = (deleteFl) => {
        setOpenDelete(false);

        if ( deleteFl ) {
            ObservedService.deleteObserved(sessionKey, selectedObservedId).then(observedResult => updateObservedList(observedResult));
        }
    }

    const closeAccessDelete = (deleteFl) => {
        setOpenAccessDelete(false);

        if ( deleteFl ) {
             UserService.removeAccess(sessionKey, selectedObservedId, userId).then(observedResult => updateObservedList(observedResult));
        }
    }

    if ( displayObservedSection ) {
        return (
            <ObservedAttributes
                sessionKey={sessionKey}
                relationships={relationships}
                currentObserved={currentObserved}
                resetObserved={resetObserved}
                closeObservedSection={closeObservedSection}
                displaySnackbar={props.displaySnackbar}
              />
        );
    }

    if ( displayAccessSection ) {
        
        return  removeAccessFlag 
            ?   <RemoveAccess
                    sessionKey={sessionKey}
                    currentObserved={currentObserved}
                    closeAccessSection={closeAccessSection}
                    displaySnackbar={props.displaySnackbar}
                />
            
            :   <GrantAccess
                    sessionKey={sessionKey}
                    relationships={relationships}
                    currentObserved={currentObserved}
                    closeAccessSection={closeAccessSection}
                    displaySnackbar={props.displaySnackbar}
                    showLoading={props.showLoading}
                />
            ;
    }

    if ( displayReassignSection ) {
        return (
            <ObservedReassign
                sessionKey={sessionKey}
                currentObserved={currentObserved}
                closeReassignSection={closeReassignSection}
                displaySnackbar={props.displaySnackbar}
                showLoading={props.showLoading}
            />
        );
    }

    return (
        
        <Grid
            container
            direction="row"
        >
            <Grid item xs={12}>
                <Button 
                        variant="contained" 
                        color="primary" 
                        startIcon={<AddIcon/>}
                        onClick={addObserved}
                        style={{marginRight: '25px'}}
                    >
                        Add
                </Button>

                <Button 
                        variant="contained" 
                        color="primary" 
                        startIcon={<EditIcon/>}
                        onClick={editObserved}
                        style={{marginRight: '25px'}}
                        disabled={disableEdit}
                    >
                        Edit
                </Button>

                <Button 
                        variant="contained" 
                        color="primary" 
                        onClick={confirmDelete}
                        style={{marginRight: '35px'}}
                        disabled={!enableAdmin}
                    >
                        Remove
                </Button>

                <Button 
                        variant="contained" 
                        color="primary" 
                        onClick={grantAccess}
                        style={{marginRight: '25px'}}
                        disabled={!enableAdmin}
                    >
                        Grant Access
                </Button>

                <Button 
                        variant="contained" 
                        color="primary" 
                        onClick={removeAccess}
                        style={{marginRight: '35px'}}
                        disabled={selectedObservedId === 0}
                    >
                        Remove Access
                </Button>

                <Button 
                        variant="contained" 
                        color="primary" 
                        onClick={reassignObserved}
                        style={{marginRight: '25px'}}
                        disabled={!enableAdmin}
                    >
                        Reassign
                </Button>

               
            </Grid>

            <Grid item xs={12}>
                <RadioGroup onChange={observedSelected} value={selectedObservedId}>
                <TableContainer style={{width: '800px'}}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell style={{width: '30px'}}></TableCell>
                                <TableCell>Observed Name</TableCell>
                                <TableCell>Role</TableCell>
                                <TableCell>Relationship</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                    
                        {observedList.map((row, index) => (
                            <TableRow key={row.observedNm}>
                                <TableCell scope="row">
                                    <Radio key={'radio_' + row.id} value={row.id}/>
                                </TableCell>
                                <TableCell>{row.observedNm}</TableCell>
                                <TableCell>{row.role}</TableCell>
                                <TableCell>{row.relationship}</TableCell>
                            </TableRow>
                        ))}

                        {observedList.length === 0 &&
                        <TableRow>
                            <TableCell colSpan={4} align="center">No Observed assigned</TableCell>
                        </TableRow>
                        }

                        </TableBody>
                    </Table>
                </TableContainer>

                </RadioGroup>
            </Grid>


            {openDelete && 
                <DeleteDialog
                    title="Remove Observed"
                    text="Click 'Remove' to remove the observed and all associated data."
                    openFl={openDelete}
                    handleClose={closeDelete}
                    deleteLabel="Remove"
                />
            }

            {openAccessDelete && 
                <DeleteDialog
                    title="Remove Observed Access"
                    text="Click 'Remove' to remove access to observed."
                    openFl={openAccessDelete}
                    handleClose={closeAccessDelete}
                    deleteLabel="Remove Access"
                />
            }
         
        </Grid>
    );
}

export default ObservedSettings;
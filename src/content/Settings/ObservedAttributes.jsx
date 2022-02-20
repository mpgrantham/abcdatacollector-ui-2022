import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Button from '@mui/material/Button';
import { Checkbox, FormControl, FormControlLabel, FormLabel } from '@mui/material';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';

import Select from '@mui/material/Select';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';

import { SaveButton } from '../../components/button';

import DeleteDialog from '../../components/DeleteDialog';

import ObservedService from '../../services/ObservedService';
import UserService from '../../services/UserService';

import { getObserved, setObservedList } from '../../actions/observedActions';

const valueTypes = ['Antecedent', 'Behavior', 'Consequence', 'Location'];


function ObservedAttributes(props) {

    const dispatch = useDispatch();

    const globalState = useSelector(state => state);
   
    const observedId = globalState.observedReducer.observedId;
    
    const sessionKey = props.sessionKey;
    const currentObserved = props.currentObserved;
    const relationships = props.relationships;

    const isEdit = currentObserved.id > 0;
       
    const [selectedTab, setSelectedTab] = useState(0);
    const [disableAdd, setDisableAdd] = useState(false);
    
    const [observedName, setObservedName ] = useState(currentObserved.observedNm ? currentObserved.observedNm : '');
    const [relationshipId, setRelationshipId] = useState(currentObserved.relationshipId ? currentObserved.relationshipId : 0);

    const [currentAbc, setCurrentAbc] = useState({valueId: 0, typeCd: 'A'});
    const [abcValue, setAbcValue] = useState('');
    const [displayAbcValue, setDisplayAbcValue] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    
    const displayRelationships = () => {
        return relationships.map((r) => {
            const key = 'relationship_' + r.id;
            return (
                <MenuItem key={key} value={r.id}>{r.name}</MenuItem>
            );
        });
    }

    const handleObservedNameChange = (event) => {
        let value = event.target.value;
        setObservedName(value);
    }

    const handleRelationshipChange = (event) => {
        setRelationshipId(parseInt(event.target.value, 10));
    }
    
    const handleTabChange = (event, newValue) => {
        setSelectedTab(newValue);
        setAbcValue('');
        setDisplayAbcValue(false);
    }

    const addAttribute = () => {
        setCurrentAbc({valueId: 0, typeCd: valueTypes[selectedTab].charAt(0)});
        setAbcValue('');
        setDisplayAbcValue(true);
    }

    const editAttribute = () => {
        let value;
        if ( currentAbc.typeCd === 'A' ) {
            value = currentObserved.antecedents.find(v => { return v.valueId === currentAbc.valueId });
        }
        else if ( currentAbc.typeCd === 'B' ) {
            value = currentObserved.behaviors.find(v => { return v.valueId === currentAbc.valueId });
        }
        else if ( currentAbc.typeCd === 'C' ) {
            value = currentObserved.consequences.find(v => { return v.valueId === currentAbc.valueId });
        }
        else  {
            value = currentObserved.locations.find(v => { return v.valueId === currentAbc.valueId });
        }

        setAbcValue(value ? value.typeValue : '');
        setDisplayAbcValue(true);
        setDisableAdd(true);
    }

    const cancelAbcValue = () => {
        setDisableAdd(false);
        setDisplayAbcValue(false);
    }

    const saveAbcValue = () => {
        ObservedService.saveAbc(sessionKey, observedId, currentAbc.valueId, valueTypes[selectedTab], abcValue, 'Y').then(result => {
            props.displaySnackbar(result.severity, result.message);
            props.resetObserved();
        });
    }
   
    const removeAttribute = () => {
        setOpenDelete(true);
    }

    const closeDelete = (deleteFl) => {
        setOpenDelete(false);
        
        if ( deleteFl ) {
            ObservedService.saveAbc(sessionKey, observedId, currentAbc.valueId, valueTypes[selectedTab], abcValue, 'N').then(result => {
                props.displaySnackbar(result.severity, result.message);
                props.resetObserved();
            });
        }
    }

    const saveObserved = () => {

        console.log("XXXX currentObserved", currentObserved);

        UserService.saveObserved(sessionKey, currentObserved.id, observedName, currentObserved.role, relationshipId).then(saveResult => {

            props.displaySnackbar(saveResult.severity, saveResult.message);

            UserService.getUserObserved(sessionKey).then(observedListResult => {
                dispatch(setObservedList(observedListResult));

                if ( currentObserved.id > 0 && currentObserved.id === observedId ) {
                    getObserved(dispatch, sessionKey, observedId);
                }
            });
        });
    }

    const closeObservedSection = () => {
        props.closeObservedSection();
    }

    const handleCheckboxChange = (event, typeCd) => {
        const target = event.target;

        const id = target.checked ? parseInt(event.target.value) : 0;
       
        setCurrentAbc({valueId: id, typeCd: typeCd});
    }

    const displayAbcSection = (data, handleChange, typeCd) => {

        let checkboxes = data.map((a) => {

            const key = typeCd + '-' + a.valueId;
            
            return (
                <FormControlLabel key={key} className="section-span"
                    control={
                        <Checkbox 
                            value={a.valueId} 
                            onChange={e => handleChange(e, typeCd)} 
                            checked={currentAbc.typeCd === typeCd && currentAbc.valueId === a.valueId}
                        />
                    }
                    label={a.typeValue}
                />
            );
        })

        let className = 'abc-div-fieldset';

        return (
            <FormControl component="fieldset" fullWidth={true} className={className}>
                <div className="abc-div">
                    {checkboxes}
                </div>
            </FormControl>
        )
    }

    return (
        <React.Fragment>
        
        <Grid
            container
            direction="row"
            spacing={3}
            style={{width: '800px'}}
        >
             <Grid item xs={12}>
                <Typography variant="h6">
                    {isEdit ? 'Edit' : 'Add'} Observed  
                </Typography>
            </Grid>

            <Grid item xs={12}>
                <TextField 
                    fullWidth={true}
                    name="observedName" 
                    value={observedName} 
                    label="Observed Name" 
                    onChange={handleObservedNameChange}
                />
            </Grid>

            <Grid item xs={12}>
                <FormControl fullWidth={true}>
                    <FormLabel id="relationship-label">Relationship</FormLabel>
                        <Select
                            labelId="relationship-label"
                            value={relationshipId}
                            onChange={handleRelationshipChange}
                            id="relationship"
                        >
                            {displayRelationships()}
                        </Select>
                </FormControl>
            </Grid>

            <Grid item xs={12}>
                <Grid container item xs={12}>
                    <Grid item xs={6}>
                        <SaveButton 
                            onClick={saveObserved} 
                            disabled={observedName.trim() === ''}
                        >
                            Save
                        </SaveButton>
                    </Grid>
                    
                    <Grid item xs={6}  style={{textAlign: 'right'}}>
                        <Button 
                            variant="contained" 
                            color="primary" 
                            onClick={closeObservedSection}
                        >
                            Close
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
                        

            {isEdit &&
            <Grid item xs={12}>
                <Tabs value={selectedTab} onChange={handleTabChange}>
                    <Tab label="Antecedent"/>
                    <Tab label="Behavior"/>
                    <Tab label="Consequence"/>
                    <Tab label="Location"/>
                </Tabs>

                <Grid
                    container
                    direction="row"
                >
                    <Grid item xs={12} style={{marginTop: '15px'}}>
                        <Button 
                            variant="contained" 
                            color="primary" 
                            startIcon={<AddIcon/>}
                            onClick={addAttribute}
                            style={{marginRight: '25px'}}
                            disabled={disableAdd}
                        >
                            Add
                        </Button>

                        <Button 
                            variant="contained" 
                            color="primary" 
                            startIcon={<EditIcon/>}
                            onClick={editAttribute}
                            style={{marginRight: '25px'}}
                            disabled={currentAbc.valueId === 0}
                        >
                            Edit
                        </Button>

                        <Button
                            variant="contained" 
                            color="primary" 
                            onClick={removeAttribute}
                            disabled={currentAbc.valueId === 0}
                        >
                            Remove
                        </Button>
                    </Grid>

                    {displayAbcValue &&
                    <Grid item xs={12} style={{marginTop: '15px'}}>
                        <Grid container spacing={3} alignItems="center">
                            <Grid item xs={6}>
                                <TextField 
                                    fullWidth={true}
                                    name="abcValue" 
                                    value={abcValue} 
                                    label={valueTypes[selectedTab]}
                                    onChange={(e) => setAbcValue(e.target.value)}
                                />
                            </Grid>
                            
                            <Grid item xs={2}>
                                <Button 
                                    variant="contained" 
                                    color="primary" 
                                    onClick={saveAbcValue}
                                    disabled={abcValue.trim() === ''}
                                >
                                    Save
                                </Button>
                            </Grid>
                            <Grid item xs={2}>
                                <Button 
                                    variant="contained" 
                                    color="primary" 
                                    onClick={cancelAbcValue}
                                >
                                    Cancel
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                    }

                    <Grid item xs={12} style={{marginTop: '15px'}}>
                        <div hidden={selectedTab !== 0}>
                            {displayAbcSection(currentObserved.antecedents, handleCheckboxChange, 'A')}
                        </div>
                        <div hidden={selectedTab !== 1}>
                            {displayAbcSection(currentObserved.behaviors, handleCheckboxChange, 'B')}
                        </div>

                        <div hidden={selectedTab !== 2}>
                            {displayAbcSection(currentObserved.consequences, handleCheckboxChange, 'C')}
                        </div>

                        <div hidden={selectedTab !== 3}>
                            {displayAbcSection(currentObserved.locations.filter(l => {return l.valueId !== 0}), handleCheckboxChange, 'L')}
                        </div>
                    </Grid>
                </Grid>
            
            </Grid>
            }
   
        </Grid>

        {openDelete && 
            <DeleteDialog
                title="Remove ABC Value"
                text="Click 'Remove' to remove the value."
                openFl={openDelete}
                handleClose={closeDelete}
                deleteLabel="Remove"
            />
        }
        </React.Fragment>
    );
}

export default ObservedAttributes;
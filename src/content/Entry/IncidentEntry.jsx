import React, { useEffect, useReducer, useState }  from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link as RouterLink, useParams } from 'react-router-dom';
   
import Alert from '@mui/material/Alert';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import MenuItem from '@mui/material/MenuItem';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import TimePicker from '@mui/lab/TimePicker';

import AddIcon from '@mui/icons-material/Add';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';

import { PageBreadcrumbs } from '../../components/breadcrumbs';
import { SaveButton } from '../../components/button';

import ObservedList from '../../components/observed/ObservedList';
import SnackbarAlert from '../../components/SnackbarAlert';

import IncidentService from '../../services/IncidentService';
import ObservedService from '../../services/ObservedService';
import { getCurrentRole, getObserved, setDisabledObserved } from '../../actions/observedActions';
import AddValue from './AddValue';
import { buildAbclMap, validateAndFormatDuration } from './entryUtils';

import { setField, setAbc, setErrorMessage, setErrorMessages, setData, setSnackbar } from '../../actions/entryActions';
import { entryReducer, INITIAL_ENTRY_STATE } from '../../reducers/entryReducer';

import { buildDataSheet } from '../../utils/datasheet';

import { ROLE_LOG } from '../../utils/constants';
  
const IncidentEntry = ({showLoading}) => {
    
    const globalState = useSelector(state => state);
    const dispatch = useDispatch();

    const sessionKey = globalState.userReducer.sessionKey;
    const observed = globalState.observedReducer.observed;
   
    const { id } = useParams();

    const viewLink = "/view/" + id;

    // reducer holds form data and error messages
    const [entryState, entryDispatch] = useReducer(entryReducer, INITIAL_ENTRY_STATE);
    
    const [intensities, setIntensities] = useState([]);

    const [displayAddValueFl, setDisplayAddValueFl] = useState(false);

    const abclMap = buildAbclMap(observed);

    const currentRole = getCurrentRole(globalState);
  
    useEffect(() => {
        
        dispatch(setDisabledObserved(id !== undefined));
        
        if ( intensities.length === 0 ) {
            IncidentService.getIntensities().then(result => {
                setIntensities(result);
            });
        }

        function getAbcIds(values) {
            return values.map(abc => {
                 return abc.valueId;
            });
        }

        if ( sessionKey !== '' && observed.id > 0 && id !== undefined ) {
            ObservedService.getIncident(sessionKey, observed.id, id).then(result => {
                
                const data = {
                    incidentDate: new Date(result.incidentDt), 
                    antecedents: [],
                    behaviors: [],
                    consequences: [],
                    locationId: result.locationId,
                    intensityId: result.intensityId,
                    duration: '',
                    description: result.description,
                    fieldErrorMessages: {}
                }
                
                let durationSeconds = result.duration;
                if ( durationSeconds < 60 ) {
                    data.duration = "00:" + ("0" + durationSeconds).slice(-2);
                }
                else {
                    let durationMinutes = Math.floor(durationSeconds / 60);
                    durationSeconds = durationSeconds % 60;
                    data.duration = ("0" + durationMinutes).slice(-2) + ":" + ("0" + durationSeconds).slice(-2);
                }

                data.antecedents = getAbcIds(result.antecedents);
                data.behaviors = getAbcIds(result.behaviors);
                data.consequences = getAbcIds(result.consequences);

                entryDispatch(setData(data));
            });
        }
        else {
            entryDispatch(setData(INITIAL_ENTRY_STATE));
        }

    }, [sessionKey, observed, intensities, id, dispatch, entryDispatch]);

    /* On change handler functions */
    const handleFieldChange = (event) => {
        const target = event.target;
        entryDispatch(setField(target.name, target.value));
    }

    const handleDateChange = (date) => {
        entryDispatch(setField('incidentDate', date));
    }

    const handleNumberFieldChange = (event) => {
        const target = event.target;
        entryDispatch(setField(target.name, parseInt(target.value, 10)));
    }

    const handleAntecedentChange = (event) => {
        entryDispatch(setAbc('antecedents', parseInt(event.target.value)));
    }

    const handleBehaviorChange = (event) => {
        entryDispatch(setAbc('behaviors', parseInt(event.target.value)));
    }

    const handleConsequenceChange = (event) => {
        entryDispatch(setAbc('consequences', parseInt(event.target.value)));
    }
    /* End - on change handler functions */


    const validateDuration = () => {
        const resultObj = validateAndFormatDuration(entryState.duration);
        
        entryDispatch(setField('duration', resultObj.duration));

        entryDispatch(setErrorMessage('duration', resultObj.errorMessage));
    }
  
    const getABCString = (values) => {
        let idString = '';

        values.forEach(value => {
            if ( idString !== '' ) {
    			idString += ',';
            }
            idString += value;
        })
       
        return idString;
    }
 
    const handleSave = () => {

        let errorMessages = {};

        let durationError = 'duration' in entryState.fieldErrorMessages;
        if ( durationError ) {
            errorMessages['duration'] = durationError;
        }

        let antecedentIds = getABCString(entryState.antecedents);
        let behaviorIds = getABCString(entryState.behaviors);
        let consequenceIds = getABCString(entryState.consequences);

        if ( antecedentIds === '' ) {
            errorMessages['antecedents'] = 'At least one required';
        }

        if ( behaviorIds === '' ) {
            errorMessages['behaviors'] = 'At least one required';
        }

        if ( consequenceIds === '' ) {
            errorMessages['consequences'] = 'At least one required';
        }

        entryDispatch(setErrorMessages(errorMessages));
        
        if ( isNaN(entryState.incidentDate.getTime()) || Object.keys(errorMessages).length > 0 ) {
            entryDispatch(setSnackbar(true, 'error', 'Incident contains errors.  Please check fields.'));
            return;
        }
        
        const data = {
            id: id === undefined ? 0 : id,
            observedId: observed.id,
            incidentDate: entryState.incidentDate.getTime(),
            incidentDuration: entryState.duration,
            intensityId: entryState.intensityId,
            locationId: entryState.locationId,
            description: entryState.description,
            antecedentIds: antecedentIds,
            behaviorIds: behaviorIds,
            consequenceIds: consequenceIds
        };
        
        showLoading(true);
        IncidentService.saveIncident(sessionKey, data).then(result => {
            showLoading(false);
            entryDispatch(setSnackbar(true, result.severity, result.message));
        });

    }

    /* Display Functions */
    const displayLocations = () => {
        return abclMap.locations.map((r) => {
            const key = 'location_' + r.valueId;
            return (
                <MenuItem key={key} value={r.valueId}>{r.typeValue}</MenuItem>
            );
        });
    }

    const displayIntensities = () => {

        return intensities.map((r) => {
            const key = 'intensity_' + r.id;
            return (
                <FormControlLabel key={key} value={r.id} control={<Radio />} label={r.name} />
            );
        });
    }

    const displayAbcSection = (label, data, name, handleChange, currentSelected) => {

        let checkboxes = data.map((a) => {

            const key = 'a-' + a.valueId;

            return (
                <FormControlLabel key={key} className="section-span"
                    control={
                        <Checkbox 
                            value={a.valueId} 
                            checked={currentSelected.includes(a.valueId)}
                            onChange={e => handleChange(e)} 
                        />
                    }
                    label={a.typeValue}
                />
            );
        })

        let errorMessage = '';
        let className = 'abc-div-fieldset';

        if ( name in entryState.fieldErrorMessages ) {
            errorMessage = entryState.fieldErrorMessages[name];
            className += ' invalid-abc';
        }

        return (
            <FormControl component="fieldset" fullWidth={true} className={className}>
                <FormLabel component="legend">{label} <span className="optional">(choose at least one)</span> <span className="error-message">{errorMessage}</span></FormLabel>

                <div className="abc-div">
                    {checkboxes}
                </div>
            </FormControl>
        )
    }

    const closeSnackbar = () => {
        entryDispatch(setSnackbar(false, 'success', ''));
    }

    const toggleAddValueSection = () => {
        setDisplayAddValueFl(! displayAddValueFl);
    }

    const addValue = (valueType, abclValue) => {
        ObservedService.addAbc(sessionKey, observed.id, valueType, abclValue).then(result => {
            entryDispatch(setSnackbar(true, result.severity, result.message));
            getObserved(dispatch, sessionKey, observed.id);
            toggleAddValueSection();
        });
    }

    const isError = (field) => {
        return entryState.fieldErrorMessages[field] ? true : false;
    }

    const errorText = (field) => {
        const text = entryState.fieldErrorMessages[field];
        return text ? text : '';
    }

    const exportDataSheet = () => {
        buildDataSheet(observed);
    }
   
    return (
        <div className="content-container incident-entry-div">

            <Box sx={{ mb: 1, pt: 1, display: 'flex', flexDirection: { xs: 'column' }, flexGrow: 1, borderBottom: 1, borderColor: '#dddddd' }}>

                <Box sx={{ flexGrow: 1, pb: 1 }}>
                    <PageBreadcrumbs>
                        <Breadcrumbs aria-label="breadcrumb">
                            <Link color="inherit" component={RouterLink} to="/" >
                                Home
                            </Link>
                            <Link color="inherit" component={RouterLink} to="/dashboard" >
                                Dashboard
                            </Link>
                            {id &&
                            <Link color="inherit" component={RouterLink} to="/log" >
                                Incident Log
                            </Link>
                            }
                            {id &&
                            <Link color="inherit" component={RouterLink} to={viewLink} >
                                Incident View
                            </Link>
                            }
                            <Typography color="textPrimary">Incident Entry</Typography>
                        </Breadcrumbs>
                    </PageBreadcrumbs>
                </Box>

                <Box sx={{ mb: 1, pt: 1, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, flexGrow: 1, justifyContent: 'space-between' }}>

                    <Box sx={{ pb: 1 }}>
                        <ObservedList/>
                    </Box>
                
                    {currentRole !== ROLE_LOG &&
                    <Box sx={{ flexGrow: 0, pb: 1 }}>
                        <Button 
                            variant="contained" 
                            color="primary" 
                            startIcon={<AddIcon/>}
                            onClick={toggleAddValueSection}
                            style={{marginRight: '25px'}}
                        >
                            ABC Value
                        </Button>

                        <Button 
                            variant="contained" 
                            color="primary" 
                            startIcon={<PictureAsPdfIcon/>}
                            onClick={exportDataSheet}
                        >
                            Data Sheet
                        </Button>
                    </Box>
                    }
                </Box>

            </Box>
                   

            {displayAddValueFl &&
                <AddValue 
                    antecedentsData={abclMap.antecedents}
                    behaviorData={abclMap.behaviors}
                    consequenceData={abclMap.consequences}
                    locationData={abclMap.locations}
                    addValue={addValue}
                    toggleAddValueSection={toggleAddValueSection}
                />
            }
           
           {currentRole !== ROLE_LOG &&
           <React.Fragment>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Grid  
                    container
                    spacing={3}
                    className="incident-pickers"
                    style={{marginBottom: '24px'}}
                >
                    <Grid item>
                        <FormControl>
                            <FormLabel htmlFor="date-label" style={{ fontSize: '16px' }}>Incident Date</FormLabel>
                            <DatePicker
                                id="date-label"
                                name="incidentDate"
                                value={entryState.incidentDate}
                                onChange={handleDateChange}
                                renderInput={(params) => <TextField {...params} />}
                            />
                        </FormControl>
                    </Grid>

                     <Grid item>
                        <FormControl>
                            <FormLabel htmlFor="time-label" style={{ fontSize: '16px' }}>Incident Time</FormLabel>
                            <TimePicker
                                id="time-label"
                                name="incidentTime"
                                value={entryState.incidentDate}
                                onChange={handleDateChange}
                                renderInput={(params) => <TextField {...params} />}
                            />
                        </FormControl>
                        
                    </Grid>
                </Grid>
            </LocalizationProvider>

            <Grid  
                container
                spacing={3}
            >
                <Grid item xs={12}>
                    {displayAbcSection('Antecedents', abclMap.antecedents, 'antecedents', handleAntecedentChange, entryState.antecedents)}
                </Grid>

                <Grid item xs={12}>
                    {displayAbcSection('Behaviors', abclMap.behaviors, 'behaviors', handleBehaviorChange, entryState.behaviors)}
                </Grid>

                <Grid item xs={12}>
                    {displayAbcSection('Consequences', abclMap.consequences, 'consequences', handleConsequenceChange, entryState.consequences)}
                </Grid>

                <Grid item xs={12}>
                    <FormControl fullWidth={true}>
                        <FormLabel id="location-label">Location <span className="optional">(optional)</span></FormLabel>
                        <Select
                            labelId="location-label"
                            value={entryState.locationId}
                            name="locationId"
                            onChange={handleNumberFieldChange}
                            fullWidth={true}
                        >
                            <MenuItem key='location_0' value='0'>None</MenuItem>
                            {displayLocations()}
                        </Select>
                    </FormControl>
                </Grid>

                <Grid item xs={12}>
                    <FormControl fullWidth={true}>
                        <FormLabel id="intensity-label">Intensity <span className="optional">(optional)</span></FormLabel>
                        
                        <RadioGroup aria-label="intensity" row name="intensityId" value={entryState.intensityId} onChange={handleNumberFieldChange}>
                            {displayIntensities()}
                        </RadioGroup>
                    </FormControl>
                </Grid>

                <Grid item xs={12}>
                    <FormControl fullWidth={true}>
                        <FormLabel>Duration - Minutes:Seconds <span className="optional">(optional)</span></FormLabel>
                        <TextField 
                            fullWidth={true}
                            name="duration" 
                            value={entryState.duration} 
                            onChange={handleFieldChange}
                            onBlur={validateDuration}
                            error={isError('duration')}
                            helperText={errorText('duration')}
                            placeholder="MM:SS"
                        />
                    </FormControl>
                </Grid>

                <Grid item xs={12}>
                    <FormControl fullWidth={true}>
                        <FormLabel>Description <span className="optional">(optional)</span></FormLabel>
                        <TextField 
                            fullWidth={true}
                            multiline={true}
                            rows={3}
                            name="description" 
                            value={entryState.description} 
                            onChange={handleFieldChange}
                        />
                    </FormControl>
                </Grid>

                <Grid item xs={12} style={{textAlign: 'center'}}>
                    <SaveButton onClick={handleSave} disabled={observed.id === 0}/>
                </Grid>
            </Grid>

            </React.Fragment>
            }

            {currentRole === ROLE_LOG &&
            <Grid
                container
                direction="column"
                justify="center"
                alignItems="stretch"
                spacing={3}
            >
                <Grid item xs={12}>
                    <Alert severity="info">You are not authorized to access Incident Entry for {globalState.observedReducer.observed.observedNm}</Alert>
                </Grid>

            </Grid>
            }

            <SnackbarAlert 
                openFlag={entryState.snackbarFl}
                onClose={closeSnackbar} 
                severity={entryState.snackbarMessageSeverity}
                message={entryState.snackbarMessage}
            />
        </div>
    )

}

export default IncidentEntry;
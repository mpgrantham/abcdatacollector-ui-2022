import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Grid from '@mui/material/Grid';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Typography from '@mui/material/Typography';

import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';

import { PageBreadcrumbs } from '../../components/breadcrumbs';
import { ExportButton, IncidentButton } from '../../components/button';
import ObservedService from '../../services/ObservedService';

import { IncidentGrid } from '../../components/grid';

import { setDisabledObserved } from '../../actions/observedActions';

const MILD = 'Mild';
const MODERATE = 'Moderate';
const SEVERE = 'Severe';

const initialFilter = {
    fromDate: null, 
    toDate: new Date(),
    fromDuration: '',
    toDuration: '',
    intensities: [],
    locations: [],
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const IncidentLog = ({showLoading}) => {

    const gridRef = useRef(null);
    const filterRef = useRef(null);
    const incidentGridRef = useRef();

    const globalState = useSelector(state => state);
    const sessionKey = globalState.userReducer.sessionKey;
    const observed = globalState.observedReducer.observed;
    const dispatch = useDispatch();

    const locations = observed.locations ? observed.locations.filter(l => { return l.valueId > 0 }) : [];
    
    const handleResize = () => {
        if ( gridRef !== null && gridRef.current ) {
            let extraHeight = 215;

            if ( filterRef !== null && filterRef.current ) {
                extraHeight += filterRef.current.clientHeight;
            }

            gridRef.current.style.height = (window.innerHeight - extraHeight) + 'px';
        }
    }

    const [incidents, setIncidents] = useState([]);
    const [filteredIncidents, setFilteredIncidents] = useState([]);

    const [fields, setFilterFields] = useState(initialFilter);

    const [location, setLocation] = React.useState([]);
   
    useEffect(() => {
        
        dispatch(setDisabledObserved(false));

        if ( sessionKey !== '' && observed.id > 0 ) {
            showLoading(true);
            ObservedService.getIncidents(sessionKey, observed.id).then(result => {
                setIncidents(result);
                setFilteredIncidents(result);
                showLoading(false);
            });
        }

        handleResize();
        
        window.addEventListener("resize", handleResize);

        return function cleanup() {
            window.removeEventListener("resize", handleResize);
        };
   
    }, [sessionKey, observed, dispatch, showLoading]);
    
    const exportLog = () => {
        // Using AG-Grid export to CSV feature.  This exports what is currently shown.
        // window.location.href = process.env.REACT_APP_API_BASE_URL + 'exportIncidents.xls?obsId=' + observedId;
        incidentGridRef.current.exportToCsv();
    }

    const getFilters = (name, value) => {
       return {
            ...fields,
            [name]: value
        }
    }

    const handleDateChange = (name, date) => {
        const filters = getFilters(name, date);

        setFilterFields(filters);
        filterIncidents(filters);
    }

    const handleTextChange = (e) => {
        const target = e.target;
      
        const filters = getFilters(target.name, target.value);

        setFilterFields(filters);
        filterIncidents(filters);
    }

    const handleIntensityChange = (event, newIntensities) => {
        const filters = getFilters('intensities', newIntensities);
       
        setFilterFields(filters);

        filterIncidents(filters);
    }

    const handleLocationChange = (event) => {
        const {
          target: { value },
        } = event;
        
        setLocation(
          typeof value === 'string' ? value.split(',') : value,
        );
      
        const filters = getFilters('locations', event.target.value);

        setFilterFields(filters);

        filterIncidents(filters);
    };

    const clearFilters = () => {
        setFilterFields(initialFilter);
        setLocation([]);
        setFilteredIncidents(incidents);
    }
    
    const filterIncidents = (filters) => {
        let results = [];

        const fromDate = getMillis(filters.fromDate);
        const toDate = getMillis(filters.toDate);

        const fromDuration = reformatDuration(filters.fromDuration);
        const toDuration = reformatDuration(filters.toDuration);
        
        incidents.forEach(incident => {

            if ( filters.intensities.length > 0 && ! filters.intensities.includes(incident.intensity) ) {
                return;
            }

            if ( filters.locations.length > 0 && ! filters.locations.includes(incident.location) ) {
                return;
            }

            if ( invalidDate(fromDate, toDate, incident.incidentDt) ) {
                return;
            }

            if ( invalidDuration(fromDuration, toDuration, incident.duration) ) {
                return;
            }
          
            results.push(incident);
        });

        setFilteredIncidents(results);
    }

    const getMillis = (date) => {
        return date ? date.getTime() : null;
    }

    const invalidDate = (fromDate, toDate, incidentDate) => {
        if ( fromDate && incidentDate < fromDate ) {
            return true;
        }

        if ( toDate && incidentDate > toDate ) {
            return true;
        }
    }

    const invalidDuration = (fromDuration, toDuration, incidentDuration) => {
        return ( fromDuration > 0 && incidentDuration < fromDuration ) ||
                        ( toDuration > 0 && incidentDuration > toDuration );
    }

    const reformatDuration = (duration) => {
        if ( ! duration ) {
            return 0;
        }

        let len = duration.length;
    
        if ( len === 0 ) {
            return 0;
        }
           
        let tempDuration = duration;
    
        let colonIdx = duration.indexOf(":");
        if ( colonIdx === -1 ) {
            if ( len < 3 ) {
                tempDuration= "00:" + ("0" + tempDuration).slice(-2);
                len = 5;
            }
            else if ( len === 3 || len === 4 ) {
                // insert colon two from back
                colonIdx = len - 2;
                tempDuration = tempDuration.substring(0,colonIdx) + ":" + tempDuration.substring(colonIdx);
                len++;
            }
            else {
                return 0;
            }
        }
    
        // Check for dot and minus as these are valid in numbers
        if ( len < 3 || len > 6 || tempDuration.indexOf(".") > -1 || tempDuration.indexOf("-") > -1 ) {
            return 0;
        }
               
        let parts = tempDuration.split(":");
        if ( parts.length !== 2 || isNaN(parts[0]) || isNaN(parts[1]) ) {
            return 0;
        }
           
        return (Number(parts[0]) * 60) + Number(parts[1]);
    }

    return (
        <div className="content-container">
            <Grid
                container
                direction="row"
                style={{borderBottom: '1px solid #dddddd', paddingBottom: '15px'}}
            >
                <Grid item xs={6} md={8}>
                    <PageBreadcrumbs page="Incident Log"/>
                </Grid>
                               
                <Grid item xs={5} md={4} className="add-incident">
                    
                    <ExportButton onClick={exportLog} style={{marginRight: '25px'}}/>
                       
                    <IncidentButton/>
                </Grid>
            </Grid>

            <Grid
                container
                direction="row"
                spacing={1}
                style={{borderBottom: '1px solid #dddddd', padding: '15px'}}
                ref={filterRef}
            >
                <Grid item xs={12}>
                    <Typography variant="subtitle1" component="div" style={{fontSize: '1.1rem'}}>
                        Incident Filters 
                    </Typography>
                </Grid>
                <Grid item xs={4} >
                    <FormControl component="fieldset">
                        <FormLabel component="legend">Date Range</FormLabel>

                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <Grid  
                                container
                                direction="row"
                            >
                                <Grid item xs={4}>
                                    <DatePicker
                                        value={fields.fromDate}
                                        onChange={(d) => handleDateChange('fromDate', d)}
                                        renderInput={(params) => <TextField {...params} />}
                                        maxDate={new Date()}
                                    />
                                </Grid>
                                <Grid item xs={1}>
                                    
                                </Grid>
                                <Grid item xs={4}>
                                    <DatePicker
                                        value={fields.toDate}
                                        onChange={(d) => handleDateChange('toDate', d)}
                                        renderInput={(params) => <TextField {...params} />}
                                        maxDate={new Date()}
                                    />
                                </Grid>
                            </Grid>
                        </LocalizationProvider>
                    </FormControl>
                </Grid>
                               
                <Grid item xs={3}>
                    <FormControl component="fieldset">
                        <FormLabel component="legend">Duration Range (MM:SS)</FormLabel>
                        <Grid  
                            container
                            direction="row"
                        >
                            <Grid item xs={4}>
                                    <TextField 
                                        name="fromDuration" 
                                        value={fields.fromDuration} 
                                        onChange={handleTextChange}
                                        fullWidth={true}
                                        variant="outlined"
                                    />
                            </Grid>
                            <Grid item xs={1}>
                            </Grid>
                            <Grid item xs={4}>
                                    <TextField 
                                        name="toDuration" 
                                        value={fields.toDuration} 
                                        onChange={handleTextChange}
                                        fullWidth={true}
                                        variant="outlined"
                                    />
                            </Grid>
                        </Grid>
                    </FormControl>
                </Grid>

                <Grid item xs={5} style={{paddingTop: '30px'}}>
                    <Button 
                        variant="contained" 
                        color="primary" 
                        onClick={clearFilters}
                   >
                        Clear Filters
                    </Button>
                </Grid>

                <Grid item xs={4}>
                    <FormControl component="fieldset">
                        <FormLabel component="legend">Intensity</FormLabel>
                        <ToggleButtonGroup
                            value={fields.intensities}
                            onChange={handleIntensityChange}
                            aria-label="intensities"
                            size="large"
                            color="primary"
                        >
                            <ToggleButton value={MILD} aria-label="mild">
                                Mild
                            </ToggleButton>
                            <ToggleButton value={MODERATE} aria-label="moderate">
                                Moderate
                            </ToggleButton>
                            <ToggleButton value={SEVERE} aria-label="severe">
                                Severe
                            </ToggleButton>
                        </ToggleButtonGroup>
                    </FormControl>
                </Grid>
                               
                <Grid item xs={8}>
                    <FormControl component="fieldset" sx={{ width: 315 }}>
                        {/*<InputLabel id="location-label">Location</InputLabel>*/}
                        <FormLabel component="legend">Location</FormLabel>

                        <Select
                            labelId="location-label"
                            id="demo-multiple-checkbox"
                            multiple
                            value={location}
                            onChange={handleLocationChange}
                            input={<OutlinedInput  />}
                            renderValue={(selected) => selected.join(', ')}
                            MenuProps={MenuProps}
                        >
                            {locations.map((l) => (
                                <MenuItem key={l.valueId} value={l.typeValue}>
                                <Checkbox checked={location.indexOf(l.typeValue) > -1} />
                                <ListItemText primary={l.typeValue} />
                                </MenuItem>
                            ))}
                        </Select>
                        
                    </FormControl>
                </Grid>

               
            </Grid>

            <div className="ag-theme-material" style={ {height: '500px', width: '100%', paddingTop: '10px'} } ref={gridRef}>
                <IncidentGrid 
                    ref={incidentGridRef}
                    incidents={filteredIncidents}
                />
            </div>
        </div>
    )
}

export default IncidentLog;
import React, {useState} from 'react'

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';


import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select from '@mui/material/Select';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';


import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';

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

const MILD = 'Mild';
const MODERATE = 'Moderate';
const SEVERE = 'Severe';

function FilterDialog(props) {

    const {openFl, locations} = props;
    
    const [filterFields, setFilterFields] = useState(props.filters);
    const [location, setLocation] = React.useState([]);

    const getFilters = (name, value) => {
        return {
             ...filterFields,
             [name]: value
         }
     }
 
     const handleDateChange = (name, date) => {
         const filters = getFilters(name, date);
 
         setFilterFields(filters);
     }
 
     const handleTextChange = (e) => {
         const target = e.target;
       
         const filters = getFilters(target.name, target.value);
 
         setFilterFields(filters);
     }
 
     const handleIntensityChange = (event, newIntensities) => {
         const filters = getFilters('intensities', newIntensities);
        
         setFilterFields(filters);
 
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
          
     };
 
     const clearFilters = () => {
         setLocation([]);
         props.resetIncidents();
     }
   
    const applyFilter = () => {
        props.filterIncidents(filterFields)
    }
   
        
    const handleClose = () => {
        props.handleClose(false);
    }

    return (
        
        <Dialog
            open={openFl}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">Incident Filters</DialogTitle>
            <DialogContent style={{overflowY: 'hidden'}}>

                <Grid
                        container
                        direction="row"
                        spacing={1}
                        
                    >
                        
                        <Grid item xs={12} >
                            <FormControl component="fieldset">
                                <FormLabel component="legend">Date Range</FormLabel>

                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <Grid  
                                        container
                                        direction="row"
                                    >
                                        <Grid item xs={5}>
                                            <DatePicker
                                                value={filterFields.fromDate}
                                                onChange={(d) => handleDateChange('fromDate', d)}
                                                renderInput={(params) => <TextField {...params} />}
                                                maxDate={new Date()}
                                            />
                                        </Grid>
                                        <Grid item xs={1}>
                                            
                                        </Grid>
                                        <Grid item xs={5}>
                                            <DatePicker
                                                value={filterFields.toDate}
                                                onChange={(d) => handleDateChange('toDate', d)}
                                                renderInput={(params) => <TextField {...params} />}
                                                maxDate={new Date()}
                                            />
                                        </Grid>
                                    </Grid>
                                </LocalizationProvider>
                            </FormControl>
                        </Grid>
                                    
                        <Grid item xs={12}>
                            <FormControl component="fieldset">
                                <FormLabel component="legend">Duration Range (MM:SS)</FormLabel>
                                <Grid  
                                    container
                                    direction="row"
                                >
                                    <Grid item xs={5}>
                                            <TextField 
                                                name="fromDuration" 
                                                value={filterFields.fromDuration} 
                                                onChange={handleTextChange}
                                                fullWidth={true}
                                                variant="outlined"
                                            />
                                    </Grid>
                                    <Grid item xs={1}>
                                    </Grid>
                                    <Grid item xs={5}>
                                            <TextField 
                                                name="toDuration" 
                                                value={filterFields.toDuration} 
                                                onChange={handleTextChange}
                                                fullWidth={true}
                                                variant="outlined"
                                            />
                                    </Grid>
                                </Grid>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12}>
                            <FormControl component="fieldset">
                                <FormLabel component="legend">Intensity</FormLabel>
                                <ToggleButtonGroup
                                    value={filterFields.intensities}
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
                                    
                        <Grid item xs={12}>
                            <FormControl component="fieldset" sx={{ width: 315 }}>
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
                
            </DialogContent>

            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    Cancel
                </Button>
                <Button onClick={clearFilters} color="primary">
                    Clear
                </Button>
                <Button onClick={applyFilter} color="primary">
                    Apply
                </Button>
            </DialogActions>
        </Dialog>
    );

}

export default FilterDialog;
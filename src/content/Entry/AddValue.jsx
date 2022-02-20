import React, { useState } from 'react';

import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { SaveButton } from '../../components/button';

function AddValue(props) {

    const [valueType, setValueType] = useState('Antecedent');
    const [abclValue, setAbclValue] = useState('');
    const [disableAdd, setDisableAdd] = useState(true);
    const [abcErrorFl, setAbcErrorFl] = useState(false);
    const [abcErrorMsg, setAbcErrorMsg] = useState(null);
    
    function handleValueTypeChange(event) {
        setValueType(event.target.value);
        setAbclValue('');
        setDisableAdd(true);
        setAbcErrorMsg(null);
        setAbcErrorFl(false);
    }

    function handleAbclValueChange(event) {
        const target = event.target;
        const value = target.value;
        setAbclValue(value);

        // check for value in existing array
        let data = [];
        if ( valueType === 'Antecedent') {
            data = props.antecedentsData;
        }
        else if ( valueType === 'Behavior') {
            data = props.behaviorData;
        }
        else if ( valueType === 'Consequence') {
            data = props.consequenceData;
        }
        else {
            data = props.locationData;
        }

        const upperValue = value.toUpperCase();

        const obj = data.find(o => {
            return o.typeValue.toUpperCase() === upperValue;
        });

        if ( obj ) {
            setAbcErrorMsg('Value already exists');
            setAbcErrorFl(true);
        }
        else {
            setAbcErrorMsg(null);
            setAbcErrorFl(false);
        }

        setAbcErrorFl(obj);
        setDisableAdd(obj || value.trim() === '' || props.observedId === 0);
    }

    function addValue() {
        props.addValue(valueType, abclValue);
    }


    return (

        <Grid
                container
                style={{background: '#fafafa', borderBottom: '1px solid #dddddd', padding: '15px', marginBottom: '25px'}}
            >
                <Grid item xs={12}>
                    <Typography variant="subtitle1" component="div" style={{fontSize: '1.1rem'}}>
                        Add {valueType}
                    </Typography>
                </Grid>

                <Grid item xs={12} md={12}>
                    <FormControl fullWidth={true}>
                        <RadioGroup aria-label="value-type" row name="value-type" value={valueType} onChange={handleValueTypeChange}>
                            <FormControlLabel value='Antecedent' control={<Radio />} label='Antecedent' />
                            <FormControlLabel value='Behavior' control={<Radio />} label='Behavior' />
                            <FormControlLabel value='Consequence' control={<Radio />} label='Consequence' />
                            <FormControlLabel value='Location' control={<Radio />} label='Location' />
                        </RadioGroup>
                    </FormControl>
                </Grid>

                <Grid item xs={4} style={{marginTop: '5px'}}>
                    <TextField 
                            error={abcErrorFl}
                            helperText={abcErrorMsg}
                            fullWidth={true}
                            name="abclValue" 
                            value={abclValue} 
                            label={valueType}
                            onChange={handleAbclValueChange}
                    />
                  
                </Grid>

                <Grid container item xs={12} md={12} style={{marginTop: '15px'}}>
                    <Grid item xs={2} md={2}>
                        <SaveButton 
                            variant="contained" 
                            color="primary"
                            onClick={addValue} 
                            disabled={disableAdd}
                        >
                            Add
                        </SaveButton>
                    </Grid>

                    <Grid item xs={2} md={2} style={{textAlign: 'right'}}>
                        <Button 
                            variant="contained" 
                            color="primary" 
                            onClick={props.toggleAddValueSection}
                        >
                            Close
                        </Button>
                    </Grid>
                </Grid>
            </Grid>

    );
}

export default AddValue;
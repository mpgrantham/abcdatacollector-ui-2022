import React from 'react';
import { Link } from 'react-router-dom';

import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';

function IncidentButton(props) {

    let disabled = props.disabled ? props.disabled : false;

    return (
        <Button 
            variant="contained" 
            color="success" 
            component={Link} 
            to={"/entry"}
            startIcon={<AddIcon/>}
            disabled={disabled}
        >
            New Incident
        </Button>
    )
}

export default IncidentButton;
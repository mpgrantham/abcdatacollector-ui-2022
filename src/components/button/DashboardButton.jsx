import React from 'react';
import { Link } from 'react-router-dom';

import Button from '@mui/material/Button';

function DashboardButton(props) {

    let disabled = props.disabled ? props.disabled : false;
    
    return (
        <Button 
            variant="contained" 
            color="primary" 
            component={Link} 
            to={"/dashboard"}
            style={props.style}
            disabled={disabled}
        >
            Dashboard
        </Button>
    )
}

export default DashboardButton;
import React from 'react';
import Button from '@mui/material/Button';

function SaveButton(props) {

  let disabled = props.disabled ? props.disabled : false;

  return (
    <Button 
        variant="contained" 
        color="success"
        onClick={props.onClick} 
        disabled={disabled}
    >
      Save
    </Button>
  )

}

export default SaveButton;

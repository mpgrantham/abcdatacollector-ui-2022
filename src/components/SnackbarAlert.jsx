import React  from 'react';
    
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';

const vertical = 'top';
const horizontal = 'center';

const SnackbarAlert = ({openFlag, onClose, severity, message, autoHideDuration}) => {

    const duration = autoHideDuration ? autoHideDuration : 10000;

    return (
        <Snackbar 
            open={openFlag} 
            autoHideDuration={duration} 
            onClose={onClose} 
            anchorOrigin={{ vertical, horizontal }}
        >
            <Alert 
                onClose={onClose} 
                severity={severity}>
                {message}
            </Alert>
        </Snackbar>
    );
}

export default SnackbarAlert;
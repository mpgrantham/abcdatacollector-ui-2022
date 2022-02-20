import React from 'react';

import Button from '@mui/material/Button';
import DownloadIcon from '@mui/icons-material/Download';

const ExportButton = ({onClick, style}) => {

    return (
        <Button 
            variant="contained" 
            color="primary" 
            startIcon={<DownloadIcon/>}
            onClick={onClick}
            style={style}
        >
            Export
        </Button>
    );
}

export default ExportButton;
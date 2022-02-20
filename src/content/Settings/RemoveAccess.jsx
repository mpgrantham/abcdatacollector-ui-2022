import React, { useEffect, useState } from 'react';

import { 
    Button,
    Grid,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    TextField,
    Typography
} from '@mui/material';

import DeleteDialog from '../../components/DeleteDialog';

import UserService from '../../services/UserService';

const RemoveAccess = (props) => {
     
    const sessionKey = props.sessionKey;
    const currentObserved = props.currentObserved;
      
    const [openDelete, setOpenDelete] = useState(false);
    const [observers, setObservers] = useState([]);
    const [observedUserId, setObservedUserId] = useState(0);

    useEffect(() => {
        if ( sessionKey !== '' ) {
            UserService.getObservers(sessionKey, currentObserved.id).then(result => {
                setObservers(result.filter(o => { return o.role !== 'ADMIN' }));
            });
        }
    }, [sessionKey, currentObserved]);
    
    const closeDelete = (deleteFl) => {
        setOpenDelete(false);

        if ( deleteFl ) {
            UserService.removeAccess(sessionKey, currentObserved.id, observedUserId).then(saveResult => {
                props.displaySnackbar(saveResult.severity, saveResult.message);
                props.closeAccessSection();
            });
        }
    }

    const removeObserverAccess = (userId) => {
        setObservedUserId(userId);
        setOpenDelete(true);
    }

    const closeAccessSection = () => {
        props.closeAccessSection();
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
                        Remove Access  
                    </Typography>
                </Grid>

                <Grid item xs={12}>
                    <TextField 
                        fullWidth={true}
                        value={currentObserved.observedNm} 
                        label="Observed Name" 
                        readOnly={true}
                    />
                </Grid>

                <Grid item xs={12}>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Observer Email</TableCell>
                                    <TableCell>Role</TableCell>
                                    <TableCell>Relationship</TableCell>
                                    <TableCell></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {observers.map((row, index) => (
                                    <TableRow key={row.email}>
                                        <TableCell>{row.email}</TableCell>
                                        <TableCell>{row.role}</TableCell>
                                        <TableCell>{row.relationship}</TableCell>
                                        <TableCell align="center">
                                            <Button 
                                                variant="contained" 
                                                color="primary" 
                                                onClick={(e) => removeObserverAccess(row.userId)}
                                            >
                                                Remove
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}

                                {observers.length === 0 &&
                                <TableRow>
                                    <TableCell colSpan={4} align="center">No Observers assigned</TableCell>
                                </TableRow>
                                }

                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>

                <Grid item xs={12} style={{textAlign: 'right'}}>
                    <Button 
                        variant="contained" 
                        color="primary" 
                        onClick={closeAccessSection}
                    >
                        Close
                    </Button>
                </Grid>
        
            </Grid>

            {openDelete && 
                <DeleteDialog
                    title="Remove Access"
                    text="Click 'Remove' to remove access to this Observed."
                    openFl={openDelete}
                    handleClose={closeDelete}
                    deleteLabel="Remove"
                />
            }
        </React.Fragment>
    );
}

export default RemoveAccess;
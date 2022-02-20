import React, {useState, useEffect} from 'react';
import { Link, useParams } from 'react-router-dom';

import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import { Card, CardContent, Container, FormControl, FormLabel, Grid } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import UserService from '../../services/UserService';

function Reassign() {

    const [alertMessage, setAlertMessage ] = useState('');
    const [alertSeverity, setAlertSeverity] = useState('error');

    const [relationships, setRelationships] = useState([]);
    const [relationshipId, setRelationshipId] = useState(0);
    const [observedName, setObservedName] = useState('');
    
    const { key } = useParams();

    useEffect(() => {
        UserService.checkReassignKey(key).then(result => {
            setAlertMessage(result.message);
            setAlertSeverity(result.severity);
            setObservedName(result.observedName ? result.observedName : '');
        });

        UserService.getRelationships().then(result => {
            setRelationships(result);
        });
    }, [key]);

    const  handleRelationshipChange = (event) => {
        setRelationshipId(parseInt(event.target.value, 10));
    }


    const reassignObserved = () => {
        
        UserService.reassignObserved(key, relationshipId).then(result => {
            setAlertMessage(result.message);
            setAlertSeverity(result.severity);
        });
    }

    const displayRelationships = () => {
        return relationships.map((r) => {
            const menuKey = 'relationship_' + r.id;
            return (
                <MenuItem key={menuKey} value={r.id}>{r.relationship}</MenuItem>
            );
        });
    }
    
    return (

        <Container maxWidth="sm" style={{marginTop: '100px'}}>

        <Card variant="outlined">

            <CardContent >
                <Typography gutterBottom variant="h5" component="h2" style={{marginBottom: '24px'}}>
                    Reassign Observed
                </Typography>

                <form noValidate autoComplete="off">

                    <Grid
                        container
                        direction="column"
                        justify="center"
                        alignItems="stretch"
                        spacing={3}
                    >
                        {alertMessage !== '' &&
                        <Grid item>
                            <Alert severity={alertSeverity}>{alertMessage}</Alert>
                        </Grid>
                        }

                        {alertSeverity !== 'success' &&
                        <React.Fragment>
                            <Grid item>
                                <TextField 
                                    fullWidth={true}
                                    value={observedName} 
                                    label="Observed" 
                                    readOnly={true}
                                />
                            </Grid>

                            <Grid item>
                                <FormControl fullWidth={true}>
                                    <FormLabel id="relationship-label">Relationship</FormLabel>
                                        <Select
                                            labelId="relationship-label"
                                            value={relationshipId}
                                            onChange={handleRelationshipChange}
                                            id="relationship"
                                        >
                                            {displayRelationships()}
                                        </Select>
                                </FormControl>
                            </Grid>

                            <Grid item>
                                <Button 
                                    variant="contained" 
                                    color="primary" 
                                    fullWidth={true} 
                                    onClick={reassignObserved}
                                >
                                    Reassign
                                </Button>
                            </Grid>
                        </React.Fragment>
                        }

                        {alertSeverity === 'success' &&
                        <Grid item>
                            <Button color="primary" component={Link} to={"/signin"}>
                                Proceed to Sign In
                            </Button>
                        </Grid>
                        }
 
                    </Grid>
                </form>

            </CardContent>
           
        </Card>

        </Container>
    )
}

export default Reassign;
import React, { useState } from 'react';

import Button from '@mui/material/Button';
import { FormControl, FormLabel } from '@mui/material';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';

import Select from '@mui/material/Select';

import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import UserService from '../../services/UserService';

const roles = [
    {
        role: 'ENTRY_LOG', 
        desc: 'Entry and Log'
    },
    {
        role: 'ENTRY', 
        desc: 'Entry'
    },
    {
        role: 'LOG', 
        desc: 'Log'
    }
]


const GrantAccess = (props) => {
     
    const sessionKey = props.sessionKey;
    const currentObserved = props.currentObserved;
    const relationships = props.relationships;

    const [email, setEmail] = useState('');
    const [role, setRole] = useState('ENTRY_LOG');
    const [relationshipId, setRelationshipId] = useState(0);
        
    const displayRelationships = () => {
        return relationships.map((r) => {
            const key = 'relationship_' + r.id;
            return (
                <MenuItem key={key} value={r.id}>{r.name}</MenuItem>
            );
        });
    }

    const handleRelationshipChange = (event) => {
        setRelationshipId(parseInt(event.target.value, 10));
    }

    const displayRoles = () => {
        return roles.map((r) => {
            const key = 'role_' + r.role;
            return (
                <MenuItem key={key} value={r.role}>{r.desc}</MenuItem>
            );
        });
    }

    const handleRoleChange = (event) => {
        setRole(event.target.value);
    }
      
    const applyAccess = () => {
        props.showLoading(true);
        UserService.grantAccess(sessionKey, currentObserved.id, email, role, relationshipId).then(saveResult => {
            props.showLoading(false);
            props.displaySnackbar(saveResult.severity, saveResult.message);
            props.closeAccessSection();
        });
    }

    const closeAccessSection = () => {
        props.closeAccessSection();
    }

    const disableSubmit = email.trim() === '';


    return (
            
        
        <Grid
            container
            direction="row"
            spacing={3}
        >
            <Grid item xs={12}>
                <Typography variant="h6">
                    Grant Access  
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
                <TextField 
                    fullWidth={true}
                    name="email" 
                    value={email} 
                    label="Observer's Email" 
                    onChange={(e) => setEmail(e.target.value)}
                />
            </Grid>

            <Grid item xs={12}>
                <FormControl fullWidth={true}>
                    <FormLabel id="role-label">Role</FormLabel>
                        <Select
                            labelId="role-label"
                            value={role}
                            onChange={handleRoleChange}
                            id="role"
                        >
                            {displayRoles()}
                        </Select>
                </FormControl>
            </Grid>

            <Grid item xs={12}>
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

            <Grid item xs={12}>
                <Grid container item xs={12}>
                    <Grid item xs={6}>
                        <Button 
                            variant="contained" 
                            color="success" 
                            onClick={applyAccess} 
                            disabled={disableSubmit}
                        >
                            Grant Access
                        </Button>
                    </Grid>
                    
                    <Grid item xs={6}  style={{textAlign: 'right'}}>
                        <Button 
                            variant="contained" 
                            color="primary" 
                            onClick={closeAccessSection}
                        >
                            Close
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
       
        </Grid>
    );
}

export default GrantAccess;
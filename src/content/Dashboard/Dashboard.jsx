import React, {useCallback , useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link as RouterLink  } from 'react-router-dom';

import { 
    Alert,
    Button, 
    Card, CardActions, CardContent, 
    Grid, 
    ToggleButton, ToggleButtonGroup, 
    Typography 
} from '@mui/material';

import { PageBreadcrumbs } from '../../components/breadcrumbs';
import { ExportButton, IncidentButton } from '../../components/button';
import { getCurrentRole, setDisabledObserved } from '../../actions/observedActions';
import ObservedService from '../../services/ObservedService';

import { IncidentGrid } from '../../components/grid';
import ABCWordCloud from './ABCWordCloud';
import ABCList from './ABCList';

import { ROLE_ENTRY, ROLE_LOG } from '../../utils/constants';

const toggleItems = [
    { value: 7, label: 'Last 7 Days' },
    { value: 30, label: 'Last 30 Days' },
    { value: 90, label: 'Last 90 Days' },
    { value: 180, label: 'Last 180 Days' },
]

const Dashboard = () => {

    const globalState = useSelector(state => state);
    const dispatch = useDispatch();

    const sessionKey = globalState.userReducer.sessionKey;
    const observedId = globalState.observedReducer.observedId;

    const [period, setPeriod] = useState(7);
    const [incidents, setIncidents] = useState([]);

    const incidentGridRef = useRef();

    const getIncidents = useCallback(() => {
        let start = new Date();
           
        start.setDate(start.getDate() - period);

        let startDate = start.getFullYear() 
                + '-' 
                + ('0' + (start.getMonth() + 1)).slice(-2) 
                + '-' 
                + ('0' + start.getDate()).slice(-2);

        ObservedService.getIncidents(sessionKey, observedId, startDate).then(result => {
            setIncidents(result);
        });
    }, [sessionKey, observedId, period]);

    useEffect(() => {
        if ( sessionKey !== '' && observedId > 0 ) {
            getIncidents();
        }
    }, [sessionKey, observedId, period, getIncidents]);

    useEffect(() => {
        dispatch(setDisabledObserved(false));
    }, [dispatch]);
   

    const handlePeriod = (event, newPeriod) => {
        setPeriod(newPeriod);
    };

    const exportLog = () => {
        incidentGridRef.current.exportToCsv();
    }

    const currentRole = getCurrentRole(globalState);
     
    return (
        <div className="content-container">
            <Grid
                container
                direction="row"
                style={{paddingBottom: '15px'}}
            >
                <Grid item xs={9} md={10}>
                    <PageBreadcrumbs page="Dashboard"/>
                </Grid>
               
                <Grid item xs={3} md={2} className="add-incident">
                    <IncidentButton disabled={globalState.observedReducer.observedId === 0 || currentRole === ROLE_LOG }/>
                </Grid>
            </Grid>

            {currentRole !== ROLE_ENTRY &&
            <Grid
                container
                direction="column"
                justify="center"
                alignItems="stretch"
                spacing={3}
            >
                <Grid item xs={12}>
                    <ToggleButtonGroup
                        color="primary"
                        value={period}
                        exclusive
                        onChange={handlePeriod}
                        size="small"
                    >
                        {
                            toggleItems.map(item => {
                                return  <ToggleButton value={item.value} key={item.label}>
                                            {item.label}
                                        </ToggleButton>
                            })
                        }
                    </ToggleButtonGroup>
                </Grid>
                
                <Grid item xs={12}>
                    <Card variant="outlined">
                        <CardContent >
                            <Grid
                                container
                                direction="row"
                                justifyContent="space-between"
                                alignItems="center"
                            >
                                <Typography gutterBottom variant="h5" component="h2" style={{marginBottom: '24px'}}>
                                    Recent Incidents
                                </Typography>

                                <ExportButton onClick={exportLog}/>
                               
                            </Grid>

                            <div className="ag-theme-material" style={ {height: '300px', width: '100%'} }>
                                <IncidentGrid 
                                    ref={incidentGridRef}
                                    incidents={incidents}
                                />
                            </div>
                        </CardContent>

                        <CardActions>
                            <Button size="large" color="primary" component={RouterLink} to={"/log"}>
                                See All Incidents
                            </Button>
                        </CardActions>
                    </Card>
                </Grid>

                <Grid item xs={12}>
                    <Grid
                        container
                        direction="row"
                        alignItems="stretch"
                        spacing={3}
                    >
                        <Grid item xs={12} md={6}>
                            <Card variant="outlined" style={{height: '100%'}}>
                                <CardContent >
                                    <Typography gutterBottom variant="h5" component="h2" style={{marginBottom: '24px'}}>
                                        Top ABC Combinations
                                    </Typography>

                                    <Grid
                                        container
                                        direction="row"
                                        alignItems="stretch"
                                        spacing={3}
                                    >
                                        <Grid item xs={12} md={6}>
                                            <ABCList 
                                                title="Antecedent - Behavior" 
                                                incidents={incidents}
                                            />
                                        </Grid>

                                        <Grid item xs={12} md={6}>
                                            <ABCList 
                                                title="Behavior - Consequence" 
                                                incidents={incidents}
                                            />
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Card variant="outlined" style={{height: '100%'}}>
                                <CardContent >
                                    <Typography gutterBottom variant="h5" component="h2" style={{marginBottom: '24px'}}>
                                        ABC Frequency
                                    </Typography>

                                    <ABCWordCloud incidents={incidents}/>
                                
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            }
            {currentRole === ROLE_ENTRY &&
            <Grid
                container
                direction="column"
                justify="center"
                alignItems="stretch"
                spacing={3}
            >
                <Grid item xs={12}>
                    <Alert severity="info">You are not authorized to access Dashboard for {globalState.observedReducer.observed.observedNm}</Alert>
                </Grid>

            </Grid>
            }
        </div>
    )
}

export default Dashboard;
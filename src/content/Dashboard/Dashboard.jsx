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
import Box from '@mui/material/Box';

import { PageBreadcrumbs } from '../../components/breadcrumbs';
import ObservedList from '../../components/observed/ObservedList';
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
    //{ value: 180, label: 'Last 180 Days' },
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

            <Box sx={{ mb: 1, pt: 1, display: 'flex', flexDirection: { xs: 'column' }, flexGrow: 1, borderBottom: 1, borderColor: '#dddddd' }}>
                <Box sx={{ flexGrow: 1, pb: 1 }}>
                    <PageBreadcrumbs page="Dashboard"/>
                </Box>

                <Box sx={{ mb: 1, pt: 1, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, flexGrow: 1, justifyContent: 'space-between' }}>

                    <Box sx={{ pb: 1 }}>
                        <ObservedList/>
                    </Box>

                    {currentRole !== ROLE_LOG && globalState.observedReducer.observedId !== 0 &&
                    <Box sx={{ flexGrow: 0, pb: 1 }}>
                        <IncidentButton/>
                    </Box>
                    }

                </Box>
            </Box>
           
            {currentRole !== ROLE_ENTRY &&
            <Box sx={{ mb: 1, pt: 1, display: 'flex', flexDirection: { xs: 'column' }, flexGrow: 1 }}>

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

                    <Card variant="outlined" sx={{ mt: 2 }}>
                        <CardContent >

                            <Box sx={{ mb: 1, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, flexGrow: 1, justifyContent: 'space-between' }}>
                                <Typography gutterBottom variant="h5" component="h2">
                                    Recent Incidents
                                </Typography>

                                <Box sx={{ display: 'flex', flexGrow: 0 }}>
                                    <ExportButton onClick={exportLog}/>
                                </Box>
                            </Box>
                           
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

                    <Card variant="outlined" sx={{ mt: 2 }}>
                        <CardContent >
                            <Typography gutterBottom variant="h5" component="h2">
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

                    <Card variant="outlined" sx={{ mt: 2 }}>
                        <CardContent >
                            <Typography gutterBottom variant="h5" component="h2">
                                ABC Frequency
                            </Typography>

                            <ABCWordCloud incidents={incidents}/>
                                
                        </CardContent>
                    </Card>
                
            </Box>

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
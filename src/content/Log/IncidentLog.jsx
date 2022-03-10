import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';

import ObservedList from '../../components/observed/ObservedList';
import { PageBreadcrumbs } from '../../components/breadcrumbs';
import { ExportButton, IncidentButton } from '../../components/button';
import ObservedService from '../../services/ObservedService';

import FilterDialog from './FilterDialog';

import { IncidentGrid } from '../../components/grid';

import { getCurrentRole, setDisabledObserved } from '../../actions/observedActions';

import { ROLE_LOG } from '../../utils/constants';


const initialFilter = {
    fromDate: null, 
    toDate: new Date(),
    fromDuration: '',
    toDuration: '',
    intensities: [],
    locations: [],
}

const IncidentLog = ({showLoading}) => {

    const gridRef = useRef(null);
    const incidentGridRef = useRef();

    const globalState = useSelector(state => state);
    const sessionKey = globalState.userReducer.sessionKey;
    const observed = globalState.observedReducer.observed;
    const dispatch = useDispatch();

   
    const handleResize = () => {
        if ( gridRef !== null && gridRef.current ) {
            let extraHeight = 215;

            extraHeight += 55;
           
            gridRef.current.style.height = (window.innerHeight - extraHeight) + 'px';
        }
    }

    const [incidents, setIncidents] = useState([]);
    const [filteredIncidents, setFilteredIncidents] = useState([]);
    const [filters, setFilters] = useState(initialFilter);
    const [openFilter, setOpenFilter] = useState(false);
   
    const currentRole = getCurrentRole(globalState);

    useEffect(() => {
        
        dispatch(setDisabledObserved(false));

        if ( sessionKey !== '' && observed.id > 0 ) {
            showLoading(true);
            ObservedService.getIncidents(sessionKey, observed.id).then(result => {
                setIncidents(result);
                setFilteredIncidents(result);
                showLoading(false);
            });
        }

        handleResize();
        
        window.addEventListener("resize", handleResize);

        return function cleanup() {
            window.removeEventListener("resize", handleResize);
        };
   
    }, [sessionKey, observed, dispatch, showLoading]);
    
    const exportLog = () => {
        // Using AG-Grid export to CSV feature.  This exports what is currently shown.
        // window.location.href = process.env.REACT_APP_API_BASE_URL + 'exportIncidents.xls?obsId=' + observedId;
        incidentGridRef.current.exportToCsv();
    }

    const resetIncidents = () => {
        setFilteredIncidents(incidents);
        setFilters(initialFilter);
        setOpenFilter(false);
    }
       
    const filterIncidents = (incomingFilters) => {
        let results = [];

        const fromDate = getMillis(incomingFilters.fromDate);
        const toDate = getMillis(incomingFilters.toDate);

        const fromDuration = reformatDuration(incomingFilters.fromDuration);
        const toDuration = reformatDuration(incomingFilters.toDuration);
        
        incidents.forEach(incident => {

            if ( incomingFilters.intensities.length > 0 && ! incomingFilters.intensities.includes(incident.intensity) ) {
                return;
            }

            if ( incomingFilters.locations.length > 0 && ! incomingFilters.locations.includes(incident.location) ) {
                return;
            }

            if ( invalidDate(fromDate, toDate, incident.incidentDt) ) {
                return;
            }

            if ( invalidDuration(fromDuration, toDuration, incident.duration) ) {
                return;
            }
          
            results.push(incident);
        });

        setFilteredIncidents(results);
        setFilters(incomingFilters);
        setOpenFilter(false);
    }

    const openIncidentFilter = () => {
        setOpenFilter(true);
    }

    const closeIncidentFilter = () => {
        setOpenFilter(false);
    }

    const getMillis = (date) => {
        return date ? date.getTime() : null;
    }

    const invalidDate = (fromDate, toDate, incidentDate) => {
        if ( fromDate && incidentDate < fromDate ) {
            return true;
        }

        if ( toDate && incidentDate > toDate ) {
            return true;
        }
    }

    const invalidDuration = (fromDuration, toDuration, incidentDuration) => {
        return ( fromDuration > 0 && incidentDuration < fromDuration ) ||
                        ( toDuration > 0 && incidentDuration > toDuration );
    }

    const reformatDuration = (duration) => {
        if ( ! duration ) {
            return 0;
        }

        let len = duration.length;
    
        if ( len === 0 ) {
            return 0;
        }
           
        let tempDuration = duration;
    
        let colonIdx = duration.indexOf(":");
        if ( colonIdx === -1 ) {
            if ( len < 3 ) {
                tempDuration= "00:" + ("0" + tempDuration).slice(-2);
                len = 5;
            }
            else if ( len === 3 || len === 4 ) {
                // insert colon two from back
                colonIdx = len - 2;
                tempDuration = tempDuration.substring(0,colonIdx) + ":" + tempDuration.substring(colonIdx);
                len++;
            }
            else {
                return 0;
            }
        }
    
        // Check for dot and minus as these are valid in numbers
        if ( len < 3 || len > 6 || tempDuration.indexOf(".") > -1 || tempDuration.indexOf("-") > -1 ) {
            return 0;
        }
               
        let parts = tempDuration.split(":");
        if ( parts.length !== 2 || isNaN(parts[0]) || isNaN(parts[1]) ) {
            return 0;
        }
           
        return (Number(parts[0]) * 60) + Number(parts[1]);
    }

    const deleteChip = (chipIdx) => {
        console.log("delete chip");

    }

    return (
        <div className="content-container">
            <Box sx={{ mb: 1, pt: 1, display: 'flex', flexDirection: { xs: 'column' }, flexGrow: 1, borderBottom: 1, borderColor: '#dddddd' }}>
                <Box sx={{ flexGrow: 1, pb: 1 }}>
                    <PageBreadcrumbs page="Incident Log"/>
                </Box>

                <Box sx={{ mb: 1, pt: 1, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, flexGrow: 1, justifyContent: 'space-between' }}>
                    <Box sx={{ pb: 1 }}>
                        <ObservedList/>
                    </Box>

                    <Box sx={{ flexGrow: 0, pb: 1 }}>
                        <ExportButton onClick={exportLog} style={{marginRight: '25px'}}/>

                        {currentRole !== ROLE_LOG &&
                        <IncidentButton/>
                        }
                    </Box>
                </Box>
            </Box>

            <Box sx={{ mb: 1, pt: 1, display: 'flex', flexDirection: { xs: 'row' }, flexGrow: 1, justifyContent: 'wrap' }}>
                <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={openIncidentFilter}
                >
                    Filter
                </Button>

                {/*<Stack direction="row" spacing={1} sx={{ml: 2}}>
                    <Chip label="Deletable" onDelete={deleteChip} />
                    </Stack>*/}
            </Box>

            <div className="ag-theme-material" style={ {height: '500px', width: '100%', paddingTop: '10px'} } ref={gridRef}>
                <IncidentGrid 
                    ref={incidentGridRef}
                    incidents={filteredIncidents}
                />
            </div>


            {openFilter && 
                <FilterDialog
                    openFl={openFilter}
                    locations={observed.locations ? observed.locations.filter(l => { return l.valueId > 0 }) : []}
                    filterIncidents={filterIncidents}
                    resetIncidents={resetIncidents}
                    handleClose={closeIncidentFilter}
                    filters={filters}
                />
            }
        </div>
    )
}

export default IncidentLog;
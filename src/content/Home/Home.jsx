import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import { 
    Button, Card, CardContent, CardHeader,
    Grid, 
    Typography 
} from '@mui/material';

import { PageBreadcrumbs } from '../../components/breadcrumbs';
import { DashboardButton, IncidentButton } from '../../components/button';
import { getCurrentRole, setDisabledObserved } from '../../actions/observedActions';

import { ROLE_ENTRY, ROLE_LOG } from '../../utils/constants';

const Home = () => {

    const globalState = useSelector(state => state);
       
    const sessionKey = globalState.userReducer.sessionKey;

    const userSignedIn = sessionKey !== '';

    const dispatch = useDispatch();

    useEffect(() => {
        if ( userSignedIn ) {
            dispatch(setDisabledObserved(false));
        }
    }, [userSignedIn, dispatch]);

    const currentRole = getCurrentRole(globalState);
    
    return (
        <div className="home-page" style={{padding: '25px'}}>
            {userSignedIn &&
            <Grid
                container
                direction="row"
                style={{borderBottom: '1px solid #dddddd', paddingBottom: '15px'}}
            >
                <Grid item xs={7} md={8}>
                    <PageBreadcrumbs page="Home"/>
                </Grid>
               
                <Grid item xs={5} md={4} className="add-incident">
                    <DashboardButton style={{marginRight: '25px'}} disabled={currentRole === ROLE_ENTRY}/>

                    <IncidentButton disabled={globalState.observedReducer.observedId === 0 || currentRole === ROLE_LOG}/>
                </Grid>
            </Grid>
            }

            <Card variant="outlined" style={{marginTop: '25px'}}>
                <CardHeader title="Features" style={{color: '#1565c0'}}></CardHeader>
                <CardContent style={{paddingTop: '0'}}>
                    <Typography variant="subtitle1" style={{lineHeight: '30px', fontSize: '1.1rem'}}>
                    <b>ABC Data Collector</b> provides a fast and simple way to track <b>A</b>ntecedent, <b>B</b>ehavior and <b>C</b>onsequence (ABC) events on your PC or Mobile phone.
                    </Typography>

                    <ul style={{marginTop: '10px', lineHeight: '30px', fontSize: '1.1rem'}}>
                        <li>Save the date, time, duration, intensity, location and ABCs for behavior events to allow for analysis of trends.</li>
                        <li>Customize Antecedents, Behaviors, Consequences and Locations by Observed. </li>
                        <li>Data is accessible anywhere and can be shared with other ABC Data Collector users.</li>
                        <li>Provide access to those involved with the Observed.&nbsp;&nbsp;Limit access to Entry, Log or both.</li>
                        <li>Ability to track multiple Observed.</li>
                        <li>Export Log to MS Excel to leverage its advanced analytical capability.</li>
                        <li>Print customized data collection sheets for those without PC or mobile access.</li>
                        <li>ABC Data Collector keeps no identifying personal information - no names, birthdates, or addresses.</li>
                    </ul>
			
                </CardContent>
            </Card>

            <Card style={{marginTop: '30px'}} variant="outlined">
                <CardHeader title="Use Case" style={{color: '#1565c0'}}></CardHeader>
                <CardContent style={{paddingTop: '0'}}>
                    <Typography variant="subtitle1" className="home-page-text">
                        A mother wants to log her son's behaviors.&nbsp;&nbsp;She registers as an <b>ABC Data Collector</b> user and defines her son as an observed.&nbsp;&nbsp;
	                    She is now the administrator for her son, the observed.&nbsp;&nbsp;She can customize the list of Antecedents, Behaviors, Consequences and Locations that
	                    best fit her son.&nbsp;&nbsp;She can enter behavior incidents and view his behavior log.
			        </Typography>

                    <Typography variant="subtitle1" className="home-page-para home-page-text">
                        Likely, there are other people who are involved in her son's daily activities.&nbsp;&nbsp;Perhaps they don't mind helping log her son's behaviors.&nbsp;&nbsp;
                        This can be accomplished in two ways.&nbsp;&nbsp;The mother can use <b>ABC Data Collector</b> to print out customized data entry sheets and give them to the others.&nbsp;&nbsp;  
                        They can fill the sheets out and return to her.&nbsp;&nbsp;She then enters the data.&nbsp;&nbsp;Alternatively, they can register as users and the mother grants 
                        them access to her son.&nbsp;&nbsp;Once the mother grants access, her son will be accessible to them when they sign in.
	                </Typography>

                    <Typography variant="subtitle1" className="home-page-para home-page-text">
                        In our example, her son's teacher and aide at school register as users.&nbsp;&nbsp;
	                    The mother then grants them access to her son.&nbsp;&nbsp;She grants the teacher access to ENTRY and LOG, and the aide access to ENTRY.&nbsp;&nbsp;
	                    The teacher would be able to enter behavior incidents and view the log of all incidents, while the aide would only be able to enter incidents.&nbsp;&nbsp;
	                    The teacher and the aide can use either a PC or their Mobile phones to enter behavior incidents.
		            </Typography>

                    <Typography variant="subtitle1" className="home-page-para home-page-text">
                        <b>ABC Data Collector</b> is designed to make data entry fast and simple.&nbsp;&nbsp;An entry must consist of the Date and Time and at least one Antecedent, at least one Behavior and at least one Consequence.&nbsp;&nbsp;
	                    Optionally, the User can provide the Duration of the incident; the Intensity; the Location; and a Description.
	                </Typography>

                    <Typography variant="subtitle1" className="home-page-para home-page-text">
                        To complete our example, the school has a Behavior Analyst.&nbsp;&nbsp;The mother could provide the Analyst with access to the her son's behavior log in one of two ways.&nbsp;&nbsp;
	                    Export the log to MS Excel then email or print it.&nbsp;&nbsp;Alternatively, the Analyst can register as a user and the mother can grant access to the Analyst.&nbsp;&nbsp;Since the Analyst only needs to view the behavior log the mother would grant LOG access.&nbsp;&nbsp;
	                    Accessing the log through <b>ABC Data Collector</b> allows the Analyst to see an up to date log without being dependent on someone else to provide it.&nbsp;&nbsp;The Analyst can export the data to MS Excel to make use of its powerful features.
	                </Typography>
                </CardContent>
            </Card>

            {!userSignedIn &&
                 <Grid
                 container
                 direction="column"
                 spacing={2}
                 style={{textAlign: 'center', paddingTop: '25px'}}
             >
                <Grid item xs={2} md={2}>
                    <Button 
                            variant="contained" 
                            color="success" 
                            component={Link} to={"/register"}>Register
                    </Button>

                </Grid>
                <Grid item xs={2} md={2}>
                    <Button 
                            color="primary" 
                            component={Link} to={"/signin"}>Already a user? Sign In.
                        </Button>

                    </Grid>
                </Grid>
            }
          
        </div>
    )

}

export default Home;
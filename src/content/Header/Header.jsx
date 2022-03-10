import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

import HelpIcon from '@mui/icons-material/Help';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SettingsIcon from '@mui/icons-material/Settings';

import UserService from '../../services/UserService';
import { checkStaySignedIn, setSession } from '../../actions/userActions';
import { getObservedList, setDisabledObserved, setObserved, setObservedList } from '../../actions/observedActions';

import { SESSION_TOKEN, COOKIE_SIGNED_IN_KEY } from '../../utils/constants';

const Header = () => {

    const navigate = useNavigate();
    
    const dispatch = useDispatch();

    const globalState = useSelector(state => state);
       
    const sessionKey = globalState.userReducer.sessionKey;

    const userSignedIn = sessionKey !== '';
    
    if ( ! userSignedIn ) {
        checkStaySignedIn(globalState, dispatch, navigate);
    }

    const [settingsAnchorEl, setSettingsAnchorEl] = React.useState(null);
                
    useEffect(() => {
        if ( userSignedIn ) {
            getObservedList(dispatch, sessionKey);
        }
    }, [userSignedIn, sessionKey, dispatch]);
   
    const handleTitleClick = () => {
        navigate("/");
    }

    const handleSignOutClick = () => {

        document.cookie = COOKIE_SIGNED_IN_KEY + "=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";

        UserService.signOut(sessionKey).then(result => {

            dispatch(setSession({
                username: '',
                sessionKey:  '',
                id: 0,
                email: '',
                startPage: ''
            }));

            dispatch(setDisabledObserved(false));
            dispatch(setObserved({id: 0}));
            dispatch(setObservedList([]));

            sessionStorage.removeItem(SESSION_TOKEN);

            setSettingsAnchorEl(null);

            navigate("/");
        });
    }

    const handleSettingsClick = () => {
        setSettingsAnchorEl(null);
        navigate("/settings");
    }
   
    const handleSettingsMenuClick = (event) => {
        setSettingsAnchorEl(event.currentTarget);

    }

    const handleHelpClick = () => {
        setSettingsAnchorEl(null);
        window.open("/help");
    }

    const displayMenuLinks = () => {

        return  userSignedIn
            ?   <div>
                  
                    <IconButton color="inherit" 
                            aria-controls="simple-menu" 
                            aria-haspopup="true" 
                            onClick={handleSettingsMenuClick} 
                            size="large"
                     >
                        <AccountCircleIcon/>
                    </IconButton>
                        
                    <Menu
                            id="settings-menu"
                            anchorEl={settingsAnchorEl}
                            keepMounted
                            open={Boolean(settingsAnchorEl)}
                            onClose={() => setSettingsAnchorEl(null)}
                    >
                        <MenuItem
                            key="settings-menu-item"
                            onClick={() => handleSettingsClick()}
                        >
                            <ListItemIcon>
                                <SettingsIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText>Settings</ListItemText>
                        </MenuItem>

                        <MenuItem
                            key="help-menu-item"
                            onClick={() => handleHelpClick()}
                        >
                            <ListItemIcon>
                                <HelpIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText>Help</ListItemText>
                        </MenuItem>

                        <Divider />

                        <MenuItem
                            key="sign-out-menu-item"
                            onClick={() => handleSignOutClick()}
                        >
                            Sign Out
                        </MenuItem>
                    </Menu>
                
                </div>
            :   <div>
                    <Button color="inherit" component={Link} to={"/signin"}>Sign In</Button>
                    <Button color="inherit" component={Link} to={"/register"}>Register</Button>
                </div>;
    }
       
  
    return (

        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="fixed">
                <Toolbar style={{paddingLeft: '15px', paddingRight: '15px'}}>
                    <Typography variant="h6" component="div" sx={{ flexGrow: { xs: 0, md: 1 } }}>
                        <div className="header">
                            <div className="title" onClick={handleTitleClick}>
                                <div className="title-image"></div>
                                <Box component="div" className="title-text" sx={{ display: { xs: 'none', md: 'inline' } }}>Data Collector</Box>  
                                <Box component="div" className="title-text-stacked" sx={{ display: { xs: 'flex', md: 'none' }, flexDirection: 'column', pt: 2 }}><span>Data</span><span>Collector</span></Box>  
                            </div>
                        </div>
                    </Typography>
                   
                    <Box sx={{ display: { xs: 'none', md: 'flex' }, flexGrow: 0 }}>
                        {displayMenuLinks()}
                    </Box>

                    <Box sx={{ display: { xs: 'flex', md: 'none' }, flexGrow: 1, justifyContent: 'flex-end' }}>
                        {displayMenuLinks()}
                    </Box>
                   
                </Toolbar>
            </AppBar>
       </Box> 


    );
}

export default Header;

//  {headerLinksDiv}
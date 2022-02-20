import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import HelpIcon from '@mui/icons-material/Help';
import ObservedIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';

import UserService from '../../services/UserService';
import { checkStaySignedIn, setSession } from '../../actions/userActions';
import { getObserved, getObservedList, setDisabledObserved, setObserved, setObservedList } from '../../actions/observedActions';

import { SESSION_TOKEN, COOKIE_SIGNED_IN_KEY } from '../../utils/constants';

const Header = () => {

    const navigate = useNavigate();
    
    const dispatch = useDispatch();

    const globalState = useSelector(state => state);
       
    const sessionKey = globalState.userReducer.sessionKey;

    const observedList = globalState.observedReducer.observedList;

    const userSignedIn = sessionKey !== '';
    
    if ( ! userSignedIn ) {
        checkStaySignedIn(globalState, dispatch, navigate);
    }

    const [anchorEl, setAnchorEl] = React.useState(null);
    const [selectedIndex, setSelectedIndex] = React.useState(0);
       
    let observedDisabled = globalState.observedReducer.disableObserved || observedList.length === 0;
        
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

            navigate("/");
        });
    }

    const handleSettingsClick = () => {
        navigate("/settings");
    }
   
    const handleObservedClick = (event, index) => {
        setSelectedIndex(index);
        setAnchorEl(null);

        const observed = observedList[index];
        getObserved(dispatch, sessionKey, observed.id);
    };

    const handleObservedMenuClose = () => {
        setAnchorEl(null);
    };

    const handleObservedMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleHelpClick = () => {
        window.open("/help");
    }
       
    const headerLinksDiv = ! userSignedIn
            ?   <div>
                    <Button color="inherit" component={Link} to={"/signin"}>Sign In</Button>
                    <Button color="inherit" component={Link} to={"/register"}>Register</Button>
                </div>
            :   <div>

                    <div style={{display: 'inline-block', marginRight: '15px'}}>
                        <Button color="inherit" 
                            aria-controls="simple-menu" 
                            aria-haspopup="true" 
                            onClick={handleObservedMenuClick} 
                            startIcon={<ObservedIcon/>}
                            endIcon={<ArrowDropDownIcon/>}
                            disabled={observedDisabled}
                        >
                            {globalState.observedReducer.observed.observedNm}
                        </Button>
                        <Menu
                            id="observed-menu"
                            anchorEl={anchorEl}
                            keepMounted
                            open={Boolean(anchorEl)}
                            onClose={handleObservedMenuClose}
                        >
                        
                            {observedList.map((option, index) => (
                            <MenuItem
                                key={option.id}
                                selected={index === selectedIndex}
                                value={option.id}
                                onClick={(event) => handleObservedClick(event, index)}
                            >
                                {option.observedNm}
                            </MenuItem>
                            ))}
                        </Menu>
                    </div>
                                       
                    <IconButton
                        edge="end"
                        onClick={handleSettingsClick}
                        color="inherit"
                        style={{marginRight: '5px'}}
                    >
                        <SettingsIcon/>
                    </IconButton>

                    <IconButton
                        edge="end"
                        onClick={handleHelpClick}
                        color="inherit"
                        style={{marginRight: '5px'}}
                    >
                        <HelpIcon/>
                    </IconButton>
                    
                    <Button color="inherit" onClick={handleSignOutClick}>Sign Out</Button>
                </div>
            ;

    return (

        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="fixed">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        <div className="header">
                            <div className="title" onClick={handleTitleClick}>
                                <div className="title-image"></div>
                                <div className="title-text">Data Collector</div>  
                            </div>
                        </div>
                    </Typography>

                    {headerLinksDiv}
                </Toolbar>
            </AppBar>
        </Box>


    );
}

export default Header;
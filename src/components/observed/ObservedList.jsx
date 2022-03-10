import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

import { getObserved } from '../../actions/observedActions';

const ObservedList = () => {

    const dispatch = useDispatch();
    const globalState = useSelector(state => state);
       
    const sessionKey = globalState.userReducer.sessionKey;

    const observedList = globalState.observedReducer.observedList;

    const [anchorEl, setAnchorEl] = React.useState(null);
    const [selectedIndex, setSelectedIndex] = React.useState(0);

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


    return (
        <div style={{display: 'inline-block'}}>
            <Button 
                variant="contained" 
                color="primary" 
                aria-controls="simple-menu" 
                aria-haspopup="true" 
                onClick={handleObservedMenuClick} 
                endIcon={<KeyboardArrowDownIcon/>}
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
    );
}

export default ObservedList;
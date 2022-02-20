import UserService from '../services/UserService';
import { setDisabledObserved } from './observedActions';
import { SET_SESSION_KEY, SET_SETTINGS, SET_USER_NAME } from '../reducers/userReducer';

import { SESSION_TOKEN, COOKIE_SIGNED_IN_KEY } from '../utils/constants';

export const setSession = (userSession) => {

    return {
        type: SET_SESSION_KEY,
        user: userSession.username,
        key: userSession.sessionKey,
        userId: userSession.id,
        email: userSession.email,
        startPage: userSession.startPage
    }
}

export const setSettings = (email, startPage) => {
    return {
        type: SET_SETTINGS,
        email: email,
        startPage: startPage
    }
}

export const setUsername = (username) => {
    return {
        type: SET_USER_NAME,
        user: username
    }
}

export const checkStaySignedIn = (state, dispatch, navigate) => {

    const sessionKey = state.userReducer.sessionKey;

    if ( sessionKey !== '' ) {
        return;
    }

    const signedInKey = document.cookie.split("; ").reduce((r, v) => {
        const parts = v.split("=");
        return parts[0] === COOKIE_SIGNED_IN_KEY ? decodeURIComponent(parts[1]) : r;
    }, "");

    if ( signedInKey && signedInKey.trim() !== '' ) {

        UserService.checkStaySignedIn(signedInKey).then(result => {

            if ( result.id > 0 ) {
                dispatch(setSession(result));
                dispatch(setDisabledObserved(false));
        
                const expireMillis = Number(process.env.REACT_APP_EXPIRE_MILLIS);
                        
                // Use the browser's time so it is not affected by time zone
                let sessionToken = result.sessionKey + ':' + (new Date().getTime() + expireMillis);
        
                sessionStorage.setItem(SESSION_TOKEN, sessionToken);
        
                navigate(result.startPage === 'ENTRY' ? "/entry" : "/dashboard");
            }
            
        });
    }
           
}
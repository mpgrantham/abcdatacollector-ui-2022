import { SET_OBSERVED, SET_OBSERVED_LIST, SET_DISABLE_OBSERVED } from '../reducers/observedReducer';
import ObservedService from '../services/ObservedService';
import UserService from '../services/UserService';

import { ROLE_ADMIN } from '../utils/constants';

export const setObserved = (observed) => {
    return {
        type: SET_OBSERVED,
        observed: observed
    }
}

export const setObservedList = (observedList) => {
    return {
        type: SET_OBSERVED_LIST,
        observedList: observedList
    }
}

export const setDisabledObserved = (disableObserved) => {
    return {
        type: SET_DISABLE_OBSERVED,
        disableObserved: disableObserved
    }
}

// Helper method to perform get followed by dispatch.  Works like a thunk.
export const getObserved = (dispatch, sessionKey, observedId) => {
    ObservedService.getObserved(sessionKey, observedId).then(observedResult => {
        dispatch(setObserved(observedResult));
    });
}

export const getObservedList = (dispatch, sessionKey) => {
    UserService.getUserObserved(sessionKey).then(observedListResult => {
        let observed = {id: 0};
       
        if( observedListResult.length > 0 ) {
            observed = observedListResult[0];
        } 
        
        dispatch(setObservedList(observedListResult));

        getObserved(dispatch, sessionKey, observed.id);
    });
}

/*
* Helper function to return the Observers role for the current selected Observed
*/
export const getCurrentRole = (state) => {

    const reducer = state.observedReducer;

    const observedId = reducer.observedId;

    const observedList = reducer.observedList;

    const observed = observedList.find(r => { return r.id === observedId });

    return observed ? observed.role : ROLE_ADMIN;
}
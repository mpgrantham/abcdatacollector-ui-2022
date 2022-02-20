export const SET_INCIDENT = 'SET_INCIDENT';
export const SET_EDIT_DISABLED = 'SET_EDIT_DISABLED';
export const SET_SNACKBAR = 'SET_SNACKBAR';


export const INITIAL_VIEW_STATE = {
    incident: {}, 
    editDisabled: false,
    snackbarFl: false,
    snackbarMessageSeverity: 'success',
    snackbarMessage: ''
};

export const viewReducer = (state = INITIAL_VIEW_STATE, action = {}) => {

    if ( action.type === SET_INCIDENT ) {
        return {
            ...state,
            incident: action.incident
        };
    }

    if ( action.type === SET_SNACKBAR ) {
        return {
            ...state,
            snackbarFl: action.snackbarFl,
            snackbarMessageSeverity: action.snackbarMessageSeverity,
            snackbarMessage: action.snackbarMessage
        };
    }

    if ( action.type === SET_EDIT_DISABLED ) {
        return {
            ...state,
            editDisabled: action.editDisabled
        };
    }
   
    return state;
}
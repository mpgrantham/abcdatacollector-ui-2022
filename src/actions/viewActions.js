import { SET_INCIDENT, SET_EDIT_DISABLED, SET_SNACKBAR } from '../reducers/viewReducer';

export const setIncident = (incident) => {
    return {type: SET_INCIDENT, incident: incident};
}

export const setEditDisabled = (editDisabled) => {
    return {type: SET_EDIT_DISABLED, editDisabled: editDisabled};
}

export const setSnackbar = (snackbarFl, snackbarMessageSeverity, snackbarMessage) => {
    return {
        type: SET_SNACKBAR,
        snackbarFl: snackbarFl,
        snackbarMessageSeverity: snackbarMessageSeverity,
        snackbarMessage: snackbarMessage
    }
}

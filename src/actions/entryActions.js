import { SET_FIELD, SET_ABC, SET_DATA, SET_ERROR_MESSAGE, SET_ERROR_MESSAGES, SET_SNACKBAR } from '../reducers/entryReducer';

export const setField = (name, value) => {
    return {type: SET_FIELD, name: name, value: value};
}

export const setAbc = (name, value) => {
    return {type: SET_ABC, name: name, value: value};
}

export const setErrorMessage = (name, errorMessage) => {
    return {
        type: SET_ERROR_MESSAGE,
        name: name,
        errorMessage: errorMessage
    }
}

export const setErrorMessages = (messages) => {
    return {
        type: SET_ERROR_MESSAGES,
        messages: messages
    }
}

export const setData = (data) => {
    return {type: SET_DATA, data: data};
}

export const setSnackbar = (snackbarFl, snackbarMessageSeverity, snackbarMessage) => {
    return {
        type: SET_SNACKBAR,
        snackbarFl: snackbarFl,
        snackbarMessageSeverity: snackbarMessageSeverity,
        snackbarMessage: snackbarMessage
    }
}

export const SET_FIELD = 'SET_FIELD';
export const SET_DATA = 'SET_DATA';
export const SET_ERROR_MESSAGE = 'SET_ERROR_MESSAGE';
export const SET_ERROR_MESSAGES = 'SET_ERROR_MESSAGES';
export const SET_ABC = 'SET_ABC';
export const SET_SNACKBAR = 'SET_SNACKBAR';

export const INITIAL_ENTRY_STATE = {
    incidentDate: new Date(), 
    antecedents: [],
    behaviors: [],
    consequences: [],
    locationId: 0,
    intensityId: 0,
    duration: '',
    description: '',
    fieldErrorMessages: {},
    snackbarFl: false,
    snackbarMessageSeverity: 'success',
    snackbarMessage: ''
};

export const entryReducer = (state = INITIAL_ENTRY_STATE, action = {}) => {

    if ( action.type === SET_FIELD ) {
        return {
            ...state,
            [action.name]: action.value
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

    if ( action.type === SET_ABC ) {
        let values = state[action.name];

        values = values.includes(action.value) ? values.filter(c => c !== action.value) : [...values, action.value];

        return {
            ...state,
            [action.name]: values
        };
    }

    if ( action.type === SET_DATA ) {
        return action.data;
    }

    if ( action.type === SET_ERROR_MESSAGE ) {
        let messages = state.fieldErrorMessages;
       
        if ( action.errorMessage !== '' ) {
            messages[action.name] = action.errorMessage;
        } else {
            if (action.name in messages ) {
                delete messages[action.name];
            }
        }

        return {
            ...state,
            fieldErrorMessages: messages
        };
    }

    if ( action.type === SET_ERROR_MESSAGES ) {
        return {
            ...state,
            fieldErrorMessages: action.messages
        };
    }

    return state;
}
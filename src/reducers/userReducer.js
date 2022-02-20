export const SET_USER_NAME = 'SET_USER_NAME';
export const SET_SETTINGS = 'SET_SETTINGS';
export const SET_SESSION_KEY = 'SET_SESSION_KEY';

export const initialState = {
    userName: '', 
    id: 0, 
    sessionKey: '', 
    email: '', 
    startPage: ''
};

export const userReducer = (state = initialState, action = '') => {

    switch (action.type) {
        case SET_USER_NAME:
            return {
                ...state,
                userName: action.user
            };

        case SET_SETTINGS:
            return {
                ...state,
                email: action.email,
                startPage: action.startPage
            };

        case SET_SESSION_KEY:
            return {
                ...state,
                sessionKey: action.key,
                userName: action.user,
                email: action.email,
                startPage: action.startPage,
                id: action.userId,
                disableObserved: action.disableObserved
            };
               
        default:
            return state;
    }
}
export const SET_OBSERVED = 'SET_OBSERVED';
export const SET_OBSERVED_LIST = 'SET_OBSERVED_LIST';
export const SET_DISABLE_OBSERVED = 'SET_DISABLE_OBSERVED';

const initialObservedState = {
    observedId: 0, 
    observed: {}, 
    disableObserved: false,
    observedList: []
};

export const observedReducer = (state = initialObservedState, action = '') => {

    switch (action.type) {
        case SET_OBSERVED:
            return {
                ...state,
                observedId: action.observed.id,
                observed: action.observed
            };
        
        case SET_OBSERVED_LIST:
            return {
                ...state,
                observedList: action.observedList
            };

        case SET_DISABLE_OBSERVED:
            return {
                ...state,
                disableObserved: action.disableObserved
            };   

        default:
            return state;
    }

}
import { combineReducers } from "redux";

import { observedReducer } from './observedReducer';
import { userReducer } from './userReducer';

const reducer = combineReducers({
    userReducer,
    observedReducer
});

export default reducer;
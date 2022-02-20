import { DATA_STORE } from './constants';

export const loadState = () => {
    try {
        const serializedState = sessionStorage.getItem(DATA_STORE);
        if ( serializedState === null ) {
            return undefined;
        }

        return JSON.parse(serializedState);
    }
    catch ( ex ) {
        return undefined;
    }
}

export const saveState = (state) => {
    try {
        const serializedState = JSON.stringify(state);

        sessionStorage.setItem(DATA_STORE, serializedState);
    }
    catch ( ex ) {
        return undefined;
    }
}
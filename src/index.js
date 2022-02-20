import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import './index.css';

import App from './App';
import { loadState, saveState } from './utils/stateUtils';
import reducer from './reducers/reducer';
import reportWebVitals from './reportWebVitals';

const persistedState = loadState();
const store = createStore(reducer, persistedState);
store.subscribe(() => {
  saveState(store.getState());
})

ReactDOM.render(
   <BrowserRouter>
      <Provider store={store}>
        <App/>
      </Provider>
    </BrowserRouter>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

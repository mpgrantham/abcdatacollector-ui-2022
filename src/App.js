import React, {Suspense, useState} from 'react';
import { Routes, Route } from 'react-router-dom';
import Box from '@mui/material/Box';

import Header from './content/Header/Header';
import Home from './content/Home/Home';
import Reset from './content/SignIn/Reset';
import Reassign from './content/Settings/Reassign';
import SignIn from './content/SignIn/SignIn';
import SecuredRoute from './components/SecuredRoute';
import Register from './content/Register/Register';
import ConfirmRegister from './content/Register/ConfirmRegister';

import LoadingDialog from './components/LoadingDialog';

const Dashboard = React.lazy(() => import('./content/Dashboard/Dashboard'));
const IncidentLog = React.lazy(() => import('./content/Log/IncidentLog'));
const IncidentEntry = React.lazy(() => import('./content/Entry/IncidentEntry'));
const IncidentView = React.lazy(() => import('./content/Entry/IncidentView'));
const Settings = React.lazy(() => import('./content/Settings/Settings'));

function App() {

  const [loading, setLoading] = useState(false);
  
  return (
    
    <div className="root">

        <Suspense fallback={<div className="loading-div">Please wait...</div>}>

          <Header/>

          <Box className="content">
            <Routes>
              <Route exact path="/" element={<Home/>}/>
              <Route path="/signin" element={<SignIn showLoading={setLoading}/>}/>
              <Route path="/register" element={<Register showLoading={setLoading}/>}/>
              <Route path="/reset/:key" element={<Reset/>}/>
              <Route path="/reassign/:key" element={<Reassign/>}/>
              <Route path="/confirmRegister/:key" element={<ConfirmRegister/>}/>

              <Route
                exact path="/dashboard"
                element={
                  <SecuredRoute>
                    <Dashboard/>
                  </SecuredRoute>
                }
              />

              <Route
                path="/log"
                element={
                  <SecuredRoute>
                    <IncidentLog showLoading={setLoading}/>
                  </SecuredRoute>
                }
              />
                           
              <Route
                exact path="/entry"
                element={
                  <SecuredRoute>
                    <IncidentEntry showLoading={setLoading}/>
                  </SecuredRoute>
                }
              />

              <Route
                path="/entry/:id"
                element={
                  <SecuredRoute>
                    <IncidentEntry showLoading={setLoading}/>
                  </SecuredRoute>
                }
              />

              <Route
                path="/view/:id"
                element={
                  <SecuredRoute>
                    <IncidentView showLoading={setLoading}/>
                  </SecuredRoute>
                }
              />

              <Route
                path="/settings"
                element={
                  <SecuredRoute>
                    <Settings showLoading={setLoading}/>
                  </SecuredRoute>
                }
              />
            </Routes>
          </Box>
          
        </Suspense>

        <LoadingDialog openFl={loading}/>
    </div>

  );
}

export default App;
import React from 'react';
import { Navigate } from 'react-router-dom';
import { SESSION_TOKEN } from '../utils/constants';

function SecuredRoute({ children }) {
   
    function isSessionValid() {

        const sessionKey = sessionStorage.getItem(SESSION_TOKEN);
        
        if ( sessionKey ) {
            const parts = sessionKey.split(':');

            const currentTime = new Date().getTime();
            const expireTime = Number(parts[1]);
            
            return expireTime >= currentTime;
        }

        return false;
    }

    return isSessionValid() ? children : <Navigate to="/signin" />;
       
}

export default SecuredRoute;
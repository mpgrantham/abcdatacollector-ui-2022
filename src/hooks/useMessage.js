import { useState } from 'react';

/*
* Manage Snackbar or Alert messaging
*/
export const useMessage = () => {
    const [displayFlag, setDisplayFlag] = useState(false);
    const [severity, setSeverity] = useState('success');
    const [message, setMessage] = useState('');

    return [
        {
            displayFlag: displayFlag,
            message: message,
            severity: severity
        },
        function(inDisplayFlag, inMessage, inSeverity) {
            setDisplayFlag(inDisplayFlag);
            setMessage(inMessage);
            setSeverity(inSeverity);
        }
    ];
}
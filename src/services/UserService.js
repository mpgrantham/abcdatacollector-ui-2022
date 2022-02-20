import axios from 'axios';

const MY_ABC_API_URL = process.env.REACT_APP_API_BASE_URL;

const INITIAL_RESPONSE = {
    status: '',
    message: '',
    id: 0,
    username: '',
    sessionKey: '',
    email: '',
    startPage: '',
    staySignedInKey: null
};

const setResponse = (response) => {
    
    return {
        status: 'SUCCESS',
        message: '',
        id: response.data.id,
        username: response.data.userNm,
        sessionKey: response.data.sessionKey,
        email: response.data.email,
        startPage: response.data.startPage,
        staySignedInKey: response.data.staySignedInKey
    }
}


const UserService = {

    async register(data) {

        const url = MY_ABC_API_URL + 'registration';
       
        let resultObj = {
            status: '',
            message: ''
        }

        await axios.post(url, data)
            .then(response => {
                resultObj.status = 'success';
                resultObj.message = response.data.message
            })
            .catch (error => {
                resultObj.status = 'error';
                resultObj.message = error.response.data.message;
            });

        return resultObj;
    },

    async checkRegisterKey(key) {
        const url = MY_ABC_API_URL + 'registration?key=' + key;

        let resultObj = {
            message: '',
            severity: 'info'
        };
              
        await axios.get(url)
            .then(response => {
                resultObj.message = 'Confirm user registration';        
            })
            .catch (error => {
                resultObj.message = error.response.data.message;
                resultObj.severity = 'error';
            });

        return resultObj;
    },

    async confirmRegistration(key) {
        const url = MY_ABC_API_URL + 'registration';

        const data = {
            key: key
        }

        let resultObj = {
            message: '',
            severity: 'success'
        };
              
        await axios.put(url, data)
            .then(response => {
                resultObj.message = response.data.message;        
            })
            .catch (error => {
                resultObj.message = error.response.data.message;
                resultObj.severity = 'error';
            });

        return resultObj;
    },

    async checkStaySignedIn(signedInKey) {

        let resultObj = INITIAL_RESPONSE;
       
        const data = {
            key: signedInKey
        }
                
        const url = MY_ABC_API_URL + 'authentication/key';

        await axios.post(url, data)
            .then(response => {
                resultObj = setResponse(response);
            })
            .catch (error => {
                console.log()
        });
        
        return resultObj;
    },

    async signIn(username, password, staySignedIn) {

        const url = MY_ABC_API_URL + 'authentication';

        const data = {
            username: username,
            password: password,
            staySignedIn: staySignedIn
        }

        let resultObj = INITIAL_RESPONSE;

        await axios.post(url, data)
            .then(response => {
                resultObj = setResponse(response);
            })
            .catch (error => {
                resultObj.status = 'ERROR';
                resultObj.message = error.response.data.message;
            });

        return resultObj;

    },

    async sendForgot(email, forgotType) {
        const url = MY_ABC_API_URL + 'authentication/usernamePassword?email=' + email + '&forgotType=' + forgotType;

        let resultObj = {
            message: '',
            severity: 'info'
        };
              
        await axios.get(url)
            .then(response => {
                resultObj.message = response.data;        
            })
            .catch (error => {
                resultObj.message = error.response.data.message;
                resultObj.severity = 'error';
            });

        return resultObj;
    },

    async sendReassign(sessionKey, observedId, email) {
        const url = MY_ABC_API_URL + 'user/reassignment/' + observedId;
        
        const headers = {
            headers: {'Authorization': sessionKey}
        }

        const data = {
            email: email
        }

        let resultObj = {
            message: '',
            severity: 'info'
        };
              
        await axios.post(url, data, headers)
            .then(response => {
                resultObj.message = response.data.message;        
            })
            .catch (error => {
                resultObj.message = error.response.data.message;
                resultObj.severity = 'error';
            });

        return resultObj;
    },

    async checkResetKey(key) {
        const url = MY_ABC_API_URL + 'authentication/resetKey?key=' + key;

        let resultObj = {
            message: '',
            severity: 'info'
        };
              
        await axios.get(url)
            .then(response => {
                resultObj.message = response.data.message;        
            })
            .catch (error => {
                resultObj.message = error.response.data.message;
                resultObj.severity = 'error';
            });

        return resultObj;
    },

    async checkReassignKey(key) {
        const url = MY_ABC_API_URL + 'authentication/reassignment?key=' + key;

        let resultObj = {
            message: '',
            severity: 'info',
            observedName: ''
        };
              
        await axios.get(url)
            .then(response => {
                resultObj.message = 'Specify your relationship to the Observed';   
                resultObj.observedName = response.data.observedNm;     
            })
            .catch (error => {
                resultObj.message = error.response.data.message;
                resultObj.severity = 'error';
            });

        return resultObj;
    },

    async resetPassword(key, password) {
        const url = MY_ABC_API_URL + 'authentication/password';

        const data = {
            key: key,
            password: password
        }

        let resultObj = {
            message: '',
            severity: 'success'
        };
              
        await axios.post(url, data)
            .then(response => {
                resultObj.message = response.data.message;        
            })
            .catch (error => {
                resultObj.message = error.response.data.message;
                resultObj.severity = 'error';
            });

        return resultObj;
    },

    async reassignObserved(key, relationship) {
        const url = MY_ABC_API_URL + 'authentication/reassignment';

        const data = {
            key: key,
            relationship: relationship
        }

        let resultObj = {
            message: '',
            severity: 'success'
        };
              
        await axios.put(url, data)
            .then(response => {
                resultObj.message = response.data.message;        
            })
            .catch (error => {
                resultObj.message = error.response.data.message;
                resultObj.severity = 'error';
            });

        return resultObj;
    },

    async signOut(sessionKey) {
        const url = MY_ABC_API_URL + 'user/signOut';

        let resultObj = {
            status: '',
            message: ''
        }

        const headers = {
            headers: {'Authorization': sessionKey}
        }
        
        await axios.put(url, {}, headers)
            .then(response => {
                resultObj.status = 'SUCCESS';               
            })
            .catch (error => {
                resultObj.status = 'ERROR';
                resultObj.message = error.response.data.message;
            });

        return resultObj;
    },

    async getRelationships() {
        const url = MY_ABC_API_URL + 'lookup/relationships';

        let resultObj = [];
                     
        await axios.get(url)
            .then(response => {
                resultObj = response.data;        
            })
            .catch (error => {
               return [];
            });

        return resultObj;
    },

    async getUserObserved(sessionKey) {
        const url = MY_ABC_API_URL + 'observed/';

        let resultObj = [];

        const headers = {
            headers: {'Authorization': sessionKey}
        }
        
        await axios.get(url, headers)
            .then(response => {
                resultObj = response.data;        
            })
            .catch (error => {
               return [];
            });

        return resultObj;
    },

    async getObservers(sessionKey, observedId) {
        const url = MY_ABC_API_URL + 'user/observers/' + observedId;

        let resultObj = [];

        const headers = {
            headers: {'Authorization': sessionKey}
        }
        
        await axios.get(url, headers)
            .then(response => {
                resultObj = response.data;        
            })
            .catch (error => {
               return [];
            });

        return resultObj;
    },

    async saveSettings(sessionKey, email, startPage) {
        const url = MY_ABC_API_URL + 'user/settings';

        const data = {
            email: email,
            startPage: startPage
        }

        const headers = {
            headers: {'Authorization': sessionKey}
        }

        let resultObj = {
            severity: '',
            message: ''
        }

        await axios.put(url, data, headers)
            .then(response => {
                resultObj.severity = 'success';
                resultObj.message = 'Settings saved';
            })
            .catch (error => {
                resultObj.severity = 'error';
                resultObj.message = error.response.data.message;
            });

        return resultObj;
    },

    async changeUsername(sessionKey, username) {
        const headers = {
            headers: {'Authorization': sessionKey}
        }

        const url = MY_ABC_API_URL + 'user/username';

        const data = {
            username: username
        }

        let resultObj = {
            severity: '',
            message: ''
        }

        await axios.put(url, data, headers)
            .then(response => {
                resultObj.severity = 'success';
                resultObj.message = 'Username changed';
                resultObj.username = username;
            })
            .catch (error => {
                resultObj.severity = 'error';
                resultObj.message = error.response.data.message;
            });

        return resultObj;
    },

    async changePassword(sessionKey, currentPassword, password) {
        const headers = {
            headers: {'Authorization': sessionKey}
        }

        const url = MY_ABC_API_URL + 'user/password';

        const data = {
            currentPassword: currentPassword,
            password: password
        }

        let resultObj = {
            severity: '',
            message: ''
        }

        await axios.put(url, data, headers)
            .then(response => {
                resultObj.severity = 'success';
                resultObj.message = 'Password changed';
            })
            .catch (error => {
                resultObj.severity = 'error';
                resultObj.message = 'Password change failed';
            });

        return resultObj;
    },

    async saveObserved(sessionKey, observedId, observedNm, role, relationshipId) {

        let url = MY_ABC_API_URL + 'user/observed';

        const headers = {
            headers: {'Authorization': sessionKey}
        }

        const data = {
            observedId: observedId,
            observedName: observedNm,
            relationship: relationshipId,
            role: role
        }

        let resultObj = {
            severity: '',
            message: ''
        }

        if ( observedId === 0 ) {
            await axios.post(url, data, headers)
            .then(response => {
                resultObj.severity = 'success';
                resultObj.message = 'Observed added';   
            })
            .catch (error => {
                resultObj.severity = 'error';
                resultObj.message = error.response.data.message;
            });
        }
        else {
            await axios.put(url, data, headers)
            .then(response => {
                resultObj.severity = 'success';
                resultObj.message = 'Observed saved';   
            })
            .catch (error => {
                resultObj.severity = 'error';
                resultObj.message = error.response.data.message;
            });
        }
        

        return resultObj;
    },

    async grantAccess(sessionKey, observedId, email, role, relationshipId) {

        let url = MY_ABC_API_URL + 'user/access/' + observedId;

        const headers = {
            headers: {'Authorization': sessionKey}
        }

        const data = {
            email: email,
            relationship: relationshipId,
            role: role
        }

        let resultObj = {
            severity: '',
            message: ''
        }

        await axios.post(url, data, headers)
            .then(response => {
                resultObj.severity = 'success';
                resultObj.message = 'Access granted';   
            })
            .catch (error => {
                resultObj.severity = 'error';
                resultObj.message = error.response.data.message;
            });
        
        return resultObj;
    },

    async removeAccess(sessionKey, observedId, observedUserId) {

        let url = MY_ABC_API_URL + 'user/' + observedUserId + '/access/' + observedId;

        const headers = {
            headers: {'Authorization': sessionKey}
        }

        let resultObj = {
            severity: '',
            message: ''
        }

        await axios.delete(url, headers)
            .then(response => {
                resultObj.severity = 'success';
                resultObj.message = 'Access removed';   
            })
            .catch (error => {
                resultObj.severity = 'error';
                resultObj.message = error.response.data.message;
            });
        
        return resultObj;
    },

    async removeMe(sessionKey) {

        let url = MY_ABC_API_URL + 'user/remove';

        const headers = {
            headers: {'Authorization': sessionKey}
        }

        let resultObj = {
            severity: '',
            message: ''
        }

        await axios.delete(url, headers)
            .then(response => {
                resultObj.severity = 'success';
                resultObj.message = 'User removed';   
            })
            .catch (error => {
                resultObj.severity = 'error';
                resultObj.message = error.response.data.message;
            });
        
        return resultObj;
    }

}

export default UserService;
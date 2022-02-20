import axios from 'axios';

const MY_ABC_API_URL = process.env.REACT_APP_API_BASE_URL;

const ObservedService = {
 
    async getObserved(sessionKey, observedId) {

        const url = MY_ABC_API_URL + 'observed/' + observedId;

        let resultObj = {id: 0};

        const headers = {
            headers: {'Authorization': sessionKey}
        }
        
        await axios.get(url, headers)
            .then(response => {
                resultObj = response.data;        
            })
            .catch (error => {
               return resultObj;
            });

        return resultObj;
    },

    async getIncidents(sessionKey, observedId, fromDate) {

        let url = MY_ABC_API_URL + 'observed/' + observedId + '/incidents';
        if ( fromDate ) {
            url += '?start=' + fromDate;
        }

        let resultObj = {};

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

    async getIncident(sessionKey, observedId, incidentId) {

        let url = MY_ABC_API_URL + 'observed/' + observedId + '/incidents/' + incidentId;
        
        let resultObj = {};

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

    async getDataSheet(sessionKey, observedId) {

        let url = MY_ABC_API_URL + 'observed/' + + observedId + '/datasheet' ;

        let resultObj = {};

        const headers = {
            headers: {'Authorization': sessionKey}
        }
        
        await axios.get(url, headers)
            .then(response => {
                resultObj.pdfData = response.data;
            })
            .catch (error => {
               resultObj.message = 'Error downloading data sheet';
            });

        return resultObj;
    },

    async addAbc(sessionKey, observedId, typeCd, typeValue) {

        let url = MY_ABC_API_URL + 'observed/' + observedId + '/abc';

        const headers = {
            headers: {'Authorization': sessionKey}
        }

        const data = {
            typeCd: typeCd.charAt(0),
            typeValue: typeValue
        }

        let resultObj = {
            severity: '',
            message: ''
        }

        await axios.post(url, data, headers)
            .then(response => {
                resultObj.severity = 'success';
                resultObj.message = typeCd + ' saved';   
            })
            .catch (error => {
                resultObj.severity = 'error';
                resultObj.message = error.response.data.message;
            });

        return resultObj;
    },

    async saveAbc(sessionKey, observedId, valueId, typeCd, typeValue, activeFl) {

        let url = MY_ABC_API_URL + 'observed/' + observedId + '/abc';

        const headers = {
            headers: {'Authorization': sessionKey}
        }

        const data = {
            valueId: valueId,
            typeCd: typeCd.charAt(0),
            typeValue: typeValue,
            activeFl: activeFl
        }

        let resultObj = {
            severity: '',
            message: ''
        }

        if ( valueId === 0 ) {
            await axios.post(url, data, headers)
            .then(response => {
                resultObj.severity = 'success';
                resultObj.message = typeCd + ' saved';   
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
                resultObj.message = typeCd + (activeFl && activeFl === 'N' ? ' deleted' : ' updated');   
            })
            .catch (error => {
                resultObj.severity = 'error';
                resultObj.message = error.response.data.message;
            });
        }
        
        return resultObj;
    },

    async deleteObserved(sessionKey, observedId) {

        const url = MY_ABC_API_URL + 'observed/' + observedId;

        let resultObj = {};

        const headers = {
            headers: {'Authorization': sessionKey}
        }
        
        await axios.delete(url, headers)
            .then(response => {
                resultObj.severity = 'success';
                resultObj.message = 'Observed removed';    
            })
            .catch (error => {
                resultObj.severity = 'error';
                resultObj.message = error.response.data.message;
            });

        return resultObj;
    },
    
}

export default ObservedService;
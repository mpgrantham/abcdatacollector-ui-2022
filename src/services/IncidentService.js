import axios from 'axios';

const MY_ABC_API_URL = process.env.REACT_APP_API_BASE_URL;

const IncidentService = {
 
    async getIntensities() {

        const url = MY_ABC_API_URL + 'lookup/intensities';

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

    async saveIncident(sessionKey, data) {

        const headers = {
            headers: {'Authorization': sessionKey}
        }

        const url = MY_ABC_API_URL + 'incident';

        let resultObj = {};

        if ( data.id === 0 ) {
            await axios.post(url, data, headers)
            .then(response => {
               resultObj.severity = 'success';
               resultObj.message = 'Incident saved';    
            })
            .catch (error => {
                resultObj.severity = 'error';
                resultObj.message = 'Incident save failed';  
            });
        }
        else {
            await axios.put(url, data, headers)
            .then(response => {
               resultObj.severity = 'success';
               resultObj.message = 'Incident saved';    
            })
            .catch (error => {
                resultObj.severity = 'error';
                resultObj.message = 'Incident save failed';  
            });
        }
        

        return resultObj;
    },

    async deleteIncident(sessionKey, observedId, incidentId) {

        const headers = {
            headers: {'Authorization': sessionKey}
        }

        const url = MY_ABC_API_URL + '/incident/' + incidentId + '/observed/' + observedId;

        let resultObj = {};

        await axios.delete(url,  headers)
            .then(response => {
               resultObj.severity = 'success';
               resultObj.message = 'Incident deleted';    
            })
            .catch (error => {
                resultObj.severity = 'error';
                resultObj.message = 'Incident delete failed';  
        });
        
        return resultObj;
    }

}

export default IncidentService;
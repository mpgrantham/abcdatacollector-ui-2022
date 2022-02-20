export function buildAbclMap(observed) {
    return {
        antecedents: observed.antecedents ? observed.antecedents : [],
        behaviors: observed.behaviors? observed.behaviors : [],
        consequences: observed.consequences ? observed.consequences : [],
        locations: observed.locations ? observed.locations : []
    }
}

export function validateAndFormatDuration(duration) {
    let validDuration = true;
    
    let len = duration.length;

    let resultObj = {
        duration: duration,
        errorMessage: ''
    }
    
    if ( len === 0 ) {
        return resultObj;
    }

    let tempDuration = duration;

    let colonIdx = duration.indexOf(":");
    if ( colonIdx === -1 ) {
        if ( len < 3 ) {
            tempDuration= "00:" + ("0" + tempDuration).slice(-2);
            len = 5;
        }
        else if ( len === 3 || len === 4 ) {
            // insert colon two from back
            colonIdx = len - 2;
            tempDuration = tempDuration.substring(0,colonIdx) + ":" + tempDuration.substring(colonIdx);
            len++;
        }
        else {
            validDuration = false;
        }
    }

    // Check for dot and minus as these are valid in numbers
    if ( len < 3 || len > 6 || tempDuration.indexOf(".") > -1 || tempDuration.indexOf("-") > -1 ) {
        validDuration = false;
    }

    if ( ! validDuration ) {
        resultObj.errorMessage =  'Invalid Duration';
        return resultObj;
    }

    let parts = tempDuration.split(":");
    if ( parts.length !== 2 || isNaN(parts[0]) || isNaN(parts[1]) ) {
        resultObj.errorMessage =  'Invalid Duration';
        return resultObj;
    }

    let minutes = Number(parts[0]);
    let seconds = Number(parts[1]);

    if ( seconds > 59 ) {
        resultObj.errorMessage =  'Invalid Duration';
    }
    else {
        resultObj.duration = (("0" + minutes).slice(-2) + ":" + ("0" + seconds).slice(-2));
    }

    return resultObj;
}

const utilities = {}; 
const crypto = require('crypto');
const environments = require('../helpers/environments');


utilities.parseJSON = (str) => {
    try {
        const obj = JSON.parse(str);
        return obj;
    }
    catch {
        return {};
    }
};


utilities.hash = (str) => {
    if (typeof (str) === 'string' && str.length > 0) {
        const hash = crypto.createHmac
            ('sha256', environments.secretKey)  // secret key is used to encrypt the password)
            .update(str)
            .digest('hex');
        return hash;
    }
    else {
        return false;
    }
};
module.exports = utilities;
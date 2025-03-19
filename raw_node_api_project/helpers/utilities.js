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

utilities.createRandomString = (strLength) => {
    let length = strLength;
    length = typeof (strLength) === 'number' && strLength > 0 ? strLength : false;
    if (length) {
        const possibleCharacters = 'abcdefghijklmnopqrstuvwxyz0123456789';
        let str = '';
        for (let i = 1; i <= length; i++) {
            const randomCharacter = possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.length));
            str += randomCharacter;
        }
        return str;
    }
    else {
        return false;
    }
};
module.exports = utilities;
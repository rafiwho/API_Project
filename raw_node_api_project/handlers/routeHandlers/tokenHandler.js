const data = require('../../lib/data');
const { hash } = require('../../helpers/utilities');
const { parseJSON } = require('../../helpers/utilities');
const { createRandomString } = require('../../helpers/utilities');
const _token = {};

handle.tokenHandler = (requestProperties, callback) => {
    const acceptedMethods = ['get', 'post', 'put', 'delete'];
    if (acceptedMethods.indexOf(requestProperties.method) > -1) {
        handle._token[requestProperties.method](requestProperties
            , callback);
    }
    else {
        callback(405);
    }
};

handle._token = {};
handle._token.post = (requestProperties, callback) => {
    const phone = typeof (requestProperties.body.phone) === 'string' && requestProperties.body.phone.trim().length === 11 ? requestProperties.body.phone : false;
    const password = typeof (requestProperties.body.password) === 'string' && requestProperties.body.password.trim().length > 0 ? requestProperties.body.password : false;
    if (phone && password) {
        data.read('users', phone, (err, userData) => {
            const hashedPassword = hash(password);
            if (hashedPassword === parseJSON(userData).password) {
                const tokenId = createRandomString(20);
                const expires = Date.now() + 60 * 60 * 1000;
                const tokenObject = {
                    phone,
                    id: tokenId,
                    expires,
                };
                data.create('tokens', tokenId, tokenObject, (err) => {
                    if (!err) {
                        callback(200, tokenObject);
                    }
                    else {
                        callback(500, {
                            error: 'There was a problem in the server side',
                        });
                    }
                });
            }
            else {
                callback(400, {
                    error: 'Password is not valid',
                });
            }
        });
    }
    else {
        callback(400, {
            error: 'You have a problem in your request',
        });
    }
};
handle._token.get = (requestProperties, callback) => {
    const id = typeof (requestProperties.queryStringObject.id) === 'string' && requestProperties.queryStringObject.id.trim().length === 20 ? requestProperties.queryStringObject.id : false;
    if (id) {
        data.read('tokens', id, (err, tokenData) => {
            const token = { ...parseJSON(tokenData) };
            if (!err && token) {
                callback(200, token);
            }
            else { 
                callback(404, {
                    error: 'Requested token was not found',
                });
            }
        });
    }
    else {
        callback(404, {
            error: 'Requested token was not found',
        });
    }   
};
handle._token.put = (requestProperties, callback) => {
    const id = typeof (requestProperties.body.id) === 'string' && requestProperties.body.id.trim().length === 20 ? requestProperties.body.id : false;
    const extend = typeof (requestProperties.body.extend) === 'boolean' && requestProperties.body.extend === true ? true : false;
    if (id && extend) {
        data.read('tokens', id, (err, tokenData) => {
            const tokenObject = parseJSON(tokenData);
            if (tokenObject.expires > Date.now()) {
                tokenObject.expires = Date.now() + 60 * 60 * 1000;
                data.update('tokens', id, tokenObject, (err) => {
                    if (!err) {
                        callback(200, {
                            message: 'Token was updated successfully',
                        });
                    }
                    else {
                        callback(500, {
                            error: 'There was a problem in the server side',
                        });
                    }
                });
            }
            else {
                callback(400, {
                    error: 'Token already expired',
                });
            }
        });
    }
    else {
        callback(400, {
            error: 'There was a problem in your request',
        });
    }
};
handle._token.delete = (requestProperties, callback) => {
    const id = typeof (requestProperties.queryStringObject.id) === 'string' && requestProperties.queryStringObject.id.trim().length === 20 ? requestProperties.queryStringObject.id : false;
    if (id) {
        data.read('tokens', id, (err, tokenData) => {
            if (!err && tokenData) {
                data.delete('tokens', id, (err) => {
                    if (!err) {
                        callback(200, {
                            message: 'Token was successfully deleted',
                        });
                    }
                    else {
                        callback(500, {
                            error: 'There was a server side error',
                        });
                    }
                });
            }
            else {
                callback(500, {
                    error: 'There was a server side error',
                });
            }
        });
    }
    else {
        callback(400, {
            error: 'There was a problem in your request',
        });
    }
};

handle._token.verify = (id, phone, callback) => {
    data.read('tokens', id, (err, tokenData) => {
        if (!err && tokenData) {
            if (parseJSON(tokenData).phone === phone && parseJSON(tokenData).expires > Date.now()) {
                callback(true);
            }
            else {
                callback(false);
            }
        }
        else {
            callback(false);
        }
    });
};

module.exports = _token;

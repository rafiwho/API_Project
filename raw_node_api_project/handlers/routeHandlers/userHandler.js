const handle = {};
const data = require('../../lib/data');
const { hash } = require('../../helpers/utilities');
const { parseJSON } = require('../../helpers/utilities');
const tokenHandler = require('./tokenHandler');

handle.userHandler = (requestProperties, callback) => {
    const acceptedMethods = ['get', 'post', 'put', 'delete'];
    if (acceptedMethods.indexOf(requestProperties.method) > -1) {
        handle._user[requestProperties.method](requestProperties
            , callback);
    }
    else {
        callback(405);
    }
};

handle._user = {};
handle._user.post = (requestProperties, callback) => {
    const firstName = typeof (requestProperties.body.firstName) === 'string' && requestProperties.body.firstName.trim().length > 0 ? requestProperties.body.firstName : false;
    const lastName = typeof (requestProperties.body.lastName) === 'string' && requestProperties.body.lastName.trim().length > 0 ? requestProperties.body.lastName : false;
    const phone = typeof (requestProperties.body.phone) === 'string' && requestProperties.body.phone.trim().length === 11 ? requestProperties.body.phone : false;
    const password = typeof (requestProperties.body.password) === 'string' && requestProperties.body.password.trim().length > 0 ? requestProperties.body.password : false;
    const tosAgreement = typeof (requestProperties.body.tosAgreement) === 'boolean' && requestProperties.body.tosAgreement === true ? true : false;
    if (firstName && lastName && phone && password && tosAgreement) {
        data.read('users', phone, (err) => {
            if (err) {
                let userObject = {
                    firstName,
                    lastName,
                    phone,
                    password: hash(password),
                    tosAgreement,
                };
                data.create('users', phone, userObject, (err) => {
                    if (!err) {
                        callback(200, {
                            message: 'User was created successfully',
                        });
                    }
                    else {
                        callback(500, {
                            message: 'There was a problem in the server side',
                        });
                    }
                });
            }
            else {
                callback(500, {
                    message: 'There was a problem in the server side',
                });
            }
        }
        );
    }
    else {
        callback(400, {
            message: 'You have a problem in your request',
        });
    }

};
handle._user.get = (requestProperties, callback) => {
    const phone = typeof (requestProperties.queryStringObject.phone) === 'string' && requestProperties.queryStringObject.phone.trim().length === 11 ? requestProperties.queryStringObject.phone : false;
    if (phone) {
        let token = typeof (requestProperties.headersObject.token) === 'string' ? requestProperties.headersObject.token : false;
        tokenHandler._token.verify(token, phone, (tokenIsValid) => {
            if (tokenIsValid) {
                data.read('users', phone, (err, userData) => {
                    const user = { ...parseJSON(userData) };
                    if (!err && user) {
                        callback(200, user);
                    }
                    else {
                        callback(404, {
                            message: 'Requested user was not found',
                        });
                    }
                });
            } else {
                callback(403, {
                    message: 'Authentication failure!',
                });
            }
        });
    } else {
        callback(404, {
            message: 'Requested user was not found',
        });
    }
};
handle._user.put = (requestProperties, callback) => {
    const firstName = typeof (requestProperties.body.firstName) === 'string' && requestProperties.body.firstName.trim().length > 0 ? requestProperties.body.firstName : false;
    const lastName = typeof (requestProperties.body.lastName) === 'string' && requestProperties.body.lastName.trim().length > 0 ? requestProperties.body.lastName : false;
    const phone = typeof (requestProperties.body.phone) === 'string' && requestProperties.body.phone.trim().length === 11 ? requestProperties.body.phone : false;
    const password = typeof (requestProperties.body.password) === 'string' && requestProperties.body.password.trim().length > 0 ? requestProperties.body.password : false;

    if (phone) {
        let token = typeof (requestProperties.headersObject.token) === 'string' ? requestProperties.headersObject.token : false;
        tokenHandler._token.verify(token, phone, (tokenIsValid) => {
            if (tokenIsValid) {
                if (firstName || lastName || password) {
                    data.read('users', phone, (err, userData) => {
                        const userData = { ...parseJSON(userData) };
                        if (!err && userData) {
                            if (firstName) {
                                userData.firstName = firstName;
                            }
                            if (lastName) {
                                userData.lastName = lastName;
                            }
                            if (password) {
                                userData.password = hash(password);
                            }
                            data.update('users', phone, userData, (err) => {
                                if (!err) {
                                    callback(200, {
                                        message: 'User was updated successfully',
                                    });
                                }
                                else {
                                    callback(500, {
                                        message: 'There was a problem in the server side',
                                    });
                                }
                            });
                        }
                        else {
                            callback(400, {
                                message: 'You have a problem in your request',
                            });
                        }
                    });
                }
                else {
                    callback(400, {
                        message: 'You have a problem in your request',
                    });
                }
            } else {
                callback(403, {
                    message: 'Authentication failure!',
                });
            }
        });
    }
    else {
        callback(400, {
            message: 'Invalid phone number. Please try again',
        });
    }
};
handle._user.delete = (requestProperties, callback) => {
    const phone = typeof (requestProperties.queryStringObject.phone) === 'string' && requestProperties.queryStringObject.phone.trim().length === 11 ? requestProperties.queryStringObject.phone : false;
    if (phone) {
        let token = typeof (requestProperties.headersObject.token) === 'string' ? requestProperties.headersObject.token : false;
        tokenHandler._token.verify(token, phone, (tokenIsValid) => {
            if (tokenIsValid) {
                data.read('users', phone, (err, userData) => {
                    if (!err && userData) {
                        data.delete('users', phone, (err) => {
                            if (!err) {
                                callback(200, {
                                    message: 'User was deleted successfully',
                                });
                            }
                            else {
                                callback(500, {
                                    message: 'There was a problem in the server side',
                                });
                            }
                        });
                    }
                    else {
                        callback(500, {
                            message: 'There was a problem in the server side',
                        });
                    }
                });
            } else {
                callback(403, {
                    message: 'Authentication failure!',
                });
            }
        });
    }
    else {
        callback(400, {
            message: 'There was a problem in your request',
        });
    }
};
module.exports = handle;

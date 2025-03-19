const { sampleHandle } = require('./handlers/routeHandlers/sampleHandler');
const {userHandle} = require('./handlers/routeHandlers/userHandler');
const {tokenHandler} = require('./handlers/routeHandlers/tokenHandler');

const routes = {
    sample: sampleHandle,
    user: userHandle,
    token: tokenHandler,
};

module.exports = routes;
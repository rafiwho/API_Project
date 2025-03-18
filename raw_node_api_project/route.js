const { sampleHandle } = require('./handlers/routeHandlers/sampleHandler');
const {userHandle} = require('./handlers/routeHandlers/userHandler');

const routes = {
    sample: sampleHandle,
    user:userHandle,
};

module.exports = routes;
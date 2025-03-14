const { sampleHandle } = require('./handlers/routeHandlers/sampleHandler');

const routes = {
    'sample': sampleHandle,
};

module.exports = routes;
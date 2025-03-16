const { StringDecoder } = require('string_decoder');
const url = require('url');
const routes = require('../route');
const { notFoundHandle } = require('../handlers/routeHandlers/notfoundhandler');

const handler = {};

handler.handleReqRes = (req, res) => {
    // request handling
    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname;
    const trimmedPath = path.replace(/^\/+|\/+$/g, '');
    const method = req.method.toLowerCase();
    const queryStringObject = parsedUrl.query;
    const headersObject = req.headers;
    const decoder = new StringDecoder('utf-8');
    let realdata = '';

    const requestProperties = {
        parsedUrl,
        path,
        trimmedPath,
        method,
        queryStringObject,
        headersObject,
    };
    const chosenHandler = routes[trimmedPath] ? routes[trimmedPath] : notFoundHandle;
    req.on('data', (buffer) => {
        realdata += decoder.write(buffer);
    });
    req.on('end', () => {
        realdata += decoder.end();
        
        chosenHandler(requestProperties, (statusCode, payload) => {
            statusCode = typeof (statusCode) === 'number' ? statusCode : 500;
            payload = typeof (payload) === 'object' ? payload : {};
            const payloadString = JSON.stringify(payload);
            res.writeHead(statusCode);
            res.end(payloadString);
        }
        );

    });

    res.end('Hello World');
};

module.exports = handler;
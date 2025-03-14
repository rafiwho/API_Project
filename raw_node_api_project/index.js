const http = require('http');
const {handleRequest} = require('./helper/handlereqres');

// app object
const app = {};
// app properties
app.config = {
    port: 3000
};

// create server
app.createServer = () => {
    const server = http.createServer(app.handleRequest);
    server.listen(app.config.port, () => {
        console.log('listening on port ' + app.config.port);
    });
}

// handle request
app.handleRequest = handleRequest;


// start server
app.createServer();

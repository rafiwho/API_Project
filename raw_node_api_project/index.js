const http = require('http');
const { handleRequest } = require('./helpers/handlereqres');
const environment = require('./helpers/environments');
const data = require('./lib/data');

const app = {};

// data.create('test', 'newFile', {'name': 'Bangladesh','language':'bangla'}, (err) => {
//     console.log('error is ', err);
// }
// );
// data.read('test', 'newFile', (err, data) => {
//     console.log('error is ', err, 'data is ', data);
// }
// );
// data.update('test', 'newFile', {'name': 'Englang','language':'English'}, (err) => {
//     console.log('error is ', err);
// }
// );

// data.delete('test', 'newFile', (err) => {
//     console.log('error is ', err);
// }
// );

app.createServer = () => {
    const server = http.createServer(app.handleRequest);
    server.listen(environment.httpPort, () => {
        console.log('listening on port ' + environment.httpPort);
    });
}

app.handleRequest = handleRequest;

app.createServer();


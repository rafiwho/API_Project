const http = require('http');
const {handleRequest} = require('./helper/handlereqres');
const environment = require('./helper/environment');
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
    server.listen(environment.port, () => {
        console.log('listening on port ' + environment.port);
    });
}

app.handleRequest = handleRequest;

app.createServer();


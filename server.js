const http = require('http');
const app = require('./app');
const port = 8082;

const server = http.createServer(app);

server.listen(port);
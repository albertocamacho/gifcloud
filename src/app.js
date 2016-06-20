var http = require('http'); 
var path = require('path'); 
var fs = require('fs'); 
var socketio = require('socket.io'); 
var sockets = require('./socket.js'); 


var port = process.env.PORT || process.env.NODE_PORT || 3000; 


var fileNames = ['/client.html', '/client.js', '/soundcloud.js', '/dancer.js', '/jquery.js', '/circular-book.ttf'];

var cachedFiles = {};


for(var i = 0; i < fileNames.length; i++) {
    var currentName = fileNames[i]; 
    cachedFiles[currentName] = fs.readFileSync(__dirname + "/../client/" + fileNames[i]);
}

var onRequest = function(req, res) {
    if(fileNames.indexOf(req.url) > -1) {
        res.writeHead(200); 
        res.end(cachedFiles[req.url]); 
    }

    else if (req.url === '/client') { 
        res.writeHead(200); 
        res.end(cachedFiles['/client.html']); 
    }

    else {
        res.writeHead(200); 
        res.end(cachedFiles['/client.html']); 
    }
};


var server = http.createServer(onRequest).listen(port); 

var io = socketio.listen(server);

sockets.configureSockets(io);

console.log('started on port ' + port);
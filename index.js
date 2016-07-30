var express = require('express');
var app = express();

var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static('public'));

app.get('/', function(req, res){
	res.sendFile(__dirname + "/index.html");
});

// Variables
var sockets = [];

setInterval(function() {
	sockets.forEach(function(socket) {
		socket.emit('random', Math.random() * 10);
	});	
}, 1000);

io.on('connection', function(socket) {
	console.log("Connection: " + socket.id);
	sockets.push(socket);	
	
	socket.on('disconnect', function(data) {
		console.log("Disconnection: " + socket.id);
	});
	
});

http.listen(3000, function(){
	console.log('listening on *:3000');
});

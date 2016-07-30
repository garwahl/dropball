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
var currentSum = 0;
var players = {};

setInterval(function() {
	currentSum = currentSum + 1;
	sockets.forEach(function(socket) {
		socket.emit('random', Math.random() * 10);
		socket.emit('add', currentSum);
	});	
}, 1000);

setInterval(function() {
	var allPlayers = [];
	Object.keys(players).forEach(function(key) {
		allPlayers.push(players[key]);
	});
	io.emit("playerPositions", allPlayers);

}, 1000/30);

function CreateNewPlayer(socketID) {
	players[socketID] = new Object();
	players[socketID].id = socketID;
	players[socketID].x = 0;
	players[socketID].y = 0;
}

function GetAllPlayerIDs() {
	var keys = [];
	Object.keys(players).forEach(function(key) {
		keys.push(key);
	});

	return keys;
}

io.on('connection', function(socket) {
	console.log("Connection: " + socket.id);
	sockets.push(socket);
	CreateNewPlayer(socket.id);
	socket.emit('registerSelf', socket.id);

	var ids = GetAllPlayerIDs()

	socket.emit('newPlayer', ids);
	socket.broadcast.emit('newPlayer', [socket.id]);

	socket.on('updatePosition', function(position) {
		players[socket.id].x = position[0];
		players[socket.id].y = position[1];
//		console.log(socket.id + ": " + position[0] + ", " + position[1]);
	});

	socket.on('disconnect', function(data) {
		console.log("Disconnection: " + socket.id);
		for (i = 0; i < sockets.length; i++) {
			console.log(sockets[i].id);
			if (sockets[i].id == socket.id) {
				sockets.splice(i, 1);
				break;
			}
		}

		delete players[socket.id];
	});
	
});

http.listen(3000, function(){
	console.log('listening on *:3000');
});

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
}, 1000/8);

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

function GetDangerZones(width, height) {
	var tmp = [];

	for (i = 0; i < Math.random() * 10 + 1; i++) {
		tmp.push([Math.floor(Math.random() * width), Math.floor(Math.random() * height)]);
	}

	return tmp;
}

function GetCorners(x, y, size) {
	var corners = [
		[x, y],
		[x+size, y],
		[x, y+size],
		[x+size, y+size]
	];

	return corners;
}

function IsInTile(x, y, charX, charY) {
	var charCorners = GetCorners(charX, charY, 75);
	var wallCorners = GetCorners(x, y, 200);
	charCorners.forEach(function(corner) {
		if (corner[0] > wallCorners[0][0] &&
			corner[0] < wallCorners[1][0] &&
			corner[1] > wallCorners[0][1] &&
			corner[1] < wallCorners[2][1]) {
			return true;
		}
	});

	return false;
}

function DeathZoneCalculation(tiles) {
	var deadPlayers = [];	
	var ids = GetAllPlayerIDs();
	tiles.forEach(function(tile) {
		for (i = 0; i < ids.length; i++) {
			var currentPlayer = players[ids[i]];

			if (IsInTile(tileX, tileY, currentPlayer.x, currentPlayer.y)) {
				deadPlayers.push(currentPlayer);
			}
		}
	});

	return deadPlayers;
}

io.on('connection', function(socket) {
	console.log("Connection: " + socket.id);
	sockets.push(socket);
	CreateNewPlayer(socket.id);
	socket.emit('registerSelf', socket.id);
	console.log('emitted');

	io.emit('getDanger', GetDangerZones(4,3));

	var ids = GetAllPlayerIDs()

	socket.emit('newPlayer', ids);
	socket.broadcast.emit('newPlayer', [socket.id]);

	socket.on('updateVelocity', function(velocity) {
		players[socket.id].xVelocity = velocity[0];
		players[socket.id].yVelocity = velocity[1];
	});

	socket.on('updatePosition', function(position) {
		players[socket.id].x = position[0];
		players[socket.id].y = position[1];
//		console.log(socket.id + ": " + position[0] + ", " + position[1]);
	});

	socket.on('disconnect', function(data) {
		console.log("Disconnection: " + socket.id);
		for (i = 0; i < sockets.length; i++) {
			if (sockets[i].id == socket.id) {
				sockets.splice(i, 1);
				break;
			}
		}
	
		io.emit("disconnectPlayer", socket.id);		

		delete players[socket.id];
	});
	
});

http.listen(3000, function(){
	console.log('listening on *:3000');
});

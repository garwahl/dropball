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
var gameState = "wait";
var currentTimer = 0;

var alivePlayers = 0;
var previousPositions = {};

var deathZones = [];
var dangerZones = [];

// Constants
var PLAYER_SIZE = 75;
var TILE_SIZE = 200;

function EuclidianDistance(x1, x2, y1, y2) {
	var distance = Math.pow(x1-x2, 2) + Math.pow(y1-y2, 2);
	distance = Math.sqrt(distance);

	return distance;
}

setInterval(function() {
	currentSum = currentSum + 1;
	sockets.forEach(function(socket) {
		socket.emit('random', Math.random() * 10);
		socket.emit('add', currentSum);
	});	

	var distances = [];

	Object.keys(players).forEach(function(id) {
		if (previousPositions[id] != null) {
			var distance = EuclidianDistance(
				previousPositions[id].x,
				players[id].x,
				previousPositions[id].y,
				players[id].y);
			distances.push([id, distance]);
		}
		previousPositions[id] = [players[id].x, players[id].y];

	});

	io.emit('distanceTravelled', distances);

}, 1000);

setInterval(function() {
	console.log(gameState + ": " + currentTimer);
	currentTimer = currentTimer + 1;
	if (gameState == "wait") {
		io.emit('startTime', 10-currentTimer);
		if (currentTimer >= 10) {
			currentTimer = -1;
			gameState = "play";
			alivePlayers = sockets.length;
		}
	}
	else if (gameState == "play") {
		if (alivePlayers <= 0) {
			gameState = "wait";
			currentTimer = 0;	
		}
		else if (currentTimer == 0) {
			dangerZones = GetDangerZones(4,3);
			io.emit('getDanger', dangerZones); 
			io.emit('flash', '3');
		}
		else if (currentTimer >= 3) {
			io.emit('flash', 0);
			var dead = DeathZoneCalculation(dangerZones);
			io.emit('playerDeaths', dead);
			currentTimer = -1;
			alivePlayers -= dead.length;

			io.emit('deathsInLastSec', dead.length);
		}
		else {
			var colours = ['yellow', 'black'];
			for (i = 1; i < 3; i++) {
				if (currentTimer == i) {
					io.emit('flash', String(3-i));
				}
			}
		}
	}
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
		[x*size, y*size],
		[x*size+size, y*size],
		[x*size, y*size+size],
		[x*size+size, y*size+size]
	];

	return corners;
}

function GetCornersPlayer(x, y, size) {
	var corners = [
		[x, y],
		[x+size, y],
		[x, y+size],
		[x+size, y+size]
	];

	return corners;
}

function IsInTile(x, y, charX, charY) {
	var charCorners = GetCornersPlayer(charX, charY, PLAYER_SIZE);
	var wallCorners = GetCorners(x, y, TILE_SIZE);
	var isIn = false;

	charCorners.forEach(function(corner) {
		if (corner[0] >= wallCorners[0][0] &&
			corner[0] <= wallCorners[1][0] &&
			corner[1] >= wallCorners[0][1] &&
			corner[1] <= wallCorners[2][1]) {
			isIn = true;
		}
	});

	return isIn;
}

function DeathZoneCalculation(tiles) {
	var deadPlayers = [];	
	var ids = GetAllPlayerIDs();

	tiles.forEach(function(tile) {
		for (i = 0; i < ids.length; i++) {
			var currentPlayer = players[ids[i]];
			// console.log(currentPlayer);

			if (IsInTile(tile[0], tile[1], currentPlayer.x, currentPlayer.y) == true) {
				deadPlayers.push([currentPlayer]);
			}
		}
	});
	return deadPlayers;
}

io.on('connection', function(socket) {
	console.log("Connection: " + socket.id);
	sockets.push(socket);
	CreateNewPlayer(socket.id);


	socket.on('requestInformation', function(data) {
		var ids = GetAllPlayerIDs()

		socket.emit('newPlayer', ids);
		socket.emit('registerSelf', socket.id);
		socket.broadcast.emit('newPlayer', [socket.id]);
	});

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

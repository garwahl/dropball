
// Clientside scripts

var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });
var socket = io("/", { multiplex: false });
var tickRate = 1000/60; // Tickrate is 3 milliseconds

var players = [];
// My own character
var me; 

// Coords of sprites
var skullcords = [];
// Group of skull sprites
var skulls;

// ############
// # Functions#
// ############

// Create a new instance of the player using socket id and sprite
function createPlayer(id,sprite) {
	var newPlayer = {
		id: id,
		sprite: game.add.sprite(150, 150, sprite)
	};
	newPlayer.sprite.scale.setTo(0.5,0.5);
	newPlayer.sprite.anchor.setTo(0.5);

	players.push(newPlayer);

	return newPlayer;
}

// Set up all connections 
function setUpConnections() {
	socket.on('registerSelf', registerSelf);
	socket.on('newPlayer',registerPlayers);
	socket.on('disconnectPlayer',disconnectPlayer); 
	socket.on('getDanger',changeDangerTiles);
	socket.on('flash',flashSkulls); 

	socket.on('killInnocents', murder);
}

// Set up a your own character
function registerSelf(id) {
	me.id = id;
}

// Set up everyone elses character 
function registerPlayers(id) {
	for (i = 0; i < id.length; i++) {
		if (id[i] != me.id) {
			var player = createPlayer(id[i], 'kirby');
			setMovement(player.sprite);
		}
	}
}

// Set the movement of each individual player without gyro
function setMovement(player) {
	game.physics.arcade.enable(player);
	
	// Player collisions
	player.body.collideWorldBounds = true;
	player.body.bounce.set(0.5);
	player.body.maxVelocity.set(250);

}

// Set movement for yourself, including gyro movements
function setMovementSelf(player) {
	game.physics.arcade.enable(player);
	
	// Player collisions
	player.body.collideWorldBounds = true;
	player.body.bounce.set(0.5);
	player.body.maxVelocity.set(250);

	// Gyro controls
	gyro.frequency = 10;
	gyro.startTracking(function(entity) {
		player.body.velocity.x += entity.gamma/2;
		player.body.velocity.y += entity.beta/2;
		sendVelocity(player.body.velocity.x, player.body.velocity.y); 
	});	
}
// Send client velocity to server 
function sendVelocity(x, y) {
	socket.emit('updateVelocity', [x,y]); 
} 

// Send position of the player back to server
function sendPosition(x, y) {
	socket.emit('updatePosition', [x,y]);
}

// Check all player positions to sync
function checkPositions() {
	socket.on('playerPositions',updatePositions);
}

// Update player positions
function updatePositions(playerPositions) {
	for (var i = 0; i < playerPositions.length; i++) {
		for (var j = 0; j < players.length; j++) {
			if (playerPositions[i].id == players[j].id) {
				players[j].sprite.position.x = playerPositions[i].x;
				players[j].sprite.position.y = playerPositions[i].y;
				players[j].sprite.body.velocity.x = playerPositions[i].xVelocity; 
        		players[j].sprite.body.velocity.y = playerPositions[i].yVelocity;
				break;
			}
		}
	}
}
// Check for disconnected player, kill player 
function disconnectPlayer(id) { 
  for (var i = 0; i < players.length; i++) { 
    if (players[i].id == id){ 
      players[i].sprite.kill(); 
      players.splice(i,1); 
    } 
  } 
} 

// Change the game into fullscreen
function fullScreen() {
	game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
	game.scale.pageAlignHorizontally=true;
	game.scale.pageAlignVertically=false;
}

// Create game tiles
function createTiles() {
	var tiles = game.add.group();
	var tile;
	for (var i = 0; i < 4; i ++) {
		for (var j = 0; j < 3; j++) {
			tile = tiles.create(i*200,j*200,'tile');
		}
	}
}

// Change Tiles to Danger Tiles
function changeDangerTiles(zones) {
	skullcords = [];
	skullcords = zones; 

	// Clear skulls sprite group
	if (skulls.length > 0) {
		skulls.forEach(function(item) {
			item.text = "";
			skulls.remove(item);
		})
	}
	var skull;
	// Iterate through each coordinate that will be a danger zone
	for (var i = 0; i < skullcords.length; i++) {
		col = skullcords[i][0]; //x
		row = skullcords[i][1]; //y
		// Go through white tiles, changing target tile to danger zone
		for (var j = 0; j < 6; j++) {
			for (var k = 0; k < 6; k++) {
				if (col == k && row == j) {
					// Change sprite to danger zone
					skull = skulls.create(k*200,j*200,'whiteskull');
					skull.visible = false;
					skull.text = game.add.text(k*200 + 100,j*200 + 100,"3", {font: "50px Arial"});
					break;
				}
			}
		}
	}
}
// Change skull color 
function flashSkulls(color) {
	game.world.bringToTop(skulls);
	skulls.forEach(function(item) {
		console.log(color);
		if (color == "0") {
			item.visible = true;
			item.tint = 0xff0000;
			item.text.text = "";
		}
		else {
			item.text.text = color;
			item.visible = false;
		}
	})
}

// Kill players
function murder(people) {
	for (i = 0; i < people.length; i++) {
		for (j = 0; j < players.length; j++) {
			// Target acquired..
			if (players[j].id == people[i])
				players[j].sprite.kill();
		}
	}
}


// ##########################

function preload() {
	game.load.image('kirby', 'img/kirby.png');
	game.load.image('tile', 'img/whitetile.png');
	game.load.image('skull', 'img/skull.png');
	game.load.image('altskull', 'img/altskull.png');
	game.load.image('whiteskull', 'img/whiteskull.png');
}

function create() {
	fullScreen();
	//Arcade Physics System
	game.physics.startSystem(Phaser.Physics.ARCADE);

	skulls = game.add.group();
	// Set up game tiles
	createTiles();
	me = createPlayer(0, 'kirby');
	setMovementSelf(me.sprite);
	// Set up connections as either me or everyone else
	setUpConnections();
	// Update Player Positions
	checkPositions();
	// Send player position back to server
	setInterval(function() {sendPosition(me.sprite.position.x, me.sprite.position.y)},tickRate);

}

function update() {

}

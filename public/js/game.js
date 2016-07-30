
// Clientside scripts

var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });
var socket = io();
var tickRate = 1000/30; //Tickrate is 3 milliseconds

var players = [];
// My own character
var me; 


// ############
// # Functions#
// ############

// Create a new instance of the player using socket id and sprite
function createPlayer(id,sprite) {
	var newPlayer = {
		id: id,
		sprite: game.add.sprite(150, 150, sprite)
	};

	newPlayer.sprite.anchor.setTo(0.5);

	players.push(newPlayer);

	return newPlayer;
}

// Set up all connections 
var setUpConnections = function() {
	socket.on('registerSelf', registerSelf);
	socket.on('newPlayer',registerPlayers);
}

// Set up a your own character
function registerSelf(id) {
	me = createPlayer(id, 'kirby');
	setMovement(me.sprite);
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


// Set the movement of each individual player variable passed as args
function setMovement(player) {
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
	});

}

// Send position of the player back to server
function sendPosition(x, y) {
	socket.emit('updatePosition', [x,y]);
}

// Change the game into fullscreen
function fullScreen() {
	game.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
}

// ##########################

function preload() {
	game.load.image('black', 'img/black.png');
	game.load.image('kirby', 'img/kirby.png');
}

function create() {
	fullScreen();
	//Arcade Physics System
	game.physics.startSystem(Phaser.Physics.ARCADE);

	setUpConnections();
	// Send player position back to server
	setInterval(function() {sendPosition(me.sprite.position.x, me.position.y)},tickRate);
}

function update() {

}
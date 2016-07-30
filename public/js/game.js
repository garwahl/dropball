// Clientside scripts
var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

// ############
// # Functions#
// ############

// Create a new instance of the player at x,y coordinates using sprite player
function createPlayer(x , y, player) {
	var newPlayer;
	newPlayer = game.add.sprite(x, y, player);

	return newPlayer;
}

// Set the movement of each individual player variable passed as args
function setMovement(player) {
	game.physics.arcade.enable(player);
	game.physics.enable(player, Phaser.Physics.Arcade);
	// Player collisions
	player.body.collideWorldBounds = true;
	player.body.bounce = 0.1;

	// Gyro controls
	gyro.frequency = 500
	gyro.startTracking(function(entity) {
		player.body.velocity.x += entity.alpha;
		player.body.velocity.y += entity.gamma;
	});

}

// Change the game into fullscreen
function fullScreen() {
	game.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
}

// #############

function preload() {
	game.load.image('black', 'img/black.png');
}

function create() {
	fullScreen();
	//Arcade Physics System
	game.physics.startSystem(Phaser.Physics.ARCADE);
}

function update() {
}
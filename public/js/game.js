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

}

// Change the game into fullscreen
function fullScreen() {
	game.stage.scale.startFullScreen();
	Phaser.StageScaleMode.EXACT_FIT = 0;
}

// #############

function preload() {
	game.load.image('black', 'img/black.png');
}

function create() {
	fullScreen();
}

function update() {
}
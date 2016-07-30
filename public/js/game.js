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
// Change the game into fullscreen
function fullScreen() {
	game.scale.pageAlignHorizontally = true;
	game.scale.pageAlignVertically = true;
	game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
	game.scale.setScreenSize(true);

}

// #############

function preload() {
}

function create() {
	fullScreen();
}

function update() {
}
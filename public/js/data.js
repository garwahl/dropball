var socket;
window.onload = function() {
	socket = io();
	console.log(socket);
	socket.on('???', function (data) {
		console.log(data);
	});
}

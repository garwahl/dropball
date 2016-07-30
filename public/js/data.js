var socket;
window.onload = function() {
	socket = io("http://localhost");
	console.log(socket);
	socket.on('???', function (data) {
		console.log(data);
	});
}

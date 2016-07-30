var socket;
var randomgraph;
window.onload = function() {
	socket = io();
	console.log(socket);

	var randomgraphcanvas = document.getElementById('randomgraph').getContext('2d');
	var    type = 'bar',
	    data = {
		labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
		datasets: [{
		    label: '# of Votes',
		    data: [12, 19, 3, 5, 2, 3],
		    backgroundColor: [
			'rgba(255, 99, 132, 0.2)',
			'rgba(54, 162, 235, 0.2)',
			'rgba(255, 206, 86, 0.2)',
			'rgba(75, 192, 192, 0.2)',
			'rgba(153, 102, 255, 0.2)',
			'rgba(255, 159, 64, 0.2)'
		    ],
		    borderColor: [
			'rgba(255,99,132,1)',
			'rgba(54, 162, 235, 1)',
			'rgba(255, 206, 86, 1)',
			'rgba(75, 192, 192, 1)',
			'rgba(153, 102, 255, 1)',
			'rgba(255, 159, 64, 1)'
		    ],
		    borderWidth: 1
		}]
	    },
	    options = {
		scales: {
		    yAxes: [{
			ticks: {
			    beginAtZero:true
			}
		    }]
		}
	    };
	
	randomgraph = new Chart(randomgraphcanvas).Line(data, {animationSteps:5});
	
	socket.on('random', function (datai) {
//		console.log(data);
		randomgraph.addData([datai], "Blah");
		randomgraph.removeData();
	});
}

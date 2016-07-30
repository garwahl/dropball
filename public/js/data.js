var socket;
var randomgraph;
window.onload = function() {
	socket = io();
	console.log(socket);
	/*
	var randomgraphcanvas = document.getElementById('randomgraph').getContext('2d');
		type = 'bar',
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
	
	socket.on('random', function (data) {
//		console.log(data);
		randomgraph.addData([data], "Blah");
		randomgraph.removeData();
	});
	*/
	var distanceGraphCanvas = document.getElementById('distanceGraph').getContext('2d');
		type = 'bar',
    	data = {
		labels: ["<2m", "2-4m", "4-6m", "6-8m", ">8m"],
		datasets: [{
			label: "Total Distance Travelled",
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
            borderWidth: 1,
            data: [0, 0, 0, 0, 0],
        }]
    };

    distanceGraph = new Chart(distanceGraphCanvas).Bar(data, {animationSteps: 15});
 
    socket.on('random', function (data) {
		//console.log(data);
		var distancetobargraph = (Math.max(0, Math.round((data/2))-1));
		//console.log(distancetobargraph);
		distanceGraph.datasets[0].bars[distancetobargraph].value += 1;
		//console.log(distanceGraph.datasets);
		distanceGraph.update();
	});

    var recentdeathsGraphCanvas = document.getElementById('recentdeathsGraph').getContext('2d');
		type = 'line',
    	data = {
		labels: [ 0],
		datasets: [{
		    label: '# of deaths',
		    data: [1],
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
	
	recentdeathsGraph = new Chart(recentdeathsGraphCanvas).Line(data, {animationSteps:15});

	var timepassedfordeaths = 0;

	socket.on('random', function (data) {
//		console.log(data)
		timepassedfordeaths += 1;
		recentdeathsGraph.addData([data], timepassedfordeaths);
		console.log(recentdeathsGraph.datasets[0].points.length);
		if (recentdeathsGraph.datasets[0].points.length == 6)
		{
		recentdeathsGraph.removeData();
		}
		else
		{

		}
	});
}

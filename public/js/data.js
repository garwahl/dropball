var socket;
var randomgraph;
window.onload = function() {
	socket = io();
	io.emit('graph', null);
	// console.log(socket);
	// Leaderboard
	// var leaderboardGraphCanvas = document.getElementById("leaderboardGraph");
	// var leaderboardGraph = new Chart(leaderboardGraphCanvas, {
	// 	type: 'horizontalBar',
	// 	data: {
	// 		labels: ['Player' + Math.round(Math.random()*10)],
	// 		datasets: [{
	// 			label: 'Most recent death',
	// 			data: [1],
	// 		}]
	// 	},
	// 	options: {
	//         scales: {
	//             xAxes: [{
	//                 ticks: {
	//                     beginAtZero:true,
	//                     max: 100,
	//                 }
	//             }]
	//         }
	//     }
	// });

	// var playerranking = 0;
	// socket.on('random', function (data) {
		
	// 	leaderboardGraph.data.labels.unshift('Player' + Math.round(Math.random()*100));
	// 	leaderboardGraph.data.datasets[0].data.unshift(playerranking);
		
	// 	if (leaderboardGraph.data.datasets[0].data.length == 6)
	// 	{
	// 		leaderboardGraph.data.labels.splice(-1,1);
	// 		leaderboardGraph.data.datasets[0].data.splice(-1,1);
	// 	}

	// 	leaderboardGraph.update();
	// 	playerranking += 1;
	// });

	// Location of death
	var deathlocGraphCanvas = document.getElementById("deathlocGraph")
	var deathlocGraph = new Chart(deathlocGraphCanvas,{
		type: 'bubble',
		data: {
	    datasets: [
	        {
	            label: 'First Dataset',
	            data: [
	                {
	                    x: 2,
	                    y: 1.5,
	                    r: 0,
	                }
	            ],
	            backgroundColor:"#FF6384",
	            hoverBackgroundColor: "#FF6384",
	        }]
		},
		options: {
	        elements: {
	            points: {
	                borderWidth: 1,
	                borderColor: 'rgb(0, 0, 0)'
	            }
	        }
	    }
	});
	// Distance Travelled Graph
	var distanceGraphCanvas = document.getElementById("distanceGraph");
	var distanceGraph = new Chart(distanceGraphCanvas, {
	    type: 'bar',
	    data: {
	        labels: ["<2m", "2-4m", "4-6m", "6-8m", ">8m"],
	        datasets: [{
	            label: 'Total Distance Travelled',
	            data: [0, 0, 0, 0, 0],
	            backgroundColor: [
	                'rgba(255, 99, 132, 0.2)',
	                'rgba(255, 159, 64, 0.2)',
	                'rgba(255, 206, 86, 0.2)',
	                'rgba(75, 192, 192, 0.2)',
	                'rgba(153, 102, 255, 0.2)',
	                'rgba(54, 162, 235, 1)'
	            ],
	            borderColor: [
	                'rgba(255,99,132,1)',
	                'rgba(255, 159, 64, 1)',
	                'rgba(255, 206, 86, 1)',
	                'rgba(75, 192, 192, 1)',
	                'rgba(153, 102, 255, 1)',
	                'rgba(54, 162, 235, 1)'
	            ],
	            borderWidth: 1,
	        }]
	    },
	    options: {
	        scales: {
	            yAxes: [{
	                ticks: {
	                    beginAtZero:true
	                }
	            }]
	        }
	    }
	});


    socket.on('distanceTravelled', function (data) {
    	data.forEach(function(distance) {
		// var distancetobargraph = (Math.max(0, Math.round((data[1]/2))-1));
			//distanceGraph.data.datasets[0].data.splice(0,1);
		if (distance[1] > 0) {
			console.log(distance[1]);
			var distancetobargraph = (Math.max(0, Math.round((distance[1]/2))));

			distanceGraph.data.datasets[0].data[distancetobargraph] += 1;
			//console.log(distanceGraph.datasets);
			distanceGraph.update();
    		}
	    });

	});


    // Recent Deaths
    var recentdeathsGraphCanvas = document.getElementById("recentdeathsGraph");
    var recentdeathsGraph = new Chart(recentdeathsGraphCanvas, {
    type: 'line',
    data: {
	        labels: [0],
	        datasets: [{
	            label: 'Number of deaths per second',
	            fill: false,
	            lineTension: 0.1,
	            backgroundColor: "rgba(75,192,192,0.4)",
	            borderColor: "rgba(75,192,192,1)",
	            borderCapStyle: 'butt',
	            borderDash: [],
	            borderDashOffset: 0.0,
	            borderJoinStyle: 'miter',
	            pointBorderColor: "rgba(75,192,192,1)",
	            pointBackgroundColor: "#fff",
	            pointBorderWidth: 1,
	            pointHoverRadius: 5,
	            pointHoverBackgroundColor: "rgba(75,192,192,1)",
	            pointHoverBorderColor: "rgba(220,220,220,1)",
	            pointHoverBorderWidth: 2,
	            pointRadius: 1,
	            pointHitRadius: 10,
	            data: [0],
	            spanGaps: false,
		        }]
	    },
	});

    var timepassedfordeaths = 0;
    socket.on('random', function (data) {
    	timepassedfordeaths += 1;
    	//Add new data
		recentdeathsGraph.data.datasets[0].data.push(data);
		recentdeathsGraph.data.labels.push(timepassedfordeaths);
		if (recentdeathsGraph.data.datasets[0].data.length == 6)
		{
			recentdeathsGraph.data.labels.splice(0,1);
			recentdeathsGraph.data.datasets[0].data.splice(0,1);
		}
		recentdeathsGraph.update();
	});

    // Team composition pie chart
    var teamcompGraphCanvas = document.getElementById("teamcompGraph");
    var teamcompGraph = new Chart(teamcompGraphCanvas, {
    type: 'pie',
		data: {
	    labels: [
	        "Red",
	        "Blue",
	        "Yellow"
	    ],
	    datasets: [
	        {
	            data: [50, 50, 50],
	            backgroundColor: [
	                "#FF6384",
	                "#36A2EB",
	                "#FFCE56"
	            ],
	            hoverBackgroundColor: [
	                "#FF6384",
	                "#36A2EB",
	                "#FFCE56"
	            ]
	        }]
	}
	});

	socket.on('random', function (data) {
		var teammemberslost = (Math.round(data));
		// console.log(teamcompGraph);
		var teammembersleft = teamcompGraph.data.datasets[0].data[0] + teamcompGraph.data.datasets[0].data[1] + teamcompGraph.data.datasets[0].data[2]
		if (teammembersleft > 1)
		{
		teamcompGraph.data.datasets[0].data[Math.floor(Math.random() * 3) + 0] -= teammemberslost;
		teamcompGraph.update();
		}
	});
}


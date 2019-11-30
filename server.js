var express = require("express");

// Create new instance of express
var app = express();

// Our HTTP server will handle HTTP requests
var server = require("http").Server(app);

// Have our socket module listen to our server object
var io = require("socket.io").listen(server);

var players = {};

app.use(express.static(__dirname + "/public"));

app.get("/", function (req, res) {
	res.sendFile(__dirname + "/index.html");
});

// Listen for connections and disconnections
io.on("connection", function (socket) {
	console.log("User Connected");
	// Create a new player and add to the players object
	players[socket.id] = {
		// Store x and y positions of our new player (randomized temporarily)
		x: Math.floor(200),
		y: Math.floor(200),
		// Add a unique player ID
		playerId: socket.id,
		type: "knight",
		left: 0,
		state: "idle"
	};

	// Send the players object to the new player
	// socket.emit: Emit an event to the client side socket (public/js/game.js)
	socket.emit("currentPlayers", players);

	// Update all other players of the new player
	// socket.broadcast.emit: Emit an event to all other sockets 
	// 							  (i.e. all other existing users)
	socket.broadcast.emit("newPlayer", players[socket.id]);

	// Add functionality for user disconnecting
	socket.on("disconnect", function() {
		console.log("A User Disconnected");

		// Remove player from the players object
		delete players[socket.id];

		// Emit a message to all other players to remove this player
		io.emit("disconnect", socket.id);
	});

	// Add functionality for receiving player movement from clients
	socket.on("playerMovement", function(movementData) {
		// Update user position that voiced the change
		// console.log("X: ", movementData.x, " // Y: ", movementData.y, " // Type: ", movementData.type, " // Left: ",  movementData.left, " // State: ", movementData.state);
		var leftD = players[socket.id].left  == movementData.left  ? 0  : 1;
		var typeD = players[socket.id].type  == movementData.type  ? -1 : movementData.type;
		var statD = players[socket.id].state == movementData.state ? -1 : movementData.state;
		players[socket.id].x     = movementData.x;
		players[socket.id].y     = movementData.y;
		players[socket.id].left  = movementData.left;
		players[socket.id].type  = movementData.type;
		players[socket.id].state = movementData.state;
		socket.broadcast.emit("playerMoved", players[socket.id], leftD, typeD, statD);
	});
});

// Display game on localhost port 6969 for maximum throughput (haha)
server.listen(6969, function () {
	console.log(`Listening on ${server.address().port}`);
});

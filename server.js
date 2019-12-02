var express = require("express");

// Create new instance of express
var app = express();

// Our HTTP server will handle HTTP requests
var server = require("http").Server(app);

// Have our socket module listen to our server object
var io = require("socket.io").listen(server);

var players = {};
var weapons = {};
var playerSize = 0;

app.use(express.static(__dirname + "/public"));

app.get("/", function (req, res) {
	res.sendFile(__dirname + "/index.html");
});

// Listen for connections and disconnections
io.on("connection", function (socket) {

	playerSize++;
	console.log("User Connected, Players: ", playerSize);

	// Create a new player and add to the players object
	players[socket.id] = {
		// Store x and y positions of our new player (randomized temporarily)
		x: Math.floor(200),
		y: Math.floor(200),
		// Add a unique player ID
		playerId: socket.id,
		classType: "knight",
		left: 0,
		state: "idle"
	};

	weapons[socket.id] = {
		x: Math.floor(200 + 18),
		y: Math.floor(200 + 22),
		playerId: socket.id,
		weaponType: "sword",
		isLeft: 0
	};

	// Send the players object to the new player
	// socket.emit: Emit an event to the client side socket (public/js/game.js)
	socket.emit("currentPlayers", players, weapons);

	// Update all other players of the new player
	// socket.broadcast.emit: Emit an event to all other sockets 
	// 							  (i.e. all other existing users)
	console.log("Emitting new player ", socket.id, " where weapon is ", weapons[socket.id].weaponType, " // isLeft: ", weapons[socket.id].isLeft);
	socket.broadcast.emit("newPlayer", players[socket.id], weapons[socket.id]);

	// Add functionality for user disconnecting
	socket.on("disconnect", function() 
	{
			playerSize--;
			console.log("A User Disconnected, Players: ", playerSize);

			// Remove player from the players object
			delete players[socket.id];
			delete weapons[socket.id];

			// Emit a message to all other players to remove this player
			io.emit("disconnect", socket.id);
	});

	// Add functionality for receiving player movement from clients
	socket.on("playerMovement", function(movementData) 
	{
		// Update user position that voiced the change
		console.log("CHAR MOVEMENT: X: ", movementData.x, " // Y: ", movementData.y, " // Class: ", movementData.classType, " // Left: ",  movementData.left, " // State: ", movementData.state);
		var leftD = players[socket.id].left  == movementData.left  ? 0  : 1;
		var typeD = players[socket.id].classType  == movementData.classType  ? -1 : movementData.classType;
		var statD = players[socket.id].state == movementData.state ? -1 : movementData.state;
		players[socket.id].x     = movementData.x;
		players[socket.id].y     = movementData.y;
		players[socket.id].left  = movementData.left;
		players[socket.id].classType  = movementData.classType;
		players[socket.id].state = movementData.state;
		if (movementData.left)
		{
			weapons[socket.id].isLeft = true;
			weapons[socket.id].x = movementData.x - 18;
				weapons[socket.id].y = movementData.y + 22;
		}
		else
		{
			weapons[socket.id].isLeft = false;
			weapons[socket.id].x = movementData.x + 18;
			weapons[socket.id].y = movementData.y + 22;
		}
		console.log("WEAPON MOVEMENT: X: ", weapons[socket.id].x, " // Y: ", movementData.y) 

		socket.broadcast.emit("playerMoved", players[socket.id], weapons[socket.id], leftD, typeD, statD);
	});

	// Update other's clients for a weapon attack
	socket.on("playerAttack", function(attackData)
	{
		socket.broadcast.emit("playerAttacked", weapons[socket.id], attackData.id);
	});

	// I don't know an easier way of stopping animations so that's what this is for
	socket.on("attackStop", function ()
	{
		socket.broadcast.emit("attackStopped", socket.id);
	});

	socket.on("playerDeath", function (killerId)
	{
		playerSize--;
		console.log("Player Died. Players: ", playerSize);
		socket.broadcast.emit("playerDied", socket.id, killerId, playerSize);
	});
});

// Display game on localhost port 6969 for maximum throughput (haha)
server.listen(process.env.PORT || 13337);

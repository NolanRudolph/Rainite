// Used for configuring the Phaser Game
var config = {
        // Type can be Phaser.CANVAS, Phaser.WEBGL, or Phaser.AUTO
        // Phaser.AUTO is recommended because it automatically uses WebGL
        type: Phaser.AUTO,

	// Render the game in an existing <canvas> element if the id exists
        parent: "phaser-example",

        // Resolution to play in, not size of map
        width: 800,
        height: 800,
        
        // Physics MUST be added, for future objects
        physics: {
                default: "arcade",
                arcade: {
                        debug: false,
                        gravity: { y: 0 }
                }       
        },      
        // Calls respective  functions shown below for game creation
        scene: {
                preload: preload,
                create: create,
                update: update
        } 
};
 
// Begins bringing Phaser to life o.O
var game = new Phaser.Game(config);
 
// Preload: Responsible for loading in new sprites
function preload() 
{
        // Load in red block for temporary testing
        this.load.image('red',    'assets/Testing/red.png');
        this.load.image('orange', 'assets/Testing/orange.png');
        this.load.image('yellow', 'assets/Testing/yellow.png');
        this.load.image('green',  'assets/Testing/green.png');
        this.load.image('blue',   'assets/Testing/blue.png');
        this.load.image('purple', 'assets/Testing/purple.png');

	this.load.atlas("knight", "assets/Animations/knight.png", "assets/Animations/knight.json");
}
 
// Displays the images we"ve loaded in preload()
function create() 
{        

	/* CAMERA STUFF */


	/* SOCKET STUFF */
        // Weird errors occur if we don't use self for addPlayer()
        var self = this;

        // Obtain a socket object for client
        this.socket = io();

        // Define group for holding players
        this.otherPlayers = this.physics.add.group();

	/* Test that worked
	this.test = this.add.sprite(200, 200, "knight");
	this.test.setScale(3);
	this.test.play("walk");
	*/

        // Listen for socket emission with "currentPlayers" key
        this.socket.on("currentPlayers", function(players) {
                Object.keys(players).forEach(function(id) {
                        // If the new player is this client
                        if(players[id].playerId != self.socket.id) {
                                otherPlayers = addOtherPlayers(self, players[id]);
                        }
                });
        });

        // Listen for socket emission with "newPlayer" key
        this.socket.on("newPlayer", function(playerInfo) {
                // Add the new player to the field
                addOtherPlayers(self, playerInfo);
        });

        // Listen for socket emission with "disconnect" key
        this.socket.on("disconnect", function (playerId) {
                // .getChildren() gets all game objects for that group
                self.otherPlayers.getChildren().forEach(function (otherPlayer) {
                        // Remove that player from the game
                        if (playerId === otherPlayer.playerId)
                        {
                                otherPlayer.destroy();
                        }
                });
        });

        // 1. Client informs server a player moved
        // 2. Server receives information and broadcasts to all clients
        // 3. This function receives the server request for all clients
        this.socket.on("playerMoved", function(playerInfo) {
                // Go through the list of players and...
                self.otherPlayers.getChildren().forEach(function (otherPlayer) {
                        // If the player who moved is equal to the current assesed ID...
                        if (playerInfo.playerId === otherPlayer.playerId)
                        {
                                // Move that player from the perspective of the current client
                                otherPlayer.setPosition(playerInfo.x, playerInfo.y);
                        }
                })
        })

	this.myPlayer = this.physics.add.sprite(200, 200, "knight", "knight_f_run_anim_f0.png");
	this.myPlayer.setScale(3);
	this.myPlayer.setDrag(100);
	this.myPlayer.setMaxVelocity(500);

	/* ANIMATION STUFF */
	this.anims.create({
		key: "walk",
		frames: this.anims.generateFrameNames("knight", {start: 0, end: 3, zeroPad: 0, prefix: "knight_f_run_anim_f", suffix: ".png"}),
		frameRate: 8,
		repeat: -1
	});

	this.myPlayer.play("walk");

        // Take user input to manipulate their character
        this.cursors = this.input.keyboard.createCursorKeys();
}
 
// Constantly updates the status of our objects/sprites
function update(time, delta)
{
        /* PERSONAL PLAYER SECTION */
        // Make sure keystrokes wrt player
        if (this.myPlayer)
        {
                // Do NOT mess with this, took half an hour to find a good system
                if(this.cursors.left.isDown)
                {
                        this.myPlayer.setVelocityX(-150);
                }
                if (this.cursors.right.isDown)
                {
                        this.myPlayer.setVelocityX(150);
                }
                if (this.cursors.up.isDown)
                {
                        this.myPlayer.setVelocityY(-150);
                }
                if (this.cursors.down.isDown)
                {
                        this.myPlayer.setVelocityY(150);
                }
                if (!this.cursors.left.isDown && !this.cursors.right.isDown)
                {
                        this.myPlayer.setVelocityX(0);
                }

                if (!this.cursors.up.isDown && !this.cursors.down.isDown)
                {
                        this.myPlayer.setVelocityY(0);
                }
		// Capture player's position
		var x = this.myPlayer.x;
		var y = this.myPlayer.y;

		// If the player has moved from previous spot, update all other clients
		if (this.myPlayer.oldPosition && (x !== this.myPlayer.oldPosition.x ||
						y !== this.myPlayer.oldPosition.y))
		{
			// Socket emission to server to handle new movement from player
			// (See create()'s this.socket.on("playerMoved") for full explanation)
			this.socket.emit("playerMovement", {x: this.myPlayer.x, y: this.myPlayer.y});
		}

		// Save the player's previous state
		this.myPlayer.oldPosition = 
		{
			x: this.myPlayer.x,
			y: this.myPlayer.y
		}
	}

        //this.physics.world.wrap(this.player, 5);
}

function addOtherPlayers(self, playerInfo)
{
        const otherPlayer = self.add.sprite(playerInfo.x, playerInfo.y, 'red')
                                                                  .setOrigin(0.5, 0.5);

        // Give the player a comparable ID
        otherPlayer.playerId = playerInfo.playerId;

        // Add the new player to the list of new players
        self.otherPlayers.add(otherPlayer);

	return self.otherPlayers;
}

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
        this.load.image('red',    'assets/red.png');
        this.load.image('orange', 'assets/orange.png');
        this.load.image('yellow', 'assets/yellow.png');
        this.load.image('green',  'assets/green.png');
        this.load.image('blue',   'assets/blue.png');
        this.load.image('purple', 'assets/purple.png');

}
 
// Displays the images we"ve loaded in preload()
function create() 
{        
        // Weird errors occur if we don't use self for addPlayer()
        var self = this;

        // Obtain a socket object for client
        this.socket = io();

        // Define group for holding players
        this.otherPlayers = this.physics.add.group();

        // Listen for socket emission with "currentPlayers" key
        this.socket.on("currentPlayers", function(players) {
                Object.keys(players).forEach(function(id) {
                        // If the new player is this client
                        if(players[id].playerId === self.socket.id) {
                                // Add the player to the scene, called with player object
                                addPlayer(self, players[id]);
                        }
                        // Otherwise, it's another player that should be added
                        else 
                        {
                                addOtherPlayers(self, players[id]);
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

        // Take user input to manipulate their character
        this.cursors = this.input.keyboard.createCursorKeys();
}
 
// Constantly updates the status of our objects/sprites
function update() 
{
        /* PERSONAL PLAYER SECTION */
        // Make sure keystrokes wrt player
        if (this.player)
        {
                if(this.cursors.left.isDown)
                {
                        this.player.setVelocityX(-150);
                }
                if (this.cursors.right.isDown)
                {
                        this.player.setVelocityX(150);
                }
                if (this.cursors.up.isDown)
                {
                        this.player.setVelocityY(-150);
                }
                if (this.cursors.down.isDown)
                {
                        this.player.setVelocityY(150);
                }
                if (!this.cursors.left.isDown && !this.cursors.right.isDown)
                {
                        this.player.setVelocityX(0);
                }

                if (!this.cursors.up.isDown && !this.cursors.down.isDown)
                {
                        this.player.setVelocityY(0);
                }

                // Capture player's position
                var x = this.player.x;
                var y = this.player.y;

                // If the player has moved from previous spot, update all other clients
                if (this.player.oldPosition && (x !== this.player.oldPosition.x ||
                                                y !== this.player.oldPosition.y))
                {
                        // Socket emission to server to handle new movement from player
                        this.socket.emit("playerMovement", {x: this.player.x, y: this.player.y});
                }

                // Save the player's previous state
                this.player.oldPosition = 
                {
                        x: this.player.x,
                        y: this.player.y
                }
        }

        //this.physics.world.wrap(this.player, 5);
}

function addPlayer(self, playerInfo)
{
        self.player = self.physics.add.image(playerInfo.x, playerInfo.y, 'blue')
                                                           .setOrigin(0.5, 0.5);

        self.player.setDrag(100);
        self.player.setAngularDrag(100);
        self.player.setMaxVelocity(200);
}

function addOtherPlayers(self, playerInfo)
{
        const otherPlayer = self.add.sprite(playerInfo.x, playerInfo.y, 'red')
                                                                  .setOrigin(0.5, 0.5);

        // Give the player a comparable ID
        otherPlayer.playerId = playerInfo.playerId;

        // Add the new player to the list of new players
        self.otherPlayers.add(otherPlayer);
}

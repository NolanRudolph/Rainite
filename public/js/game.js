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

        // Obtain a socket object for client
        this.socket = io();

        var self = this;

        // Listen for socket emission with "currentPlayers" key
        this.socket.on('currentPlayers', function(players) {
                Object.keys(players).forEach(function(id) {
                        // If the new player is this client
                        if(players[id].playerId === self.socket.id) {
                                // Add the player to the scene, called with player object
                                addPlayer(self, players[id]);
                        }
                });
        });

}
 
// Displays the images we"ve loaded in preload()
function create() 
{
        // Obtain a socket object for client
        this.socket = io();
}
 
// Constantly updates the status of our objects/sprites
function update() 
{

}

function addPlayer(self, playerInfo)
{
        var playerId = playerInfo.playerId;

        // Red
        if (playerId === 0)
        {
                self.person = self.physics.add.image(playerInfo.x, playerInfo.y, 'red')
                                                                    .setOrigin(0.5, 0.5);
        }
        // Orange
        else if (playerId === 1)
        {
                self.person = self.physics.add.image(playerInfo.x, playerInfo.y, 'orange')
                                                                     .setOrigin(0.75, 0.75);
        }
        else
        {
                self.person = self.physics.add.image(playerInfo.x, playerInfo.y, 'blue')
                                                                     .setOrigin(0.5, 0.5);
        }
        self.person.setDrag(100);
        self.person.setAngularDrag(100);
        self.person.setMaxVelocity(200);
}

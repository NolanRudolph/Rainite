// Used for configuring the Phaser Game
var config = {
        // Type can be Phaser.CANVAS, Phaser.WEBGL, or Phaser.AUTO
        // Phaser.AUTO is recommended because it automatically uses WebGL
        type: Phaser.AUTO,

	// Render the game in an existing <canvas> element if the id exists
        parent: "phaser-example",

        // Resolution to play in, not size of map
        width: 1024,
        height: 1024,
       	title: "Rainite",

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
	/* HEART CONTAINERS */
	this.load.image("f_heart", "assets/Framework/sprite_heart.png");
	this.load.image("e_heart", "assets/Framework/sprite_heart_empty.png");


	/* ROOM SCENARY */
	// Standard Floor
	this.load.image("floor", "assets/Scenary/floor_1.png");

	// Special Floors (e.g. cracked floors)
	this.load.image("floor1", "assets/Scenary/floor_2.png");
	this.load.image("floor2", "assets/Scenary/floor_3.png");
	this.load.image("floor3", "assets/Scenary/floor_4.png");
	this.load.image("floor4", "assets/Scenary/floor_5.png");
	this.load.image("floor5", "assets/Scenary/floor_6.png");
	this.load.image("floor6", "assets/Scenary/floor_7.png");
	this.load.image("floor7", "assets/Scenary/floor_8.png");
	

	// Top left and right corners
	this.load.image("wall_in_top_left", "assets/Scenary/wall_side_top_left.png");
	this.load.image("wall_in_top_right", "assets/Scenary/wall_side_top_right.png");
	
	// Middle for both inner and outer
	this.load.image("wall_mid", "assets/Scenary/wall_mid.png");
	this.load.image("wall_in_mid_top", "assets/Scenary/wall_top_mid.png");
	
	// Inner left and right
	this.load.image("wall_in_left", "assets/Scenary/wall_corner_left.png");
	this.load.image("wall_in_right", "assets/Scenary/wall_corner_right.png");
	this.load.image("wall_in_left_top", "assets/Scenary/wall_inner_corner_top_left.png");
	this.load.image("wall_in_right_top", "assets/Scenary/wall_inner_corner_top_right.png");
	
	// Outer left and right
	this.load.image("wall_out_left", "assets/Scenary/wall_corner_front_left.png");
	this.load.image("wall_out_right", "assets/Scenary/wall_corner_front_right.png");
	this.load.image("wall_out_left_top", "assets/Scenary/wall_top_left.png");
	this.load.image("wall_out_right_top", "assets/Scenary/wall_top_right.png");
	
	// Left and right
	this.load.image("wall_left", "assets/Scenary/wall_side_mid_left.png");
	this.load.image("wall_right", "assets/Scenary/wall_side_mid_right.png");


	/* ANIMATIONS */
	this.load.atlas("knight", "assets/Animations/knight.png", "assets/Animations/knight.json");
	this.load.atlas("slash", "assets/Animations/slash.png", "assets/Animations/slash.json");
	this.load.atlas("rslash", "assets/Animations/rslash.png", "assets/Animations/rslash.json");
}
 
// Displays the images we"ve loaded in preload()
function create() 
{
	/* ROOM STUFF */
	floors = ["floor1", "floor2", "floor3", "floor4", "floor5", "floor6", "floor7"]
	var roomX = game.config.width;
	var roomY = game.config.height;

	// FLOORS
	for (i = 64; i < roomX; i += 64)
	{
		for (j = 128; j < roomY - 64; j += 64)
		{
			let randomNum = Math.random();
			if (randomNum < 0.1)
			{
				let randomNum2 = Math.floor(Math.random() * 7);
				this.add.sprite(i, j, floors[randomNum2]).setScale(4);
			}
			else
			{
				this.add.sprite(i, j, "floor").setScale(4);	
			}
			
		}
	}

	// WALLS
	walls = this.physics.add.staticGroup();

	for (i = 64; i < roomX; i += 64)
	{
		if (i == 64)
		{
			walls.create(i, 0, "wall_in_left_top").setScale(4);
			walls.create(i, 64, "wall_in_left").setScale(4);
			
			// Bottom Left
			walls.create(i, 1024 - 64, "wall_out_left").setScale(4);
			walls.create(i, 1024 - 128, "wall_out_left_top").setScale(4);

			// Left Wall
			for (j = 64; j < roomY - 64; j += 64)
			{
				walls.create(i, j, "wall_right").setScale(4);
			}

		}
		// Right
		else if (i == roomX - 64)
		{
			// Right Wall
			for (j = 64; j < roomY; j += 64)
			{
				walls.create(i, j, "wall_left").setScale(4);
			}

			// Top Right 
			walls.create(i, 64, "wall_in_right").setScale(4);
			walls.create(i, 0, "wall_in_right_top").setScale(4);

			// Bottom Right
			walls.create(i, 1024 - 128, "wall_out_right_top").setScale(4);
			walls.create(i, 1024 - 64, "wall_out_right").setScale(4);
		}
		else
		{
			// Inner Middle
			walls.create(i, 0, "wall_in_mid_top").setScale(4);
			walls.create(i, 64, "wall_mid").setScale(4);

			// Outer Middle
			walls.create(i, 1024 - 128, "wall_in_mid_top").setScale(4);
			walls.create(i, 1024 - 64, "wall_mid").setScale(4);
		}	
	}


	/* PLAYER STUFF */
	
	// Main Player == myPlayer
	this.myPlayer = this.physics.add.sprite(200, 200, "knight", "knight_f_run_anim_f0.png");
	this.myPlayer.classType = "knight";
	this.myPlayer.left = 0;
	this.myPlayer.moved = 0;
	this.myPlayer.attacked = 1;
	this.myPlayer.state = "idle";
	this.myPlayer.setScale(3);
	this.myPlayer.setDrag(100);
	this.myPlayer.setMaxVelocity(750);
	this.myPlayer.health = 100;
	this.myPlayer.lastHeart = 9;
	myPlayer = this.myPlayer;

	// Player should not be able to pass through walls
	this.physics.add.collider(this.myPlayer, walls);

	// Weapon == playerHand
	this.playerHand = this.physics.add.sprite(200, 200, "slash", "best_slash_f5.png");
	this.playerHand.isLeft = false;
	this.playerHand.weaponType = "sword";
	this.playerHand.setScale(1.5);
	this.playerHand.cooldown = 20;

	//var rect = new Phaser.Geom.Rectangle(this, 0, 0, 365, 50, 0xb3a7a6, 0.5);

	// Heart Containers
	this.heart0 = this.add.sprite(25, 25, "f_heart").setScrollFactor(0);
	this.heart1 = this.add.sprite(60, 25, "f_heart").setScrollFactor(0);
	this.heart2 = this.add.sprite(95, 25, "f_heart").setScrollFactor(0);
	this.heart3 = this.add.sprite(130, 25, "f_heart").setScrollFactor(0);
	this.heart4 = this.add.sprite(165, 25, "f_heart").setScrollFactor(0);
	this.heart5 = this.add.sprite(200, 25, "f_heart").setScrollFactor(0);
	this.heart6 = this.add.sprite(235, 25, "f_heart").setScrollFactor(0);
	this.heart7 = this.add.sprite(270, 25, "f_heart").setScrollFactor(0);
	this.heart8 = this.add.sprite(305, 25, "f_heart").setScrollFactor(0);
	this.heart9 = this.add.sprite(340, 25, "f_heart").setScrollFactor(0);
	hearts = [this.heart0, this.heart1, this.heart2, this.heart3, this.heart4, 
		  this.heart5, this.heart6, this.heart7, this.heart8, this.heart9]


	/* SOCKET STUFF */
        // Weird errors occur if we don't use self for addPlayer()
        var self = this;

        // Obtain a socket object for client
        this.socket = io();

        // Define group for holding players & weapons
        this.otherPlayers = this.physics.add.group();
	this.otherWeapons = this.physics.add.group();

        // Listen for socket emission with "currentPlayers" key
        this.socket.on("currentPlayers", function(players) 
	{
                Object.keys(players).forEach(function(id) 
		{
                        // If the new player is this client
                        if(players[id].playerId != self.socket.id) 
			{
                                addOtherPlayers(self, players[id]);
				addOtherWeapons(self, players[id]);
                        }
                });
        });

        // Listen for socket emission with "newPlayer" key
        this.socket.on("newPlayer", function(playerInfo, weaponInfo) {
                // Add the new player to the field
                addOtherPlayers(self, playerInfo);
		addOtherWeapons(self, weaponInfo);
        });

        // 1. Client informs server a player moved
        // 2. Server receives information and broadcasts to all clients
        // 3. This function receives the server request for all clients
        this.socket.on("playerMoved", function(playerInfo, weaponInfo, leftD, typeD, statD) 
	{
		// Update opposing player's data
		self.otherPlayers.getChildren().forEach(function (otherPlayer) 
		{
			if (playerInfo.playerId === otherPlayer.playerId)
			{
				// Move that player from the perspective of the current client
				otherPlayer.setPosition(playerInfo.x, playerInfo.y);

				// Player changed direction (they should now look right)
				if (leftD && playerInfo.left)
				{
					otherPlayer.flipX = true;
				}
				// Player changed faced direction (they should now look left)
				else if (leftD)
				{
					otherPlayer.flipX = false;
				}
				// Player changed character type (e.g. knight to ranger)
				if (typeD != -1)
				{
					// Change character
				}
				// Player changes state (e.g. idle to walk)
				if (statD != -1)
				{
					otherPlayer.play(statD);
				}
			}
		})
		// Update weapon position
		self.otherWeapons.getChildren().forEach(function (otherWeapon)
		{
			if (weaponInfo.playerId === otherWeapon.playerId)
			{
				// Move the position of that weapon
				otherWeapon.setPosition(weaponInfo.x, weaponInfo.y);
				otherWeapon.isLeft = weaponInfo.isLeft;
			}
		})
	});

	// Let all other clients know a player attacked
	this.socket.on("playerAttacked", function(weaponData)
	{
		self.otherWeapons.getChildren().forEach(function (otherWeapon)
		{
			if (weaponData.playerId === otherWeapon.playerId)
			{
				otherWeapon.setVisible(true);
				if (otherWeapon.isLeft)
				{
					otherWeapon.play("slash");
				}
				else
				{
					otherWeapon.play("rslash");
				}
				
				// Did this client get hit?
				var playY = weaponData.y - 22;
				if (weaponData.isLeft)
					var playX = weaponData.x + 18;
				else
					var playX = weaponData.x - 18;

				if (Math.abs(myPlayer.x - playX) < 70 && Math.abs(myPlayer.y - playY) < 30)
				{
					// Implement health mechanics
					this.myPlayer.state = "hit";	
					this.myPlayer.play("hit");
					this.myPlayer.health -= 20;

					if (this.myPlayer.health < 0)
					{
						gameOver(self);
					}

					console.log("My health is ", this.myPlayer.health);
					console.log("Setting between ", Math.floor(this.myPlayer.health % 10), " and 10");
					var low = Math.floor(this.myPlayer.health / 10) > 0 ? Math.floor(this.myPlayer.health / 10) : 0;
					
					this.myPlayer.lastHeart = low;
					for (i = low; i < 10; ++i)
					{
						hearts[i].setTexture("e_heart");
					}


					// Knockback mechanics
					if (myPlayer.x < playX)
					{
						this.myPlayer.setVelocityX(-500)
					}
					else
					{
						this.myPlayer.setVelocityX(500)
					}
					if (this.socket)
					{
						this.socket.emit("playerMovement", {x: this.myPlayer.x, y: this.myPlayer.y, classType: this.myPlayer.classType,
										    left: this.myPlayer.left, state: this.myPlayer.state});
					}
				}
			}
		})
	});

	// Used for "erasing" opponent's weapons after an attack
	this.socket.on("attackStopped", function(playerId)
	{
		self.otherWeapons.getChildren().forEach(function (otherWeapon)
		{
			if (playerId === otherWeapon.playerId)
			{
				otherWeapon.setVisible(false);
			}
		})
	});

        // Listen for socket emission with "disconnect" key
        this.socket.on("disconnect", function (playerId) {
                // Delete the other player's character
		self.otherPlayers.getChildren().forEach(function (otherPlayer) {
                        // Remove that player from the game
                        if (playerId === otherPlayer.playerId)
                        {
                                otherPlayer.destroy();
                        }
                });
		// Delete the other player's weapon
		self.otherWeapons.getChildren().forEach(function (otherWeapon)
		{
			if (playerId === otherWeapon.playerId)
			{
				otherWeapon.destroy();
			}
		});
        });


	/* ANIMATION STUFF */
	this.anims.create({
		key: "walk",
		frames: this.anims.generateFrameNames("knight", {start: 0, end: 3, zeroPad: 0, prefix: "knight_f_run_anim_f", suffix: ".png"}),
		frameRate: 8,
		repeat: -1
	});

	this.anims.create({
		key: "idle",
		frames: this.anims.generateFrameNames("knight", {start:0, end:3, zeroPad: 0, prefix: "knight_f_idle_anim_f", suffix: ".png"}),
		frameRate: 8,
		repeat: -1
	});
	
	this.anims.create({
		key: "slash",
		frames: this.anims.generateFrameNames("slash", {start: 0, end: 6, zeroPad: 0, prefix: "best_slash_f", suffix: ".png"}),
		framerate: 8,
		repeat: 0
	});

	this.anims.create({
		key:"rslash",
		frames: this.anims.generateFrameNames("rslash", {start: 0, end: 6, zeropad: 0, prefix: "best_slash_r_f", suffix:".png"}),
		framerate: 8,
		repeat: 0
	});

	this.anims.create({
		key: "hit",
		frames: this.anims.generateFrameNames("knight", {start: 0, end: 6, zeropad: 0, prefix: "knight_f_hit_anim_f", suffix: ".png"}),
		framerate: 2,
		repeat: 0
	});

	this.myPlayer.play("idle");

	/* CAMERA STUFF */
	this.camera = this.cameras.main;
	this.camera.roundPixels = false;
	this.camera.startFollow(this.myPlayer);


	/* GAME OVER STUFF */
	this.gameOverText = this.add.text(0, 0, "GAME OVER", {fontSize: "64px", fill: "#ff0000"});
	this.gameOverText.setVisible(false);


	/* EXTRA STUFF */
        // Take user input to manipulate their character
        this.cursors = this.input.keyboard.createCursorKeys();
	this.pointer = this.input.activePointer;
}
 
// Constantly updates the status of our objects/sprites
function update(time, delta)
{
        /* PERSONAL PLAYER SECTION */
        // Make sure keystrokes wrt player
        if (this.myPlayer)
        {
		/* MOVEMENT */
                if(this.cursors.left.isDown)
                {
			if (!this.myPlayer.left)
			{
				this.myPlayer.left = 1;
				this.myPlayer.flipX = true;
			}
                        this.myPlayer.setVelocityX(-200);
                }
                if (this.cursors.right.isDown)
                {
			if (this.myPlayer.left)
			{
				this.myPlayer.left = 0;
				this.myPlayer.flipX = false;
			}
                        this.myPlayer.setVelocityX(200);
                }
                if (this.cursors.up.isDown)
                {
                        this.myPlayer.setVelocityY(-200);
                }
                if (this.cursors.down.isDown)
                {
                        this.myPlayer.setVelocityY(200);
                }
                if (!this.cursors.left.isDown && !this.cursors.right.isDown)
                {
                        this.myPlayer.setVelocityX(0);
                }

                if (!this.cursors.up.isDown && !this.cursors.down.isDown)
                {
                        this.myPlayer.setVelocityY(0);
                }
		
		if (this.myPlayer.left)
		{
			this.playerHand.isLeft = true;
			this.playerHand.x = this.myPlayer.x - 18;
			this.playerHand.y = this.myPlayer.y + 22;
		}
		else
		{
			this.playerHand.isLeft = false;
			this.playerHand.x = this.myPlayer.x + 18;
			this.playerHand.y = this.myPlayer.y + 22;
		}

		/* SERVER UPDATING (POSITIONAL) */
		var x = this.myPlayer.x;
		var y = this.myPlayer.y;

		// If the player has moved from previous spot, update all other clients
		if (this.myPlayer.oldPosition && (x !== this.myPlayer.oldPosition.x ||
						y !== this.myPlayer.oldPosition.y))
		{
			if (this.myPlayer.moved && this.myPlayer.anims.currentAnim.key != "hit")
			{
				this.myPlayer.state = "walk";
				this.myPlayer.play("walk");
				this.myPlayer.moved = 0;
			}
			// Socket emission to server to handle new movement from player
			// (See create()'s this.socket.on("playerMoved") for full explanation)
			this.socket.emit("playerMovement", {x: this.myPlayer.x, y: this.myPlayer.y, classType: this.myPlayer.classType, 
							    left: this.myPlayer.left, state: this.myPlayer.state});
		}
		else
		{
			if (!this.myPlayer.moved || this.myPlayer.anims.isPlaying == false)
			{
				this.myPlayer.state = "idle";
				this.myPlayer.play("idle");
				this.myPlayer.moved = 1
				this.socket.emit("playerMovement", {x: this.myPlayer.x, y: this.myPlayer.y, classType: this.myPlayer.classType,
								    left: this.myPlayer.left, state: this.myPlayer.state});
			}
		}

		// Save the player's previous state
		this.myPlayer.oldPosition = 
		{
			x: this.myPlayer.x,
			y: this.myPlayer.y
		}

		/* HEALTH */
		if (this.myPlayer.health < 100)
		{
			this.myPlayer.health += 0.1;
			if (Math.floor(this.myPlayer.health / 10) > this.myPlayer.lastHeart)
			{
				hearts[this.myPlayer.lastHeart].setTexture("f_heart");
				++this.myPlayer.lastHeart;
			}
		}
	}

	/* WEAPON SECTION */
	if (this.playerHand)
	{
		/* SERVER UPDATES */
		if (!this.playerHand.anims.isPlaying && this.myPlayer.attacked)
		{
			this.playerHand.setVisible(false);
			this.socket.emit("attackStop");
			this.myPlayer.attacked = 0;
		}

		/* ATTACKING + SERVER UPDATES */
		if (this.pointer.isDown && this.playerHand.cooldown == 20)
		{
			this.myPlayer.attacked = 1;
			this.playerHand.setVisible(true);
			this.playerHand.cooldown = 0;
			if (this.playerHand.isLeft)
			{
				this.playerHand.play("slash");
				this.socket.emit("playerAttack", {x: this.playerHand.x, y: this.playerHand.y, weaponType: this.playerHand.weaponType,
								  left: this.playerHand.isLeft, playX: this.playerHand.x + 18, playY: this.playerHand.y - 22});
			}
			else
			{
				this.playerHand.play("rslash");
				this.socket.emit("playerAttack", {x: this.playerHand.x, y: this.playerHand.y, weaponType: this.playerHand.weaponType,
								  left: this.playerHand.isLeft, playX: this.playerHand.x - 18, playY: this.playerHand.y - 22});
			}


		}

		/* COOLDOWN */
		if (this.playerHand.cooldown < 20)
		{
			++this.playerHand.cooldown;
		}
	}

        //this.physics.world.wrap(this.player, 5);
}

function addOtherPlayers(self, playerInfo)
{
	const otherPlayer = self.physics.add.sprite(playerInfo.x, playerInfo.y, playerInfo.classType, playerInfo.classType.concat("_f_idle_anim_f0.png"));
       	otherPlayer.setScale(3);
	otherPlayer.play(playerInfo.state);
	otherPlayer.classType = playerInfo.classType;
	otherPlayer.left = playerInfo.left;
	otherPlayer.state = playerInfo.state;
	otherPlayer.playerId = playerInfo.playerId;

        // Add the new player to the list of new players
        self.otherPlayers.add(otherPlayer);
}

function addOtherWeapons(self, weaponInfo)
{
	const otherWeapon = self.physics.add.sprite(weaponInfo.x, weaponInfo.y, "slash", "best_slash_f5.png");
	otherWeapon.setScale(1.5);
	otherWeapon.playerId = weaponInfo.playerId;
	otherWeapon.isLeft = weaponInfo.isLeft;
	otherWeapon.weaponType = weaponInfo.weaponType;
	otherWeapon.setVisible(false);

	console.log("Adding new player ", weaponInfo.playerId, " to weapons where type: ", weaponInfo.weaponType, " // isLeft: ", weaponInfo.isLeft);
	self.otherWeapons.add(otherWeapon);
}

function gameOver(self)
{
	self.physics.pause();
	self.myPlayer.setTint(0xff0000);
	self.gameOverText.setPosition(self.myPlayer.x - 200, self.myPlayer.y - 100);
	self.gameOverText.setVisible(true);
}

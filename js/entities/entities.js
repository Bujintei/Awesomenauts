game.PlayerEntity = me.Entity.extend({
	init:function(x, y, settings){  //our constructor function
		this._super(me.Entity, 'init', [x, y, { //reaching into the constructor of Entity
			image: "player",  // "player" in resources.js
			width: 64, //how much space should they reserve for the sprite
			height: 64, 
			spritewidth: "64", //width and height of sprite is 64
			spriteheight: "64", //width, height, spritewidth, spriteheight almost always same number
			getShape: function() {
				return(new me.Rect(0, 0, 64, 64)).toPolygon(); //return a rectangle of what "player" can walk into
				// 0's are top corners and 64's are the numbers representing the width of the height of the box we're using
			}
		}]);
		this.type = "PlayerEntity";
		this.health = game.data.playerHealth;
		this.body.setVelocity(game.data.playerMoveSpeed, 20); //our character moves 5 units to the right
		this.facing = "right"; //when our character spawns, our character will face right
		this.now = new Date().getTime();
		this.lastHit = this.now;
		this.dead = false;
		this.lastAttack = new Date().getTime();
		me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH); //code makes it so that the camera position stays on our character
		this.renderable.addAnimation("idle", [78]); //sets idle animation to number 78
		this.renderable.addAnimation("walk", [117, 118, 119, 120, 121, 122, 123, 124, 125], 80); //walking uses animations 117-125 and 80 milliseconds through each frame
		this.renderable.addAnimation("attack", [65, 66, 67, 68, 69, 70, 71, 72], 80); //attack animation uses animations 65-72 and 80 milliseconds through each frame

		this.renderable.setCurrentAnimation("idle"); //sets our starting animation as idle

	},

	update: function(delta) {
		this.now = new Date().getTime();

		if (this.health <= 0) {
			this.dead = true;
			this.pos.x = 10;
			this.pos.y = 0;
			this.health = game.data.playerHealth;
		}

		if(me.input.isKeyPressed("right")) {
			//adds to the position of my x by the velocity defined above in
			//setVelocity() and multiplying it by me.timer.tick.
			//me.timer.tick makes the movement look smooth
			this.body.vel.x += this.body.accel.x * me.timer.tick;
			this.facing = "right"; //when the right key is inputed, our character will face the right side and then move to the right.
			this.flipX(true); //flips our walking animation this is facing the left to the right instead
		}
		else if(me.input.isKeyPressed("left")) {
			this.facing = "left"; //when the left key is inputed, our character will face left and then move left all in one go
			this.body.vel.x -= this.body.accel.x * me.timer.tick;
			this.flipX(false); //our animation already is facing left so it won't flip
		}
		else {
			this.body.vel.x = 0;
		}

		if(me.input.isKeyPressed("jump") && !this.jumping && !this.falling) { //if we click jump and if we're not jumping or falling
			this.body.jumping = true; //our character will jump
			this.body.vel.y -= this.body.accel.y * me.timer.tick;
		}

 
		if(me.input.isKeyPressed("attack")) { //attack inputted
			if(!this.renderable.isCurrentAnimation("attack")) { //current animation is not attack
				this.renderable.setCurrentAnimation("attack", "idle"); //sets our animation to run our attack animation then turns it back to idle
				this.renderable.setAnimationFrame(); //makes it so that the next time we start the animation, it starts from the first animation and not wherever we left off when we switched to another animation
			}
		}
		
		else if(this.body.vel.x !== 0 && !this.renderable.isCurrentAnimation("attack") ) { //only goes to walk animation if hes moving
			if(!this.renderable.isCurrentAnimation("walk")) { //don't start walking animation if you are already walking
			this.renderable.setCurrentAnimation("walk");
			}
		}
		else if (!this.renderable.isCurrentAnimation("attack")) {
			this.renderable.setCurrentAnimation("idle"); //if we're not walking, our animation would b idle
		}

		me.collision.check(this, true, this.collideHandler.bind(this), true);
		this.body.update(delta) ; //animation is updating on the fly

		this._super(me.Entity, "update", [delta]); //updates our animations gfor me.Entity
		return true;
	},

	loseHealth: function(damage) {
		console.log(this.health);
		this.health = this.health - damage;
	},

	collideHandler: function(response){
		if(response.b.type==='EnemyBaseEntity') { //checks if we're colliding with 'EnemyBaseEntity'
			var ydif = this.pos.y - response.b.pos.y; //represents difference between player y position and the enemy base y position
			var xdif = this.pos.x - response.b.pos.x; //represents difference between player x position and the enemy base x position

			if(ydif<-40 && xdif<70 && xdif>-35){
				this.body.falling = false;
				this.body.vel.y = -1;
			}
			else if(xdif>-35 && this.facing==='right' && (xdif<0)) { //if xdif is greater than -35 and facing right (xdif is less than 0)
				this.body.vel.x = 0;
				this.pos.x = this.pos.x -1;
			}
			else if(xdif<70 && this.facing==='left' && xdif>0) { //if ydif is less than 70 and facing left (xdif greater than 0)
				this.body.vel.x = 0;
				this.pos.x = this.pos.x +1;
			}

			if(this.renderable.isCurrentAnimation("attack") && this.now-this.lastHit >= game.data.playerAttackTimer) {
				this.lastHit = this.now;
				response.b.loseHealth(game.data.playerAttack);
			}
		}
		else if(response.b.type === 'EnemyCreep'){
			var xdif = this.pos.x - response.b.pos.x;
			var ydif = this.pos.y - response.b.pos.y;
			if (xdif>0) {
				this.pos.x = this.pos.x + 1;
				if(this.facing === 'left'){
					this.body.vel.x = 0;
				}
			}
			else{
				this.pos.x = this.pos.x - 1;
				if (this.facing === 'right') {
					this.body.vel.x = 0;
				};
			};
			if (this.renderable.isCurrentAnimation('attack') && this.now-this.lastHit >= game.data.playerAttackTimer && (Math.abs(ydif<=40) && 
				((xdif>0) && this.facing === 'left') || ((xdif < 0 ) && this.facing === 'right')
				)){
				this.lastHit = this.now;
				response.b.loseHealth(game.data.playerAttack1);
			};
		}
	}
});

game.PlayerBaseEntity = me.Entity.extend({
	init : function(x, y, settings) { //same like PlayerEntity above for our constructor function
		this._super(me.Entity, 'init', [x, y, {
			image: "tower",
			width: 100,
			height:100,
			spritewidth: "100",
			spriteheight: "100",
			getShape: function() {
				return (new me.Rect(0, 0, 100, 70)).toPolygon();
			}
		}]);
		this.broken = false; //tower has not been destroyed
		this.health = game.data.playerBaseHealth; //sets its hp to 10
		this.alwaysUpdate = true; //always updates even if its not on screen
		this.body.onCollision = this.onCollision.bind(this); //if you can colide with turret/tower
		this.type = "PlayerBase"; //type for other collisions so we can check what we're running into when we're hitting otherstuff

		this.renderable.addAnimation("idle", [0]); //animation number 0 is our idle animation
		this.renderable.addAnimation("broken", [1]); //animation number 1 is our broken tower animation
		this.renderable.setCurrentAnimation("idle"); //sets the current/starting animation to our idle animation stated above

	},

	update:function(delta) { //delta represents time from last update
		if(this.health<=0) { //if health is less than or equal to 0, then our turret is dead
			this.broken = true; 
			this.renderable.setCurrentAnimation("broken"); //if our tower is dead, then animation turns from "idle" to "broken"
		}
		this.body.update(delta); //updates(herpderp)

		this._super(me.Entity, "update", [delta]); //call super in any update function and pass it as a update function then re
		return true;
	},

	loseHealth: function(damage) {
		this.health = this.health - damage;
	},

	onCollision: function() {

	}


});

game.EnemyBaseEntity = me.Entity.extend({ //same freakin thing as the player base entity
	init : function(x, y, settings) { 
		this._super(me.Entity, 'init', [x, y, {
			image: "tower",
			width: 100,
			height:100,
			spritewidth: "100",
			spriteheight: "100",
			getShape: function() {
				return (new me.Rect(0, 0, 100, 70)).toPolygon();
			}
		}]);
		this.broken = false;
		this.health = game.data.enemyBaseHealth;
		this.alwaysUpdate = true;
		this.body.onCollision = this.onCollision.bind(this);

		this.type = "EnemyBaseEntity";

		this.renderable.addAnimation("idle", [0]);
		this.renderable.addAnimation("broken", [1]);
		this.renderable.setCurrentAnimation("idle");

	},

	update:function(delta) {
		if(this.health<=0) {
			this.broken = true;
			this.renderable.setCurrentAnimation("broken");
		}
		this.body.update(delta);

		this._super(me.Entity, "update", [delta]);
		return true;
	},

	onCollision: function() {
		
	},

	loseHealth: function() {
		this.health--;
	}

});


game.EnemyCreep = me.Entity.extend({
	init : function(x, y, settings) {
		this._super(me.Entity, 'init', [x, y, {
			image: "creep1",
			width: 32,
			height: 64,
			spritewidth: "32",
			spriteheight: "64",
			getShape: function() {
				return (new me.Rect(0, 0, 32, 64)).toPolygon();
			}
		}]);
		this.health = game.data.enemyCreepHealth;
		this.alwaysUpdate = true;
		this.attacking  = false;
		this.lastHit = new Date().getTime();
		this.now = new Date().getTime();
		this.body.setVelocity(3, 20);

		this.type = "EnemyCreep";

		this.renderable.addAnimation("walk", [3, 4, 5], 80);
		this.renderable.setCurrentAnimation("walk");
	},

	loseHealth: function(damage) {
		this.health = this.health - damage;
	},

	update: function(delta) {
		console.log(this.health);
		if(this.health <= 0) {
			me.game.world.removeChild(this);
		}
		this.now = new Date().getTime();
		this.body.vel.x -= this.body.accel.x * me.timer.tick;
		me.collision.check(this, true, this.collideHandler.bind(this), true);
		this.body.update(delta);
		this._super(me.Entity, "update", [delta]);
		return true;

	},

	collideHandler: function(response) {
		if(response.b.type==='PlayerBase') {
			this.attacking=true;
			this.body.vel.x = 0;
			this.pos.x = this.pos.x + 1;
			if((this.now-this.lastHit >= game.data.enemyCreepAttackTimer)) {
				this.lastHit = this.now;
				response.b.loseHealth(game.data.enemyCreepAttack);
			}		
		}
		else if (response.b.type==='PlayerEntity') {
			var xdif = this.pos.x - response.b.pos.x;
			this.attacking=true;
			if(xdif>0) {
				this.pos.x = this.pos.x + 1;
				this.body.vel.x = 0;
			}
			if((this.now-this.lastHit >= game.data.enemyCreepAttackTimer) && xdif>0) {
				this.lastHit = this.now;
				response.b.loseHealth(game.data.enemyCreepAttack);	
			}
		}	
	}
});

game.GameManager = Object.extend({
	init: function(x, y, settings) {
		this.now = new Date().getTime();
		this.lastCreep = new Date().getTime();

		this.alwaysUpdate = true;
	},

	update: function() {
		this.now = new Date().getTime();

		if(Math.round(this.now/1000)%10 ===0 && (this.now - this.lastCreep >= 1000)) {
			this.lastCreep = this.now;
			var creepe = me.pool.pull("EnemyCreep", 1000, 0, {});
			me.game.world.addChild(creepe, 5);
		}

		return true;
	}
})

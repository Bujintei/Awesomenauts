game.PlayerEntity = me.Entity.extend({
	init:function(x, y, settings){  //our constructor function
		this.setSuper(x, y);
		this.setPlayerTimers();
		this.setAttributes();
		this.type = "PlayerEntity";
		this.setFlags(); //flags are stuff that has one value like true/false or right/left

		me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH); //code makes it so that the camera position stays on our character

		this.addAnimation();

		this.renderable.setCurrentAnimation("idle"); //sets our starting animation as idle
	},

	setSuper: function(x, y) {
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
	},

	setPlayerTimers: function() {
		this.now = new Date().getTime();
		this.lastHit = this.now;
		this.lastSpear = this.now;
		this.lastAttack = new Date().getTime();
	},

	setAttributes: function() {
		this.health = game.data.playerHealth;
		this.body.setVelocity(game.data.playerMoveSpeed, 20); //our character moves 5 units to the right
		this.attack = game.data.playerAttack1;
	},

	setFlags: function() {
		this.facing = "right"; //when our character spawns, our character will face right
		this.dead = false;
		this.attacking = false;
	},

	addAnimation: function() {
		this.renderable.addAnimation("idle", [78]); //sets idle animation to number 78
		this.renderable.addAnimation("walk", [117, 118, 119, 120, 121, 122, 123, 124, 125], 80); //walking uses animations 117-125 and 80 milliseconds through each frame
		this.renderable.addAnimation("attack", [65, 66, 67, 68, 69, 70, 71, 72], 80); //attack animation uses animations 65-72 and 80 milliseconds through each frame
	},

	update: function(delta) {
		this.now = new Date().getTime();
		this.dead = this.checkIfDead();
		this.checkKeyPressesAndMove();
		this.checkAbilityKeys();
 		this.setAnimation();
		me.collision.check(this, true, this.collideHandler.bind(this), true);
		this.body.update(delta) ; //animation is updating on the fly
		this._super(me.Entity, "update", [delta]); //updates our animations gfor me.Entity
		return true;
	},

	checkIfDead: function() {
		if (this.health <= 0) {
			return true;
		}
		return false;
	},

	checkKeyPressesAndMove: function() {
		if(me.input.isKeyPressed("right")) {
			this.moveRight();
		}
		else if(me.input.isKeyPressed("left")) {
			this.moveLeft();
		}
		else {
			this.body.vel.x = 0;
		}

		if(me.input.isKeyPressed("jump") && !this.jumping && !this.falling) { //if we click jump and if we're not jumping or falling
			this.jump();
		}

		this.attacking = me.input.isKeyPressed("attack");
	},

	moveRight: function() {
		//adds to the position of my x by the velocity defined above in
		//setVelocity() and multiplying it by me.timer.tick.
		//me.timer.tick makes the movement look smooth
		this.body.vel.x += this.body.accel.x * me.timer.tick;
		this.facing = "right"; //when the right key is inputed, our character will face the right side and then move to the right.
		this.flipX(true); //flips our walking animation this is facing the left to the right instead
	},

	moveLeft: function() {
		this.facing = "left"; //when the left key is inputed, our character will face left and then move left all in one go
		this.body.vel.x -= this.body.accel.x * me.timer.tick;
		this.flipX(false); //our animation already is facing left so it won't flip
	},

	jump: function() {
		this.body.jumping = true; //our character will jump
		this.body.vel.y -= this.body.accel.y * me.timer.tick;
	},

	checkAbilityKeys: function() {
		if(me.input.isKeyPressed("skill1")){
			//grants a few seconds of increased agility to our player
			//this.speedBurst();
		}
		else if(me.input.isKeyPressed("skill2")){
			//will destroy a creep
			//this.eatCreep();
		}
		else if(me.input.isKeyPressed("skill3")){
			//throw a spear to presumably damage/kill a minion
			console.log("skill3");
			this.throwSpear();
		}
	},

	throwSpear: function(){
		if((this.now-this.lastSpear) >= game.data.spearTimer*1000 && game.data.ability3 > 0){
			this.lastSpear = this.now;
				var spear = me.pool.pull("spear", this.pos.x, this.pos.y, {}, this.facing);
				me.game.world.addChild(spear, 10);
		}
	},

	setAnimation: function() {
		if(this.attacking) { 
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
	},

	loseHealth: function(damage) {
		this.health = this.health - damage;
	},

	collideHandler: function(response){
		if(response.b.type==='EnemyBaseEntity') { //checks if we're colliding with 'EnemyBaseEntity'
			this.collideWithEnemyBase(response);
		}
		else if(response.b.type === 'EnemyCreep'){
			this.collideWithEnemyCreep(response);
		}
	},

	collideWithEnemyBase: function(response) {
		var ydif = this.pos.y - response.b.pos.y; //represents difference between player y position and the enemy base y position
		var xdif = this.pos.x - response.b.pos.x; //represents difference between player x position and the enemy base x position

		if(ydif<-40 && xdif<70 && xdif>-35){
			this.body.falling = false;
			this.body.vel.y = -1;
		}
		else if(xdif>-35 && this.facing==='right' && (xdif<0)) { //if xdif is greater than -35 and facing right (xdif is less than 0)
			this.body.vel.x = 0;
		}
		else if(xdif<70 && this.facing==='left' && xdif>0) { //if ydif is less than 70 and facing left (xdif greater than 0)
			this.body.vel.x = 0;
		}

		if(this.renderable.isCurrentAnimation("attack") && this.now-this.lastHit >= game.data.playerAttackTimer) {
			this.lastHit = this.now;
			response.b.loseHealth(game.data.playerAttack);
		}
	},

	collideWithEnemyCreep: function(response) {
		var xdif = this.pos.x - response.b.pos.x;
		var ydif = this.pos.y - response.b.pos.y;

		this.stopMovement(xdif);

		if(this.checkAttack(xdif, ydif)) {
			this.hitCreep(response);		
		};
	},

	stopMovement: function(xdif) {
		if (xdif>0) {
			if(this.facing === 'left'){
				this.body.vel.x = 0;
			}
		}
		else{
			if (this.facing === 'right') {
				this.body.vel.x = 0;
			};
		};		
	},

	checkAttack: function(xdif, ydif) {
		if (this.renderable.isCurrentAnimation('attack') && this.now-this.lastHit >= game.data.playerAttackTimer && (Math.abs(ydif<=40) && 
			((xdif>0) && this.facing === 'left') || ((xdif < 0 ) && this.facing === 'right')
			)){
			this.lastHit = this.now;
			//if the creeps health is less than out attack, execute code in if statement
			return true;
		}
		return false;
	},

	hitCreep: function(response) {
		if(response.b.health <= game.data.playerAttack1) {
			//adds fifteen gold for a creep kill
			game.data.gold += 15;
			console.log("Current gold: " + game.data.gold);
		}

		response.b.loseHealth(game.data.playerAttack1);			
	}
});
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

		this.body.setVelocity(5, 20); //our character moves 5 units to the right
		me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH); //code makes it so that the camera position stays on our character

		this.renderable.addAnimation("idle", [78]); //sets idle animation to number 78
		this.renderable.addAnimation("walk", [117, 118, 119, 120, 121, 122, 123, 124, 125], 80); //walking uses animations 117-125 and 80 milliseconds through each frame
		this.renderable.addAnimation("attack", [65, 66, 67, 68, 69, 70, 71, 72], 80); //attack animation uses animations 65-72 and 80 milliseconds through each frame

		this.renderable.setCurrentAnimation("idle"); //sets our starting animation as idle

	},

	update: function(delta) {
		if(me.input.isKeyPressed("right")) {
			//adds to the position of my x by the velocity defined above in
			//setVelocity() and multiplying it by me.timer.tick.
			//me.timer.tick makes the movement look smooth
			this.body.vel.x += this.body.accel.x * me.timer.tick;
			this.flipX(true); //flips our walking animation this is facing the left to the right instead
		}
		else{
			this.body.vel.x = 0;
		}

		if(me.input.isKeyPressed("attack")) {
			if(!this.renderable.isCurrentAnimation("attack")) {
				this.renderable.setCurrentAnimation("attack", "idle");
				this.renderable.setAnimationFrame();
			}
		}
		
		else if(this.body.vel.x !== 0 ) { //only goes to walk animation if hes moving
			if(!this.renderable.isCurrentAnimation("walk")) { //don't start walking animation if you are already walking
			this.renderable.setCurrentAnimation("walk");
			}
		}
		else{
			this.renderable.setCurrentAnimation("idle"); //if we're not walking, our animation would b idle
		}

		

		this.body.update(delta) ; //animation is updating on the fly

		this._super(me.Entity, "update", [delta]); //updates our animations gfor me.Entity
		return true;
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
				return (new me.Rect(0, 0, 100, 100)).toPolygon();
			}
		}]);
		this.broken = false; //tower has not been destroyed
		this.health = 10; //sets its hp to 10
		this.alwaysUpdate = true; //always updates even if its not on screen
		this.body.onCollision = this.onCollision.bind(this); //if you can colide with turret/tower
		console.log("init");
		this.type = "PlayerBaseEntity"; //type for other collisions so we can check what we're running into when we're hitting otherstuff

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
				return (new me.Rect(0, 0, 100, 100)).toPolygon();
			}
		}]);
		this.broken = false;
		this.health = 10;
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
			this.setCurrentAnimation("broken");
		}
		this.body.update(delta);

		this._super(me.Entity, "update", [delta]);
		return true;
	},

	onCollision: function() {
		
	}

});

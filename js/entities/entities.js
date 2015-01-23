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
	},

	update: function(delta) {
		if(me.input.isKeyPressed("right")) {
			//adds to the position of my x by the velocity defined above in
			//setVelocity() and multiplying it by me.timer.tick.
			//me.timer.tick makes the movement look smooth
			this.body.vel.x += this.body.accel.x * me.timer.tick;
		}
		else{
			this.body.vel.x = 0;
		}

		this.body.update(delta) ;
		return true;
	}
});
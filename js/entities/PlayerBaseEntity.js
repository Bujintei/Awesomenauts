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
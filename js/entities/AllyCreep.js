// working on Ally Creep

// game.AllyCreepCreep = me.Entity.extend({
// 	init: function(x, y, settings){
// 		this._super(me.Entity, 'init', [x, y, {
// 			image: "creep2",
// 			width: 100,
// 			height:85,
// 			spritewidth: "100",
// 			spriteheight: "85",
// 			getShape: function(){
// 				return (new me.Rect(0, 0, 52, 100)).toPolygon();	
// 			}
// 		}]);
		
// 		this.health = game.data.allyCreepHealth;
// 		this.alwaysUpdate = true;
// 		this.attacking = false;
// 		this.lastAttacking = new Date().getTime();
// 		this.lastHit = new Date().getTime();
// 		this.now = new Date().getTime();

// 		this.body.setVelocity(game.data.allyCreepMoveSpeed, 20);

// 		this.type = "AllyCreep";

// 		this.renderable.addAnimation("walk", [0, 1, 2, 3, 4], 80);
// 		this.renderable.setCurrentAnimation("walk");
// 	},

// 	update: function(delta) {
// 		this.flipX(true);
// 		if(this.health <= 0) {
// 			me.game.world.removeChild(this);
// 		}
// 		this.now = new Date().getTime();
// 		this.body.vel.x -= this.body.accel.x * me.timer.tick;
// 		me.collision.check(this, true, this.collideHandler.bind(this), true);
// 		this.body.update(delta);
// 		this._super(me.Entity, "update", [delta]);
// 		return true;
// 		},
	

// 	collideHandler: function(response)	{
// 		if(response.b.type==='EnemyBaseEntity'){
// 			this.attacking = true;
// 			this.body.vel.x = 0;
// 			this.pos.x = this.pos.x +1;
// 			if((this.now-this.lastHit <= game.data.allyCreepAttackTimer)){
// 				this.lastHit = this.now;
// 				response.b.loseHealth(1);
// 			 	}
// 			}
// 		}
// 	});
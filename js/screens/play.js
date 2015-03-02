game.PlayScreen = me.ScreenObject.extend({
	/**
	 *  action to perform on state change
	 */
	onResetEvent: function() {
		// reset the score
		game.data.score = 0;

		me.levelDirector.loadLevel("level01"); //tells us which map its going to load

		this.resetPlayer(0, 420);

		var gameTimerManager = me.pool.pull("GameTimeManager", 0, 0, {});
		me.game.world.addChild(gameTimerManager, 0);

		var heroDeathManager = me.pool.pull("HeroDeathManager", 0, 0, {});
		me.game.world.addChild(heroDeathManager, 0);

		me.input.bindKey(me.input.KEY.RIGHT, "right"); //binds our right arrow key to move our character to the right and only to the right hence the code
		me.input.bindKey(me.input.KEY.LEFT, "left"); //binds left key to move our character left
		me.input.bindKey(me.input.KEY.SPACE, "jump"); //binds space to make our character jump
		me.input.bindKey(me.input.KEY.A, "attack"); //binds our a key to attack

		// add our HUD to the game world
		this.HUD = new game.HUD.Container();
		me.game.world.addChild(this.HUD);
	},


	/**
	 *  action to perform when leaving this screen (state change)
	 */
	onDestroyEvent: function() {
		// remove the HUD from the game world
		me.game.world.removeChild(this.HUD);
	},

	resetPlayer: function(x, y) {
		game.data.player = me.pool.pull("player", x, y, {}); 
		me.game.world.addChild(game.data.player, 5);
	}	
});

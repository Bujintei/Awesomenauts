game.PlayScreen = me.ScreenObject.extend({
	/**
	 *  action to perform on state change
	 */
	onResetEvent: function() {
		// reset the score
		game.data.score = 0;

		me.levelDirector.loadLevel("level01"); //tells us which map its going to load

		var player = me.pool.pull("player", 0, 420, {}); //pull player from pool.register in game.js and puts what area we spawn him in
		me.game.world.addChild(player, 5); //adds him to our world // z variable is how close he is to the screen //higher this number the closer he is to the screen

		me.input.bindKey(me.input.KEY.RIGHT, "right"); //binds our right arrow key to move our character to the right and only to the right hence the code
		me.input.bindKey(me.input.KEY.A, "attack");

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
	}
});

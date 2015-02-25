Adventurous.MainMenu = function (game)
{
	this.playButton;
};

Adventurous.MainMenu.prototype =
{

	create: function ()
    {
		this.add.sprite(0, 0, 'title_background');
		this.playButton = this.add.button(game.width/2, game.height/2, 'button_play', this.startGame, this, 1, 0, 2);
        this.playButton.x -= this.playButton.width/2;
        this.playButton.y -= this.playButton.height/2;
        
        this.cursor = new Adventurous.Cursor();
        game.antialias = true;
        Phaser.Canvas.setSmoothingEnabled(game.renderer.context, true);
	},

	update: function ()
    {
        this.cursor.update();
	},

	startGame: function (pointer)
    {
		this.game.state.start('Game');
	}

};

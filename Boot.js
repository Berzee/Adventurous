Adventurous = {};
Adventurous.flags = {};
Adventurous.speeches = {};
Adventurous.options =
    {
        "mute":false,
        "soundVolume":1,
        "musicVolume":0.5,
        "voiceEnabled":true,
        "textSpeed":0.5
    };

Adventurous.Boot = function (game)
{

};

Adventurous.Boot.prototype =
{

	preload: function ()
    {
		this.load.image('preloader_background', 'images/preloader_background.gif');
		this.load.image('preloader_bar', 'images/preloader_bar.gif');
        this.load.text('conversations','text/conversations.txt');
        this.load.text('interactions','text/interactions.txt');
        this.load.text('observations','text/observations.txt');
        this.load.text('combinations','text/combinations.txt');
        this.load.text('speeches','text/speeches.txt');
        this.load.text('scenes','text/scenes.txt');
        this.load.text('preload','text/preload.txt');
	},

	create: function ()
    {
        if(game.device.firefox)
        {
            Adventurous.Constants.BROWSER_LABEL_Y_OFFSET = 4;
        }
        
		this.game.input.maxPointers = 1;

	    if (this.game.device.desktop)
	    {
		    this.game.stage.scale.pageAlignHorizontally = true;
	    }
	    else
	    {
		    this.game.stage.scaleMode = Phaser.StageScaleMode.SHOW_ALL;
		    this.game.stage.scale.minWidth = 480;
		    this.game.stage.scale.minHeight = 260;
		    this.game.stage.scale.maxWidth = 1024;
		    this.game.stage.scale.maxHeight = 768;
		    this.game.stage.scale.forceLandscape = true;
		    this.game.stage.scale.pageAlignHorizontally = true;
		    this.game.stage.scale.setScreenSize(true);
	    }

		this.game.state.start('Preloader');
	}

};

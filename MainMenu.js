Adventurous.MainMenu = function (game)
{
	this.playButton;
};

Adventurous.MainMenu.prototype =
{

	create: function ()
    {
		this.add.sprite(0, 0, 'title_background');
        
        this.menuGroup = game.add.group();
        
        this.playLabel = game.add.text(game.width/2, Adventurous.Constants.MAIN_MENU_FIRST_ITEM_Y_POS+Adventurous.Constants.BROWSER_LABEL_Y_OFFSET, "New Game", Adventurous.Constants.MAIN_MENU_LABEL_STYLE);
        this.playLabel.x -= Math.floor(this.playLabel.width/2);
        this.menuGroup.add(this.playLabel);
        
        this.loadLabel = game.add.text(game.width/2, this.playLabel.y+Adventurous.Constants.MAIN_MENU_LINE_HEIGHT, "Load Game", Adventurous.Constants.MAIN_MENU_LABEL_STYLE);
        this.loadLabel.x -= Math.floor(this.loadLabel.width/2);
        this.menuGroup.add(this.loadLabel);
        
        this.optionsLabel = game.add.text(game.width/2, this.loadLabel.y+Adventurous.Constants.MAIN_MENU_LINE_HEIGHT, "Options", Adventurous.Constants.MAIN_MENU_LABEL_STYLE);
        this.optionsLabel.x -= Math.floor(this.optionsLabel.width/2);
        this.menuGroup.add(this.optionsLabel);
		
        this.cursor = new Adventurous.Cursor();
        
        game.input.onDown.add(this.mouseDown, this);
        
        game.antialias = true;
        Phaser.Canvas.setSmoothingEnabled(game.renderer.context, true);
        
        if(Adventurous.backgroundMusic == null)
        {
            Adventurous.backgroundMusic = this.game.add.audio(Adventurous.Constants.MAIN_MENU_MUSIC);
            Adventurous.backgroundMusic.volume = Adventurous.options.musicVolume;
            Adventurous.backgroundMusic.loop = true;
            Adventurous.backgroundMusic.play();   
        }
	},
    
    mouseDown: function(pointer)
    {
        if(pointer.button == Adventurous.Constants.LMB)
        {
            if(this.menuGroup.visible)
            {
                for(var i = 0; i < this.menuGroup.length; i++)
                {
                    var label = this.menuGroup.getAt(i);
                    if(Adventurous.Util.isMouseOverObject(label))
                    {
                        this.selectOption(label.text);
                    }
                }
            }
        }
    },
    
    selectOption: function(option)
    {
        switch(option)
        {                
            case "New Game":
                this.startGame();
                break;
                
            case "Load Game":
                this.loadGame("test");
                break;
                
            case "Options":
                break;

            default:
                break;
        }
    },
    
    updateLabels: function()
    {
        if(this.menuGroup.visible)
        {
            for(var i = 0; i < this.menuGroup.length; i++)
            {
                var label = this.menuGroup.getAt(i);
                if(Adventurous.Util.isMouseOverObject(label))
                {
                    label.setStyle(Adventurous.Constants.SELECTED_MAIN_MENU_LABEL_STYLE);
                }
                else
                {
                    label.setStyle(Adventurous.Constants.MAIN_MENU_LABEL_STYLE);
                }
            }
        }
    },

	update: function ()
    {
        this.cursor.update();
        this.updateLabels();
	},
    
    loadGame: function (name)
    {
        Adventurous.gameToLoad = name;
        this.game.state.start('Game');
    },

	startGame: function ()
    {
        Adventurous.gameToLoad = null;
        Adventurous.flags = {};
		this.game.state.start('Game');
	}

};

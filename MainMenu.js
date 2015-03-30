Adventurous.MainMenu = function (game)
{
	this.playButton;
};

Adventurous.MainMenu.prototype =
{

	create: function ()
    {
		this.background = this.add.sprite(0, 0, 'title_background');
        
        this.creditsBackground = this.add.sprite(0, 0, 'credits_background');
        this.creditsBackground.visible = false;
        
        this.menuGroup = game.add.group();
        
        this.helpLabel = game.add.text(game.width/2, Adventurous.Constants.MAIN_MENU_FIRST_ITEM_Y_POS+Adventurous.Constants.BROWSER_LABEL_Y_OFFSET, "How to Play", Adventurous.Constants.MAIN_MENU_LABEL_STYLE);
        this.helpLabel.x -= Math.floor(this.helpLabel.width/2);
        this.menuGroup.add(this.helpLabel);
        
        this.playLabel = game.add.text(game.width/2, this.helpLabel.y+Adventurous.Constants.MAIN_MENU_LINE_HEIGHT, "New Game", Adventurous.Constants.MAIN_MENU_LABEL_STYLE);
        this.playLabel.x -= Math.floor(this.playLabel.width/2);
        this.menuGroup.add(this.playLabel);
        
        this.loadLabel = game.add.text(game.width/2, this.playLabel.y+Adventurous.Constants.MAIN_MENU_LINE_HEIGHT, "Load Game", Adventurous.Constants.MAIN_MENU_LABEL_STYLE);
        this.loadLabel.x -= Math.floor(this.loadLabel.width/2);
        this.menuGroup.add(this.loadLabel);
        
        this.optionsLabel = game.add.text(game.width/2, this.loadLabel.y+Adventurous.Constants.MAIN_MENU_LINE_HEIGHT, "Options", Adventurous.Constants.MAIN_MENU_LABEL_STYLE);
        this.optionsLabel.x -= Math.floor(this.optionsLabel.width/2);
        this.menuGroup.add(this.optionsLabel);
        
        this.creditsLabel = game.add.text(game.width/2, this.optionsLabel.y+Adventurous.Constants.MAIN_MENU_LINE_HEIGHT, "Credits", Adventurous.Constants.MAIN_MENU_LABEL_STYLE);
        this.creditsLabel.x -= Math.floor(this.creditsLabel.width/2);
        this.menuGroup.add(this.creditsLabel);
        
        this.creditsText = game.add.text(10,10,Adventurous.Constants.CREDITS_TEXT, Adventurous.Constants.MAIN_MENU_LABEL_STYLE);
        this.creditsText.visible = false;
        
        this.creditsButton = new Adventurous.Button(game.width/2,game.height-Adventurous.Constants.MAIN_MENU_LINE_HEIGHT,"OK","mainMenu_button",
                                        Adventurous.Constants.MAIN_MENU_LABEL_STYLE,Adventurous.Constants.SELECTED_MAIN_MENU_LABEL_STYLE);
        this.creditsButton.buttonGroup.visible = false;
		
        this.pauseMenu = new Adventurous.PauseMenu();
        
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
            if(this.pauseMenu.background.visible)
            {
                if(this.pauseMenu.helpGroup.visible)
                {
                    if(Adventurous.Util.isMouseOverObject(this.pauseMenu.helpButtons[0].background))
                    {
                        this.hidePauseMenu();
                    }
                }
                else if(this.pauseMenu.savegameGroup.visible)
                {
                    this.pauseMenu.handleSaveGameButtonClicks(true);
                }
                else if(this.pauseMenu.optionsGroup.visible)
                {
                    this.pauseMenu.handleOptionsButtonClicks(true);
                }
            }
            else if(this.menuGroup.visible)
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
            else if(this.creditsButton.buttonGroup.visible)
            {
                if(Adventurous.Util.isMouseOverObject(this.creditsButton.background))
                {
                    this.menuGroup.visible = true;
                    this.background.visible = true;
                    this.creditsBackground.visible = false;
                    this.creditsText.visible = false;
                    this.creditsButton.buttonGroup.visible = false;
                }
            }
        }
    },
    
    hidePauseMenu: function()
    {
        var clickSound = game.add.audio(Adventurous.Constants.MENU_BUTTON_SOUND);
        clickSound.volume = Adventurous.options.soundVolume;
        clickSound.play();
        
        this.pauseMenu.background.visible = false;
        this.pauseMenu.helpGroup.visible = false;
    },
    
    selectOption: function(option)
    {
        switch(option)
        {     
            case "How to Play":
                this.pauseMenu.background.visible = true;
                this.pauseMenu.showGroup(this.pauseMenu.helpGroup);
                break;
                
            case "New Game":
                this.startGame();
                break;
                
            case "Load Game":
                this.pauseMenu.background.visible = true;
                this.pauseMenu.showLoadGame();
                break;
                
            case "Options":
                this.pauseMenu.background.visible = true;
                this.pauseMenu.showGroup(this.pauseMenu.optionsGroup);
                break;
                
            case "Credits":
                this.menuGroup.visible = false;
                this.background.visible = false;
                this.creditsBackground.visible = true;
                this.creditsText.visible = true;
                this.creditsButton.buttonGroup.visible = true;
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
        this.pauseMenu.update();
        this.creditsButton.updateLabel();
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

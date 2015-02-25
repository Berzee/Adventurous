Adventurous.PauseMenu = function ()
{
    this.background = game.add.sprite(game.width/2,game.height/2,"pause_menu_background");
    this.menuGroup = game.add.group();
    game.physics.enable(this.background, Phaser.Physics.ARCADE, true);
    this.background.anchor.x = 0.5;
    this.background.anchor.y = 0.5;
    this.background.visible = false;
    this.menuGroup.visible = false;
    this.enabled = false;
    
    this.escapeKey = game.input.keyboard.addKey(Phaser.Keyboard.ESC);
    this.escapeKey.onDown.add(this.togglePauseMenu, this);
    
    //Add menu options
    var y = Adventurous.Constants.PAUSE_MENU_FIRST_ITEM_Y_POS;
    var label = game.add.text(this.background.x, y, "Continue", Adventurous.Constants.DIALOGUE_LABEL_STYLE);
    label.anchor.x = 0.5;
    this.menuGroup.add(label);
    
    y += Adventurous.Constants.PAUSE_MENU_LINE_HEIGHT;
    label = game.add.text(this.background.x, y, "Save Game", Adventurous.Constants.DIALOGUE_LABEL_STYLE);
    label.anchor.x = 0.5;
    this.menuGroup.add(label);
    
    y += Adventurous.Constants.PAUSE_MENU_LINE_HEIGHT;
    label = game.add.text(this.background.x, y, "Load Game", Adventurous.Constants.DIALOGUE_LABEL_STYLE);
    label.anchor.x = 0.5;
    this.menuGroup.add(label);
    
    y += Adventurous.Constants.PAUSE_MENU_LINE_HEIGHT;
    label = game.add.text(this.background.x, y, "Options", Adventurous.Constants.DIALOGUE_LABEL_STYLE);
    label.anchor.x = 0.5;
    this.menuGroup.add(label);
    
    y += Adventurous.Constants.PAUSE_MENU_LINE_HEIGHT;
    label = game.add.text(this.background.x, y, "Help", Adventurous.Constants.DIALOGUE_LABEL_STYLE);
    label.anchor.x = 0.5;
    this.menuGroup.add(label);
    
    y += Adventurous.Constants.PAUSE_MENU_LINE_HEIGHT;
    label = game.add.text(this.background.x, y, "Quit to Main Menu", Adventurous.Constants.DIALOGUE_LABEL_STYLE);
    label.anchor.x = 0.5;
    this.menuGroup.add(label);
};

Adventurous.PauseMenu.prototype =
{
	update: function()
    {
        if(this.background.visible)
        {
            this.updateLabels();
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
                    if(Adventurous.Util.isMouseOverLabel(label))
                    {
                        this.selectOption(label.text);
                    }
                }
            }
        }
    },
    
    togglePauseMenu: function()
    {
        if(!currentState.inventory.background.visible)
        {
            if(this.background.visible)
            {
                this.background.visible = false;
                this.menuGroup.visible = false;
                currentState.unfreeze();
            }
            else
            {
                this.background.visible = true;
                this.menuGroup.visible = true;
                currentState.freeze();
            }
        }
    },
    
    updateLabels: function()
    {
        for(var i = 0; i < this.menuGroup.length; i++)
        {
            var label = this.menuGroup.getAt(i);
            if(Adventurous.Util.isMouseOverLabel(label))
            {
                label.setStyle(Adventurous.Constants.SELECTED_DIALOGUE_LABEL_STYLE);
            }
            else
            {
                label.setStyle(Adventurous.Constants.DIALOGUE_LABEL_STYLE);
            }
        }
    },
    
    selectOption: function(option)
    {
        switch(option)
        {
            case "Continue":
                this.togglePauseMenu();
                break;
                
            case "Save Game":
                Adventurous.Util.save("test");
                this.togglePauseMenu();
                break;
                
            case "Load Game":
                Adventurous.Util.load("test");
                this.togglePauseMenu();
                break;
                
            default:
                break;
        }
    }
};

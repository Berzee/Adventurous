Adventurous.PauseMenu = function ()
{
    this.background = game.add.sprite(game.width/2,game.height/2,"pause_menu_background");
    game.physics.enable(this.background, Phaser.Physics.ARCADE, true);
    this.background.anchor.x = 0.5;
    this.background.anchor.y = 0.5;
    this.background.visible = false;
    this.enabled = false;
    
    this.menuButtons = [];
    this.menuGroup = game.add.group();
    this.menuGroup.visible = false;
    
    this.escapeKey = game.input.keyboard.addKey(Phaser.Keyboard.ESC);
    this.escapeKey.onDown.add(this.togglePauseMenu, this);
    
    //Main pause menu
    var y = Adventurous.Constants.PAUSE_MENU_FIRST_ITEM_Y_POS;
    var button = new Adventurous.Button(this.background.x,y,"Continue","pauseMenu_button",
                                        Adventurous.Constants.DIALOGUE_LABEL_STYLE,Adventurous.Constants.SELECTED_DIALOGUE_LABEL_STYLE);
    this.menuButtons[this.menuButtons.length] = button;
    this.menuGroup.add(button.buttonGroup);
    
    y += Adventurous.Constants.PAUSE_MENU_LINE_HEIGHT;
    button = new Adventurous.Button(this.background.x,y,"Save Game","pauseMenu_button",
                                        Adventurous.Constants.DIALOGUE_LABEL_STYLE,Adventurous.Constants.SELECTED_DIALOGUE_LABEL_STYLE);
    this.saveButton = button;
    this.menuButtons[this.menuButtons.length] = button;
    this.menuGroup.add(button.buttonGroup);
    
    y += Adventurous.Constants.PAUSE_MENU_LINE_HEIGHT;
    button = new Adventurous.Button(this.background.x,y,"Load Game","pauseMenu_button",
                                        Adventurous.Constants.DIALOGUE_LABEL_STYLE,Adventurous.Constants.SELECTED_DIALOGUE_LABEL_STYLE);
    this.menuButtons[this.menuButtons.length] = button;
    this.menuGroup.add(button.buttonGroup);
    
    y += Adventurous.Constants.PAUSE_MENU_LINE_HEIGHT;
    button = new Adventurous.Button(this.background.x,y,"Options","pauseMenu_button",
                                        Adventurous.Constants.DIALOGUE_LABEL_STYLE,Adventurous.Constants.SELECTED_DIALOGUE_LABEL_STYLE);
    this.menuButtons[this.menuButtons.length] = button;
    this.menuGroup.add(button.buttonGroup);
    
    y += Adventurous.Constants.PAUSE_MENU_LINE_HEIGHT;
    button = new Adventurous.Button(this.background.x,y,"Help","pauseMenu_button",
                                        Adventurous.Constants.DIALOGUE_LABEL_STYLE,Adventurous.Constants.SELECTED_DIALOGUE_LABEL_STYLE);
    this.menuButtons[this.menuButtons.length] = button;
    this.menuGroup.add(button.buttonGroup);
    
    y += Adventurous.Constants.PAUSE_MENU_LINE_HEIGHT;
    button = new Adventurous.Button(this.background.x,y,"Quit","pauseMenu_button",
                                        Adventurous.Constants.DIALOGUE_LABEL_STYLE,Adventurous.Constants.SELECTED_DIALOGUE_LABEL_STYLE);
    this.menuButtons[this.menuButtons.length] = button;
    this.menuGroup.add(button.buttonGroup);
    
    //Help menu
    this.helpButtons = [];
    this.helpGroup = game.add.group();
    this.helpGroup.visible = false;
    
    y = Adventurous.Constants.PAUSE_MENU_FIRST_ITEM_Y_POS;
    var label = game.add.text(this.background.x, y, "USE: [Left Click]\n\nLOOK: [Right Click]\n\nINVENTORY: [ i ]", Adventurous.Constants.DIALOGUE_LABEL_STYLE);
    label.x -= Math.floor(label.width/2);
    this.helpGroup.add(label);
    
    y = this.background.height - y - Adventurous.Constants.PAUSE_MENU_LINE_HEIGHT;
    button = new Adventurous.Button(this.background.x,y,"OK","pauseMenu_button",
                                        Adventurous.Constants.DIALOGUE_LABEL_STYLE,Adventurous.Constants.SELECTED_DIALOGUE_LABEL_STYLE);
    this.helpButtons[this.helpButtons.length] = button;
    this.helpGroup.add(button.buttonGroup);
    
    //Options menu
    this.optionsButtons = [];
    this.optionsGroup = game.add.group();
    this.optionsGroup.visible = false;
    
    y = Adventurous.Constants.PAUSE_MENU_FIRST_ITEM_Y_POS;
    label = game.add.text(this.background.x+5, y, "Sound Volume:", Adventurous.Constants.DIALOGUE_LABEL_STYLE);
    label.x -= label.width;
    this.optionsGroup.add(label);
    
    this.soundVolumeSlider = new Adventurous.Slider(label.x + label.width + 10, y, Adventurous.options.soundVolume);
    this.optionsGroup.add(this.soundVolumeSlider.sliderGroup);
    
    y += Adventurous.Constants.PAUSE_MENU_LINE_HEIGHT;
    label = game.add.text(this.background.x+5, y, "Music Volume:", Adventurous.Constants.DIALOGUE_LABEL_STYLE);
    label.x -= label.width;
    this.optionsGroup.add(label);
    
    this.musicVolumeSlider = new Adventurous.Slider(label.x + label.width + 10, y, Adventurous.options.musicVolume);
    this.optionsGroup.add(this.musicVolumeSlider.sliderGroup);
    
    y += Adventurous.Constants.PAUSE_MENU_LINE_HEIGHT;
    label = game.add.text(this.background.x+5, y, "Speech:", Adventurous.Constants.DIALOGUE_LABEL_STYLE);
    label.x -= label.width;
    this.optionsGroup.add(label);
    
    y += Adventurous.Constants.PAUSE_MENU_LINE_HEIGHT;
    label = game.add.text(this.background.x+5, y, "Text Speed:", Adventurous.Constants.DIALOGUE_LABEL_STYLE);
    label.x -= label.width;
    this.optionsGroup.add(label);
    
    y = this.background.height - Adventurous.Constants.PAUSE_MENU_FIRST_ITEM_Y_POS - Adventurous.Constants.PAUSE_MENU_LINE_HEIGHT;
    button = new Adventurous.Button(this.background.x,y,"OK","pauseMenu_button",
                                        Adventurous.Constants.DIALOGUE_LABEL_STYLE,Adventurous.Constants.SELECTED_DIALOGUE_LABEL_STYLE);
    this.optionsButtons[this.optionsButtons.length] = button;
    this.optionsGroup.add(button.buttonGroup);
};

Adventurous.PauseMenu.prototype =
{
	update: function()
    {
        if(this.background.visible)
        {
            this.updateButtons();
        }
	},
    
    mouseDown: function(pointer)
    {
        if(pointer.button == Adventurous.Constants.LMB)
        {
            if(this.menuGroup.visible)
            {
                for(var i = 0; i < this.menuButtons.length; i++)
                {
                    var button = this.menuButtons[i];
                    if(this.cursorWasHidden && button == this.saveButton)
                    {
                        continue;
                    }
                    if(Adventurous.Util.isMouseOverObject(button.background))
                    {
                        this.selectOption(button.label.text);
                    }
                }
            }
            else if(this.helpGroup.visible)
            {
                var okButton = this.helpButtons[0];
                if(Adventurous.Util.isMouseOverObject(okButton.background))
                {
                    this.showGroup(this.menuGroup);
                }
            }
            else if(this.optionsGroup.visible)
            {
                var okButton = this.optionsButtons[0];
                if(Adventurous.Util.isMouseOverObject(okButton.background))
                {
                    Adventurous.options.musicVolume = this.musicVolumeSlider.value;
                    Adventurous.options.soundVolume = this.soundVolumeSlider.value;
                    this.showGroup(this.menuGroup);
                }
            }
        }
    },
    
    togglePauseMenu: function()
    {
        if(!currentState.inventory.background.visible && currentState.currentConversation == null)
        {
            if(this.background.visible)
            {
                if(this.cursorWasHidden)
                {
                    currentState.cursor.hide();
                }
                this.background.visible = false;
                this.hideGroups();
                currentState.unfreeze();
            }
            else
            {
                currentState.cursor.setItem(null);
                this.cursorWasHidden = !currentState.cursor.sprite.visible;
                if(this.cursorWasHidden)
                {
                    this.saveButton.label.setStyle(Adventurous.Constants.DISABLED_LABEL_STYLE);
                }
                else
                {
                    this.saveButton.label.setStyle(Adventurous.Constants.DIALOGUE_LABEL_STYLE);
                }
                currentState.cursor.show();
                this.background.visible = true;
                this.showGroup(this.menuGroup);
                currentState.freeze();
            }
        }
        else if(currentState.inventory.background.visible)
        {
            currentState.inventory.toggleInventory();
        }
    },
    
    updateButtons: function()
    {
        if(this.menuGroup.visible)
        {
            for(var i = 0; i < this.menuButtons.length; i++)
            {
                var button = this.menuButtons[i];
                if(this.cursorWasHidden && button == this.saveButton)
                {
                    continue;
                }
                button.updateLabel();
            }
        }
        else if(this.helpGroup.visible)
        {
            var okButton = this.helpButtons[0];
            okButton.updateLabel();
        }
        else if(this.optionsGroup.visible)
        {
            this.soundVolumeSlider.update();
            this.musicVolumeSlider.update();
            
            var okButton = this.optionsButtons[0];
            okButton.updateLabel();
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
                
            case "Options":
                this.showGroup(this.optionsGroup);
                break;
                
            case "Help":
                this.showGroup(this.helpGroup);
                break;
                
            case "Quit":
                game.state.start('MainMenu');
                break;
                
            default:
                break;
        }
    },
    
    bringToTop: function()
    {
        game.world.bringToTop(this.background);
        game.world.bringToTop(this.menuGroup);
        game.world.bringToTop(this.helpGroup);
        game.world.bringToTop(this.optionsGroup);
    },
    
    hideGroups: function()
    {
        this.menuGroup.visible = false;
        this.helpGroup.visible = false;
        this.optionsGroup.visible = false;
    },
    
    showGroup: function(group)
    {
        this.hideGroups();
        group.visible = true;
    }
};

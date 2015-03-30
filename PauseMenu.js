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
    var label = game.add.text(this.background.x, y, Adventurous.Constants.HELP_TEXT, Adventurous.Constants.DIALOGUE_LABEL_STYLE);
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
    
    if(Adventurous.Constants.HAS_VOICE)
    {
        y += Adventurous.Constants.PAUSE_MENU_LINE_HEIGHT;
        label = game.add.text(this.background.x+5, y, "Voice:", Adventurous.Constants.DIALOGUE_LABEL_STYLE);
        label.x -= label.width;
        this.voiceToggleButton = new Adventurous.ToggleButton(label.x + label.width + 10, y, Adventurous.options.voiceEnabled);
        this.optionsGroup.add(label);
        this.optionsGroup.add(this.voiceToggleButton.sprite);
    }
    
    y += Adventurous.Constants.PAUSE_MENU_LINE_HEIGHT;
    this.textSpeedLabel = game.add.text(this.background.x+5, y, "Text Speed:", Adventurous.Constants.DIALOGUE_LABEL_STYLE);
    this.textSpeedLabel.x -= this.textSpeedLabel.width;
    this.textSpeedSlider = new Adventurous.Slider(this.textSpeedLabel.x + this.textSpeedLabel.width + 10, y, Adventurous.options.textSpeed);
    this.optionsGroup.add(this.textSpeedLabel);
    this.optionsGroup.add(this.textSpeedSlider.sliderGroup);
    
    if(Adventurous.Constants.HAS_VOICE && Adventurous.options.voiceEnabled)
    {
        this.textSpeedLabel.setStyle(Adventurous.Constants.DISABLED_LABEL_STYLE);
        this.textSpeedSlider.hide();
    }
    
    y = this.background.height - Adventurous.Constants.PAUSE_MENU_FIRST_ITEM_Y_POS - Adventurous.Constants.PAUSE_MENU_LINE_HEIGHT;
    button = new Adventurous.Button(this.background.x,y,"OK","pauseMenu_button",
                                        Adventurous.Constants.DIALOGUE_LABEL_STYLE,Adventurous.Constants.SELECTED_DIALOGUE_LABEL_STYLE);
    this.optionsButtons[this.optionsButtons.length] = button;
    this.optionsGroup.add(button.buttonGroup);
    
    //Save game menu
    this.savegameButtons = [];
    this.savegameGroup = game.add.group();
    this.savegameGroup.visible = false;
    
    y = Adventurous.Constants.PAUSE_MENU_FIRST_ITEM_Y_POS;
    
    this.savegameToggle1 = new Adventurous.ToggleButton(this.background.x + 10, y, true);
    this.savegameToggle1.sprite.x -= Math.floor(Adventurous.Constants.PAUSE_MENU_WIDTH / 2);
    this.savegameLabel1 = game.add.text(this.savegameToggle1.sprite.x + this.savegameToggle1.sprite.width + 10, y, "Save Slot A\nempty", Adventurous.Constants.SELECTED_DIALOGUE_LABEL_STYLE);
    this.savegameGroup.add(this.savegameLabel1);
    this.savegameGroup.add(this.savegameToggle1.sprite);
    
    y += Adventurous.Constants.PAUSE_MENU_LINE_HEIGHT * 2;
    
    this.savegameToggle2 = new Adventurous.ToggleButton(this.background.x + 10, y, false);
    this.savegameToggle2.sprite.x -= Math.floor(Adventurous.Constants.PAUSE_MENU_WIDTH / 2);
    this.savegameLabel2 = game.add.text(this.savegameToggle2.sprite.x + this.savegameToggle2.sprite.width + 10, y, "Save Slot B\nempty", Adventurous.Constants.DIALOGUE_LABEL_STYLE);
    this.savegameGroup.add(this.savegameLabel2);
    this.savegameGroup.add(this.savegameToggle2.sprite);
    
    y += Adventurous.Constants.PAUSE_MENU_LINE_HEIGHT * 2;
    
    this.savegameToggle3 = new Adventurous.ToggleButton(this.background.x + 10, y, false);
    this.savegameToggle3.sprite.x -= Math.floor(Adventurous.Constants.PAUSE_MENU_WIDTH / 2);
    this.savegameLabel3 = game.add.text(this.savegameToggle3.sprite.x + this.savegameToggle2.sprite.width + 10, y, "Save Slot C\nempty", Adventurous.Constants.DIALOGUE_LABEL_STYLE);
    this.savegameGroup.add(this.savegameLabel3);
    this.savegameGroup.add(this.savegameToggle3.sprite);
    
    y = this.background.height - Adventurous.Constants.PAUSE_MENU_FIRST_ITEM_Y_POS - 10;
    button = new Adventurous.Button(this.background.x,y,"Save","pauseMenu_button",
                                        Adventurous.Constants.DIALOGUE_LABEL_STYLE,Adventurous.Constants.SELECTED_DIALOGUE_LABEL_STYLE);
    button.background.x -= Math.floor(button.background.width / 2 + 5);
    button.label.x -= Math.floor(button.background.width / 2 + 5);
    this.savegameButtons[this.savegameButtons.length] = button;
    this.savegameGroup.add(button.buttonGroup);
    
    y = this.background.height - Adventurous.Constants.PAUSE_MENU_FIRST_ITEM_Y_POS - 10;
    button = new Adventurous.Button(this.background.x,y,"Cancel","pauseMenu_button",
                                        Adventurous.Constants.DIALOGUE_LABEL_STYLE,Adventurous.Constants.SELECTED_DIALOGUE_LABEL_STYLE);
    this.savegameButtons[this.savegameButtons.length] = button;
    button.background.x += Math.floor(button.background.width / 2 + 5);
    button.label.x += Math.floor(button.background.width / 2 + 5);
    this.savegameGroup.add(button.buttonGroup);
    
    this.savegameToggle1.enabled = false;
    this.savegameToggle2.enabled = true;
    this.savegameToggle3.enabled = true;
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
                this.handleOptionsButtonClicks();
            }
            else if(this.savegameGroup.visible)
            {
                this.handleSaveGameButtonClicks();
            }
        }
    },
    
    togglePauseMenu: function()
    {
        if(currentState != null)
        {
            if(!currentState.inventory.background.visible && currentState.currentConversation == null)
            {
                var clickSound = game.add.audio(Adventurous.Constants.MENU_BUTTON_SOUND);
                clickSound.volume = Adventurous.options.soundVolume;
                clickSound.play();
                
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
                    this.cursorWasHidden = !currentState.cursor.sprite.visible;
                    currentState.cursor.setItem(null);
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
            this.textSpeedSlider.update();
            var okButton = this.optionsButtons[0];
            okButton.updateLabel();
            if(this.voiceToggleButton != null && this.voiceToggleButton.justChanged)
            {
                this.voiceToggleButton.justChanged = false;
                if(this.voiceToggleButton.selected)
                {
                    this.textSpeedLabel.setStyle(Adventurous.Constants.DISABLED_LABEL_STYLE);
                    this.textSpeedSlider.hide();
                }
                else
                {
                    this.textSpeedLabel.setStyle(Adventurous.Constants.DIALOGUE_LABEL_STYLE);
                    this.textSpeedSlider.show();
                }
            }
        }
        else if(this.savegameGroup.visible)
        {
             if(this.savegameToggle1.justChanged)
            {
                this.savegameToggle1.justChanged = false;
                this.savegameToggle1.enabled = false;
                this.savegameLabel1.setStyle(Adventurous.Constants.SELECTED_DIALOGUE_LABEL_STYLE);
                
                if(this.savegameLabel2.style != Adventurous.Constants.DISABLED_LABEL_STYLE)
                {
                    this.savegameToggle2.enabled = true;
                    this.savegameLabel2.setStyle(Adventurous.Constants.DIALOGUE_LABEL_STYLE);
                    this.savegameToggle2.setSelected(false,true);
                }
                
                if(this.savegameLabel3.style != Adventurous.Constants.DISABLED_LABEL_STYLE)
                {
                    this.savegameToggle3.enabled = true;
                    this.savegameToggle3.setSelected(false,true);
                    this.savegameLabel3.setStyle(Adventurous.Constants.DIALOGUE_LABEL_STYLE);
                }
            }
            else if(this.savegameToggle2.justChanged)
            {
                this.savegameToggle2.justChanged = false;
                this.savegameToggle2.enabled = false;
                this.savegameLabel2.setStyle(Adventurous.Constants.SELECTED_DIALOGUE_LABEL_STYLE);
                
                if(this.savegameLabel1.style != Adventurous.Constants.DISABLED_LABEL_STYLE)
                {
                    this.savegameToggle1.enabled = true;
                    this.savegameToggle1.setSelected(false,true);
                    this.savegameLabel1.setStyle(Adventurous.Constants.DIALOGUE_LABEL_STYLE);
                }
                
                if(this.savegameLabel3.style != Adventurous.Constants.DISABLED_LABEL_STYLE)
                {
                    this.savegameToggle3.enabled = true;
                    this.savegameToggle3.setSelected(false,true);
                    this.savegameLabel3.setStyle(Adventurous.Constants.DIALOGUE_LABEL_STYLE);
                }
            }
            else if(this.savegameToggle3.justChanged)
            {
                this.savegameToggle3.justChanged = false;
                this.savegameToggle3.enabled = false;
                this.savegameLabel3.setStyle(Adventurous.Constants.SELECTED_DIALOGUE_LABEL_STYLE);
                
                if(this.savegameLabel1.style != Adventurous.Constants.DISABLED_LABEL_STYLE)
                {
                    this.savegameToggle1.enabled = true;
                    this.savegameToggle1.setSelected(false,true);
                    this.savegameLabel1.setStyle(Adventurous.Constants.DIALOGUE_LABEL_STYLE);
                }
                
                if(this.savegameLabel2.style != Adventurous.Constants.DISABLED_LABEL_STYLE)
                {
                    this.savegameToggle2.enabled = true;
                    this.savegameToggle2.setSelected(false,true);
                    this.savegameLabel2.setStyle(Adventurous.Constants.DIALOGUE_LABEL_STYLE);
                }
            }
            
            for(var i = 0; i < this.savegameButtons.length; i++)
            {
                this.savegameButtons[i].updateLabel();
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
                var storage = localStorage.getItem(Adventurous.Constants.LOCALSTORAGE_KEY);
                if(storage != null)
                {
                    storage = JSON.parse(storage);
                    if(storage.saves["1"] != null)
                    {
                        this.savegameLabel1.text = "Save Slot A\n"+storage.saves["1"].timestamp;
                    }
                    if(storage.saves["2"] != null)
                    {
                        this.savegameLabel2.text = "Save Slot B\n"+storage.saves["2"].timestamp;
                    }
                    if(storage.saves["3"] != null)
                    {
                        this.savegameLabel3.text = "Save Slot C\n"+storage.saves["3"].timestamp;
                    }
                }
                this.savegameLabel1.setStyle(Adventurous.Constants.DIALOGUE_LABEL_STYLE);
                this.savegameLabel2.setStyle(Adventurous.Constants.DIALOGUE_LABEL_STYLE);
                this.savegameLabel3.setStyle(Adventurous.Constants.DIALOGUE_LABEL_STYLE);
                this.savegameToggle1.setSelected(true,false);
                this.savegameToggle2.setSelected(false,true);
                this.savegameToggle3.setSelected(false,true);
                this.savegameButtons[0].label.text = "Save";
                this.showGroup(this.savegameGroup);
                break;
                
            case "Load Game":
                this.showLoadGame();
                break;
                
            case "Options":
                this.showGroup(this.optionsGroup);
                break;
                
            case "Help":
                this.showGroup(this.helpGroup);
                break;
                
            case "Quit":
                var clickSound = game.add.audio(Adventurous.Constants.MENU_BUTTON_SOUND);
                clickSound.volume = Adventurous.options.soundVolume;
                clickSound.play();
                game.state.start('MainMenu');
                break;
                
            default:
                break;
        }
    },
    
    handleOptionsButtonClicks: function(fromMainMenu)
    {
        var okButton = this.optionsButtons[0];
        if(Adventurous.Util.isMouseOverObject(okButton.background))
        {
            Adventurous.options.musicVolume = this.musicVolumeSlider.value;
            Adventurous.options.soundVolume = this.soundVolumeSlider.value;
            if(Adventurous.backgroundMusic != null)
            {
                Adventurous.backgroundMusic.volume = Adventurous.options.musicVolume;
            }
            if(this.voiceToggleButton != null)
            {
                Adventurous.options.voiceEnabled = this.voiceToggleButton.selected;
                if(!this.voiceToggleButton.selected)
                {
                    Adventurous.options.textSpeed = this.textSpeedSlider.value;
                }
            }
            else
            {
                Adventurous.options.textSpeed = this.textSpeedSlider.value;
            }
            
            if(fromMainMenu == true)
            {
                var clickSound = game.add.audio(Adventurous.Constants.MENU_BUTTON_SOUND);
                clickSound.volume = Adventurous.options.soundVolume;
                clickSound.play();
                this.hideGroups();
                this.background.visible = false;
            }
            else
            {
                this.showGroup(this.menuGroup);
            }
        }
    },
    
    handleSaveGameButtonClicks: function(fromMainMenu)
    {
        var okButton = this.savegameButtons[0];
        var cancelButton = this.savegameButtons[1];
        if(Adventurous.Util.isMouseOverObject(okButton.background))
        {
            var saveName = null;
            if(this.savegameToggle1.selected)
            {
                saveName = "1";
            }
            else if(this.savegameToggle2.selected)
            {
                saveName = "2";
            }
            else if(this.savegameToggle3.selected)
            {
                saveName = "3";
            }
            
            if(okButton.label.text == "Save")
            {
                Adventurous.Util.save(saveName);
                this.togglePauseMenu();
            }
            else if(okButton.label.text == "Load")
            {
                if(saveName != null)
                {
                    Adventurous.gameToLoad = saveName;
                    game.state.start('Game');
                    this.togglePauseMenu();
                }
            }
        }
        else if(Adventurous.Util.isMouseOverObject(cancelButton.background))
        {
            if(fromMainMenu == true)
            {
                var clickSound = game.add.audio(Adventurous.Constants.MENU_BUTTON_SOUND);
                clickSound.volume = Adventurous.options.soundVolume;
                clickSound.play();
                this.hideGroups();
                this.background.visible = false;
            }
            else
            {
                this.togglePauseMenu();
            }
        }
    },
    
    showLoadGame: function()
    {
        var storage = localStorage.getItem(Adventurous.Constants.LOCALSTORAGE_KEY);
        if(storage != null)
        {
            this.savegameToggle1.setSelected(false,true);
            this.savegameToggle2.setSelected(false,true);
            this.savegameToggle3.setSelected(false,true);
            this.savegameLabel1.setStyle(Adventurous.Constants.DIALOGUE_LABEL_STYLE);
            this.savegameLabel2.setStyle(Adventurous.Constants.DIALOGUE_LABEL_STYLE);
            this.savegameLabel3.setStyle(Adventurous.Constants.DIALOGUE_LABEL_STYLE);
            
            storage = JSON.parse(storage);
            if(storage.saves["1"] != null)
            {
                this.savegameToggle1.enabled = true;
                this.savegameLabel1.text = "Save Slot A\n"+storage.saves["1"].timestamp;
            }
            else
            {
                this.savegameToggle1.enabled = false;
                this.savegameLabel1.setStyle(Adventurous.Constants.DISABLED_LABEL_STYLE);
            }
            
            if(storage.saves["2"] != null)
            {
                this.savegameToggle2.enabled = true;
                this.savegameLabel2.text = "Save Slot B\n"+storage.saves["2"].timestamp;
            }
            else
            {
                this.savegameToggle2.enabled = false;
                this.savegameLabel2.setStyle(Adventurous.Constants.DISABLED_LABEL_STYLE);
            }
            
            if(storage.saves["3"] != null)
            {
                this.savegameToggle2.enabled = true;
                this.savegameLabel3.text = "Save Slot C\n"+storage.saves["3"].timestamp;
            }
            else
            {
                this.savegameToggle3.enabled = false;
                this.savegameLabel3.setStyle(Adventurous.Constants.DISABLED_LABEL_STYLE);
            }
        }
        this.savegameButtons[0].label.text = "Load";
        this.showGroup(this.savegameGroup);
    },
    
    bringToTop: function()
    {
        game.world.bringToTop(this.background);
        game.world.bringToTop(this.menuGroup);
        game.world.bringToTop(this.helpGroup);
        game.world.bringToTop(this.optionsGroup);
        game.world.bringToTop(this.savegameGroup);
    },
    
    hideGroups: function()
    {
        this.menuGroup.visible = false;
        this.helpGroup.visible = false;
        this.optionsGroup.visible = false;
        this.savegameGroup.visible = false;
    },
    
    showGroup: function(group)
    {
        var clickSound = game.add.audio(Adventurous.Constants.MENU_BUTTON_SOUND);
        clickSound.volume = Adventurous.options.soundVolume;
        clickSound.play();
        
        this.hideGroups();
        group.visible = true;
    }
};

Adventurous.Game = function (game)
{
	//reserved words
    this.game;		//	a reference to the currently running game
    this.add;		//	used to add sprites, text, groups, etc
    this.camera;	//	a reference to the game camera
    this.cache;		//	the game cache
    this.input;		//	the global input manager (you can access this.input.keyboard, this.input.mouse, as well from it)
    this.load;		//	for preloading assets
    this.math;		//	lots of useful common math operations
    this.sound;		//	the sound manager - add a sound, play one, set-up markers, etc
    this.stage;		//	the game stage
    this.time;		//	the clock
    this.tweens;	//	the tween manager
    this.world;		//	the game world
    this.particles;	//	the particle manager
    this.physics;	//	the physics manager
    this.rnd;		//	the repeatable random number generator
    
    this.scene;
    this.thingsGroup;
    this.dialogueGroup;
    this.dialogueGroupStartIndex = 0;
    this.dialogueUpButton;
    this.dialogueDownButton;
    this.currentConversation;
    this.player;
    this.startingItems;
    this.inventory;
    this.cursor;
    this.activeEffects;
    this.thingUnderMouse;
    this.nextScene;
    this.entrance;
    this.bitmapData;
};

Adventurous.Game.prototype =
{
	create: function ()
    {
        //debug
        //Adventurous.flags['sticksHammeredIn'] = true;
        
        currentState = this;
        this.triggerAreas = new Array();
        this.activeEffects = null;
        this.nextScene = null;
        Adventurous.Loader.init(this);
        this.thingsGroup = game.add.group();
        
        this.dialogueGroup = game.add.group();
        this.dialogueGroup.visible = false;
        this.dialogueUpButton = this.add.button(0, 0, 'dialogue_up', this.dialogueUp, this, 1, 0, 1);
        this.dialogueDownButton = this.add.button(0, 0, 'dialogue_down', this.dialogueDown, this, 1, 0, 1);
        this.dialogueUpButton.visible = false;
        this.dialogueDownButton.visible = false;
        
        this.player = Adventurous.thingsMap[Adventurous.Constants.PLAYER_NAME];
        
        this.startingItems = new Array();       
        this.inventory = new Adventurous.Inventory(this.startingItems);
        
        this.pauseMenu = new Adventurous.PauseMenu();
        
        this.cursor = new Adventurous.Cursor();
        
        game.input.onDown.add(this.mouseDown, this);
        if(Adventurous.gameToLoad != null)
        {
            Adventurous.Util.load(Adventurous.gameToLoad);
            Adventurous.gameToLoad = null;
        }
        else
        {
            this.showScene(Adventurous.startingScene,"start");
        }
	},
    
    mouseDown: function(pointer)
    {
        if(this.pauseMenu.background.visible)
        {
            this.pauseMenu.mouseDown(pointer);
        }
        else if(this.inventory.background.visible)
        {
            this.inventory.mouseDown(pointer);
        }
        else if(this.activeEffects != null)
        {
            //only accept cancellation of talking effects
            for(var i = 0; i < this.activeEffects.effects.length; i++)
            {
                var effect = this.activeEffects.effects[i];
                if(effect.type == Adventurous.Constants.ACTION_REMARK && effect.target != null)
                {
                    effect.target.stopTalking();
                }
            }
        }
        else if(this.currentConversation != null)
        {
            for(var i = 3; i < this.dialogueGroup.length; i++) //starts at 3 because the first three elements in the group are the background, up, and down buttons
            {
                var label = this.dialogueGroup.getAt(i);
                if(Adventurous.Util.isMouseOverObject(label))
                {
                    this.currentConversation.choose(i-3+this.dialogueGroupStartIndex);
                    this.currentConversation.doDialogue();
                    this.updateDialogueOptions();
                }
            }
        }
        else
        {
            if(this.thingUnderMouse != null)
            {
                if(pointer.button == Adventurous.Constants.LMB) //Use
                {
                    if(this.thingUnderMouse.usableZone != null)
                    {
                        if(this.thingUnderMouse.usableZone == "any")
                        {
                            this.player.stopTalking();
                            this.player.stopMoving(true);
                            this.player.face(this.thingUnderMouse);
                            this.player.destinationThing = this.thingUnderMouse;
                            if(this.cursor.item == null)
                            {
                                this.player.useThing();
                            }
                            else
                            {
                                this.player.useThing(this.cursor.item.name);
                            }
                        }
                        else
                        {
                            var nearest = this.player.getNearestTile(this.thingUnderMouse.usableZone);
                            if(nearest != null)
                            {
                                var path = this.scene.findPath(this.player,Adventurous.Constants.TILE_SIZE*(nearest.x+0.5),Adventurous.Constants.TILE_SIZE*(nearest.y+0.5));
                                this.player.stopTalking();
                                this.player.followPath(path,this.thingUnderMouse);
                            }
                        }
                    }
                }
                else if(pointer.button == Adventurous.Constants.RMB) //Look (or cancel object)
                {
                    if(this.cursor.item == null)
                    {
                        this.player.stopTalking();
                        this.player.stopMoving(true);
                        this.thingUnderMouse.label.visible = false;
                        this.player.face(this.thingUnderMouse);
                        this.player.say(this.thingUnderMouse.observations.next());
                    }
                    else
                    {
                        this.cursor.setItem(null);
                    }
                }
            }
            else
            {
                if(this.cursor.item != null && pointer.button == Adventurous.Constants.RMB)
                {
                    this.cursor.setItem(null);
                }
                else //WALK
                {
                    var tileClicked = this.scene.map.getTileWorldXY(pointer.x,pointer.y,Adventurous.Constants.TILE_SIZE,Adventurous.Constants.TILE_SIZE);
                    
                    if(Adventurous.Constants.WALKABLE_TILES.indexOf(tileClicked.index) != -1)
                    {
                        var path = this.scene.findPath(this.player,pointer.x,pointer.y);
                        this.player.stopTalking();
                        this.player.followPath(path,null);
                    }
                }
            }
        }
    },

	update: function ()
    {
        if(this.pauseMenu.background.visible)
        {
            this.pauseMenu.update();
        }
        else if(this.inventory.background.visible)
        {
            this.inventory.update();
        }
        else
        {
            if(this.nextScene != null)
            {
                this.showScene(this.nextScene,this.entrance);
                this.nextScene = null;
                this.entrance = null;
            }
            else
            {
                this.player.update();   
                this.thingsGroup.sort('y');
                for(var i = 0; i < this.scene.things.length; i++)
                {
                    if(this.scene.things[i].isBackground)
                    {
                        this.thingsGroup.removeChild(this.scene.things[i].sprite);
                        this.thingsGroup.addChildAt(this.scene.things[i].sprite,0);
                    }
                    else if(this.scene.things[i].isForeground)
                    {
                        this.thingsGroup.removeChild(this.scene.things[i].sprite);
                        this.thingsGroup.add(this.scene.things[i].sprite);
                    }
                }
                
                this.scene.update();
                this.updateScales();
                
                if(this.activeEffects != null)
                {
                    this.activeEffects.update();
                }
                else if(this.conversationToStart != null)
                {
                    this.startConversation(this.conversationToStart);
                    this.conversationToStart = null;
                }
                else if(this.currentConversation != null)
                {
                    this.dialogueGroup.visible = true;
                    this.updateConversation();
                }
                else
                {
                    this.getThingUnderMouse();
                }
                
                if(this.player.readyToUseSomething())
                {
                    if(this.cursor.item == null)
                    {
                        this.player.useThing();
                    }
                    else
                    {
                        this.player.useThing(this.cursor.item.name);
                    }
                }
            }
        }
        
        this.cursor.update();
	},
    
    updateConversation: function()
    {
        for(var i = 3; i < this.dialogueGroup.length; i++) //starts at 3 because the first three elements in the group are the background, up, and down buttons
        {
            var label = this.dialogueGroup.getAt(i);
            if(Adventurous.Util.isMouseOverObject(label))
            {
                label.setStyle(Adventurous.Constants.SELECTED_DIALOGUE_LABEL_STYLE);
            }
            else
            {
                label.setStyle(Adventurous.Constants.DIALOGUE_LABEL_STYLE);
            }
        }
    },
    
    updateScales: function ()
    {
        this.player.updateScale();
        for(var i = 0; i < this.scene.things.length; i++)
        {
            this.scene.things[i].updateScale();
        }
    },
    
    getThingUnderMouse: function()
    {
        this.thingUnderMouse = null;
        
        for(var i = 0; i < this.scene.things.length; i++)
        {
            var thing = this.scene.things[i];
            if(thing.isVisible() && !thing.isNoninteractive && Phaser.Rectangle.contains(thing.sprite.body,game.input.activePointer.x,game.input.activePointer.y))
            {
                //select the thing closest to the foreground
                if(this.thingUnderMouse == null || this.scene.things[i].sprite.body.bottom > this.thingUnderMouse.sprite.body.bottom)
                {
                    var pixelAlpha = thing.bitmapData.getPixel(game.input.activePointer.x-thing.sprite.body.x, game.input.activePointer.y-thing.sprite.body.y).a;
                    
                    if(pixelAlpha > 0)
                    {
                        this.thingUnderMouse = this.scene.things[i];
                    }
                }
            }
        }
        
        if(this.thingUnderMouse != null)
        {
            if(this.cursor.item != null)
            {
                if(this.thingUnderMouse.usableZone != null && this.thingUnderMouse.usableZone.length > 0)
                {
                    this.thingUnderMouse.setLabelUseText(this.cursor.item.name);
                    if(!this.player.talking)
                    {
                        this.thingUnderMouse.showLabel(this.thingUnderMouse.label);
                    }
                }
            }
            else
            {
                this.thingUnderMouse.setLabelUseText("");
                if(!this.player.talking)
                {
                    this.thingUnderMouse.showLabel(this.thingUnderMouse.label);
                }
            }
        }
    },
    
    startConversation: function(name)
    {
        this.currentConversation = Adventurous.conversations[name];
        this.dialogueGroup.visible = false;
        this.currentConversation.doDialogue();
        this.updateDialogueOptions();
    },
    
    endConversation: function()
    {
        if(this.currentConversation != null)
        {
            this.currentConversation.quit();
            this.currentConversation = null;
            this.dialogueGroup.visible = false;
        }
    },
    
    updateDialogueOptions: function()
    {
        this.dialogueGroup.removeAll();
        var length = this.currentConversation.getChoices().length;
        var bg = game.add.sprite(0, 0, Adventurous.Constants.DIALOGUE_BACKGROUND_IMAGE_NAME);
        bg.y = game.world.height - bg.height;
        bg.alpha = Adventurous.Constants.DIALOGUE_BACKGROUND_OPACITY;
        
        this.dialogueGroup.add(bg);
        
        var upButtonEnabled = this.dialogueGroupStartIndex > 0;
        var downButtonEnabled = false;
        var yPosition = bg.y + 10;
        for(var i = this.dialogueGroupStartIndex; i < length; i++)
        {
            var choice = this.currentConversation.getChoice(i);
            var label = game.add.text(bg.x + this.dialogueUpButton.width + 20, yPosition,
                                        Adventurous.speeches[choice.speech].text, Adventurous.Constants.DIALOGUE_LABEL_STYLE);
            
            yPosition += label.height + 5;
            
            if(yPosition > game.height)
            {
                game.world.remove(label);
                downButtonEnabled = true;
                break;
            }
            else
            {
                this.dialogueGroup.add(label);
            }
        }
                 
        this.dialogueUpButton.x = 10;
        this.dialogueUpButton.y = bg.y + 10;
        this.dialogueDownButton.x = 10;
        this.dialogueDownButton.y = game.height - 10 - this.dialogueDownButton.height;
        
        this.dialogueUpButton.visible = upButtonEnabled;
        this.dialogueDownButton.visible = downButtonEnabled;
        this.dialogueGroup.addAt(this.dialogueUpButton,1);
        this.dialogueGroup.addAt(this.dialogueDownButton,1);
    },
    
    dialogueUp: function (pointer)
    {
		this.dialogueGroupStartIndex--;
        this.dialogueDownButton.frame = 0;
        this.dialogueUpButton.frame = 0;
        this.updateDialogueOptions();
	},
    
    dialogueDown: function (pointer)
    {
		this.dialogueGroupStartIndex++;
        this.dialogueDownButton.frame = 0;
        this.dialogueUpButton.frame = 0;
        this.updateDialogueOptions();
	},
    
	quitGame: function (pointer)
    {
	},
    
    freeze: function()
    {
        this.player.freeze();
        for(var i = 0; i < this.scene.things.length; i++)
        {
            this.scene.things[i].freeze();
        }
        if(currentState.activeEffects != null)
        {
            for(var i = 0; i < this.activeEffects.effects.length; i++)
            {
                var effect = this.activeEffects.effects[i];
                if(effect.type == Adventurous.Constants.ACTION_SOUND && effect.audioClip != null && effect.audioClip.isPlaying)
                {
                    effect.audioClip.pause();
                }
            }
        }
    },
    
    unfreeze: function()
    {
        this.player.unfreeze();
        for(var i = 0; i < this.scene.things.length; i++)
        {
            this.scene.things[i].unfreeze();
        }
        if(currentState.activeEffects != null)
        {
            for(var i = 0; i < this.activeEffects.effects.length; i++)
            {
                var effect = this.activeEffects.effects[i];
                if(effect.type == Adventurous.Constants.ACTION_SOUND && effect.audioClip != null && effect.audioClip.paused)
                {
                    effect.audioClip.resume();
                }
            }
        }
    },
    
    showScene: function(name,entranceName)
    {
        this.player.stopMoving();
        for(var i = 0; i < Adventurous.thingsArray.length; i++)
        {
            Adventurous.thingsArray[i].hide();
        }
        if(this.scene != null)
        {
            this.scene.hide();
        }
        this.scene = Adventurous.scenes[name];
        this.scene.show();
        
        this.thingsGroup.removeAll();
        this.player.show();
        this.thingsGroup.add(this.player.sprite);
        this.thingsGroup.bringToTop(this.player.sprite);
        for(var i = 0; i < this.scene.things.length; i++)
        {
            if(this.scene.things[i].startHidden != true && this.scene.things[i].hasBeenHidden != true)
            {
                this.scene.things[i].show();
            }
            this.thingsGroup.add(this.scene.things[i].sprite);
            this.thingsGroup.bringToTop(this.scene.things[i].sprite);  
        }
        
        this.dialogueGroup.removeAll();
        
        for(var i = 0; i < this.scene.things.length; i++)
        {
            if(this.scene.things[i].label != null)
            {
                this.scene.things[i].bringLabelsToTop();
            }
        }
        this.player.bringLabelsToTop();
        
        this.pauseMenu.bringToTop();
        
        if(entranceName != null)
        {
            var entrance = this.scene.entrances[entranceName];
            if(entrance != null)
            {
                this.player.setPosition(parseInt(entrance.x),parseInt(entrance.y));
                if(entrance.onEntry != null)
                {
                    for(var i = 0; i < entrance.onEntry.length; i++)
                    {
                        if(Adventurous.Util.areConditionsMet(entrance.onEntry[i].conditions))
                        {
                            this.activeEffects = new Adventurous.Effects(this.player,entrance.onEntry[i].effects);
                            var preEffects = entrance.onEntry[i].preEffects;
                            if(preEffects != null)
                            {
                                for(var j = 0; j < preEffects.length; j++)
                                {
                                    this.activeEffects.applyEffect(preEffects[j]);
                                }
                            }
                            break;
                        }
                    }
                }
            }
        }
        
        this.inventory.enabled = true;
    },
    
    switchToScene: function(name,entrance) //Scene will be switched by "showScene" in the next update frame
    {
        if(this.thingUnderMouse != null)
        {
            this.thingUnderMouse.label.visible = false;
        }
        this.nextScene = name;
        this.entrance = entrance;
    },
    
    toSaveObject: function()
    {
        var obj = {};
        
        obj.currentScene = this.scene.name;
        obj.scenes = new Array();
        for(var key in Adventurous.scenes)
        {
            obj.scenes[obj.scenes.length] = Adventurous.scenes[key].toSaveObject();
        }
        obj.player = this.player.toSaveObject();
        obj.inventory = this.inventory.toSaveObject();
        return obj;
    },
    
    loadFromObject: function(obj)
    {
        Adventurous.flags = obj.flags;
        Adventurous.options = obj.options;
        
        this.pauseMenu.soundVolumeSlider.setValue(Adventurous.options.soundVolume);
        this.pauseMenu.musicVolumeSlider.setValue(Adventurous.options.musicVolume);
        this.pauseMenu.textSpeedSlider.setValue(Adventurous.options.textSpeed);
        if(Adventurous.Constants.HAS_VOICE)
        {
            this.pauseMenu.voiceToggleButton.setSelected(Adventurous.options.hasVoice);
        }
        for(var i = 0; i < obj.data.scenes.length; i++)
        {
            Adventurous.scenes[obj.data.scenes[i].name].loadFromObject(obj.data.scenes[i]);
        }
        this.showScene(obj.data.currentScene);
        this.player.loadFromObject(obj.data.player);        
        this.inventory.loadFromObject(obj.data.inventory);
        this.cursor.reload();
    }
};

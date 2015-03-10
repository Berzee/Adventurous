Adventurous.Inventory = function (startingItems)
{
    this.background = game.add.sprite(game.width/2,game.height/2,"inventory_background");
    game.physics.enable(this.background, Phaser.Physics.ARCADE, true);
    this.background.anchor.x = 0.5;
    this.background.anchor.y = 0.5;
    this.background.visible = false;
    this.talking = false;
    this.currentSpeech = null;
    
    this.borderThickness = Adventurous.Constants.INVENTORY_PADDING;
    this.columns = Math.floor((this.background.width-2*this.borderThickness) / Adventurous.Constants.INVENTORY_ITEM_SIZE);
    this.rows = Math.floor((this.background.height-2*this.borderThickness) / Adventurous.Constants.INVENTORY_ITEM_SIZE);
    
    this.inventoryKey = game.input.keyboard.addKey(Phaser.Keyboard.I);
    this.inventoryKey.onDown.add(this.toggleInventory, this);
    
    this.iconGroup = game.add.group();
    this.items = new Array();
    for(var i = 0; i < startingItems.length; i++)
    {
        if(startingItems[i].isInventoryItem)
        {
            this.addItem(startingItems[i],null,false);
        }
    }
    this.organizeIcons();
    
    this.itemUnderMouse = null;
    
    this.label = game.add.group();
    this.label.add(game.add.text(Adventurous.Constants.LABEL_SHADOW_OFFSET_X, Adventurous.Constants.LABEL_SHADOW_OFFSET_Y, "", Adventurous.Constants.LABEL_SHADOW_STYLE));
    this.label.add(game.add.text(0, 0, "", Adventurous.Constants.LABEL_STYLE));
    this.label.getAt(0).anchor.x = 0.5;
    this.label.getAt(1).anchor.x = 0.5;
    this.label.visible = false;
    
    this.enabled = false;
    
    this.talkTime = 0;
};

Adventurous.Inventory.prototype =
{
	update: function()
    {
        if(this.background.visible)
        {
            this.getItemUnderMouse();
            
            if(this.talking)
            {
                if(!this.currentSpeech.audio.isPlaying)
                {
                    if(this.talkTime > Adventurous.Constants.DIALOGUE_MIN_TIME)
                    {
                        this.labelReady = false;
                        this.stopTalking();
                    }
                    else
                    {
                        this.talkTime += game.time.elapsed;
                    }
                }
            }
            else
            {
                if(this.itemUnderMouse == null || this.itemUnderMouse == currentState.cursor.item)
                {
                    this.labelReady = false;
                    this.label.visible = false;
                }
                else
                {
                    if(this.labelReady)
                    {
                        if(!this.label.visible)
                        {
                            this.label.visible = true;
                        }
                        else
                        {
                            this.positionLabel();
                        }
                    }
                    else
                    {
                        this.label.y = -9999;
                        this.labelReady = true;
                        if(currentState.cursor.item != null)
                        {
                            this.setLabelUseText(currentState.cursor.item.name);
                        }
                        else
                        {
                            this.setLabelText(this.itemUnderMouse.name);
                        }
                    }
                }
            }
            
            if(currentState.cursor.item != null && !this.isMouseInInventory())
            {
                this.label.visible = false;
                this.toggleInventory();
            }
        }
	},
    
    toggleInventory: function()
    {
        if(this.enabled && currentState.activeEffects == null && !currentState.pauseMenu.background.visible)
        {
            this.background.visible = !this.background.visible;
            for(var i = 0; i < this.items.length; i++)
            {
                this.items[i].icon.visible = this.background.visible;
            }
            if(!this.background.visible)
            {
                this.label.visible = false;
                currentState.unfreeze();
            }
            else
            {
                currentState.freeze();
            }
        }
    },
    
    addItem: function(item,index,redrawIcons)
    {
        if(item.icon == null)
        {
            item.createInventoryIcon();
        }
        
        if(index != null)
        {
            this.items.splice(index,0,item);
        }
        else
        {
            this.items.push(item);
        }
        
        if(redrawIcons != false)
        {
            this.organizeIcons();
        }
    },
    
    removeItem: function(item,redrawIcons)
    {
        this.items.splice(this.items.indexOf(item),1);
        if(currentState.cursor.item == item)
        {
            currentState.cursor.setItem(null);
        }
        if(redrawIcons != false)
        {
            this.organizeIcons();
        }
    },
    
    organizeIcons: function()
    {
        this.iconGroup.removeAll();
        for(var i = 0; i < this.items.length; i++)
        {
            var item = this.items[i];
            var column = i % this.columns;
            var row = Math.floor(i / 4);
        
            item.hide();
            item.icon.x = this.background.x - this.background.width/2 + this.borderThickness + column * Adventurous.Constants.INVENTORY_ITEM_SIZE;
            item.icon.y = this.background.y - this.background.height/2 + this.borderThickness + row * Adventurous.Constants.INVENTORY_ITEM_SIZE;
            item.icon.visible = this.background.visible;
            this.iconGroup.add(item.icon);
        }
    },
    
    mouseDown: function(pointer)
    {
        if(!this.isMouseInInventory())
        {
            this.toggleInventory();
        }
        else
        {
            if(pointer.button == Adventurous.Constants.LMB)
            {
                if(this.itemUnderMouse != null)
                {
                    if(currentState.cursor.item != null)
                    {
                        this.combineItems();
                    }
                    else
                    {
                        currentState.cursor.setItem(this.itemUnderMouse);
                    }
                }
            }
            else if(pointer.button == Adventurous.Constants.RMB)
            {
                if(currentState.cursor.item != null)
                {
                    currentState.cursor.setItem(null);
                }
                else if(this.itemUnderMouse != null)
                {
                    this.stopTalking();
                    this.say(this.itemUnderMouse.observations.next());
                }
            }
        }
    },
    
    getItemUnderMouse: function()
    {
        this.itemUnderMouse = null;
        for(var i = 0; i < this.items.length; i++)
        {
            if(Phaser.Rectangle.contains(this.items[i].icon.body,game.input.mousePointer.x,game.input.mousePointer.y))
            {
                this.itemUnderMouse = this.items[i];
            }
        }
    },
    
    hasItem: function(name)
    {
        for(var i = 0; i < this.items.length; i++)
        {
            if(name == this.items[i].name)
            {
                return true;
            }
        }
        return false;
    },
    
    combineItems: function()
    {
        if(this.itemUnderMouse != null && currentState.cursor.item != null && this.itemUnderMouse != currentState.cursor.item)
        {
            var combination = Adventurous.combinations[this.itemUnderMouse.name];
            if(combination != null && combination[currentState.cursor.item.name] != null)
            {
                var combinationWithItem = combination[currentState.cursor.item.name];
                if(combinationWithItem.result != null)
                {
                    var resultItem = Adventurous.thingsMap[combinationWithItem.result];
                    this.addItem(resultItem,this.items.indexOf(this.itemUnderMouse),false);
                    this.removeItem(this.itemUnderMouse,false);
                    this.removeItem(currentState.cursor.item,false);
                    this.itemUnderMouse = null;
                    currentState.cursor.setItem(null);
                    this.organizeIcons();
                    this.itemUnderMouse = resultItem;
                    this.itemUnderMouse.icon.body.x = this.itemUnderMouse.icon.x;
                    this.itemUnderMouse.icon.body.y = this.itemUnderMouse.icon.y;
                }
                
                if(combinationWithItem.speech != null)
                {
                    this.say(Adventurous.speeches[combinationWithItem.speech]);
                }
            }
            else
            {
                this.say(Adventurous.speeches["default_no_use"]);
            }
        }
    },
    
    say: function(speech)
    {
        this.talking = true;
        this.currentSpeech = speech;
        this.setLabelText('\"'+speech.text+'\"');
        this.positionLabel();
        this.label.visible = true;
        speech.audio.play();
        speech.audio.startTime = game.time.now;
    },
    
    stopTalking: function()
    {
        this.talkTime = 0;
        if(this.currentSpeech)
        {
            this.currentSpeech.audio.stop();
        }
        this.talking = false;
        this.label.visible = false;
    },
    
    setLabelText: function(text)
    {
        this.label.getAt(0).setText(text);
        this.label.getAt(1).setText(text);
    },
    
    setLabelUseText: function(withItem)
    {
        this.setLabelText(this.itemUnderMouse.interactions.getUseText(withItem));
    },
    
    positionLabel: function()
    {
        this.label.x = Math.floor(Math.min(this.background.body.x+this.background.width-this.label.getAt(0).width/2,
                                Math.max(this.background.body.x+this.label.getAt(0).width/2, this.itemUnderMouse.icon.body.center.x)));
        this.label.y = Math.floor(this.itemUnderMouse.icon.body.y - this.label.getAt(0).height * 1.25);
    },
    
    isMouseInInventory: function()
    {
        var cursorWidth = 0;
        var cursorHeight = 0;
        if(currentState.cursor.item != null)
        {
            cursorWidth = currentState.cursor.sprite.width;
            cursorHeight = currentState.cursor.sprite.height;
        }
        var rect = new Phaser.Rectangle(this.background.body.x+Adventurous.Constants.INVENTORY_MARGIN,
                                        this.background.body.y+Adventurous.Constants.INVENTORY_MARGIN,
                                        this.background.body.width-Adventurous.Constants.INVENTORY_MARGIN*2-cursorWidth,
                                        this.background.body.height-Adventurous.Constants.INVENTORY_MARGIN*2-cursorHeight);
        return (Phaser.Rectangle.contains(rect,game.input.mousePointer.x,game.input.mousePointer.y));
    },
    
    toSaveObject: function()
    {
        var obj = {};
        obj.items = new Array();
        for(var i = 0; i < this.items.length; i++)
        {
            obj.items[i] = this.items[i].name;
        }
        return obj;
    },
    
    loadFromObject: function(obj)
    {
        this.items = new Array();
        for(var i = 0; i < obj.items.length; i++)
        {
            this.addItem(Adventurous.thingsMap[obj.items[i]],null,false);
        }
        this.organizeIcons();
    }
};
